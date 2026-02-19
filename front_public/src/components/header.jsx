import styled from 'styled-components';
import { Bell } from 'lucide-react';

function HeaderTop() {
  return (
    <Container>
        <p>Alert<span>Infection</span></p>
        <SubscribeButton>
          <Bell size={15} strokeWidth={2} />
          S'abonner aux alertes
        </SubscribeButton>
    </Container>
  )
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

const SubscribeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #3b82f6, #7c3aed);
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  transition: opacity 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;

  &:hover {
    opacity: 0.85;
    transform: translateY(-1px);
    box-shadow: 0 0 16px 4px rgba(99, 102, 241, 0.45);
  }
`;
