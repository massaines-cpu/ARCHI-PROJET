faut dire ce qu'on a fait ?

j'ai fait un front MAGNIFIQUE avec une carte qui marche bien

on peut ajouter de nouvelles infections, les modifier, les effacer NORMALEMENT ça marche

la map affiche l'infection associée à un cas qui est lui même associé a des données géographiques

Description
Interface de gestion des infections destinee aux agences de sante. Permet d'ajouter, modifier et supprimer des infections, et de visualiser les cas sur une carte interactive.
Prerequis

Python 3.x
L'API Passerelle lancee sur http://127.0.0.1:8005

Installation
bashcd AGENCY_FRONT
pip install -r requirements.txt
Lancer le front
bashstreamlit run app.py
Accessible sur http://localhost:8501
Fonctionnalites

Tableau des infections enregistrees
Formulaire d'ajout d'une nouvelle infection
Modification et suppression d'une infection existante
Carte des cas avec filtre par infection et couleur par type

Configuration des APIs
Les URLs sont definies en haut du fichier app.py :
pythonAPI_PASSERELLE = "http://127.0.0.1:8005"
API_INFECTION  = "http://127.0.0.1:8002"
API_CAS        = "http://127.0.0.1:8000"
Le front appelle la passerelle en priorite. En cas d'indisponibilite, il bascule automatiquement sur les APIs directes.
Dependances

streamlit
requests
pandas