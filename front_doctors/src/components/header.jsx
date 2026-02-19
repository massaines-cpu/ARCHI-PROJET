import styled from 'styled-components';
import { Stethoscope, ShieldCheck, Heart, ShieldPlus } from 'lucide-react';

function HeaderTop() {
  return (
    <Container>
      <TitleContainer>
        <p>Alert<span>Infecti</span><img src="/corona-virus.png" alt="Logo infection" style={{ width: 30, height: 30 }} /><span>n</span></p>
        <ProBadge>Pro</ProBadge>
      </TitleContainer>


      <RoleBadge>
        <ShieldPlus size={18} strokeWidth={2} />
        Espace professionnels de santé
      </RoleBadge>
    </Container>
  );
}

export default HeaderTop;

const Container = styled.header`
  display: flex;
  width: 100vw;
  background-color: transparent;
  justify-content: space-between;
  align-items: center;
  padding: 20px;

  p {
    display: flex;
    align-items: center;
    margin: 0;
    font-size: 24px;
    font-family: 'Sora', sans-serif;
    font-weight: 700;
    color: white;
  }

  span {
    color: #e74c3c;
  }

`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;


const ProBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 3px 9px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.25);
  border-radius: 20px;
  color: #60a5fa;
  font-size: 10px;
  font-weight: 500;
`;

const RoleBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 20px;
  color: rgba(255, 255, 255, 0.55);
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;

  svg { color: #4ade80; flex-shrink: 0; }
`;
