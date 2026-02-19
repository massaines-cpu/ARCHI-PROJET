Description
L'API Passerelle est un service intermédiaire qui centralise les appels vers deux microservices : l'API Cases et l'API Infections. Elle expose une interface unifiée aux trois fronts de l'application (public, agence, docteurs).
Architecture
Fronts (public / agence / docteurs)
        |
   API Passerelle :8005
        |
   _____|_____
  |           |
API Cases  API Infections
  :8002        :8002
  (MySQL)    (PostgreSQL)
Endpoints
MethodeRouteDescriptionGET/casesListe tous les casPOST/caseCree un casPUT/case/{id}Met a jour un casDELETE/case/{id}Supprime un casGET/infectionListe toutes les infectionsPOST/infectionCree une infectionPUT/infection/{id}Met a jour une infectionDELETE/infection/{id}Supprime une infectionGET/healthVerifie la disponibilite des microservices
Lancer le projet
Prerequis

Docker
Docker Compose

Demarrage
bashdocker compose up --build
Premiere installation (bases de donnees vides)
bashdocker compose down -v && docker compose up --build
Le flag -v supprime les volumes existants et force la reinitialisation des bases de donnees avec les scripts SQL.
Variables d'environnement
Creer un fichier .env a la racine du projet :
DB_ROOT_PASSWORD=xxx
DB_NAME=archi
DB_USER=xxx
DB_PASSWORD=xxx
Configuration des microservices
Les URLs internes (dans le reseau Docker) sont configurees dans main.py :
pythonMICROSERVICES = {
    "cases":      "http://archi_backend:8002",
    "case":       "http://archi_backend:8002",
    "infections": "http://infections-service:8002",
    "infection":  "http://infections-service:8002",
}
Documentation interactive
Une fois le service lance, la documentation Swagger est disponible a :
http://localhost:8005/docs
Comportement en cas d'erreur
Si un microservice est indisponible, la passerelle retourne une erreur 502. Les fronts sont concus pour detecter cette erreur et basculer automatiquement sur les APIs directes en fallback.