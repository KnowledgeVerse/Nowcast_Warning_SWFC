// Configuration
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
    image: "assets/weather-icons/dry.png",
  },
  {
    id: "heavyrain",
    hindi: "भारी वर्षा",
    english: "Heavy Rainfall",
    image: "assets/weather-icons/heavyrain.png",
  },
  {
    id: "heatwave",
    hindi: "लू (उष्ण लहर)",
    english: "Heat Wave",
    image: "assets/weather-icons/heatwave.png",
  },
  {
    id: "warmnight",
    hindi: "गर्म रात्रि",
    english: "Warm Night",
    image: "assets/weather-icons/warmnight.png",
  },
  {
    id: "coldwave",
    hindi: "शीत लहर",
    english: "Cold Wave",
    image: "assets/weather-icons/coldwave.png",
  },
  {
    id: "coldday",
    hindi: "शीत दिवस",
    english: "Cold Day",
    image: "assets/weather-icons/coldday.png",
  },
  {
    id: "densefog",
    hindi: "घना कोहरा",
    english: "Dense Fog",
    image: "assets/weather-icons/densefog.png",
  },
  {
    id: "thunderstorm",
    hindi: "मेघगर्जन/वज्रपात",
    english: "Thunderstorm",
    image: "assets/weather-icons/thunderstorm.png",
  },
  {
    id: "gustywind",
    hindi: "तेज़ हवा",
    english: "Gusty Wind",
    image: "assets/weather-icons/gustywind.png",
  },
  {
    id: "squall",
    hindi: "तेज़ हवा के झोंके",
    english: "Squall",
    image: "assets/weather-icons/squall.png",
  },
  {
    id: "frost",
    hindi: "पाला",
    english: "Frost",
    image: "assets/weather-icons/frost.png",
  },
  {
    id: "seastate",
    hindi: "समुद्र की स्थिति",
    english: "Sea State",
    image: "assets/weather-icons/sea.png",
  },
  {
    id: "cyclone",
    hindi: "चक्रवात",
    english: "Cyclone",
    image: "assets/weather-icons/cyclone.png",
  },
  {
    id: "duststorm",
    hindi: "धूल भरी आंधी",
    english: "Dust Storm",
    image: "assets/weather-icons/dust.png",
  },
  {
    id: "snow",
    hindi: "बर्फबारी",
    english: "Snow",
    image: "assets/weather-icons/snow.png",
  },
  {
    id: "hailstorm",
    hindi: "ओलावृष्टि",
    english: "Hailstorm",
    image: "assets/weather-icons/hailstorm.png",
  },
];

const warningLegendItems = [
  { color: "rgb(255, 0, 0)", text: "RED (लाल) – WARNING" },
  { color: "rgb(255, 192, 0)", text: "ORANGE (नारंगी) – ALERT" },
  { color: "rgb(255, 255, 0)", text: "YELLOW (पीला) – WATCH" },
  { color: "rgb(0, 153, 0)", text: "GREEN (हरा) – NO WARNING" },
];

let weeklyData = [];
let baseDate = new Date();
let maps = [];
let isZoomEnabled = false;
let isSyncEnabled = true; // Default sync enabled when zoom is enabled
let isLayoutEditEnabled = false;
let currentLayerType = "clean"; // Default

const tileLayerUrls = {
  street: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  satellite:
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  hybrid: "https://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}",
};

document.addEventListener("DOMContentLoaded", init);

function init() {
  const rawData = localStorage.getItem("bihar_weather_data");
  const rawDate = localStorage.getItem("bihar_forecast_date");

  if (rawDate) baseDate = new Date(rawDate);

  if (rawData) {
    try {
      const parsed = JSON.parse(rawData);
      if (parsed.warning) {
        weeklyData = parsed.warning;
      } else if (Array.isArray(parsed)) {
        weeklyData = parsed;
      }
    } catch (e) {
      console.error("Data parse error", e);
    }
  }
  while (weeklyData.length < 7) weeklyData.push({});

  // Update Header Text
  const headerTitle = document.getElementById("mainHeaderTitle");
  if (headerTitle) {
    const dateOptions = { day: "2-digit", month: "2-digit", year: "numeric" };
    const dateStr = baseDate
      .toLocaleDateString("en-GB", dateOptions)
      .replace(/\//g, ".");
    headerTitle.innerText = `अगले 7 दिनों के लिए मौसम चेतावनी मानचित्र दिनांक : ${dateStr}`;
    headerTitle.style.fontSize = "1.2em";
  }

  // Update Print Header Text
  const printHeader = document.getElementById("printHeader");
  if (printHeader) {
    const dateOptions = { day: "2-digit", month: "2-digit", year: "numeric" };
    const dateStr = baseDate
      .toLocaleDateString("en-GB", dateOptions)
      .replace(/\//g, ".");
    printHeader.innerText = `अगले 7 दिनों के लिए मौसम चेतावनी मानचित्र दिनांक : ${dateStr}`;
  }

  renderGrid();
  initMaps();
  loadShapefile();
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function generateCompositeCanvas() {
  const items = document.querySelectorAll(".grid-item");
  const container = document.getElementById("gridContainer");
  const wasGrid = container.classList.contains("grid-view-active");

  // Temporarily disable grid view to capture high-res images
  if (wasGrid) {
    container.classList.remove("grid-view-active");
  }

  if (items.length === 0) return null;

  // Capture Header
  const headerText = document.getElementById("mainHeaderTitle").innerText;
  const tempHeader = document.createElement("div");
  tempHeader.style.cssText =
    "position:fixed; top:0; left:0; width:1600px; background:white; padding:20px; text-align:center; font-family:'Noto Sans Devanagari', sans-serif; font-weight:bold; font-size:32px; color:#000; z-index:-9999;";
  tempHeader.innerText = headerText;
  document.body.appendChild(tempHeader);

  let headerDataUrl;
  try {
    headerDataUrl = await domtoimage.toPng(tempHeader, { bgcolor: "#ffffff" });
  } catch (e) {
    console.error("Header capture failed", e);
    document.body.removeChild(tempHeader);
    if (wasGrid) container.classList.add("grid-view-active");
    return null;
  }
  document.body.removeChild(tempHeader);

  const headerImg = await loadImage(headerDataUrl);

  // Capture Grid Items
  const itemImages = [];
  for (let i = 0; i < items.length; i++) {
    const dataUrl = await domtoimage.toPng(items[i], { bgcolor: "#ffffff" });
    itemImages.push(await loadImage(dataUrl));
  }

  // Restore Grid View
  if (wasGrid) container.classList.add("grid-view-active");

  // Layout Calculations (2 Columns)
  const colCount = 2;
  const padding = 20;
  const itemWidth = itemImages[0].width;
  const itemHeight = itemImages[0].height;

  const canvasWidth = itemWidth * colCount + padding * (colCount + 1);
  const rowCount = Math.ceil(itemImages.length / colCount);
  const gridHeight = itemHeight * rowCount + padding * (rowCount + 1);
  const totalHeight = headerImg.height + gridHeight;

  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = totalHeight;
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw Header (Centered)
  let hWidth = headerImg.width;
  let hHeight = headerImg.height;
  if (hWidth > canvasWidth) {
    const scale = canvasWidth / hWidth;
    hWidth = canvasWidth;
    hHeight = hHeight * scale;
  }
  const headerX = (canvasWidth - hWidth) / 2;
  ctx.drawImage(headerImg, headerX, 0, hWidth, hHeight);

  let currentY = hHeight + padding;

  for (let i = 0; i < itemImages.length; i++) {
    const col = i % colCount;
    const row = Math.floor(i / colCount);
    const x = padding + col * (itemWidth + padding);
    const y = currentY + row * (itemHeight + padding);
    ctx.drawImage(itemImages[i], x, y, itemWidth, itemHeight);
  }

  return canvas;
}

async function downloadSingleImage() {
  const btn = document.querySelector("button[onclick='downloadSingleImage()']");
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
  try {
    const canvas = await generateCompositeCanvas();
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.download = `Warning_Grid_${new Date().toISOString().split("T")[0]}.png`;
      link.href = dataUrl;
      link.click();
    }
  } catch (e) {
    console.error(e);
    alert("Error generating image.");
  } finally {
    btn.innerHTML = originalText;
  }
}
window.downloadSingleImage = downloadSingleImage;

async function syncToBulletin() {
  const btn = document.querySelector("button[onclick='syncToBulletin()']");
  const originalText = '<i class="fas fa-sync"></i> Sync to Bulletin';
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Syncing...';
  try {
    const canvas = await generateCompositeCanvas();
    if (canvas) {
      // Clear previous image to free up space immediately
      try {
        localStorage.removeItem("bihar_warning_image");
      } catch (e) {
        console.warn("Could not clear old warning image", e);
      }

      let saved = false;
      let scale = 1.0;

      // Try progressively lower scale and quality until it fits
      while (scale >= 0.4 && !saved) {
        let exportCanvas = canvas;
        if (scale < 1.0) {
          exportCanvas = document.createElement("canvas");
          exportCanvas.width = canvas.width * scale;
          exportCanvas.height = canvas.height * scale;
          const ctx = exportCanvas.getContext("2d");
          ctx.drawImage(canvas, 0, 0, exportCanvas.width, exportCanvas.height);
        }

        // Try higher quality first
        let quality = 0.95;
        while (quality > 0.4 && !saved) {
          try {
            const dataUrl = exportCanvas.toDataURL("image/jpeg", quality);
            localStorage.setItem("bihar_warning_image", dataUrl);
            saved = true;
          } catch (e) {
            if (e.name === "QuotaExceededError" || e.code === 22) {
              quality -= 0.1;
            } else {
              throw e;
            }
          }
        }
        if (!saved) scale -= 0.2; // Reduce scale if quality reduction wasn't enough
      }
      if (!saved) throw new Error("QuotaExceededError");

      btn.innerHTML = '<i class="fas fa-check"></i> Synced!';
      setTimeout(() => {
        btn.innerHTML = originalText;
      }, 2000);
    }
  } catch (e) {
    console.error(e);
    if (e.name === "QuotaExceededError" || e.message === "QuotaExceededError") {
      alert(
        "Sync failed: Image size is too large for browser storage. Please clear old bulletins or browser cache.",
      );
    } else {
      alert("Error syncing image.");
    }
  } finally {
    if (btn.innerHTML.includes("Syncing")) {
      btn.innerHTML = originalText;
    }
  }
}
window.syncToBulletin = syncToBulletin;

async function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p", "mm", "a2"); // Portrait, A2
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const btn = document.querySelector("button[onclick='downloadPDF()']");
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';

  try {
    const dateOptions = { day: "2-digit", month: "2-digit", year: "numeric" };
    const dateStr = baseDate
      .toLocaleDateString("en-GB", dateOptions)
      .replace(/\//g, ".");
    const headerText = `अगले 7 दिनों के लिए मौसम चेतावनी मानचित्र दिनांक : ${dateStr}`;

    const tempHeader = document.createElement("div");
    tempHeader.style.cssText =
      "position:fixed; top:0; left:0; width:1600px; background:white; padding:20px; text-align:center; font-family:'Noto Sans Devanagari', sans-serif; font-weight:bold; font-size:32px; color:#000; z-index:-9999;";
    tempHeader.innerText = headerText;
    document.body.appendChild(tempHeader);

    const headerDataUrl = await domtoimage.toPng(tempHeader, {
      bgcolor: "#ffffff",
    });
    document.body.removeChild(tempHeader);

    const headerImgProps = doc.getImageProperties(headerDataUrl);
    const pdfHeaderWidth = pageWidth - 20;
    const pdfHeaderHeight =
      (headerImgProps.height * pdfHeaderWidth) / headerImgProps.width;
    doc.addImage(headerDataUrl, "PNG", 10, 10, pdfHeaderWidth, pdfHeaderHeight);

    const items = document.querySelectorAll(".grid-item");
    const cols = 2;
    const rows = 4;
    const marginX = 5;
    const marginY = 5;
    const startY = 10 + pdfHeaderHeight + 5;

    const gridWidth = pageWidth - 2 * marginX;
    const gridHeight = pageHeight - startY - marginY;
    const cellWidth = (gridWidth - marginX * (cols - 1)) / cols;
    const cellHeight = (gridHeight - marginY * (rows - 1)) / rows;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const dataUrl = await domtoimage.toPng(item, {
        quality: 0.95,
        bgcolor: "#ffffff",
      });
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = marginX + col * (cellWidth + marginX);
      const y = startY + row * (cellHeight + marginY);
      doc.addImage(dataUrl, "PNG", x, y, cellWidth, cellHeight);
    }

    doc.save(`Warning_Report_${new Date().toISOString().split("T")[0]}.pdf`);
  } catch (e) {
    console.error("PDF Export Error:", e);
    alert("Error generating PDF. Please try again.");
  } finally {
    btn.innerHTML = originalText;
  }
}
window.downloadPDF = downloadPDF;

async function downloadAllImages() {
  const btn = document.querySelector("button[onclick='downloadAllImages()']");
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

  const items = document.querySelectorAll(".grid-item");

  try {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const isMap = item.querySelector(".map-container");
      const fileName = isMap
        ? `Warning_Day_${i + 1}.png`
        : `Warning_Legend.png`;
      const dataUrl = await domtoimage.toPng(item, { bgcolor: "#ffffff" });
      const link = document.createElement("a");
      link.download = fileName;
      link.href = dataUrl;
      link.click();
      await new Promise((r) => setTimeout(r, 300));
    }
  } catch (e) {
    console.error("Image Download Error:", e);
    alert("Error downloading images.");
  } finally {
    btn.innerHTML = originalText;
  }
}
window.downloadAllImages = downloadAllImages;

function toggleBodyAnimation() {
  document.body.classList.toggle("animated-bg");
}
window.toggleBodyAnimation = toggleBodyAnimation;

function updatePageBackground(color) {
  document.body.style.background = color;
}
window.updatePageBackground = updatePageBackground;

function renderGrid() {
  const container = document.getElementById("gridContainer");

  for (let i = 0; i < 7; i++) {
    const dayNum = i + 1;
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + i);
    const dateStr = date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const item = document.createElement("div");
    item.className = "grid-item";
    item.innerHTML = `
          <div class="map-floating-header" id="header-map-${i}">Day ${dayNum} : ${dateStr}</div>
          <div id="map${i}" class="map-container"></div>
      `;
    container.appendChild(item);
  }

  const legendItem = document.createElement("div");
  legendItem.className = "grid-item legend-container";
  let legendHtml = `<div class="legend-title" style="font-size:3em; padding:20px; text-align:center; white-space:nowrap;">LEGEND / संकेत</div>`;

  legendHtml += `<div class="legend-section" style="padding:30px; display:flex; flex-direction:column; justify-content:center; flex-grow:1;"><strong style="font-size: 2.5em; margin-bottom: 30px; display:block; white-space:nowrap;">Warning (चेतावनी)</strong><div style="display:flex; flex-direction:column; gap:30px;">`;
  warningLegendItems.forEach((l) => {
    legendHtml += `<div class="legend-item" style="font-size:40px; display:flex; align-items:center;"><div class="color-box" style="width:80px; height:80px; background:${l.color}; ${l.border || ""}; margin-right: 25px; flex-shrink:0;"></div><span>${l.text}</span></div>`;
  });
  legendHtml += `</div></div>`;

  legendItem.innerHTML = legendHtml;
  container.appendChild(legendItem);
}

function initMaps() {
  for (let i = 0; i < 7; i++) {
    const map = L.map(`map${i}`, {
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      touchZoom: false,
      zoomSnap: 0.1,
    }).setView([25.6, 85.6], 6);

    if (currentLayerType !== "clean") {
      const layer = L.tileLayer(tileLayerUrls[currentLayerType], {
        opacity: 1,
        attribution: "&copy; OpenStreetMap",
        crossOrigin: true,
      });
      layer.addTo(map);
      map.currentTileLayer = layer;
    }

    if (i === 0) {
      map.on("move", function () {
        if (isZoomEnabled && isSyncEnabled) {
          const c = map.getCenter();
          const z = map.getZoom();
          maps.slice(1).forEach((m) => m.setView(c, z, { animate: false }));
        }
      });
    }
    maps.push(map);
  }
}

function setAllMapsLayer(type) {
  currentLayerType = type;
  maps.forEach((map) => {
    if (map.currentTileLayer) {
      map.removeLayer(map.currentTileLayer);
      map.currentTileLayer = null;
    }
    if (type !== "clean" && tileLayerUrls[type]) {
      let options = { opacity: 1 };
      if (type === "hybrid") options.subdomains = ["mt0", "mt1", "mt2", "mt3"];
      const newLayer = L.tileLayer(tileLayerUrls[type], {
        ...options,
        crossOrigin: true,
      });
      newLayer.addTo(map);
      newLayer.bringToBack();
      map.currentTileLayer = newLayer;
    }
  });
}
window.setAllMapsLayer = setAllMapsLayer;

function setAllMapsBackground(color) {
  for (let i = 0; i < 7; i++) {
    const mapDiv = document.getElementById(`map${i}`);
    if (mapDiv) mapDiv.style.background = color;
  }
}
window.setAllMapsBackground = setAllMapsBackground;

function loadShapefile() {
  const candidates = [
    "data/Bihar_Districts_Shapefile/Bihar",
    "data/Bihar_Districts_Shapefile/bihar",
    "Data/Bihar_Districts_Shapefile/Bihar",
    "Data/Bihar_Districts_Shapefile/bihar",
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
      for (let i = 0; i < 7; i++) {
        addGeoJsonToMap(maps[i], geojson, i);
      }
      setTimeout(() => {
        maps.forEach((map) => map.invalidateSize());
      }, 500);
    })
    .catch((e) => {
      console.error("Shapefile load error", e);
    });
}

function addGeoJsonToMap(map, geojson, index) {
  const dayData = weeklyData[index] || {};
  const layer = L.geoJSON(geojson, {
    style: (feature) => {
      const oid = String(feature.properties.OBJECTID);
      const distData = dayData[oid];
      let fillColor = "#ffffff",
        fillOpacity = 0.2,
        phenomColor = null;

      if (distData && distData.phenomena && distData.phenomena.length > 0) {
        for (const pDef of phenDefs) {
          if (distData.phenomena.includes(pDef.id)) {
            if (!phenomColor) phenomColor = phenColors[pDef.id];
          }
        }
      }
      if (distData && distData.color) {
        fillColor = distData.color;
        fillOpacity = 0.6;
      } else if (distData && distData.warningLevel !== undefined) {
        // Fallback: Use warningLevel if color is missing
        const wColors = {
          3: "rgb(255, 0, 0)", // Red
          2: "rgb(255, 192, 0)", // Orange
          1: "rgb(255, 255, 0)", // Yellow
          0: "rgb(0, 153, 0)", // Green
        };
        if (wColors[distData.warningLevel])
          fillColor = wColors[distData.warningLevel];
        fillOpacity = 0.6;
      } else if (phenomColor) {
        fillColor = phenomColor;
        fillOpacity = 0.6;
      } else {
        fillColor = getDistrictRegionColor(oid);
        fillOpacity = 0.1;
      }
      return {
        fillColor: fillColor,
        weight: 1,
        opacity: 1,
        color: "#333",
        fillOpacity: fillOpacity,
      };
    },
    onEachFeature: (feature, layer) => {
      if (feature.properties && feature.properties.D_NAME) {
        layer.bindTooltip(feature.properties.D_NAME, {
          permanent: true,
          direction: "center",
          className: "map-label",
          offset: [0, 25],
        });
      }
      const oid = String(feature.properties.OBJECTID);
      const distData = dayData[oid];
      if (distData && distData.phenomena && distData.phenomena.length > 0) {
        const center = layer.getBounds().getCenter();
        const uniquePhenoms = [...new Set(distData.phenomena)];
        let iconsHtml = "";
        const iconSize = uniquePhenoms.length > 1 ? "25px" : "35px";
        uniquePhenoms.forEach((pId) => {
          const pDef = phenDefs.find((p) => p.id === pId);
          if (pDef)
            iconsHtml += `<div class="phenom-anim-${pId}" style="width: ${iconSize}; height: ${iconSize}; margin: 1px; display:flex; align-items:center; justify-content:center;"><img src="${pDef.image}" style="width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 0 2px #fff);"></div>`;
        });
        L.marker(center, {
          icon: L.divIcon({
            html: iconsHtml,
            className: "map-phenom-marker",
            iconSize: [60, 40],
            iconAnchor: [30, 20],
          }),
          interactive: false,
        }).addTo(map);
      }
    },
  }).addTo(map);
  addLegendToMap(map, dayData, index);
  map.fitBounds(layer.getBounds(), { padding: [0, 0] });
}

function addLegendToMap(map, dayData, index) {
  const legend = L.control({ position: "topright" });
  legend.onAdd = function (map) {
    const div = L.DomUtil.create("div", "info legend map-legend-box");
    div.id = `legend-map-${index}`;
    div.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
    div.style.padding = "8px";
    div.style.borderRadius = "5px";
    div.style.boxShadow = "0 0 15px rgba(0,0,0,0.3)";
    div.style.fontSize = "14px"; // Reduced font size
    div.style.lineHeight = "1.3";
    div.style.minWidth = "180px"; // Reduced width
    div.style.transformOrigin = "top right";

    let html = "";
    const presentPhenomena = new Set();
    if (dayData) {
      Object.values(dayData).forEach((d) => {
        if (d.phenomena) d.phenomena.forEach((p) => presentPhenomena.add(p));
      });
    }
    if (presentPhenomena.size > 0) {
      html += "<strong>Phenomena</strong><br>";
      presentPhenomena.forEach((pId) => {
        const pDef = phenDefs.find((p) => p.id === pId);
        if (pDef) {
          html += `<div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;"><img src="${pDef.image}" style="width:25px; height:25px;"><span>${pDef.english}</span></div>`;
        }
      });
      html += "<hr style='margin:5px 0; border:0; border-top:1px solid #ccc;'>";
    }
    html += "<strong>Warning</strong><br>";
    warningLegendItems.forEach((item) => {
      html += `<div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;"><span style="width:20px; height:20px; background:${item.color}; border:${item.border || "1px solid #ccc"}; display:inline-block;"></span><span>${item.text}</span></div>`;
    });
    div.innerHTML = html;
    L.DomEvent.disableClickPropagation(div);
    return div;
  };
  legend.addTo(map);
}

function toggleZoom() {
  isZoomEnabled = !isZoomEnabled;
  const btn = document.getElementById("btnZoomToggle");
  if (btn) {
    btn.style.backgroundColor = isZoomEnabled ? "#e74c3c" : "#6c757d";
    btn.innerHTML = isZoomEnabled
      ? '<i class="fas fa-search-minus"></i> Disable Zoom'
      : '<i class="fas fa-search-plus"></i> Zoom';
  }
  maps.forEach((map) => {
    if (isZoomEnabled) {
      map.dragging.enable();
      map.touchZoom.enable();
      map.doubleClickZoom.enable();
      map.scrollWheelZoom.enable();
      map.boxZoom.enable();
    } else {
      map.dragging.disable();
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
      map.boxZoom.disable();
      map.setView([25.6, 85.6], 7);
    }
  });
}
window.toggleZoom = toggleZoom;

function toggleLayoutEdit() {
  isLayoutEditEnabled = !isLayoutEditEnabled;
  const btn = document.getElementById("btnLayoutEdit");
  if (btn) {
    btn.style.backgroundColor = isLayoutEditEnabled ? "#e74c3c" : "#6c757d";
    btn.innerHTML = isLayoutEditEnabled
      ? '<i class="fas fa-save"></i> Save Layout'
      : '<i class="fas fa-arrows-alt"></i> Edit Layout';
  }
  const elements = document.querySelectorAll(
    ".map-legend-box, .map-floating-header",
  );
  elements.forEach((el) => {
    if (isLayoutEditEnabled) {
      el.style.border = "2px dashed red";
      el.style.cursor = "move";
      el.onwheel = function (e) {
        e.preventDefault();
        e.stopPropagation();
        let scale = parseFloat(el.getAttribute("data-scale")) || 1;
        if (e.deltaY < 0) scale += 0.1;
        else scale -= 0.1;
        scale = Math.min(Math.max(0.5, scale), 3);
        el.style.transform = `scale(${scale})`;
        if (el.classList.contains("map-floating-header")) {
          el.style.transformOrigin = "top center";
          el.style.transform = `translateX(-50%) scale(${scale})`;
        } else {
          el.style.transformOrigin = "top right";
        }
        el.setAttribute("data-scale", scale);
        if (el.id.endsWith("-0")) syncLayout(el, scale);
      };
    } else {
      el.style.border = "none";
      el.style.cursor = "default";
      el.onwheel = null;
    }
  });
  if (isLayoutEditEnabled)
    alert(
      "Layout Edit Mode:\n- Scroll mouse over Day 1 Legend/Header to resize ALL.\n- Changes on Day 1 sync to Day 2-7.",
    );
}

function syncLayout(sourceEl, scale) {
  const idParts = sourceEl.id.split("-");
  const type = idParts[0];
  for (let i = 1; i < 7; i++) {
    const targetId = `${type}-map-${i}`;
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      if (type === "header") {
        targetEl.style.transform = `translateX(-50%) scale(${scale})`;
        targetEl.style.transformOrigin = "top center";
      } else {
        targetEl.style.transform = `scale(${scale})`;
        targetEl.style.transformOrigin = "top right";
      }
      targetEl.setAttribute("data-scale", scale);
    }
  }
}
window.toggleLayoutEdit = toggleLayoutEdit;

function toggleGridView() {
  const container = document.getElementById("gridContainer");
  container.classList.toggle("grid-view-active");
  setTimeout(() => {
    maps.forEach((map) => {
      map.invalidateSize();
      map.eachLayer((layer) => {
        if (layer instanceof L.GeoJSON) {
          map.fitBounds(layer.getBounds(), { padding: [0, 0] });
        }
      });
    });
  }, 300);
}
window.toggleGridView = toggleGridView;

function getDistrictRegionColor(id) {
  id = parseInt(id);
  const regions =
    typeof subRegionDistricts !== "undefined"
      ? subRegionDistricts
      : {
          nw: [38, 11, 13, 35, 31],
          nc: [23, 37, 34, 33, 10, 30, 21],
          ne: [36, 1, 18, 27, 16, 20, 29],
          sw: [28, 6, 8, 9, 2, 3],
          sc: [26, 24, 14, 25, 12, 19, 32, 5],
          se: [15, 22, 4, 17, 7],
        };
  if (regions.nw.includes(id)) return "#00897b";
  if (regions.nc.includes(id)) return "#1976d2";
  if (regions.ne.includes(id)) return "#673ab7";
  if (regions.sw.includes(id)) return "#f44336";
  if (regions.sc.includes(id)) return "#fbc02d";
  if (regions.se.includes(id)) return "#795548";
  return "#3388ff";
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function generateCompositeCanvas() {
  const items = document.querySelectorAll(".grid-item");
  const container = document.getElementById("gridContainer");
  const wasGrid = container.classList.contains("grid-view-active");

  if (wasGrid) {
    container.classList.remove("grid-view-active");
    maps.forEach((map) => map.invalidateSize());
    await new Promise((r) => setTimeout(r, 500));
  }

  if (items.length === 0) return null;

  const headerText = document.getElementById("mainHeaderTitle").innerText;
  const tempHeader = document.createElement("div");
  tempHeader.style.cssText =
    "position:fixed; top:0; left:0; width:1600px; background:white; padding:20px; text-align:center; font-family:'Noto Sans Devanagari', sans-serif; font-weight:bold; font-size:32px; color:#000; z-index:-9999;";
  tempHeader.innerText = headerText;
  document.body.appendChild(tempHeader);

  let headerDataUrl;
  try {
    headerDataUrl = await domtoimage.toPng(tempHeader, { bgcolor: "#ffffff" });
  } catch (e) {
    console.error("Header capture failed", e);
    document.body.removeChild(tempHeader);
    if (wasGrid) {
      container.classList.add("grid-view-active");
      maps.forEach((map) => map.invalidateSize());
    }
    return null;
  }
  document.body.removeChild(tempHeader);

  const headerImg = await loadImage(headerDataUrl);

  const itemImages = [];
  for (let i = 0; i < items.length; i++) {
    const dataUrl = await domtoimage.toPng(items[i], { bgcolor: "#ffffff" });
    itemImages.push(await loadImage(dataUrl));
  }

  if (wasGrid) {
    container.classList.add("grid-view-active");
    maps.forEach((map) => map.invalidateSize());
  }

  const colCount = 2;
  const padding = 20;
  const itemWidth = itemImages[0].width;
  const itemHeight = itemImages[0].height;

  const canvasWidth = itemWidth * colCount + padding * (colCount + 1);
  const rowCount = Math.ceil(itemImages.length / colCount);
  const gridHeight = itemHeight * rowCount + padding * (rowCount + 1);
  const totalHeight = headerImg.height + gridHeight;

  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = totalHeight;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let hWidth = headerImg.width;
  let hHeight = headerImg.height;
  if (hWidth > canvasWidth) {
    const scale = canvasWidth / hWidth;
    hWidth = canvasWidth;
    hHeight = hHeight * scale;
  }
  const headerX = (canvasWidth - hWidth) / 2;
  ctx.drawImage(headerImg, headerX, 0, hWidth, hHeight);

  let currentY = hHeight + padding;

  for (let i = 0; i < itemImages.length; i++) {
    const col = i % colCount;
    const row = Math.floor(i / colCount);
    const x = padding + col * (itemWidth + padding);
    const y = currentY + row * (itemHeight + padding);
    ctx.drawImage(itemImages[i], x, y, itemWidth, itemHeight);
  }

  return canvas;
}

async function downloadSingleImage() {
  const btn = document.querySelector("button[onclick='downloadSingleImage()']");
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
  try {
    const canvas = await generateCompositeCanvas();
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.download = `Warning_Grid_${new Date().toISOString().split("T")[0]}.png`;
      link.href = dataUrl;
      link.click();
    }
  } catch (e) {
    console.error(e);
    alert("Error generating image.");
  } finally {
    btn.innerHTML = originalText;
  }
}
window.downloadSingleImage = downloadSingleImage;

async function syncToBulletin() {
  const btn = document.querySelector("button[onclick='syncToBulletin()']");
  const originalText = '<i class="fas fa-sync"></i> Sync to Bulletin';
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Syncing...';
  try {
    const canvas = await generateCompositeCanvas();
    if (canvas) {
      try {
        localStorage.removeItem("bihar_warning_image");
      } catch (e) {
        console.warn("Could not clear old warning image", e);
      }

      let saved = false;
      let scale = 1.0;

      while (scale >= 0.2 && !saved) {
        let exportCanvas = canvas;
        if (scale < 1.0) {
          exportCanvas = document.createElement("canvas");
          exportCanvas.width = canvas.width * scale;
          exportCanvas.height = canvas.height * scale;
          const ctx = exportCanvas.getContext("2d");
          ctx.drawImage(canvas, 0, 0, exportCanvas.width, exportCanvas.height);
        }

        let quality = 0.9;
        while (quality > 0.3 && !saved) {
          try {
            const dataUrl = exportCanvas.toDataURL("image/jpeg", quality);
            localStorage.setItem("bihar_warning_image", dataUrl);
            saved = true;
          } catch (e) {
            if (e.name === "QuotaExceededError" || e.code === 22) {
              quality -= 0.1;
            } else {
              throw e;
            }
          }
        }
        if (!saved) scale -= 0.2;
      }

      if (!saved) throw new Error("QuotaExceededError");

      btn.innerHTML = '<i class="fas fa-check"></i> Synced!';
      setTimeout(() => {
        btn.innerHTML = originalText;
      }, 2000);
    }
  } catch (e) {
    console.error(e);
    if (e.name === "QuotaExceededError" || e.message === "QuotaExceededError") {
      alert(
        "Sync failed: Image size is too large for browser storage. Please clear old bulletins or browser cache.",
      );
    } else {
      alert("Error syncing image.");
    }
  } finally {
    if (btn.innerHTML.includes("Syncing")) {
      btn.innerHTML = originalText;
    }
  }
}
window.syncToBulletin = syncToBulletin;
