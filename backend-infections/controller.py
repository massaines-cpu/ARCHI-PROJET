# controller.py
from sqlalchemy import Column, String, Integer, Float, Date
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from database import Base, SessionLocal, engine
from models import InfectionCreate, InfectionUpdate


class Infection(Base):
    __tablename__ = "infections"

    id = Column(Integer, primary_key=True, autoincrement=True)  # <- important
    name = Column(String(120), unique=True, nullable=False)
    incubation_days = Column(Integer, nullable=False)
    detection_date = Column(Date, nullable=False)
    contagion_days = Column(Integer, nullable=False)
    contagion_level = Column(Float, nullable=False)

def create_infection(payload: InfectionCreate):
    db: Session = SessionLocal()
    try:
        infection = Infection(
            name=payload.name,
            incubation_days=payload.incubation_days,
            detection_date=payload.detection_date,
            contagion_days=payload.contagion_days,
            contagion_level=payload.contagion_level
        )
        db.add(infection)
        db.commit()
        db.refresh(infection)
        return infection
    finally:
        db.close()


def list_infections(q: str | None = None, limit: int = 50, offset: int = 0):
    db: Session = SessionLocal()
    try:
        query = db.query(Infection)
        if q:
            query = query.filter(Infection.name.ilike(f"%{q}%"))
        return query.offset(offset).limit(limit).all()
    finally:
        db.close()

def get_infection(infection_id: int):
    db: Session = SessionLocal()
    try:
        return db.query(Infection).filter(Infection.id == infection_id).first()
    finally:
        db.close()


def update_infection(infection_id: int, payload: InfectionUpdate):
    db: Session = SessionLocal()
    try:
        infection = db.query(Infection).filter(Infection.id == infection_id).first()
        if not infection:
            return None

        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(infection, field, value)

        try:
            db.commit()
        except IntegrityError:
            db.rollback()
            # name conflict on update
            return "CONFLICT"

        db.refresh(infection)
        return infection
    finally:
        db.close()


def delete_infection(infection_id: int):
    db: Session = SessionLocal()
    try:
        infection = db.query(Infection).filter(Infection.id == infection_id).first()
        if not infection:
            return False
        db.delete(infection)
        db.commit()
        return True
    finally:
        db.close()
