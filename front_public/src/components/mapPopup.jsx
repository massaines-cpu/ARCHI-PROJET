const MapPopup = ({ name, place, date, contagiosite, color }) => {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", minWidth: "160px" }}>
      <p style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "14px", color: "#ffffff", marginBottom: "10px" }}>
        {name}
      </p>
      <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
        Coordonnées
      </p>
      <p style={{ fontSize: "12px", color: "#e8e8f0", marginBottom: "8px" }}>
        {place}
      </p>
      <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
        Contamination
      </p>
      <p style={{ fontSize: "12px", color: "#e74c3c", marginBottom: "8px" }}>
        {date}
      </p>
      {contagiosite != null && (
        <>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>
            Contagiosité
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: color, boxShadow: `0 0 6px ${color}` }} />
            <span style={{ fontSize: "13px", fontWeight: 600, color: color }}>{contagiosite} / 5</span>
          </div>
        </>
      )}
    </div>
  );
};

export default MapPopup;
