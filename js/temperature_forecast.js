// e:\Lal Kamal Project\SWFC\Bihar-Weather-Forecast\js\temperature_forecast.js

let weeklyData = { max: [], min: [] };
let baseDate = new Date();
let maps = [];
let currentTab = "min"; // 'max' or 'min'
let currentSeason = "Summer"; // Default
let isZoomEnabled = false;
let isSyncEnabled = true;
let isLayoutEditEnabled = false;
let currentLayerType = "clean";

const tileLayerUrls = {
  street: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  satellite:
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  hybrid: "https://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}",
};

document.addEventListener("DOMContentLoaded", init);

function init() {
  const rawData = localStorage.getItem("bihar_temperature_data");
  const rawDate = localStorage.getItem("bihar_forecast_date");

  if (rawDate) {
    baseDate = new Date(rawDate);
    determineSeason(baseDate);
  }

  if (rawData) {
    try {
      weeklyData = JSON.parse(rawData);
    } catch (e) {
      console.error("Data parse error", e);
    }
  }

  // Ensure arrays exist
  if (!weeklyData.max) weeklyData.max = Array.from({ length: 7 }, () => ({}));
  if (!weeklyData.min) weeklyData.min = Array.from({ length: 7 }, () => ({}));

  updateHeader();
  renderGrid();
  initMaps();
  loadShapefile();
}

function updateHeader() {
  const headerTitle = document.getElementById("mainHeaderTitle");
  if (headerTitle) {
    const dateOptions = { day: "2-digit", month: "2-digit", year: "numeric" };
    const dateStr = baseDate
      .toLocaleDateString("en-GB", dateOptions)
      .replace(/\//g, ".");
    const typeText = currentTab === "max" ? "अधिकतम" : "न्यूनतम";
    headerTitle.innerText = `अगले सात दिनों के लिए ${typeText} तापमान का पूर्वानुमान मानचित्र दिनांक : ${dateStr}`;
  }
}

function determineSeason(date) {
  const month = date.getMonth(); // 0-11
  // Winter: Oct (9) to Feb (1)
  // Summer: Mar (2) to Sep (8)
  if (month >= 9 || month <= 1) {
    currentSeason = "Winter";
  } else {
    currentSeason = "Summer";
  }

  const sel = document.getElementById("seasonSelect");
  if (sel && sel.disabled) {
    sel.value = currentSeason;
    sel.options[0].text = "Winter (Auto)";
    sel.options[1].text = "Summer (Auto)";
  }
}

function setSeason(val) {
  currentSeason = val;
  switchTab(currentTab); // Re-render
}
window.setSeason = setSeason;

function switchTab(tab) {
  currentTab = tab;
  document.getElementById("tabMax").classList.toggle("active", tab === "max");
  document.getElementById("tabMin").classList.toggle("active", tab === "min");

  updateHeader();

  // Re-render maps with new data
  maps.forEach((map, index) => {
    map.eachLayer((layer) => {
      if (layer.feature) {
        const oid = String(layer.feature.properties.OBJECTID);
        const style = getFeatureStyle(oid, index);
        layer.setStyle(style);

        const distData = (
          currentTab === "max" ? weeklyData.max : weeklyData.min
        )[index][oid];

        layer.bindTooltip(layer.feature.properties.D_NAME, {
          permanent: true,
          direction: "center",
          className: "map-label",
          offset: [0, 0],
        });
      }
    });
  });

  updateLegends();
  // Re-render grid to update the 8th page legend content
  renderGrid();
  // We need to re-attach maps to the new DOM elements created by renderGrid
  // Actually, renderGrid destroys map containers. It's better to just update the 8th page content.
  // But for simplicity, let's just update the 8th page content specifically.
  updateLegendPage();
}
window.switchTab = switchTab;

function renderGrid() {
  const container = document.getElementById("gridContainer");
  // Only clear if empty (initial load) to avoid destroying map instances
  if (container.children.length > 1) {
    updateLegendPage();
    return;
  }

  container.innerHTML = "";
  container.innerHTML = `<div id="printHeader" style="display:none; text-align:center; font-weight:bold; font-size:24px; margin-bottom:10px;"></div>`;

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

  // 8th Page: Legend
  const legendItem = document.createElement("div");
  legendItem.className = "grid-item legend-container";
  legendItem.id = "mainLegendPage";
  container.appendChild(legendItem);
  updateLegendPage();
}

function updateLegendPage() {
  const legendItem = document.getElementById("mainLegendPage");
  if (!legendItem) return;

  const typeText =
    currentTab === "max" ? "Maximum Temperature" : "Minimum Temperature";
  const scales = getScaleData(currentSeason, currentTab);

  let legendHtml = `<div class="legend-title" style="font-size:3em; padding:10px; text-align:center; white-space:nowrap; margin-top:10px;">LEGEND / संकेत</div>`;

  legendHtml += `<div class="legend-section" style="padding:10px 30px; display:flex; flex-direction:column; justify-content:center; flex-grow:1; height:100%; overflow:hidden;"><strong style="font-size: 2.5em; margin-bottom: 20px; display:block; text-align:center; white-space:nowrap;">${typeText} (${currentSeason})</strong><div style="display:grid; grid-template-columns: max-content max-content; justify-content: center; gap: 15px 100px; align-items: center; align-content: center;">`;

  // Reverse to show highest on top
  [...scales].reverse().forEach((l) => {
    legendHtml += `<div class="legend-item" style="font-size:35px; display:flex; align-items:center;"><div class="color-box" style="width:60px; height:60px; background:${l.color}; border:1px solid #333; margin-right: 20px; flex-shrink:0;"></div><span style="white-space:nowrap;">${l.label} °C</span></div>`;
  });
  legendHtml += `</div></div>`;

  legendItem.innerHTML = legendHtml;
}

function updateLegends() {
  maps.forEach((map, index) => {
    const oldLegend = document.getElementById(`legend-map-${index}`);
    if (oldLegend) {
      oldLegend.remove();
    }
    addLegendToMap(map, index);
  });
}

function addLegendToMap(map, index) {
  const legend = L.control({ position: "topright" });
  legend.onAdd = function (map) {
    const div = L.DomUtil.create("div", "info legend map-legend-box");
    div.id = `legend-map-${index}`;
    div.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
    div.style.padding = "10px";
    div.style.borderRadius = "5px";
    div.style.boxShadow = "0 0 15px rgba(0,0,0,0.2)";
    div.style.fontSize = "18px";
    div.style.lineHeight = "1.2";
    div.style.transformOrigin = "top right";

    const scales = getScaleData(currentSeason, currentTab);
    let html = `<strong style="display:block; margin-bottom:10px; text-align:center; font-size:1.2em;">${
      currentTab === "max" ? "Max" : "Min"
    } Temp (°C)</strong>`;
    html += `<div style="display:grid; grid-template-columns: 1fr 1fr; gap: 5px 15px;">`;
    [...scales].reverse().forEach((item) => {
      html += `
                <div class="imd-legend-item">
                    <span class="imd-color-box" style="background:${item.color};"></span>
                    <span>${item.label}</span>
                </div>
            `;
    });
    html += `</div>`;

    div.innerHTML = html;
    L.DomEvent.disableClickPropagation(div);
    return div;
  };
  legend.addTo(map);
}

function getScaleData(season, type) {
  if (season === "Winter") {
    if (type === "min") {
      return [
        { label: "0 – 2", color: "#6A00A8" },
        { label: "2 – 4", color: "#4B00FF" },
        { label: "4 – 6", color: "#007BFF" },
        { label: "6 – 8", color: "#00C8C8" },
        { label: "8 – 10", color: "#00E676" },
        { label: "10 – 12", color: "#00C853" },
        { label: "12 – 14", color: "#7CFC00" },
        { label: "14 – 16", color: "#CDDC39" },
        { label: "16 – 18", color: "#FFD54F" },
        { label: "18 – 20", color: "#FF9800" },
        { label: "20 – 22", color: "#F44336" },
        { label: "> 22", color: "#E91E63" },
      ];
    } else {
      // Winter Max
      return [
        { label: "12 – 14", color: "#6A00A8" },
        { label: "14 – 16", color: "#4B00FF" },
        { label: "16 – 18", color: "#007BFF" },
        { label: "18 – 20", color: "#00C8C8" },
        { label: "20 – 22", color: "#00E676" },
        { label: "22 – 24", color: "#00C853" },
        { label: "24 – 26", color: "#7CFC00" },
        { label: "26 – 28", color: "#CDDC39" },
        { label: "28 – 30", color: "#FFD54F" },
        { label: "30 – 32", color: "#FF9800" },
        { label: "32 – 34", color: "#F44336" },
        { label: "> 34", color: "#E91E63" },
      ];
    }
  } else {
    // Summer
    if (type === "min") {
      return [
        { label: "10 – 12", color: "#6A00A8" },
        { label: "12 – 14", color: "#4B00FF" },
        { label: "14 – 16", color: "#007BFF" },
        { label: "16 – 18", color: "#00C8C8" },
        { label: "18 – 20", color: "#00E676" },
        { label: "20 – 22", color: "#00C853" },
        { label: "22 – 24", color: "#7CFC00" },
        { label: "24 – 26", color: "#CDDC39" },
        { label: "26 – 28", color: "#FFD54F" },
        { label: "28 – 30", color: "#FF9800" },
        { label: "30 – 32", color: "#F44336" },
        { label: "> 32", color: "#E91E63" },
      ];
    } else {
      // Summer Max
      return [
        { label: "24 – 26", color: "#6A00A8" },
        { label: "26 – 28", color: "#4B00FF" },
        { label: "28 – 30", color: "#007BFF" },
        { label: "30 – 32", color: "#00C8C8" },
        { label: "32 – 34", color: "#00E676" },
        { label: "34 – 36", color: "#00C853" },
        { label: "36 – 38", color: "#7CFC00" },
        { label: "38 – 40", color: "#CDDC39" },
        { label: "40 – 42", color: "#FFD54F" },
        { label: "42 – 45", color: "#FF9800" },
        { label: "45 – 47", color: "#F44336" },
        { label: "> 47", color: "#E91E63" },
      ];
    }
  }
}

function initMaps() {
  maps = [];
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

function loadShapefile() {
  const basePath = "data/Bihar_Districts_Shapefile/Bihar";

  if (typeof shp === "undefined") {
    console.error("shpjs library not loaded");
    setAllMapsLayer("street");
    return;
  }

  const candidates = [
    "data/Bihar_Districts_Shapefile/Bihar",
    "data/Bihar_Districts_Shapefile/bihar",
    "Data/Bihar_Districts_Shapefile/Bihar",
    "Data/Bihar_Districts_Shapefile/bihar",
    "data/bihar_districts_shapefile/bihar",
    "data/bihar_districts_shapefile/Bihar",
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
      console.error("Shapefile load error:", e);
      // Only alert if it's a critical failure preventing usage
      console.warn(
        "Map Shapefile failed to load. Switching to Street View. Error: " +
          e.message,
      );
      // alert("Map Shapefile failed to load. Error: " + e.message); // Uncomment for debugging
      setAllMapsLayer("street"); // Fallback
    });
}

function addGeoJsonToMap(map, geojson, index) {
  const layer = L.geoJSON(geojson, {
    style: (feature) =>
      getFeatureStyle(String(feature.properties.OBJECTID), index),
    onEachFeature: (feature, layer) => {
      const oid = String(feature.properties.OBJECTID);
      const dataArr = currentTab === "max" ? weeklyData.max : weeklyData.min;
      const distData = dataArr[index][oid];

      let label = feature.properties.D_NAME;

      layer.bindTooltip(label, {
        permanent: true,
        direction: "center",
        className: "map-label",
        offset: [0, 0],
      });
    },
  }).addTo(map);

  addLegendToMap(map, index);
  if (layer.getLayers().length > 0) {
    map.fitBounds(layer.getBounds(), { padding: [0, 0] });
  }
}

function getFeatureStyle(oid, dayIndex) {
  const dataArr = currentTab === "max" ? weeklyData.max : weeklyData.min;
  const distData = dataArr[dayIndex] ? dataArr[dayIndex][oid] : null;

  let fillColor = getDistrictRegionColor(oid); // Default to region color
  let fillOpacity = 0.2;

  if (distData && distData.val !== undefined) {
    fillColor = getTempColor(distData.val, currentTab);
    fillOpacity = 0.8;
  }

  return {
    fillColor: fillColor,
    weight: 1,
    opacity: 1,
    color: "#333",
    fillOpacity: fillOpacity,
  };
}

function getTempColor(val, type) {
  const scales = getScaleData(currentSeason, type);

  for (const item of scales) {
    if (item.label.includes(">")) {
      const limit = parseFloat(item.label.replace(">", "").trim());
      if (val > limit) return item.color;
    } else {
      const parts = item.label.split("–");
      if (parts.length === 2) {
        const min = parseFloat(parts[0].trim());
        const max = parseFloat(parts[1].trim());
        if (val >= min && val < max) return item.color;
      }
    }
  }
  return "#ffffff";
}

// Export Functions
async function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p", "mm", "a2");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const headerText = document.getElementById("mainHeaderTitle").innerText;

  const btn = document.querySelector("button[onclick='downloadPDF()']");
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';

  try {
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

    const typeStr = currentTab === "max" ? "Maximum" : "Minimum";
    const year = baseDate.getFullYear();
    const month = String(baseDate.getMonth() + 1).padStart(2, "0");
    const day = String(baseDate.getDate()).padStart(2, "0");
    doc.save(`Temperature_Forecast_${typeStr}_${year}-${month}-${day}.pdf`);
  } catch (e) {
    console.error("PDF Export Error:", e);
    alert("Error generating PDF.");
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
      const fileName = isMap ? `Temp_Day_${i + 1}.png` : `Temp_Legend.png`;
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
      map.setView([25.6, 85.6], 6);
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
window.toggleLayoutEdit = toggleLayoutEdit;

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

function toggleBodyAnimation() {
  document.body.classList.toggle("animated-bg");
}
window.toggleBodyAnimation = toggleBodyAnimation;
function updatePageBackground(color) {
  document.body.style.background = color;
}
window.updatePageBackground = updatePageBackground;

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

async function generateCompositeImage() {
  const items = document.querySelectorAll(".grid-item");
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
    const canvas = await generateCompositeImage();
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      const typeStr = currentTab === "max" ? "Maximum" : "Minimum";
      link.download = `Temperature_Forecast_${typeStr}_Grid_${new Date().toISOString().split("T")[0]}.png`;
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
    const canvas = await generateCompositeImage();
    if (canvas) {
      const key =
        currentTab === "max"
          ? "bihar_max_temp_forecast_image"
          : "bihar_min_temp_forecast_image";

      // Clear previous image to free up space immediately
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.warn("Could not clear old image", e);
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

        // Try higher quality first, then lower
        let quality = 0.95;
        while (quality > 0.4 && !saved) {
          try {
            const dataUrl = exportCanvas.toDataURL("image/jpeg", quality);
            localStorage.setItem(key, dataUrl);
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
