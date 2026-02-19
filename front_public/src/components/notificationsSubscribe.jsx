import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { Bell, X } from "lucide-react";

const NotificationsSubscribe = ({ open, onClose }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      
      await new Promise((r) => setTimeout(r, 800));
      setStatus("success");
      setEmail("");
      setTimeout(() => { setStatus(null); onClose(); }, 2000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus(null), 3000);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <TopRow>
          <TitleRow>
            <Bell size={15} strokeWidth={2} />
            <Title>Recevoir les alertes</Title>
          </TitleRow>
          <CloseBtn onClick={onClose}><X size={16} /></CloseBtn>
        </TopRow>
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading" || status === "success"}
            autoFocus
          />
          <SubmitBtn type="submit" $status={status} disabled={status === "loading" || status === "success" || !email.trim()}>
            {status === "loading" ? "..." : status === "success" ? "Inscrit !" : "S'abonner"}
          </SubmitBtn>
        </Form>
        {status === "error" && <ErrorText>Une erreur est survenue, réessayez.</ErrorText>}
      </Modal>
    </Overlay>
  );
};

export default NotificationsSubscribe;

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const slideUp = keyframes`from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); }`;
const apparition = keyframes`from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); }`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.2s ease;
`;

const Modal = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 420px;
  background: rgba(15, 15, 26, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px 28px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  animation: ${slideUp} 0.2s ease;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  svg { color: #3b82f6; flex-shrink: 0; }
`;

const Title = styled.span`
  font-family: 'Sora', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
  transition: color 0.15s;
  &:hover { color: rgba(255, 255, 255, 0.8); }
`;

const Form = styled.form`
  display: flex;
  gap: 8px;
`;

const Input = styled.input`
  flex: 1;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #e8e8f0;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 9px 12px;
  outline: none;
  transition: border-color 0.15s, background 0.15s;
  &::placeholder { color: rgba(255, 255, 255, 0.2); }
  &:focus {
    background: rgba(255, 255, 255, 0.07);
    border-color: rgba(59, 130, 246, 0.5);
  }
  &:disabled { opacity: 0.5; }
`;

const SubmitBtn = styled.button`
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 600;
  padding: 9px 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: #ffffff;
  white-space: nowrap;
  transition: opacity 0.2s, transform 0.15s;
  background: ${({ $status }) =>
    $status === "success" ? "linear-gradient(135deg, #16a34a, #15803d)" :
    $status === "error"   ? "linear-gradient(135deg, #dc2626, #b91c1c)" :
                            "linear-gradient(135deg, #3b82f6, #7c3aed)"};
  &:hover:not(:disabled) {
    opacity: 0.88;
    transform: translateY(-1px);
  }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const ErrorText = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  color: #e74c3c;
  animation: ${apparition} 0.15s ease;
`;
