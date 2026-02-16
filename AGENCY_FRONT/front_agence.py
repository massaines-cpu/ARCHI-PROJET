import streamlit as st
import pandas as pd
import requests
import datetime
url = ''
def get_infections():
    pass

st.title('Inscription de nouvelles infections')

if "infections" not in st.session_state:
    # st.session_state.infections = get_infections("infections")
    st.session_state.infections = [
        {"name": "aigreur", "date_infection": "2024-01-01", "level": "high"},
        {"name": "cynisme", "date_infection": "2024-01-05", "level": "medium"},
        {"name": "sarcasme", "date_infection": "2024-01-10", "level": "low"}
    ]
if "dateinfection" not in st.session_state:
    # st.session_state.infections = get_infections("infections")
    # st.session_state.dateinfection =
    pass

if "contamination" not in st.session_state:
    # st.session_state.infections = get_infections("infections")
    # st.session_state.contamination =
    pass

if "dateincubation" not in st.session_state:
    # st.session_state.infections = get_infections("infections")
    # st.session_state.dateincubation =
    pass
df = pd.DataFrame(st.session_state.infections)
st.table(df)

#ajouter
with st.form("ajout_infection"):
    nouvelle_infection = st.text_input("nom de l'infection")
    niveau = st.selectbox("niveau de contagion", ["low", "medium", "high", "critical"])
    submit_add = st.form_submit_button("ajouter l'infection")

    if submit_add and nouvelle_infection:
        nouvelle_donnees = {
            "name": nouvelle_infection,
            "date_infection": str(datetime.today()), #"%Y-%m-%d"
            "level": niveau
        }

        st.session_state.infections.append(nouvelle_donnees)

#delete
Infection = st.selectbox(
    "Selectionner une infection à supprimer",
    st.session_state.infections,
    key="infection_id")

if st.button("Effacer une infection"):

    reponse = requests.delete(url, json=Infection)
    if reponse.status_code == 200:
        pass



#map
data = pd.DataFrame([[1, 43.6033755861274, 1.4397677963289235, 'grippe', '10/05/2000'],
                   [2, 43.6, 1.50, 'rhume', '23/01/1970'],
                   [3, 43.6, 1.45, 'rhume', '02/01/1980']],
                  columns=["id", "lat", "lon", "infection", "contamination_date"])

couleurs = {
    "grippe": "#ff0000",
    "rhume": "#00ff00"
}

df = pd.DataFrame(data)

df["color"] = df["infection"].apply(lambda i: couleurs[i])
st.map(df, color='color')

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
