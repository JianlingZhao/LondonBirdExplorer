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


  // fetch species data

  useEffect(() => {
  // clean data when selected species = null
    if (!species) {
        setTrackData(null);
        setFilteredData(null);
        return;
    }

    const fileName = `/track/${species.replaceAll(" ", "_")}.json`;

 
    fetch(fileName)
      .then(res => res.json())
      .then(data => setTrackData(data))
      .catch(() => setTrackData(null));

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
