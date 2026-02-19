# Utiliser une image python légère
FROM python:3.11-slim

WORKDIR /app

# Copier requirements et installer
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code
COPY main.py .

# Lancer l'API passerelle
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8005"]
