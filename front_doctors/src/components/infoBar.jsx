import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Users, AlertTriangle, Activity, Biohazard, Clock } from 'lucide-react';

const InfoBar = ({ cases = [], infections = [] }) => {
  const [since] = useState(() => new Date(Date.now() - 24 * 60 * 60 * 1000));

  const newCasesLast24h = useMemo(() => {
    return cases.filter((c) => new Date(c.contamination_date) >= since).length;
  }, [cases, since]);

  const dominantInfection = useMemo(() => {
    if (!cases.length) return '—';
    const counts = cases.reduce((acc, c) => {
      acc[c.id_infection] = (acc[c.id_infection] || 0) + 1;
      return acc;
    }, {});
    const topId = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    return infections.find((inf) => String(inf.id) === String(topId))?.name ?? `Infection ${topId}`;
  }, [cases, infections]);

  const lastUpdate = useMemo(() => {
    if (!cases.length) return '—';
    const latest = cases
      .map((c) => new Date(c.contamination_date))
      .sort((a, b) => b - a)[0];
    return latest.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }, [cases]);

  return (
    <Container>
      <Stat>
        <Value $color="#60a5fa">{cases.length}</Value>
        <Label>Cas actifs</Label>
      </Stat>
      <Divider />
      <Stat>

        <Value $color={newCasesLast24h > 0 ? '#f97316' : '#4ade80'}>{newCasesLast24h}</Value>
        <Label>Nouveaux cas (24h)</Label>
      </Stat>
      <Divider />
      <Stat>
        <Value $color="#a78bfa">{infections.length}</Value>
        <Label>Infections recensées</Label>
      </Stat>
      <Divider />
      <Stat>
        <Value $color="#f87171" $small>{dominantInfection}</Value>
        <Label>Infection dominante</Label>
      </Stat>
    </Container>
  );
};

export default InfoBar;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 36px;
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  padding: 18px 20px;
  font-family: 'Inter', sans-serif;
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
`;

const IconContainer = styled.div`
  color: ${({ $color }) => $color};
  opacity: 0.8;
  margin-bottom: 2px;
`;

const Value = styled.span`
  font-size: ${({ $small }) => $small ? '15px' : '22px'};
  font-weight: 700;
  font-family: 'Sora', sans-serif;
  color: ${({ $color }) => $color ?? '#ffffff'};
`;

const Label = styled.span`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: rgba(255, 255, 255, 0.35);
`;

const Divider = styled.div`
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.08);
`;
