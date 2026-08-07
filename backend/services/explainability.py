from typing import List


def generate_decision_trace(
    prediction: str,
    risk_score: float,
    data: dict
) -> List[str]:
    """
    Generate human-readable AI reasoning for the prediction.
    """

    trace = []

    # ----------------------------
    # Overall Prediction
    # ----------------------------
    trace.append(f"Model Prediction: {prediction}")
    trace.append(f"Calculated Risk Score: {risk_score:.2f}")

    # ----------------------------
    # Traffic
    # ----------------------------
    if data["Traffic"] >= 3:
        trace.append("Heavy traffic detected. This significantly increases delivery delay risk.")
    elif data["Traffic"] == 2:
        trace.append("Moderate traffic detected.")
    else:
        trace.append("Traffic conditions are favorable.")

    # ----------------------------
    # Weather
    # ----------------------------
    if data["Weather"] >= 3:
        trace.append("Severe weather conditions increase delivery uncertainty.")
    elif data["Weather"] == 2:
        trace.append("Weather may slightly affect delivery.")
    else:
        trace.append("Weather conditions are normal.")

    # ----------------------------
    # Driver
    # ----------------------------
    if data["Agent_Rating"] < 3.5:
        trace.append("Driver rating is below the preferred threshold.")
    elif data["Agent_Rating"] < 4.5:
        trace.append("Driver performance is acceptable.")
    else:
        trace.append("Driver has an excellent performance record.")

    # ----------------------------
    # Distance
    # ----------------------------
    if data["distance_km"] > 15:
        trace.append("Long delivery distance increases operational risk.")
    elif data["distance_km"] > 8:
        trace.append("Delivery distance is moderate.")
    else:
        trace.append("Delivery distance is short.")

    # ----------------------------
    # Customer
    # ----------------------------
    if data["customer_unavailability_history"] > 0.30:
        trace.append("Customer has a high history of unavailable deliveries.")

    if data["address_failure_history_rate"] > 0.20:
        trace.append("Customer address has previous delivery failures.")

    # ----------------------------
    # Pickup Delay
    # ----------------------------
    if data["pickup_delay_minutes"] > 20:
        trace.append("Pickup delay may impact final delivery time.")

    # ----------------------------
    # Final Decision
    # ----------------------------
    if prediction == "Delivery Failure":
        trace.append("Overall delivery risk exceeded the acceptable threshold.")
        trace.append("AI recommends immediate intervention before dispatch.")
    else:
        trace.append("Overall delivery risk is within acceptable limits.")
        trace.append("Delivery can proceed without additional intervention.")

    return trace