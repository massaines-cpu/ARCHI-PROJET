import httpx
from fastapi import HTTPException

CASE_URL = "http://cases-service:8000"
INFECTION_URL = "http://infections-service:8002"

async def get_cases():
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            resp = await client.get(f"{CASE_URL}/cases")
            if resp.status_code == 200:
                return resp.json()["data"]
            else:
                raise HTTPException(status_code=502, detail="Cases service unavailable")
    except Exception:
        raise HTTPException(status_code=502, detail="Cases service unreachable")

async def get_infections():
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            resp = await client.get(f"{INFECTION_URL}")
            if resp.status_code == 200:
                return resp.json()
            else:
                raise HTTPException(status_code=502, detail="Infections service unavailable")
    except Exception:
        raise HTTPException(status_code=502, detail="Infections service unreachable")
