import { useState } from "react";
import styled from "styled-components";

const ListOfCases = ({ cases }) => {
  const [filterName, setFilterName] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const uniqueNames = [...new Set(cases.map((c) => c.infectionName))];

  const filtered = cases.filter((c) => {
    const matchName = filterName ? c.infectionName === filterName : true;
    const matchDate = filterDate ? c.detectionDate === filterDate : true;
    return matchName && matchDate;
  });

  return (
    <MainContainer>
      <h2>Liste des cas</h2>

      <Filters>
        <label>
          Infection
          <select value={filterName} onChange={(e) => setFilterName(e.target.value)}>
            <option value="">Toutes</option>
            {uniqueNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Date de détection
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </label>

        <ResetButton onClick={() => { setFilterName(""); setFilterDate(""); }}>
          Réinitialiser
        </ResetButton>
      </Filters>

      <Table>
        <thead>
          <tr>
            <th>#</th>
            <th>Infection</th>
            <th>Date de détection</th>
            <th>Lieux</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", color: "#888" }}>
                Aucun résultat
              </td>
            </tr>
          ) : (
            filtered.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.infectionName}</td>
                <td>{c.detectionDate}</td>
                <td>
                  {c.locations.map((loc, i) => (
                    <LocationTag key={i}>
                      {loc.label}
                    </LocationTag>
                  ))}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </MainContainer>
  );
};

export default ListOfCases;

const MainContainer = styled.div`
  width: 100%;
  max-width: 900px;
  padding: 0 16px;
`;

const Filters = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-end;
  margin-bottom: 16px;
  flex-wrap: wrap;

  label {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 0.85rem;
    font-weight: 600;
  }

  select,
  input[type="date"] {
    padding: 6px 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 0.9rem;
  }
`;

const ResetButton = styled.button`
  padding: 6px 14px;
  border: none;
  border-radius: 6px;
  background: #e0e0e0;
  cursor: pointer;
  font-size: 0.85rem;

  &:hover {
    background: #c8c8c8;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;

  th, td {
    padding: 10px 14px;
    border: 1px solid #4a4a5a;
    text-align: left;
    color: #e8e8f0;
  }

  th {
    background: #2a2a3d;
    font-weight: 600;
    color: #ffffff;
  }

  tr td {
    background: #1a1a2e;
  }

  tr:nth-child(even) td {
    background: #16213e;
  }

  tr:hover td {
    background: #0f3460;
  }
`;

const LocationTag = styled.span`
  display: inline-block;
  margin: 2px 4px 2px 0;
  padding: 2px 8px;
  background: #e8f0fe;
  color: #1a56db;
  border-radius: 12px;
  font-size: 0.8rem;
`;
