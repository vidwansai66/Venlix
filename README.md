# 🚚 Venlix AI – Smart Delivery Failure Prediction System

## 📌 Project Overview

Venlix AI is an AI-powered logistics platform that predicts delivery failures before they occur. It uses Machine Learning to analyze delivery-related factors such as traffic, weather, driver performance, delivery distance, and customer history to determine whether a delivery is likely to succeed or fail.

The backend is developed using **FastAPI**, while the Machine Learning model is built using **XGBoost**. The system exposes REST APIs that can be consumed by any frontend application.

---

# 🚀 Features

- 🤖 Delivery Failure Prediction using Machine Learning
- 📊 Dashboard Reports API
- 🚚 Delivery History API
- 🌍 Digital Twin API for Map Visualization
- 💾 SQLite Database Integration
- ⚡ FastAPI REST Backend
- 🧠 XGBoost Prediction Model
- 📈 Model Evaluation & Feature Importance
- 🛠 Modular Backend Architecture

---

# 🏗 Tech Stack

### Machine Learning
- Python
- Pandas
- NumPy
- Scikit-learn
- XGBoost
- Joblib

### Backend
- FastAPI
- SQLAlchemy
- Pydantic
- SQLite
- Uvicorn

### Development
- Jupyter Notebook
- VS Code
- Git
- GitHub

---

# 📂 Project Structure

```text
Venlix/
│
├── data/
│
├── notebooks/
│   ├── 01_Data_Preparation.ipynb
│   ├── 02_EDA.ipynb
│   ├── 03_Data_Preprocessing.ipynb
│   ├── 04_Model_Training.ipynb
│   └── 05_Model_Evaluation.ipynb
│
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── crud.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── requirements.txt
│   ├── venlix.db
│   │
│   ├── routers/
│   │   ├── prediction.py
│   │   ├── deliveries.py
│   │   ├── reports.py
│   │   └── twin.py
│   │
│   ├── services/
│   │   └── prediction_service.py
│   │
│   └── models/
│       ├── venlix_model.pkl
│       ├── feature_columns.pkl
│       └── label_encoders.pkl
│
└── README.md
```

---

# ⚙ Installation

Clone the repository

```bash
git clone https://github.com/yourusername/Venlix.git
```

Go to backend

```bash
cd Venlix/backend
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run FastAPI

```bash
uvicorn app:app --reload
```

Open Swagger Documentation

```
http://127.0.0.1:8000/docs
```

---

# 📡 API Endpoints

## Home

```
GET /
```

Returns API status.

---

## Health Check

```
GET /health
```

Returns backend health information.

---

## Prediction

```
POST /prediction/
```

Predicts delivery success or failure.

### Sample Request

```json
{
  "Agent_Age": 28,
  "Agent_Rating": 4.8,
  "Store_Latitude": 12.9716,
  "Store_Longitude": 77.5946,
  "Drop_Latitude": 12.9352,
  "Drop_Longitude": 77.6245,
  "Weather": 1,
  "Traffic": 2,
  "Vehicle": 1,
  "Area": 1,
  "Category": 0,
  "Delivery_Time": 30,
  "pin_code": 560001,
  "driver_on_time_rate": 0.92,
  "customer_unavailability_history": 0.12,
  "address_failure_history_rate": 0.04,
  "order_value": 750,
  "slot_width_minutes": 30,
  "distance_km": 4.6,
  "risk_score": 0.35,
  "day_of_week": 3,
  "month": 7,
  "is_weekend": 0,
  "pickup_delay_minutes": 3,
  "hour_of_day": 15
}
```

### Sample Response

```json
{
  "id": 1,
  "delivery_failed": 0,
  "prediction": "Delivery Successful",
  "confidence": 1.0
}
```

---

## Delivery History

```
GET /deliveries/
```

Returns all stored predictions.

---

## Reports

```
GET /reports/
```

Returns dashboard statistics.

Example:

```json
{
  "total_predictions": 10,
  "delivery_failures": 3,
  "delivery_success": 7,
  "failure_rate": "30%",
  "average_confidence": 0.94
}
```

---

## Digital Twin

```
GET /twin/
```

Returns delivery locations and prediction results for frontend map visualization.

---

# 🧠 Machine Learning Workflow

1. Data Preparation
2. Exploratory Data Analysis (EDA)
3. Data Preprocessing
4. Feature Engineering
5. Model Training
6. Model Evaluation
7. Model Serialization
8. FastAPI Integration

---

# 📊 Model Information

Algorithm Used

- XGBoost Classifier

Saved Models

- venlix_model.pkl
- feature_columns.pkl
- label_encoders.pkl

---

# 🔮 Future Enhancements

- JWT Authentication
- PostgreSQL Database
- Docker Deployment
- CI/CD Pipeline
- Cloud Deployment
- Live Tracking
- Real-time Notifications
- AI Chat Assistant
- LangGraph Agent Integration

---

# 👥 Team

Backend & Machine Learning

- Your Name

Frontend

- Teammate Name

---

# 📄 License

This project is developed for educational and hackathon purposes.

---

⭐ If you like this project, consider giving it a star on GitHub!
