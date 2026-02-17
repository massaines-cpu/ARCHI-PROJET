import streamlit as st
import pandas as pd
import requests
from datetime import date
url = ''
def get_infections():
    pass

st.title('inscription de nouvelles infections')

if "infections" not in st.session_state:
    # st.session_state.infections = get_infections("infections")
    st.session_state.infections = [
        {"name": "aigreur", "date_infection": "2024-01-01", "level": "high"},
        {"name": "cynisme", "date_infection": "2024-01-05", "level": "medium"},
        {"name": "sarcasme", "date_infection": "2024-01-10", "level": "low"}
    ]

df = pd.DataFrame(st.session_state.infections)
st.table(df)

#ajouter
with st.form("ajout_infection"):
    nouvelle_infection = st.text_input("nom de l'infection")
    date_infection = st.text_input("date d'infection (AAAA--MM--JJ)", str(date.today()))
    niveau = st.selectbox("niveau de contagion", ["low", "medium", "high", "critical"])
    submit_add = st.form_submit_button("ajouter l'infection")

    if submit_add and nouvelle_infection:
        nouvelle_donnees = {
            "name": nouvelle_infection,
            "date_infection": str(date.today()), #"%Y-%m-%d"
            "level": niveau
        }

        st.session_state.infections.append(nouvelle_donnees)
        st.rerun()

#delete modifier

infection_existante = [infection["name"] for infection in st.session_state.infections]
infection_selectionnee = st.selectbox("quelle infection modifier ?", infection_existante)

infos_actuelles = {}
for infection in st.session_state.infections:
    if infection["name"] == infection_selectionnee:
        infos_actuelles = infection

with st.form("form_modification"):
    st.write(f"modification de : {infection_selectionnee}")
    nouveau_nom_infection = st.text_input("nom", infos_actuelles["name"])
    nouvelle_date = st.text_input("date (AAAA--MM--JJ)",infos_actuelles["date_infection"])
    nouveau_niveau = st.selectbox("niveau", ["low", "medium", "high"], 0)

    valider = st.form_submit_button("sauvegarder les modifications")
    if valider:
        for infection in st.session_state.infections:
            if infection["name"] == infection_selectionnee:
                infection["name"] = nouveau_nom_infection
                infection["date_infection"] = nouvelle_date
                infection["level"] = nouveau_niveau

        st.success("l'infection a été mise à jour !")
        st.rerun()

    if st.form_submit_button("supprimer l'infection"):
        nouvelle_liste = []
        for infection in st.session_state.infections:
            if infection["name"] != infection_selectionnee:
                nouvelle_liste.append(infection)

        st.session_state.infections = nouvelle_liste

        st.warning("l'infection a été supprimée !")
        st.rerun()

#map
data = pd.DataFrame([
    [1, 43.6033, 1.4397, 'grippe', '10/05/2000'],
    [2, 43.6000, 1.5000, 'rhume', '23/01/1970'],
    [3, 43.5800, 1.4500, 'rhume', '02/01/1980']
], columns=["id", "lat", "lon", "infection", "contamination_date"])

couleurs = {
    "grippe": "#FF0000",
    "rhume": "#00FF00"
}
df = pd.DataFrame(data)

df["color"] = df["infection"].apply(lambda i: couleurs[i])
st.map(df, color='color')

# data = pd.DataFrame([[1, 43.6033755861274, 1.4397677963289235, 'grippe', '10/05/2000'],
#                    [2, 43.6, 1.50, 'rhume', '23/01/1970'],
#                    [3, 43.6, 1.45, 'rhume', '02/01/1980']],
#                   columns=["id", "lat", "lon", "infection", "contamination_date"])
#
# couleurs = {
#     "grippe": "#ff0000",
#     "rhume": "#00ff00"
# }
#


#retry/time out


# nouvelle_infection = st.text_input("Ajouter une nouvelle infection")
# if st.button("Ajouter l'infection"):
#     if nouvelle_infection not in st.session_state.infections:
#         st.session_state.infection.append(nouvelle_infection)
#         st.success("Infection ajoutée : " + nouvelle_infection)
#         reponse = requests.post(url, json=nouvelle_infection)
#
#         st.rerun()

# nom = st.session_state.infections
# date_infection = ''
# periode = ''
# contagiousness = ''
# date_incubation = ''
# lignes = key='id_infections'
#
# #liste
# mydict = {"name":nom,"date_infection":date_infection, "detection_period":periode,"contagiousness_level":contagiousness, "date_incubation":date_incubation}
# mydata = pd.DataFrame(mydict)
# st.table(mydata)

#mettre à jour
# if st.button("Mettre à jour"):
    # replace infection choisi par une nouvelle

    # reponse = requests.put(url, json=Infection)
    # if reponse.status_code == 200:
    #     pass
        # st.success("Ami.e ajouté.e dans la BDD")

# if "dateinfection" not in st.session_state:
#     # st.session_state.infections = get_infections("infections")
#     # st.session_state.dateinfection =
#     pass
#
# if "contamination" not in st.session_state:
#     # st.session_state.infections = get_infections("infections")
#     # st.session_state.contamination =
#     pass
#
# if "dateincubation" not in st.session_state:
#     # st.session_state.infections = get_infections("infections")
#     # st.session_state.dateincubation =
#     pass