import { useEffect, useState } from "react";
import axios from "axios";
import styled, { createGlobalStyle } from "styled-components";
import { getContagionLevelName, getContagionLevelColor } from "../tools/contagionLevel";



const MapPopup = ({ name, lat, lng, date, contagionLevel, infectionName }) => {
  const [city, setCity] = useState(null);

  useEffect(() => {
    axios.get(`/nominatim/reverse?lat=${lat}&lon=${lng}&format=json`)
      .then(({ data }) => {
        const a = data.address;
        setCity(a.city || a.town || a.village || a.municipality || "Inconnu");
      })
      .catch(() => setCity("Inconnu"));
  }, [lat, lng]);

  useEffect(() => {
    console.log("Contagion level in popup :", contagionLevel);
  }, [contagionLevel]);

  return (
    <>
      <LeafletPopupSurcharge />
      <Container>
        <Header>
          <Name>{name}</Name>
        </Header>

        <Divider />
        <Row>
          <RowLabel>Infection</RowLabel>
          <span style={{ color: getContagionLevelColor(contagionLevel) }}>{infectionName}</span>
        </Row>

        <Row>
          <RowLabel>Contagiosité</RowLabel>
          <span style={{ color: getContagionLevelColor(contagionLevel) }}>{getContagionLevelName(contagionLevel)}</span>
        </Row>

        <Row>
          <RowLabel>Localisation</RowLabel>
          <span>{city ?? "..."}</span>
        </Row>

        <Row>
          <RowLabel>Date</RowLabel>
          <span>{date}</span>
        </Row>
      </Container>
    </>
  );
};

export default MapPopup;

const LeafletPopupSurcharge = createGlobalStyle`
  .leaflet-popup-content-wrapper {
    background: #0f0f1a;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
    padding: 12px 14px;
    color: inherit;
  }
  .leaflet-popup-tip {
    background: #0f0f1a;
  }
  .leaflet-popup-content {
    margin: 0;
  }
`;

const Container = styled.div`
  font-family: 'Inter', sans-serif;
  min-width: 190px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e74c3c;
  box-shadow: 0 0 8px #e74c3c;
  flex-shrink: 0;
`;

const Name = styled.span`
  font-family: 'Sora', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: #ffffff;
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin-bottom: 10px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 6px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const RowLabel = styled.span`
  font-size: 10px;
  color: rgba(255, 255, 255, 0.35);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  flex-shrink: 0;
`;

