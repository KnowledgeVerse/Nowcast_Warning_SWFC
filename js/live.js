// Configuration Data
const phenColors = {
  dry: "#ffffff",
  heavyrain: "#007bff",
  heatwave: "#fd7e14",
  warmnight: "#e83e8c",
  coldwave: "#00bcd4",
  coldday: "#20c997",
  densefog: "#6c757d",
  thunderstorm: "#ffc107",
  gustywind: "#17a2b8",
  squall: "#607d8b",
  frost: "#b2ebf2",
  seastate: "#0d47a1",
  cyclone: "#b71c1c",
  duststorm: "#d7ccc8",
  snow: "#f5f5f5",
  hailstorm: "#6f42c1",
};

const phenDefs = [
  {
    id: "dry",
    hindi: "शुष्क मौसम",
    english: "Dry Weather",
    icon: "fa-sun",
    image: "assets/weather-icons/dry.png",
  },
  {
    id: "heavyrain",
    hindi: "भारी वर्षा",
    english: "Heavy Rainfall",
    icon: "fa-cloud-showers-heavy",
    image: "assets/weather-icons/heavyrain.png",
  },
  {
    id: "heatwave",
    hindi: "लू (उष्ण लहर)",
    english: "Heat Wave",
    icon: "fa-fire",
    image: "assets/weather-icons/heatwave.png",
  },
  {
    id: "warmnight",
    hindi: "गर्म रात्रि",
    english: "Warm Night",
    icon: "fa-temperature-high",
    image: "assets/weather-icons/warmnight.png",
  },
  {
    id: "coldwave",
    hindi: "शीत लहर",
    english: "Cold Wave",
    icon: "fa-temperature-low",
    image: "assets/weather-icons/coldwave.png",
  },
  {
    id: "coldday",
    hindi: "शीत दिवस",
    english: "Cold Day",
    icon: "fa-snowflake",
    image: "assets/weather-icons/coldday.png",
  },
  {
    id: "densefog",
    hindi: "घना कोहरा",
    english: "Dense Fog",
    icon: "fa-smog",
    image: "assets/weather-icons/densefog.png",
  },
  {
    id: "thunderstorm",
    hindi: "मेघगर्जन/वज्रपात",
    english: "Thunderstorm/Lightning",
    icon: "fa-cloud-bolt",
    image: "assets/weather-icons/thunderstorm.png",
  },
  {
    id: "gustywind",
    hindi: "तेज़ हवा",
    english: "Gusty Wind",
    icon: "fa-wind",
    image: "assets/weather-icons/gustywind.png",
  },
  {
    id: "squall",
    hindi: "तेज़ हवा के झोंके",
    english: "Squall",
    icon: "fa-wind",
    image: "assets/weather-icons/squall.png",
  },
  {
    id: "frost",
    hindi: "पाला",
    english: "Frost",
    icon: "fa-icicles",
    image: "assets/weather-icons/frost.png",
  },
  {
    id: "seastate",
    hindi: "समुद्र की स्थिति",
    english: "Sea State",
    icon: "fa-water",
    image: "assets/weather-icons/sea.png",
  },
  {
    id: "cyclone",
    hindi: "चक्रवात",
    english: "Cyclone",
    icon: "fa-hurricane",
    image: "assets/weather-icons/cyclone.png",
  },
  {
    id: "duststorm",
    hindi: "धूल भरी आंधी",
    english: "Dust Storm",
    icon: "fa-wind",
    image: "assets/weather-icons/dust.png",
  },
  {
    id: "snow",
    hindi: "बर्फबारी",
    english: "Snow",
    icon: "fa-snowflake",
    image: "assets/weather-icons/snow.png",
  },
  {
    id: "hailstorm",
    hindi: "ओलावृष्टि",
    english: "Hailstorm",
    icon: "fa-cloud-meatball",
    image: "assets/weather-icons/hailstorm.png",
  },
];

const weatherSounds = {
  thunderstorm: "assets/audio/thunderstorm.mp3",
  gustywind: "assets/audio/gustywind.mp3",
  heatwave: "assets/audio/heatwave.mp3",
  hailstorm: "assets/audio/hailstorm.mp3",
  heavyrain: "assets/audio/heavyrain.mp3",
  densefog: "assets/audio/densefog.mp3",
  coldday: "assets/audio/coldday.mp3",
  warmnight: "assets/audio/warmnight.mp3",
};

// Dropdown Options for Legend Mapping (Copied from main.js)
const forecastDropdownOptions = [
  { value: 0, text: "DRY – शुष्क", color: null },
  {
    value: 1,
    text: "ISOL (ONE OR TWO PLACES) – एक दो स्थानों पर",
    color: "rgb(51, 204, 51)",
  },
  {
    value: 2,
    text: "SCATTERED (FEW PLACES) – कुछ स्थानों पर",
    color: "rgb(0, 153, 0)",
  },
  {
    value: 3,
    text: "FAIRLY WIDESPREAD (MANY PLACES) – अनेक स्थानों पर",
    color: "rgb(51, 204, 255)",
  },
  {
    value: 4,
    text: "WIDESPREAD (MOST PLACES) – अधिकांश स्थानों पर",
    color: "rgb(0, 102, 255)",
  },
];

const warningDropdownOptions = [
  { value: 0, text: "NO WARNING – कोई चेतावनी नहीं", color: "rgb(0, 153, 0)" },
  { value: 1, text: "YELLOW – पीला", color: "rgb(255, 255, 0)" },
  { value: 2, text: "ORANGE – नारंगी", color: "rgb(255, 192, 0)" },
  { value: 3, text: "RED – लाल", color: "rgb(255, 0, 0)" },
];

const forecastLegendItems = [
  { color: "transparent", text: "DRY<br>शुष्क", border: "1px solid #999" },
  {
    color: "rgb(51, 204, 51)",
    text: "ISOL (ONE OR TWO PLACES)<br>एक दो स्थानों पर",
  },
  { color: "rgb(0, 153, 0)", text: "SCATTERED (FEW PLACES)<br>कुछ स्थानों पर" },
  {
    color: "rgb(51, 204, 255)",
    text: "FAIRLY WIDESPREAD (MANY PLACES)<br>अनेक स्थानों पर",
  },
  {
    color: "rgb(0, 102, 255)",
    text: "WIDESPREAD (MOST PLACES)<br>अधिकांश स्थानों पर",
  },
];

const warningLegendItems = [
  {
    color: "rgb(255, 0, 0)",
    text: "RED (लाल) – WARNING<br>(Take Action / तुरंत कार्रवाई करें)",
  },
  {
    color: "rgb(255, 192, 0)",
    text: "ORANGE (नारंगी) – ALERT<br>(Be Prepared / सतर्क रहें)",
  },
  {
    color: "rgb(255, 255, 0)",
    text: "YELLOW (पीला) – WATCH<br>(Be Updated / अपडेट रहें)",
  },
  {
    color: "rgb(0, 153, 0)",
    text: "GREEN (हरा) – NO WARNING<br>(No Action / कोई चेतावनी नहीं)",
  },
];

let currentSlide = 0;
let slideInterval;
let weatherData = { forecast: [], warning: [] };
let map,
  slides = [], // Array to hold generated slides
  geojsonLayer,
  phenomenaMarkersLayer,
  streetLayer,
  satelliteLayer,
  hybridLayer,
  radarLayer;
let districtPhenomenaMap = {};
let showFoothill = true;
let isPlaying = true;
let slideSpeed = 3000;
let isLegendVisible = true;
let isSoundEnabled = false;
let currentAudio = new Audio();
let currentLang = localStorage.getItem("lang") || "hi";
let isLayoutEditMode = false;
let zoomControl = null;
let mapEffectConfig = {
  enabled: false,
  mode: "manual",
  manualEffect: "thunderstorm",
};
let weatherEffectState = {
  animationFrame: null,
  ctx: null,
  drops: [],
  width: 0,
  height: 0,
};

const uiTranslations = {
  hi: {
    title: "बिहार मौसम पूर्वानुमान - लाइव पूर्वावलोकन",
    date: "दिनांक",
    day: "दिन",
  },
  en: {
    title: "Bihar Weather Forecast - Live Preview",
    date: "Date",
    day: "Day",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initLiveDisplay();

  // Listen for updates from the main page
  window.addEventListener("storage", (e) => {
    if (e.key === "bihar_weather_data") {
      loadData();
    }
    if (e.key === "bihar_map_layout") {
      loadLayoutPositions();
    }
    if (e.key === "bihar_map_view") {
      const v = JSON.parse(e.newValue);
      if (map) map.setView(v.center, v.zoom);
    }
    if (e.key === "bihar_map_bg") {
      if (map) document.getElementById("map").style.background = e.newValue;
    }
    if (e.key === "bihar_map_effect_config") {
      loadMapEffectConfig();
    }
  });

  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
  }
});

function initLiveDisplay() {
  let root = document.getElementById("liveRoot");

  // Inject CSS
  const style = document.createElement("style");
  style.innerHTML = `
    html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; font-family: "Noto Sans Devanagari", sans-serif; background: #f4f7f6; }
    #liveRoot { width: 100%; height: 100%; display: flex; flex-direction: column; }
    .live-header { position: fixed; top: 0; left: 0; width: 100%; height: auto; min-height: 110px; background: rgba(255,255,255,0.65); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); z-index: 2000; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border-bottom: 1px solid rgba(255,255,255,0.5); padding: 10px 0; }
    .header-content { text-align: center; text-shadow: 0 1px 1px rgba(255,255,255,0.8); margin-bottom: 8px; }
    .header-content h1 { margin: 0; color: #2c3e50; font-size: 1.8em; font-weight: 800; }
    #map { width: 100%; height: 100%; border-radius: 15px; z-index: 1; }
    .display-content-area { margin-top: 120px; flex: 1; width: 99%; max-width: 100%; margin-left: auto; margin-right: auto; height: calc(100% - 130px); position: relative; border-radius: 15px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.1); background: white; border: 4px solid #2c3e50; }
    .live-controls-row { display: flex; gap: 8px; flex-wrap: nowrap; overflow-x: auto; justify-content: center; align-items: center; width: 100%; padding: 0 20px; white-space: nowrap; scrollbar-width: thin; }
    .live-controls-bottom { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 15px; align-items: center; background: rgba(255,255,255,0.95); padding: 10px 25px; border-radius: 30px; box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
    .control-btn { border: none; background: none; cursor: pointer; font-size: 1.4em; color: #2c3e50; transition: 0.2s; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; }
    .control-btn:hover { background: rgba(0,0,0,0.05); color: #667eea; transform: scale(1.1); }
    .layer-btn { padding: 6px 12px; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; background: white; font-size: 0.9em; font-weight: 600; color: #555; }
    .layer-btn.active { background: #667eea; color: white; border-color: #667eea; }
    .speed-control { display: flex; align-items: center; gap: 8px; font-size: 0.9em; font-weight: bold; color: #2c3e50; border-left: 1px solid #ccc; padding-left: 15px; margin-left: 5px; }
    
    /* Animated Layout Edit Button */
    .btn-animated {
        background: linear-gradient(45deg, #ff357a, #fff172, #ff357a);
        background-size: 200% 200%;
        animation: gradientAnim 3s ease infinite;
        color: white;
        border: none;
        font-weight: bold;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 5px;
    }
    @keyframes gradientAnim {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    
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
  `;
  document.head.appendChild(style);

  root.innerHTML = `
    <header class="live-header">
        <img src="assets/logo.png" style="height: 70px; position: absolute; top: 20px; left: 20px;">
        <div class="header-content">
            <h1 id="liveTitle" class="tricolor-glow">बिहार मौसम पूर्वानुमान प्रणाली</h1>
        </div>
        
        <div class="live-controls-row">
            <button class="layer-btn btn-blink-anim" onclick="window.location.href='index.html'" title="Home"><i class="fas fa-home"></i></button>
            <button class="layer-btn active" onclick="window.location.href='live.html'" title="Live Preview"><i class="fas fa-tower-broadcast"></i></button>
            <button class="layer-btn" onclick="window.location.href='temp.html'" title="Temperature Map"><i class="fas fa-temperature-high"></i></button>
            <button class="layer-btn" onclick="window.location.href='wind.html'" title="Wind Map"><i class="fas fa-wind"></i></button>
            <button class="layer-btn" onclick="window.location.href='rain.html'" title="Rain Map"><i class="fas fa-cloud-showers-heavy"></i></button>
            <button class="layer-btn" onclick="window.location.href='humidity.html'" title="Humidity Map"><i class="fas fa-tint"></i></button>
            <button class="layer-btn" onclick="window.location.href='display.html'" title="Display Mode"><i class="fas fa-tv"></i></button>
            <div style="width:1px; height:20px; background:#ccc; margin:0 5px;"></div>
            <button class="layer-btn btn-blink-anim" onclick="window.location.href='bulletin.html'" title="Weather Bulletin"><i class="fas fa-clipboard-list"></i></button>
            <button class="layer-btn" onclick="window.location.href='forecast.html'" title="7-Day Forecast"><i class="fas fa-calendar-day"></i></button>
            <button class="layer-btn" onclick="window.location.href='warning.html'" title="7-Day Warning"><i class="fas fa-exclamation-triangle"></i></button>
            <button class="layer-btn" onclick="window.location.href='Temperature_Forecast.html'" title="Min/Max Temp"><i class="fas fa-temperature-high"></i></button>
            <button class="layer-btn" onclick="window.location.href='bulk_import.html'" title="Import Data"><i class="fas fa-file-import"></i></button>
            <button class="layer-btn" onclick="window.location.href='max_min_rh.html'" title="Observed Data"><i class="fas fa-table"></i></button>
            <div style="width:1px; height:20px; background:#ccc; margin:0 5px;"></div>
            <button class="layer-btn active" onclick="setLayer('street')" id="btnStreet">Street</button>
            <button class="layer-btn" onclick="setLayer('satellite')" id="btnSat">Satellite</button>
            <button class="layer-btn" onclick="setLayer('hybrid')" id="btnHybrid">Hybrid</button>
            <button class="layer-btn" onclick="setLayer('clean')" id="btnClean">Clean</button>
            <button class="layer-btn" onclick="toggleRadar(this)" id="btnRadar" style="margin-left:5px; border-color:#e74c3c; color:#e74c3c;"><i class="fas fa-satellite-dish"></i> Radar</button>
            <button class="layer-btn" onclick="toggleDarkMode()" id="btnDarkMode" title="Dark Mode"><i class="fas fa-moon"></i></button>
            <label class="layer-btn" style="display:flex; align-items:center; gap:5px; cursor:pointer;">
                <input type="checkbox" id="toggleLiveZoom" onchange="toggleMapZoom(this.checked)">
                Zoom
            </label>
            <button class="layer-btn" onclick="toggleLanguage()" id="btnLang" title="Language">${currentLang.toUpperCase()}</button>
            <button id="btnToggleDrag" class="layer-btn btn-animated" style="display:none;" onclick="toggleLayoutEditMode()"><i class="fas fa-arrows-alt"></i> Enable Layout Edit</button>
        </div>
    </header>
        <div class="display-content-area">
            <div id="map"></div>
            <canvas id="weatherCanvas"></canvas>
            <div id="weatherLightning"></div>
            <div id="weatherFog"></div>
            <!-- Header inside Map Grid -->
            <div id="slideHeader" style="position: absolute; top: 10px; left: 50%; transform: translateX(-50%); z-index: 1000; text-align: center; font-size: 1.2em; font-weight: bold; color: #2c3e50; padding: 5px 20px; background: rgba(255,255,255,0.9); border: 2px solid #2c3e50; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); min-width: 300px; pointer-events: auto;">Loading...</div>
            
            <div class="live-controls-bottom">
                <button class="control-btn" onclick="prevSlide()" title="Previous"><i class="fas fa-step-backward"></i></button>
                <button class="control-btn" onclick="togglePlayPause()" id="btnPlayPause" title="Pause"><i class="fas fa-pause"></i></button>
                <button class="control-btn" onclick="nextSlide()" title="Next"><i class="fas fa-step-forward"></i></button>
                <button class="control-btn" onclick="fitMapBounds()" title="Fit Map"><i class="fas fa-compress-arrows-alt"></i></button>
                <button class="control-btn" onclick="toggleFullScreen()" id="btnFullScreen" title="Full Screen"><i class="fas fa-expand"></i></button>
                <button class="control-btn" onclick="toggleSound()" id="btnSound" title="Toggle Sound"><i class="fas fa-volume-mute"></i></button>
                
                <div class="speed-control">
                    <i class="fas fa-tachometer-alt"></i>
                    <input type="range" min="1" max="10" value="3" step="0.5" oninput="updateSpeed(this.value)" style="width: 100px; cursor: pointer;">
                    <span id="speedDisplay">3s</span>
                </div>
            </div>
        </div>
  `;

  // Add hover listeners to pause slideshow
  const mapDiv = document.getElementById("map");
  if (mapDiv) {
    mapDiv.addEventListener("mouseenter", () => {
      if (slideInterval) clearInterval(slideInterval);
    });
    mapDiv.addEventListener("mouseleave", () => {
      startSlideShow();
    });
  }

  initMap();
  updateLanguageUI();

  if (localStorage.getItem("darkMode") === "true") {
    const btn = document.getElementById("btnDarkMode");
    if (btn) btn.innerHTML = '<i class="fas fa-sun"></i>';
  }
  if (localStorage.getItem("admin_logged_in") === "true") {
    const btn = document.getElementById("btnToggleDrag");
    if (btn) btn.style.display = "flex";
  }
  initWeatherCanvas();
  loadMapEffectConfig();
}

function initMap() {
  // Check for saved view
  const savedView = localStorage.getItem("bihar_map_view");
  let center = [25.6, 85.6];
  let zoom = 7;
  if (savedView) {
    const v = JSON.parse(savedView);
    center = v.center;
    zoom = v.zoom;
  }

  map = L.map("map", {
    zoomControl: false, // Custom zoom control via toggle
    scrollWheelZoom: false,
    doubleClickZoom: false,
    dragging: false,
    boxZoom: false,
    touchZoom: false,
  }).setView(center, zoom);

  // Apply saved map background
  const savedMapBg = localStorage.getItem("bihar_map_bg");
  if (savedMapBg) {
    document.getElementById("map").style.background = savedMapBg;
  }

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

  radarLayer = L.tileLayer.wms(
    "https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi",
    {
      layers: "nexrad-n0r-900913",
      format: "image/png",
      transparent: true,
      attribution: "Weather data © 2012 IEM Nexrad",
    },
  );

  streetLayer.addTo(map);
  phenomenaMarkersLayer = L.layerGroup().addTo(map);

  // Add Static Overlays (Logos & Arrow)
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
      <div id="overlayLegend" class="info legend" style="position:absolute; bottom:20px; right:10px; z-index:1001; pointer-events:auto; display:none;"></div>
  `;

  loadLayoutPositions();
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
        style: (feature) => {
          const oid = parseInt(feature.properties.OBJECTID);
          // Use global subRegionDistricts from districts.js
          const isFoothill =
            showFoothill && subRegionDistricts.fh.includes(oid);
          return {
            fillColor: getDistrictRegionColor(oid),
            weight: 2,
            opacity: 1,
            color: "#333",
            dashArray: isFoothill ? "5, 5" : "",
            fillOpacity: isFoothill ? 0.5 : 0.2,
          };
        },
        onEachFeature: (feature, layer) => {
          if (feature.properties && feature.properties.D_NAME) {
            layer.bindTooltip(feature.properties.D_NAME, {
              permanent: true,
              direction: "center",
              className: "map-label",
            });
          }
        },
      }).addTo(map);
      map.fitBounds(geojsonLayer.getBounds());

      // Handle label visibility
      map.on("zoomend", () => {
        const pane = document.querySelector(".leaflet-tooltip-pane");
        if (pane)
          map.getZoom() < 8
            ? pane.classList.add("labels-hidden")
            : pane.classList.remove("labels-hidden");
      });

      // Load data after map is ready
      loadData();
    })
    .catch((err) => {
      console.error("Map loading failed:", err);
      alert("Map loading failed: " + err.message);
    });
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

function loadData() {
  const raw = localStorage.getItem("bihar_weather_data");
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed.forecast && parsed.warning) {
        weatherData = parsed;
      } else if (Array.isArray(parsed)) {
        // Fallback for old data format
        weatherData = { forecast: parsed, warning: Array(7).fill({}) };
      }
    } catch (e) {
      weatherData = { forecast: [], warning: [] };
    }
  }

  // Ensure arrays are filled
  if (!weatherData.forecast) weatherData.forecast = Array(7).fill({});
  if (!weatherData.warning) weatherData.warning = Array(7).fill({});

  while (weatherData.forecast.length < 7) weatherData.forecast.push({});
  while (weatherData.warning.length < 7) weatherData.warning.push({});

  generateSlides();
  startSlideShow();
}

function generateSlides() {
  slides = [];

  // Helper to compare two day data objects
  const areDaysEqual = (d1, d2) => {
    // Simple JSON stringify comparison (works if key order is consistent, which it usually is here)
    // Better: compare keys length and values
    return JSON.stringify(d1) === JSON.stringify(d2);
  };

  // Process Forecast (Days 1-7)
  let i = 0;
  while (i < 7) {
    let start = i + 1;
    let end = i + 1;
    // Check for continuous identical days
    while (
      end < 7 &&
      areDaysEqual(weatherData.forecast[end - 1], weatherData.forecast[end])
    ) {
      end++;
    }

    slides.push({
      type: "forecast",
      startDay: start,
      endDay: end,
      data: weatherData.forecast[i],
    });

    i = end;
  }

  // Process Warning (Days 1-7)
  i = 0;
  while (i < 7) {
    let start = i + 1;
    let end = i + 1;
    while (
      end < 7 &&
      areDaysEqual(weatherData.warning[end - 1], weatherData.warning[end])
    ) {
      end++;
    }

    slides.push({
      type: "warning",
      startDay: start,
      endDay: end,
      data: weatherData.warning[i],
    });

    i = end;
  }
}

function startSlideShow() {
  if (slideInterval) clearInterval(slideInterval);
  if (slides.length === 0) return; // Prevent errors if no slides
  currentSlide = 0; // Reset to start
  render();
  slideInterval = setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    render();
  }, slideSpeed);
}

function render() {
  if (slides.length === 0) return;
  const slide = slides[currentSlide];
  const dayData = slide.data;

  // Update Header
  updateSlideHeader(slide);

  districtPhenomenaMap = dayData || {};
  let dayPhenomena = new Set();

  if (dayData) {
    for (const [id, data] of Object.entries(dayData)) {
      if (data.phenomena) {
        data.phenomena.forEach((p) => dayPhenomena.add(p));
      }
    }
  }
  updateMapStyle(slide.type);
  playWeatherSound(dayPhenomena);
  updateLegend(dayPhenomena, slide.type);
  applyMapEffect();
}

function updateSlideHeader(slide) {
  let date = new Date();
  const storedDate = localStorage.getItem("bihar_forecast_date");
  if (storedDate) {
    date = new Date(storedDate);
  }

  // Calculate Start Date
  const startDate = new Date(date);
  startDate.setDate(date.getDate() + (slide.startDay - 1));

  // Calculate End Date (End of the range)
  const endDate = new Date(date);
  endDate.setDate(date.getDate() + slide.endDay); // +1 day from the end index effectively

  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  const startStr = startDate
    .toLocaleDateString("en-IN", options)
    .replace(/\//g, ".");
  const endStr = endDate
    .toLocaleDateString("en-IN", options)
    .replace(/\//g, ".");

  const header = document.getElementById("slideHeader");

  let dayText = "";
  if (slide.startDay === slide.endDay) {
    dayText = `दिन - ${slide.startDay}`;
  } else {
    dayText = `दिन ${slide.startDay} से दिन - ${slide.endDay}`;
  }

  const modeText =
    slide.type === "forecast" ? "वर्षा का पूर्वानुमान" : "मौसम की चेतावनी";
  const modeColor = slide.type === "forecast" ? "#0056b3" : "#c0392b";

  if (header) {
    header.innerHTML = `
        <div>
            <span style="color:${modeColor}; font-weight:900;">${modeText} ${dayText} के लिए</span><br>
            <span style="font-size:0.8em; font-weight:normal;">(${startStr} के 0830 IST से ${endStr} के 0830 IST तक मान्य)</span>
        </div>
    `;
  }
  // Update the date overlay on the map as well
  const mapDateEl = document.getElementById("liveMapDateOverlay");
  if (mapDateEl) {
    let date = new Date();
    if (storedDate) {
      date = new Date(storedDate);
    }
    date.setDate(date.getDate() + (slide.startDay - 1)); // Use start day for the date display
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    const dateStr = date
      .toLocaleDateString("en-IN", options)
      .replace(/\//g, "-");
    mapDateEl.innerText = `Date: ${dateStr}`;
  }
}

function updateMapStyle(slideType) {
  if (!geojsonLayer) return;
  phenomenaMarkersLayer.clearLayers();

  geojsonLayer.eachLayer((layer) => {
    const oid = String(layer.feature.properties.OBJECTID);
    let phenomColor = null;
    let assignedPhenomenaList = [];

    const distData = districtPhenomenaMap[oid];
    if (distData && distData.phenomena && distData.phenomena.size > 0) {
      for (const pDef of phenDefs) {
        if (distData.phenomena.has(pDef.id)) {
          if (!phenomColor) phenomColor = phenColors[pDef.id];
          const isHidden =
            localStorage.getItem(`bihar_hide_icon_${pDef.id}`) === "true";
          if (isHidden) continue;
          assignedPhenomenaList.push(pDef);
        }
      }
    }

    if (assignedPhenomenaList.length > 0) {
      let iconsHtml = "";
      const iconSize = assignedPhenomenaList.length > 1 ? "18px" : "32px";

      assignedPhenomenaList.forEach((p) => {
        iconsHtml += `<div style="width: ${iconSize}; height: ${iconSize}; margin: 1px; display:flex; align-items:center; justify-content:center;">
                          <img src="${p.image}" class="phenom-anim-${p.id}" style="width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 0 2px #fff);">
                        </div>`;
      });

      const icon = L.divIcon({
        html: iconsHtml,
        className: "map-phenom-marker",
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });
      const center = layer.getBounds().getCenter();
      L.marker(center, { icon: icon }).addTo(phenomenaMarkersLayer);
    }

    const isFoothill =
      showFoothill && subRegionDistricts.fh.includes(parseInt(oid));

    let style = {
      color: "#333",
      weight: 2,
      dashArray: isFoothill ? "5, 5" : "",
    };

    if (
      distData &&
      (distData.color || (distData.phenomena && distData.phenomena.size > 0))
    ) {
      style.fillColor = distData.color || phenomColor || "#667eea";
      style.fillOpacity = 1.0;
    } else {
      // Default solid background
      if (slideType === "warning") {
        style.fillColor = "rgb(0, 153, 0)";
        style.fillOpacity = 1.0;
      } else {
        style.fillColor = "#ffffff";
        style.fillOpacity = 1.0;
      }
    }
    layer.setStyle(style);
  });
}

function updateLegend(dayPhenomena, type) {
  const legendDiv = document.getElementById("overlayLegend");
  if (!legendDiv) return;

  if (!isLegendVisible) {
    legendDiv.style.display = "none";
    return;
  }
  legendDiv.style.display = "block";
  legendDiv.innerHTML = "";

  // 1. Phenomena (First)
  if (dayPhenomena.size > 0) {
    legendDiv.innerHTML += `<div style="margin: 5px 0 2px 0; font-weight:bold; border-bottom:1px solid #ccc;">PHENOMENA</div>`;
    // Sort by phenDefs order
    phenDefs.forEach((p) => {
      if (dayPhenomena.has(p.id)) {
        legendDiv.innerHTML += `
          <div style="display:flex; align-items:center; margin-bottom:6px;">
            <div style="width:35px; height:35px; text-align:center; margin-right:8px; display:flex; justify-content:center; align-items:center;">
                <img src="${p.image}" style="max-width: 100%; max-height: 100%;">
            </div>
            <div style="line-height:1.2;">
                <span style="font-weight:bold;">${p.english}</span><br>
                <span style="font-size:0.9em; color:#555;">${p.hindi}</span>
            </div>
          </div>`;
      }
    });
  }

  // 2. Warning (Full List)
  if (type === "warning") {
    legendDiv.innerHTML += `<div style="margin: 10px 0 5px 0; font-weight:bold; border-bottom:1px solid #ccc;">Warning</div>`;
    warningLegendItems.forEach((item) => {
      legendDiv.innerHTML += `
          <div style="display:flex; align-items:center; margin-bottom:6px; line-height:1.2; text-align:left;">
            <span style="width:20px; height:20px; background:${item.color}; border:1px solid #999; margin-right:8px; flex-shrink:0;"></span>
            <span style="font-size:0.9em;">${item.text}</span>
          </div>`;
    });
  }

  // 3. Forecast (Full List)
  if (type === "forecast") {
    legendDiv.innerHTML += `<div style="margin: 10px 0 5px 0; font-weight:bold; border-bottom:1px solid #ccc;">Forecast: Distribution</div>`;
    forecastLegendItems.forEach((item) => {
      const borderStyle = item.border ? `border:${item.border};` : "";
      legendDiv.innerHTML += `
          <div style="display:flex; align-items:center; margin-bottom:6px; line-height:1.2;">
            <span style="width:20px; height:20px; background:${item.color}; ${borderStyle} margin-right:8px; flex-shrink:0;"></span>
            <span style="font-size:0.9em;">${item.text}</span>
          </div>`;
    });
  }

  if (legendDiv.innerHTML === "") {
    legendDiv.innerHTML = "<em>No items selected</em>";
  }
}

function getDistrictRegionColor(id) {
  id = parseInt(id);
  // Use global subRegionDistricts from districts.js
  if (subRegionDistricts.nw.includes(id)) return "#00897b";
  if (subRegionDistricts.nc.includes(id)) return "#1976d2";
  if (subRegionDistricts.ne.includes(id)) return "#673ab7";
  if (subRegionDistricts.sw.includes(id)) return "#f44336";
  if (subRegionDistricts.sc.includes(id)) return "#fbc02d";
  if (subRegionDistricts.se.includes(id)) return "#795548";
  return "#3388ff";
}

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
    // No layer added, just clean background
    document.getElementById("btnClean").classList.add("active");
  }
}
window.setLayer = setLayer;

function prevSlide() {
  if (slides.length === 0) return;
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  render();
  resetInterval();
}
window.prevSlide = prevSlide;

function nextSlide() {
  if (slides.length === 0) return;
  currentSlide = (currentSlide + 1) % slides.length;
  render();
  resetInterval();
}
window.nextSlide = nextSlide;

function togglePlayPause() {
  isPlaying = !isPlaying;
  const btn = document.getElementById("btnPlayPause");
  if (isPlaying) {
    startSlideShow();
    btn.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    clearInterval(slideInterval);
    btn.innerHTML = '<i class="fas fa-play"></i>';
  }
}
window.togglePlayPause = togglePlayPause;

function updateSpeed(val) {
  slideSpeed = val * 1000;
  document.getElementById("speedDisplay").innerText = val + "s";
  if (isPlaying) startSlideShow();
}
window.updateSpeed = updateSpeed;

function resetInterval() {
  if (isPlaying) startSlideShow();
}

function toggleRadar(btn) {
  if (map.hasLayer(radarLayer)) {
    map.removeLayer(radarLayer);
    btn.classList.remove("active");
  } else {
    map.addLayer(radarLayer);
    btn.classList.add("active");
  }
}
window.toggleRadar = toggleRadar;

function toggleLegend() {
  isLegendVisible = !isLegendVisible;
  const btn = document.getElementById("btnLegend");
  if (isLegendVisible) {
    btn.classList.add("active");
  } else {
    btn.classList.remove("active");
  }
  render(); // Re-render to update legend visibility
}
window.toggleLegend = toggleLegend;

function toggleSound() {
  isSoundEnabled = !isSoundEnabled;
  const btn = document.getElementById("btnSound");
  if (isSoundEnabled) {
    btn.innerHTML = '<i class="fas fa-volume-up"></i>';
    // Trigger sound for current slide immediately
    render();
  } else {
    btn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    currentAudio.pause();
  }
}
window.toggleSound = toggleSound;

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

function playWeatherSound(dayPhenomena) {
  if (!isSoundEnabled) {
    if (!currentAudio.paused) currentAudio.pause();
    return;
  }

  // Priority order for sounds
  const priorities = [
    "thunderstorm",
    "hailstorm",
    "heavyrain",
    "gustywind",
    "heatwave",
    "densefog",
    "coldday",
    "warmnight",
  ];
  let soundToPlay = null;

  for (const p of priorities) {
    if (dayPhenomena.has(p) && weatherSounds[p]) {
      soundToPlay = weatherSounds[p];
      break;
    }
  }

  if (soundToPlay) {
    if (!currentAudio.src.includes(soundToPlay) || currentAudio.paused) {
      currentAudio.src = soundToPlay;
      currentAudio.play().catch((e) => console.warn("Audio play failed:", e));
    }
  } else {
    currentAudio.pause();
  }
}

function fitMapBounds() {
  if (geojsonLayer) {
    map.fitBounds(geojsonLayer.getBounds());
  }
}
window.fitMapBounds = fitMapBounds;

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
      console.error(
        `Error attempting to enable full-screen mode: ${err.message} (${err.name})`,
      );
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}
window.toggleFullScreen = toggleFullScreen;

document.addEventListener("fullscreenchange", () => {
  const btn = document.getElementById("btnFullScreen");
  if (btn) {
    const isFull = !!document.fullscreenElement;
    btn.innerHTML = isFull
      ? '<i class="fas fa-compress"></i>'
      : '<i class="fas fa-expand"></i>';
    btn.title = isFull ? "Exit Full Screen" : "Full Screen";
  }
});

function loadLayoutPositions() {
  const raw = localStorage.getItem("bihar_map_layout");
  if (!raw) return;
  try {
    const layout = JSON.parse(raw);
    for (const [id, style] of Object.entries(layout)) {
      const el = id.startsWith(".")
        ? document.querySelector(id)
        : document.getElementById(id);
      if (el) {
        if (style.top) el.style.top = style.top;
        if (style.left) el.style.left = style.left;
        if (style.right) el.style.right = style.right;
        if (style.bottom) el.style.bottom = style.bottom;
        if (style.position) el.style.position = style.position;
        if (style.zIndex) el.style.zIndex = style.zIndex;
      }
    }
  } catch (e) {
    console.error("Error loading layout", e);
  }
}

function toggleLayoutEditMode() {
  isLayoutEditMode = !isLayoutEditMode;
  const btn = document.getElementById("btnToggleDrag");

  if (isLayoutEditMode) {
    btn.innerText = "Save Layout";
    btn.style.background = "#27ae60"; // Green for save state
    alert(
      "Layout Edit Mode Enabled.\n- Drag elements to reposition.\n- Use Mouse Wheel to resize elements.",
    );

    // Fix slideHeader positioning for editing (convert centered to absolute pixels)
    // This prevents the element from jumping when scaling/dragging removes the transform centering
    const header = document.getElementById("slideHeader");
    if (
      header &&
      (header.style.transform.includes("translateX") ||
        header.style.left === "50%")
    ) {
      const rect = header.getBoundingClientRect();
      const parent = header.offsetParent || document.body;
      const parentRect = parent.getBoundingClientRect();

      header.style.left = rect.left - parentRect.left + "px";
      header.style.top = rect.top - parentRect.top + "px";
      header.style.transform = "scale(1)";
      header.setAttribute("data-scale", "1");
      header.style.right = "auto";
    }

    enableDrag("overlayLeft");
    enableDrag("overlayRight");
    enableDrag("mapLegend");
    enableDrag("slideHeader");
  } else {
    btn.innerHTML = '<i class="fas fa-arrows-alt"></i> Enable Layout Edit';
    btn.style.background = ""; // Restore CSS gradient
    saveLayoutPositions();
    alert("Layout Saved.");
  }
}
window.toggleLayoutEditMode = toggleLayoutEditMode;

function enableDrag(selector) {
  const el = selector.startsWith(".")
    ? document.querySelector(selector)
    : document.getElementById(selector);
  if (!el) return;

  el.style.cursor = isLayoutEditMode ? "move" : "default";

  el.onmousedown = function (e) {
    if (!isLayoutEditMode) return;
    e.preventDefault();

    let startX = e.clientX;
    let startY = e.clientY;

    if (el.style.right && el.style.right !== "auto") {
      el.style.left = el.offsetLeft + "px";
      el.style.right = "auto";
    }
    if (el.style.bottom && el.style.bottom !== "auto") {
      el.style.top = el.offsetTop + "px";
      el.style.bottom = "auto";
    }

    document.onmousemove = function (e) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      el.style.top = el.offsetTop + dy + "px";
      el.style.left = el.offsetLeft + dx + "px";
      startX = e.clientX;
      startY = e.clientY;
    };

    document.onmouseup = function () {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };

  // Enable resizing via mouse wheel
  el.onwheel = function (e) {
    if (!isLayoutEditMode) return;
    e.preventDefault();
    let scale = parseFloat(el.getAttribute("data-scale")) || 1;
    if (e.deltaY < 0) scale += 0.1;
    else scale -= 0.1;
    scale = Math.min(Math.max(0.5, scale), 3);
    el.style.transform = `scale(${scale})`;
    el.setAttribute("data-scale", scale.toFixed(2));
  };
}

function saveLayoutPositions() {
  const layout = {};
  const ids = [
    "overlayLeft",
    "overlayTopRight",
    "overlayLegend",
    "slideHeader",
  ];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      layout[id] = {
        top: el.style.top,
        left: el.style.left,
        right: el.style.right,
        bottom: el.style.bottom,
        position: el.style.position,
        zIndex: el.style.zIndex,
        scale: el.getAttribute("data-scale"),
      };
    }
  });
  localStorage.setItem("bihar_map_layout", JSON.stringify(layout));
}

function loadMapEffectConfig() {
  const saved = localStorage.getItem("bihar_map_effect_config");
  if (saved) {
    mapEffectConfig = JSON.parse(saved);
    // If we are not in a render loop yet, apply might be called by render later
    // But if manual mode, we should apply now
    if (mapEffectConfig.mode === "manual") {
      applyMapEffect(new Set());
    }
  }
}

function initWeatherCanvas() {
  const canvas = document.getElementById("weatherCanvas");
  if (!canvas) return;
  weatherEffectState.ctx = canvas.getContext("2d");

  const resize = () => {
    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
      weatherEffectState.width = canvas.width;
      weatherEffectState.height = canvas.height;
    }
  };
  window.addEventListener("resize", resize);
  resize();

  // Init drops
  weatherEffectState.drops = [];
  for (let i = 0; i < 200; i++) {
    weatherEffectState.drops.push({
      x: Math.random() * weatherEffectState.width,
      y: Math.random() * weatherEffectState.height,
      l: Math.random() * 20 + 10,
      s: Math.random() * 4 + 2,
    });
  }
}

function animateRain() {
  const ctx = weatherEffectState.ctx;
  const w = weatherEffectState.width;
  const h = weatherEffectState.height;

  if (!ctx) return;

  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(255,255,255,0.6)";
  ctx.lineWidth = 1.5;
  ctx.lineCap = "round";

  weatherEffectState.drops.forEach((d) => {
    ctx.beginPath();
    ctx.moveTo(d.x, d.y);
    ctx.lineTo(d.x, d.y + d.l);
    ctx.stroke();

    d.y += d.s;
    if (d.y > h) {
      d.y = -20;
      d.x = Math.random() * w;
    }
  });

  weatherEffectState.animationFrame = requestAnimationFrame(animateRain);
}

function animateWind() {
  const ctx = weatherEffectState.ctx;
  const w = weatherEffectState.width;
  const h = weatherEffectState.height;

  if (!ctx) return;

  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";

  weatherEffectState.drops.forEach((d) => {
    ctx.beginPath();
    ctx.moveTo(d.x, d.y);
    ctx.lineTo(d.x + d.l * 5, d.y + d.l * 0.5);
    ctx.stroke();

    d.x += d.s * 5;
    d.y += d.s * 0.5;

    if (d.x > w) {
      d.x = -200;
      d.y = Math.random() * h;
    }
  });

  weatherEffectState.animationFrame = requestAnimationFrame(animateWind);
}

function applyMapEffect() {
  const canvas = document.getElementById("weatherCanvas");
  const lightning = document.getElementById("weatherLightning");
  const fog = document.getElementById("weatherFog");

  // Reset
  if (weatherEffectState.animationFrame)
    cancelAnimationFrame(weatherEffectState.animationFrame);
  if (canvas) {
    canvas.classList.remove("active");
    if (weatherEffectState.ctx)
      weatherEffectState.ctx.clearRect(
        0,
        0,
        weatherEffectState.width,
        weatherEffectState.height,
      );
  }
  if (lightning) lightning.classList.remove("active");
  if (fog) fog.classList.remove("active");

  if (!mapEffectConfig.enabled) return;

  const effect = mapEffectConfig.manualEffect;

  if (effect === "thunderstorm" || effect === "heavyrain") {
    if (canvas) canvas.classList.add("active");
    animateRain();
  }
  if (effect === "gustywind") {
    if (canvas) canvas.classList.add("active");
    animateWind();
  }
  if (effect === "thunderstorm") {
    if (lightning) lightning.classList.add("active");
  }
  if (effect === "densefog") {
    if (fog) fog.classList.add("active");
  }
}
