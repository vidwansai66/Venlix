from typing import Dict


def generate_recommendation(
    prediction: str,
    risk_score: float,
    data: dict
) -> Dict:
    """
    Generate AI recommendation based on prediction and risk.
    """

    # -----------------------------
    # Low Risk
    # -----------------------------
    if prediction == "Delivery Successful":

        return {
            "priority": "Low",
            "action": "Proceed Normally",
            "recommended_route": "Current Route",
            "estimated_delay_minutes": 0,
            "estimated_cost_saved": 0,
            "estimated_success_probability": "99%"
        }

    # -----------------------------
    # High Risk Cases
    # -----------------------------

    traffic = data["Traffic"]
    weather = data["Weather"]
    driver_rating = data["Agent_Rating"]
    distance = data["distance_km"]

    actions = []

    if traffic >= 3:
        actions.append("Use Alternate Route")

    if weather >= 3:
        actions.append("Delay Dispatch Until Weather Improves")

    if driver_rating < 3.5:
        actions.append("Assign Senior Driver")

    if distance > 10:
        actions.append("Split Delivery Zone")

    if data["customer_unavailability_history"] > 0.30:
        actions.append("Call Customer Before Dispatch")

    if len(actions) == 0:
        actions.append("Monitor Delivery")

    return {

        "priority": (
            "Critical"
            if risk_score >= 0.90
            else "High"
        ),

        "action": " | ".join(actions),

        "recommended_route": (
            "Alternative Route B"
            if traffic >= 3
            else "Current Route"
        ),

        "estimated_delay_minutes": (
            30
            if traffic >= 3
            else 10
        ),

        "estimated_cost_saved": (
            220
            if risk_score >= 0.90
            else 120
        ),

        "estimated_success_probability": (
            "90%"
            if risk_score >= 0.90
            else "80%"
        )
    }