import requests
import random
import time

def generate_deliveries(count=500):
    url = "http://127.0.0.1:8000/simulation/start"
    
    print(f"Generating {count} demo deliveries...")
    
    for i in range(count):
        # We can just hit the /simulation/start endpoint to generate active simulated deliveries
        # Or hit /predict then /delivery_cases to populate history
        
        # Dashboard demo generation uses:
        payload = {
            "Agent_Age": random.randint(18, 55),
            "Agent_Rating": round(random.uniform(2.0, 5.0), 1),
            "Weather": random.choice(["Clear", "Light Rain", "Heavy Rain", "Storm", "Flooding"]),
            "Traffic": random.choice(["Low", "Medium", "High", "Critical"]),
            "Vehicle": random.choice(["Bike", "Scooter", "Car", "Van"]),
            "Area": random.choice(["Urban", "Suburban", "Rural"]),
            "Delivery_Time": random.randint(15, 120),
            "customer_answered_call": random.choice(["Yes", "No"]),
            "customer_response_time": random.randint(1, 15),
            "customer_availability": random.choice(["Home", "Office", "Travelling", "Unknown"]),
            "visitor_pass_status": random.choice(["Approved", "Pending", "Rejected"]),
            "society_security_level": random.choice(["Open", "Moderate", "Strict"]),
            "gate_wait_time": random.randint(1, 30),
            "driver_status": random.choice(["Available", "Delayed", "Accident", "Medical Emergency"]),
            "previous_failed_deliveries": random.randint(0, 5),
            "address_confidence": round(random.uniform(0.1, 1.0), 2),
            "preferred_delivery_slot": random.choice(["Morning", "Afternoon", "Evening", "Night"]),
            "estimated_arrival_delay": random.randint(0, 60),
            "driver_experience": random.randint(1, 60),
            "pickup_delay_minutes": random.randint(0, 45),
            "hour_of_day": random.randint(0, 23),
            "day_of_week": random.choice(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]),
            "is_weekend": random.choice([0, 1]),
            "arrival_within_preferred_slot": random.choice([0, 1]),
            "customer_reachability_score": round(random.uniform(0.1, 1.0), 2),
            "society_accessibility_score": round(random.uniform(0.1, 1.0), 2),
            "driver_reliability_score": round(random.uniform(0.1, 1.0), 2)
        }
        
        try:
            res = requests.post("http://127.0.0.1:8000/predict", json=payload)
            if res.status_code == 200:
                pred = res.json()
                case_payload = payload.copy()
                case_payload["predictive_contact_consent"] = True
                
                # Create case
                requests.post("http://127.0.0.1:8000/delivery_cases", json=case_payload)
                
                if i % 50 == 0:
                    print(f"Generated {i} deliveries...")
        except Exception as e:
            print(f"Failed at {i}: {e}")
            
    print("Done generating deliveries!")

if __name__ == "__main__":
    generate_deliveries(500)
