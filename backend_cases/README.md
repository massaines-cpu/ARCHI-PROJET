# ARCHI-PROJET
Projet d'architecture logicielle - Gestion de cas de contamination

API REST pour la gestion des cas de contamination avec FastAPI et MySQL avec support de données géospatiales.

## 🛠 Stack Technique
- **Backend**: FastAPI
- **Base de données**: MySQL 8.0 avec support spatial (MULTIPOINT)
- **Connecteur DB**: mysql-connector-python
- **Containerisation**: Docker & Docker Compose
- **Géospatial**: MySQL Spatial Data Types (SRID 4326 - WGS84)

## 📁 Structure du projet
```
ARCHI-PROJET/
├── backend_cases/
│   ├── data/
│   │   ├── data_base.py      # Gestion de la connexion DB
│   │   ├── init.sql          # Schéma de la base de données
│   │   ├── test.sql          # Données de test
│   │   └── script.py         # Script d'initialisation DB
│   ├── main.py               # Application FastAPI avec helpers geometry
│   ├── models.py             # Modèles Pydantic
│   ├── geoap.py              # Helpers pour conversion MULTIPOINT
│   ├── docker-compose.yml    # Configuration Docker Compose
│   ├── Dockerfile            # Configuration Docker
│   ├── .env                  # Variables d'environnement
│   └── requirements.txt      # Dépendances Python
```

## 🚀 Installation

### Prérequis
- Docker & Docker Compose
- Python 3.11+ (pour développement local)

### Installation avec Docker (recommandé)

1. **Cloner le repository**
```bash
git clone https://github.com/massaines-cpu/ARCHI-PROJET.git
cd ARCHI-PROJET/backend_cases
```

2. **Configurer les variables d'environnement**

Créez un fichier `.env` :
```env
DB_HOST=db
DB_PORT=3306
DB_USER=promo2027
DB_PASSWORD=promo2026
DB_NAME=ARCHI
DB_ROOT_PASSWORD=root
```

3. **Lancer avec Docker Compose**
```bash
docker compose up --build
```

L'API est accessible sur : `http://localhost:8000`

La documentation interactive Swagger : `http://localhost:8000/docs`

4. **Vérifier que tout fonctionne**
```bash
# Vérifier que les conteneurs tournent
docker ps | grep archi

# Vérifier que la table existe
docker exec -it archi_mysql mysql -u promo2027 -ppromo2026 ARCHI -e "SHOW TABLES;"
```

### Installation locale (développement)

1. **Créer un environnement virtuel**
```bash
python -m venv venv
source venv/bin/activate  # macOS/Linux
# ou
venv\Scripts\activate     # Windows
```

2. **Installer les dépendances**
```bash
pip install -r requirements.txt
```

3. **Configurer MySQL localement**
```bash
# Créer la base de données
mysql -u root -p < data/init.sql
mysql -u root -p ARCHI < data/test.sql
```

4. **Lancer l'application**
```bash
uvicorn main:app --reload
```

## 📡 API Endpoints

### Cases

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/case` | Créer un nouveau cas avec localisation géographique |
| GET | `/case/{case_id}` | Récupérer un cas avec ses points de fréquentation |
| PUT | `/case/{case_id}` | Mettre à jour un cas |
| DELETE | `/case/{case_id}` | Supprimer un cas |

### Exemples de requêtes

**Créer un cas avec données géospatiales**
```bash
curl -X POST "http://localhost:8000/case" \
  -H "Content-Type: application/json" \
  -d '{
    "id_infection": 1,
    "name": "Jean Dupont",
    "contamination_date": "2024-02-18T10:00:00",
    "frequented_places": [
      [2.3522, 48.8566],
      [2.2945, 48.8584],
      [2.3376, 48.8606]
    ]
  }'
```

**Réponse**
```json
{
  "data": {
    "id": 1,
    "name": "Jean Dupont",
    "contamination_date": "2024-02-18 10:00:00",
    "frequented_places": [
      [2.3522, 48.8566],
      [2.2945, 48.8584],
      [2.3376, 48.8606]
    ]
  },
  "message": "Case created successfully",
  "error": null
}
```

**Récupérer un cas**
```bash
curl -X GET "http://localhost:8000/case/1"
```

**Format des coordonnées géographiques**

Les points sont au format `[longitude, latitude]` (système WGS84 - SRID 4326) :
- Paris : `[2.3522, 48.8566]`
- Lyon : `[4.8357, 45.7640]`
- Marseille : `[5.3698, 43.2965]`

## 🗄️ Schéma de base de données

```sql
CREATE TABLE cases (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_infection INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    contamination_date DATETIME,
    frequented_places MULTIPOINT SRID 4326,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_id_infection ON cases(id_infection);
CREATE INDEX idx_contamination_date ON cases(contamination_date);
```

### Type de données géospatiales

- **MULTIPOINT SRID 4326** : Stocke plusieurs points géographiques (longitude, latitude)
- **SRID 4326** : Système de coordonnées WGS84 (standard GPS)
- Utilise `ST_GeomFromText()` pour l'insertion et `ST_AsText()` pour la lecture

##  Commandes utiles

### Docker

```bash
# Arrêter les conteneurs
docker compose down

# Arrêter et supprimer les volumes (réinitialiser la DB)
docker compose down -v

# Voir les logs
docker compose logs -f

# Entrer dans le conteneur MySQL
docker exec -it archi_mysql mysql -u promo2027 -ppromo2026 ARCHI

# Rebuild complet
docker compose up --build
```

### Base de données

```bash
# Vérifier les tables
docker exec -it archi_mysql mysql -u promo2027 -ppromo2026 ARCHI -e "SHOW TABLES;"

# Compter les cas
docker exec -it archi_mysql mysql -u promo2027 -ppromo2026 ARCHI -e "SELECT COUNT(*) FROM cases;"

# Voir tous les cas
docker exec -it archi_mysql mysql -u promo2027 -ppromo2026 ARCHI -e "SELECT id, name, id_infection FROM cases;"
```

## 📝 Modèles de données

### CaseCreate / CaseUpdate
```python
{
    "id_infection": int,              # ID de l'infection
    "name": str,                       # Nom du cas
    "contamination_date": datetime,    # Date de contamination (optionnel)
    "frequented_places": List[List[float]]  # Liste de [lon, lat] (optionnel)
}
```

## Tests

Documentation Swagger interactive : `http://localhost:8000/docs`

Alternative ReDoc : `http://localhost:8000/redoc`
