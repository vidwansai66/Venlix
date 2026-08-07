from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text
from datetime import datetime, timezone
from database import Base

class Delivery(Base):
    __tablename__ = "deliveries"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    # Real-time Tracking
    current_status = Column(String, default="Order Created")
    current_lat = Column(Float, nullable=True)
    current_lng = Column(Float, nullable=True)
    store_lat = Column(Float, nullable=True)
    store_lng = Column(Float, nullable=True)
    drop_lat = Column(Float, nullable=True)
    drop_lng = Column(Float, nullable=True)
    
    # Features
    agent_age = Column(Integer)
    agent_rating = Column(Float)
    weather = Column(String)
    traffic = Column(String)
    vehicle = Column(String)
    area = Column(String)
    delivery_time = Column(Integer)
    customer_answered_call = Column(String)
    customer_availability = Column(String)
    visitor_pass_status = Column(String)
    society_security_level = Column(String)
    gate_wait_time = Column(Integer)
    driver_status = Column(String)
    previous_failed_deliveries = Column(Integer)
    address_confidence = Column(Float)
    preferred_delivery_slot = Column(String)
    estimated_arrival_delay = Column(Integer)
    driver_experience = Column(Integer)
    pickup_delay_minutes = Column(Float)
    hour_of_day = Column(Integer)
    day_of_week = Column(String)
    is_weekend = Column(Integer)
    arrival_within_preferred_slot = Column(Integer)
    customer_reachability_score = Column(Float)
    society_accessibility_score = Column(Float)
    driver_reliability_score = Column(Float)

    # Prediction Outputs
    prediction_class = Column(Integer)
    risk_score = Column(Integer)
    risk_level = Column(String)
    confidence = Column(Integer)
    success_probability = Column(Float)
    estimated_success_after_action = Column(Integer)
    estimated_time_saved_minutes = Column(Integer)
    estimated_cost_saved_rupees = Column(Integer)
    estimated_fuel_saved_liters = Column(Float)
    
    # Complete JSON response
    json_response = Column(Text)
