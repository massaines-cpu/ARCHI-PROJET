import mysql.connector

class Database:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Database, cls).__new__(cls)
            cls._instance.connection = None
        return cls._instance
    
    def get_connection(self):
        try:
            # Reconnect if connection is None or closed
            if self.connection is None or not self.connection.is_connected():
                self.connection = mysql.connector.connect(
                    host="127.0.0.1",
                    port=3306,
                    user="promo2027",
                    password="promo2026",
                    database="ARCHI"
                )
                print("MySQL Connected Successfully")
        except mysql.connector.Error as err:
            print("MySQL connection error:", err)
            raise err
        return self.connection
    
    def get_cursor(self):
        connection = self.get_connection()
        return connection.cursor()  # return a new cursor for each request to ensure thread safety