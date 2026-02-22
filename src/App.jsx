import './styles.css'

import { useState } from "react";
import TitleBar from "./components/TitleBar";
import Sidebar from "./components/Sidebar";
import MapDisplay from "./components/MapDisplay";
import SpeciesModal from "./components/SpeciesModal";


function App() {

  // USESTATE & CONST


  // setting mode: explore/track
  const [mode, setMode] = useState("explore"); 


  // filter
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);


  // zooming
  const [zoom, setZoom] = useState(8);


  //popup
  const [selectedGridFeature, setSelectedGridFeature] = useState(null);
  const [selectedTrackPoint, setSelectedTrackPoint] = useState(null);


  //species modal
  const [isModalOpen, setIsModalOpen] = useState(false);


  //locating
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);


  //locating-use location
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported")
      return
    }
    navigator.geolocation.getCurrentPosition(

      (position) => {
        const coords = [
          position.coords.longitude,
          position.coords.latitude
        ]
        setUserLocation(coords)
      },
      () => {
        alert("Unable to retrieve location")
      }
    )
  }


  // locating-use postcode
  const handlePostcodeSearch = async (postcode) => {
      if (!postcode) return;
      setLocating(true);
      try {
        const response = await fetch(
          `https://api.postcodes.io/postcodes/${postcode}`
        );
        const data = await response.json();
        if (data.status === 200) {
          const coords = [
            data.result.longitude,
            data.result.latitude
          ];
          setUserLocation(coords);
        }
        else {
          alert("Postcode not found");
        }
      }
      catch {
        alert("Error searching postcode");
      }
      setLocating(false);
    };



  // RENDER



  return (
    <div className="app-container">
      {/* HEADER */}
      <TitleBar />
      {/* SIDEBAR + MAP */}
      <div className="main-layout">


        {/* sidebar & props */}
        <Sidebar
          mode={mode}
          setMode={setMode}
          selectedSpecies={selectedSpecies}
          setSelectedSpecies={setSelectedSpecies}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          onLocateMe={handleLocateMe}
          onPostcodeSearch={handlePostcodeSearch}
          setIsModalOpen={setIsModalOpen}
        />

        {/* map & props */}
        <MapDisplay
          mode={mode}
          setMode={setMode} 
          selectedSpecies={selectedSpecies}
          setSelectedSpecies={setSelectedSpecies}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          zoom={zoom}
          setZoom={setZoom}
          selectedGridFeature={selectedGridFeature}
          setSelectedGridFeature={setSelectedGridFeature}
          selectedTrackPoint={selectedTrackPoint}
          setSelectedTrackPoint={setSelectedTrackPoint}
          setIsModalOpen={setIsModalOpen}
          userLocation={userLocation}
          locating={locating}
        />

      </div>

      {isModalOpen && selectedSpecies && (
        <SpeciesModal
          species={selectedSpecies}
          onClose={() => setIsModalOpen(false)}
        />
      )}

    </div>
  );
}

export default App;


