# models.py
from pydantic import BaseModel, Field, ConfigDict


class InfectionBase(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    incubation_days: int = Field(ge=0, le=365)
    detection_days: int = Field(ge=0, le=365)
    contagion_days: int = Field(ge=0, le=365)
    contagion_level: float = Field(ge=0.0, le=1.0)


class InfectionCreate(InfectionBase):
    pass


class InfectionUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    incubation_days: int | None = Field(default=None, ge=0, le=365)
    detection_days: int | None = Field(default=None, ge=0, le=365)
    contagion_days: int | None = Field(default=None, ge=0, le=365)
    contagion_level: float | None = Field(default=None, ge=0.0, le=1.0)


class InfectionOut(InfectionBase):
    id: str

    # IMPORTANT for Pydantic v2 when returning SQLAlchemy objects
    model_config = ConfigDict(from_attributes=True)
