import { Popup } from "@vis.gl/react-maplibre";
import { speciesList } from "../data/speciesIndex";
import { speciesAlias } from "../data/speciesAlias";
import { speciesMeta } from "../data/species_wiki_link";


// projecting species id / common name / scientific name

const idToSciName = new Map(

  speciesList.map((s) => [Number(s.id),s.name])

);

function GridPopup({ 
  feature, 
  onClose, 
  setIsModalOpen, 
  setSelectedSpecies,
  setMode
}) {

  if (!feature) return null;

  const {
    totalCount = 0,
    speciesCount = 0,
    speciesTop = []
  } = feature.properties ?? {};


  // get top species
  let safeSpeciesTop = [];

  if (typeof speciesTop === "string") {

    try {

      safeSpeciesTop = JSON.parse(speciesTop);

    } catch {

      safeSpeciesTop = [];

    }

  } else if (Array.isArray(speciesTop)) {

    safeSpeciesTop = speciesTop;

  }


  // prepare for the popup location: center of the chosen grid

  function getPolygonCenter(ft) {

    const ring = ft?.geometry?.coordinates?.[0];

    if (!Array.isArray(ring)) return [0, 0];

    let minLon = Infinity, maxLon = -Infinity;
    let minLat = Infinity, maxLat = -Infinity;

    ring.forEach(([lon, lat]) => {

      minLon = Math.min(minLon, lon);
      maxLon = Math.max(maxLon, lon);
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);

    });

    return [

      (minLon + maxLon) / 2,
      (minLat + maxLat) / 2

    ];
  }


  const [centerLon, centerLat] = getPolygonCenter(feature);


  // if clicking species button: track specific species > changing mode to track mode

  function handleOpenModal(name) {

    setSelectedSpecies(name);

    setIsModalOpen(true);

  }

  function handleExploreSpecies(name) {

    setSelectedSpecies(name);

    setMode("track");

    onClose();

  }

  return (

    <Popup

      longitude={centerLon}
      latitude={centerLat}
      anchor="top"
      closeOnClick={false}
      closeButton={true}
      onClose={onClose}

    >

      <div

        style={{

          width: 280,

          fontFamily: "system-ui",

        }}

        onClick={(e) => e.stopPropagation()}

      >


        {/* header */}

        <div style={{

          fontSize: 16,

          fontWeight: 600,

          marginBottom: 8

        }}>
          Grid Summary
        </div>


        {/* stats */}

        <div style={{

          display: "flex",

          justifyContent: "space-between",

          fontSize: 14,

          marginBottom: 4

        }}>

          <span>Total Observations</span>

          <strong>{totalCount}</strong>

        </div>


        <div style={{

          display: "flex",

          justifyContent: "space-between",

          fontSize: 14,

          marginBottom: 8

        }}>

          <span>Species Count</span>

          <strong>{speciesCount}</strong>

        </div>


        <div style={{

          borderTop: "1px solid #eee",

          margin: "10px 0"

        }}/>


        {/* subtitle */}

        <div style={{

          fontSize: 14,

          fontWeight: 600,

          marginBottom: 6

        }}>

          Top Species

        </div>


        {/* species list */}

        <div style={{

          maxHeight: 200,

          overflowY: "auto"

        }}>


          {safeSpeciesTop.length === 0 && (

            <div style={{

              fontSize: 13,

              color: "#777"

            }}>

              No species data

            </div>

          )}

          {/* get projecting: from id to common name */}
          {safeSpeciesTop.slice(0, 10).map(([id, count]) => {

            const sciName = idToSciName.get(Number(id)) || `Unknown (${id})`;
            const canonicalName = speciesAlias[sciName] || sciName;
            const commonName = speciesMeta[canonicalName]?.commonName || sciName;

            const ratio = Number(count).toFixed(1);


            return (

              <div

                key={id}

                style={{

                  marginBottom: 10,

                  paddingBottom: 8,

                  borderBottom: "1px solid #f0f0f0"

                }}

              >


                <div style={{ fontSize: 14, fontWeight: 500 }}>

                  {commonName}

                  <div style={{ fontSize: 12, color: "#666" }}>

                    Scientific name: {sciName}

                  </div>
                </div>


                <div style={{

                  fontSize: 12,

                  color: "#666",

                  marginBottom: 4

                }}>

                  {ratio}% of observations

                </div>


                <div style={{
                    display: "flex",
                    gap: "6px"
                  }}>


                  {/* button to open species modal */}

                  <button
                  onClick={() => handleOpenModal(sciName)}
                  style={{
                      fontSize: 12,
                      background: "#5C8F6B",
                      color: "white",
                      border: "none",
                      borderRadius: 6,
                      padding: "4px 10px",
                      cursor: "pointer",
                      flex: 1
                  }}
                  >
                  View Species Info
                  </button>


                  <button
                  onClick={() => handleExploreSpecies(sciName)}
                  style={{
                      fontSize: 12,
                      background: "#C65D1A",
                      color: "white",
                      border: "none",
                      borderRadius: 6,
                      padding: "4px 10px",
                      cursor: "pointer",
                      flex: 1
                  }}
                  >
                  Where to find them
                  </button>

                  </div>

              </div>
            );
          })}

        </div>
      </div>
    </Popup>
  );

}


export default GridPopup;