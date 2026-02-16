import mysql.connector

try:
    connection = mysql.connector.connect(
        host="127.0.0.1",
        port=3306,
        user="promo2027",
        password="promo2026",
        database="ARCHI"
    )
    print(" Connexion réussie !")
    
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM cases LIMIT 1")
    result = cursor.fetchone()
    print(" Query réussie !")
    print(f"Premier case trouvé : {result}")
    
    cursor.close()
    connection.close()
    
except Exception as e:
    print(f" Erreur : {e}")