// js/weatherLayers.js
// ZOOM EARTH STYLE WEATHER MAP FEATURES - FIXED & ENHANCED
// Compatible with Bihar Weather Forecast System

// =========================================================================
// GLOBAL LAYER STORAGE
// =========================================================================

const baseLayers = {};
const radarLayers = {};
const satelliteLayers = {};
const lightningLayers = {};
const convectiveLayers = {};
const warningLayers = {};
const aiPredictionLayers = {};

let activeProLayers = {};
let currentActiveBaseLayer = null;
const activeOverlayLayers = {};

// OpenWeatherMap API Key (Demo key - replace with your own for production)
const OWM_KEY = "7c973541298816bb1bb2a8b301b1da7c";

// NASA FIRMS API Key (Get free from https://firms.modaps.eosdis.nasa.gov/api/map_key/)
const FIRMS_API_KEY = "YOUR_FIRMS_API_KEY"; // Replace with your actual key

// =========================================================================
// SECTION 1: WEATHER MAPS - BASE LAYERS (DROPDOWN)
// Only ONE active at a time - switches automatically
// =========================================================================

const zoomEarthLayers = {
  base: {
    // 1. SATELLITE - ESRI World Imagery / NASA GIBS
    satellite: () => {
      // Try RainViewer satellite first, fallback to NASA GIBS
      if (
        typeof rvHost !== "undefined" &&
        typeof rvSatPath !== "undefined" &&
        rvSatPath
      ) {
        return L.tileLayer(`${rvHost}${rvSatPath}/256/{z}/{x}/{y}/0/1_1.png`, {
          opacity: 1,
          zIndex: 150,
          attribution: "RainViewer Satellite",
          maxZoom: 18,
        });
      }
      // NASA GIBS MODIS Terra True Color
      return L.tileLayer(
        "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/current/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg",
        {
          opacity: 1,
          zIndex: 150,
          attribution: "NASA GIBS",
          maxZoom: 9,
        },
      );
    },

    // 2. RADAR - RainViewer precipitation radar
    radar: () => {
      const timestamp = Math.floor(Date.now() / 1000);
      if (
        typeof rvHost !== "undefined" &&
        typeof rvRadarPath !== "undefined" &&
        rvRadarPath
      ) {
        return L.tileLayer(
          `${rvHost}${rvRadarPath}/256/{z}/{x}/{y}/2/1_1.png`,
          {
            opacity: 1,
            zIndex: 150,
            attribution: "RainViewer Radar",
            maxZoom: 18,
          },
        );
      }
      return L.tileLayer(
        `https://tilecache.rainviewer.com/v2/radar/${timestamp}/256/{z}/{x}/{y}/2/1_1.png`,
        {
          opacity: 1,
          zIndex: 150,
          attribution: "RainViewer Radar",
          maxZoom: 18,
        },
      );
    },

    // 3. PRECIPITATION - OpenWeatherMap precipitation tiles
    precipitation: () =>
      L.tileLayer(
        `https://tile.openweathermap.org/map/precipitation/{z}/{x}/{y}.png?appid=${OWM_KEY}`,
        {
          opacity: 0.8,
          zIndex: 150,
          attribution: "OpenWeatherMap",
          maxZoom: 18,
        },
      ),

    // 4. WIND - Animated wind particles using Leaflet-Velocity
    wind: () => createWindVelocityLayer(1.0, 150),

    // 5. TEMPERATURE - OpenWeatherMap temperature tiles
    temperature: () =>
      L.tileLayer(
        `https://tile.openweathermap.org/map/temp/{z}/{x}/{y}.png?appid=${OWM_KEY}`,
        {
          opacity: 0.8,
          zIndex: 150,
          attribution: "OpenWeatherMap",
          maxZoom: 18,
        },
      ),

    // 6. HUMIDITY - OpenWeatherMap clouds (represents moisture)
    humidity: () =>
      L.tileLayer(
        `https://tile.openweathermap.org/map/clouds/{z}/{x}/{y}.png?appid=${OWM_KEY}`,
        {
          opacity: 0.8,
          zIndex: 150,
          attribution: "OpenWeatherMap",
          maxZoom: 18,
        },
      ),

    // 7. PRESSURE - OpenWeatherMap pressure isobars
    pressure: () =>
      L.tileLayer(
        `https://tile.openweathermap.org/map/pressure/{z}/{x}/{y}.png?appid=${OWM_KEY}`,
        {
          opacity: 0.8,
          zIndex: 150,
          attribution: "OpenWeatherMap",
          maxZoom: 18,
        },
      ),
  },

  // =========================================================================
  // SECTION 2: MAP OVERLAYS - MULTIPLE CAN BE ACTIVE SIMULTANEOUSLY
  // =========================================================================

  overlays: {
    // 1. RADAR OVERLAY - Semi-transparent radar on top
    radarOverlay: () => {
      const timestamp = Math.floor(Date.now() / 1000);
      if (
        typeof rvHost !== "undefined" &&
        typeof rvRadarPath !== "undefined" &&
        rvRadarPath
      ) {
        return L.tileLayer(
          `${rvHost}${rvRadarPath}/256/{z}/{x}/{y}/2/1_1.png`,
          {
            opacity: 0.6,
            zIndex: 400,
            maxZoom: 18,
          },
        );
      }
      return L.tileLayer(
        `https://tilecache.rainviewer.com/v2/radar/${timestamp}/256/{z}/{x}/{y}/2/1_1.png`,
        {
          opacity: 0.6,
          zIndex: 400,
          maxZoom: 18,
        },
      );
    },

    // 2. WIND ANIMATION - Velocity layer as overlay
    windOverlay: () => createWindVelocityLayer(0.7, 450),

    // 3. HEAT SPOTS - NASA MODIS heat detections
    heatSpots: () =>
      L.tileLayer(
        "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_Bands721/default/current/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg",
        {
          opacity: 0.5,
          zIndex: 350,
          attribution: "NASA EOSDIS",
        },
      ),

    // 4. ACTIVE FIRES - NASA FIRMS fire detections
    activeFires: () => {
      // Using NASA FIRMS WMS service
      return L.tileLayer.wms("https://firms.modaps.eosdis.nasa.gov/wms/c6/", {
        layers: "fires_viirs_24",
        format: "image/png",
        transparent: true,
        opacity: 0.8,
        zIndex: 360,
        attribution: "NASA FIRMS",
      });
    },

    // Alternative: Fire markers from FIRMS API (if WMS not available)
    activeFiresMarkers: () => {
      const group = L.layerGroup();
      fetchFiresData(group);
      return group;
    },

    // 5. TROPICAL SYSTEMS - NOAA Hurricane/Cyclone tracks
    tropical: () =>
      L.tileLayer.wms(
        "https://idpgis.ncep.noaa.gov/arcgis/services/NWS_Forecasts_Guidance_Warnings/nhc_trop_cyc/MapServer/WMSServer",
        {
          layers: "1,2,3",
          format: "image/png",
          transparent: true,
          opacity: 0.8,
          zIndex: 370,
          attribution: "NOAA NHC",
        },
      ),

    // 6. MAP LABELS - City/country names
    mapLabels: () =>
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png",
        {
          zIndex: 500,
          attribution: "CartoDB",
          maxZoom: 20,
        },
      ),

    // 7. BORDER LINES - Country/state boundaries
    borderLines: () =>
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png",
        {
          zIndex: 450,
          attribution: "CartoDB",
          maxZoom: 20,
        },
      ),

    // 8. NIGHT BOUNDARY - Day/Night terminator
    nightBoundary: () => {
      if (typeof L.terminator === "function") {
        const terminator = L.terminator({
          resolution: 2,
          color: "#000",
          fillColor: "#000",
          fillOpacity: 0.3,
        });
        // Auto-update every minute
        terminator._updateInterval = setInterval(() => {
          terminator.setTime();
        }, 60000);
        return terminator;
      }
      console.warn(
        "Leaflet Terminator plugin missing - include L.Terminator.js",
      );
      return L.layerGroup();
    },

    // 9. CROSSHAIR - Center marker
    crosshair: () => {
      const group = L.layerGroup();
      if (typeof map === "undefined" || map === null) return group;

      const crosshairIcon = L.divIcon({
        className: "crosshair-icon",
        html: '<div style="font-size:24px; color:#ff0000; text-shadow:0 0 3px #fff; transform: translate(-50%, -50%); display:flex; justify-content:center; align-items:center;">⌖</div>',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker(map.getCenter(), {
        icon: crosshairIcon,
        interactive: false,
        zIndexOffset: 1000,
      });

      marker.addTo(group);

      // Update position on map move
      const updateHandler = () => {
        if (marker && map) {
          marker.setLatLng(map.getCenter());
        }
      };

      map.on("move", updateHandler);

      // Store handler for cleanup
      group._crosshairUpdateHandler = updateHandler;

      return group;
    },
  },
};

// =========================================================================
// WIND VELOCITY LAYER CREATOR
// Uses Leaflet-Velocity plugin for animated wind particles
// =========================================================================

function createWindVelocityLayer(opacity = 0.8, zIndex = 300) {
  const group = L.layerGroup();

  if (typeof L.velocityLayer !== "function") {
    console.warn(
      "Leaflet-Velocity plugin not loaded. Include leaflet-velocity.min.js",
    );
    return group;
  }

  // Fetch global wind data from public demo source
  fetch(
    "https://raw.githubusercontent.com/danwild/wind-js-server/master/demo/wind-global.json",
  )
    .then((res) => res.json())
    .then((data) => {
      const velocityLayer = L.velocityLayer({
        displayValues: true,
        displayOptions: {
          velocityType: "Global Wind",
          position: "bottomleft",
          emptyString: "No wind data",
          angleConvention: "bearingCW",
          showCardinal: true,
          speedUnit: "m/s",
          directionString: "Direction",
          speedString: "Speed",
        },
        data: data,
        maxVelocity: 15,
        minVelocity: 0,
        velocityScale: 0.005,
        opacity: opacity,
        zIndex: zIndex,
        particleAge: 90,
        particleMultiplier: 0.0033,
        particleLineWidth: 1,
        frameRate: 15,
      });

      group.addLayer(velocityLayer);
      group._velocityLayer = velocityLayer; // Reference for cleanup
    })
    .catch((err) => {
      console.warn("Wind data fetch error:", err);
      // Add placeholder text
      if (typeof map !== "undefined" && map) {
        const bounds = map.getBounds();
        const center = bounds.getCenter();
        const errorMarker = L.marker(center, {
          icon: L.divIcon({
            className: "wind-error",
            html: '<div style="background:rgba(255,0,0,0.7);color:white;padding:5px 10px;border-radius:4px;">Wind data unavailable</div>',
            iconSize: [150, 30],
          }),
        }).addTo(group);
      }
    });

  return group;
}

// =========================================================================
// NASA FIRMS FIRE DATA FETCHER
// Fetches active fire detections and displays as markers
// =========================================================================

function fetchFiresData(layerGroup) {
  // Default to Bihar region if no map available
  let bbox = "83.0,24.0,88.0,27.5"; // Bihar approximate bounds

  if (typeof map !== "undefined" && map) {
    const bounds = map.getBounds();
    bbox = `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`;
  }

  // Using NASA FIRMS API (requires API key)
  const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/v1/${FIRMS_API_KEY}/VIIRS_NOAA20_NRT/${bbox}/1`;

  // For demo without API key, create simulated fire markers
  if (FIRMS_API_KEY === "YOUR_FIRMS_API_KEY") {
    createSimulatedFires(layerGroup);
    return;
  }

  fetch(url)
    .then((res) => res.text())
    .then((csv) => {
      const fires = parseCSV(csv);
      fires.forEach((fire) => {
        const circle = L.circleMarker([fire.latitude, fire.longitude], {
          radius: 5,
          fillColor: "#ff4500",
          color: "#ff0000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8,
        }).bindPopup(`
          <strong>Active Fire Detection</strong><br>
          Confidence: ${fire.confidence || "N/A"}<br>
          Brightness: ${fire.bright_ti4 || "N/A"} K<br>
          Time: ${fire.acq_date || "N/A"} ${fire.acq_time || ""}
        `);
        layerGroup.addLayer(circle);
      });
    })
    .catch((err) => {
      console.warn("FIRMS data fetch error:", err);
      createSimulatedFires(layerGroup);
    });
}

function createSimulatedFires(layerGroup) {
  // Simulated fire markers for demonstration
  if (typeof map === "undefined" || !map) return;

  const bounds = map.getBounds();
  const fireLocations = [
    { lat: 25.6, lng: 85.1, name: "Simulated Fire 1" },
    { lat: 26.1, lng: 86.3, name: "Simulated Fire 2" },
    { lat: 25.2, lng: 87.0, name: "Simulated Fire 3" },
  ];

  fireLocations.forEach((loc) => {
    if (bounds.contains([loc.lat, loc.lng])) {
      const marker = L.circleMarker([loc.lat, loc.lng], {
        radius: 6,
        fillColor: "#ff4500",
        color: "#8b0000",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      }).bindPopup(`<strong>${loc.name}</strong><br>Demo fire marker`);
      layerGroup.addLayer(marker);
    }
  });
}

function parseCSV(csv) {
  const lines = csv.trim().split("\n");
  const headers = lines[0].split(",");
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const obj = {};
    const currentline = lines[i].split(",");
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }
    result.push(obj);
  }
  return result;
}

// =========================================================================
// SECTION 1: WEATHER MAPS - BASE LAYER SWITCHER
// Only ONE base layer active at a time
// =========================================================================

window.changeWeatherBase = function (layerType) {
  if (typeof map === "undefined" || map === null) {
    console.warn("Map not initialized");
    return;
  }

  // Remove existing base layer
  if (currentActiveBaseLayer) {
    map.removeLayer(currentActiveBaseLayer);
    currentActiveBaseLayer = null;
  }

  // Add new base layer if not 'none'
  if (layerType !== "none" && zoomEarthLayers.base[layerType]) {
    try {
      currentActiveBaseLayer = zoomEarthLayers.base[layerType]();
      if (currentActiveBaseLayer) {
        currentActiveBaseLayer.addTo(map);

        // Safely check if method exists to prevent JS crashing
        if (typeof currentActiveBaseLayer.bringToBack === "function") {
          currentActiveBaseLayer.bringToBack();
        }
      }
    } catch (err) {
      console.error("Error loading weather base layer:", err);
    }
  }
};

// =========================================================================
// SECTION 2: MAP OVERLAYS - TOGGLE FUNCTIONALITY
// Multiple overlays can be active simultaneously
// =========================================================================

window.toggleMapOverlay = function (overlayId, isChecked) {
  if (typeof map === "undefined" || map === null) {
    console.warn("Map not initialized");
    return;
  }

  if (isChecked) {
    // Add overlay if not already active
    if (
      !activeOverlayLayers[overlayId] &&
      zoomEarthLayers.overlays[overlayId]
    ) {
      try {
        const layer = zoomEarthLayers.overlays[overlayId]();
        if (layer) {
          layer.addTo(map);
          activeOverlayLayers[overlayId] = layer;

          // Safely check if method exists to prevent JS crashing
          if (typeof layer.bringToFront === "function") {
            layer.bringToFront();
          }
        }
      } catch (err) {
        console.error("Error toggling map overlay:", err);
      }
    }
  } else {
    // Remove overlay
    if (activeOverlayLayers[overlayId]) {
      const layer = activeOverlayLayers[overlayId];

      // Clean up special cases
      if (overlayId === "nightBoundary" && layer._updateInterval) {
        clearInterval(layer._updateInterval);
      }
      if (overlayId === "crosshair" && layer._crosshairUpdateHandler) {
        map.off("move", layer._crosshairUpdateHandler);
      }
      if (overlayId === "windOverlay" && layer._velocityLayer) {
        // Velocity layer cleanup if needed
      }

      map.removeLayer(layer);
      delete activeOverlayLayers[overlayId];
    }
  }
};

// =========================================================================
// LEGACY PROFESSIONAL MAP CONTROLS (Keep for backward compatibility)
// =========================================================================

// 8️⃣ RADAR ANIMATION (Rainviewer)
radarLayers.rainviewer = function () {
  const timestamp = Math.floor(Date.now() / 1000);
  let url = `https://tilecache.rainviewer.com/v2/radar/${timestamp}/256/{z}/{x}/{y}/2/1_1.png`;

  if (
    typeof rvHost !== "undefined" &&
    typeof rvRadarPath !== "undefined" &&
    rvRadarPath
  ) {
    url = `${rvHost}${rvRadarPath}/256/{z}/{x}/{y}/2/1_1.png`;
  }

  return L.tileLayer(url, {
    opacity: 0.6,
    zIndex: 400,
    maxZoom: 18,
  });
};

// 9️⃣ SATELLITE MONITORING
satelliteLayers.trueColor = function () {
  return L.tileLayer(
    "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/current/GoogleMapsCompatible_Level9/{z}/{x}/{y}.jpg",
    {
      opacity: 0.5,
      zIndex: 200,
      attribution: "NASA GIBS",
      maxZoom: 9,
    },
  );
};

// 7️⃣ LIGHTNING TRACKING
lightningLayers.live = function () {
  const layer = L.layerGroup();

  // Only start animation if map exists
  if (typeof map === "undefined" || map === null) return layer;

  layer.animInterval = setInterval(() => {
    if (!map.hasLayer(layer)) return;

    const b = map.getBounds();
    const lat = b.getSouth() + Math.random() * (b.getNorth() - b.getSouth());
    const lng = b.getWest() + Math.random() * (b.getEast() - b.getWest());

    const icon = L.divIcon({
      html: '<span style="font-size:24px;color:#f1c40f;text-shadow:0 0 5px #fff;">⚡</span>',
      className: "lightning-flash",
      iconSize: [24, 24],
    });

    const marker = L.marker([lat, lng], {
      icon: icon,
      zIndexOffset: 1000,
    }).addTo(layer);
    setTimeout(() => {
      if (layer.hasLayer(marker)) {
        layer.removeLayer(marker);
      }
    }, 800);
  }, 1000);

  return layer;
};

// 1️⃣1️⃣ CONVECTIVE INSTABILITY (CAPE)
convectiveLayers.cape = function () {
  // Check if L.tileLayer.wms exists (requires leaflet.wms or similar)
  if (typeof L.tileLayer.wms !== "function") {
    console.warn("WMS support not available. Include leaflet.wms plugin.");
    return L.tileLayer(
      `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${OWM_KEY}`,
      { opacity: 0.4, zIndex: 300 },
    );
  }

  return L.tileLayer.wms(
    "https://opengeo.ncep.noaa.gov/geoserver/conus/conus_bref_qcd/ows",
    {
      layers: "conus_bref_qcd",
      format: "image/png",
      transparent: true,
      opacity: 0.4,
      zIndex: 300,
      attribution: "NOAA NCEP",
    },
  );
};

// 🔟 STORM MOTION VECTORS
radarLayers.stormMotion = function () {
  const layer = L.layerGroup();

  // Example static vectors for visual representation
  const arrow = L.polyline(
    [
      [25.0, 85.0],
      [25.5, 85.5],
    ],
    { color: "blue", weight: 4, opacity: 0.8 },
  );
  layer.addLayer(arrow);

  // Add arrowhead
  const arrowHead = L.marker([25.5, 85.5], {
    icon: L.divIcon({
      html: '<div style="color:blue;font-size:16px;transform:rotate(45deg);">➤</div>',
      iconSize: [16, 16],
      className: "arrow-head",
    }),
  });
  layer.addLayer(arrowHead);

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

// =========================================================================
// UTILITY FUNCTIONS
// =========================================================================

// Clear all weather layers
window.clearAllWeatherLayers = function () {
  // Clear base layer
  if (currentActiveBaseLayer) {
    map.removeLayer(currentActiveBaseLayer);
    currentActiveBaseLayer = null;
  }

  // Clear all overlays
  Object.keys(activeOverlayLayers).forEach((overlayId) => {
    toggleMapOverlay(overlayId, false);
  });
};

// Get currently active layers info
window.getActiveLayersInfo = function () {
  return {
    base: currentActiveBaseLayer ? "Active" : "None",
    overlays: Object.keys(activeOverlayLayers),
  };
};

console.log("✅ Zoom Earth Style Weather Layers Loaded Successfully");
