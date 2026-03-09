let map,
  geojsonLayer,
  phenomenaMarkersLayer,
  streetLayer,
  satelliteLayer,
  hybridLayer;
let districtWinds = {};
let isLayoutEditMode = false;
let zoomControl = null;
let currentLang = localStorage.getItem("lang") || "hi";
let windMode = "current"; // 'current', 'max', 'min'
let availableDates = [];
let selectedDate = null; // YYYY-MM-DD
let compareDate = null; // YYYY-MM-DD
let isCompareMode = false;
let trendChart = null;
let currentChartOid = null;

const uiTranslations = {
  hi: {
    title: "बिहार लाइव हवा (Live Wind)",
    refresh: "रिफ्रेश करें",
  },
  en: {
    title: "Bihar Live Wind",
    refresh: "Refresh Data",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initWindDisplay();

  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
  }
});

function initWindDisplay() {
  let root = document.getElementById("liveRoot");

  // Inject CSS (Reusing live.js styles for consistency)
  const style = document.createElement("style");
  style.innerHTML = `
    html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; font-family: "Noto Sans Devanagari", sans-serif; background: #f4f7f6; }
    #liveRoot { width: 100%; height: 100%; display: flex; flex-direction: column; }
    .live-header { position: fixed; top: 0; left: 0; width: 100%; height: auto; min-height: 110px; background: rgba(255,255,255,0.65); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); z-index: 2000; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border-bottom: 1px solid rgba(255,255,255,0.5); padding: 10px 0; }
    .header-content { text-align: center; text-shadow: 0 1px 1px rgba(255,255,255,0.8); margin-bottom: 8px; }
    .header-content h1 { margin: 0; color: #2c3e50; font-size: 1.8em; font-weight: 800; }
    #map { width: 100%; height: 100%; border-radius: 15px; z-index: 1; }
    .display-content-area { margin-top: 120px; flex: 1; width: 99%; max-width: 100%; margin-left: auto; margin-right: auto; height: calc(100vh - 130px); min-height: 600px; position: relative; border-radius: 15px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.1); background: white; border: 4px solid #2c3e50; }
    .live-controls-row { display: flex; gap: 8px; flex-wrap: nowrap; overflow-x: auto; justify-content: center; align-items: center; width: 100%; padding: 0 20px; white-space: nowrap; scrollbar-width: thin; }
    .live-controls-bottom { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 15px; align-items: center; background: rgba(255,255,255,0.95); padding: 10px 25px; border-radius: 30px; box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
    .control-btn { border: none; background: none; cursor: pointer; font-size: 1.4em; color: #2c3e50; transition: 0.2s; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; }
    .control-btn:hover { background: rgba(0,0,0,0.05); color: #667eea; transform: scale(1.1); }
    .layer-btn { padding: 6px 12px; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; background: white; font-size: 0.9em; font-weight: 600; color: #555; }
    .layer-btn.active { background: #667eea; color: white; border-color: #667eea; }
    
    /* Tricolor Gradient Background */
    .tricolor-glow {
        background: linear-gradient(90deg, #FF9933, #FFFFFF, #138808, #FF9933);
        background-size: 200% auto;
        animation: tricolorMove 3s linear infinite;
        color: #000080;
        padding: 5px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        display: inline-block;
    }
    @keyframes tricolorMove {
        to { background-position: 200% center; }
    }
    
    .temp-block {
        background: transparent;
        border: none;
        box-shadow: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 0;
        min-width: auto;
    }
    .t-name { font-size: 11px; font-weight: 700; color: #2c3e50; text-shadow: 2px 2px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff; margin-bottom: 1px; font-family: 'Verdana', sans-serif; text-transform: uppercase; letter-spacing: 0.5px; }
    .t-val { font-size: 16px; font-weight: 900; margin: 0; text-shadow: 2px 2px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff; }
    .t-diff { font-size: 12px; font-weight: 800; margin-top: 0; text-shadow: 2px 2px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff; }
    
    /* Stats Panels */
    .stats-container { position: absolute; top: 90px; right: 10px; z-index: 1001; display: flex; flex-direction: column; gap: 8px; pointer-events: auto; }
    .stats-box { background: rgba(255,255,255,0.95); border-radius: 6px; padding: 8px 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.2); width: 210px; font-size: 12px; border-left: 5px solid #333; transition: transform 0.2s; }
    .stats-box:hover { transform: translateX(-5px); }
    .stats-header { font-weight: 800; border-bottom: 1px solid #ddd; margin-bottom: 5px; padding-bottom: 3px; text-transform: uppercase; font-size: 11px; color: #444; display: flex; justify-content: space-between; align-items: center; }
    .stats-row { display: flex; justify-content: space-between; margin-bottom: 3px; align-items: center; }
    .stats-label { color: #555; font-weight: 600; }
    .stats-val { font-weight: 800; font-size: 13px; color: #000; }
    
    /* Theme Colors for Stats */
    .theme-current { border-left-color: #2ecc71; }
    .theme-max { border-left-color: #e74c3c; }
    .theme-min { border-left-color: #3498db; }
    
    /* Chart Modal */
    .chart-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 3000; display: none; justify-content: center; align-items: center; backdrop-filter: blur(5px); }
    .chart-content { background: white; padding: 20px; border-radius: 15px; width: 90%; max-width: 800px; max-height: 90vh; overflow-y: auto; position: relative; box-shadow: 0 10px 25px rgba(0,0,0,0.3); animation: slideUp 0.3s ease; }
    .close-chart { position: absolute; top: 10px; right: 15px; font-size: 24px; cursor: pointer; color: #555; transition: 0.2s; }
    .close-chart:hover { color: #000; transform: scale(1.1); }
    .chart-btn { padding: 6px 12px; border-radius: 4px; border: none; cursor: pointer; color: white; font-weight: bold; display: flex; align-items: center; gap: 5px; font-size: 13px; transition: 0.2s; }
    .chart-btn:hover { opacity: 0.9; transform: translateY(-1px); }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  `;
  document.head.appendChild(style);

  root.innerHTML = `
    <header class="live-header">
        <img src="assets/logo.png" style="height: 70px; position: absolute; top: 20px; left: 20px;">
        <div class="header-content">
            <h1 id="liveTitle" class="tricolor-glow">बिहार लाइव हवा (Live Wind)</h1>
        </div>
        
        <div class="live-controls-row">
            <button class="layer-btn active" id="btnWindCurrent" onclick="setWindMode('current')" title="Current Wind Speed"><i class="fas fa-clock"></i> Current</button>
            <button class="layer-btn" id="btnWindMax" onclick="setWindMode('max')" title="Max Wind"><i class="fas fa-arrow-up"></i> Max</button>
            <button class="layer-btn" id="btnWindMin" onclick="setWindMode('min')" title="Min Wind"><i class="fas fa-arrow-down"></i> Min</button>
            <button class="layer-btn" id="btnWindAvg" onclick="setWindMode('avg')" title="Average Wind"><i class="fas fa-percent"></i> Avg</button>
            <div style="width:1px; height:20px; background:#ccc; margin:0 5px;"></div>
            
            <select id="dateSelect" onchange="handleDateChange(this.value)" class="layer-btn" style="font-weight:bold; cursor:pointer;"></select>
            <button id="btnCompareToggle" onclick="toggleCompareMode()" class="layer-btn" title="Compare Dates"><i class="fas fa-exchange-alt"></i></button>
            <select id="compareDateSelect" onchange="handleCompareDateChange(this.value)" class="layer-btn" style="display:none; font-weight:bold; cursor:pointer; border-color:#e74c3c; color:#c0392b;"></select>
            
            <div style="width:1px; height:20px; background:#ccc; margin:0 5px;"></div>
            <button class="layer-btn" onclick="window.location.href='index.html'" title="Home"><i class="fas fa-home"></i></button>
            <button class="layer-btn" onclick="window.location.href='live.html'" title="Live Preview"><i class="fas fa-tower-broadcast"></i></button>
            <button class="layer-btn" onclick="window.location.href='temp.html'" title="Temperature Map"><i class="fas fa-temperature-high"></i></button>
            <button class="layer-btn active" onclick="window.location.href='wind.html'" title="Wind Map"><i class="fas fa-wind"></i></button>
            <button class="layer-btn" onclick="window.location.href='rain.html'" title="Rain Map"><i class="fas fa-cloud-showers-heavy"></i></button>
            <button class="layer-btn" onclick="window.location.href='humidity.html'" title="Humidity Map"><i class="fas fa-tint"></i></button>
            <button class="layer-btn" onclick="window.location.href='display.html'" title="Display Mode"><i class="fas fa-tv"></i></button>
            <button class="layer-btn active" onclick="setLayer('street')" id="btnStreet">Street</button>
            <button class="layer-btn" onclick="setLayer('satellite')" id="btnSat">Satellite</button>
            <button class="layer-btn" onclick="setLayer('hybrid')" id="btnHybrid">Hybrid</button>
            <button class="layer-btn" onclick="setLayer('clean')" id="btnClean">Clean</button>
            <button class="layer-btn" onclick="document.getElementById('mapBgInput').click()" title="Change Map Background"><i class="fas fa-palette"></i></button>
            <input type="color" id="mapBgInput" style="display:none" onchange="updateMapBackground(this.value)">
            <button class="layer-btn" onclick="toggleDarkMode()" id="btnDarkMode" title="Dark Mode"><i class="fas fa-moon"></i></button>
            <label class="layer-btn" style="display:flex; align-items:center; gap:5px; cursor:pointer;">
                <input type="checkbox" id="toggleLiveZoom" onchange="toggleMapZoom(this.checked)">
                Zoom
            </label>
            <button class="layer-btn" onclick="toggleLanguage()" id="btnLang" title="Language">${currentLang.toUpperCase()}</button>
        </div>
    </header>
        <div class="display-content-area">
            <div id="map"></div>
            
            <!-- Header inside Map Grid -->
            <div id="slideHeader" style="position: absolute; top: 10px; left: 50%; transform: translateX(-50%); z-index: 1000; text-align: center; font-size: 1.2em; font-weight: bold; color: #2c3e50; padding: 5px 20px; background: rgba(255,255,255,0.9); border: 2px solid #2c3e50; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); min-width: 300px; pointer-events: auto;">
                Fetching Data...
            </div>
            
            <div class="live-controls-bottom">
                <button class="control-btn" onclick="refreshData()" title="Refresh Data"><i class="fas fa-sync-alt"></i></button>
                <button class="control-btn" onclick="fitMapBounds()" title="Fit Map"><i class="fas fa-compress-arrows-alt"></i></button>
                <button class="control-btn" onclick="toggleFullScreen()" id="btnFullScreen" title="Full Screen"><i class="fas fa-expand"></i></button>
                <button class="control-btn" onclick="downloadMapImage()" title="Download Image"><i class="fas fa-camera"></i></button>
                <button class="control-btn" onclick="downloadMapPDF()" title="Download PDF"><i class="fas fa-file-pdf"></i></button>
            </div>
        </div>
        <div id="windLegend" class="info legend" style="position:absolute; bottom:20px; right:10px; z-index:1001; background:rgba(255,255,255,0.9); padding:10px; border-radius:8px; box-shadow:0 0 15px rgba(0,0,0,0.2); pointer-events:auto;"></div>
        
        <!-- Chart Modal -->
        <div id="chartModal" class="chart-modal">
            <div class="chart-content">
                <span class="close-chart" onclick="closeChartModal()">&times;</span>
                <div style="margin-bottom:15px; text-align:center; display:flex; justify-content:center; align-items:center; gap:10px; flex-wrap:wrap;">
                    <div style="display:flex; align-items:center; gap:5px; background:#f8f9fa; padding:5px 10px; border-radius:5px; border:1px solid #ddd;">
                        <label style="font-weight:bold; font-size:12px;">From:</label>
                        <input type="date" id="chartStartDate" onchange="updateTrendChartFilter()" style="border:1px solid #ccc; padding:3px; border-radius:3px;">
                        <label style="font-weight:bold; font-size:12px;">To:</label>
                        <input type="date" id="chartEndDate" onchange="updateTrendChartFilter()" style="border:1px solid #ccc; padding:3px; border-radius:3px;">
                    </div>
                    <div>
                        <label style="font-weight:bold; margin-right:5px; color:#333;">Compare:</label>
                        <select id="compareDistrictSelect" onchange="updateChartComparison(this.value)" style="padding:5px; border-radius:4px; border:1px solid #ccc; cursor:pointer;">
                            <option value="">None</option>
                        </select>
                    </div>
                    <button onclick="exportChartDataToCSV()" class="chart-btn" style="background:#27ae60;"><i class="fas fa-file-csv"></i> CSV</button>
                    <button onclick="downloadChartImage()" class="chart-btn" style="background:#2980b9;"><i class="fas fa-camera"></i> Image</button>
                    <button onclick="downloadChartPDF()" class="chart-btn" style="background:#c0392b;"><i class="fas fa-file-pdf"></i> PDF</button>
                </div>
                <div id="chartWrapper" style="position: relative; height: 60vh; width: 100%;">
                    <canvas id="trendChart"></canvas>
                </div>
            </div>
        </div>
  `;

  initMap();
  updateLanguageUI();
  updateWindLegend();
  initDateSelectors();
  if (localStorage.getItem("darkMode") === "true") {
    const btn = document.getElementById("btnDarkMode");
    if (btn) btn.innerHTML = '<i class="fas fa-sun"></i>';
  }
}

function initMap() {
  map = L.map("map", {
    zoomControl: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    dragging: false,
    boxZoom: false,
    touchZoom: false,
  }).setView([25.6, 85.6], 7);

  streetLayer = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    { maxZoom: 18, attribution: "© OpenStreetMap" },
  );

  satelliteLayer = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    { maxZoom: 18, attribution: "Tiles &copy; Esri" },
  );

  hybridLayer = L.tileLayer(
    "https://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}",
    { attribution: "Google", maxZoom: 20 },
  );

  streetLayer.addTo(map);
  phenomenaMarkersLayer = L.layerGroup().addTo(map);

  setTimeout(() => {
    map.invalidateSize();
  }, 200);

  window.addEventListener("resize", () => {
    map.invalidateSize();
  });

  // Add Static Overlays
  const mapContainer = map.getContainer();
  const overlaysContainer = L.DomUtil.create(
    "div",
    "map-overlays-container",
    mapContainer,
  );
  overlaysContainer.style.position = "absolute";
  overlaysContainer.style.top = "0";
  overlaysContainer.style.left = "0";
  overlaysContainer.style.width = "100%";
  overlaysContainer.style.height = "100%";
  overlaysContainer.style.pointerEvents = "none";
  overlaysContainer.style.zIndex = "1000";

  overlaysContainer.innerHTML = `
      <div id="overlayLeft" style="position:absolute; top:10px; left:10px; z-index:1001; display:flex; flex-direction:column; align-items:center; pointer-events:auto;">
          <img src="assets/logo.png" class="map-logo-left" style="height:70px; margin-left: 10px;">
          <div style="text-align:center; margin-top:5px; display:flex; flex-direction:column; align-items:center;">
              <div class="map-logo-text" style="margin-top:0; font-size:14px; background:rgba(255,255,255,0.8); padding:2px 5px; border-radius:4px; white-space:nowrap;">मौसम विज्ञान केंद्र, पटना</div>
              <div id="liveMapDateOverlay" style="margin-top:2px; font-weight:bold; color:#000; background:rgba(255,255,255,0.8); padding:2px 5px; border-radius:4px; font-size:12px; box-shadow: 0 1px 3px rgba(0,0,0,0.2); white-space:nowrap;"></div>
          </div>
      </div>
      <div id="overlayTopRight" style="position:absolute; top:10px; right:10px; z-index:1001; display:flex; gap:10px; align-items:center; pointer-events:auto;">
          <img src="assets/IMD_150_Year_Logo.png" style="height:70px;">
          <img src="assets/North_Arrow.png" style="height:60px;">
      </div>
      <div id="statsOverlay" class="stats-container"></div>
  `;

  updateDateOverlay();

  // Load Shapefile
  const candidates = [
    "data/Bihar_Districts_Shapefile/Bihar",
    "data/Bihar_Districts_Shapefile/bihar",
    "Data/Bihar_Districts_Shapefile/Bihar",
    "Data/Bihar_Districts_Shapefile/bihar",
    "data/bihar_districts_shapefile/bihar",
    "data/bihar_districts_shapefile/Bihar",
    "Data/bihar_districts_shapefile/bihar",
    "Data/bihar_districts_shapefile/Bihar",
  ];

  const tryLoad = async () => {
    for (const base of candidates) {
      try {
        const shpRes = await fetch(base + ".shp");
        if (shpRes.ok) {
          const shpBuffer = await shpRes.arrayBuffer();
          const dbfRes = await fetch(base + ".dbf");
          if (!dbfRes.ok) continue;
          const dbfBuffer = await dbfRes.arrayBuffer();
          let prjStr = null;
          try {
            const prjRes = await fetch(base + ".prj");
            if (prjRes.ok) prjStr = await prjRes.text();
          } catch (e) {}
          return { shpBuffer, dbfBuffer, prjStr };
        }
      } catch (e) {}
    }
    throw new Error("Shapefile not found in any candidate path.");
  };

  tryLoad()
    .then(({ shpBuffer, dbfBuffer, prjStr }) => {
      const geojson = shp.combine([
        shp.parseShp(shpBuffer, prjStr || undefined),
        shp.parseDbf(dbfBuffer),
      ]);
      geojsonLayer = L.geoJSON(geojson, {
        style: {
          fillColor: "#ccc",
          weight: 2,
          opacity: 1,
          color: "#333",
          fillOpacity: 0.3,
        },
        onEachFeature: (feature, layer) => {
          // Tooltip removed to prevent overlap with custom marker
          layer.on("click", () => {
            openTrendChart(
              feature.properties.OBJECTID,
              feature.properties.D_NAME,
            );
          });
        },
      }).addTo(map);
      map.fitBounds(geojsonLayer.getBounds());

      // Fetch Winds after map load
      fetchWinds();
      // Auto-refresh every 15 minutes
      setInterval(fetchWinds, 900000);
    })
    .catch((err) => {
      console.error("Map loading failed:", err);
      alert("Map loading failed: " + err.message);
    });
}

function initDateSelectors() {
  const today = new Date();
  availableDates = [];
  // Generate last 31 days (Today + 30 past days)
  for (let i = 0; i < 31; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    availableDates.push(dateStr);
  }
  selectedDate = availableDates[0]; // Default to today
}

function fetchWinds() {
  if (!geojsonLayer) return;

  const header = document.getElementById("slideHeader");
  if (header) header.innerText = "Updating Wind Data...";

  const requests = [];

  geojsonLayer.eachLayer((layer) => {
    const center = layer.getBounds().getCenter();
    const oid = String(layer.feature.properties.OBJECTID);

    // Open-Meteo API for Wind
    // Fetching 30 past days + forecast days (default)
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${center.lat}&longitude=${center.lng}&current_weather=true&daily=wind_speed_10m_max&hourly=wind_speed_10m&past_days=30&timezone=auto`;

    requests.push(
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (data.daily && data.hourly) {
            const history = {};
            const timeArray = data.daily.time;

            // Process each day
            timeArray.forEach((dateStr, index) => {
              // Daily Max
              const max = data.daily.wind_speed_10m_max[index];

              // Calculate Min and Avg from Hourly (24 hours per day)
              const startHour = index * 24;
              const endHour = startHour + 24;
              const hourlySlice = data.hourly.wind_speed_10m.slice(
                startHour,
                endHour,
              );

              let min = 999;
              let sum = 0;
              let count = 0;

              hourlySlice.forEach((val) => {
                if (val !== null) {
                  if (val < min) min = val;
                  sum += val;
                  count++;
                }
              });

              const avg = count > 0 ? parseFloat((sum / count).toFixed(1)) : 0;
              if (min === 999) min = 0;

              history[dateStr] = { max, min, avg };
            });

            districtWinds[oid] = {
              current: data.current_weather.windspeed,
              history: history,
            };
          }
        })
        .catch((e) => console.error(`Failed to fetch for ${oid}`, e)),
    );
  });

  Promise.all(requests).then(() => {
    populateDateDropdowns();
    updateMapStyle();
    updateStatsForView();

    if (header) header.innerText = "Live Wind Speed (Updated)";
    updateDateOverlay();
  });
}

function setWindMode(mode) {
  windMode = mode;
  // Update buttons
  document.getElementById("btnWindCurrent").classList.remove("active");
  document.getElementById("btnWindMax").classList.remove("active");
  document.getElementById("btnWindMin").classList.remove("active");
  document.getElementById("btnWindAvg").classList.remove("active");

  if (mode === "current")
    document.getElementById("btnWindCurrent").classList.add("active");
  if (mode === "max")
    document.getElementById("btnWindMax").classList.add("active");
  if (mode === "min")
    document.getElementById("btnWindMin").classList.add("active");
  if (mode === "avg")
    document.getElementById("btnWindAvg").classList.add("active");

  updateMapStyle();
}
window.setWindMode = setWindMode;

function updateMapStyle() {
  if (!geojsonLayer) return;
  phenomenaMarkersLayer.clearLayers();

  // If comparing, force mode to max/min/avg (current not applicable for past)
  if (isCompareMode && windMode === "current") {
    setWindMode("max");
    return;
  }
  // If viewing past date, current is not applicable
  if (
    !isCompareMode &&
    selectedDate !== availableDates[0] &&
    windMode === "current"
  ) {
    setWindMode("max");
    return;
  }

  // 1. Calculate Dynamic Range (Min/Max) for the current mode
  let minVal = Infinity;
  let maxVal = -Infinity;

  geojsonLayer.eachLayer((layer) => {
    const oid = String(layer.feature.properties.OBJECTID);
    const val = getValueForDistrict(oid);

    if (val !== null && val !== undefined) {
      if (val < minVal) minVal = val;
      if (val > maxVal) maxVal = val;
    }
  });

  // Handle case with no data
  if (minVal === Infinity) {
    minVal = 0;
    maxVal = isCompareMode ? 10 : 30; // Smaller range for difference
  }
  // Ensure distinct min/max for gradient generation
  if (minVal === maxVal) {
    minVal -= 1;
    maxVal += 1;
  }

  // Update Legend with new dynamic range
  updateWindLegend(minVal, maxVal);

  geojsonLayer.eachLayer((layer) => {
    const oid = String(layer.feature.properties.OBJECTID);
    const val = getValueForDistrict(oid);

    if (val !== null && val !== undefined) {
      let displayVal,
        diffText,
        diffColor = "#000";

      displayVal = val.toFixed(1);

      if (isCompareMode) {
        diffText = "Difference";
        if (val > 0) diffColor = "#c0392b";
        else if (val < 0) diffColor = "#2980b9";
      } else {
        diffText = windMode.toUpperCase();
      }

      // Color coding
      const color = getColorForValue(
        val,
        minVal,
        maxVal,
        isCompareMode ? "compare" : windMode,
      );

      layer.setStyle({
        fillColor: color,
        fillOpacity: 0.7,
        color: "#333",
        weight: 2,
      });

      // Marker
      const center = layer.getBounds().getCenter();
      const districtName = layer.feature.properties.D_NAME;

      const iconHtml = `
        <div class="temp-block">
            <div class="t-name">${districtName}</div>
            <div class="t-val" style="color:#000">${displayVal} <span style="font-size:10px">km/h</span></div>
            <div class="t-diff" style="color:${diffColor}">${diffText}</div>
        </div>`;

      const icon = L.divIcon({
        html: iconHtml,
        className: "",
        iconSize: [100, 60],
        iconAnchor: [25, 40],
      });

      const marker = L.marker(center, { icon: icon }).addTo(
        phenomenaMarkersLayer,
      );

      let tooltipContent = `<div style="text-align:left; font-size:12px; min-width:100px;">
        <div style="font-weight:bold; border-bottom:1px solid #ccc; margin-bottom:3px; padding-bottom:2px;">${districtName}</div>`;

      if (isCompareMode) {
        tooltipContent += `<div>Diff: <b>${displayVal}</b> km/h</div>`;
        tooltipContent += `<div style="font-size:10px; color:#555;">${selectedDate} vs ${compareDate}</div>`;
      } else {
        const d = districtWinds[oid];
        const h = d && d.history ? d.history[selectedDate] : null;
        if (h) {
          if (selectedDate === availableDates[0]) {
            tooltipContent += `<div>Current: <b>${d.current}</b> km/h</div>`;
          }
          tooltipContent += `<div>Max: <b>${h.max}</b> km/h</div>`;
          tooltipContent += `<div>Min: <b>${h.min}</b> km/h</div>`;
          tooltipContent += `<div>Avg: <b>${h.avg}</b> km/h</div>`;
        }
      }
      tooltipContent += `</div>`;

      marker.bindTooltip(tooltipContent, {
        direction: "top",
        offset: [0, -40],
        opacity: 0.95,
      });

      marker.on("click", () => {
        openTrendChart(oid, layer.feature.properties.D_NAME);
      });
    }
  });
}

function getValueForDistrict(oid) {
  const d = districtWinds[oid];
  if (!d) return null;

  if (isCompareMode) {
    const h1 = d.history[selectedDate];
    const h2 = d.history[compareDate];
    if (!h1 || !h2) return null;
    // Compare Mode: Date 1 - Date 2
    return h1[windMode] - h2[windMode];
  } else {
    if (windMode === "current") {
      // Current is only valid if selectedDate is Today
      if (selectedDate === availableDates[0]) return d.current;
      // Fallback to max if viewing history in current mode (though we force switch)
      return d.history[selectedDate]?.max;
    }
    return d.history[selectedDate]?.[windMode];
  }
}

function getColorForValue(val, min, max, mode) {
  // Define palettes
  const palettes = {
    current: ["#2ecc71", "#f1c40f", "#e67e22", "#e74c3c"], // Green -> Yellow -> Orange -> Red
    min: ["#3498db", "#2ecc71"], // Blue -> Green
    max: ["#f1c40f", "#e67e22", "#c0392b"], // Yellow -> Orange -> Dark Red
    avg: ["#3498db", "#f1c40f", "#e67e22"], // Blue -> Yellow -> Orange
    compare: ["#2980b9", "#ffffff", "#c0392b"], // Blue (Less) -> White (Same) -> Red (More)
  };

  if (mode === "compare") {
    // Diverging scale centered at 0
    // Normalize -X to +X range to 0-1
    // We assume min is negative, max is positive usually
  }

  const colors = palettes[mode] || palettes.current;

  // Normalize value to 0-1 range
  let t = (val - min) / (max - min);
  t = Math.max(0, Math.min(1, t)); // Clamp

  // Map t to color segments
  const segments = colors.length - 1;
  const segmentLength = 1 / segments;
  const segmentIndex = Math.floor(t / segmentLength);

  // Handle exact max value case
  if (segmentIndex >= segments) return colors[colors.length - 1];

  const startColor = colors[segmentIndex];
  const endColor = colors[segmentIndex + 1];
  const localT = (t - segmentIndex * segmentLength) / segmentLength;

  return interpolateColor(startColor, endColor, localT);
}

function interpolateColor(c1, c2, factor) {
  // Simple hex interpolation
  const r1 = parseInt(c1.substring(1, 3), 16);
  const g1 = parseInt(c1.substring(3, 5), 16);
  const b1 = parseInt(c1.substring(5, 7), 16);

  const r2 = parseInt(c2.substring(1, 3), 16);
  const g2 = parseInt(c2.substring(3, 5), 16);
  const b2 = parseInt(c2.substring(5, 7), 16);

  const r = Math.round(r1 + factor * (r2 - r1));
  const g = Math.round(g1 + factor * (g2 - g1));
  const b = Math.round(b1 + factor * (b2 - b1));

  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function updateWindLegend(min, max) {
  const div = document.getElementById("windLegend");
  if (!div) return;

  const titles = {
    current: "Current Wind Speed (km/h)",
    min: "Minimum Wind Speed (km/h)",
    max: "Maximum Wind Speed (km/h)",
    avg: "Average Wind Speed (km/h)",
  };

  const palettes = {
    current: "linear-gradient(to right, #2ecc71, #f1c40f, #e67e22, #e74c3c)",
    min: "linear-gradient(to right, #3498db, #2ecc71)",
    max: "linear-gradient(to right, #f1c40f, #e67e22, #c0392b)",
    avg: "linear-gradient(to right, #3498db, #f1c40f, #e67e22)",
  };

  const bg = palettes[windMode] || palettes.current;
  const title = titles[windMode] || titles.current;

  div.innerHTML = `
        <div style="font-weight:bold; margin-bottom:5px; font-size:12px; border-bottom:1px solid #ccc; padding-bottom:3px;">${title}</div>
        <div style="height:15px; width:100%; background:${bg}; border-radius:3px; margin-bottom:5px;"></div>
        <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:bold; color:#333;">
            <span>${min !== undefined ? min.toFixed(1) : "Low"}</span>
            <span>${max !== undefined ? max.toFixed(1) : "High"}</span>
        </div>
    `;
}

function calculateStats(arr) {
  if (!arr || arr.length === 0) return { max: "N/A", min: "N/A", mean: "N/A" };
  let min = Infinity,
    max = -Infinity,
    sum = 0;
  arr.forEach((v) => {
    if (v < min) min = v;
    if (v > max) max = v;
    sum += v;
  });
  return {
    max: max.toFixed(1),
    min: min.toFixed(1),
    mean: (sum / arr.length).toFixed(1),
  };
}

function updateStatsForView() {
  const container = document.getElementById("statsOverlay");
  if (!container) return;

  // Collect data for current view
  const vals = [];
  if (geojsonLayer) {
    geojsonLayer.eachLayer((layer) => {
      const oid = String(layer.feature.properties.OBJECTID);
      const val = getValueForDistrict(oid);
      if (val !== null) vals.push(val);
    });
  }

  const stats = calculateStats(vals);
  let title = "Stats";
  if (isCompareMode) {
    title = "Difference (Date 1 - Date 2)";
  } else {
    title = `${windMode.charAt(0).toUpperCase() + windMode.slice(1)} Wind`;
  }

  const createPanel = (title, stats, themeClass, icon) => `
        <div class="stats-box ${themeClass}">
            <div class="stats-header">
                <span>${title}</span>
                <i class="fas ${icon}"></i>
            </div>
            <div class="stats-row">
                <span class="stats-label">Highest:</span>
                <span class="stats-val">${stats.max} km/h</span>
            </div>
            <div class="stats-row">
                <span class="stats-label">Lowest:</span>
                <span class="stats-val">${stats.min} km/h</span>
            </div>
            <div class="stats-row">
                <span class="stats-label">Average:</span>
                <span class="stats-val">${stats.mean} km/h</span>
            </div>
        </div>
    `;

  container.innerHTML = createPanel(
    title,
    stats,
    "theme-current",
    "fa-chart-bar",
  );
}

function refreshData() {
  fetchWinds();
}
window.refreshData = refreshData;

function updateDateOverlay() {
  const el = document.getElementById("liveMapDateOverlay");
  if (el) {
    const now = new Date();
    let text = selectedDate || now.toLocaleDateString("en-IN");

    if (isCompareMode) {
      text = `${selectedDate} vs ${compareDate}`;
    } else if (selectedDate === availableDates[0]) {
      text = `Today (${selectedDate})`;
    }

    el.innerText = text;
  }
}

function toggleMapZoom(enable) {
  if (enable) {
    map.dragging.enable();
    map.touchZoom.enable();
    map.doubleClickZoom.enable();
    map.scrollWheelZoom.enable();
    map.boxZoom.enable();
    if (!zoomControl) {
      zoomControl = L.control.zoom({ position: "bottomright" }).addTo(map);
    }
  } else {
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    if (zoomControl) {
      map.removeControl(zoomControl);
      zoomControl = null;
    }
    fitMapBounds();
  }
}

function updateMapBackground(color) {
  const mapDiv = document.getElementById("map");
  if (mapDiv) mapDiv.style.background = color;
}
window.updateMapBackground = updateMapBackground;

function setLayer(type) {
  if (map.hasLayer(streetLayer)) map.removeLayer(streetLayer);
  if (map.hasLayer(satelliteLayer)) map.removeLayer(satelliteLayer);
  if (map.hasLayer(hybridLayer)) map.removeLayer(hybridLayer);

  document
    .querySelectorAll(".layer-btn")
    .forEach((b) => b.classList.remove("active"));

  if (type === "street") {
    map.addLayer(streetLayer);
    document.getElementById("btnStreet").classList.add("active");
  } else if (type === "satellite") {
    map.addLayer(satelliteLayer);
    document.getElementById("btnSat").classList.add("active");
  } else if (type === "hybrid") {
    map.addLayer(hybridLayer);
    document.getElementById("btnHybrid").classList.add("active");
  } else if (type === "clean") {
    // No layer added
    document.getElementById("btnClean").classList.add("active");
  }
}
window.setLayer = setLayer;

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDark);
  const btn = document.getElementById("btnDarkMode");
  if (btn)
    btn.innerHTML = isDark
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';
}
window.toggleDarkMode = toggleDarkMode;

function toggleLanguage() {
  currentLang = currentLang === "hi" ? "en" : "hi";
  localStorage.setItem("lang", currentLang);
  updateLanguageUI();
}
window.toggleLanguage = toggleLanguage;

function updateLanguageUI() {
  const t = uiTranslations[currentLang];
  const titleEl = document.getElementById("liveTitle");
  const btn = document.getElementById("btnLang");
  if (titleEl) titleEl.innerText = t.title;
  if (btn) btn.innerText = currentLang.toUpperCase();
}

function fitMapBounds() {
  if (geojsonLayer) {
    map.fitBounds(geojsonLayer.getBounds());
  }
}
window.fitMapBounds = fitMapBounds;

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement
      .requestFullscreen()
      .catch((err) => console.error(err));
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
  }
}
window.toggleFullScreen = toggleFullScreen;

// --- Date & Compare Logic ---

function populateDateDropdowns() {
  const sel = document.getElementById("dateSelect");
  const compSel = document.getElementById("compareDateSelect");
  if (!sel || !compSel) return;

  sel.innerHTML = "";
  compSel.innerHTML = "";

  availableDates.forEach((date, idx) => {
    const label = idx === 0 ? `Today (${date})` : date;
    sel.innerHTML += `<option value="${date}">${label}</option>`;
    compSel.innerHTML += `<option value="${date}">${label}</option>`;
  });

  sel.value = selectedDate;
  // Default compare date to yesterday
  compareDate = availableDates[1] || availableDates[0];
  compSel.value = compareDate;
}

function handleDateChange(val) {
  selectedDate = val;
  updateMapStyle();
  updateStatsForView();
  updateDateOverlay();
}
window.handleDateChange = handleDateChange;

function handleCompareDateChange(val) {
  compareDate = val;
  updateMapStyle();
  updateStatsForView();
  updateDateOverlay();
}
window.handleCompareDateChange = handleCompareDateChange;

function toggleCompareMode() {
  isCompareMode = !isCompareMode;
  const btn = document.getElementById("btnCompareToggle");
  const sel = document.getElementById("compareDateSelect");

  sel.style.display = isCompareMode ? "inline-block" : "none";
  btn.classList.toggle("active", isCompareMode);

  updateMapStyle();
  updateStatsForView();
  updateDateOverlay();
}
window.toggleCompareMode = toggleCompareMode;

// --- Chart & Download Logic ---

function openTrendChart(oid, districtName) {
  currentChartOid = oid;
  let d = districtWinds[oid] || { history: {} };

  // Set default date range (Last 30 days)
  const today = new Date();
  const pastDate = new Date();
  pastDate.setDate(today.getDate() - 30);

  const startInput = document.getElementById("chartStartDate");
  const endInput = document.getElementById("chartEndDate");

  if (startInput) startInput.value = pastDate.toISOString().split("T")[0];
  if (endInput) endInput.value = today.toISOString().split("T")[0];

  // Initial Render
  updateTrendChartFilter();

  document.getElementById("chartModal").style.display = "flex";
}
window.openTrendChart = openTrendChart;

function updateTrendChartFilter() {
  if (!currentChartOid) return;

  const startVal = document.getElementById("chartStartDate").value;
  const endVal = document.getElementById("chartEndDate").value;

  if (!startVal || !endVal) return;

  const startDate = new Date(startVal);
  const endDate = new Date(endVal);
  const d = districtWinds[currentChartOid] || { history: {} };
  let districtName = "District";

  geojsonLayer.eachLayer((l) => {
    if (String(l.feature.properties.OBJECTID) === String(currentChartOid))
      districtName = l.feature.properties.D_NAME;
  });

  // Generate dates within range
  const dates = [];
  for (
    let dt = new Date(startDate);
    dt <= endDate;
    dt.setDate(dt.getDate() + 1)
  ) {
    dates.push(dt.toISOString().split("T")[0]);
  }

  const maxData = dates.map((date) => d.history[date]?.max ?? null);
  const minData = dates.map((date) => d.history[date]?.min ?? null);
  const avgData = dates.map((date) => d.history[date]?.avg ?? null);

  const ctx = document.getElementById("trendChart").getContext("2d");

  if (trendChart) trendChart.destroy();

  trendChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        {
          label: `Max Wind (${districtName})`,
          data: maxData,
          borderColor: "#e74c3c",
          backgroundColor: "#e74c3c",
          tension: 0.3,
        },
        {
          label: `Min Wind (${districtName})`,
          data: minData,
          borderColor: "#3498db",
          backgroundColor: "#3498db",
          tension: 0.3,
        },
        {
          label: `Avg Wind (${districtName})`,
          data: avgData,
          borderColor: "#2ecc71",
          backgroundColor: "#2ecc71",
          borderDash: [5, 5],
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          bottom: 20,
        },
      },
      plugins: {
        title: {
          display: true,
          text: [
            `District: ${districtName}`,
            `Parameter: Wind Speed | Period: ${startVal} to ${endVal}`,
          ],
          font: { size: 14 },
        },
        tooltip: { mode: "index", intersect: false },
      },
      interaction: { mode: "nearest", axis: "x", intersect: false },
      scales: {
        x: {
          ticks: { maxRotation: 45, minRotation: 45 },
        },
        y: {
          beginAtZero: true,
          grace: "5%",
        },
      },
    },
  });
}
window.updateTrendChartFilter = updateTrendChartFilter;

function updateChartComparison(compareOid) {
  if (!trendChart || !currentChartOid) return;

  const startVal = document.getElementById("chartStartDate").value;
  const endVal = document.getElementById("chartEndDate").value;
  const startDate = new Date(startVal);
  const endDate = new Date(endVal);

  const d1 = districtWinds[currentChartOid] || { history: {} };
  let d1Name = "District 1";
  geojsonLayer.eachLayer((l) => {
    if (String(l.feature.properties.OBJECTID) === String(currentChartOid))
      d1Name = l.feature.properties.D_NAME;
  });

  const dates = [];
  for (
    let dt = new Date(startDate);
    dt <= endDate;
    dt.setDate(dt.getDate() + 1)
  ) {
    dates.push(dt.toISOString().split("T")[0]);
  }
  const maxData1 = dates.map((date) => d1.history[date]?.max ?? null);
  const minData1 = dates.map((date) => d1.history[date]?.min ?? null);
  const avgData1 = dates.map((date) => d1.history[date]?.avg ?? null);

  const datasets = [
    {
      label: `Max Wind (${d1Name})`,
      data: maxData1,
      borderColor: "#e74c3c",
      backgroundColor: "#e74c3c",
      tension: 0.3,
      fill: false,
    },
    {
      label: `Min Wind (${d1Name})`,
      data: minData1,
      borderColor: "#3498db",
      backgroundColor: "#3498db",
      tension: 0.3,
      fill: false,
    },
    {
      label: `Avg Wind (${d1Name})`,
      data: avgData1,
      borderColor: "#2ecc71",
      backgroundColor: "#2ecc71",
      borderDash: [2, 2],
      tension: 0.3,
      fill: false,
    },
  ];

  if (compareOid) {
    const d2 = districtWinds[compareOid] || { history: {} };
    let d2Name = "District 2";
    geojsonLayer.eachLayer((l) => {
      if (String(l.feature.properties.OBJECTID) === String(compareOid))
        d2Name = l.feature.properties.D_NAME;
    });

    const maxData2 = dates.map((date) => d2.history[date]?.max ?? null);
    const minData2 = dates.map((date) => d2.history[date]?.min ?? null);
    const avgData2 = dates.map((date) => d2.history[date]?.avg ?? null);

    datasets.push(
      {
        label: `Max Wind (${d2Name})`,
        data: maxData2,
        borderColor: "#c0392b",
        backgroundColor: "#c0392b",
        borderDash: [5, 5],
        tension: 0.3,
        fill: false,
      },
      {
        label: `Min Wind (${d2Name})`,
        data: minData2,
        borderColor: "#2980b9",
        backgroundColor: "#2980b9",
        borderDash: [5, 5],
        tension: 0.3,
        fill: false,
      },
      {
        label: `Avg Wind (${d2Name})`,
        data: avgData2,
        borderColor: "#27ae60",
        backgroundColor: "#27ae60",
        borderDash: [5, 5],
        tension: 0.3,
        fill: false,
      },
    );

    if (trendChart.options.plugins.title) {
      trendChart.options.plugins.title.text = `Wind Speed Comparison: ${d1Name} vs ${d2Name}`;
    }
  } else {
    if (trendChart.options.plugins.title) {
      trendChart.options.plugins.title.text = [
        `District: ${d1Name}`,
        `Parameter: Wind Speed | Period: ${startVal} to ${endVal}`,
      ];
    }
  }

  trendChart.data.datasets = datasets;
  trendChart.update();
}
window.updateChartComparison = updateChartComparison;

function closeChartModal() {
  document.getElementById("chartModal").style.display = "none";
  if (map) map.invalidateSize();
}
window.closeChartModal = closeChartModal;

function downloadMapImage() {
  const node = document.querySelector(".display-content-area");
  domtoimage
    .toPng(node)
    .then(function (dataUrl) {
      const link = document.createElement("a");
      link.download = `Bihar_Wind_Map_${new Date().toISOString().split("T")[0]}.png`;
      link.href = dataUrl;
      link.click();
    })
    .catch(function (error) {
      console.error("oops, something went wrong!", error);
      alert("Error downloading image.");
    });
}
window.downloadMapImage = downloadMapImage;

function downloadMapPDF() {
  const node = document.querySelector(".display-content-area");
  domtoimage
    .toPng(node)
    .then(function (dataUrl) {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF("l", "px", [node.offsetWidth, node.offsetHeight]);
      doc.addImage(dataUrl, "PNG", 0, 0, node.offsetWidth, node.offsetHeight);
      doc.save(`Bihar_Wind_Map_${new Date().toISOString().split("T")[0]}.pdf`);
    })
    .catch(function (error) {
      console.error("oops, something went wrong!", error);
      alert("Error downloading PDF.");
    });
}
window.downloadMapPDF = downloadMapPDF;

function exportChartDataToCSV() {
  if (!trendChart) return;

  const labels = trendChart.data.labels;
  const datasets = trendChart.data.datasets;

  if (!labels || !datasets) return;

  // CSV Header
  let csvContent = "Date";
  datasets.forEach((ds) => {
    csvContent += `,${ds.label}`;
  });
  csvContent += "\n";

  // CSV Rows
  labels.forEach((label, index) => {
    let row = `${label}`;
    datasets.forEach((ds) => {
      let val = ds.data[index];
      if (val === null || val === undefined) val = "";
      row += `,${val}`;
    });
    csvContent += row + "\n";
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `Wind_Trend_${new Date().toISOString().split("T")[0]}.csv`,
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
window.exportChartDataToCSV = exportChartDataToCSV;

function downloadChartImage() {
  const node = document.getElementById("chartWrapper");
  domtoimage
    .toPng(node, { bgcolor: "#ffffff" })
    .then(function (dataUrl) {
      const link = document.createElement("a");
      link.download = `Wind_Chart_${new Date().toISOString().split("T")[0]}.png`;
      link.href = dataUrl;
      link.click();
    })
    .catch(function (error) {
      console.error("Chart image download failed:", error);
      alert("Error downloading chart image.");
    });
}
window.downloadChartImage = downloadChartImage;

function downloadChartPDF() {
  const node = document.getElementById("chartWrapper");
  domtoimage
    .toPng(node, { bgcolor: "#ffffff" })
    .then(function (dataUrl) {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF("l", "px", [node.offsetWidth, node.offsetHeight]);
      doc.addImage(dataUrl, "PNG", 0, 0, node.offsetWidth, node.offsetHeight);
      doc.save(`Wind_Chart_${new Date().toISOString().split("T")[0]}.pdf`);
    })
    .catch(function (error) {
      console.error("Chart PDF download failed:", error);
      alert("Error downloading chart PDF.");
    });
}
window.downloadChartPDF = downloadChartPDF;
