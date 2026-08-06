import joblib
import pandas as pd

from config import settings

# Load Model Once
model = joblib.load(settings.MODEL_PATH)
feature_columns = joblib.load(settings.FEATURE_COLUMNS_PATH)


def predict_delivery(data):

    # Convert input to DataFrame
    input_df = pd.DataFrame([data])

    # Arrange columns
    input_df = input_df[feature_columns]

    # Prediction
    prediction = model.predict(input_df)[0]

    # Probability
    probability = model.predict_proba(input_df)[0]

    confidence = round(float(max(probability)), 4)

    prediction_text = (
        "Delivery Failure"
        if prediction == 1
        else "Delivery Successful"
    )

    return {
        "delivery_failed": int(prediction),
        "prediction": prediction_text,
        "confidence": confidence
    }