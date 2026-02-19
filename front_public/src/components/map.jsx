import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styled from "styled-components";
import MapPopup from "./mapPopup";
import FilterForMap from "./filterForMap";
import MapLegend from "./mapLegend";
import { getContagionLevelColor } from "../tools/contagionLevel";


export default function Map({ cases = [], infections = [] }) {
  const [filteredCases, setFilteredCases] = useState(cases);

  useEffect(() => {
    console.log("infec :", infections);
  }, [infections]);

  return (
    <MapWrapper>
      <MapLegend />
      <FilterWrapper>
        <FilterForMap cases={cases} setCases={setFilteredCases} infections={infections} />
      </FilterWrapper>
      <MapContainer
        center={[46.603, 1.888]}
        zoom={6}
        zoomControl={false}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom={19}
        />
        <ZoomControl position="bottomright" />
        {filteredCases.map((c) => {
          // Je recup infection qui correspond à l'id du cas et je recup la couleur de contagion pour cette infection
          const infection = infections.find((inf) => String(inf.id) === String(c.id_infection));
          const color = getContagionLevelColor(infection?.contagion_level);
          
          return c.frequented_places?.map(([lng, lat], i) => (
            <CircleMarker
              key={`${c.name}-${i}`}
              center={[lat, lng]}
              radius={9}
              fillColor={color}
              color={color}
              weight={8}
              fillOpacity={0.9}
              opacity={0.35}
            >
              <Popup maxWidth={300}>
                <MapPopup
                  name={c.name}
                  lat={lat}
                  lng={lng}
                  date={c.contamination_date}
                  contagionLevel={infection?.contagion_level}
                  infectionName={infection?.name}
                />
              </Popup>
            </CircleMarker>
          ));
        })}
      </MapContainer>
    </MapWrapper>
  );
}

const MapWrapper = styled.div`
  position: relative;
  width: 80%;
  height: 600px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255,255,255,0.04);
`;

const FilterWrapper = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 1000;
`;
