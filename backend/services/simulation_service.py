import asyncio
import random
from sqlalchemy.orm import Session
from database import SessionLocal
from models.delivery_model import Delivery
from schemas import PredictionRequest
from services.prediction_service import predict_delivery
from repositories import delivery_repo
from datetime import datetime, timezone

class SimulationState:
    running = False
    task = None
    update_task = None
    rate_seconds = 10

state = SimulationState()

# Store coordinate
STORE_LAT = 12.9345
STORE_LNG = 77.6266

SOCIETIES = [
    {"name": "My Home Bhooja", "lat": 12.9515, "lng": 77.6420},
    {"name": "Prestige Falcon City", "lat": 12.8877, "lng": 77.5684},
    {"name": "Sobha City", "lat": 13.0645, "lng": 77.6321},
    {"name": "Brigade Gateway", "lat": 13.0131, "lng": 77.5552},
    {"name": "Salarpuria Sattva", "lat": 12.9312, "lng": 77.6843},
]

def generate_random_request() -> dict:
    soc = random.choice(SOCIETIES)
    return {
        "Agent_Age": random.randint(20, 50),
        "Agent_Rating": round(random.uniform(3.0, 5.0), 1),
        "Weather": random.choice(["Clear", "Light Rain", "Heavy Rain", "Storm", "Flooding"]),
        "Traffic": random.choice(["Low", "Medium", "High"]),
        "Vehicle": random.choice(["Bike", "Scooter", "Car"]),
        "Area": random.choice(["Urban", "Semi-Urban", "Rural"]),
        "Delivery_Time": random.randint(10, 60),
        "customer_answered_call": random.choice(["Yes", "No"]),
        "customer_availability": random.choice(["Home", "Office", "Travelling", "Unknown"]),
        "visitor_pass_status": random.choice(["Approved", "Pending", "Rejected"]),
        "society_security_level": random.choice(["Open", "Moderate", "Strict"]),
        "gate_wait_time": random.randint(0, 30),
        "driver_status": random.choice(["Available", "Delayed", "Accident"]),
        "previous_failed_deliveries": random.randint(0, 5),
        "address_confidence": round(random.uniform(0.5, 1.0), 2),
        "preferred_delivery_slot": random.choice(["Morning", "Afternoon", "Evening"]),
        "estimated_arrival_delay": random.randint(0, 30),
        "driver_experience": random.randint(1, 10),
        "pickup_delay_minutes": round(random.uniform(0.0, 20.0), 1),
        "hour_of_day": random.randint(8, 22),
        "day_of_week": random.choice(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]),
        "is_weekend": random.choice([0, 1]),
        "arrival_within_preferred_slot": random.choice([0, 1]),
        "customer_reachability_score": round(random.uniform(0.0, 1.0), 2),
        "society_accessibility_score": round(random.uniform(0.0, 1.0), 2),
        "driver_reliability_score": round(random.uniform(0.0, 1.0), 2),
    }

async def generate_deliveries_loop():
    while state.running:
        try:
            req_data = generate_random_request()
            db = SessionLocal()
            try:
                result = predict_delivery(req_data)
                
                db_delivery = delivery_repo.create_delivery(db, req_data, result)
                # Overwrite Area for frontend display purposes (map coordinates)
                db_delivery.area = soc["name"]
                
                db_delivery.store_lat = STORE_LAT
                db_delivery.store_lng = STORE_LNG
                db_delivery.drop_lat = soc["lat"]
                db_delivery.drop_lng = soc["lng"]
                db_delivery.current_lat = STORE_LAT
                db_delivery.current_lng = STORE_LNG
                db_delivery.current_status = "Picked Up"
                
                db.commit()
            except Exception as e:
                print(f"Simulation generation error: {e}")
            finally:
                db.close()
        except Exception as e:
            print(f"Loop error: {e}")
            
        await asyncio.sleep(state.rate_seconds)

async def update_deliveries_loop():
    while state.running:
        try:
            db = SessionLocal()
            try:
                active_deliveries = db.query(Delivery).filter(
                    Delivery.current_status.in_(["Picked Up", "On Route", "At Society", "Visitor Verification", "Out For Delivery"])
                ).all()
                
                for delivery in active_deliveries:
                    if delivery.current_status == "Picked Up":
                        delivery.current_status = "On Route"
                        
                    elif delivery.current_status == "On Route":
                        dist_lat = delivery.drop_lat - delivery.current_lat
                        dist_lng = delivery.drop_lng - delivery.current_lng
                        
                        delivery.current_lat += dist_lat * 0.1
                        delivery.current_lng += dist_lng * 0.1
                        
                        if abs(dist_lat) < 0.001 and abs(dist_lng) < 0.001:
                            delivery.current_status = "At Society"
                            delivery.current_lat = delivery.drop_lat
                            delivery.current_lng = delivery.drop_lng
                            
                    elif delivery.current_status == "At Society":
                        if delivery.visitor_pass_status == "Pending":
                            delivery.current_status = "Visitor Verification"
                        else:
                            delivery.current_status = "Out For Delivery"
                            
                    elif delivery.current_status == "Visitor Verification":
                        if delivery.risk_level in ["High", "Critical"]:
                            delivery.current_status = "Failed"
                        else:
                            delivery.current_status = "Out For Delivery"
                            
                    elif delivery.current_status == "Out For Delivery":
                        if delivery.risk_level in ["High", "Critical"] and delivery.customer_availability in ["Travelling", "Unknown"]:
                            delivery.current_status = "Failed"
                        else:
                            delivery.current_status = "Delivered"
                            
                db.commit()
            except Exception as e:
                print(f"Simulation update error: {e}")
            finally:
                db.close()
        except Exception as e:
            print(f"Update loop error: {e}")
            
        await asyncio.sleep(2)

def start_simulation():
    if not state.running:
        state.running = True
        state.task = asyncio.create_task(generate_deliveries_loop())
        state.update_task = asyncio.create_task(update_deliveries_loop())

def pause_simulation():
    state.running = False
    if state.task:
        state.task.cancel()
        state.task = None
    if state.update_task:
        state.update_task.cancel()
        state.update_task = None
