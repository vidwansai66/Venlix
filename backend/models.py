from sqlalchemy import Column, Integer, Float, String, DateTime
from datetime import datetime

from database import Base


class Delivery(Base):
    __tablename__ = "deliveries"

    id = Column(Integer, primary_key=True, index=True)

    Agent_Age = Column(Integer)
    Agent_Rating = Column(Float)

    Store_Latitude = Column(Float)
    Store_Longitude = Column(Float)
    Drop_Latitude = Column(Float)
    Drop_Longitude = Column(Float)

    Weather = Column(Integer)
    Traffic = Column(Integer)
    Vehicle = Column(Integer)
    Area = Column(Integer)
    Category = Column(Integer)

    Delivery_Time = Column(Integer)

    pin_code = Column(Integer)

    driver_on_time_rate = Column(Float)
    customer_unavailability_history = Column(Float)
    address_failure_history_rate = Column(Float)

    order_value = Column(Integer)
    slot_width_minutes = Column(Integer)

    distance_km = Column(Float)

    risk_score = Column(Float)

    day_of_week = Column(Integer)
    month = Column(Integer)
    is_weekend = Column(Integer)

    pickup_delay_minutes = Column(Float)
    hour_of_day = Column(Integer)

    prediction = Column(String)

    confidence = Column(Float)

    created_at = Column(DateTime, default=datetime.utcnow)