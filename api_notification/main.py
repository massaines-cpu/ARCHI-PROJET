from fastapi import FastAPI
import sqlite3

from fastapi.responses import JSONResponse
import resend
import os
from dotenv import load_dotenv
from pydantic import BaseModel, EmailStr
import smtplib
from email.mime.text import MIMEText



load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY")


app = FastAPI()


def init_db():
    db = sqlite3.connect("subscribers.db")
    db.execute(
        """
        CREATE TABLE IF NOT EXISTS subscribers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE
        )
    """
    )
    db.commit()
    db.close()


init_db()

class SubscriberModel(BaseModel):
    email: EmailStr


@app.post("/subscriptions")
async def subscribe(body: SubscriberModel):
    try:
        db = sqlite3.connect("subscribers.db")
        # Vérifie si déjà abonné
        exists = db.execute(
            "SELECT id FROM subscribers WHERE email = ?", (body.email,)
        ).fetchone()
        if exists:
            db.close()
            return JSONResponse({"error": "Email déjà abonné"}, 409)

        db.execute("INSERT INTO subscribers (email) VALUES (?)", (body.email,))
        db.commit()
        return {"message": "Abonné avec succès"}
    except Exception as e:
        return JSONResponse({"error": str(e)}, 500)
    finally:
        db.close()


@app.post("/notify")
async def notify(infection: str, date: str):
    try:
        db = sqlite3.connect("subscribers.db")
        rows = db.execute("SELECT email FROM subscribers").fetchall()
        db.close()

        if not rows:
            return {"message": "Aucun abonné"}

        errors = []
        for (email,) in rows:
            try:
                resend.Emails.send({
                    "from": "no-reply@yassdev.online",
                    "to": email,
                    "subject": f"Nouveau cas : {infection}",
                    "html": f"<p>Un cas de <b>{infection}</b> détecté le {date}.</p>",
                })
            except Exception as e:
                errors.append({"email": email, "error": str(e)})

        sent = len(rows) - len(errors)
        return {
            "message": f"{sent}/{len(rows)} notifications envoyées",
            "errors": errors
        }
    except Exception as e:
        return JSONResponse({"error": str(e)}, 500)
