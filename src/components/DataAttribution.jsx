import { useState } from "react";

function DataAttribution() {

  const [expanded, setExpanded] = useState(false);

  return (

    <>
      {/* ===================== */}
      {/* LEFT — eBird DATA */}
      {/* ===================== */}

      <div
        style={{
          position: "absolute",
          bottom: 12,
          left: 12,          // ⭐ 改为 left
          zIndex: 1000,
          fontSize: 11,
          fontFamily: "system-ui",
          color: "#374151",
        }}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >

        {expanded ? (

          <div
            style={{
              background: "rgba(255,255,255,0.95)",
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              width: 260,
              lineHeight: 1.45,
            }}
          >

            <div style={{ fontWeight: 600, marginBottom: 4 }}>
              Bird observation data
            </div>

            <div>
              eBird Basic Dataset (EBD_relDec-2025)
            </div>

            <div style={{ marginTop: 6 }}>
              Provided by the Cornell Lab of Ornithology
              through the eBird project
            </div>

            <div style={{ marginTop: 6, color: "#6b7280" }}>
              © Cornell Lab of Ornithology
            </div>

          </div>

        ) : (

          <div
            style={{
              background: "rgba(255,255,255,0.85)",
              padding: "4px 8px",
              borderRadius: 6,
              border: "1px solid #e5e7eb",
            }}
          >
            eBird © Cornell Lab
          </div>

        )}

      </div>




    </>

  );

}

export default DataAttribution;