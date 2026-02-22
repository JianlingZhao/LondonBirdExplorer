import { Popup } from "@vis.gl/react-maplibre";
import { reverseSpeciesIndex } from "../data/speciesIndex";

function TrackPopup({ feature, onClose }) {
  // usestate const
  const { species, date, location, count } = feature.properties;
  const [longitude, latitude] = feature.geometry.coordinates;

  const speciesName =
    typeof species === "number"
      ? reverseSpeciesIndex[species]
      : species;


  return (

    // popup content 
    <Popup
      longitude={longitude}
      latitude={latitude}
      anchor="top"
      onClose={onClose}
    >
      <div style={{ maxWidth: "250px" }}>
        <h4 style={{
            fontWeight: "bold",
            textAlign: "center",
            margin: "0 0 8px 0"
            }}>
            {speciesName}
            </h4>

        <p><strong>Date:</strong> {date}</p>
        <p><strong>Location:</strong> {location}</p>
        <p><strong>Count:</strong> {count}</p>
      </div>
    </Popup>
  );
}

export default TrackPopup;
