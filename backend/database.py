# pyrefly: ignore [missing-import]
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

from config import settings

# Create Database Engine
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# Create Session
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base Class for Models
Base = declarative_base()


# Dependency for FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()