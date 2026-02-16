import './App.css'
import Map from './components/map';
import HeaderTop from './components/header';
import styled from 'styled-components';
import ListOfCases from './components/listOfCases';

function App() {
  const cases = [
    {
      id: "1",
      infectionName: "Rougeole",
      detectionDate: "2026-02-10",
      locations: [
        { label: "Domicile", lat: 48.8566, lng: 2.3522 },
        { label: "Travail", lat: 48.8606, lng: 2.3376 },
      ],
    },
    {
      id: "2",
      infectionName: "Grippe",
      detectionDate: "2026-02-08",
      locations: [
        { label: "École", lat: 43.6047, lng: 1.4442 },
      ],
    },
  ];

  return (
    <Container>
      <HeaderTop />
      <ListOfCases cases={cases} />
      <Map cases={cases} />
    </Container>
  )

  
}

export default App;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 120px;
  margin-bottom: 100px;
`;

