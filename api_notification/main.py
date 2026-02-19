from fastapi import FastAPI
import sqlite3
import resend

resend.api_key = "re_xxxxx"
app = FastAPI()

# Init BDD au démarrage
def init_db():
    db = sqlite3.connect("subscribers.db")
    db.execute("""
        CREATE TABLE IF NOT EXISTS subscribers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            latitude REAL,
            longitude REAL,
            radius_km REAL DEFAULT 10
        )
    """)
    db.commit()
    db.close()

init_db()

@app.post("/subscriptions")
async def subscribe(email: str, lat: float = None, lng: float = None):
    db = sqlite3.connect("subscribers.db")
    db.execute(
        "INSERT INTO subscribers (email, latitude, longitude) VALUES (?, ?, ?)",
        (email, lat, lng)
    )
    db.commit()
    db.close()
    return {"message": "Abonné avec succès"}

@app.post("/notify")
async def notify(infection: str, date: str):
    db = sqlite3.connect("subscribers.db")
    rows = db.execute("SELECT email FROM subscribers").fetchall()
    db.close()

    for (email,) in rows:
        resend.Emails.send({
            "from": "alertes@tondomaine.com",
            "to": email,
            "subject": f"Nouveau cas : {infection}",
            "html": f"<p>Un cas de <b>{infection}</b> détecté le {date}.</p>"
        })

    return {"message": f"{len(rows)} notifications envoyées"}