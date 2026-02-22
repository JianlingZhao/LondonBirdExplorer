import { speciesMeta } from "../data/species_wiki_link";
import { speciesAlias } from "../data/speciesAlias";
import WikiLink from "./WikiLink";

function oggToMp3(url) {

  if (!url.includes("/commons/")) return url;

  const part = url.split("/commons/")[1];

  const filename = part.split("/").pop();

  return `https://upload.wikimedia.org/wikipedia/commons/transcoded/${part}/${filename}.mp3`;

}

function SpeciesModal({ species, onClose }) {
  if (!species) return null;


  // sciName > alias (wiki name) 


  const canonicalName = speciesAlias[species] || species;


  // wiki data

  const data = speciesMeta[canonicalName];

  console.log("MODAL OPEN:", {
    original: species,
    canonical: canonicalName,
    found: !!data
  });


  // data have been cleaned and made sure all species have a specific wiki link
  // prevent error
  if (!data) {
    return (
      <div style={overlayStyle}>
        <div style={modalStyle}>
          <button onClick={onClose} style={closeBtn}>✕</button>
          <h2 className="text-2xl font-bold">
            {species}
            </h2>
          <p>No data available for this species.</p>
        </div>
      </div>
    );
  }


  // preparing data (from species_wiki_link.js)
  const { image, audio, summary, wikiPage } = data;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button onClick={onClose} style={closeBtn}>✕</button>

        <h2 style={{fontSize: "20px", fontWeight: 600, marginBottom: "10px"
            }}
          >
            {data.commonName || canonicalName}
          </h2>

        <div
          style={{
            fontSize: "13px",
            color: "#666",
            marginBottom: "10px"
          }}
        >
          Scientific name: {canonicalName}
        </div>

        {image && (
          <img
            src={image}
            alt={canonicalName}
            style={{
              width: "100%",
              maxHeight: "300px",
              objectFit: "contain",
              marginBottom: "10px"
            }}
          />
        )}

        {audio && (

          <div style={{ marginBottom: "15px" }}>

            {/* tip for audio */}
            <div
              style={{
                fontSize: "14px",
                color: "#555",
                marginBottom: "6px",
                fontWeight: 500
              }}
            >
              🎧 Listen to the call of this species
            </div>


            {/* audio player */}
            <audio
              controls
              preload="none"
              style={{
                width: "100%",
                marginBottom: "4px",
                borderRadius: "6px",
                accentColor: "#5C8F6B" 
              }}
            >
              
            {/* some Some browsers like Safari are unable to handle wikimedia audio files (.ogg) */}
            {/* feching transcoded version(.ogg > .mp3) from wiki */}
            {/* try playing the source in sequence until a supported format is found */}
            <source
              src={oggToMp3(audio)}
              type="audio/mpeg"
            />

            <source
              src={audio}
              type="audio/ogg"
            />
            Your browser does not support audio.
            </audio>


            {/* data source */}
            <div
              style={{
                fontSize: "11px",
                color: "#888"
              }}
            >
              Image & Audio source: Wikimedia Commons
            </div>

          </div>

        )}

        {summary && (
          <p style={{ marginBottom: "10px" }}>
            {summary}
          </p>
        )}

        <WikiLink url={wikiPage} />
      </div>
    </div>
  );
}


// style (inline)

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
};

const modalStyle = {
  background: "white",
  padding: "20px",
  maxWidth: "600px",
  maxHeight: "80vh",
  overflowY: "auto",
  borderRadius: "8px"
};

const closeBtn = {
  float: "right",
  cursor: "pointer"
};

export default SpeciesModal;