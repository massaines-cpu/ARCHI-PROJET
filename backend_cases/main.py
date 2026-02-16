from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import CaseCreate, CaseUpdate
from data.data_base import Database  # ← Changez ici
from datetime import datetime
app = FastAPI()

# ---------------- cors initialisation ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- singleton db ----------------
db_instance = Database()

# ---------------- reponse json ----------------
def json_response(data=None, message="", error=None):
    return {
        "data": data,
        "message": message,
        "error": error
    }

# ---------------- routes ----------------

#----------------create a case -----------------------
@app.post("/case")
def create_case(case_data: CaseCreate):
    cursor = db_instance.get_cursor()
    connection = db_instance.get_connection()
    try:
        sql = """
            INSERT INTO cases (id_infection, name, contamination_date, frequented_place)
            VALUES (%s, %s, %s, %s)
        """
        cursor.execute(sql, (
            case_data.id_infection,
            case_data.name,
            case_data.contamination_date,
            case_data.frequented_place
        ))
        connection.commit()
        return json_response(
        data={
        "id": cursor.lastrowid,
        "name": case_data.name,
         "contamination_date": case_data.contamination_date.strftime("%Y-%m-%d %H:%M:%S"),
         "frequented_place": case_data.frequented_place
         },
        message="Case created successfully",
        error=None)
    except Exception as e:
        connection.rollback()
        return json_response(
            data=None,
            message="Failed to create case",
            error=str(e)
        )
    finally:
        cursor.close()

# ---------------- read a case ----------------
@app.get("/case/{case_id}")
def get_case(case_id: int):
    cursor = db_instance.get_cursor()
    try:
        cursor.execute("SELECT * FROM cases WHERE id=%s", (case_id,))
        result = cursor.fetchone()
        if not result:
            return json_response(
                data=None,
                message="Case not found",
                error="No case with this ID"
            )
        case_dict = dict(zip(["id", "id_infection", "name", "contamination_date", "frequented_place"], result))
        
        # Fix datetime serialization
        if case_dict.get('contamination_date') and isinstance(case_dict['contamination_date'], datetime):
            case_dict['contamination_date'] = case_dict['contamination_date'].strftime('%Y-%m-%d %H:%M:%S')
        
        return json_response(
            data=case_dict,
            message="Success",
            error=None
        )
    except Exception as e:
        return json_response(
            data=None,
            message="Failed to fetch case",
            error=str(e)
        )
    finally:
        cursor.close()

# ---------------- update a case ----------------
@app.put("/case/{case_id}")
def update_case(case_id: int, case_data: CaseUpdate):
    cursor = db_instance.get_cursor()
    connection = db_instance.get_connection()
    try:
        sql = """
            UPDATE cases
            SET id_infection=%s, name=%s, contamination_date=%s, frequented_place=%s
            WHERE id=%s
        """
        cursor.execute(sql, (
            case_data.id_infection,
            case_data.name,
            case_data.contamination_date,
            case_data.frequented_place,
            case_id
        ))
        connection.commit()
        return json_response(
            data=None,
            message="Case updated successfully",
            error=None
        )
    except Exception as e:
        connection.rollback()
        return json_response(
            data=None,
            message="Failed to update case",
            error=str(e)
        )
    finally:
        cursor.close()

# ---------------- delete a case ----------------
@app.delete("/case/{case_id}")
def delete_case(case_id: int):
    cursor = db_instance.get_cursor()
    connection = db_instance.get_connection()
    try:
        sql = "DELETE FROM cases WHERE id=%s"
        cursor.execute(sql, (case_id,))
        connection.commit()
        return json_response(
            data=None,
            message="Case deleted successfully",
            error=None
        )
    except Exception as e:
        connection.rollback()
        return json_response(
            data=None,
            message="Failed to delete case",
            error=str(e)
        )
    finally:
        cursor.close()