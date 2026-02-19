from fastapi import FastAPI, Request, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
import httpx
import asyncio

app = FastAPI(title="API Passerelle")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

MICROSERVICES = {
    "cases":      "http://archi_backend:8002",
    "case":       "http://archi_backend:8002",
    "infections": "http://infections-service:8002",
    "infection":  "http://infections-service:8002",
}

# Mapping : préfixe appelé par le front → chemin réel sur le microservice
ROUTE_MAP = {
    "cases": "/cases",
    "case": "/case",
    "infections": "/infection",
    "infection": "/infection",
}


async def proxy_request(method: str, url: str, query_string: str, body: bytes, headers: dict):
    """Proxy transparent qui conserve status code, headers et body."""
    full_url = f"{url}{'?' + query_string if query_string else ''}"

    forward_headers = {
        k: v for k, v in headers.items()
        if k.lower() in ("content-type", "accept", "authorization")
    }

    for attempt in range(3):
        try:
            async with httpx.AsyncClient(timeout=5) as client:
                response = await client.request(
                    method,
                    full_url,
                    content=body,
                    headers=forward_headers
                )
                # On retourne la réponse telle quelle (status code inclus)
                return Response(
                    content=response.content,
                    status_code=response.status_code,
                    media_type=response.headers.get("content-type", "application/json")
                )
        except httpx.RequestError:
            if attempt == 2:
                raise HTTPException(status_code=502, detail=f"Service indisponible: {full_url}")
            await asyncio.sleep(1)


@app.api_route("/{prefix}/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def proxy_with_path(prefix: str, path: str, request: Request):
    if prefix not in MICROSERVICES:
        raise HTTPException(status_code=404, detail=f"Service inconnu: {prefix}")

    base_url = MICROSERVICES[prefix]
    service_prefix = ROUTE_MAP[prefix]

    # Reconstruit le chemin : /infection + /123 → /infection/123
    target_path = f"{service_prefix}/{path}" if path else service_prefix
    target_url = f"{base_url}{target_path}"

    body = await request.body()
    return await proxy_request(
        method=request.method,
        url=target_url,
        query_string=request.url.query,
        body=body,
        headers=dict(request.headers)
    )


@app.api_route("/{prefix}", methods=["GET", "POST", "PUT", "DELETE"])
async def proxy_root(prefix: str, request: Request):
    """Gère les appels sans sous-chemin : GET /cases, GET /infection, POST /infection..."""
    return await proxy_with_path(prefix=prefix, path="", request=request)


@app.get("/")
async def root():
    return {"message": "API Passerelle UP", "services": list(MICROSERVICES.keys())}


@app.get("/health")
async def health():
    statuts = {}
    async with httpx.AsyncClient(timeout=2) as client:
        for name, url in {
            "cases": "http://archi_backend:8002/cases",
            "infections": "http://infections-service:8002/infection"
        }.items():
            try:
                r = await client.get(url)
                statuts[name] = "ok" if r.status_code < 500 else "degraded"
            except Exception:
                statuts[name] = "down"
    return statuts