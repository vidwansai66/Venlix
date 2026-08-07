from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import crud
from database import get_db

router = APIRouter(prefix="/deliveries", tags=["Deliveries"])


@router.get("/")
def get_all_deliveries(db: Session = Depends(get_db)):
    return crud.get_deliveries(db)