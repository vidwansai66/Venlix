"""
Tier 2: RAG Exception Analyzer.

Uses in-process ChromaDB over synthetic delivery exception notes to perform vector retrieval
of past similar cases, grounding the LLM in historical root causes and suggested solutions.
"""
import os
import sys
import site
import json
import logging

user_site = site.getusersitepackages()
if user_site not in sys.path:
    sys.path.insert(0, user_site)

from typing import Dict, Any, List

from .client import call_llm
from .prompts import (
    EXCEPTION_ANALYSIS_SYSTEM_PROMPT,
    EXCEPTION_ANALYSIS_USER_PROMPT,
)
from .synthetic_data import SYNTHETIC_EXCEPTION_NOTES

import time

logger = logging.getLogger(__name__)

_chroma_collection = None

def init_chroma_collection():
    """
    Pre-warm and initialize ChromaDB in-process collection once at startup/module load.
    Seeds collection with 60 synthetic exception notes.
    """
    global _chroma_collection
    if _chroma_collection is not None:
        return _chroma_collection

    start_t = time.perf_counter()
    try:
        import chromadb
        from chromadb.config import Settings
        
        client = chromadb.Client(Settings(anonymized_telemetry=False, is_persistent=False))
        collection = client.get_or_create_collection(name="exception_notes")

        if collection.count() == 0:
            documents = [item["note"] for item in SYNTHETIC_EXCEPTION_NOTES]
            metadatas = [
                {
                    "root_cause": item["root_cause"],
                    "suggested_solution": item["suggested_solution"],
                    "category": item["category"]
                }
                for item in SYNTHETIC_EXCEPTION_NOTES
            ]
            ids = [item["id"] for item in SYNTHETIC_EXCEPTION_NOTES]

            collection.add(
                documents=documents,
                metadatas=metadatas,
                ids=ids
            )
            elapsed_ms = (time.perf_counter() - start_t) * 1000.0
            print(f"[STARTUP] Pre-warmed ChromaDB vector store ({collection.count()} notes seeded) in {elapsed_ms:.2f} ms.")

        _chroma_collection = collection
        return _chroma_collection
    except Exception as err:
        logger.warning(f"ChromaDB initialization failed: {err}. Will use keyword-based reference retrieval.")
        return None

def get_chroma_collection():
    return init_chroma_collection()

# Pre-warm at module load
try:
    init_chroma_collection()
except Exception as e:
    logger.warning(f"Module-level ChromaDB pre-warm skipped: {e}")

def analyze_exception_note(note: str) -> Dict[str, Any]:
    print(f"[{time.strftime('%H:%M:%S')}] start")
    if not note or not note.strip():
        print(f"[{time.strftime('%H:%M:%S')}] returning (empty note)")
        return {
            "root_cause": "No exception note provided.",
            "suggested_solution": "Verify driver input and re-submit note.",
            "confidence": 0.0
        }

    # Timing Step 1: ChromaDB Vector Retrieval
    print(f"[{time.strftime('%H:%M:%S')}] before chroma embed/query")
    t_retrieval_start = time.perf_counter()
    top_references = _retrieve_top_references(note, k=3)
    t_retrieval_ms = (time.perf_counter() - t_retrieval_start) * 1000.0
    print(f"[{time.strftime('%H:%M:%S')}] after chroma query (took {t_retrieval_ms:.2f} ms)")

    # Format reference cases for prompt
    ref_text_list = []
    for idx, ref in enumerate(top_references, 1):
        ref_text_list.append(
            f"Reference Case {idx}:\n"
            f"  Driver Note: \"{ref['note']}\"\n"
            f"  Root Cause: {ref['root_cause']}\n"
            f"  Suggested Solution: {ref['suggested_solution']}\n"
        )
    reference_cases_text = "\n".join(ref_text_list)

    user_prompt = EXCEPTION_ANALYSIS_USER_PROMPT.format(
        current_note=note,
        reference_cases_text=reference_cases_text
    )

    # Timing Step 2: call_llm Generation Step (5.0s PRD timeout)
    print(f"[{time.strftime('%H:%M:%S')}] before call_llm")
    t_llm_start = time.perf_counter()
    try:
        raw_response = call_llm(
            prompt=user_prompt,
            system=EXCEPTION_ANALYSIS_SYSTEM_PROMPT,
            max_tokens=250,
            timeout=5.0
        )
        t_llm_ms = (time.perf_counter() - t_llm_start) * 1000.0
        print(f"[{time.strftime('%H:%M:%S')}] after call_llm (took {t_llm_ms:.2f} ms)")

        cleaned_str = raw_response.strip()
        if "```json" in cleaned_str:
            cleaned_str = cleaned_str.split("```json")[1].split("```")[0].strip()
        elif "```" in cleaned_str:
            cleaned_str = cleaned_str.split("```")[1].split("```")[0].strip()

        data = json.loads(cleaned_str)

        print(f"[{time.strftime('%H:%M:%S')}] returning")
        return {
            "root_cause": str(data.get("root_cause", "Unspecified root cause.")),
            "suggested_solution": str(data.get("suggested_solution", "Contact dispatch for resolution.")),
            "confidence": float(data.get("confidence", 0.85))
        }
    except Exception as err:
        t_llm_ms = (time.perf_counter() - t_llm_start) * 1000.0
        print(f"[{time.strftime('%H:%M:%S')}] after call_llm (LLM failed after {t_llm_ms:.2f} ms: {err})")
        print(f"[{time.strftime('%H:%M:%S')}] returning (heuristic fallback)")
        if top_references:
            top_ref = top_references[0]
            return {
                "root_cause": top_ref["root_cause"],
                "suggested_solution": top_ref["suggested_solution"],
                "confidence": 0.82
            }
        return {
            "root_cause": "Delivery exception requiring manual review.",
            "suggested_solution": "Contact customer via SMS and escalate to human dispatch.",
            "confidence": 0.75
        }

def _retrieve_top_references(note: str, k: int = 3) -> List[Dict[str, str]]:
    """Retrieve top-k similar historical notes from ChromaDB or keyword fallback."""
    collection = get_chroma_collection()
    
    if collection is not None:
        try:
            results = collection.query(
                query_texts=[note],
                n_results=k
            )
            retrieved = []
            if results and "documents" in results and results["documents"]:
                docs = results["documents"][0]
                metas = results["metadatas"][0] if "metadatas" in results else []
                for i in range(len(docs)):
                    meta = metas[i] if i < len(metas) else {}
                    retrieved.append({
                        "note": docs[i],
                        "root_cause": meta.get("root_cause", "Historical delivery exception."),
                        "suggested_solution": meta.get("suggested_solution", "Follow standard protocol.")
                    })
                return retrieved
        except Exception as e:
            logger.warning(f"ChromaDB query failed: {e}. Falling back to keyword match.")

    # Fallback keyword match over synthetic data if ChromaDB is unavailable
    note_lower = note.lower()
    scored_notes = []
    for item in SYNTHETIC_EXCEPTION_NOTES:
        item_words = set(item["note"].lower().split())
        query_words = set(note_lower.split())
        overlap = len(item_words.intersection(query_words))
        scored_notes.append((overlap, item))

    scored_notes.sort(key=lambda x: x[0], reverse=True)
    return [
        {
            "note": item["note"],
            "root_cause": item["root_cause"],
            "suggested_solution": item["suggested_solution"]
        }
        for _, item in scored_notes[:k]
    ]
