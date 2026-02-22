import { useState, useRef, useEffect } from "react";
import Map, { Marker } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

import GridLayer from "./GridLayer";
import TrackLayer from "./TrackLayer";
import Legend from "./Legend";
import DataAttribution from "./DataAttribution";


// set default_view: for track mode. prevent map_view being reset to [0,0] when selected species = null
const DEFAULT_VIEW = {
  longitude: -0.1,
  latitude: 51.5,
  zoom: 10
};

function MapDisplay({
  mode,
  setMode,
  selectedSpecies,
  selectedMonth,
  selectedYear,
  setZoom,
  selectedGridFeature,
  setSelectedGridFeature,
  selectedTrackPoint,
  setSelectedTrackPoint,
  setIsModalOpen,
  setSelectedSpecies,
  userLocation,
  locating
}) {

  const mapRef = useRef(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [viewState, setViewState] = useState(DEFAULT_VIEW);


  useEffect(() => {

    const map = mapRef.current?.getMap();
    if (!map) return;

    // track mode & !selected species: move view back to London (fly to)
    if (mode === "track" && !selectedSpecies) {
        map.flyTo({
        center: [DEFAULT_VIEW.longitude, DEFAULT_VIEW.latitude],
        zoom: DEFAULT_VIEW.zoom,
        duration: 600
        });
    }
    // monitor change of mode
  
  }, [mode]); 


  const handleMapClick = (event) => {

    const feature = event.features?.[0];

    if (!feature) return;

      // GRID CLICK

      if (mode === "explore" && feature.layer.id === "grid-fill") {

        if (feature.geometry?.type === "Polygon") {
          setSelectedGridFeature(feature);
        }
    }
    
    // TRACK CLICK

    if (mode === "track" && feature.layer.id === "track-points") {

      setSelectedTrackPoint(feature);

    }
  };


  // grid hover: highlight, hint for user to click the grid

  const handleMouseMove = (event) => {
    if (mode !== "explore") return;

  const map = mapRef.current?.getMap();
    if (!map) return;

  const features = map.queryRenderedFeatures(event.point, {

    layers: ["grid-fill"] 

  });

  if (!features.length) {
    if (hoveredId !== null) {
      map.setFeatureState(
        { source: "grid-source", id: hoveredId },
        { hover: false }
      );
      setHoveredId(null);
    }
    return;
  }

  const feature = features[0];

  if (hoveredId !== null && hoveredId !== feature.id) {
        map.setFeatureState(
        { source: "grid-source", id: hoveredId },
        { hover: false }
        );
    }

    setHoveredId(feature.id);

    map.setFeatureState(
        { source: "grid-source", id: feature.id },
        { hover: true }
    );
    };

    const handleMouseLeave = () => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    if (hoveredId !== null) {
        map.setFeatureState(
        { source: "grid-source", id: hoveredId },
        { hover: false }
        );
    }

    setHoveredId(null);
    };


  return (
    <div className="map-container">

        <Map
          ref={mapRef}
          cursor="pointer"
          {...viewState}
          onMove={(evt) => {
          setViewState(evt.viewState);
          setZoom(evt.viewState.zoom);
          }}
          style={{ width: "100%", height: "100%" }}

          // set map style: colorless and low-contrast style to reduce visual interference

          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"

          // click & hover
          onClick={handleMapClick}
          onMouseMove={handleMouseMove}     
          onMouseLeave={handleMouseLeave}   
          interactiveLayerIds={
              mode === "explore"
                  ? ["grid-fill", "grid-heat"]
                  : mode === "track" && selectedSpecies !== null
                  ? ["track-points"]
                  : []
          }
        >

        

        {mode === "explore" && (
        <GridLayer
        mapRef={mapRef}  
        setMode={setMode} 
        zoom={viewState.zoom}
        selectedMonth={selectedMonth}
        selectedGridFeature={selectedGridFeature}
        setSelectedGridFeature={setSelectedGridFeature}
        setIsModalOpen={setIsModalOpen}
        setSelectedSpecies={setSelectedSpecies}
        />
        )}

        {mode === "track" && selectedSpecies !== null && (
          <TrackLayer
            species={selectedSpecies}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            zoom={viewState.zoom}
            selectedTrackPoint={selectedTrackPoint}
            setSelectedTrackPoint={setSelectedTrackPoint}
          />
        )}

        {userLocation && (
            <Marker
                longitude={userLocation[0]}
                latitude={userLocation[1]}
            >
                <div className="user-marker"></div>
            </Marker>
            )}

      </Map>

      {/* Track mode hint: select species */}

        {mode === "track" && !selectedSpecies && (

        <div className="track-hint">

            Select a species from the sidebar
            to view observation locations

        </div>
        )}

      <Legend mode={mode} />

      <DataAttribution />

      {/* loading location */}

        {locating && (
        <div className="locating-overlay">

        Locating...

        </div>

        )}

    </div>

  );

}

export default MapDisplay;