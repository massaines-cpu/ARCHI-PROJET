import "./App.css";
import { useEffect, useState } from "react"; 
// MODIFIÉ : ajout des hooks React pour gérer l’état et les appels API

import Map from "./components/map";
import HeaderTop from "./components/header";
import styled from "styled-components";
import ListOfCases from "./components/listOfCases";

function App() {

  const [cases, setCases] = useState([]); 
  // MODIFIÉ : remplacement des données statiques par un state dynamique
  // afin de stocker les données provenant du backend

  useEffect(() => {
    fetch("http://localhost:8002/infection")
      // MODIFIÉ : appel du backend infections au lieu des données mockées

      .then((r) => r.json())
      .then((infections) => {

        const mapped = infections.map((inf, idx) => ({
          id: String(inf.id ?? idx + 1),
          infectionName: inf.name ?? "Unknown",
          detectionDate: new Date().toISOString().slice(0, 10),
          locations: [],
        }));
        // MODIFIÉ : mapping des données backend vers la structure attendue
        // par le frontend (cases avec infectionName, detectionDate, locations)

        setCases(mapped);
        // MODIFIÉ : mise à jour du state avec les données récupérées
      })
      .catch(console.error);

  }, []); 
  // MODIFIÉ : useEffect exécuté une seule fois au chargement du composant


  return (
    <Container>
      <HeaderTop />
      <ListOfCases cases={cases} /> 
      {/* MODIFIÉ : utilisation des données dynamiques au lieu des données mock */}

      <Map cases={cases} /> 
      {/* MODIFIÉ : la carte reçoit aussi les données venant du backend */}
    </Container>
  );

}

export default App;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 120px;
  margin-bottom: 100px;
`;
