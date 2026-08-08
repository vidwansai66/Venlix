import asyncio
import json
from delivery_agent.graph import create_delivery_graph
from delivery_agent.state import DeliveryCase

TEST_DATA = [
    {   "success": True,   "prediction": "Low Risk",   "prediction_class": 0,   "risk_score": 0,   "confidence": 99,   "risk_level": "Low",   "risk_factors": [     {       "factor": "High Address Confidence",       "impact": 90     },     {       "factor": "Approved Visitor Pass",       "impact": 80     },     {       "factor": "Excellent Driver Reliability",       "impact": 73     },     {       "factor": "Customer Reachable",       "impact": 52     },     {       "factor": "Quick Customer Response",       "impact": 14     }   ],   "recommended_actions": [     {       "action": "Proceed Normally",       "priority": "Low",       "expected_improvement": 0     }   ],   "estimated_success_after_action": 99,   "estimated_time_saved_minutes": 0,   "estimated_cost_saved_rupees": 0,   "estimated_fuel_saved_liters": 0,   "model": "Venlix-XGBoost-v2",   "timestamp": "2026-08-07T06:54:46.500102Z" },
    {   "success": True,   "prediction": "Critical Risk",   "prediction_class": 1,   "risk_score": 99,   "confidence": 99,   "risk_level": "Critical",   "risk_factors": [     {       "factor": "High Gate Wait Time",       "impact": 95     },     {       "factor": "Customer Response Time",       "impact": 24     },     {       "factor": "Visitor Pass Pending",       "impact": 10     },     {       "factor": "Driver Reliability Score",       "impact": 10     },     {       "factor": "Previous Failed Deliveries",       "impact": 10     }   ],   "recommended_actions": [     {       "action": "Notify Security Gate",       "priority": "High",       "expected_improvement": 8     },     {       "action": "Request Visitor Approval",       "priority": "Medium",       "expected_improvement": 15     },     {       "action": "Monitor Delivery",       "priority": "Medium",       "expected_improvement": 10     }   ],   "estimated_success_after_action": 34,   "estimated_time_saved_minutes": 0,   "estimated_cost_saved_rupees": 0,   "estimated_fuel_saved_liters": 0,   "model": "Venlix-XGBoost-v2",   "timestamp": "2026-08-07T06:55:22.405336Z" },
    {   "success": True,   "prediction": "Critical Risk",   "prediction_class": 1,   "risk_score": 99,   "confidence": 99,   "risk_level": "Critical",   "risk_factors": [     {       "factor": "Customer Response Time",       "impact": 93     },     {       "factor": "Customer Unavailable",       "impact": 10     },     {       "factor": "Previous Failed Deliveries",       "impact": 10     },     {       "factor": "Low Address Confidence",       "impact": 10     },     {       "factor": "Driver Reliability Score",       "impact": 10     }   ],   "recommended_actions": [     {       "action": "Offer Reschedule",       "priority": "Medium",       "expected_improvement": 11     },     {       "action": "Monitor Delivery",       "priority": "Medium",       "expected_improvement": 8     },     {       "action": "Verify Address",       "priority": "Medium",       "expected_improvement": 12     }   ],   "estimated_success_after_action": 32,   "estimated_time_saved_minutes": 7,   "estimated_cost_saved_rupees": 17,   "estimated_fuel_saved_liters": 0,   "model": "Venlix-XGBoost-v2",   "timestamp": "2026-08-07T06:55:59.084239Z" },
    {   "success": True,   "prediction": "Critical Risk",   "prediction_class": 1,   "risk_score": 99,   "confidence": 99,   "risk_level": "Critical",   "risk_factors": [     {       "factor": "High Gate Wait Time",       "impact": 90     },     {       "factor": "Customer Response Time",       "impact": 47     },     {       "factor": "Previous Failed Deliveries",       "impact": 10     },     {       "factor": "Low Address Confidence",       "impact": 10     },     {       "factor": "Driver Reliability Score",       "impact": 10     }   ],   "recommended_actions": [     {       "action": "Notify Security Gate",       "priority": "High",       "expected_improvement": 10     },     {       "action": "Monitor Delivery",       "priority": "Medium",       "expected_improvement": 10     },     {       "action": "Verify Address",       "priority": "Medium",       "expected_improvement": 9     }   ],   "estimated_success_after_action": 30,   "estimated_time_saved_minutes": 8,   "estimated_cost_saved_rupees": 26,   "estimated_fuel_saved_liters": 0,   "model": "Venlix-XGBoost-v2",   "timestamp": "2026-08-07T06:56:26.284531Z" },
    {   "success": True,   "prediction": "Critical Risk",   "prediction_class": 1,   "risk_score": 99,   "confidence": 99,   "risk_level": "Critical",   "risk_factors": [     {       "factor": "Customer Response Time",       "impact": 95     },     {       "factor": "High Gate Wait Time",       "impact": 15     },     {       "factor": "Previous Failed Deliveries",       "impact": 10     },     {       "factor": "Customer Unavailable",       "impact": 10     },     {       "factor": "Visitor Pass Pending",       "impact": 10     }   ],   "recommended_actions": [     {       "action": "Notify Security Gate",       "priority": "Medium",       "expected_improvement": 10     },     {       "action": "Monitor Delivery",       "priority": "Medium",       "expected_improvement": 10     },     {       "action": "Offer Reschedule",       "priority": "Medium",       "expected_improvement": 11     },     {       "action": "Request Visitor Approval",       "priority": "Medium",       "expected_improvement": 13     }   ],   "estimated_success_after_action": 45,   "estimated_time_saved_minutes": 0,   "estimated_cost_saved_rupees": 0,   "estimated_fuel_saved_liters": 0,   "model": "Venlix-XGBoost-v2",   "timestamp": "2026-08-07T06:56:47.411824Z" }
]

def map_ml_to_delivery_case(ml_data: dict, index: int) -> DeliveryCase:
    return {
        "delivery_id": f"DEL-TEST-{index+1}",
        "customer_id": f"CUST-00{index+1}",
        "driver_id": f"DRV-00{index+1}",
        "risk_score": ml_data.get("risk_score", 0.0),
        "risk_reason": [rf.get("factor", "") for rf in ml_data.get("risk_factors", [])],
        "failure_type": None,
        "store_location": None,
        "drop_location": None,
        "driver": None,
        "customer": None,
        "environment": None,
        "risk_factors": ml_data.get("risk_factors"),
        "ai_recommendation": {"recommended_actions": ml_data.get("recommended_actions")},
        "customer_context": {},
        "driver_context": {},
        "resolution_path": "",
        "problem_prompt": None,
        "customer_message": None,
        "customer_reply": None,
        "final_outcome": None,
        "savings": {},
        "status": "pending",
        "llm_metadata": None,
        "trace": []
    }

async def main():
    print("Testing dynamic risk factor routing with NEW PREDICTION DATA...\n")
    
    backend_data = TEST_DATA
    print(f"Loaded {len(backend_data)} deliveries from mock data.")

    # Filter the high-risk deliveries
    at_risk_deliveries = [d for d in backend_data if d.get("prediction") == "Delivery Failure" or d.get("risk_score", 0) > 0.8]
    print(f"Found {len(at_risk_deliveries)} deliveries at risk out of {len(backend_data)} total.\n")
    
    app = create_delivery_graph()
    
    for i, ml_delivery in enumerate(at_risk_deliveries):
        print(f"\n{'='*50}\nRunning test for Delivery ID: DEL-TEST-{i+1}\n{'='*50}")
        
        case = map_ml_to_delivery_case(ml_delivery, i)
        
        # Run the graph
        final_state = await app.ainvoke(case)
        
        print(f"FINAL STATUS: {final_state.get('status')}")
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

if __name__ == "__main__":
    asyncio.run(main())
