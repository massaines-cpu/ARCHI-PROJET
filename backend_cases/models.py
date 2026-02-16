from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CaseCreate(BaseModel):
    id_infection: int
    name: str
    contamination_date: Optional[datetime] = None
    frequented_place: Optional[str] = None


class CaseUpdate(BaseModel):
    id_infection: int
    name: str
    contamination_date: Optional[datetime] = None
    frequented_place: Optional[str] = None
