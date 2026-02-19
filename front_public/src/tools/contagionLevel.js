export const getContagionLevelColor = (level) => {
  if (level < 0.1) return "#27ae60";
  if (level < 0.3) return "#2ecc71";
  if (level < 0.5) return "#f1c40f";
  if (level < 0.75) return "#e67e22";
  if (level >= 0.75) return "#c0392b";
};

export const getContagionLevelName = (level) => {
  if (level < 0.1) return "Très faible";
  if (level < 0.3) return "Faible";
  if (level < 0.5) return "Moyenne";
  if (level < 0.75) return "Élevée";
  if (level >= 0.75) return "Critique";
};
