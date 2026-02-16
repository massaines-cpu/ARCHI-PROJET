import mysql.connector
import os
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

class Database:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Database, cls).__new__(cls)
            cls._instance.connection = None
        return cls._instance
    
    def get_connection(self):
        try:
            if self.connection is None or not self.connection.is_connected():
                self.connection = mysql.connector.connect(
                    host=os.getenv("DB_HOST", "127.0.0.1"),
                    port=int(os.getenv("DB_PORT", 3306)),
                    user=os.getenv("DB_USER", "promo2027"),
                    password=os.getenv("DB_PASSWORD", "promo2026"),
                    database=os.getenv("DB_NAME", "ARCHI")
                )
                print("MySQL Connected Successfully")
        except mysql.connector.Error as err:
            print("MySQL connection error:", err)
            raise err
        return self.connection
    
    def get_cursor(self):
        connection = self.get_connection()
        return connection.cursor()
