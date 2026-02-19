import { useState } from "react";
import styled from "styled-components";
import { List, RotateCcw } from "lucide-react";
import { getContagionLevelColor } from "../tools/contagionLevel";

const ListOfCases = ({ cases = [], infections = [] }) => {
  const [filterName, setFilterName] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const casesWithInfection = cases.map((c) => {
    const infection = infections.find((inf) => String(inf.id) === String(c.id_infection));
    return {
      ...c,
      infectionName: infection?.name ?? c.id_infection,
      contagionLevel: infection?.contagion_level,
    };
  });

  const uniqueInfections = [...new Set(casesWithInfection.map((c) => c.infectionName))];

  const filtered = casesWithInfection.filter((c) => {
    const matchName = filterName ? c.infectionName === filterName : true;
    const matchDate = filterDate ? c.contamination_date === filterDate : true;
    return matchName && matchDate;
  });

  const hasFilters = filterName || filterDate;

  return (
    <MainContainer>
      <TopRow>
        <TitleRow>
          <Title>Liste des cas</Title>
          <Count>{filtered.length}</Count>
        </TitleRow>
        <Filters>
          <FilterLabel>
            <LabelText>Infection</LabelText>
            <Select value={filterName} onChange={(e) => setFilterName(e.target.value)}>
              <option value="">Toutes</option>
              {uniqueInfections.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </Select>
          </FilterLabel>
          <FilterLabel>
            <LabelText>Date</LabelText>
            <DateInput
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </FilterLabel>
          {hasFilters && (
            <ResetBtn onClick={() => { setFilterName(""); setFilterDate(""); }}>
              <RotateCcw size={13} />
              Réinitialiser
            </ResetBtn>
          )}
        </Filters>
      </TopRow>

      <LigneSeparation />

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <Th>#</Th>
              <Th>Nom</Th>
              <Th>Infection</Th>
              <Th>Date de contamination</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <EmptyCell colSpan={4}>Aucun résultat</EmptyCell>
              </tr>
            ) : (
              filtered.map((c, i) => (
                <Row key={c.id}>
                  <Td $dim>{i + 1}</Td>
                  <Td>{c.name}</Td>
                  <Td><InfectionBadge $color={getContagionLevelColor(c.contagionLevel)}>{c.infectionName}</InfectionBadge></Td>
                  <Td $dim>{c.contamination_date}</Td>
                </Row>
              ))
            )}
          </tbody>
        </Table>
      </TableWrapper>
    </MainContainer>
  );
};

export default ListOfCases;

const MainContainer = styled.div`
  width: 80%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 24px 28px;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4);
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 14px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  svg { color: #3b82f6; flex-shrink: 0; }
`;

const Title = styled.h2`
  font-family: 'Sora', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
`;

const Count = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.12);
  border: 1px solid rgba(59, 130, 246, 0.25);
  border-radius: 20px;
  padding: 2px 8px;
`;

const Filters = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 12px;
  flex-wrap: wrap;
`;

const FilterLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const LabelText = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: rgba(255, 255, 255, 0.35);
`;

const baseInput = `
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #e8e8f0;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 7px 10px;
  outline: none;
  transition: border-color 0.15s;
  &:focus { border-color: rgba(59, 130, 246, 0.5); }
`;

const Select = styled.select`
  ${baseInput}
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.3)' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 12px;
  padding-right: 28px;
  option { background: #0f0f1a; color: #e8e8f0; }
`;

const DateInput = styled.input`
  ${baseInput}
  &[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); cursor: pointer; }
`;

const ResetBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  padding: 7px 12px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
  &:hover { border-color: rgba(255, 255, 255, 0.22); color: rgba(255, 255, 255, 0.7); }
`;

const LigneSeparation = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.07);
  margin: 18px 0;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
`;

const Th = styled.th`
  text-align: left;
  padding: 10px 14px;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: rgba(255, 255, 255, 0.35);
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
`;

const Row = styled.tr`
  transition: background 0.15s;
  &:hover td { background: rgba(255, 255, 255, 0.03); }
`;

const Td = styled.td`
  padding: 11px 14px;
  color: ${({ $dim }) => $dim ? "rgba(255,255,255,0.4)" : "#e8e8f0"};
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const InfectionBadge = styled.span`
  font-size: 11px;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 20px;
  background: ${({ $color }) => $color ? `${$color}1a` : "rgba(167,139,250,0.1)"};
  border: 1px solid ${({ $color }) => $color ? `${$color}40` : "rgba(167,139,250,0.25)"};
  color: ${({ $color }) => $color ?? "#a78bfa"};
`;

const EmptyCell = styled.td`
  padding: 32px;
  text-align: center;
  color: rgba(255, 255, 255, 0.25);
  font-family: 'Inter', sans-serif;
  font-size: 13px;
`;
