import streamlit as st
import pandas as pd
import requests
from datetime import date

BASE_URL = "http://127.0.0.1:8002/infection"
BASE_URL2 = "http://127.0.0.1:8000/case"

def get_loc():
    try:
        res = requests.get(BASE_URL2)
        if res.status_code == 200:
            return res.json()
        return []
    except Exception as e:
        st.error(f"erreur connexion API (get): {e}")
        return []

def get_infections():
    try:
        res = requests.get(BASE_URL)
        if res.status_code == 200:
            return res.json()
        return []
    except Exception as e:
        st.error(f"erreur connexion API (get): {e}")
        return []

def post_infection(data):
    try:
        res = requests.post(BASE_URL, json=data)
        if res.status_code == 201:
            st.success("infection envoyée à API")
        elif res.status_code == 409:
            st.error("ce nom d'infection existe déjà.")
    except Exception as e:
        st.error(f"erreur API (post): {e}")

def delete_infection(id_infection):
    try:
        res = requests.delete(f"{BASE_URL}/{id_infection}")
        if res.status_code == 204:
            st.warning("infection supprimée")
    except Exception as e:
        st.error(f"erreur API (delete): {e}")

def update_infection(id_infection, data):
    try:
        res = requests.put(f"{BASE_URL}/{id_infection}", json=data)
        if res.status_code == 200:
            st.success("mise à jour réussie")
    except Exception as e:
        st.error(f"erreur API (put): {e}")

st.title('inscription de nouvelles infections')

donnees_infections = get_infections()
st.write(donnees_infections)
if donnees_infections:
    df = pd.DataFrame(donnees_infections)
    st.table(df)

#ajouter
with st.form("ajout_infection"):
    name = st.text_input("nom de l'infection")
    incubation = st.number_input("jours d'incubation", min_value=0, max_value=365, value=5)
    detection = st.date_input("date de détection", value=date.today())
    contagion = st.number_input("jours de contagion", min_value=0, max_value=365, value=10)

    level = st.number_input('niveau de contagion (0.0 à 1.0)', min_value=0.0, max_value=1.0, step=0.1, value=0.5)

    submit_add = st.form_submit_button("ajouter l'infection")

    if submit_add and name:
        payload = {
            "name": name,
            "incubation_days": int(incubation),
            "detection_date": str(detection),
            "contagion_days": int(contagion),
            "contagion_level": float(level)
        }
        post_infection(payload)
        st.rerun()

#delete modifier
infections_bdd = get_infections()
if infections_bdd:
    infection_existante = [infection["name"] for infection in infections_bdd]
    infection_selectionnee = st.selectbox("quelle infection modifier ?", infection_existante)

    infections_actuelles = {}
    for infection in infections_bdd:
        if infection["name"] == infection_selectionnee:
            infections_actuelles = infection

    with st.form("form_modification"):
        st.write(f"modification de : {infection_selectionnee}")

        nouveau_nom = st.text_input("nom", infections_actuelles["name"])
        nouveau_niveau = st.number_input('niveau', min_value=0.0, max_value=1.0, value=float(infections_actuelles["contagion_level"]))
        nouveau_incubation = st.number_input("jours d'incubation", value=int(infections_actuelles["incubation_days"]))
        nouvelle_detection = st.date_input("date de détection", value=date.today())
        nouveau_contagion = st.number_input("jours de contagion", value=int(infections_actuelles["contagion_days"]))
        valider = st.form_submit_button("sauvegarder les modifications")
        supprimer = st.form_submit_button("supprimer l'infection")

        if valider:
            payload_update = {
                "name": nouveau_nom,
                "incubation_days": int(nouveau_incubation),
                "detection_date": str(nouvelle_detection),
                "contagion_days": int(nouveau_contagion),
                "contagion_level": float(nouveau_niveau)
            }
            update_infection(infections_actuelles["id"], payload_update)
            st.success("l'infection a été mise à jour !")
            st.rerun()

        if supprimer:
            delete_infection(infections_actuelles["id"])
            st.rerun()

#map
cases = get_loc()
st.write(cases)

if cases and "data" in cases:
    data_rows = []
    for case in cases["data"]:
        frequented = case.get("frequented_places")
        infection_name = case.get("name")
        contamination_date = case.get("contamination_date")
        case_id = case.get("id")

        if frequented:
            for point in frequented:
                data_rows.append({
                    "id": case_id,
                    "lat": point[1],
                    "lon": point[0],
                    "infection": infection_name,
                    "contamination_date": contamination_date
                })

    if data_rows:
        df_map = pd.DataFrame(data_rows)
        couleurs = {
            "grippe": "#FF0000",
            "rhume": "#00FF00",
            "covid": "#0000FF"
        }
        df_map["color"] = df_map["infection"].apply(lambda i: couleurs.get(i, "#888888"))

        st.map(df_map, color="color")
    else:
        st.info("Aucune localisation disponible pour les cas.")
else:
    st.warning("Impossible de récupérer les cas depuis l'API.")









# data = pd.DataFrame([
#     [1, 43.6033, 1.4397, 'grippe', '10/05/2000'],
#     [2, 43.6000, 1.5000, 'rhume', '23/01/1970'],
#     [3, 43.5800, 1.4500, 'rhume', '02/01/1980']
# ], columns=["id", "lat", "lon", "infection", "contamination_date"])
#
# couleurs = {
#     "grippe": "#FF0000",
#     "rhume": "#00FF00"
# }
# df = pd.DataFrame(data)
#
# df["color"] = df["infection"].apply(lambda i: couleurs[i])
# st.map(df, color='color')

