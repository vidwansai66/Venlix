from sqlalchemy.orm import Session
from datetime import datetime, timedelta

import models
import schemas

def create_delivery_case(db: Session, case_data: schemas.DeliveryCaseCreate):
    db_case = models.DeliveryCase(**case_data.model_dump())
    
    # Apply privacy logic
    if db_case.predictive_contact_consent:
        now = datetime.utcnow()
        db_case.consent_timestamp = now
        db_case.retention_expires_at = now + timedelta(days=30)
    
    db.add(db_case)
    db.commit()
    db.refresh(db_case)
    return db_case

def get_delivery_case(db: Session, case_id: int):
    return db.query(models.DeliveryCase).filter(models.DeliveryCase.id == case_id).first()

def get_delivery_cases(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.DeliveryCase).offset(skip).limit(limit).all()

def create_agent_log(db: Session, log_data: schemas.AgentLogCreate):
    db_log = models.AgentLog(**log_data.model_dump())
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

def get_agent_logs(db: Session, case_id: int):
    return db.query(models.AgentLog).filter(models.AgentLog.delivery_case_id == case_id).order_by(models.AgentLog.created_at.desc()).all()

def check_retention_expiry(db: Session, case_id: int):
    db_case = get_delivery_case(db, case_id)
    if db_case and db_case.retention_expires_at and db_case.retention_expires_at < datetime.utcnow():
        log_data = schemas.AgentLogCreate(
            delivery_case_id=case_id,
            actor="system",
            action_details="Record eligible for deletion according to privacy policy."
        )
        create_agent_log(db, log_data)
