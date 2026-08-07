# pyrefly: ignore [missing-import]
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Venlix AI"
    APP_VERSION: str = "1.0.0"

    MODEL_PATH: str = "../models/venlix_model.pkl"
    FEATURE_COLUMNS_PATH: str = "../models/feature_columns.pkl"
    LABEL_ENCODERS_PATH: str = "../models/label_encoders.pkl"

settings = Settings()