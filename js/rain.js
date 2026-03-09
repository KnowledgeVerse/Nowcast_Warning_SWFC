let map,
  geojsonLayer,
  phenomenaMarkersLayer,
  streetLayer,
  satelliteLayer,
  hybridLayer;
let districtRains = {};
let isLayoutEditMode = false;
let zoomControl = null;
let currentLang = localStorage.getItem("lang") || "hi";
let rainMode = "current"; // 'current', 'total', 'max_int', 'avg'
let availableDates = [];
let selectedDate = null; // YYYY-MM-DD
let compareDate = null; // YYYY-MM-DD
let isCompareMode = false;
let trendChart = null;
let currentChartOid = null;

const uiTranslations = {
  hi: {
    title: "बिहार लाइव वर्षा (Live Rainfall)",
    refresh: "रिफ्रेश करें",
  },
  en: {
    title: "Bihar Live Rainfall",
    refresh: "Refresh Data",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initRainDisplay();

  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
  }
});

function initRainDisplay() {
  let root = document.getElementById("liveRoot");

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
    .tricolor-glow { background: linear-gradient(90deg, #FF9933, #FFFFFF, #138808, #FF9933); background-size: 200% auto; animation: tricolorMove 3s linear infinite; color: #000080; padding: 5px 20px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); display: inline-block; }
    @keyframes tricolorMove { to { background-position: 200% center; } }
    .temp-block { background: transparent; border: none; box-shadow: none; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 0; min-width: auto; }
    .t-name { font-size: 11px; font-weight: 700; color: #2c3e50; text-shadow: 2px 2px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff; margin-bottom: 1px; font-family: 'Verdana', sans-serif; text-transform: uppercase; letter-spacing: 0.5px; }
    .t-val { font-size: 16px; font-weight: 900; margin: 0; text-shadow: 2px 2px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff; }
    .t-diff { font-size: 12px; font-weight: 800; margin-top: 0; text-shadow: 2px 2px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff; }
    .stats-container { position: absolute; top: 90px; right: 10px; z-index: 1001; display: flex; flex-direction: column; gap: 8px; pointer-events: auto; }
    .stats-box { background: rgba(255,255,255,0.95); border-radius: 6px; padding: 8px 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.2); width: 210px; font-size: 12px; border-left: 5px solid #333; transition: transform 0.2s; }
    .stats-box:hover { transform: translateX(-5px); }
    .stats-header { font-weight: 800; border-bottom: 1px solid #ddd; margin-bottom: 5px; padding-bottom: 3px; text-transform: uppercase; font-size: 11px; color: #444; display: flex; justify-content: space-between; align-items: center; }
    .stats-row { display: flex; justify-content: space-between; margin-bottom: 3px; align-items: center; }
    .stats-label { color: #555; font-weight: 600; }
    .stats-val { font-weight: 800; font-size: 13px; color: #000; }
    .theme-current { border-left-color: #2196f3; }
    
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
            <h1 id="liveTitle" class="tricolor-glow">बिहार लाइव वर्षा (Live Rainfall)</h1>
        </div>
        
        <div class="live-controls-row">
            <button class="layer-btn active" id="btnRainCurrent" onclick="setRainMode('current')" title="Current Rainfall"><i class="fas fa-clock"></i> Current</button>
            <button class="layer-btn" id="btnRainTotal" onclick="setRainMode('total')" title="Daily Total Rainfall"><i class="fas fa-glass-water"></i> Total</button>
            <button class="layer-btn" id="btnRainMax" onclick="setRainMode('max_int')" title="Max Hourly Intensity"><i class="fas fa-cloud-showers-heavy"></i> Max Int.</button>
            <button class="layer-btn" id="btnRainAvg" onclick="setRainMode('avg')" title="Average Hourly Rainfall"><i class="fas fa-percent"></i> Avg</button>
            <div style="width:1px; height:20px; background:#ccc; margin:0 5px;"></div>
            
            <select id="dateSelect" onchange="handleDateChange(this.value)" class="layer-btn" style="font-weight:bold; cursor:pointer;"></select>
            <button id="btnCompareToggle" onclick="toggleCompareMode()" class="layer-btn" title="Compare Dates"><i class="fas fa-exchange-alt"></i></button>
            <select id="compareDateSelect" onchange="handleCompareDateChange(this.value)" class="layer-btn" style="display:none; font-weight:bold; cursor:pointer; border-color:#e74c3c; color:#c0392b;"></select>
            
            <div style="width:1px; height:20px; background:#ccc; margin:0 5px;"></div>
            <button class="layer-btn" onclick="window.location.href='index.html'" title="Home"><i class="fas fa-home"></i></button>
            <button class="layer-btn" onclick="window.location.href='live.html'" title="Live Preview"><i class="fas fa-tower-broadcast"></i></button>
            <button class="layer-btn" onclick="window.location.href='temp.html'" title="Temperature Map"><i class="fas fa-temperature-high"></i></button>
            <button class="layer-btn" onclick="window.location.href='wind.html'" title="Wind Map"><i class="fas fa-wind"></i></button>
            <button class="layer-btn active" onclick="window.location.href='rain.html'" title="Rain Map"><i class="fas fa-cloud-showers-heavy"></i></button>
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
        <div id="rainLegend" class="info legend" style="position:absolute; bottom:20px; right:10px; z-index:1001; background:rgba(255,255,255,0.9); padding:10px; border-radius:8px; box-shadow:0 0 15px rgba(0,0,0,0.2); pointer-events:auto;"></div>
        
        <!-- Chart Modal -->
        <div id="chartModal" class="chart-modal">
            <div class="chart-content">
                <span class="close-chart" onclick="closeChartModal()">&times;</span>
                <div style="margin-bottom:15px; text-align:center; display:flex; justify-content:center; align-items:center; gap:10px; flex-wrap:wrap;">
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
  updateRainLegend();
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

  const basePath = "data/Bihar_Districts_Shapefile/Bihar";
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
      }).addTo(map);
      map.fitBounds(geojsonLayer.getBounds());
      fetchRainfall();
      setInterval(fetchRainfall, 900000);
    })
    .catch((err) => console.error("Map loading failed:", err));
}

function initDateSelectors() {
  const today = new Date();
  availableDates = [];
  for (let i = 0; i < 31; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    availableDates.push(d.toISOString().split("T")[0]);
  }
  selectedDate = availableDates[0];
}

function fetchRainfall() {
  if (!geojsonLayer) return;
  const header = document.getElementById("slideHeader");
  if (header) header.innerText = "Updating Rainfall Data...";

  const requests = [];
  geojsonLayer.eachLayer((layer) => {
    const center = layer.getBounds().getCenter();
    const oid = String(layer.feature.properties.OBJECTID);
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${center.lat}&longitude=${center.lng}&current=precipitation&daily=precipitation_sum&hourly=precipitation&past_days=30&timezone=auto`;

    requests.push(
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (data.daily && data.hourly) {
            const history = {};
            data.daily.time.forEach((dateStr, index) => {
              const total = data.daily.precipitation_sum[index];
              const startHour = index * 24;
              const endHour = startHour + 24;
              const hourlySlice = data.hourly.precipitation.slice(
                startHour,
                endHour,
              );

              let maxInt = 0;
              let sum = 0;
              let count = 0;
              hourlySlice.forEach((val) => {
                if (val !== null) {
                  if (val > maxInt) maxInt = val;
                  sum += val;
                  count++;
                }
              });
              const avg = count > 0 ? parseFloat((sum / count).toFixed(2)) : 0;
              history[dateStr] = { total, max_int: maxInt, avg };
            });

            districtRains[oid] = {
              current: data.current ? data.current.precipitation : 0,
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
    if (header) header.innerText = "Live Rainfall (Updated)";
    updateDateOverlay();
  });
}

function setRainMode(mode) {
  rainMode = mode;
  document.querySelectorAll(".live-controls-row .layer-btn").forEach((b) => {
    if (b.id.startsWith("btnRain")) b.classList.remove("active");
  });

  if (mode === "current")
    document.getElementById("btnRainCurrent").classList.add("active");
  if (mode === "total")
    document.getElementById("btnRainTotal").classList.add("active");
  if (mode === "max_int")
    document.getElementById("btnRainMax").classList.add("active");
  if (mode === "avg")
    document.getElementById("btnRainAvg").classList.add("active");

  updateMapStyle();
}
window.setRainMode = setRainMode;

function updateMapStyle() {
  if (!geojsonLayer) return;
  phenomenaMarkersLayer.clearLayers();

  if (isCompareMode && rainMode === "current") {
    setRainMode("total");
    return;
  }
  if (
    !isCompareMode &&
    selectedDate !== availableDates[0] &&
    rainMode === "current"
  ) {
    setRainMode("total");
    return;
  }

  let minVal = Infinity,
    maxVal = -Infinity;
  geojsonLayer.eachLayer((layer) => {
    const val = getValueForDistrict(String(layer.feature.properties.OBJECTID));
    if (val !== null && val !== undefined) {
      if (val < minVal) minVal = val;
      if (val > maxVal) maxVal = val;
    }
  });

  if (minVal === Infinity) {
    minVal = 0;
    maxVal = isCompareMode ? 5 : 20;
  }
  if (minVal === maxVal) {
    minVal -= 0.1;
    maxVal += 0.1;
  }

  updateRainLegend(minVal, maxVal);

  geojsonLayer.eachLayer((layer) => {
    const oid = String(layer.feature.properties.OBJECTID);
    const val = getValueForDistrict(oid);

    if (val !== null && val !== undefined) {
      let displayVal = val.toFixed(1);
      let diffText = isCompareMode
        ? "Difference"
        : rainMode.toUpperCase().replace("_", " ");
      let diffColor = isCompareMode
        ? val > 0
          ? "#1976d2"
          : "#d32f2f"
        : "#000";

      const color = getColorForValue(
        val,
        minVal,
        maxVal,
        isCompareMode ? "compare" : rainMode,
      );

      layer.setStyle({
        fillColor: color,
        fillOpacity: 0.7,
        color: "#333",
        weight: 2,
      });

      const iconHtml = `
        <div class="temp-block">
            <div class="t-name">${layer.feature.properties.D_NAME}</div>
            <div class="t-val" style="color:#000">${displayVal} <span style="font-size:10px">mm</span></div>
            <div class="t-diff" style="color:${diffColor}">${diffText}</div>
        </div>`;

      const marker = L.marker(layer.getBounds().getCenter(), {
        icon: L.divIcon({
          html: iconHtml,
          className: "",
          iconSize: [100, 60],
          iconAnchor: [25, 40],
        }),
      }).addTo(phenomenaMarkersLayer);

      let tooltipContent = `<div style="text-align:left; font-size:12px; min-width:100px;">
        <div style="font-weight:bold; border-bottom:1px solid #ccc; margin-bottom:3px; padding-bottom:2px;">${layer.feature.properties.D_NAME}</div>`;

      if (isCompareMode) {
        tooltipContent += `<div>Diff: <b>${displayVal}</b> mm</div>`;
        tooltipContent += `<div style="font-size:10px; color:#555;">${selectedDate} vs ${compareDate}</div>`;
      } else {
        const d = districtRains[oid];
        const h = d && d.history ? d.history[selectedDate] : null;
        if (h) {
          if (selectedDate === availableDates[0]) {
            tooltipContent += `<div>Current: <b>${d.current}</b> mm</div>`;
          }
          tooltipContent += `<div>Total: <b>${h.total}</b> mm</div>`;
          tooltipContent += `<div>Max Int: <b>${h.max_int}</b> mm/h</div>`;
          tooltipContent += `<div>Avg: <b>${h.avg}</b> mm/h</div>`;
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
  const d = districtRains[oid];
  if (!d) return null;
  if (isCompareMode) {
    const h1 = d.history[selectedDate];
    const h2 = d.history[compareDate];
    if (!h1 || !h2) return null;
    return h1[rainMode] - h2[rainMode];
  } else {
    if (rainMode === "current") {
      if (selectedDate === availableDates[0]) return d.current;
      return d.history[selectedDate]?.total;
    }
    return d.history[selectedDate]?.[rainMode];
  }
}

function getColorForValue(val, min, max, mode) {
  const palettes = {
    current: ["#e3f2fd", "#90caf9", "#2196f3", "#0d47a1"],
    total: ["#e3f2fd", "#64b5f6", "#1976d2", "#311b92"],
    max_int: ["#e0f7fa", "#4dd0e1", "#0097a7", "#006064"],
    avg: ["#e1f5fe", "#4fc3f7", "#0288d1", "#01579b"],
    compare: ["#d32f2f", "#ffffff", "#1976d2"],
  };
  const colors = palettes[mode] || palettes.current;
  let t = (val - min) / (max - min);
  t = Math.max(0, Math.min(1, t));
  const segments = colors.length - 1;
  const idx = Math.floor(t * segments);
  if (idx >= segments) return colors[segments];
  return interpolateColor(colors[idx], colors[idx + 1], t * segments - idx);
}

function interpolateColor(c1, c2, factor) {
  const r1 = parseInt(c1.substring(1, 3), 16),
    g1 = parseInt(c1.substring(3, 5), 16),
    b1 = parseInt(c1.substring(5, 7), 16);
  const r2 = parseInt(c2.substring(1, 3), 16),
    g2 = parseInt(c2.substring(3, 5), 16),
    b2 = parseInt(c2.substring(5, 7), 16);
  const r = Math.round(r1 + factor * (r2 - r1)),
    g = Math.round(g1 + factor * (g2 - g1)),
    b = Math.round(b1 + factor * (b2 - b1));
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function updateRainLegend(min, max) {
  const div = document.getElementById("rainLegend");
  if (!div) return;
  const titles = {
    current: "Current Rain (mm)",
    total: "Total Rain (mm)",
    max_int: "Max Intensity (mm/h)",
    avg: "Avg Rain (mm/h)",
  };
  const palettes = {
    current: "linear-gradient(to right, #e3f2fd, #0d47a1)",
    total: "linear-gradient(to right, #e3f2fd, #311b92)",
    max_int: "linear-gradient(to right, #e0f7fa, #006064)",
    avg: "linear-gradient(to right, #e1f5fe, #01579b)",
  };
  div.innerHTML = `
        <div style="font-weight:bold; margin-bottom:5px; font-size:12px; border-bottom:1px solid #ccc; padding-bottom:3px;">${titles[rainMode] || "Rainfall"}</div>
        <div style="height:15px; width:100%; background:${palettes[rainMode] || palettes.current}; border-radius:3px; margin-bottom:5px;"></div>
        <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:bold; color:#333;">
            <span>${min !== undefined ? min.toFixed(1) : "Low"}</span>
            <span>${max !== undefined ? max.toFixed(1) : "High"}</span>
        </div>`;
}

function updateStatsForView() {
  const container = document.getElementById("statsOverlay");
  if (!container) return;
  const vals = [];
  if (geojsonLayer) {
    geojsonLayer.eachLayer((layer) => {
      const val = getValueForDistrict(
        String(layer.feature.properties.OBJECTID),
      );
      if (val !== null) vals.push(val);
    });
  }
  if (vals.length === 0) return;

  let min = Infinity,
    max = -Infinity,
    sum = 0;
  vals.forEach((v) => {
    if (v < min) min = v;
    if (v > max) max = v;
    sum += v;
  });
  const stats = {
    max: max.toFixed(1),
    min: min.toFixed(1),
    mean: (sum / vals.length).toFixed(1),
  };

  const title = isCompareMode
    ? "Difference"
    : `${rainMode.toUpperCase().replace("_", " ")} Rain`;
  container.innerHTML = `
        <div class="stats-box theme-current">
            <div class="stats-header"><span>${title}</span><i class="fas fa-chart-bar"></i></div>
            <div class="stats-row"><span class="stats-label">Highest:</span><span class="stats-val">${stats.max} mm</span></div>
            <div class="stats-row"><span class="stats-label">Lowest:</span><span class="stats-val">${stats.min} mm</span></div>
            <div class="stats-row"><span class="stats-label">Average:</span><span class="stats-val">${stats.mean} mm</span></div>
        </div>`;
}

function refreshData() {
  fetchRainfall();
}
window.refreshData = refreshData;

function updateDateOverlay() {
  const el = document.getElementById("liveMapDateOverlay");
  if (el)
    el.innerText = isCompareMode
      ? `${selectedDate} vs ${compareDate}`
      : selectedDate === availableDates[0]
        ? `Today (${selectedDate})`
        : selectedDate;
}

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
  document.getElementById("compareDateSelect").style.display = isCompareMode
    ? "inline-block"
    : "none";
  document
    .getElementById("btnCompareToggle")
    .classList.toggle("active", isCompareMode);
  updateMapStyle();
  updateStatsForView();
  updateDateOverlay();
}
window.toggleCompareMode = toggleCompareMode;

// --- Chart & Download Logic ---

function openTrendChart(oid, districtName) {
  currentChartOid = oid;
  let d = districtRains[oid] || { history: {} };

  // Generate last 30 days dates ascending
  const dates = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split("T")[0]);
  }
  const totalData = dates.map((date) => d.history[date]?.total ?? null);
  const maxIntData = dates.map((date) => d.history[date]?.max_int ?? null);

  // Populate Compare Dropdown
  const sel = document.getElementById("compareDistrictSelect");
  if (sel) {
    sel.innerHTML = '<option value="">None</option>';
    const districts = [];
    if (geojsonLayer) {
      geojsonLayer.eachLayer((layer) => {
        const props = layer.feature.properties;
        districts.push({ oid: String(props.OBJECTID), name: props.D_NAME });
      });
    }
    districts.sort((a, b) => a.name.localeCompare(b.name));
    districts.forEach((dist) => {
      if (dist.oid !== String(oid)) {
        const opt = document.createElement("option");
        opt.value = dist.oid;
        opt.innerText = dist.name;
        sel.appendChild(opt);
      }
    });
    sel.value = "";
  }

  const ctx = document.getElementById("trendChart").getContext("2d");

  if (trendChart) trendChart.destroy();

  trendChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: dates,
      datasets: [
        {
          label: `Total Rainfall (${districtName})`,
          data: totalData,
          backgroundColor: "#1976d2",
          borderColor: "#1976d2",
          borderWidth: 1,
        },
        {
          label: `Max Intensity (${districtName})`,
          data: maxIntData,
          type: "line",
          borderColor: "#d32f2f",
          backgroundColor: "#d32f2f",
          tension: 0.3,
          yAxisID: "y1",
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
            `Parameter: Rainfall | Period: Last 30 Days`,
          ],
          font: { size: 14 },
        },
        tooltip: { mode: "index", intersect: false },
      },
      scales: {
        x: {
          ticks: { maxRotation: 45, minRotation: 45 },
        },
        y: {
          beginAtZero: true,
          title: { display: true, text: "Total Rain (mm)" },
          grace: "5%",
        },
        y1: {
          beginAtZero: true,
          position: "right",
          title: { display: true, text: "Intensity (mm/h)" },
          grid: { drawOnChartArea: false },
          grace: "5%",
        },
      },
    },
  });

  document.getElementById("chartModal").style.display = "flex";
}
window.openTrendChart = openTrendChart;

function updateChartComparison(compareOid) {
  if (!trendChart || !currentChartOid) return;

  const d1 = districtRains[currentChartOid] || { history: {} };
  let d1Name = "District 1";
  geojsonLayer.eachLayer((l) => {
    if (String(l.feature.properties.OBJECTID) === String(currentChartOid))
      d1Name = l.feature.properties.D_NAME;
  });

  const dates = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split("T")[0]);
  }
  const totalData1 = dates.map((date) => d1.history[date]?.total ?? null);
  const maxIntData1 = dates.map((date) => d1.history[date]?.max_int ?? null);

  const datasets = [
    {
      label: `Total Rainfall (${d1Name})`,
      data: totalData1,
      backgroundColor: "#1976d2",
      borderColor: "#1976d2",
      borderWidth: 1,
    },
    {
      label: `Max Intensity (${d1Name})`,
      data: maxIntData1,
      type: "line",
      borderColor: "#d32f2f",
      backgroundColor: "#d32f2f",
      tension: 0.3,
      yAxisID: "y1",
    },
  ];

  if (compareOid) {
    const d2 = districtRains[compareOid] || { history: {} };
    let d2Name = "District 2";
    geojsonLayer.eachLayer((l) => {
      if (String(l.feature.properties.OBJECTID) === String(compareOid))
        d2Name = l.feature.properties.D_NAME;
    });

    const totalData2 = dates.map((date) => d2.history[date]?.total ?? null);
    const maxIntData2 = dates.map((date) => d2.history[date]?.max_int ?? null);

    datasets.push(
      {
        label: `Total Rainfall (${d2Name})`,
        data: totalData2,
        backgroundColor: "#4fc3f7",
        borderColor: "#4fc3f7",
        borderWidth: 1,
      },
      {
        label: `Max Intensity (${d2Name})`,
        data: maxIntData2,
        type: "line",
        borderColor: "#c62828",
        backgroundColor: "#c62828",
        borderDash: [5, 5],
        tension: 0.3,
        yAxisID: "y1",
      },
    );

    if (trendChart.options.plugins.title) {
      trendChart.options.plugins.title.text = `Rainfall Comparison: ${d1Name} vs ${d2Name}`;
    }
  } else {
    if (trendChart.options.plugins.title) {
      trendChart.options.plugins.title.text = [
        `District: ${d1Name}`,
        `Parameter: Rainfall | Period: Last 30 Days`,
      ];
    }
  }

  trendChart.data.datasets = datasets;
  trendChart.update();
}
window.updateChartComparison = updateChartComparison;

function closeChartModal() {
  document.getElementById("chartModal").style.display = "none";
}
window.closeChartModal = closeChartModal;

function downloadMapImage() {
  const node = document.querySelector(".display-content-area");
  domtoimage
    .toPng(node)
    .then(function (dataUrl) {
      const link = document.createElement("a");
      link.download = `Bihar_Rain_Map_${new Date().toISOString().split("T")[0]}.png`;
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
      doc.save(`Bihar_Rain_Map_${new Date().toISOString().split("T")[0]}.pdf`);
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
    `Rainfall_Trend_${new Date().toISOString().split("T")[0]}.csv`,
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
      link.download = `Rain_Chart_${new Date().toISOString().split("T")[0]}.png`;
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
      doc.save(`Rain_Chart_${new Date().toISOString().split("T")[0]}.pdf`);
    })
    .catch(function (error) {
      console.error("Chart PDF download failed:", error);
      alert("Error downloading chart PDF.");
    });
}
window.downloadChartPDF = downloadChartPDF;

// Common functions
function toggleMapZoom(enable) {
  if (enable) {
    map.dragging.enable();
    map.touchZoom.enable();
    map.doubleClickZoom.enable();
    map.scrollWheelZoom.enable();
    map.boxZoom.enable();
    if (!zoomControl)
      zoomControl = L.control.zoom({ position: "bottomright" }).addTo(map);
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
  document.getElementById("map").style.background = color;
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
  if (document.getElementById("liveTitle"))
    document.getElementById("liveTitle").innerText = t.title;
  if (document.getElementById("btnLang"))
    document.getElementById("btnLang").innerText = currentLang.toUpperCase();
}
function fitMapBounds() {
  if (geojsonLayer) map.fitBounds(geojsonLayer.getBounds());
}
window.fitMapBounds = fitMapBounds;
function toggleFullScreen() {
  if (!document.fullscreenElement)
    document.documentElement.requestFullscreen().catch(console.error);
  else if (document.exitFullscreen) document.exitFullscreen();
}
window.toggleFullScreen = toggleFullScreen;
