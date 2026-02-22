function Legend({ mode }) {

  return (

    <div
      style={{
        position: "absolute",
        top: 12,
        right: 12,
        zIndex: 1000,
        background: "rgba(255,255,255,0.95)",
        padding: "12px 14px",
        borderRadius: 10,
        border: "1px solid #e5e7eb",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        fontFamily: "system-ui",
        fontSize: 12,
        width: 160
      }}
    >


      {/* legend for explore mode */}

      {mode === "explore" && (

        <>

          {/* density color-map */}

          <div style={{ marginBottom: 10 }}>

            <div style={{ marginBottom: 4 }}>
              Observation density
            </div>

            <div
              style={{
                height: 10,
                background:
                  "linear-gradient(to right, #EDF3EE, #C7DCCB, #7FAF8B, #3E7C59, #1F4D36)",
                borderRadius: 4
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 10,
                color: "#6b7280"
              }}
            >

              <span>Low</span>
              <span>High</span>

            </div>

          </div>


          {/* hotspot circle */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 6
            }}
          >

            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                border: "2px solid #E07A2F",
                marginRight: 6
              }}
            />

            Hotspot

          </div>

        </>

      )}


      {/* legend for track mode */}

      {mode === "track" && (

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 10
          }}
        >

          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#C65D1A",
              marginRight: 8
            }}
          />

          Bird observation

        </div>

      )}


      {/* legend for user location (for both mode) */}

      <div
        style={{
          display: "flex",
          alignItems: "center"
        }}
      >

        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#1E90FF",
            border: "3px solid white",
            boxShadow: "0 0 0 6px rgba(30,144,255,0.3)",
            marginRight: 8
          }}
        />

        Your location

      </div>

    </div>

  );

}

export default Legend;