import { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';

const FilterForMap = ({ cases, setCases }) => {
  const [open, setOpen] = useState(false);
  const [infectionFilter, setInfectionFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [zoneFilter, setZoneFilter] = useState('');

  const zones = useMemo(() => {
    const labels = cases.flatMap((c) => c.locations.map((l) => l.label));
    return [...new Set(labels)];
  }, [cases]);

  useEffect(() => {
    let filtered = cases;

    if (infectionFilter.trim()) {
      filtered = filtered.filter((c) =>
        c.infectionName.toLowerCase().includes(infectionFilter.toLowerCase())
      );
    }

    if (dateFilter) {
      filtered = filtered.filter((c) => c.detectionDate === dateFilter);
    }

    if (zoneFilter) {
      filtered = filtered.filter((c) =>
        c.locations.some((l) => l.label === zoneFilter)
      );
    }

    setCases(filtered);
  }, [infectionFilter, dateFilter, zoneFilter, cases, setCases]);

  const handleReset = () => {
    setInfectionFilter('');
    setDateFilter('');
    setZoneFilter('');
  };

  const hasActiveFilters = infectionFilter || dateFilter || zoneFilter;

  return (
    <Wrapper>
      <ToggleButton onClick={() => setOpen((v) => !v)}>
        <span>Filtres</span>
        {hasActiveFilters && <ActiveDot />}
        <Arrow $open={open}>▾</Arrow>
      </ToggleButton>

      {open && (
        <Panel>
          <Field>
            <FieldLabel>Infection</FieldLabel>
            <Select
              value={infectionFilter}
              onChange={(e) => setInfectionFilter(e.target.value)}
            >
              <option value="">Toutes</option>
              {Array.from(new Set(cases.map((c) => c.infectionName))).map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </Select>
          </Field>

          <Field>
            <FieldLabel>Date</FieldLabel>
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </Field>

          <Field>
            <FieldLabel>Zone</FieldLabel>
            <Select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
            >
              <option value="">Toutes</option>
              {zones.map((z) => (
                <option key={z} value={z}>{z}</option>
              ))}
            </Select>
          </Field>

          {hasActiveFilters && (
            <ResetButton onClick={handleReset}>Réinitialiser</ResetButton>
          )}
        </Panel>
      )}
    </Wrapper>
  );
};

export default FilterForMap;

const Wrapper = styled.div`
  font-family: sans-serif;
  font-size: 12px;
  min-width: 160px;
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(20, 20, 30, 0.75);
  backdrop-filter: blur(6px);
  color: #e0e0e0;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  width: 100%;
  justify-content: space-between;

  &:hover {
    background: rgba(30, 30, 45, 0.85);
  }
`;

const ActiveDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #e74c3c;
  flex-shrink: 0;
`;

const Arrow = styled.span`
  transition: transform 0.15s;
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'rotate(0deg)')};
  line-height: 1;
`;

const Panel = styled.div`
  margin-top: 4px;
  padding: 10px;
  background: rgba(20, 20, 30, 0.82);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const FieldLabel = styled.span`
  color: rgba(255, 255, 255, 0.45);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const inputStyles = `
  padding: 5px 8px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 4px;
  color: #e0e0e0;
  font-size: 12px;
  outline: none;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const Input = styled.input`${inputStyles}`;
const Select = styled.select`
  ${inputStyles}
  cursor: pointer;

  option {
    background: #1e1e2e;
    color: #e0e0e0;
  }
`;

const ResetButton = styled.button`
  margin-top: 2px;
  padding: 4px 0;
  background: transparent;
  border: 1px solid rgba(231, 76, 60, 0.5);
  border-radius: 4px;
  color: rgba(231, 76, 60, 0.85);
  font-size: 11px;
  cursor: pointer;
  width: 100%;

  &:hover {
    background: rgba(231, 76, 60, 0.1);
    border-color: #e74c3c;
    color: #e74c3c;
  }
`;
