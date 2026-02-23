import { useState, useRef, useEffect } from "react";
import { speciesList } from "../data/speciesIndex";
import { speciesMeta } from "../data/species_wiki_link";
import { speciesAlias } from "../data/speciesAlias";

function Sidebar({
  mode,
  setMode,
  selectedSpecies,
  setSelectedSpecies,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  onLocateMe,
  onPostcodeSearch,
  setIsModalOpen
}) {


  const [speciesSearchTerm, setSpeciesSearchTerm] = useState("");

  const [postcodeSearchTerm, setPostcodeSearchTerm] = useState("");

  const [showSpeciesDropdown, setShowSpeciesDropdown] = useState(false);

  const dropdownRef = useRef(null);


  // click: search / dropdown > species dropdown
  // click elsewhere: close dropdown

  useEffect(() => {

    function handleClickOutside(event) {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {

        setShowSpeciesDropdown(false);

      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);

  }, []);


  // optimised: transfer: scientific name > common name
  // more optimization can be done here: in the grid data: species id mapped to commonname (sci name for now)
  const filteredSpecies = speciesList.filter((s) => {

    const sciName = s.name.toLowerCase();

    const canonicalName = speciesAlias[s.name] || s.name;

    const commonName =
      speciesMeta[canonicalName]?.commonName?.toLowerCase() || "";

    const search = speciesSearchTerm.toLowerCase();

    return (
      sciName.includes(search) ||
      commonName.includes(search)
    );

  });



  return (

    <div className="sidebar">


      {/* MODE */}

      <div className="sidebar-mode">

        <div className="sidebar-titlemode">

          Mode

        </div>

        <div className="sidebar-hint">

          {mode === "explore"
            ? "Click grid cells to explore dominant species and listen to their calls."
            : "Click observation points to explore individual bird records."
          }

        </div>


        {/* mode button */}

        <div className="toggle-row">

          <button
            className={`toggle-btn ${mode === "explore" ? "active" : ""}`}
            onClick={() => setMode("explore")}
          >
            Explore
          </button>

          <button
            className={`toggle-btn ${mode === "track" ? "active" : ""}`}
            onClick={() => setMode("track")}
          >
            Track
          </button>

        </div>
      </div>


      {/* find location card (for both mode) */}

      <div className="sidebar-section">

        <div className="sidebar-title">

          Location

        </div>

        {/* using user location */}

        <button
          className="primary-btn"
          onClick={onLocateMe}
        >

          📍 Find my location

        </button>

        <div style={{ height: 2 }}/>

        <div className="or-divider">
          <span>OR</span>
        </div>


        {/* input postcode to locate */}

        <div className="search-row">

          <input

            type="text"

            placeholder="Search postcode"

            value={postcodeSearchTerm}

            onChange={(e) => setPostcodeSearchTerm(e.target.value)}

            onKeyDown={(e) => {

              if (e.key === "Enter")

                onPostcodeSearch(postcodeSearchTerm);

            }}

          />
          
          <button

            className="search-btn"

            onClick={() => onPostcodeSearch(postcodeSearchTerm)}

          >

            Search

          </button>

        </div>

      </div>




      {/* explore mode */}


      {mode === "explore" && (


        <div className="sidebar-section">

          {/* filter by month: select month */}

          <div className="sidebar-title">

            Filter by Month

          </div>

          <select

            value={selectedMonth || ""}

            onChange={(e) =>

              setSelectedMonth(

                e.target.value

                  ? Number(e.target.value)

                  : null

              )
            }
          >

            <option value="">

              All Months

            </option>

            {[...Array(12)].map((_, i) => (

              <option

                key={i}

                value={i + 1}

              >

                Month {i + 1}

              </option>

            ))}

          </select>
        </div>
      )}


      {/* track mode */}

      {/* select species card */}
      {/* select species: drop down */}

      {mode === "track" && (

        <>

          <div className="sidebar-section">

            <div className="sidebar-title">

              Select Species

            </div>

            <div
              ref={dropdownRef}
              className="species-dropdown-wrapper"
            >

              <input
                type="text"
                placeholder="Search species..."
                value={speciesSearchTerm}
                onFocus={() => setShowSpeciesDropdown(true)}
                onChange={(e) => {
                  const value = e.target.value;
                  setSpeciesSearchTerm(value);
                  setShowSpeciesDropdown(true);

                  // clear the input: reset selected species
                  if (value === "") {
                    setSelectedSpecies(null); 
                  }
                }}
              />

              {showSpeciesDropdown && (

                <div className="species-dropdown">

                  {filteredSpecies

                    .slice(0, 200)

                    .map((s) => (

                      <div

                        key={s.id}

                        className="species-item"

                        // optimised: dropdown & search: support both common name + scientific name

                        onClick={() => {

                          setSelectedSpecies(s.name);

                          const canonicalName = speciesAlias[s.name] || s.name;

                          const commonName =
                            speciesMeta[canonicalName]?.commonName || s.name;

                          setSpeciesSearchTerm(commonName);

                          setShowSpeciesDropdown(false);

                        }}
                      >

                        {speciesMeta[speciesAlias[s.name] || s.name]?.commonName || s.name}

                          <div
                            style={{
                              fontSize: "12px",
                              color: "#666",
                              fontStyle: "italic"
                            }}
                          >
                            {s.name}
                          </div>

                      </div>
                    ))}
                </div>
              )}

          </div>

            {selectedSpecies && (

              <div className="selected-hint">

                Selected:

                <strong>

                  {" "}

                  {speciesMeta[speciesAlias[selectedSpecies] || selectedSpecies]?.commonName || selectedSpecies}

                </strong>
                
                {mode === "track" && selectedSpecies && (

                <div
                  onClick={() => setIsModalOpen(true)}
                  style={{
                    width: "100%",
                    marginTop: "8px",
                    padding: "6px 10px",
                    fontSize: "13px",
                    backgroundColor: "rgba(47,107,62,0.12)",
                    color: "#2F6B3E",
                    border: "1px solid rgba(1, 1, 1, 0.35)",
                    borderRadius: "6px",
                    cursor: "pointer",
                    textAlign: "center",
                    fontWeight: "500"
                  }}
                >
                  View Species Info
                </div>

              )}

              </div>
              
            )}
          </div>


          {/* filter card */}
          {/* filter by year */}

          <div className="sidebar-section">

            <div className="sidebar-title">

              Year

            </div>

            <select

              value={selectedYear || ""}

              onChange={(e) =>

                setSelectedYear(

                  e.target.value

                    ? Number(e.target.value)

                    : null

                )
              }
            >

              <option value="">

                All Years

              </option>

              {/* latest 3 years data were kept in data files for track mode */}

              {[2025,2024,2023]

                .map((y) => (

                <option key={y} value={y}>

                  {y}

                </option>
              ))}
            </select>
          </div>


          {/* filter by month */}

          <div className="sidebar-section">

            <div className="sidebar-title">

              Month

            </div>

            <select

              value={selectedMonth || ""}

              onChange={(e) =>

                setSelectedMonth(

                  e.target.value

                    ? Number(e.target.value)

                    : null

                )
              }
            >

              <option value="">

                All Months

              </option>

              {[...Array(12)]

                .map((_, i) => (

                <option key={i} value={i + 1}>

                  Month {i + 1}

                </option>
              ))}
            </select>
          </div>
        </>
      )}

    </div>
  );
}

export default Sidebar;
