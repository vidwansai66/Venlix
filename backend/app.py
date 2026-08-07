import logging
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any

from schemas import PredictionResponse, PredictionRequest
from fastapi.responses import JSONResponse
from services.prediction_service import predict_delivery, CategoryValidationError

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
async def predict(prediction: PredictionRequest):
    logger.info("Prediction received.")
    data = prediction.model_dump()
    
    try:
        result = predict_delivery(data)
        logger.info("Prediction completed successfully.")
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