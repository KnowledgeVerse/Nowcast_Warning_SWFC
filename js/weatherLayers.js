// js/weatherLayers.js
// 2️⃣1️⃣ PROFESSIONAL MAP CONTROL PANEL & 2️⃣3️⃣ CODE STRUCTURE

const baseLayers = {};
const radarLayers = {};
const satelliteLayers = {};
const lightningLayers = {};
const convectiveLayers = {};
const warningLayers = {};
const aiPredictionLayers = {};

let activeProLayers = {};

// 8️⃣ RADAR ANIMATION (Rainviewer Tile generation mock)
radarLayers.rainviewer = function () {
  // Uses latest available radar frame natively
  const layer = L.tileLayer(
    "https://tilecache.rainviewer.com/v2/radar/nowcast/256/{z}/{x}/{y}/2/1_1.png",
    {
      opacity: 0.6,
      zIndex: 400,
    },
  );
  return layer;
};

// 9️⃣ SATELLITE MONITORING
satelliteLayers.trueColor = function () {
  const layer = L.tileLayer(
    "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/current/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg",
    {
      opacity: 0.5,
      zIndex: 200,
      attribution: "NASA GIBS",
    },
  );
  return layer;
};

// 7️⃣ LIGHTNING TRACKING (Live Simulation framework)
lightningLayers.live = function () {
  const layer = L.layerGroup();
  layer.animInterval = setInterval(() => {
    if (typeof map === "undefined" || map === null || !map.hasLayer(layer))
      return;
    const b = map.getBounds();
    const lat = b.getSouth() + Math.random() * (b.getNorth() - b.getSouth());
    const lng = b.getWest() + Math.random() * (b.getEast() - b.getWest());

    const icon = L.divIcon({
      html: '<span style="font-size:24px;color:#f1c40f;">⚡</span>',
      className: "",
    });
    const marker = L.marker([lat, lng], { icon: icon }).addTo(layer);
    setTimeout(() => layer.removeLayer(marker), 800); // fade after brief moment
  }, 1000);
  return layer;
};

// 1️⃣1️⃣ CONVECTIVE INSTABILITY (Mock WMS proxy)
convectiveLayers.cape = function () {
  return L.tileLayer.wms(
    "https://opengeo.ncep.noaa.gov/geoserver/conus/conus_bref_qcd/ows",
    {
      layers: "conus_bref_qcd",
      format: "image/png",
      transparent: true,
      opacity: 0.4,
      zIndex: 300,
    },
  );
};

// 🔟 STORM MOTION VECTORS
radarLayers.stormMotion = function () {
  // Framework for Vector Tiles / Windy API
  const layer = L.layerGroup();
  // Example static vector for visual representation
  const arrow = L.polyline(
    [
      [25.0, 85.0],
      [25.5, 85.5],
    ],
    { color: "blue", weight: 4 },
  );
  layer.addLayer(arrow);
  return layer;
};

// Toggle Function for Pro Map Control Panel
function toggleProLayer(layerId, isChecked) {
  if (typeof map === "undefined" || map === null) return;

  if (isChecked) {
    let newLayer = null;
    switch (layerId) {
      case "radar":
        newLayer = radarLayers.rainviewer();
        break;
      case "satellite":
        newLayer = satelliteLayers.trueColor();
        break;
      case "lightning":
        newLayer = lightningLayers.live();
        break;
      case "cape":
        newLayer = convectiveLayers.cape();
        break;
      case "stormMotion":
        newLayer = radarLayers.stormMotion();
        break;
      case "stormCells":
        if (typeof generateStormCells === "function")
          newLayer = generateStormCells();
        break;
    }

    if (newLayer) {
      newLayer.addTo(map);
      activeProLayers[layerId] = newLayer;
    }
  } else {
    if (activeProLayers[layerId]) {
      if (activeProLayers[layerId].animInterval)
        clearInterval(activeProLayers[layerId].animInterval);
      map.removeLayer(activeProLayers[layerId]);
      delete activeProLayers[layerId];
    }
  }
}
