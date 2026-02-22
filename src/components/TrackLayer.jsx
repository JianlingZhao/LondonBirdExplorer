import { useEffect, useState } from "react";
import { Source, Layer } from "@vis.gl/react-maplibre";
import TrackPopup from "./TrackPopup";

function TrackLayer({
  species,
  selectedMonth,
  selectedYear,
  zoom,
  selectedTrackPoint,
  setSelectedTrackPoint

}) {

  const [trackData, setTrackData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [loading, setLoading] = useState(false);


  // fetch species data

  useEffect(() => {

    if (!species) {
      setTrackData(null);
      setFilteredData(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const fileName = `/track/${species.replaceAll(" ", "_")}.json`;

    fetch(fileName)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setTrackData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Track fetch failed:", fileName, err);
        setTrackData(null);
        setLoading(false);
      });

  }, [species]);


  // filter by year / month
  useEffect(() => {

    if (!trackData) return;

    let features = trackData.features;

    if (selectedYear) {
      features = features.filter(f =>
        f.properties.year === selectedYear
      );
    }

    if (selectedMonth) {
      features = features.filter(f =>
        f.properties.month === selectedMonth
      );
    }

    // apply thinning
    // based on obs. point density
    features = applyThinning(features, zoom);

    setFilteredData({
      type: "FeatureCollection",
      features
    });

  }, [trackData, selectedYear, selectedMonth, zoom]);


  // thinning logic: more point----point cluster; less point---- >= 1point

  function applyThinning(features, z) {

    if (z >= 12) return features;

    // grid size: zoom > larger grid > thinning

    const cellSize =
        z < 9 ? 0.08 :
        z < 10 ? 0.05 :
        0.02;
    // key > grid id
    const grid = new Map();


    // point > allocated into grid using coordinates
    features.forEach(f => {

      const [lon, lat] = f.geometry.coordinates;

      const key =
      Math.floor(lon / cellSize) +
      "_" +
      Math.floor(lat / cellSize);

      if (!grid.has(key)) {
      grid.set(key, []);
      }
      grid.get(key).push(f);
    });

    const result = [];

    grid.forEach(cellFeatures => {
      const n = cellFeatures.length;


      // keep 1 point at least (if exist point)

      // to show the logit, as sqrt(1) = 1, can be done without n === 1 here
      const keepCount =
      n === 1
        ? 1

        // keepCount = sqrt(n)
        : Math.ceil(Math.sqrt(n));

      result.push(
      ...cellFeatures.slice(0, keepCount)
    );

  });


  return result;
  }


  // Point style
  const pointStyle = {
    id: "track-points",
    type: "circle",
    paint: {
      "circle-radius": 5,
      "circle-color": "#C65D1A",
      "circle-stroke-width": 1,
      "circle-stroke-color": "#ffffff"
    }
  };

  // Click handling
  // preparing for clicking popup
  function handleClick(event) {
    const features = event.features;

    if (features && features.length > 0) {
      const feature = features[0];
      setClickedFeature(feature);
      setSelectedTrackPoint(feature);
    }
  }

return (
  <>

    {/* Loading indicator */}
    {loading && (
      <div
        className="track-loading"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",

          background: "rgba(255,255,255,0.95)",
          padding: "16px 22px",

          borderRadius: "10px",

          border: "1px solid #e5e7eb",

          boxShadow: "0 6px 20px rgba(0,0,0,0.15)",

          fontFamily: "system-ui",
          fontSize: "14px",
          color: "#374151",

          zIndex: 2000,

          pointerEvents: "none"
        }}
      >
        Loading data...
      </div>
    )}
    
    {/* data source */}
    <Source
      id="track-source"
      type="geojson"
      data={filteredData ?? {
        type: "FeatureCollection",
        features: []
        // filtered data exists / empty GeoJSON

      }}
    >
      <Layer {...pointStyle} onClick={handleClick} />
    </Source>

    {/* popup */}
    {selectedTrackPoint && (
      <TrackPopup
        feature={selectedTrackPoint}
        onClose={() => setSelectedTrackPoint(null)}
      />
    )}
  </>
);
}

export default TrackLayer;
