// Configuration Data (Copied from main.js for standalone operation)
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
    icon: "fa-sun",
    image: "assets/weather-icons/dry.png",
  },
  {
    id: "heavyrain",
    hindi: "भारी वर्षा",
    icon: "fa-cloud-showers-heavy",
    image: "assets/weather-icons/heavyrain.png",
  },
  {
    id: "heatwave",
    hindi: "लू (उष्ण लहर)",
    icon: "fa-fire",
    image: "assets/weather-icons/heatwave.png",
  },
  {
    id: "warmnight",
    hindi: "गर्म रात्रि",
    icon: "fa-temperature-high",
    image: "assets/weather-icons/warmnight.png",
  },
  {
    id: "coldwave",
    hindi: "शीत लहर",
    icon: "fa-temperature-low",
    image: "assets/weather-icons/coldwave.png",
  },
  {
    id: "coldday",
    hindi: "शीत दिवस",
    icon: "fa-snowflake",
    image: "assets/weather-icons/coldday.png",
  },
  {
    id: "densefog",
    hindi: "घना कोहरा",
    icon: "fa-smog",
    image: "assets/weather-icons/densefog.png",
  },
  {
    id: "thunderstorm",
    hindi: "मेघगर्जन/वज्रपात",
    icon: "fa-cloud-bolt",
    image: "assets/weather-icons/thunderstorm.png",
  },
  {
    id: "gustywind",
    hindi: "तेज़ हवा",
    icon: "fa-wind",
    image: "assets/weather-icons/gustywind.png",
  },
  {
    id: "squall",
    hindi: "तेज़ हवा के झोंके",
    icon: "fa-wind",
    image: "assets/weather-icons/squall.png",
  },
  {
    id: "frost",
    hindi: "पाला",
    icon: "fa-icicles",
    image: "assets/weather-icons/frost.png",
  },
  {
    id: "seastate",
    hindi: "समुद्र की स्थिति",
    icon: "fa-water",
    image: "assets/weather-icons/sea.png",
  },
  {
    id: "cyclone",
    hindi: "चक्रवात",
    icon: "fa-hurricane",
    image: "assets/weather-icons/cyclone.png",
  },
  {
    id: "duststorm",
    hindi: "धूल भरी आंधी",
    icon: "fa-wind",
    image: "assets/weather-icons/dust.png",
  },
  {
    id: "snow",
    hindi: "बर्फबारी",
    icon: "fa-snowflake",
    image: "assets/weather-icons/snow.png",
  },
  {
    id: "hailstorm",
    hindi: "ओलावृष्टि",
    icon: "fa-cloud-meatball",
    image: "assets/weather-icons/hailstorm.png",
  },
];

const weatherSounds = {
  thunderstorm: "assets/audio/thunderstorm.mp3",
  hailstorm: "assets/audio/hailstorm.mp3",
  heavyrain: "assets/audio/heavyrain.mp3",
  gustywind: "assets/audio/gustywind.mp3",
};

let currentSlide = 0;
let slideInterval;
let weatherData = [];
let map,
  geojsonLayer,
  phenomenaMarkersLayer,
  tileLayer,
  satelliteLayer,
  hybridLayer;
let districtPhenomenaMap = {};
let currentAudio = new Audio();
currentAudio.loop = true;
let isSoundEnabled = false;
let customImages = [];
let isImageMode = false;
let slideDuration = 5000;
let currentZoom = 1;
let isGridView = false;
let currentLang = localStorage.getItem("lang") || "hi";

const uiTranslations = {
  hi: {
    title: "बिहार मौसम पूर्वानुमान प्रणाली",
    date: "दिनांक",
    day: "दिन",
  },
  en: {
    title: "Bihar Weather Forecast System",
    date: "Date",
    day: "Day",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initDisplay();
  loadData();

  // Listen for updates from the main page
  window.addEventListener("storage", (e) => {
    if (e.key === "bihar_weather_data") {
      loadData();
    }
  });

  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
  }
});

function initDisplay() {
  let root = document.getElementById("displayRoot");
  if (!root) {
    root = document.createElement("div");
    root.id = "displayRoot";
    root.className = "display-root-bg";
    document.body.appendChild(root);
  }

  // Inject CSS to ensure full height and visibility
  const style = document.createElement("style");
  style.innerHTML = `
    html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #eef2f3; font-family: sans-serif; }
    #displayRoot { width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; }
    .glass-btn.active { background: #667eea; color: white; box-shadow: 0 0 10px rgba(102, 126, 234, 0.5); }
  `;
  document.head.appendChild(style);

  // Check login status for Admin controls
  const isAdmin = localStorage.getItem("admin_logged_in") === "true";
  const speedControlHtml = isAdmin
    ? `
        <div class="speed-control-compact">
            <i class="fas fa-tachometer-alt" title="Speed Graph"></i>
            <input type="range" id="slideSpeed" min="1" max="20" value="5" oninput="updateSpeed(this.value)" class="glass-slider-compact">
            <span id="speedVal" style="font-size:0.8em; font-weight:bold; min-width:25px;">5s</span>
        </div>
  `
    : "";

  root.innerHTML = `
    <div class="glass-main-panel">
        <div class="glass-header-glow">
            <h1 id="dispTitle">बिहार मौसम पूर्वानुमान प्रणाली</h1>
        </div>

        <div class="glass-toolbar">
             <button class="glass-btn small-btn btn-blink-anim" onclick="window.location.href='index.html'" title="Home"><i class="fas fa-home"></i></button>
             <button class="glass-btn small-btn" onclick="window.location.href='live.html'" title="Live Preview"><i class="fas fa-tower-broadcast"></i></button>
             <button class="glass-btn small-btn" onclick="window.location.href='temp.html'" title="Temperature Map"><i class="fas fa-temperature-high"></i></button>
             <button class="glass-btn small-btn" onclick="window.location.href='wind.html'" title="Wind Map"><i class="fas fa-wind"></i></button>
             <button class="glass-btn small-btn" onclick="window.location.href='rain.html'" title="Rain Map"><i class="fas fa-cloud-showers-heavy"></i></button>
             <button class="glass-btn small-btn" onclick="window.location.href='humidity.html'" title="Humidity Map"><i class="fas fa-tint"></i></button>
             <button class="glass-btn small-btn active" onclick="window.location.href='display.html'" title="Display Mode"><i class="fas fa-tv"></i></button>
             <div class="divider"></div>
             <button class="glass-btn small-btn btn-blink-anim" onclick="window.location.href='bulletin.html'" title="Weather Bulletin"><i class="fas fa-clipboard-list"></i></button>
             <button class="glass-btn small-btn" onclick="window.location.href='forecast.html'" title="7-Day Forecast"><i class="fas fa-calendar-day"></i></button>
             <button class="glass-btn small-btn" onclick="window.location.href='warning.html'" title="7-Day Warning"><i class="fas fa-exclamation-triangle"></i></button>
             <button class="glass-btn small-btn" onclick="window.location.href='Temperature_Forecast.html'" title="Min/Max Temp"><i class="fas fa-temperature-high"></i></button>
             <button class="glass-btn small-btn" onclick="window.location.href='bulk_import.html'" title="Import Data"><i class="fas fa-file-import"></i></button>
             <button class="glass-btn small-btn" onclick="window.location.href='max_min_rh.html'" title="Observed Data"><i class="fas fa-table"></i></button>
             <div class="divider"></div>

             <label class="glass-btn small-btn" title="Select Images">
                <i class="fas fa-folder-open"></i> Select
                <input type="file" id="imgFolderInput" multiple accept="image/*" style="display:none" onchange="handleImageSelect(this)">
             </label>

             <button class="glass-btn small-btn" onclick="loadFromGitHub()" title="Load from GitHub Repo"><i class="fab fa-github"></i> Online Load</button>
             
             <div class="divider"></div>
             
             <button class="glass-btn small-btn" onclick="toggleGridView()" title="Grid View">
                <i class="fas fa-th"></i> Grid
             </button>

             <div class="divider"></div>

             <label class="glass-btn small-btn" title="Hybrid View">
                <input type="checkbox" id="dispHybridView" onchange="toggleDisplayHybrid(this.checked)"> Hybrid
             </label>
             
             <div class="divider"></div>

             <button class="glass-btn small-btn icon-only" onclick="zoomOut()" title="Zoom Out"><i class="fas fa-search-minus"></i></button>
             <button class="glass-btn small-btn icon-only" onclick="zoomIn()" title="Zoom In"><i class="fas fa-search-plus"></i></button>
             
             <div class="divider"></div>

             <button class="glass-btn small-btn icon-only" onclick="prevSlide()" title="Previous"><i class="fas fa-chevron-left"></i></button>
             <button class="glass-btn small-btn icon-only" onclick="togglePlayPause()" id="playPauseBtn" title="Pause"><i class="fas fa-pause"></i></button>
             <button class="glass-btn small-btn icon-only" onclick="nextSlide()" title="Next"><i class="fas fa-chevron-right"></i></button>

             <div class="divider"></div>
             <button class="glass-btn small-btn icon-only" onclick="toggleDarkMode()" id="btnDarkMode" title="Toggle Dark Mode"><i class="fas fa-moon"></i></button>
             <button class="glass-btn small-btn" onclick="toggleLanguage()" id="btnLang" title="Switch Language">${currentLang.toUpperCase()}</button>

             ${isAdmin ? `<div class="divider"></div>` + speedControlHtml : ""}
        </div>

        <div id="displayContentArea" class="display-content-area">
            <div id="noDataState" class="no-data-state">
                <div class="pulse-icon"><i class="fas fa-cloud-sun-rain"></i></div>
                <h2>कोई डेटा उपलब्ध नहीं है</h2>
                <h3>No Data Available</h3>
            </div>
            <div id="map" style="width:100%; height:100%; display:none; border-radius:15px;"></div>
            <div id="imageDisplayContainer" class="image-display-container" style="display:none;">
                <!-- Images will be injected here -->
            </div>
            <div id="nextImagePreview" class="next-image-preview" style="display:none;"></div>
            <div id="gridViewContainer" class="grid-view-container" style="display:none;"></div>
        </div>
    </div>
  `;

  initMap();
  updateLanguageUI();
  if (localStorage.getItem("darkMode") === "true") {
    const btn = document.getElementById("btnDarkMode");
    if (btn) btn.innerHTML = '<i class="fas fa-sun"></i>';
  }
}

function updateTime() {
  const now = new Date();
  document.getElementById("dispDateTime").innerText = now.toLocaleString(
    "hi-IN",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    },
  );
}

function loadData() {
  // Function intentionally left empty to prevent loading map data
  // as per user request to only show selected images or "No Data".
}

function startSlideShow() {
  if (slideInterval) clearInterval(slideInterval);
  render(); // Render immediately
  const count = isImageMode ? customImages.length || 1 : 7;
  slideInterval = setInterval(() => {
    currentSlide = (currentSlide + 1) % count;
    render();
  }, slideDuration);
}

function render() {
  if (isImageMode) {
    renderImageSlide();
    return;
  }
}

function handleImageSelect(input) {
  if (input.files && input.files.length > 0) {
    customImages = Array.from(input.files).map((file) =>
      URL.createObjectURL(file),
    );
    isImageMode = true;
    currentSlide = 0;

    document.getElementById("noDataState").style.display = "none";
    const container = document.getElementById("imageDisplayContainer");
    document.getElementById("gridViewContainer").style.display = "none";
    document.getElementById("nextImagePreview").style.display = "block";
    container.style.display = "flex";
    container.innerHTML = ""; // Clear previous images

    startSlideShow();
  }
}

function renderImageSlide() {
  if (customImages.length === 0) return;

  const container = document.getElementById("imageDisplayContainer");
  const imgUrl = customImages[currentSlide];

  // Create new image element
  const newImg = document.createElement("img");
  newImg.src = imgUrl;
  newImg.className = "slide-image enter";
  resetZoom(); // Reset zoom on new slide

  // Find the current visible image (if any) to animate out
  const oldImg = container.querySelector("img.slide-image:not(.enter)");

  container.appendChild(newImg);

  if (oldImg) {
    oldImg.classList.add("exit");
    // Remove old image after transition duration (500ms)
    setTimeout(() => {
      if (oldImg.parentNode === container) {
        container.removeChild(oldImg);
      }
    }, 500);
  }

  // Remove 'enter' class after animation to mark it as stable
  setTimeout(() => {
    newImg.classList.remove("enter");
  }, 500);

  // Update Next Image Preview
  const nextIndex = (currentSlide + 1) % customImages.length;
  const nextImgUrl = customImages[nextIndex];
  const previewContainer = document.getElementById("nextImagePreview");
  if (previewContainer) {
    previewContainer.innerHTML = `
        <span style="font-size: 10px; color: #2c3e50; font-weight:bold; display: block; margin-bottom: 2px; text-align:center;">Next</span>
        <img src="${nextImgUrl}">
    `;
  }
}

function updateSlideHeader(dayNum) {
  let date = new Date();
  const storedDate = localStorage.getItem("bihar_forecast_date");
  if (storedDate) {
    date = new Date(storedDate);
  }
  const targetDate = new Date();
  targetDate.setDate(date.getDate() + (dayNum - 1));

  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  const todayStr = date
    .toLocaleDateString("en-IN", options)
    .replace(/\//g, "-");
  const targetDateStr = targetDate
    .toLocaleDateString("en-IN", options)
    .replace(/\//g, "-");

  let header = document.getElementById("slideHeader");
  if (!header) {
    header = document.createElement("div");
    header.id = "slideHeader";
    header.style.position = "absolute";
    header.style.top = "20px";
    header.style.left = "50%";
    header.style.transform = "translateX(-50%)";
    header.style.zIndex = "1000";
    header.style.background = "rgba(255,255,255,0.9)";
    header.style.padding = "10px 30px";
    header.style.borderRadius = "30px";
    header.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
    header.style.fontSize = "1.5em";
    header.style.fontWeight = "bold";
    header.style.color = "#2c3e50";
    const container = document.getElementById("contentArea");
    if (container) container.appendChild(header);
  }
  const t = uiTranslations[currentLang];
  header.innerText = `${t.date}: ${todayStr} | ${t.day} ${dayNum}: ${targetDateStr}`;
}

function initMap() {
  map = L.map("map", { zoomControl: false }).setView([25.6, 85.6], 7);

  tileLayer = L.tileLayer(
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

  tileLayer.addTo(map);
  phenomenaMarkersLayer = L.layerGroup().addTo(map);

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
          return { shpBuffer, dbfBuffer };
        }
      } catch (e) {}
    }
    throw new Error("Shapefile not found in any candidate path.");
  };

  tryLoad().then(({ shpBuffer, dbfBuffer }) => {
    const geojson = shp.combine([
      shp.parseShp(shpBuffer),
      shp.parseDbf(dbfBuffer),
    ]);
    geojsonLayer = L.geoJSON(geojson, {
      style: {
        fillColor: "#3388ff",
        weight: 2,
        opacity: 1,
        color: "#333",
        fillOpacity: 0.2,
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
  });
}

function toggleDisplayTiles(show) {
  if (show) {
    if (map.hasLayer(satelliteLayer)) map.removeLayer(satelliteLayer);
    if (!map.hasLayer(tileLayer)) map.addLayer(tileLayer);
    document.getElementById("dispSatelliteView").checked = false;
    document.getElementById("dispHybridView").checked = false;
  } else {
    if (map.hasLayer(tileLayer)) map.removeLayer(tileLayer);
  }
}

function toggleDisplaySatellite(show) {
  if (show) {
    if (map.hasLayer(tileLayer)) map.removeLayer(tileLayer);
    if (!map.hasLayer(satelliteLayer)) map.addLayer(satelliteLayer);
    document.getElementById("dispStreetView").checked = false;
    document.getElementById("dispHybridView").checked = false;
  } else {
    if (map.hasLayer(satelliteLayer)) map.removeLayer(satelliteLayer);
  }
}

function toggleDisplayHybrid(show) {
  if (show) {
    if (map.hasLayer(tileLayer)) map.removeLayer(tileLayer);
    if (map.hasLayer(satelliteLayer)) map.removeLayer(satelliteLayer);
    if (!map.hasLayer(hybridLayer)) map.addLayer(hybridLayer);
  } else {
    if (map.hasLayer(hybridLayer)) map.removeLayer(hybridLayer);
  }
}

function updateMapStyle() {
  if (!geojsonLayer) return;
  phenomenaMarkersLayer.clearLayers();

  geojsonLayer.eachLayer((layer) => {
    const oid = String(layer.feature.properties.OBJECTID);
    let phenomColor = null;
    let assignedPhenomenaList = [];

    if (districtPhenomenaMap[oid] && districtPhenomenaMap[oid].size > 0) {
      for (const pDef of phenDefs) {
        if (districtPhenomenaMap[oid].has(pDef.id)) {
          if (!phenomColor) phenomColor = phenColors[pDef.id];
          const isHidden =
            localStorage.getItem(`bihar_hide_icon_${pDef.id}`) === "true";
          if (isHidden) continue;
          assignedPhenomenaList.push(pDef);
        }
      }
    }

    if (assignedPhenomenaList.length > 0) {
      const primary = assignedPhenomenaList[0];
      const iconHtml = `<div style="width: 32px; height: 32px; display:flex; align-items:center; justify-content:center;">
                            <img src="${primary.image}" style="width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 0 2px #fff);">
                          </div>`;
      const icon = L.divIcon({
        html: iconHtml,
        className: "map-phenom-marker",
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });
      const center = layer.getBounds().getCenter();
      L.marker(center, { icon: icon }).addTo(phenomenaMarkersLayer);
    }

    if (phenomColor) {
      layer.setStyle({
        fillColor: phenomColor,
        fillOpacity: 0.8,
        color: "#333",
        weight: 2,
      });
    } else {
      layer.setStyle({
        fillColor: getDistrictRegionColor(oid),
        fillOpacity: 0.2,
        color: "#333",
        weight: 2,
      });
    }
  });
}

function getDistrictRegionColor(id) {
  id = parseInt(id);
  // Simplified region colors for display
  const subRegionDistricts = {
    nw: [38, 11, 13, 35, 31],
    nc: [23, 37, 34, 33, 10, 30, 21],
    ne: [36, 1, 18, 27, 16, 20, 29],
    sw: [28, 6, 8, 9, 2, 3],
    sc: [26, 24, 14, 25, 12, 19, 32, 5],
    se: [15, 22, 4, 17, 7],
  };
  if (subRegionDistricts.nw.includes(id)) return "#00897b";
  if (subRegionDistricts.nc.includes(id)) return "#1976d2";
  if (subRegionDistricts.ne.includes(id)) return "#673ab7";
  if (subRegionDistricts.sw.includes(id)) return "#f44336";
  if (subRegionDistricts.sc.includes(id)) return "#fbc02d";
  if (subRegionDistricts.se.includes(id)) return "#795548";
  return "#3388ff";
}

function getDistrictName(id) {
  // districtsData is available from districts.js
  const d = districtsData.find((x) => x.id === parseInt(id));
  return d ? d.name : id;
}

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

document.addEventListener("fullscreenchange", () => {
  const icon = document.getElementById("fsIcon");
  if (icon) {
    if (document.fullscreenElement) {
      icon.classList.remove("fa-expand");
      icon.classList.add("fa-compress");
    } else {
      icon.classList.remove("fa-compress");
      icon.classList.add("fa-expand");
    }
  }
});

window.toggleFullScreen = toggleFullScreen;

function togglePlayPause() {
  const btn = document.getElementById("playPauseBtn");
  const icon = btn.querySelector("i");

  if (slideInterval) {
    clearInterval(slideInterval);
    slideInterval = null;
    icon.className = "fas fa-play";
    btn.title = "Play Slideshow";
  } else {
    startSlideShow();
    icon.className = "fas fa-pause";
    btn.title = "Pause Slideshow";
  }
}
window.togglePlayPause = togglePlayPause;

function toggleSound() {
  isSoundEnabled = !isSoundEnabled;
  const icon = document.getElementById("soundIcon");
  if (isSoundEnabled) {
    icon.classList.remove("fa-volume-mute");
    icon.classList.add("fa-volume-up");
    render(); // Re-render to trigger sound immediately
  } else {
    icon.classList.remove("fa-volume-up");
    icon.classList.add("fa-volume-mute");
    currentAudio.pause();
  }
}

function updateSpeed(val) {
  slideDuration = val * 1000;
  document.getElementById("speedVal").innerText = val + "s";
  startSlideShow(); // Restart with new speed
}
window.updateSpeed = updateSpeed;

function toggleGridView() {
  isGridView = !isGridView;
  const slideContainer = document.getElementById("imageDisplayContainer");
  const gridContainer = document.getElementById("gridViewContainer");

  if (customImages.length === 0) return;

  if (isGridView) {
    // Stop slideshow
    if (slideInterval) clearInterval(slideInterval);
    slideContainer.style.display = "none";
    gridContainer.style.display = "grid";
    renderGridView();
  } else {
    // Resume slideshow
    gridContainer.style.display = "none";
    slideContainer.style.display = "flex";
    startSlideShow();
  }
}
window.toggleGridView = toggleGridView;

function renderGridView() {
  const container = document.getElementById("gridViewContainer");
  container.innerHTML = customImages
    .map(
      (src, index) => `
        <div class="grid-item" onclick="selectGridImage(${index})">
            <img src="${src}">
        </div>
    `,
    )
    .join("");
}

function selectGridImage(index) {
  currentSlide = index;
  toggleGridView(); // Switch back to slide view
}
window.selectGridImage = selectGridImage;

function zoomIn() {
  currentZoom += 0.1;
  applyZoom();
}
window.zoomIn = zoomIn;

function zoomOut() {
  if (currentZoom > 0.2) currentZoom -= 0.1;
  applyZoom();
}
window.zoomOut = zoomOut;

function applyZoom() {
  const img = document.querySelector(".slide-image:not(.exit)");
  if (img) {
    img.style.transform = `translate(-50%, -50%) scale(${currentZoom})`;
  }
}

function resetZoom() {
  currentZoom = 1;
}

function prevSlide() {
  if (customImages.length === 0) return;
  currentSlide = (currentSlide - 1 + customImages.length) % customImages.length;
  render();
}
window.prevSlide = prevSlide;

function nextSlide() {
  if (customImages.length === 0) return;
  currentSlide = (currentSlide + 1) % customImages.length;
  render();
}
window.nextSlide = nextSlide;

async function loadFromGitHub() {
  let repoConfig = localStorage.getItem("github_repo_config");
  let user, repo, path;

  if (repoConfig) {
    const conf = JSON.parse(repoConfig);
    user = conf.user;
    repo = conf.repo;
    path = conf.path;
  } else {
    const repoInput = prompt(
      "Enter GitHub Repository (username/repo):",
      "lalkamal/Bihar-Weather-Forecast",
    );
    if (!repoInput) return;
    const pathInput = prompt("Enter Folder Path in Repo:", "slideshow");
    if (!pathInput) return;

    const parts = repoInput.split("/");
    if (parts.length !== 2) {
      alert("Invalid repository format. Use username/repo");
      return;
    }
    user = parts[0];
    repo = parts[1];
    path = pathInput;

    localStorage.setItem(
      "github_repo_config",
      JSON.stringify({ user, repo, path }),
    );
  }

  try {
    const apiUrl = `https://api.github.com/repos/${user}/${repo}/contents/${path}`;
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Failed to fetch from GitHub");

    const data = await response.json();
    // Filter for images and get download URLs
    const images = data
      .filter(
        (file) =>
          file.type === "file" && /\.(jpg|jpeg|png|gif)$/i.test(file.name),
      )
      .map((file) => file.download_url);

    if (images.length > 0) {
      customImages = images;
      isImageMode = true;
      currentSlide = 0;

      document.getElementById("noDataState").style.display = "none";
      const container = document.getElementById("imageDisplayContainer");
      document.getElementById("gridViewContainer").style.display = "none";
      document.getElementById("nextImagePreview").style.display = "block";
      container.style.display = "flex";
      container.innerHTML = "";

      startSlideShow();
      alert(`Loaded ${images.length} images from GitHub!`);
    } else {
      alert("No images found in the specified folder.");
    }
  } catch (error) {
    console.error(error);
    alert(
      "Error loading from GitHub. Check console for details or clear config to try again.",
    );
    if (confirm("Clear saved GitHub config?")) {
      localStorage.removeItem("github_repo_config");
    }
  }
}
window.loadFromGitHub = loadFromGitHub;
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
  const titleEl = document.getElementById("dispTitle");
  const btn = document.getElementById("btnLang");
  if (titleEl) titleEl.innerText = t.title;
  if (btn) btn.innerText = currentLang.toUpperCase();
}

function playWeatherSound(dayPhenomena) {
  if (!isSoundEnabled) {
    if (!currentAudio.paused) currentAudio.pause();
    return;
  }

  const priorities = ["thunderstorm", "hailstorm", "heavyrain", "gustywind"];
  let soundToPlay = null;

  for (const p of priorities) {
    if (dayPhenomena.has(p)) {
      soundToPlay = weatherSounds[p];
      break;
    }
  }

  if (soundToPlay) {
    if (!currentAudio.src.includes(soundToPlay)) {
      currentAudio.src = soundToPlay;
      currentAudio.play().catch((e) => console.warn("Audio play failed:", e));
    } else if (currentAudio.paused) {
      currentAudio.play().catch((e) => console.warn("Audio play failed:", e));
    }
  } else {
    currentAudio.pause();
  }
}
