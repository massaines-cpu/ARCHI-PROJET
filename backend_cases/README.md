# ARCHI-PROJET

Projet d'architecture logicielle - Gestion de cas de contamination


API REST pour la gestion des cas de contamination avec FastAPI et MySQL.

## Utils

- **Backend**: FastAPI
- **Base de données**: MySQL
- **ORM**: mysql-connector-python
- **Containerisation**: Docker

##  Structure du projet
```
ARCHI-PROJET/
├── backend_cases/
│   ├── data/
│   │   ├── data_base.py      # Gestion de la connexion DB
│   │   ├── init.sql          # Schéma de la base de données
│   │   ├── test.sql          # Données de test
│   │   └── script.py         # Script d'initialisation DB
│   ├── main.py               # Application FastAPI
│   ├── models.py             # Modèles Pydantic
│   ├── Dockerfile            # Configuration Docker
│   └── requirements.txt      # Dépendances Python
```

##  Installation

### Prérequis
- Python 3.11+
- MySQL 8.0+
- Docker (optionnel)

### Installation locale

1. **Cloner le repository**
```bash
git clone https://github.com/massaines-cpu/ARCHI-PROJET.git
cd ARCHI-PROJET/backend_cases
```

2. **Créer un environnement virtuel**
```bash
python -m venv venv
source venv/bin/activate  # macOS/Linux
# ou
venv\Scripts\activate     # Windows
```

3. **Installer les dépendances**
```bash
pip install -r requirements.txt
```

4. **Configurer la base de données**

Créez une base de données MySQL et modifiez les paramètres dans `data/data_base.py` :
```python
host="127.0.0.1"
user="votre_user"
password="votre_password"
database="ARCHI"
```

5. **Initialiser la base de données**
```bash
cd data
python script.py
```

6. **Lancer l'application**
```bash
cd ..
uvicorn main:app --reload
```

L'API est accessible sur : `http://localhost:8000`

### Installation avec Docker
```bash
cd backend_cases
docker build -t backend-cases .
docker run -p 8000:8000 backend-cases
```

##  API Endpoints

### Cases

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/case` | Créer un nouveau cas |
| GET | `/case/{case_id}` | Récupérer un cas |
| PUT | `/case/{case_id}` | Mettre à jour un cas |
| DELETE | `/case/{case_id}` | Supprimer un cas |

### Exemple de requête

**Créer un cas**
```bash
curl -X POST "http://localhost:8000/case" \
  -H "Content-Type: application/json" \
  -d '{
    "id_infection": 1,
    "name": "Jean Dupont",
    "contamination_date": "2026-02-16T10:00:00",
    "frequented_place": "Centre commercial"
  }'
```

##  Schéma de base de données
```sql
CREATE TABLE cases (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_infection INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    contamination_date DATETIME,
    frequented_place VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```



