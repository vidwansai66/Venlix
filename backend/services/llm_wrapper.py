import copy
from typing import Dict, Any

def sanitize_llm_payload(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Creates a single reusable sanitization layer before every external LLM request.
    Removes PII so that external LLMs receive an anonymized payload containing only operational context.
    """
    sanitized = copy.deepcopy(payload)
    
    # Remove Customer Name to prevent direct identification of the user.
    if "name" in sanitized:
        sanitized["customer_name_placeholder"] = "{{CUSTOMER}}"
        del sanitized["name"]
        
    # Remove Phone Number as it is highly sensitive PII that can be used to contact the user.
    if "phone" in sanitized:
        del sanitized["phone"]
        
    # Remove Email as it is highly sensitive PII that can be used to identify/contact the user.
    if "email" in sanitized:
        del sanitized["email"]
        
    # Remove exact locations that compromise privacy and safety.
    # The LLM does not need exact GPS or door numbers, only area context.
    pii_location_fields = [
        "address", 
        "house_number", 
        "apartment_number", 
        "gps", 
        "gps_coordinates", 
        "exact_society_name", 
        "society"
    ]
    for field in pii_location_fields:
        if field in sanitized:
            del sanitized[field]
            
    # Operational context such as customer_id, risk_score, failure_type, 
    # area, delivery_context, weather, traffic, etc. are kept in the payload.
    
    # If predictive profiling is disabled, remove customer history from LLM context
    if sanitized.get("predictive_contact_consent") is False:
        history_fields = [
            "previous_failed_deliveries", 
            "customer_reachability_score", 
            "customer_unavailability_history", 
            "address_failure_history_rate"
        ]
        for field in history_fields:
            if field in sanitized:
                del sanitized[field]
                
    return sanitized


def restore_llm_response(response_text: str, original_payload: Dict[str, Any]) -> str:
    """
    Restores placeholders AFTER the LLM returns, before sending to SMS or UI.
    Example: 'Hello {{CUSTOMER}}' -> 'Hello Rahul'
    """
    if not response_text:
        return response_text
        
    if "name" in original_payload:
        response_text = response_text.replace("{{CUSTOMER}}", str(original_payload["name"]))
        
    return response_text


def call_llm(prompt: str, payload: Dict[str, Any]) -> str:
    """
    Wrapper for external LLM calls (e.g. Gemini client).
    Every external LLM call must pass through this to enforce privacy.
    """
    # 1. Sanitize the payload before sending
    sanitized_payload = sanitize_llm_payload(payload)
    
    # 2. (Mock) Call external LLM with the sanitized payload and prompt
    # In reality, this would be: response = gemini_client.generate(prompt, context=sanitized_payload)
    customer_placeholder = sanitized_payload.get("customer_name_placeholder", "{{CUSTOMER}}")
    mock_llm_response = f"Hello {customer_placeholder}, your delivery in area '{sanitized_payload.get('area', 'Unknown')}' is facing a delay."
    
    # 3. Restore the customer placeholders before returning to the system
    final_restored_response = restore_llm_response(mock_llm_response, payload)
    
    # 4. Log the action
    case_id = payload.get("id") or payload.get("case_id")
    if case_id:
        from database import SessionLocal
        from schemas import AgentLogCreate
        from crud import create_agent_log
        
        db = SessionLocal()
        try:
            log_data = AgentLogCreate(
                delivery_case_id=case_id,
                actor="llm_agent",
                action_details="Generated customer notification after PII sanitization."
            )
            create_agent_log(db, log_data)
        finally:
            db.close()
    
    return final_restored_response
