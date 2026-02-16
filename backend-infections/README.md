Backend Infections Service

Microservice FastAPI pour la gestion des infections dans le projet
Alerte Infection.

Ce service permet de créer, lire, mettre à jour et supprimer des
infections dans la base de données.

------------------------------------------------------------------------

Technologies utilisées

-   FastAPI
-   SQLAlchemy
-   PostgreSQL
-   Docker
-   Pydantic

------------------------------------------------------------------------

Structure du projet

backend-infections/ │ ├── main.py # Point d’entrée FastAPI ├── routes.py
# Endpoints API ├── controller.py # Logique métier + accès DB ├──
database.py # Configuration SQLAlchemy ├── models.py # Modèles Pydantic
├── requirements.txt ├── Dockerfile └── .env

------------------------------------------------------------------------

Variables d’environnement

Fichier .env :

DATABASE_URL=postgresql+psycopg://postgres:postgres@infections-db:5432/infections_db

------------------------------------------------------------------------
Lancer avec Docker

Construire l’image :

docker build -t infections-service .

Lancer le container :

docker run –name infections-service
–network alerte-net
–env-file .env
-p 8002:8002
infections-service

------------------------------------------------------------------------

🔗 Endpoints principaux

POST /infection → Créer une infection GET /infection → Liste des
infections GET /infection/{id} → Obtenir une infection PUT
/infection/{id} → Modifier une infection DELETE /infection/{id} →
Supprimer une infection

------------------------------------------------------------------------

Health Check

GET /health

Réponse :

{ “status”: “ok”, “service”: “infections” }

------------------------------------------------------------------------

Description fonctionnelle

Ce microservice gère les informations liées aux infections :

-   Nom de l’infection
-   Durée d’incubation
-   Période de détection
-   Durée de contagion
-   Niveau de contagiosité (0 → 1)

Il est conçu pour fonctionner de manière indépendante dans une
architecture microservices.

------------------------------------------------------------------------

Auteur

Backend infections — Ahmad
