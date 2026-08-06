from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import models
from database import get_db

router = APIRouter(
    prefix="/twin",
    tags=["Digital Twin"]
)


@router.get("/")
def get_twin_data(db: Session = Depends(get_db)):

    deliveries = db.query(models.Delivery).all()

    twin_data = []

    for delivery in deliveries:

        twin_data.append({

            "id": delivery.id,

            "store": {
                "latitude": delivery.Store_Latitude,
                "longitude": delivery.Store_Longitude
            },

            "drop": {
                "latitude": delivery.Drop_Latitude,
                "longitude": delivery.Drop_Longitude
            },

            "prediction": delivery.prediction,

            "confidence": delivery.confidence,

            "risk_score": delivery.risk_score

        })

    return twin_data