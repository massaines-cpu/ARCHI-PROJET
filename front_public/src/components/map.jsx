import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";
import MapPopup from "./mapPopup";
import FilterForMap from "./filterForMap";

export default function Map({ cases = [], infections = [] }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersLayer = useRef(null);
  const [filteredCases, setFilteredCases] = useState(cases);

  useEffect(() => {
    if (mapInstance.current) return;
    const L = window.L;

    mapInstance.current = L.map(mapRef.current, { zoomControl: false }).setView([46.603, 1.888], 6);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
    }).addTo(mapInstance.current);

    L.control.zoom({ position: "bottomright" }).addTo(mapInstance.current);

    markersLayer.current = L.layerGroup().addTo(mapInstance.current);

    return () => {
      mapInstance.current.remove();
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    const L = window.L;
    if (!markersLayer.current) return;

    markersLayer.current.clearLayers();

    filteredCases.forEach((c) => {
      if (!c.frequented_places?.length) return;

      c.frequented_places.forEach(([lng, lat]) => {
        L.circleMarker([lat, lng], {
          radius: 9,
          fillColor: "#e74c3c",
          color: "rgba(231, 76, 60, 0.35)",
          weight: 8,
          fillOpacity: 0.9,
        })
          .bindPopup(() => {
            const container = document.createElement("div");
            createRoot(container).render(
              <MapPopup name={c.name} place={`${lat}, ${lng}`} date={c.contamination_date} />
            );
            return container;
          })
          .addTo(markersLayer.current);
      });
    });
  }, [filteredCases]);

  return (
    <MapWrapper>
      <FilterWrapper>
        <FilterForMap cases={cases} setCases={setFilteredCases} infections={infections} />
      </FilterWrapper>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
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
