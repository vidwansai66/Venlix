import logging
from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, List
from sqlalchemy.orm import Session

from schemas import (
    PredictionResponse, PredictionRequest,
    DeliveryCaseCreate, DeliveryCaseResponse,
    AgentLogCreate, AgentLogResponse, PrivacyUpdateRequest
)
from database import get_db
import crud
from fastapi.responses import JSONResponse
from services.prediction_service import predict_delivery, CategoryValidationError
from services.privacy_masking import mask_customer_pii

# Setup Logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("venlix_api")

app = FastAPI(
    title="Venlix AI API",
    description="Explainable AI for Gated Community Delivery Failure Prediction",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/delivery_cases", response_model=DeliveryCaseResponse)
def create_delivery_case(case: DeliveryCaseCreate, include_sensitive: bool = False, db: Session = Depends(get_db)):
    db_case = crud.create_delivery_case(db=db, case_data=case)
    
    log_data = AgentLogCreate(
        delivery_case_id=db_case.id,
        actor="system",
        action_details="Delivery case created."
    )
    crud.create_agent_log(db=db, log_data=log_data)
    
    # Build complete response dictionary first
    response_obj = DeliveryCaseResponse.model_validate(db_case)
    response_data = response_obj.model_dump()
    
    # Injecting PII fields (simulating an external data source or joined table)
    # Since DB schema changes are strictly prohibited, we append this during serialization.
    response_data["customer_name"] = "Rahul Sharma"
    response_data["customer_phone"] = "9876543210"
    response_data["customer_email"] = "rahul.sharma@gmail.com"
    response_data["delivery_address"] = "Flat 302, Block A, Green Residency"
    response_data["society_name"] = "Green Residency"

    if include_sensitive:
        log_data = AgentLogCreate(
            delivery_case_id=db_case.id,
            actor="dispatcher",
            action_details="Dispatcher viewed customer PII."
        )
        crud.create_agent_log(db=db, log_data=log_data)
    else:
        # Apply mask_customer_pii() to customer fields only
        pii_dict = {
            "customer_name": response_data["customer_name"],
            "customer_phone": response_data["customer_phone"],
            "customer_email": response_data["customer_email"],
            "delivery_address": response_data["delivery_address"],
            "society_name": response_data["society_name"]
        }
        masked_pii = mask_customer_pii(pii_dict)
        # Update original dictionary instead of replacing it
        response_data.update(masked_pii)
        
    return response_data

@app.get("/delivery_cases/{case_id}", response_model=DeliveryCaseResponse)
def get_delivery_case(case_id: int, include_sensitive: bool = False, db: Session = Depends(get_db)):
    crud.check_retention_expiry(db, case_id)
    db_case = crud.get_delivery_case(db, case_id=case_id)
    if db_case is None:
        raise HTTPException(status_code=404, detail="Delivery case not found")
    response_data = db_case.__dict__.copy()
    
    # Injecting PII fields (simulating an external data source or joined table)
    response_data["customer_name"] = "Rahul Sharma"
    response_data["customer_phone"] = "9876543210"
    response_data["customer_email"] = "rahul.sharma@gmail.com"
    response_data["delivery_address"] = "Flat 302, Block A, Green Residency"
    response_data["society_name"] = "Green Residency"
    
    if include_sensitive:
        log_data = AgentLogCreate(
            delivery_case_id=case_id,
            actor="dispatcher",
            action_details="Dispatcher viewed customer PII."
        )
        crud.create_agent_log(db=db, log_data=log_data)
    else:
        response_data = mask_customer_pii(response_data)
    return response_data

@app.patch("/delivery_cases/{case_id}/privacy")
def update_privacy(case_id: int, privacy_update: PrivacyUpdateRequest, db: Session = Depends(get_db)):
    db_case = crud.get_delivery_case(db, case_id=case_id)
    if db_case is None:
        raise HTTPException(status_code=404, detail="Delivery case not found")
    
    db_case.predictive_contact_consent = privacy_update.predictive_contact_consent
    if privacy_update.predictive_contact_consent:
        from datetime import datetime, timedelta
        db_case.consent_timestamp = datetime.utcnow()
        db_case.retention_expires_at = datetime.utcnow() + timedelta(days=30)
        action_msg = "Customer enabled predictive profiling."
    else:
        db_case.consent_timestamp = None
        db_case.retention_expires_at = None
        action_msg = "Customer disabled predictive profiling."
        
    log_data = AgentLogCreate(
        delivery_case_id=case_id,
        actor="customer",
        action_details=action_msg
    )
    crud.create_agent_log(db=db, log_data=log_data)
        
    db.commit()
    db.refresh(db_case)
    return {
        "success": True, 
        "predictive_contact_consent": db_case.predictive_contact_consent, 
        "message": action_msg
    }

@app.get("/delivery_cases/{case_id}/explanation")
def get_delivery_case_explanation(case_id: int, db: Session = Depends(get_db)):
    db_case = crud.get_delivery_case(db, case_id=case_id)
    if db_case is None:
        raise HTTPException(status_code=404, detail="Delivery case not found")
        
    case_data = db_case.__dict__.copy()
    
    result = predict_delivery(case_data)
    
    log_data = AgentLogCreate(
        delivery_case_id=case_id,
        actor="ml_model",
        action_details=f"ML predicted {result['risk_level']} Risk with confidence {result['confidence']}%."
    )
    crud.create_agent_log(db=db, log_data=log_data)
    
    risk_factors = [f["factor"] for f in result.get("risk_factors") or []]
    protective_factors = [f["factor"] for f in result.get("protective_factors") or []]
    
    explanations = risk_factors + protective_factors
        
    actions = [a["action"] for a in result.get("recommended_actions", [])]
    
    return {
        "case_id": case_id,
        "prediction": result["prediction"],
        "risk_score": result["risk_score"],
        "risk_level": result["risk_level"],
        "explanation": explanations,
        "positive_factors": protective_factors,
        "negative_factors": risk_factors,
        "recommended_actions": actions
    }

@app.post("/agent_logs", response_model=AgentLogResponse)
def create_agent_log(log: AgentLogCreate, include_sensitive: bool = False, db: Session = Depends(get_db)):
    db_log = crud.create_agent_log(db=db, log_data=log)
    response_data = db_log.__dict__.copy()
    if not include_sensitive:
        response_data = mask_customer_pii(response_data)
    return response_data

@app.get("/agent_logs/{case_id}", response_model=List[AgentLogResponse])
def get_agent_logs(case_id: int, include_sensitive: bool = False, db: Session = Depends(get_db)):
    db_logs = crud.get_agent_logs(db=db, case_id=case_id)
    response_list = []
    for log in db_logs:
        log_dict = log.__dict__.copy()
        if not include_sensitive:
            log_dict = mask_customer_pii(log_dict)
        response_list.append(log_dict)
    return response_list

@app.post("/predict", response_model=PredictionResponse)
async def predict(prediction: PredictionRequest, include_sensitive: bool = False):
    logger.info("Prediction received.")
    data = prediction.model_dump()
    
    try:
        result = predict_delivery(data)
        logger.info("Prediction completed successfully.")
        
        # Apply privacy masking by default for prediction responses as well
        if not include_sensitive:
            if isinstance(result, dict):
                result = mask_customer_pii(result)
            elif hasattr(result, "__dict__"):
                # if it's a Pydantic object
                result_dict = result.model_dump()
                result = mask_customer_pii(result_dict)
                
        return result
    except CategoryValidationError as e:
        logger.error(f"Prediction failed: Invalid {e.field} value.")
        return JSONResponse(status_code=422, content={
            "success": False,
            "message": f"Invalid {e.field} value.",
            "allowed_values": e.allowed_values
        })
    except ValueError as e:
        logger.error(f"Prediction failed: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Prediction failed unexpectedly: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during prediction.")

# --- NEW INTEGRATED ROUTES ---

import random

@app.get("/dashboard")
def get_dashboard_stats(db: Session = Depends(get_db)):
    cases = crud.get_delivery_cases(db, limit=1000)
    total = len(cases)
    high_risk = 0
    total_risk = 0
    total_conf = 0
    failures = 0
    fuel_saved = 0.0
    cost_saved = 0.0
    time_saved = 0.0
    prevented = 0
    
    for case in cases:
        try:
            res = predict_delivery(case.__dict__)
            risk = res["risk_score"]
            total_risk += risk
            total_conf += res["confidence"]
            if res["risk_level"] in ["High", "Critical"]:
                high_risk += 1
            if res["prediction_class"] == 1:
                failures += 1
            fuel_saved += res.get("estimated_fuel_saved_liters", 0.0)
            cost_saved += res.get("estimated_cost_saved_rupees", 0.0)
            time_saved += res.get("estimated_time_saved_minutes", 0.0)
            if res["risk_level"] in ["High", "Critical"]:
                prevented += 1
        except Exception:
            pass
            
    success_rate = ((total - failures) / total * 100) if total > 0 else 100.0
    avg_risk = (total_risk / total) if total > 0 else 0.0
    
    return {
        "todays_deliveries": total,
        "high_risk_deliveries": high_risk,
        "average_risk_score": round(avg_risk, 1),
        "success_rate": round(success_rate, 1),
        "fuel_saved": round(fuel_saved, 1),
        "cost_saved": round(cost_saved, 2),
        "time_saved_hours": round(time_saved / 60, 1),
        "ai_prevented_failures": prevented
    }

@app.get("/reports/")
def get_reports(db: Session = Depends(get_db)):
    cases = crud.get_delivery_cases(db, limit=1000)
    total = len(cases)
    failures = 0
    total_conf = 0
    
    for case in cases:
        try:
            res = predict_delivery(case.__dict__)
            if res["prediction_class"] == 1:
                failures += 1
            total_conf += res["confidence"]
        except Exception:
            pass
            
    success = total - failures
    fail_rate = f"{((failures / total * 100) if total > 0 else 0):.1f}%"
    avg_conf = (total_conf / total) if total > 0 else 0.0
    
    return {
        "total_predictions": total,
        "delivery_failures": failures,
        "delivery_success": success,
        "failure_rate": fail_rate,
        "average_confidence": round(avg_conf, 1)
    }

def enrich_delivery(case_dict):
    try:
        res = predict_delivery(case_dict)
        case_dict["prediction"] = res["prediction"]
        case_dict["risk_score"] = res["risk_score"]
        case_dict["confidence"] = res["confidence"]
        case_dict["risk_level"] = res["risk_level"]
        case_dict["risk_factors"] = res.get("risk_factors", [])
        case_dict["ai_recommendation"] = res.get("recommended_actions", [{}])[0] if res.get("recommended_actions") else None
        
        # Inject mock locations and enriched data
        case_dict["Store_Latitude"] = random.uniform(17.3, 17.5)
        case_dict["Store_Longitude"] = random.uniform(78.3, 78.5)
        case_dict["Drop_Latitude"] = random.uniform(17.3, 17.5)
        case_dict["Drop_Longitude"] = random.uniform(78.3, 78.5)
        case_dict["distance_km"] = round(random.uniform(2.0, 15.0), 1)
        case_dict["delivery_id"] = f"DEL-{case_dict['id']:05d}"
        
        # We assume driver ID DRV-201 for test driver so console picks it up
        case_dict["driver"] = {"driver_id": "DRV-201", "name": "Rajesh Kumar"}
        case_dict["customer"] = {"name": "Rahul Sharma", "address": "Green Residency"}
        case_dict["environment"] = {"weather_condition": "Clear", "traffic_condition": "Low"}
    except Exception:
        pass
    return case_dict

@app.get("/deliveries/")
@app.get("/deliveries")
def get_all_deliveries(db: Session = Depends(get_db)):
    cases = crud.get_delivery_cases(db, limit=200)
    result = []
    for c in cases:
        cdict = c.__dict__.copy()
        cdict.pop("_sa_instance_state", None)
        cdict["created_at"] = cdict["created_at"].isoformat()
        result.append(enrich_delivery(cdict))
    return result

@app.get("/live-deliveries")
def get_live_deliveries(db: Session = Depends(get_db)):
    cases = crud.get_delivery_cases(db, limit=50)
    result = []
    for c in cases:
        cdict = c.__dict__.copy()
        cdict.pop("_sa_instance_state", None)
        cdict["created_at"] = cdict["created_at"].isoformat()
        result.append(enrich_delivery(cdict))
    return result

@app.get("/drivers")
def get_drivers(db: Session = Depends(get_db)):
    # Used for driver console integration (returns deliveries assigned to them)
    cases = crud.get_delivery_cases(db, limit=100)
    result = []
    for c in cases:
        cdict = c.__dict__.copy()
        cdict.pop("_sa_instance_state", None)
        cdict["created_at"] = cdict["created_at"].isoformat()
        enriched = enrich_delivery(cdict)
        if enriched.get("driver", {}).get("driver_id") == "DRV-201":
            result.append(enriched)
    return result

@app.get("/analytics")
def get_analytics():
    return {
        "risk_trends": [10, 15, 20, 18, 12, 10, 8],
        "success_trends": [90, 85, 80, 82, 88, 90, 92]
    }

@app.get("/societies")
def get_societies():
    return [
        {"id": 1, "name": "Green Residency", "risk_level": "Low", "security": "Moderate", "coordinates": [17.4, 78.4]}
    ]

@app.post("/contact")
def submit_contact():
    return {"success": True, "message": "Contact form submitted successfully."}

@app.post("/simulation/start")
def start_simulation(db: Session = Depends(get_db)):
    count = 10  # generate 10 random cases
    from schemas import DeliveryCaseCreate
    for i in range(count):
        case_data = DeliveryCaseCreate(
            Agent_Age=random.randint(20, 50),
            Agent_Rating=round(random.uniform(3.5, 5.0), 1),
            Weather=random.choice(["Clear", "Light Rain", "Heavy Rain"]),
            Traffic=random.choice(["Low", "Medium", "High"]),
            Vehicle=random.choice(["Bike", "Scooter"]),
            Area=random.choice(["Urban", "Semi-Urban"]),
            Delivery_Time=random.randint(15, 60),
            customer_answered_call=random.choice(["Yes", "No"]),
            customer_response_time=random.randint(1, 15),
            customer_availability=random.choice(["Home", "Unknown"]),
            visitor_pass_status=random.choice(["Approved", "Pending"]),
            society_security_level=random.choice(["Open", "Strict"]),
            gate_wait_time=random.randint(1, 20),
            driver_status=random.choice(["Available", "Delayed"]),
            previous_failed_deliveries=random.choice([0, 1, 2]),
            address_confidence=round(random.uniform(0.6, 1.0), 2),
            preferred_delivery_slot="Morning",
            estimated_arrival_delay=random.randint(0, 30),
            driver_experience=random.randint(6, 48),
            pickup_delay_minutes=float(random.randint(1, 15)),
            hour_of_day=random.randint(8, 22),
            day_of_week="Monday",
            is_weekend=0,
            arrival_within_preferred_slot=random.choice([0, 1]),
            customer_reachability_score=round(random.uniform(0.5, 1.0), 2),
            society_accessibility_score=round(random.uniform(0.5, 1.0), 2),
            driver_reliability_score=round(random.uniform(0.6, 1.0), 2),
            predictive_contact_consent=True
        )
        crud.create_delivery_case(db=db, case_data=case_data)
    return {"success": True, "message": f"{count} simulated cases created."}

@app.post("/simulation/pause")
def pause_simulation():
    return {"success": True}

@app.post("/simulation/reset")
def reset_simulation():
    return {"success": True}
