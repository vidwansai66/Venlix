"""
LLM Manager Module.

Provides the single unified entry point for all LLM calls, prompts, client/fallback plumbing,
customer communication, decision summarization, and Tier-2 RAG exception analysis.
"""

from .models import DeliveryCase
from .client import call_llm, set_force_primary_failure
from .customer_comm import draft_customer_message, parse_customer_reply
from .decision import summarize_decision
from .exception_analyzer import analyze_exception_note

__all__ = [
    "call_llm",
    "set_force_primary_failure",
    "draft_customer_message",
    "parse_customer_reply",
    "summarize_decision",
    "analyze_exception_note",
    "DeliveryCase",
]
