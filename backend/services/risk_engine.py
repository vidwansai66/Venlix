from typing import List, Dict


def get_risk_level(risk_score: float) -> str:
    """
    Convert numerical risk score into a human-readable level.
    """

    if risk_score < 0.35:
        return "Low"

    elif risk_score < 0.70:
        return "Medium"

    return "High"


def build_risk_factors(data: dict) -> List[Dict]:
    """
    Build AI risk factors from delivery data.
    """

    risk_factors = []

    # -----------------------------
    # Traffic
    # -----------------------------
    traffic = data["Traffic"]

    if traffic <= 1:
        severity = "Low"
        reason = "Traffic is normal."

    elif traffic <= 2:
        severity = "Medium"
        reason = "Moderate traffic detected."

    else:
        severity = "High"
        reason = "Heavy traffic may delay delivery."

    risk_factors.append({
        "factor": "Traffic",
        "severity": severity,
        "reason": reason
    })

    # -----------------------------
    # Weather
    # -----------------------------
    weather = data["Weather"]

    if weather <= 1:
        severity = "Low"
        reason = "Weather conditions are favorable."

    elif weather == 2:
        severity = "Medium"
        reason = "Weather may slightly affect delivery."

    else:
        severity = "High"
        reason = "Bad weather increases delivery risk."

    risk_factors.append({
        "factor": "Weather",
        "severity": severity,
        "reason": reason
    })

    # -----------------------------
    # Driver Rating
    # -----------------------------
    rating = data["Agent_Rating"]

    if rating >= 4.5:
        severity = "Low"
        reason = "Driver has excellent performance."

    elif rating >= 3.5:
        severity = "Medium"
        reason = "Driver performance is average."

    else:
        severity = "High"
        reason = "Low driver rating increases risk."

    risk_factors.append({
        "factor": "Driver Rating",
        "severity": severity,
        "reason": reason
    })

    # -----------------------------
    # Distance
    # -----------------------------
    distance = data["distance_km"]

    if distance <= 5:
        severity = "Low"
        reason = "Short delivery distance."

    elif distance <= 10:
        severity = "Medium"
        reason = "Moderate delivery distance."

    else:
        severity = "High"
        reason = "Long distance increases delivery risk."

    risk_factors.append({
        "factor": "Distance",
        "severity": severity,
        "reason": reason
    })

    # -----------------------------
    # Customer Availability
    # -----------------------------
    customer_history = data["customer_unavailability_history"]

    if customer_history < 0.10:
        severity = "Low"
        reason = "Customer is usually available."

    elif customer_history < 0.30:
        severity = "Medium"
        reason = "Customer has occasional missed deliveries."

    else:
        severity = "High"
        reason = "Customer has frequent unavailable history."

    risk_factors.append({
        "factor": "Customer Availability",
        "severity": severity,
        "reason": reason
    })

    return risk_factors