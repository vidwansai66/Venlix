from typing import Dict


def build_driver_context(data: dict) -> Dict:
    """
    Build driver information for AI Agent.
    """

    return {
        "driver_id": "DRV-201",
        "name": "Rahul Kumar",
        "rating": data["Agent_Rating"],
        "vehicle": "Bike",
        "experience_years": 5,
        "today_deliveries": 14,
        "successful_deliveries": 12,
        "failed_deliveries": 2,
        "on_time_rate": data["driver_on_time_rate"],
        "status": "Available"
    }


def build_customer_context(data: dict) -> Dict:
    """
    Build customer information for AI Agent.
    """

    return {
        "customer_id": "CUS-501",
        "name": "Ananya Sharma",
        "previous_orders": 42,
        "failed_deliveries": 2,
        "customer_unavailability_history": data["customer_unavailability_history"],
        "address_failure_history": data["address_failure_history_rate"],
        "priority_customer": False
    }


def build_environment_context(data: dict) -> Dict:
    """
    Build environment context.
    """

    return {
        "weather": data["Weather"],
        "traffic": data["Traffic"],
        "area": data["Area"],
        "distance_km": data["distance_km"],
        "pickup_delay": data["pickup_delay_minutes"],
        "hour_of_day": data["hour_of_day"],
        "weekend": bool(data["is_weekend"])
    }