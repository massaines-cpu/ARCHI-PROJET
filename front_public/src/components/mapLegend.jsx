import styled from "styled-components";

const MapLegend = () => {
  return (
    <Container>
      <Title>Contagiosité</Title>
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
