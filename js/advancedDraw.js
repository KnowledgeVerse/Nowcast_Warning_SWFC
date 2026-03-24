// js/advancedDraw.js
// 1️⃣ ADVANCED POLYGON WARNING SYSTEM

const drawnItems = new L.FeatureGroup();
let drawControlInstance = null;
let currentlySelectedPolygon = null;

// Buffer Rings Handlers
window.toggleWarningRings = function (enabled) {
  if (!enabled) {
    // Remove all generated rings
    const layersToRemove = [];
    drawnItems.eachLayer((layer) => {
      if (layer.feature?.properties?.generatedRing) {
        layersToRemove.push(layer);
      }
    });
    layersToRemove.forEach((l) => drawnItems.removeLayer(l));
  } else {
    // Regenerate for all base polygons
    drawnItems.eachLayer((layer) => {
      if (
        layer.feature?.properties?.id &&
        !layer.feature.properties.generatedRing
      ) {
        let level = "yellow";
        if (layer.feature.properties.warningColor === "#ff9800")
          level = "orange";
        if (layer.feature.properties.warningColor === "#f44336") level = "red";
        createWarningRings(layer, level);
        layer.bringToFront();
      }
    });
  }
};

// Keep old alias for safety
window.updateAllRings = function () {
  if (typeof applyRingSettingsFromUI === "function") {
    applyRingSettingsFromUI();
  }
};

// --- NEW: Dynamic Ring Sync & Settings Application ---
window.syncStretchSliderWithDirection = function () {
  if (!currentlySelectedPolygon) return;
  const props = currentlySelectedPolygon.feature.properties;
  let config = null;

  if (props.generatedRing) {
    let parentLayer = null;
    drawnItems.eachLayer((l) => {
      if (l.feature?.properties?.id === props.parentPolygonId) parentLayer = l;
    });
    if (parentLayer && parentLayer.feature.properties.ringConfigs) {
      config = parentLayer.feature.properties.ringConfigs[props.ringType];
    }
  } else if (props.ringConfigs) {
    config = props.ringConfigs["ring_yellow_outer"]; // Fallback for parent
  }

  const dir = document.getElementById("ringDirectionSelect").value;
  const stretchSlider = document.getElementById("ringStretchSlider");

  if (
    config &&
    dir !== "center" &&
    config.stretches &&
    config.stretches[dir] !== undefined
  ) {
    stretchSlider.value = config.stretches[dir];
  } else {
    stretchSlider.value = 0;
  }
  document.getElementById("ringStretchVal").innerText =
    stretchSlider.value + "x";
};

window.updateRingControlsUI = function (layer) {
  if (!layer) return;
  let config = null;
  const props = layer.feature.properties;

  if (props.generatedRing) {
    let parentLayer = null;
    drawnItems.eachLayer((l) => {
      if (l.feature?.properties?.id === props.parentPolygonId) parentLayer = l;
    });
    if (parentLayer && parentLayer.feature.properties.ringConfigs) {
      config = parentLayer.feature.properties.ringConfigs[props.ringType];
    }
  } else if (props.ringConfigs) {
    config = props.ringConfigs["ring_yellow_outer"];
  }

  if (config) {
    const sizeSlider = document.getElementById("ringSizeSlider");
    const smoothSlider = document.getElementById("ringSmoothnessSlider");
    if (sizeSlider) {
      sizeSlider.value = config.size;
      document.getElementById("ringSizeVal").innerText = config.size + "x";
    }
    if (smoothSlider) {
      smoothSlider.value = config.smoothness;
    }
    if (typeof syncStretchSliderWithDirection === "function")
      syncStretchSliderWithDirection();
  }
};

window.applyRingSettingsFromUI = function () {
  const size = parseFloat(
    document.getElementById("ringSizeSlider")?.value || 1.0,
  );
  const dir = document.getElementById("ringDirectionSelect")?.value || "center";
  const stretch = parseFloat(
    document.getElementById("ringStretchSlider")?.value || 0.6,
  );
  const smoothness = parseInt(
    document.getElementById("ringSmoothnessSlider")?.value || 32,
  );
  const isMulti = document.getElementById("multiStretchToggle")?.checked;

  const updateConfig = (config) => {
    config.size = size;
    config.smoothness = smoothness;
    if (!isMulti) {
      config.stretches = {}; // clear others if not multi
    }
    if (dir !== "center") {
      if (stretch > 0) config.stretches[dir] = stretch;
      else delete config.stretches[dir];
    }
  };

  if (currentlySelectedPolygon) {
    const props = currentlySelectedPolygon.feature.properties;
    if (props.generatedRing) {
      // Update ONLY the individual ring selected
      const parentId = props.parentPolygonId;
      let parentLayer = null;
      drawnItems.eachLayer((l) => {
        if (l.feature?.properties?.id === parentId) parentLayer = l;
      });
      if (parentLayer) {
        if (!parentLayer.feature.properties.ringConfigs)
          parentLayer.feature.properties.ringConfigs = {};
        if (!parentLayer.feature.properties.ringConfigs[props.ringType]) {
          parentLayer.feature.properties.ringConfigs[props.ringType] = {
            size: 1.0,
            smoothness: 32,
            stretches: {},
          };
        }
        updateConfig(
          parentLayer.feature.properties.ringConfigs[props.ringType],
        );

        let level = "yellow";
        if (parentLayer.feature.properties.warningColor === "#ff9800")
          level = "orange";
        if (parentLayer.feature.properties.warningColor === "#f44336")
          level = "red";
        createWarningRings(parentLayer, level);
      }
    } else {
      // Update all rings of selected parent
      if (!props.ringConfigs) props.ringConfigs = {};
      ["ring_yellow_outer", "ring_orange_middle"].forEach((rt) => {
        if (!props.ringConfigs[rt])
          props.ringConfigs[rt] = { size: 1.0, smoothness: 32, stretches: {} };
        updateConfig(props.ringConfigs[rt]);
      });
      let level = "yellow";
      if (props.warningColor === "#ff9800") level = "orange";
      if (props.warningColor === "#f44336") level = "red";
      createWarningRings(currentlySelectedPolygon, level);
    }
  } else {
    // Global update
    drawnItems.eachLayer((layer) => {
      if (
        layer.feature?.properties?.id &&
        !layer.feature.properties.generatedRing
      ) {
        const props = layer.feature.properties;
        if (!props.ringConfigs) props.ringConfigs = {};
        ["ring_yellow_outer", "ring_orange_middle"].forEach((rt) => {
          if (!props.ringConfigs[rt])
            props.ringConfigs[rt] = {
              size: 1.0,
              smoothness: 32,
              stretches: {},
            };
          updateConfig(props.ringConfigs[rt]);
        });
        let level = "yellow";
        if (props.warningColor === "#ff9800") level = "orange";
        if (props.warningColor === "#f44336") level = "red";
        createWarningRings(layer, level);
      }
    });
  }
};

function createWarningRings(parentLayer, warningLevel) {
  const toggle = document.getElementById("enableWarningRingsToggle");
  const isEnabled = toggle ? toggle.checked : true;

  const parentId = parentLayer.feature.properties.id;

  // 1. Remove existing rings for this parent to avoid duplicates
  const layersToRemove = [];
  drawnItems.eachLayer((layer) => {
    if (
      layer.feature?.properties?.generatedRing &&
      layer.feature.properties.parentPolygonId === parentId
    ) {
      layersToRemove.push(layer);
    }
  });
  layersToRemove.forEach((l) => drawnItems.removeLayer(l));

  if (!isEnabled || (warningLevel !== "orange" && warningLevel !== "red"))
    return;
  if (typeof turf === "undefined")
    return console.warn("Turf.js not found. Cannot generate warning rings.");

  try {
    const geojson = parentLayer.toGeoJSON();
    const bounds = parentLayer.getBounds();
    const diagonalKm =
      map.distance(bounds.getSouthWest(), bounds.getNorthEast()) / 1000;

    // Initialize blank config storage if not present
    if (!parentLayer.feature.properties.ringConfigs) {
      parentLayer.feature.properties.ringConfigs = {
        ring_yellow_outer: { size: 1.0, smoothness: 32, stretches: {} },
        ring_orange_middle: { size: 1.0, smoothness: 32, stretches: {} },
      };
    }

    // Helper to generate and attach a specific ring type
    const addRingToMap = (baseRadius, colorHex, opacity, ringType) => {
      let config = parentLayer.feature.properties.ringConfigs[ringType];
      if (!config) {
        config = { size: 1.0, smoothness: 32, stretches: {} };
        parentLayer.feature.properties.ringConfigs[ringType] = config;
      }

      const actualRadius = baseRadius * config.size;

      let bufferedGeoJSON = turf.buffer(geojson, actualRadius, {
        units: "kilometers",
        steps: config.smoothness,
      });

      if (!bufferedGeoJSON) return;

      // Apply ALL saved stretches for this specific ring
      for (let dir in config.stretches) {
        const angle = parseInt(dir);
        const stretchMultiplier = config.stretches[dir];
        const distance = actualRadius * stretchMultiplier;
        if (distance > 0) {
          const shiftedBuffer = turf.transformTranslate(
            bufferedGeoJSON,
            distance,
            angle,
            { units: "kilometers" },
          );
          try {
            bufferedGeoJSON = turf.union(bufferedGeoJSON, shiftedBuffer);
          } catch (e) {
            console.warn("Turf union failed:", e);
            bufferedGeoJSON = shiftedBuffer;
          }
        }
      }

      const tempLayer = L.geoJSON(bufferedGeoJSON);
      tempLayer.eachLayer((layer) => {
        layer.setStyle({
          color: colorHex,
          fillColor: colorHex,
          weight: 3,
          fillOpacity: opacity,
          dashArray: null,
        });
        layer.feature = layer.feature || { type: "Feature", properties: {} };
        layer.feature.properties = {
          warningColor: colorHex,
          generatedRing: true,
          parentPolygonId: parentId,
          ringType: ringType,
          phenomena: [...(parentLayer.feature.properties.phenomena || [])],
          id: "ring_poly_" + new Date().getTime() + Math.random(),
        };

        // Re-apply selection style automatically if this ring was previously selected
        if (
          currentlySelectedPolygon &&
          currentlySelectedPolygon.feature?.properties?.ringType === ringType &&
          currentlySelectedPolygon.feature?.properties?.parentPolygonId ===
            parentId
        ) {
          layer.setStyle({ weight: 5, color: "#000", dashArray: "5, 5" });
          currentlySelectedPolygon = layer;
        }

        layer.on("click", function (ev) {
          L.DomEvent.stopPropagation(ev);
          selectPolygon(layer);
        });
        updatePolygonPopup(layer);
        drawnItems.addLayer(layer);
      });
    };

    if (warningLevel === "orange") {
      addRingToMap(diagonalKm * 0.1, "#ffeb3b", 0.45, "ring_yellow_outer");
    } else if (warningLevel === "red") {
      addRingToMap(diagonalKm * 0.2, "#ffeb3b", 0.45, "ring_yellow_outer");
      addRingToMap(diagonalKm * 0.1, "#ff9800", 0.6, "ring_orange_middle");
    }

    // Ensure parent stays on top of the newly generated rings
    parentLayer.bringToFront();
  } catch (e) {
    console.error("Error generating warning rings:", e);
  }
}

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
      fillOpacity: 0.8, // Make the inner polygon the darkest/most solid
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

    // Automatically create buffer rings if applicable
    createWarningRings(layer, sLevel);
    layer.bringToFront();

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
  if (typeof updateRingControlsUI === "function") updateRingControlsUI(layer);
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

  const customText = props.customText || "";

  const popupContent = `
      <div style="font-size:14px; min-width: 200px;">
          <h4 style="margin:0 0 5px 0; color:${props.warningColor}; text-shadow:1px 1px 1px #000;">${levelName}</h4>
          <strong>Phenomena:</strong><br>
          ${phenomenaText}<br>
          <div style="margin-top: 10px; margin-bottom: 10px;">
              <label style="font-size: 12px; font-weight: bold;">Name/Text (नाम):</label>
              <input type="text" value="${customText}" oninput="if(typeof updatePolygonText === 'function') updatePolygonText(this.value)" style="width: 100%; padding: 4px; border: 1px solid #ccc; border-radius: 4px; margin-top: 2px; font-size: 12px;" placeholder="Enter custom name...">
          </div>
          <button onclick="if(typeof deleteSelectedPolygon === 'function') deleteSelectedPolygon()" style="background: #dc3545; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; width: 100%; font-weight: bold;"><i class="fas fa-trash"></i> Delete Polygon</button>
      </div>
  `;
  layer.bindPopup(popupContent);
}

// Update Custom Text dynamically
window.updatePolygonText = function (text) {
  if (currentlySelectedPolygon && currentlySelectedPolygon.feature) {
    currentlySelectedPolygon.feature.properties.customText = text;
    if (text.trim() !== "") {
      currentlySelectedPolygon.bindTooltip(text, {
        permanent: true,
        direction: "center",
        className: "map-label",
      });
    } else {
      currentlySelectedPolygon.unbindTooltip();
    }
  }
};

// Delete currently selected polygon and its rings
window.deleteSelectedPolygon = function () {
  if (currentlySelectedPolygon) {
    // Ensure if we delete a ring, it deletes the parent base and all sibling rings too
    const parentId =
      currentlySelectedPolygon.feature.properties.parentPolygonId ||
      currentlySelectedPolygon.feature.properties.id;
    const layersToRemove = [];
    drawnItems.eachLayer((layer) => {
      if (
        layer.feature?.properties?.id === parentId ||
        layer.feature?.properties?.parentPolygonId === parentId
      ) {
        layersToRemove.push(layer);
      }
    });
    layersToRemove.forEach((l) => drawnItems.removeLayer(l));
    currentlySelectedPolygon = null;
    map.closePopup();
  }
};

// Clear all polygons
window.clearAllPolygons = function () {
  if (
    confirm(
      "Are you sure you want to clear all drawn polygons? / क्या आप सभी पॉलीगॉन हटाना चाहते हैं?",
    )
  ) {
    drawnItems.clearLayers();
    currentlySelectedPolygon = null;
  }
};

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

    // Regenerate rings when base polygon color changes
    createWarningRings(currentlySelectedPolygon, level);
    currentlySelectedPolygon.bringToFront();
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

window.exportPolygonsToGeoJSON = function () {
  if (
    typeof drawnItems === "undefined" ||
    drawnItems.getLayers().length === 0
  ) {
    alert(
      "No polygons drawn on the map to export. Please draw polygons first.",
    );
    return;
  }

  // एक्सपोर्ट करते समय सिर्फ मुख्य पॉलीगॉन लें, जनरेट की गई वार्निंग रिंग्स को हटा दें
  const geojson = {
    type: "FeatureCollection",
    features: [],
  };

  drawnItems.eachLayer((layer) => {
    // जो लेयर रिंग नहीं है, सिर्फ उसे ही एक्सपोर्ट करें (Warning Level properties के साथ)
    if (layer.feature && !layer.feature.properties.generatedRing) {
      geojson.features.push(layer.toGeoJSON());
    }
  });

  if (geojson.features.length === 0) {
    alert(
      "No base polygons found to export. / एक्सपोर्ट करने के लिए कोई पॉलीगॉन नहीं है।",
    );
    return;
  }

  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(geojson, null, 2));
  const downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute(
    "download",
    "warning_polygons_" + new Date().getTime() + ".geojson",
  );
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

window.importPolygonsFromGeoJSON = function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const geojson = JSON.parse(e.target.result);

      L.geoJSON(geojson, {
        style: function (feature) {
          const props = feature.properties || {};
          const color = props.warningColor || "#ffeb3b";
          const isRing = props.generatedRing;
          const opacity = isRing ? (color === "#ffeb3b" ? 0.45 : 0.6) : 0.8;

          return {
            fillColor: color,
            color: color,
            weight: 3,
            fillOpacity: opacity,
            dashArray: null,
          };
        },
        onEachFeature: function (feature, layer) {
          layer.feature = feature;
          layer.on("click", function (ev) {
            L.DomEvent.stopPropagation(ev);
            selectPolygon(layer);
          });
          updatePolygonPopup(layer);
          drawnItems.addLayer(layer);

          // यदि इसमें पहले से कस्टम नाम/टेक्स्ट था तो उसे भी वापस दिखाएँ
          if (feature.properties.customText) {
            layer.bindTooltip(feature.properties.customText, {
              permanent: true,
              direction: "center",
              className: "map-label",
            });
          }

          // यदि रिंग्स टॉगल ऑन है, तो इम्पोर्ट किये गए पॉलीगॉन्स पर भी अपने आप रिंग्स बन जाएँगी
          const toggle = document.getElementById("enableWarningRingsToggle");
          if (toggle && toggle.checked && !feature.properties.generatedRing) {
            let level = "yellow";
            if (feature.properties.warningColor === "#ff9800") level = "orange";
            if (feature.properties.warningColor === "#f44336") level = "red";
            createWarningRings(layer, level);
          }
        },
      });

      if (drawnItems.getLayers().length > 0) {
        map.fitBounds(drawnItems.getBounds(), { padding: [30, 30] });
      }
    } catch (err) {
      console.error("Error importing GeoJSON:", err);
      alert("Invalid GeoJSON file. / गलत GeoJSON फ़ाइल।");
    }
  };
  reader.readAsText(file);
  event.target.value = ""; // Reset input so the same file can be loaded again if needed
};

document.addEventListener("DOMContentLoaded", function () {
  initAdvancedDraw();
});
