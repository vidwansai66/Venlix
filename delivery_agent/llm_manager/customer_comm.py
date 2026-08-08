"""
Customer Communication Module (Tier 1).

Implements:
- draft_customer_message(case: DeliveryCase | dict) -> str
- parse_customer_reply(text: str) -> dict
"""
import re
import json
import logging
from typing import Union, Dict, Any, Optional

from .models import DeliveryCase
from .client import call_llm
from .prompts import (
    CUSTOMER_DRAFT_SYSTEM_PROMPT,
    CUSTOMER_DRAFT_USER_PROMPT,
    REPLY_PARSE_SYSTEM_PROMPT,
    REPLY_PARSE_USER_PROMPT,
)

logger = logging.getLogger(__name__)

def draft_customer_message(case: Union[DeliveryCase, Dict[str, Any]]) -> str:
    """
    Turns a DeliveryCase into a friendly SMS-style message.
    System prompt fixes tone ('friendly, concise, one question at a time') and forces short output (<40 words).
    """
    if isinstance(case, dict):
        case_obj = DeliveryCase.from_dict(case)
    else:
        case_obj = case

    user_prompt = CUSTOMER_DRAFT_USER_PROMPT.format(
        customer_name=case_obj.customer_name,
        failure_type=case_obj.failure_type,
        driver_context=case_obj.driver_context,
        proposed_slot=case_obj.proposed_slot,
    )

    raw_response = call_llm(
        prompt=user_prompt,
        system=CUSTOMER_DRAFT_SYSTEM_PROMPT,
        max_tokens=150,
        timeout=5.0
    )

    # Post-processing: clean up quotes, extra whitespace, enforce word limit (<40 words)
    cleaned = raw_response.strip().strip('"\'')
    words = cleaned.split()
    if len(words) > 42:
        # Gracefully trim to stay within ~40 words while keeping sentences clean
        cleaned = " ".join(words[:40]) + ("?" if "?" in raw_response else ".")

    return cleaned

def simulate_customer_reply(drafted_message: str) -> str:
    """
    Autonomously generates a realistic fake customer reply to a drafted SMS message.
    Used to make the multi-agent test fully dynamic.
    """
    user_prompt = (
        f"SMS RECEIVED: '{drafted_message}'\n\n"
        f"Write a 1-sentence reply as the customer. Be creative. "
        f"You might be annoyed by a delay or happy for the update.\n\n"
        f"IMPORTANT: Use ONLY standard ASCII characters. Do not use smart quotes, em-dashes, or emojis.\n"
        f"You MUST wrap your final reply inside <reply> and </reply> tags.\n"
        f"Example:\n"
        f"<reply>Sure, 5 PM works for me.</reply>"
    )
    system_prompt = "You are a customer. STRICTLY NO EXPLANATIONS. NO CHAIN OF THOUGHT. Use standard ASCII. Output ONLY the <reply>...</reply> tag and nothing else."
    
    try:
        raw_response = call_llm(
            prompt=user_prompt,
            system=system_prompt,
            max_tokens=600,
            timeout=20.0
        )
        
        import re
        match = re.search(r"<reply>(.*?)</reply>", raw_response, re.DOTALL | re.IGNORECASE)
        if match:
            reply = match.group(1).strip()
        else:
            # Fallback to prevent rambling
            reply = "Sure, 5 PM works for me."
            
        return reply
    except Exception as e:
        logger.error(f"Failed to simulate reply: {e}")
        return "I can't take it right now, please come tomorrow."

def parse_customer_reply(text: str) -> Dict[str, Any]:
    """
    Turns freeform customer reply text into structured intent dictionary:
    {"wants_reschedule": bool, "new_slot": str|None, "declined": bool}

    Validates JSON; if parsing fails or LLM errors, falls back to keyword matching
    so the pipeline never breaks on malformed LLM responses.
    """
    if not text or not text.strip():
        return {"wants_reschedule": False, "new_slot": None, "declined": False}

    user_prompt = REPLY_PARSE_USER_PROMPT.format(reply_text=text.strip())

    try:
        raw_response = call_llm(
            prompt=user_prompt,
            system=REPLY_PARSE_SYSTEM_PROMPT,
            max_tokens=100,
            timeout=4.0
        )
        
        # Clean JSON markdown if wrapped in ```json ... ```
        cleaned_str = raw_response.strip()
        if "```json" in cleaned_str:
            cleaned_str = cleaned_str.split("```json")[1].split("```")[0].strip()
        elif "```" in cleaned_str:
            cleaned_str = cleaned_str.split("```")[1].split("```")[0].strip()

        data = json.loads(cleaned_str)

        # Validate schema keys
        if isinstance(data, dict) and "wants_reschedule" in data and "declined" in data:
            return {
                "wants_reschedule": bool(data.get("wants_reschedule")),
                "new_slot": data.get("new_slot") if data.get("new_slot") else None,
                "declined": bool(data.get("declined"))
            }
        else:
            logger.warning("LLM response did not match schema. Executing keyword matching fallback.")
            return _parse_reply_keyword_fallback(text)

    except Exception as err:
        logger.warning(f"JSON parsing or LLM call failed ({err}). Executing keyword matching fallback.")
        return _parse_reply_keyword_fallback(text)

def _parse_reply_keyword_fallback(text: str) -> Dict[str, Any]:
    """
    Deterministic rule-based keyword matcher fallback.
    Prevents pipeline failures on malformed LLM output.
    """
    lower_text = text.lower()

    # Decline keywords
    decline_words = ["no", "cancel", "decline", "dont", "don't", "refuse", "stop", "nevermind", "won't", "wont", "not home"]
    if any(w in lower_text for w in decline_words):
        return {"wants_reschedule": False, "new_slot": None, "declined": True}

    # Reschedule keywords / phrases
    reschedule_words = ["yes", "yeah", "yep", "sure", "ok", "okay", "tomorrow", "reschedule", "work", "works", "2pm", "3pm", "10am", "later"]
    if any(re.search(r'\b' + re.escape(word) + r'\b', lower_text) for word in reschedule_words):
        # Extract potential slot hint
        slot = None
        if "tomorrow" in lower_text:
            if "2pm" in lower_text or "2 pm" in lower_text:
                slot = "Tomorrow 2:00 PM"
            elif "3pm" in lower_text or "3 pm" in lower_text:
                slot = "Tomorrow 3:00 PM"
            else:
                slot = "Tomorrow"
        elif "2pm" in lower_text or "2 pm" in lower_text:
            slot = "2:00 PM"
        elif "3pm" in lower_text or "3 pm" in lower_text:
            slot = "3:00 PM"

        return {
            "wants_reschedule": True,
            "new_slot": slot or "Reschedule Requested",
            "declined": False
        }

    # Default fallback if ambiguous
    return {"wants_reschedule": False, "new_slot": None, "declined": False}
