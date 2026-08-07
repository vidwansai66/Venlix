import logging
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any

from schemas import PredictionResponse, PredictionRequest
from fastapi.responses import JSONResponse
from services.prediction_service import predict_delivery, CategoryValidationError
from fastapi import Depends
from database import engine, Base, get_db
from sqlalchemy.orm import Session
from repositories import delivery_repo
from services.simulation_service import start_simulation, pause_simulation

# Create DB tables
Base.metadata.create_all(bind=engine)

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

@app.post("/predict", response_model=PredictionResponse)
async def predict(prediction: PredictionRequest, db: Session = Depends(get_db)):
    logger.info("Prediction received.")
    data = prediction.model_dump()
    
    try:
        result = predict_delivery(data)
        logger.info("Prediction completed successfully. Saving to DB.")
        
        # Save to database
        delivery_repo.create_delivery(db, data, result)
        
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

@app.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db)):
    return delivery_repo.get_dashboard_stats(db)

@app.get("/deliveries")
def get_deliveries(db: Session = Depends(get_db)):
    deliveries = delivery_repo.get_deliveries(db)
    return deliveries

@app.get("/live-deliveries")
def get_live_deliveries(db: Session = Depends(get_db)):
    # Assuming active deliveries are those not in Delivered or Failed state
    from models.delivery_model import Delivery
    active = db.query(Delivery).filter(Delivery.current_status.notin_(["Delivered", "Failed"])).order_by(Delivery.created_at.desc()).limit(100).all()
    return active

@app.get("/digital-twin")
def get_digital_twin(db: Session = Depends(get_db)):
    stats = delivery_repo.get_dashboard_stats(db)
    active = get_live_deliveries(db)
    return {"stats": stats, "active_deliveries": active}

@app.get("/societies")
def get_societies():
    from services.simulation_service import SOCIETIES
    return SOCIETIES

@app.get("/drivers")
def get_drivers():
    return [
        {"id": 1, "name": "Rahul", "rating": 4.8, "reliability": 0.95, "experience": 3, "todays_failures": 0},
        {"id": 2, "name": "Vikram", "rating": 4.2, "reliability": 0.82, "experience": 1, "todays_failures": 1},
        {"id": 3, "name": "Amit", "rating": 4.9, "reliability": 0.99, "experience": 5, "todays_failures": 0},
    ]

@app.get("/deliveries/{id}")
def get_delivery(id: int, db: Session = Depends(get_db)):
    delivery = delivery_repo.get_delivery_by_id(db, id)
    if not delivery:
        raise HTTPException(status_code=404, detail="Delivery not found")
    return delivery

@app.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):
    return delivery_repo.get_chart_analytics(db)

@app.post("/reset")
def reset_demo(db: Session = Depends(get_db)):
    delivery_repo.reset_database(db)
    return {"message": "Demo data reset successfully"}

@app.post("/simulation/start")
def sim_start():
    start_simulation()
    return {"status": "started"}

@app.post("/simulation/pause")
def sim_pause():
    pause_simulation()
    return {"status": "paused"}

@app.post("/simulation/reset")
def sim_reset(db: Session = Depends(get_db)):
    pause_simulation()
    delivery_repo.reset_database(db)
    return {"status": "reset"}