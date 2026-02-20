import os
import sqlite3
import logging
import smtplib
from contextlib import asynccontextmanager
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv


load_dotenv()

GMAIL_ADDRESS = os.getenv("GMAIL_ADDRESS")
GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD")

if not GMAIL_ADDRESS or not GMAIL_APP_PASSWORD:
    raise RuntimeError("Configuration Gmail manquante")

DB_NAME = "subscribers.db"

logging.basicConfig(level=logging.INFO)


def get_db():
    return sqlite3.connect(DB_NAME)


def init_db():
    db = get_db()
    db.execute("""
        CREATE TABLE IF NOT EXISTS subscribers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE
        )
    """)
    db.commit()
    db.close()


@asynccontextmanager
async def lifespan(_app: FastAPI):
    init_db()
    logging.info("Database initialisée")
    yield


app = FastAPI(title="Notification API", lifespan=lifespan)


class SubscriberModel(BaseModel):
    email: EmailStr


class NotificationModel(BaseModel):
    infection: str
    date: str


def send_email(to_email: str, subject: str, html_content: str):
    message = MIMEMultipart("alternative")
    message["From"] = GMAIL_ADDRESS
    message["To"] = to_email
    message["Subject"] = subject
    message.attach(MIMEText(html_content, "html"))

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(GMAIL_ADDRESS, GMAIL_APP_PASSWORD)
        server.sendmail(GMAIL_ADDRESS, to_email, message.as_string())


def send_notifications(infection: str, date: str, emails: list[str]):
    errors = []
    for email in emails:
        try:
            send_email(
                to_email=email,
                subject=f"Nouveau cas : {infection}",
                html_content=f"""
                    <h3>Nouvelle alerte sanitaire</h3>
                    <p>Un cas de <b>{infection}</b> a été détecté le {date}.</p>
                """
            )
        except Exception as e:
            logging.error(f"Erreur envoi à {email}: {e}")
            errors.append(email)

    logging.info(f"Envoi terminé. Succès: {len(emails) - len(errors)} / {len(emails)}")


@app.post("/subscriptions", status_code=201)
def subscribe(body: SubscriberModel):
    db = get_db()
    try:
        exists = db.execute(
            "SELECT id FROM subscribers WHERE email = ?", (body.email,)
        ).fetchone()

        if exists:
            raise HTTPException(status_code=409, detail="Email déjà abonné")

        db.execute("INSERT INTO subscribers (email) VALUES (?)", (body.email,))
        db.commit()
        return {"message": "Abonné avec succès"}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Erreur subscription: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
    finally:
        db.close()


@app.post("/notify")
def notify(payload: NotificationModel, background_tasks: BackgroundTasks):
    db = get_db()
    try:
        rows = db.execute("SELECT email FROM subscribers").fetchall()
    finally:
        db.close()

    if not rows:
        return {"message": "Aucun abonné"}

    emails = [row[0] for row in rows]
    background_tasks.add_task(send_notifications, payload.infection, payload.date, emails)

    return {"message": f"Envoi lancé pour {len(emails)} abonnés"}
