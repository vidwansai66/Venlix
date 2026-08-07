from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional

class RiskFactor(BaseModel):
    factor: str = Field(..., description="The name of the feature contributing to the risk.")
    impact: int = Field(..., description="Impact score between 0 and 100.")

class RecommendedAction(BaseModel):
    action: str = Field(..., description="The recommended action to mitigate risk.")
    priority: str = Field(..., description="Priority level: High, Medium, Low")
    expected_improvement: int = Field(..., description="Expected increase in success probability.")

class PredictionRequest(BaseModel):
    Agent_Age: int = Field(30, description="Age of the delivery agent", ge=18, le=65)
    Agent_Rating: float = Field(4.5, description="Agent rating", ge=1.0, le=5.0)
    Weather: str = Field("Clear", description="Weather condition (e.g. Clear, Light Rain, Heavy Rain, Storm, Flooding)")
    Traffic: str = Field("Low", description="Traffic level (e.g. Low, Medium, High)")
    Vehicle: str = Field("Bike", description="Vehicle type (e.g. Bike, Scooter, Car)")
    Area: str = Field("Urban", description="Delivery area (e.g. Urban, Semi-Urban, Metropolitan, Rural)")
    Delivery_Time: int = Field(30, description="Expected delivery time in minutes")
    
    customer_answered_call: str = Field("Yes", description="Did the customer answer the call? (Yes/No)")
    customer_response_time: int = Field(5, description="Response time in minutes")
    customer_availability: str = Field("Home", description="Customer availability (e.g. Home, Office, Travelling, Unknown)")
    visitor_pass_status: str = Field("Approved", description="Visitor pass status (e.g. Approved, Pending, Rejected)")
    society_security_level: str = Field("Moderate", description="Society security level (e.g. Open, Moderate, Strict)")
    gate_wait_time: int = Field(5, description="Gate wait time in minutes")
    driver_status: str = Field("Available", description="Driver status (e.g. Available, Delayed, Accident, Medical Emergency)")
    previous_failed_deliveries: int = Field(0, description="Number of previous failed deliveries")
    address_confidence: float = Field(0.9, description="Confidence in the delivery address (0.0 to 1.0)")
    preferred_delivery_slot: str = Field("Morning", description="Preferred delivery slot (e.g. Morning, Afternoon, Evening)")
    estimated_arrival_delay: int = Field(0, description="Estimated arrival delay in minutes")
    driver_experience: int = Field(24, description="Driver experience in months")
    
    pickup_delay_minutes: float = Field(5.0, description="Pickup delay in minutes")
    hour_of_day: int = Field(14, description="Hour of the day (0-23)")
    day_of_week: str = Field("Monday", description="Day of the week (e.g. Monday, Tuesday, etc.)")
    is_weekend: int = Field(0, description="Is it a weekend? (0=No, 1=Yes)")
    arrival_within_preferred_slot: int = Field(1, description="Will arrive in preferred slot? (0=No, 1=Yes)")
    customer_reachability_score: float = Field(0.9, description="Customer reachability score")
    society_accessibility_score: float = Field(0.85, description="Society accessibility score")
    driver_reliability_score: float = Field(0.95, description="Driver reliability score")

    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "Agent_Age": 32, "Agent_Rating": 4.8, "Weather": "Clear", "Traffic": "Low",
                    "Vehicle": "Bike", "Area": "Urban", "Delivery_Time": 20, 
                    "customer_answered_call": "Yes", "customer_response_time": 2, "customer_availability": "Home",
                    "visitor_pass_status": "Approved", "society_security_level": "Open", "gate_wait_time": 2,
                    "driver_status": "Available", "previous_failed_deliveries": 0, "address_confidence": 0.99,
                    "preferred_delivery_slot": "Afternoon", "estimated_arrival_delay": 0, "driver_experience": 36,
                    "pickup_delay_minutes": 2.0, "hour_of_day": 14, "day_of_week": "Tuesday", "is_weekend": 0,
                    "arrival_within_preferred_slot": 1, "customer_reachability_score": 0.98,
                    "society_accessibility_score": 0.95, "driver_reliability_score": 0.99
                },
                {
                    "Agent_Age": 25, "Agent_Rating": 3.5, "Weather": "Heavy Rain", "Traffic": "High",
                    "Vehicle": "Scooter", "Area": "Rural", "Delivery_Time": 50, 
                    "customer_answered_call": "No", "customer_response_time": 15, "customer_availability": "Unknown",
                    "visitor_pass_status": "Pending", "society_security_level": "Strict", "gate_wait_time": 15,
                    "driver_status": "Delayed", "previous_failed_deliveries": 2, "address_confidence": 0.6,
                    "preferred_delivery_slot": "Morning", "estimated_arrival_delay": 30, "driver_experience": 6,
                    "pickup_delay_minutes": 20.0, "hour_of_day": 20, "day_of_week": "Saturday", "is_weekend": 1,
                    "arrival_within_preferred_slot": 0, "customer_reachability_score": 0.4,
                    "society_accessibility_score": 0.5, "driver_reliability_score": 0.7
                }
            ]
        }
    )

class PredictionResponse(BaseModel):
    success: bool = Field(..., description="Whether the prediction was successful")
    prediction: str = Field(..., description="Prediction text (e.g., Low Risk, Critical Risk)")
    prediction_class: int = Field(..., description="Binary classification (0 or 1)")
    risk_score: int = Field(..., description="Calculated risk score (0-100)")
    confidence: int = Field(..., description="Model confidence percentage (0 to 100)")
    risk_level: str = Field(..., description="Categorized risk level (Low, Medium, High, Critical)")
    risk_factors: Optional[List[RiskFactor]] = Field(None, description="Top contributing factors to the risk")
    protective_factors: Optional[List[RiskFactor]] = Field(None, description="Top protective factors")
    recommended_actions: List[RecommendedAction] = Field(..., description="AI generated recommended actions")
    estimated_success_after_action: int = Field(..., description="Expected success chance if actions are taken")
    estimated_time_saved_minutes: int = Field(..., description="Time saved in minutes")
    estimated_cost_saved_rupees: int = Field(..., description="Cost saved in rupees")
    estimated_fuel_saved_liters: float = Field(..., description="Fuel saved in liters")
    model: str = Field(..., description="Model used for prediction")
    timestamp: str = Field(..., description="ISO 8601 timestamp of the prediction")

    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "success": True,
                    "prediction": "High Risk",
                    "prediction_class": 1,
                    "risk_score": 84,
                    "confidence": 93,
                    "risk_level": "High",
                    "risk_factors": [
                        {"factor": "Visitor Pass Pending", "impact": 91},
                        {"factor": "Customer Not Reachable", "impact": 86},
                        {"factor": "Heavy Traffic", "impact": 73}
                    ],
                    "recommended_actions": [
                        {"action": "Request Visitor Approval", "priority": "High", "expected_improvement": 22},
                        {"action": "Call Customer", "priority": "High", "expected_improvement": 18}
                    ],
                    "estimated_success_after_action": 95,
                    "estimated_time_saved_minutes": 18,
                    "estimated_cost_saved_rupees": 110,
                    "estimated_fuel_saved_liters": 2.4,
                    "model": "Venlix-XGBoost-v2",
                    "timestamp": "2026-08-07T11:45:00Z"
                }
            ]
        }
    )

from enum import Enum as PyEnum
from datetime import datetime

class ActorEnum(str, PyEnum):
    system = "system"
    ml_model = "ml_model"
    llm_agent = "llm_agent"
    dispatcher = "dispatcher"
    driver = "driver"
    customer = "customer"

class DeliveryCaseCreate(PredictionRequest):
    predictive_contact_consent: bool = Field(True, description="Consent for predictive contact")

class PrivacyUpdateRequest(BaseModel):
    predictive_contact_consent: bool = Field(..., description="Consent for predictive contact")

class DeliveryCaseResponse(DeliveryCaseCreate):
    id: int
    consent_timestamp: Optional[datetime] = None
    retention_expires_at: Optional[datetime] = None
    created_at: datetime
    
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    customer_email: Optional[str] = None
    delivery_address: Optional[str] = None
    society_name: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)

class AgentLogCreate(BaseModel):
    delivery_case_id: int
    actor: ActorEnum
    action_details: str

class AgentLogResponse(AgentLogCreate):
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class DashboardReport(BaseModel):
    total_predictions: int
    delivery_failures: int
    delivery_success: int
    failure_rate: str
    average_confidence: float

class DashboardHealth(BaseModel):
    status: str
    database: str
    model: str
    version: str

class LiveStats(BaseModel):
    todays_deliveries: int
    high_risk_deliveries: int
    average_risk_score: float
    success_rate: float
    fuel_saved: float
    cost_saved: float
    time_saved_hours: float
    ai_prevented_failures: int