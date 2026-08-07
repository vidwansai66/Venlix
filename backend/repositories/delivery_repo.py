from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timezone
import json
from models.delivery_model import Delivery

def create_delivery(db: Session, request_data: dict, prediction_result: dict):
    # Extract prediction probability from risk score roughly or store it natively
    success_prob = 100 - prediction_result.get("risk_score", 0)

    db_delivery = Delivery(
        agent_age=request_data.get("Agent_Age"),
        agent_rating=request_data.get("Agent_Rating"),
        weather=request_data.get("Weather"),
        traffic=request_data.get("Traffic"),
        vehicle=request_data.get("Vehicle"),
        area=request_data.get("Area"),
        delivery_time=request_data.get("Delivery_Time"),
        customer_answered_call=request_data.get("customer_answered_call"),
        customer_availability=request_data.get("customer_availability"),
        visitor_pass_status=request_data.get("visitor_pass_status"),
        society_security_level=request_data.get("society_security_level"),
        gate_wait_time=request_data.get("gate_wait_time"),
        driver_status=request_data.get("driver_status"),
        previous_failed_deliveries=request_data.get("previous_failed_deliveries"),
        address_confidence=request_data.get("address_confidence"),
        preferred_delivery_slot=request_data.get("preferred_delivery_slot"),
        estimated_arrival_delay=request_data.get("estimated_arrival_delay"),
        driver_experience=request_data.get("driver_experience"),
        pickup_delay_minutes=request_data.get("pickup_delay_minutes"),
        hour_of_day=request_data.get("hour_of_day"),
        day_of_week=request_data.get("day_of_week"),
        is_weekend=request_data.get("is_weekend"),
        arrival_within_preferred_slot=request_data.get("arrival_within_preferred_slot"),
        customer_reachability_score=request_data.get("customer_reachability_score"),
        society_accessibility_score=request_data.get("society_accessibility_score"),
        driver_reliability_score=request_data.get("driver_reliability_score"),
        
        prediction_class=prediction_result.get("prediction_class"),
        risk_score=prediction_result.get("risk_score"),
        risk_level=prediction_result.get("risk_level"),
        confidence=prediction_result.get("confidence"),
        success_probability=success_prob,
        estimated_success_after_action=prediction_result.get("estimated_success_after_action"),
        estimated_time_saved_minutes=prediction_result.get("estimated_time_saved_minutes"),
        estimated_cost_saved_rupees=prediction_result.get("estimated_cost_saved_rupees"),
        estimated_fuel_saved_liters=prediction_result.get("estimated_fuel_saved_liters"),
        
        json_response=json.dumps(prediction_result)
    )
    db.add(db_delivery)
    db.commit()
    db.refresh(db_delivery)
    return db_delivery

def get_deliveries(db: Session, limit: int = 100):
    return db.query(Delivery).order_by(Delivery.created_at.desc()).limit(limit).all()

def get_delivery_by_id(db: Session, delivery_id: int):
    return db.query(Delivery).filter(Delivery.id == delivery_id).first()

def get_dashboard_stats(db: Session):
    today = datetime.now(timezone.utc).date()
    
    # SQLite doesn't have an easy DATE() function that works universally in SQLAlchemy without custom dialects
    # So we can fetch all and filter or use string matching. Let's do it safely by doing a raw query or simple string startswith
    today_str = today.isoformat()
    
    total_today = db.query(Delivery).filter(func.date(Delivery.created_at) == today_str).count()
    
    high_critical_risk = db.query(Delivery).filter(Delivery.risk_level.in_(["High", "Critical"])).count()
    avg_risk = db.query(func.avg(Delivery.risk_score)).scalar() or 0.0
    avg_success = db.query(func.avg(Delivery.estimated_success_after_action)).scalar() or 0.0
    
    fuel_saved = db.query(func.sum(Delivery.estimated_fuel_saved_liters)).scalar() or 0.0
    cost_saved = db.query(func.sum(Delivery.estimated_cost_saved_rupees)).scalar() or 0.0
    time_saved_mins = db.query(func.sum(Delivery.estimated_time_saved_minutes)).scalar() or 0
    time_saved_hours = round(time_saved_mins / 60, 1)

    ai_prevented = db.query(Delivery).filter(Delivery.estimated_success_after_action > Delivery.risk_score).count()

    return {
        "todays_deliveries": total_today,
        "high_risk_deliveries": high_critical_risk,
        "average_risk_score": round(avg_risk, 1),
        "success_rate": round(avg_success, 1),
        "fuel_saved": round(fuel_saved, 1),
        "cost_saved": int(cost_saved),
        "time_saved_hours": time_saved_hours,
        "ai_prevented_failures": ai_prevented
    }

def get_chart_analytics(db: Session):
    # Risk Distribution
    risk_dist = db.query(Delivery.risk_level, func.count(Delivery.id)).group_by(Delivery.risk_level).all()
    risk_distribution = {level: count for level, count in risk_dist}
    
    # Top Failure Reasons by counting conditions
    reasons = {
        "Weather": db.query(Delivery).filter(Delivery.weather.in_(["Heavy Rain", "Storm", "Flooding"])).count(),
        "Traffic": db.query(Delivery).filter(Delivery.traffic == "High").count(),
        "Visitor Pass": db.query(Delivery).filter(Delivery.visitor_pass_status.in_(["Pending", "Rejected"])).count(),
        "Customer Unavailable": db.query(Delivery).filter(Delivery.customer_availability.in_(["Unknown", "Travelling"])).count(),
        "Address": db.query(Delivery).filter(Delivery.address_confidence < 0.8).count(),
        "Driver Delay": db.query(Delivery).filter(Delivery.driver_status.in_(["Delayed", "Accident", "Medical Emergency"])).count(),
        "Gate Wait": db.query(Delivery).filter(Delivery.gate_wait_time > 10).count(),
    }
    
    # Hourly Risk Trend (simple approach for SQLite)
    # Get all deliveries and aggregate manually for simplicity across dialects
    deliveries = db.query(Delivery.created_at, Delivery.risk_score).all()
    hourly_trend = {}
    for d in deliveries:
        hour = d.created_at.hour
        if hour not in hourly_trend:
            hourly_trend[hour] = []
        hourly_trend[hour].append(d.risk_score)
        
    trend_result = []
    for h in range(24):
        if h in hourly_trend:
            avg_risk = sum(hourly_trend[h]) / len(hourly_trend[h])
            # format as 8 AM, 1 PM
            time_str = f"{h} AM" if h < 12 else (f"12 PM" if h == 12 else f"{h-12} PM")
            if h == 0: time_str = "12 AM"
            trend_result.append({"time": time_str, "risk": int(avg_risk)})

    return {
        "risk_distribution": risk_distribution,
        "failure_reasons": reasons,
        "hourly_trend": trend_result
    }

def reset_database(db: Session):
    db.query(Delivery).delete()
    db.commit()
