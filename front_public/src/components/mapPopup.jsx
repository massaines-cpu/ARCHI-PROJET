
const MapPopup = ({infectionName, label, detectionDate}) => {

    return (
        <div>
            <h3>{infectionName}</h3>
            <p>Label: {label}</p>
            <p>Date de détection: {detectionDate}</p>
        </div>
    );
};

export default MapPopup;