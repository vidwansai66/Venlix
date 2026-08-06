from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine

from routers.prediction import router as prediction_router
from routers.deliveries import router as deliveries_router
from routers.reports import router as reports_router
from routers.twin import router as twin_router
# Create Database Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Venlix AI API",
    description="Delivery Failure Prediction API",
    version="1.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/health")
def health():
    return {
        "status": "Healthy",
        "database": "Connected",
        "model": "Loaded",
        "version": "1.0.0"
    }

@app.get("/")
def home():
    return {
        "message": "Welcome to Venlix AI 🚚",
        "status": "API Running Successfully"
    }


app.include_router(prediction_router)
app.include_router(deliveries_router)
app.include_router(reports_router)
app.include_router(twin_router)