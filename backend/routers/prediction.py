from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import crud
import schemas

from database import get_db
from services.prediction_service import predict_delivery

router = APIRouter(
    prefix="/prediction",
    tags=["Prediction"]
)


@router.post("/")
def predict(
    data: schemas.DeliveryCreate,
    db: Session = Depends(get_db)
):

    # Save request in database
    delivery = crud.create_delivery(db, data)

    # ML Prediction
    result = predict_delivery(data.model_dump())

    # Update prediction in database
    crud.update_prediction(
        db=db,
        delivery_id=delivery.id,
        prediction=result["prediction"],
        confidence=result["confidence"]
    )

    return {

        "id": delivery.id,

        "delivery_failed": result["delivery_failed"],

        "prediction": result["prediction"],

        "confidence": result["confidence"]

    }