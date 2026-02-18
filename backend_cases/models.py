from pydantic import BaseModel
from typing import Optional, List, Tuple
from datetime import datetime

# Chaque point = (longitude, latitude)
Point = List[float]

class CaseCreate(BaseModel):
    id_infection: int
    name: str
    contamination_date: Optional[datetime] = None
    frequented_places: Optional[List[Point]] = None  # liste de points pour MULTIPOINT

class CaseUpdate(BaseModel):
    id_infection: int
    name: str
    contamination_date: Optional[datetime] = None
    frequented_places: Optional[List[Point]] = None
