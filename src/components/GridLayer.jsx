import { useEffect, useState } from "react";
import { Source, Layer } from "@vis.gl/react-maplibre";
import GridPopup from "./GridPopup";

function GridLayer({
  zoom,
  setMode,
  selectedMonth,
  selectedGridFeature,
  setSelectedGridFeature,
  setIsModalOpen,
  setSelectedSpecies,
}) {

  const [gridData, setGridData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hotspotData, setHotspotData] = useState(null);

  // -------------------------
  // Zoom folder mapping
  // -------------------------

  function getZoomFolder(z) {
    if (z < 8) return 8;
    if (z < 10) return 10;
    if (z < 12) return 12;
    return 14;
  }

  const zoomLevel = getZoomFolder(zoom);

  // -------------------------
  // Reset selection
  // -------------------------

  useEffect(() => {
    setSelectedGridFeature(null);
  }, [zoomLevel, selectedMonth]);

useEffect(() => {

  const filePath = selectedMonth
    ? `/grid/zoom14/${selectedMonth}.json`
    : `/grid/zoom14/all.json`;

  fetch(filePath)
    .then(res => res.json())
    .then(data => {

      const valid = data.features.filter(
        f =>
          typeof f.properties?.density === "number" &&
          Array.isArray(f.properties?.centroid)
      );

      // 🔥 1️⃣ 计算绝对高值阈值（用 P90）
      const densities = valid.map(f => f.properties.density);
      const sorted = [...densities].sort((a, b) => a - b);
      const threshold = sorted[Math.floor(sorted.length * 0.9)];
      // 你可以改成 0.95 更严格

      const PEAK_RADIUS = 0.02;

      const peaks = valid.filter(f => {
        const [lon1, lat1] = f.properties.centroid;
        const d1 = f.properties.density;

        // ❗ 2️⃣ 绝对值筛选
        if (d1 < threshold) return false;

        // 找邻居
        const neighbors = valid.filter(g => {
          if (g === f) return false;

          const [lon2, lat2] = g.properties.centroid;

          const dist =
            Math.sqrt(
              (lon1 - lon2) ** 2 +
              (lat1 - lat2) ** 2
            );

          return dist < PEAK_RADIUS;
        });

        // ❗ 3️⃣ 局部最大
        return neighbors.every(
          n => n.properties.density <= d1
        );
      });

      const fc = {
        type: "FeatureCollection",
        features: peaks.map(f => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: f.properties.centroid
          },
          properties: {
            density: f.properties.density
          }
        }))
      };

      setHotspotData(fc);
    });
}, [selectedMonth]);
  // -------------------------
  // Fetch grid data
  // -------------------------

  useEffect(() => {

    setLoading(true);

    const filePath = selectedMonth
      ? `/grid/zoom${zoomLevel}/${selectedMonth}.json`
      : `/grid/zoom${zoomLevel}/all.json`;

    fetch(filePath)
      .then(res => res.json())
      .then(data => {

        setGridData(data);
        setLoading(false);

      })
      .catch(err => {

        console.error(err);

        setGridData(null);
        setLoading(false);

      });

  }, [zoomLevel, selectedMonth]);


  // ==========================
  // 🎨 用 density 上色
  // ==========================

const gridStyle = {
  id: "grid-fill",
  type: "fill",
  paint: {
    "fill-color": [
      "interpolate",
      ["linear"],

      // ⭐ 非线性视觉压缩（只作用于高值）
      ["sqrt", ["get", "density"]],

      0.0, "rgba(255,255,255,0)",
      0.2, "#EDF3EE",
      0.4, "#C7DCCB",
      0.6, "#7faf8b",
      0.8, "#3E7C59",
      1.0, "#1F4D36"
    ],

    "fill-opacity": [
      "interpolate",
      ["linear"],
      ["zoom"],
      8, 0.4,
      12, 0.75,
      14, 0.9
    ]
  }
};
    
  const gridGlowStyle = {
    id: "grid-outline-glow",
    type: "line",
    paint: {
        "line-color": "rgba(255,255,255,0.6)",
        "line-width": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        8,   // 外层大一点
        0
        ],
        "line-blur": 2
    }
    };

  const gridOutlineStyle = {
    id: "grid-outline",
    type: "line",
    paint: {
      "line-color": "#ffffff",
      "line-width": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        3,
        0
      ]
    }
  };

const hotspotGlow = {
  id: "hotspot-glow",
  type: "circle",
  paint: {
    "circle-radius": [
      "interpolate",
      ["linear"],
      ["zoom"],

      8,
      [
        "interpolate",
        ["linear"],
        ["get", "density"],
        0.3, 50,
        1, 100
      ],

      10,
      [
        "interpolate",
        ["linear"],
        ["get", "density"],
        0.3, 60,
        1, 200
      ],

      12,
      [
        "interpolate",
        ["linear"],
        ["get", "density"],
        0.3, 70,
        1, 280
      ],

      14,
      [
        "interpolate",
        ["linear"],
        ["get", "density"],
        0.3, 80,
        1, 400
      ],

      18,
      [
        "interpolate",
        ["linear"],
        ["get", "density"],
        0.3, 90,
        1, 560
      ]
    ],

    "circle-color": "#E07A2F",
    "circle-opacity": 0.12,
    "circle-blur": 0.7
  }
};

const hotspotRing = {
  id: "hotspot-ring",
  type: "circle",
  paint: {
    "circle-radius": [
      "interpolate",
      ["linear"],
      ["zoom"],

      8,
      [
        "interpolate",
        ["linear"],
        ["get", "density"],
        0.3, 25,
        1, 40
      ],

      10,
      [
        "interpolate",
        ["linear"],
        ["get", "density"],
        0.3, 30,
        1, 105
      ],

      12,
      [
        "interpolate",
        ["linear"],
        ["get", "density"],
        0.3, 35,
        1, 195
      ],

      14,
      [
        "interpolate",
        ["linear"],
        ["get", "density"],
        0.3, 40,
        1, 330
      ],

      18,
      [
        "interpolate",
        ["linear"],
        ["get", "density"],
        0.3, 45,
        1, 510
      ]
    ],

    "circle-color": "rgba(0,0,0,0)",
    "circle-stroke-width": 1,
    "circle-stroke-color": "#E07A2F",
    "circle-opacity": 1
  }
};
  

  return (
    <>

      {/* loading 提示 */}
      {loading && (
        <div
          className="grid-loading"
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



      {/* ⭐ Source 永远存在 */}
      <Source
        id="grid-source"
        type="geojson"
        data={
          gridData ?? {
            type: "FeatureCollection",
            features: []
          }
        }
        promoteId="id"
      >

        {/* ⭐ Layer 永远存在 */}
        <Layer {...gridStyle} />
        <Layer {...gridGlowStyle} />
        <Layer {...gridOutlineStyle} />

      </Source>



      {/* hotspot 同理 */}
      <Source
        id="hotspot-source"
        type="geojson"
        data={
          hotspotData ?? {
            type: "FeatureCollection",
            features: []
          }
        }
      >

        <Layer {...hotspotGlow} />
        <Layer {...hotspotRing} />

      </Source>



      {selectedGridFeature && (
        <GridPopup
          setMode={setMode}
          feature={selectedGridFeature}
          onClose={() => setSelectedGridFeature(null)}
          setIsModalOpen={setIsModalOpen}
          setSelectedSpecies={setSelectedSpecies}
        />
      )}

    </>
  );
}

export default GridLayer;