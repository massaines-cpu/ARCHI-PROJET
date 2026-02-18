from fastapi import APIRouter, HTTPException, status
from models import InfectionCreate, InfectionUpdate, InfectionOut
from controller import (
    create_infection,
    list_infections,
    get_infection,
    update_infection,
    delete_infection,
)

router = APIRouter(prefix="/infection", tags=["infection"])


@router.post("", response_model=InfectionOut, status_code=status.HTTP_201_CREATED)
def create(payload: InfectionCreate):
    created = create_infection(payload)
    if created is None:
        # unique name conflict
        raise HTTPException(status_code=409, detail="Infection name already exists")
    return created


@router.get("", response_model=list[InfectionOut])
def list_all(q: str | None = None, limit: int = 50, offset: int = 0):
    infections = list_infections(q=q, limit=limit, offset=offset) #ajout
    return [InfectionOut.from_orm(i) for i in infections] #ajout
    # return list_infections(q=q, limit=limit, offset=offset)


@router.get("/{infection_id}", response_model=InfectionOut)
def get_one(infection_id: str):
    infection = get_infection(infection_id)
    if infection is None:
        raise HTTPException(status_code=404, detail="Infection not found")
    return infection


@router.put("/{infection_id}", response_model=InfectionOut)
def update_one(infection_id: str, payload: InfectionUpdate):
    updated = update_infection(infection_id, payload)
    if updated is None:
        raise HTTPException(status_code=404, detail="Infection not found")
    if updated == "CONFLICT":
        raise HTTPException(status_code=409, detail="Infection name already exists")
    return updated


@router.delete("/{infection_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_one(infection_id: str):
    ok = delete_infection(infection_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Infection not found")
    return None

