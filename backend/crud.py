from sqlalchemy.orm import Session

import models
import schemas


# Create a new delivery record
def create_delivery(db: Session, delivery: schemas.DeliveryCreate):

    db_delivery = models.Delivery(**delivery.model_dump())

    db.add(db_delivery)
    db.commit()
    db.refresh(db_delivery)

    return db_delivery


# Get all deliveries
def get_deliveries(db: Session):

    return db.query(models.Delivery).all()


# Get delivery by ID
def get_delivery(db: Session, delivery_id: int):

    return (
        db.query(models.Delivery)
        .filter(models.Delivery.id == delivery_id)
        .first()
    )


# Update prediction result
def update_prediction(
    db: Session,
    delivery_id: int,
    prediction: str,
    confidence: float
):

    delivery = (
        db.query(models.Delivery)
        .filter(models.Delivery.id == delivery_id)
        .first()
    )

    if delivery:

        delivery.prediction = prediction
        delivery.confidence = confidence

        db.commit()
        db.refresh(delivery)

    return delivery


# Delete delivery
def delete_delivery(db: Session, delivery_id: int):

    delivery = (
        db.query(models.Delivery)
        .filter(models.Delivery.id == delivery_id)
        .first()
    )

    if delivery:
        db.delete(delivery)
        db.commit()

    return delivery