from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

import models
from database import get_db

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


@router.get("/")
def get_report(db: Session = Depends(get_db)):

    total_predictions = db.query(models.Delivery).count()

    delivery_failures = (
        db.query(models.Delivery)
        .filter(models.Delivery.prediction == "Delivery Failure")
        .count()
    )

    delivery_success = (
        db.query(models.Delivery)
        .filter(models.Delivery.prediction == "Delivery Successful")
        .count()
    )

    average_confidence = (
        db.query(func.avg(models.Delivery.confidence))
        .scalar()
    )

    failure_rate = 0

    if total_predictions > 0:
        failure_rate = round(
            (delivery_failures / total_predictions) * 100,
            2
        )

    return {

        "total_predictions": total_predictions,

        "delivery_failures": delivery_failures,

        "delivery_success": delivery_success,

        "failure_rate": f"{failure_rate}%",

        "average_confidence": round(
            average_confidence or 0,
            4
        )

    }