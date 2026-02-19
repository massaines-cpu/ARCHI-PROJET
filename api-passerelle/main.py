from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services import get_cases, get_infections

app = FastAPI(title="API Passerelle")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/public/cases")
async def public_cases():
    """Renvoie les cas avec infection associée pour le front public"""
    cases = await get_cases()
    infections = await get_infections()

    # On crée un dict pour associer id_infection → nom infection
    infection_dict = {i["id"]: i["name"] for i in infections}

    # On injecte le nom de l’infection dans chaque case
    for case in cases:
        case["infection_name"] = infection_dict.get(case["id_infection"], "Unknown")
    return {"data": cases, "message": "Success", "error": None}
