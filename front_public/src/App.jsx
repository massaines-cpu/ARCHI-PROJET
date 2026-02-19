import { useEffect, useState } from 'react';
import './App.css'
import Map from './components/map';
import HeaderTop from './components/header';
import styled from 'styled-components';
import ListOfCases from './components/listOfCases';
import { getCases, getInfections } from './api/api';
import InfoBar from './components/infoBar';

function App() {
  const [cases, setCases] = useState([]);
  const [infections, setInfections] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCases()
      .then((data) => setCases(data.data))
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    getInfections()
      .then((data) => {
        setInfections(data);
        console.log("Infections fetched in App:", data);
      })
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    console.log("Infections in App:", infections);
  }, [infections]);

  if (error) return <p>Erreur : {error}</p>;

  return (
    <Container>
      <div>
        <HeaderTop />
        <InfoBar cases={cases} infections={infections} />
      </div>
      <Map cases={cases} infections={infections} />
      <ListOfCases cases={cases} infections={infections} />
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

