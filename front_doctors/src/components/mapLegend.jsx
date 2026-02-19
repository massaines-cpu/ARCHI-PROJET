import styled from "styled-components";
import { getContagionLevelColor, getContagionLevelName } from "../tools/contagionLevel";

const LEVELS = [0.05, 0.2, 0.4, 0.6, 0.9];

const MapLegend = () => {
  return (
    <Container>
      <Title>Contagiosité</Title>
      {LEVELS.map((level) => {
        const color = getContagionLevelColor(level);
        return (
          <Row key={level}>
            <Dot $color={color} />
            <Label>{getContagionLevelName(level)}</Label>
          </Row>
        );
      })}
    </Container>
  );
};

export default MapLegend;

const Container = styled.div`
  position: absolute;
  bottom: 36px;
  left: 16px;
  z-index: 1000;
  background: rgba(14, 14, 26, 0.82);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Title = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.35);
  margin-bottom: 2px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${({ $color }) => $color};
  box-shadow: 0 0 5px ${({ $color }) => $color};
`;

const Label = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.75);
`;
