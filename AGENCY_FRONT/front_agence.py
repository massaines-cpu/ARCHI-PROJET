#front agency
import streamlit as st
import pandas as pd
import requests
from datetime import date

API_PASSERELLE = "http://127.0.0.1:8005"
API_INFECTION = "http://127.0.0.1:8002"  # ← le fallback appelle juste la racine /
API_CAS = "http://127.0.0.1:8000"        # ← pareil

def get_cases():
    try:
        res = requests.get(f"{API_PASSERELLE}/cases", timeout=2)
        res.raise_for_status()
        return res.json().get("data", [])
    except Exception:
        try:
            res = requests.get(f"{API_CAS}/cases", timeout=2)  # ← ajoute /cases
            res.raise_for_status()
            return res.json().get("data", [])
        except Exception as e2:
            st.error(f"Impossible de récupérer les cas: {e2}")
            return []

def get_infections():
    try:
        res = requests.get(f"{API_PASSERELLE}/infection", timeout=2)
        res.raise_for_status()
        return res.json()
    except Exception:
        try:
            res = requests.get(f"{API_INFECTION}/infection", timeout=2)  # ← ajoute /infection
            res.raise_for_status()
            return res.json()
        except Exception as e2:
            st.error(f"Impossible de récupérer les infections: {e2}")
            return []

def post_infection(data):
    try:
        res = requests.post(f"{API_PASSERELLE}/infection", json=data)
        if res.status_code == 201:
            st.success("Infection ajoutée via passerelle")
        elif res.status_code == 409:
            st.error("Ce nom d'infection existe déjà")
        else:
            st.error(f"Erreur API passerelle POST: {res.status_code}")
    except Exception:
        try:
            res = requests.post(f"{API_INFECTION}/infection", json=data)  # ← /infection ajouté
            if res.status_code == 201:
                st.success("Infection ajoutée directement")
            elif res.status_code == 409:
                st.error("Ce nom d'infection existe déjà")
            else:
                st.error(f"Erreur API directe POST: {res.status_code}")
        except Exception as e2:
            st.error(f"Impossible d'ajouter l'infection: {e2}")

def update_infection(id_infection, data):
    try:
        res = requests.put(f"{API_PASSERELLE}/infection/{id_infection}", json=data)
        if res.status_code == 200:
            st.success("Infection mise à jour via passerelle")
        else:
            st.error(f"Erreur API passerelle PUT: {res.status_code}")
    except Exception:
        try:
            res = requests.put(f"{API_INFECTION}/infection/{id_infection}", json=data)  # ← /infection ajouté
            if res.status_code == 200:
                st.success("Infection mise à jour directement")
            else:
                st.error(f"Erreur API directe PUT: {res.status_code}")
        except Exception as e2:
            st.error(f"Impossible de mettre à jour l'infection: {e2}")

def delete_infection(id_infection):
    try:
        res = requests.delete(f"{API_PASSERELLE}/infection/{id_infection}")
        if res.status_code == 204:
            st.warning("Infection supprimée via passerelle")
        else:
            st.error(f"Erreur API passerelle DELETE: {res.status_code}")
    except Exception:
        try:
            res = requests.delete(f"{API_INFECTION}/infection/{id_infection}")  # ← /infection ajouté
            if res.status_code == 204:
                st.warning("Infection supprimée directement")
            else:
                st.error(f"Erreur API directe DELETE: {res.status_code}")
        except Exception as e2:
            st.error(f"Impossible de supprimer l'infection: {e2}")

st.title('inscription de nouvelles infections')

donnees_infections = get_infections()
# st.write(donnees_infections)
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
cases = get_cases()
infections = get_infections()

infection_map = {inf["id"]: inf["name"] for inf in infections}

if cases:
    data_rows = []
    for case in cases:
        frequented = case.get("frequented_places", [])
        infection_id = case.get("id_infection")
        infection_name = infection_map.get(infection_id, "Inconnu")
        contamination_date = case.get("contamination_date")
        case_id = case.get("id")

        for point in frequented:
            # point = [lon, lat]
            data_rows.append({
                "id": case_id,
                "lat": point[1],
                "lon": point[0],
                "infection": infection_name,
                "contamination_date": contamination_date
            })

    df_map = pd.DataFrame(data_rows)

    if not df_map.empty:
        infections_disponibles = df_map["infection"].unique().tolist()
        selected_infections = st.multiselect(
            "Filtrer par infection",
            options=infections_disponibles,
            default=infections_disponibles
        )
        df_map = df_map[df_map["infection"].isin(selected_infections)]

        # Couleurs par infection
        couleurs = {
            "Covid-19": "#0000FF",
            "Grippe": "#FF0000",
            "Rougeole": "#FFA500",
            "Varicelle": "#800080",
            "Oreillons": "#00FF00",
            "Hépatite A": "#00FFFF",
            "Tuberculose": "#A52A2A",
            "Paludisme": "#008080",
            "Dengue": "#FFC0CB",
            "Zika": "#808000"
        }
        df_map["color"] = df_map["infection"].apply(lambda i: couleurs.get(i, "#888888"))

        st.map(df_map, color="color")
    else:
        st.info("Aucune localisation disponible pour les cas.")
else:
    st.warning("Impossible de récupérer les cas depuis l'API.")

