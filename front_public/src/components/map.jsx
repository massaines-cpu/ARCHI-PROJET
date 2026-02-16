import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import MapPopup from "./mapPopup";
import FilterForMap from "./filterForMap";

export default function Map({ cases = [] }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersLayer = useRef(null);
  const [filteredCases, setFilteredCases] = useState(cases);

  useEffect(() => {
    if (mapInstance.current) return;
    const L = window.L;

    mapInstance.current = L.map(mapRef.current).setView([46.603, 1.888], 6);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(mapInstance.current);

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
      c.locations.forEach((loc) => {
        L.circleMarker([loc.lat, loc.lng], {
          radius: 10,
          fillColor: "blue",
          color: "red",
          fillOpacity: 0.4,
        })
          .bindPopup(() => {
            const container = document.createElement("div");
            createRoot(container).render(
              <MapPopup infectionName={c.infectionName} label={loc.label} detectionDate={c.detectionDate} />
            );
            return container;
          })
          .addTo(markersLayer.current);
      });
    });
  }, [filteredCases]);

  return (
    <div style={{ width: "59%", height: "600px", position: "relative" }}>
      <div style={{ position: "absolute", top: "20px", right: "10px", zIndex: 1000 }}>
        <FilterForMap cases={cases} setCases={setFilteredCases} />
      </div>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}