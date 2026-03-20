// js/advancedDraw.js
// 1️⃣ ADVANCED POLYGON WARNING SYSTEM

const drawnItems = new L.FeatureGroup();
let drawControlInstance = null;
let currentlySelectedPolygon = null;

function initAdvancedDraw() {
  if (typeof map === "undefined" || map === null) {
    setTimeout(initAdvancedDraw, 500);
    return;
  }

  map.addLayer(drawnItems);

  drawControlInstance = new L.Control.Draw({
    edit: {
      featureGroup: drawnItems,
      remove: true,
    },
    draw: {
      polygon: {
        allowIntersection: false,
        drawError: {
          color: "#e1e100",
          message: "<strong>Error:</strong> shape edges cannot cross!",
        },
        shapeOptions: { color: "#ffeb3b", weight: 3 },
      },
      rectangle: { shapeOptions: { color: "#ffeb3b", weight: 3 } },
      circle: false,
      marker: false,
      circlemarker: false,
      polyline: false,
    },
  });

  map.addControl(drawControlInstance);

  // Handle Polygon Creation
  map.on(L.Draw.Event.CREATED, function (e) {
    const type = e.layerType;
    const layer = e.layer;

    // Get initial properties from Global UI States
    const colorMap = {
      yellow: "#ffeb3b",
      orange: "#ff9800",
      red: "#f44336",
      green: "#4caf50",
    };
    let sLevel =
      typeof selectedWarningLevel !== "undefined"
        ? selectedWarningLevel
        : "yellow";
    const selectedColor = colorMap[sLevel] || "#ffeb3b";

    const phenomena =
      typeof selectedPhenomena !== "undefined" ? [...selectedPhenomena] : [];

    // Apply Styling
    layer.setStyle({
      fillColor: selectedColor,
      color: selectedColor,
      weight: 3,
      fillOpacity: 0.6,
    });

    // Store Metadata
    layer.feature = layer.feature || { type: "Feature", properties: {} };
    layer.feature.properties.warningColor = selectedColor;
    layer.feature.properties.phenomena = phenomena;
    layer.feature.properties.id = "warning_poly_" + new Date().getTime();

    updatePolygonPopup(layer);

    layer.on("click", function (ev) {
      L.DomEvent.stopPropagation(ev);
      selectPolygon(layer);
    });

    drawnItems.addLayer(layer);
    selectPolygon(layer); // Auto select upon drawing

    // Turf.js Intersection Check: Automatically select districts covered by the polygon
    if (typeof turf !== "undefined" && typeof districtLayers !== "undefined") {
      try {
        const drawnGeoJSON = layer.toGeoJSON();
        for (const districtId in districtLayers) {
          const distLayer = districtLayers[districtId];
          if (distLayer.feature) {
            // Check if polygon intersects with district geometry
            const intersects = turf.booleanIntersects(
              drawnGeoJSON,
              distLayer.feature,
            );
            if (intersects) {
              const idNum = parseInt(districtId);
              if (!selectedDistricts.includes(idNum)) {
                toggleDistrict(idNum, true); // true = skip individual zoom
              }
            }
          }
        }
      } catch (err) {
        console.warn("Intersection error:", err);
      }
    }

    // Auto-zoom to newly drawn items
    const autoZoomCb = document.getElementById("autoZoomToggle");
    if (autoZoomCb && autoZoomCb.checked) {
      map.fitBounds(drawnItems.getBounds(), { padding: [30, 30] });
    }
  });

  // Deselect on map click
  map.on("click", function () {
    deselectPolygon();
  });
}

function selectPolygon(layer) {
  deselectPolygon();
  currentlySelectedPolygon = layer;
  // Highlight Selection
  layer.setStyle({ weight: 5, color: "#000", dashArray: "5, 5" });
  updatePolygonPopup(layer);
}

function deselectPolygon() {
  if (currentlySelectedPolygon) {
    const color = currentlySelectedPolygon.feature.properties.warningColor;
    currentlySelectedPolygon.setStyle({
      weight: 3,
      color: color,
      dashArray: null,
    });
    currentlySelectedPolygon = null;
  }
}

function updatePolygonPopup(layer) {
  const props = layer.feature.properties;
  let levelName = "Yellow Warning";
  if (props.warningColor === "#ff9800") levelName = "Orange Warning";
  if (props.warningColor === "#f44336") levelName = "Red Warning";

  let phenomenaText = "None Selected";
  if (props.phenomena && props.phenomena.length > 0) {
    // map raw ids to readable names for the popup
    phenomenaText = props.phenomena
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1).replace("_", " "))
      .join(", ");
  }

  const popupContent = `
      <div style="font-size:14px;">
          <h4 style="margin:0 0 5px 0; color:${props.warningColor}; text-shadow:1px 1px 1px #000;">${levelName}</h4>
          <strong>Phenomena:</strong><br>
          ${phenomenaText}<br>
          <small style="color:gray; display:block; margin-top:5px;">Polygons are editable.</small>
      </div>
  `;
  layer.bindPopup(popupContent);
}

// Hook into Global UI actions to auto-update the Selected Polygon
const origSelectWarningLevel = window.selectWarningLevel;
window.selectWarningLevel = function (level) {
  if (origSelectWarningLevel) origSelectWarningLevel(level);
  if (currentlySelectedPolygon) {
    const colorMap = {
      yellow: "#ffeb3b",
      orange: "#ff9800",
      red: "#f44336",
      green: "#4caf50",
    };
    const newColor = colorMap[level];
    currentlySelectedPolygon.feature.properties.warningColor = newColor;
    // keep highlight border #000 while selected, just change fill
    currentlySelectedPolygon.setStyle({ fillColor: newColor });
    updatePolygonPopup(currentlySelectedPolygon);
  }
};

const origTogglePhenomena = window.togglePhenomena;
window.togglePhenomena = function (id) {
  if (origTogglePhenomena) origTogglePhenomena(id);
  if (currentlySelectedPolygon) {
    currentlySelectedPolygon.feature.properties.phenomena = [
      ...selectedPhenomena,
    ];
    updatePolygonPopup(currentlySelectedPolygon);
  }
};

document.addEventListener("DOMContentLoaded", function () {
  initAdvancedDraw();
});
