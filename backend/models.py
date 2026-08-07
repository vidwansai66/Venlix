from sqlalchemy import Column, Integer, Float, String, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from database import Base

class ActorEnum(str, enum.Enum):
    system = "system"
    ml_model = "ml_model"
    llm_agent = "llm_agent"
    dispatcher = "dispatcher"
    driver = "driver"
    customer = "customer"

class DeliveryCase(Base):
    __tablename__ = "delivery_cases"

    id = Column(Integer, primary_key=True, index=True)

    # PredictionRequest fields
    Agent_Age = Column(Integer)
    Agent_Rating = Column(Float)
    Weather = Column(String)
    Traffic = Column(String)
    Vehicle = Column(String)
    Area = Column(String)
    Delivery_Time = Column(Integer)
    
    customer_answered_call = Column(String)
    customer_response_time = Column(Integer)
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

    # Privacy fields
    predictive_contact_consent = Column(Boolean, default=True)
    consent_timestamp = Column(DateTime, nullable=True)
    retention_expires_at = Column(DateTime, nullable=True)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    logs = relationship("AgentLog", back_populates="delivery_case", cascade="all, delete-orphan")

class AgentLog(Base):
    __tablename__ = "agent_logs"

    id = Column(Integer, primary_key=True, index=True)
    delivery_case_id = Column(Integer, ForeignKey("delivery_cases.id"))
    
    actor = Column(Enum(ActorEnum))
    action_details = Column(String)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    delivery_case = relationship("DeliveryCase", back_populates="logs")
