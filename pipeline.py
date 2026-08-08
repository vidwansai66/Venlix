import asyncio
import json
from delivery_agent.graph import create_delivery_graph
from delivery_agent.state import DeliveryCase
from delivery_agent.llm_manager.copilot import get_deliveries

def map_ml_to_delivery_case(ml_data: dict, index: int) -> DeliveryCase:
    return {
        "delivery_id": ml_data.get("delivery_id", f"DEL-{ml_data.get('id', index)}"),
        "customer_id": ml_data.get("customer", {}).get("customer_id", f"CUST-00{ml_data.get('id', index)}"),
        "driver_id": ml_data.get("driver", {}).get("driver_id", f"DRV-00{ml_data.get('id', index)}"),
        "risk_score": ml_data.get("risk_score", 0.0),
        "risk_reason": [rf.get("reason", "") for rf in ml_data.get("risk_factors", [])],
        "failure_type": None,
        "store_location": ml_data.get("store"),
        "drop_location": ml_data.get("drop"),
        "driver": ml_data.get("driver"),
        "customer": ml_data.get("customer"),
        "environment": ml_data.get("environment"),
        "risk_factors": ml_data.get("risk_factors"),
        "ai_recommendation": ml_data.get("ai_recommendation"),
        "customer_context": {},
        "driver_context": {},
        "resolution_path": "",
        "customer_message": None,
        "customer_reply": None,
        "final_outcome": None,
        "savings": {},
        "status": "pending",
        "llm_metadata": None,
        "trace": []
    }

async def process_deliveries():
    print("=" * 60)
    print("STEP 4: Predict + dispatch")
    print("=" * 60)
    
    # Dynamically extract data from the backend
    try:
        backend_data = get_deliveries()
        print(f"Successfully fetched {len(backend_data)} deliveries from backend.")
    except Exception as e:
        print(f"Error fetching from backend: {e}")
        return

    # 1. Filter the high-risk deliveries
    at_risk_deliveries = [d for d in backend_data if d.get("prediction") == "Delivery Failure" or d.get("risk_score", 0) > 0.8]
    print(f"Found {len(at_risk_deliveries)} deliveries at risk out of {len(backend_data)} total.\n")
    
    graph = create_delivery_graph()
    
    # 2. Dispatch them to the Multi-agent
    for i, ml_delivery in enumerate(at_risk_deliveries):
        print(f"--- Dispatching Delivery {ml_delivery.get('id', i)} (Risk Score: {ml_delivery.get('risk_score', 0)}) ---")
        
        initial_state = map_ml_to_delivery_case(ml_delivery, i)
        
        # Run graph
        final_state = await graph.ainvoke(initial_state)
        
        print(f"\nFINAL STATUS: {final_state.get('status')}")
        print(f"FINAL OUTCOME: {final_state.get('final_outcome')}")
        print(f"RESOLUTION PATH: {final_state.get('resolution_path')}")
        
        if final_state.get("problem_prompt"):
            print(f"\n[AGENT] GENERATED PROBLEM PROMPT: '{final_state.get('problem_prompt')}'")
        if final_state.get("customer_message"):
            print(f"[LLM] DRAFTED SMS TO CUSTOMER: '{final_state.get('customer_message')}'")
        if final_state.get("customer_reply"):
            print(f"[LLM] SIMULATED CUSTOMER REPLY: '{final_state.get('customer_reply')}'")
        
        print("\nTRACE:")
        for t in final_state.get("trace", []):
            print(f"  [{t.get('node')}] {t.get('action')}")
            if "error" in t:
                print(f"      ERROR: {t['error']}")
            
        print("-" * 60 + "\n")
        
        print("STEP 9 & 10: broadcast_ws() -> Live UI Update triggered!\n")

if __name__ == "__main__":
    asyncio.run(process_deliveries())
