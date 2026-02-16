from data_base import Database

def execute_sql_file(filepath):
    db = Database()
    conn = db.get_connection()
    cursor = conn.cursor(buffered=True)
    
    with open(filepath, 'r') as file:
        sql = file.read()
    
    try:
        queries = [q.strip() for q in sql.split(';') if q.strip()]
        for query in queries:
            cursor.execute(query)
        
        conn.commit()
        print(f"✓ {filepath} exécuté avec succès")
    except Exception as e:
        conn.rollback()
        print(f"✗ Erreur dans {filepath}:", e)
    finally:
        cursor.close()

# Exécuter les deux fichiers
execute_sql_file('init.sql')
execute_sql_file('test.sql')