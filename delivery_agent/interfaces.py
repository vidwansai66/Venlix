import asyncio
from typing import Dict, Any
from .state import DeliveryCase

# Backend & ML Stubs
from .llm_manager.customer_comm import draft_customer_message as llm_draft
from .llm_manager.customer_comm import parse_customer_reply as llm_parse
from .llm_manager.customer_comm import simulate_customer_reply as llm_simulate

async def get_delivery_context(delivery_id: str) -> Dict[str, Any]:
    """Stub for Backend DB read to fetch context."""
    return {
        "customer_context": {"unavailability_rate": 0.15, "past_notes": ["gate code 1234"]},
        "driver_context": {"on_time_rate": 0.88, "lat": 12.9716, "lng": 77.5946}
    }

async def analyze_risk_heuristics(state: DeliveryCase) -> str:
    """
    Simulated LLM Reasoning Agent (now uses the rich risk_factors array from the new ML payload).
    """
    risk_factors = state.get("risk_factors") or []
    
    # Analyze the explicit risk factors provided by ML model
    for rf in risk_factors:
        factor = rf.get("factor", "").lower()
        severity = rf.get("severity", "").lower()
        
        if severity == "high" or severity == "critical":
            if "traffic" in factor or "weather" in factor or "driver" in factor:
                return "driver_delay"
            if "customer" in factor or "availability" in factor:
                return "customer_unavailable"
            if "distance" in factor or "fraud" in factor:
                return "fraud"
                
    # Default fallback
    return "driver_delay"

async def write_agent_log(case: DeliveryCase) -> None:
    """Stub for DB write."""
    await asyncio.sleep(0.1)

async def broadcast_ws(event: Dict[str, Any]) -> None:
    """Stub for WebSocket push to frontend."""
    await asyncio.sleep(0.05)

# ---------------------------------------------------------------------------
# LLM Manager Integrated Methods
# ---------------------------------------------------------------------------

from .llm_manager.client import call_llm

async def ask_llm_manager(prompt: str, system_prompt: str = None) -> str:
    """Generic wrapper for an agent node to ask the LLM Manager directly."""
    try:
        # call_llm is synchronous, so we run it in a thread or just call it directly for this demo
        return call_llm(prompt=prompt, system=system_prompt, max_tokens=600, timeout=20.0)
    except Exception as e:
        return f"Error contacting LLM: {str(e)}"

async def simulate_customer_reply(drafted_message: str) -> str:
    """Uses the LLM to generate a fake customer reply."""
    try:
        return llm_simulate(drafted_message)
    except Exception:
        return "I am not available today, sorry."

async def draft_customer_message(case: DeliveryCase) -> str:
    """Uses the hackathon llm_manager to draft an SMS."""
    # Convert DeliveryCase state to a dictionary the LLM manager understands
    case_dict = {
        "customer_name": case.get("customer", {}).get("name", "Customer"),
        "failure_type": case.get("failure_type", "Issue"),
        "driver_context": f"Driver is delayed.",
        "proposed_slot": "Tomorrow at 2 PM"
    }
    
    # We call the imported LLM logic directly!
    try:
        # Since we don't have an API key, the llm_manager will fallback safely
        result = llm_draft(case_dict)
        return result
    except Exception as e:
        return f"Fallback SMS due to error: {str(e)}"

async def parse_customer_reply(text: str) -> Dict[str, Any]:
    """Uses the hackathon llm_manager to parse intent."""
    try:
        return llm_parse(text)
    except Exception:
        return {"resolution": "customer_responded", "parsed_intent": text}

async def analyze_exception_note(note: str) -> Dict[str, Any]:
    """Tier 2 stub for parsing messy driver notes."""
    await asyncio.sleep(0.5)
    return {"structured_note": "parsed exception"}
