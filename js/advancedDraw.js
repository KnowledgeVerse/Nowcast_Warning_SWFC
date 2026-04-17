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
    // Recalculate block report
    if (typeof updateBlockReport === "function") updateBlockReport();
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
    // Recalculate block report
    if (typeof updateBlockReport === "function") updateBlockReport();
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
    // Recalculate block report
    if (typeof updateBlockReport === "function") updateBlockReport();
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

// ============================================================================
// ================== ADVANCED BLOCK DETECTION & REPORTING ====================
// ============================================================================

// Feature 10 & 11: Smart Field Detection
window.blockHindiMap = {
  // Legacy Aliases & Variations
  Phulwari: "फुलवारी",
  Phulwarisharif: "फुलवारी शरीफ",
  BodHgaya: "बोधगया",
  Sadar: "सदर",
  "Akorhi Gola": "अकोढ़ी गोला",
  Bhabua: "भभुआ",
  Karghar: "करगहर",

  // Missing / Extra Variations from GeoJSON Data
  Darbhanga: "दरभंगा",
  "Chanan*": "चानन",
  "Gaya Town C.D. Block": "गया नगर प्रखंड",
  "Gaya Town C.D.Block": "गया नगर प्रखंड",
  Warisaliganj: "वारिसलीगंज",
  "Kashi Chak": "काशीचक",
  Kawakol: "कौवाकोल",
  Sidhaw: "सिधाव",
  Mainatanr: "मैनाटांड़",
  Bagaha: "बगहा",
  Thakrahan: "ठकराहाँ",
  Narkatia: "नरकटिया",
  Chiraia: "चिरैया",
  "Chakia (Pipra)": "चकिया (पिपरा)",
  "Chakia(Pipra)": "चकिया (पिपरा)",
  "Pakri Dayal": "पकड़ी दयाल",
  Piprarhi: "पिपराही",
  "Tariani Chowk": "तरियानी चौक",
  Runisaidpur: "रून्नीसैदपुर",
  Charaut: "चरौत",
  Laukaha: "लौकाहा",
  Bisfi: "बिस्फी",
  Ghoghardiha: "घोघरडीहा",
  Tribeniganj: "त्रिवेणीगंज",
  Kursakatta: "कुर्साकांटा",
  Kochadhamin: "कोचाधामन",
  "Krityanand Nagar": "कृत्यानंद नगर",
  Baisi: "बैसी",
  Ghailarh: "घैलाढ़",
  Shankarpur: "शंकरपुर",
  "Satar Kataiya": "सत्तर कटैया",
  Kahara: "कहरा",
  Keotiranway: "केवटी रणवे",
  Hanumannagar: "हनुमाननगर",
  "Kusheshwar Asthan Purbi": "कुशेश्वरस्थान पूर्वी",
  "Baruraj (Motipur)": "बरूराज (मोतिपुर)",
  Bochaha: "बोचहां",
  "Dholi (Moraul)": "ढोली (मोरौल)",
  Musahri: "मुशहरी",
  Katiya: "कटेया",
  Bijaipur: "विजयीपुर",
  "Pach Deuri": "पचदेवरी",
  Phulwaria: "फुलवरिया",
  Siwan: "सिवान",
  Goriakothi: "गोरेयाकोठी",
  Daraundha: "दरौंधा",
  Ishupur: "ईशुपुर",
  Dariapur: "दरियापुर",
  "Paterhi Belsar": "पातेढ़ी बेलसर",
  "Raja Pakar": "राजापाकर",
  "Sahdai Buzurg": "सहदई बुजुर्ग",
  Samastipur: "समस्तीपुर",
  Mohiuddinagar: "मोहिउद्दीननगर",
  Bibhutpur: "विभूतिपुर",
  Khudabandpur: "खुदावंदपुर",
  Chhorahi: "छौराही",
  Colgong: "कहलगांव",
  Sonhaula: "सोनहौला",
  Dhuraiya: "धोरैया",
  Phulidumar: "फुलीडुमर",
  Bausi: "बौंसी",
  Munger: "मुंगेर",
  "Tetiha Bambor": "टेटिया बंबोर",
  Barahiya: "बरहिया",
  Chanan: "चानन",
  "Ghat Kusumbha": "घट कुसुम्भा",
  "Nagar Nausa": "नगर नौसा",
  Bihar: "बिहार (बिहारशरीफ)",
  Parbalpur: "परबलपुर",
  Giriak: "गिरियक",
  "Dinapur-Cum-Khagaul": "दानापुर-खगौल",
  "Patna Rural": "पटना ग्रामीण",
  Daniawan: "दनियावां",
  Bakhtiarpur: "बख्तियारपुर",
  Mokameh: "मोकामा",
  "Udwant Nagar": "उदवंत नगर",
  Behea: "बिहिया",
  Barhampur: "बरहमपुर",
  Konch: "कोंच",
  Khizirsarai: "खिजरसराय",
  "Neem Chak Bathani": "नीमचक बथानी",
  Muhra: "मोहड़ा",
  "Banke Bazar": "बांके बाजार",
  "Tan Kuppa": "टंकुप्पा",
  "Islamnagar Aliganj": "इस्लामनगर अलीगंज",
  Lakshmipur: "लक्ष्मीपुर",
  Ghoshi: "घोसी",

  // 1. Patna (पटना)
  "Patna Sadar": "पटना सदर",
  "Phulwari Sharif": "फुलवारी शरीफ",
  Danapur: "दानापुर",
  Bihta: "बिहटा",
  Maner: "मनेर",
  Naubatpur: "नौबतपुर",
  Bikram: "बिक्रम",
  Paliganj: "पालीगंज",
  "Dulhin Bazar": "दुल्हिन बाजार",
  Masaurhi: "मसौढ़ी",
  Punpun: "पुनपुन",
  Dhanarua: "धनरुआ",
  Fatwah: "फतुहा",
  Daniyawan: "दनियावां",
  Khusrupur: "खुसरूपुर",
  Bakhtiyarpur: "बख्तियारपुर",
  Athmalgola: "अथमलगोला",
  Mokama: "मोकामा",
  Belchhi: "बेलछी",
  Ghoswari: "घोसवरी",
  Pandarak: "पंडारक",
  Barh: "बाढ़",
  Sampatchak: "संपतचक",

  // 2. Bhojpur (भोजपुर)
  Arrah: "आरा",
  Udwantnagar: "उदवंतनगर",
  Jagdishpur: "जगदीशपुर",
  Koilwar: "कोईलवर",
  Sahar: "सहार",
  Barhara: "बड़हरा",
  Sandesh: "संदेश",
  Shahpur: "शाहपुर",
  Charpokhari: "चरपोखरी",
  Piro: "पीरो",
  Tarari: "तरारी",
  Bihiya: "बिहिया",
  Agiaon: "अगियांव",
  Garhani: "गड़हनी",

  // 3. Buxar (बक्सर)
  Buxar: "बक्सर",
  Itarhi: "इटढ़ी",
  Chausa: "चौसा",
  Rajpur: "राजपुर",
  Dumraon: "डुमरांव",
  Nawanagar: "नवानगर",
  Brahampur: "ब्रह्मपुर",
  Kesath: "केसठ",
  Chakki: "चक्की",
  Chaugain: "चौगाईं",
  Simri: "सिमरी",

  // 4. Rohtas (रोहतास)
  Sasaram: "सासाराम",
  Sheosagar: "शिवसागर",
  Chenari: "चेनारी",
  Kargahar: "करगहर",
  Kochas: "कोचस",
  Dinara: "दिनारा",
  Dawath: "दावथ",
  Suryapura: "सूर्यपुरा",
  Bikramganj: "बिक्रमगंज",
  Karakat: "काराकाट",
  Nasriganj: "नासरीगंज",
  Sanjhauli: "संझौली",
  Nokha: "नोखा",
  Akhorigola: "अकोढ़ीगोला",
  Dehri: "डेहरी",
  Tilauthu: "तिलौथू",
  Rohtas: "रोहतास",
  Nauhatta: "नौहट्टा",

  // 5. Kaimur (कैमूर)
  Bhabhua: "भभुआ",
  Ramgarh: "रामगढ़",
  Mohania: "मोहनिया",
  Durgawati: "दुर्गावती",
  Adhaura: "अधौरा",
  Bhagwanpur: "भगवानपुर",
  Chand: "चाँद",
  Chainpur: "चैनपुर",
  Kudra: "कुदरा",
  Rampur: "रामपुर",
  Nuaon: "नुआंव",

  // 6. Nalanda (नालंदा)
  Biharsharif: "बिहारशरीफ",
  Giriyak: "गिरियक",
  Rahui: "रहुई",
  Noorsarai: "नूरसराय",
  Harnaut: "हरनौत",
  Chandi: "चंडी",
  Islampur: "इस्लामपुर",
  Rajgir: "राजगीर",
  Asthawan: "अस्थावां",
  Sarmera: "सरमेरा",
  Hilsa: "हिलसा",
  Ekangarsarai: "एकंगरसराय",
  Ben: "बेन",
  Nagarnausa: "नगरनौसा",
  "Karai Parsurai": "करायपरसुराय",
  Silao: "सिलाव",
  Parwalpur: "परवलपुर",
  Katrisarai: "कतरीसराय",
  Bind: "बिंद",
  Tharthari: "थरथरी",

  // 7. Muzaffarpur (मुजफ्फरपुर)
  Mushahari: "मुशहरी",
  Kanti: "कांटी",
  Motipur: "मोतीपुर",
  Sahebganj: "साहेबगंज",
  Paroo: "पारू",
  Saraiya: "सरैया",
  Marwan: "मड़वन",
  Minapur: "मीनापुर",
  Bochahan: "बोचहाँ",
  Gaighat: "गायघाट",
  Katra: "कटरा",
  Aurai: "औराई",
  Bandra: "बंदरा",
  Sakra: "सकरा",
  Muraul: "मुरौल",
  Kurhani: "कुढ़नी",

  // 8. East Champaran (पूर्वी चम्पारण)
  Motihari: "मोतिहारी",
  Turkaulia: "तुरकौलिया",
  Harsidhi: "हरसिद्धि",
  Paharpur: "पहाड़पुर",
  Areraj: "अरेराज",
  Sangrampur: "संग्रामपुर",
  Kesaria: "केसरिया",
  Kalyanpur: "कल्याणपुर",
  Kotwa: "कोटवा",
  Piprakothi: "पिपराकोठी",
  Chakia: "चकिया",
  Madhuban: "मधुबन",
  Phenhara: "फेनहारा",
  Tetaria: "तेतरिया",
  Pakridayal: "पकड़ीदयाल",
  Patahi: "पताही",
  Dhaka: "ढाका",
  Ghorasahan: "घोड़ासहन",
  Bankatwa: "बनकटवा",
  Adapur: "आदापुर",
  Raxaul: "रक्सौल",
  Ramgarhwa: "रामगढ़वा",
  Sugauli: "सुगौली",
  Banjaria: "बंजरिया",
  Chiraiya: "चिरैया",
  Mehsi: "मेहसी",
  Chauradano: "छौड़ादानो",

  // 9. West Champaran (पश्चिमी चम्पारण)
  Bettiah: "बेतिया",
  Nautan: "नौतन",
  Bairia: "बैरिया",
  Majhaulia: "मझौलिया",
  Chanpatia: "चनपटिया",
  Sikta: "सिकटा",
  Mainatand: "मैनाटांड़",
  Narkatiaganj: "नरकटियागंज",
  Gaunaha: "गौनाहा",
  Lauriya: "लौरिया",
  "Bagaha-1": "बगहा-1",
  "Bagaha-2": "बगहा-2",
  Madhubani: "मधुबनी",
  Bhitaha: "भितहां",
  Piprasi: "पिपरासी",
  Thakraha: "ठकराहा",
  Jogapatti: "जोगापट्टी",
  Ramnagar: "रामनगर",

  // 10. Sitamarhi (सीतामढ़ी)
  Dumra: "डुमरा",
  Bathnaha: "बथनाहा",
  Parihar: "परिहार",
  Bajpatti: "बाजपट्टी",
  Pupri: "पुपरी",
  Nanpur: "नानपुर",
  Runnisaidpur: "रुन्नीसैदपुर",
  Belsand: "बेलसंड",
  Parsauni: "परसौनी",
  Bairgania: "बैरगनिया",
  Riga: "रीगा",
  Suppi: "सुप्पी",
  Majorganj: "मेजरगंज",
  Sonbarsa: "सोनबरसा",
  Choraut: "चोरौत",
  Bokhara: "बोखड़ा",
  Sursand: "सुरसंड",

  // 11. Vaishali (वैशाली)
  Hajipur: "हाजीपुर",
  Bidupur: "बिदुपुर",
  Rajapakar: "राजापाकर",
  Mahnar: "महनार",
  "Sahdei Buzurg": "सहदेई बुजुर्ग",
  Desri: "देसरी",
  Patepur: "पातेपुर",
  Mahua: "महुआ",
  "Chehra Kalan": "चेहराकलां",
  Vaishali: "वैशाली",
  "Patedhi Belsar": "पटेढ़ी बेलसर",
  Lalganj: "लालगंज",
  Goraul: "गोरौल",
  Jandaha: "जंदाहा",
  Raghopur: "राघोपुर",

  // 12. Sheohar (शिवहर)
  Sheohar: "शिवहर",
  Tariyani: "तरीयानी",
  Piprahi: "पिपराही",
  "Dumri Katsari": "डूमरी कटसरी",
  Purnahiya: "पुरनहिया",

  // 13. Gaya (गया)
  "Gaya Sadar": "गया सदर",
  "Bodh Gaya": "बोधगया",
  Tankuppa: "टनकुप्पा",
  Manpur: "मानपुर",
  Belaganj: "बेलागंज",
  Wazirganj: "वजीरगंज",
  Khizarsarai: "खिजरसराय",
  Atri: "अतरी",
  "Neemchak Bathani": "नीमचक बथानी",
  Mohra: "मोहरा",
  Fatehpur: "फतेहपुर",
  Amas: "आमस",
  Sherghati: "शेरघाती",
  Dobhi: "डोभी",
  Imamganj: "इमामगंज",
  Dumaria: "डुमरिया",
  Bankebazar: "बांकेबाजार",
  Gurua: "गुरुआ",
  Guraru: "गुरारू",
  Paraiya: "परैया",
  Koch: "कोच",
  Tikari: "टिकारी",
  Barachatti: "बाराचट्टी",
  Mohanpur: "मोहनपुर",

  // 14. Jehanabad (जहानाबाद)
  Jehanabad: "जहानाबाद",
  Makhdumpur: "मखदुमपुर",
  Kako: "काको",
  Ghosi: "घोसी",
  Modanganj: "मोदनगंज",
  Hulasganj: "हुलासगंज",
  "Ratni Faridpur": "रतनी फरीदपुर",

  // 15. Arwal (अरवल)
  Arwal: "अरवल",
  Kaler: "कलेर",
  Karpi: "करपी",
  Kurtha: "कुर्ता",
  "Sonbhadra Banshi Suryapur": "सोनभद्र वंशी सूर्यपुर",

  // 16. Nawada (नवादा)
  Nawada: "नवादा",
  Rajauli: "रजौली",
  Akbarpur: "अकबरपुर",
  Gobindpur: "गोविंदपुर",
  Warisliganj: "वारिसलीगंज",
  Kashichak: "काशीचक",
  Pakribarawan: "पकरीबरावां",
  Kauakol: "कौआकोल",
  Roh: "रोह",
  Hisua: "हिसुआ",
  Narhat: "नरहट",
  Meskaur: "मेसकौर",
  Sirdala: "सिरदला",
  Nardiganj: "नारदीगंज",

  // 17. Aurangabad (औरंगाबाद)
  Aurangabad: "औरंगाबाद",
  Barun: "बारुण",
  Nabinagar: "नबीनगर",
  Kutumba: "कुटुंबा",
  Madanpur: "मदनपुर",
  Deo: "देव",
  Rafiganj: "रफीगंज",
  Obra: "ओबरा",
  Daudnagar: "दाउदनगर",
  Goh: "गोह",
  Haspura: "हसपुरा",

  // 18. Saran (सारण)
  Chapra: "छपरा",
  Revelganj: "रिविलगंज",
  Manjhi: "मांझी",
  Ekma: "एकमा",
  Baniapur: "बनियापुर",
  Jalalpur: "जलालपुर",
  Garkha: "गड़खा",
  Dighwara: "दिघवारा",
  Sonepur: "सोनपुर",
  Dariyapur: "दरियापुर",
  Parsa: "परसा",
  Marhaura: "मढ़ौरा",
  Mashrakh: "मशरक",
  Isuapur: "इसुआपुर",
  Taraiya: "तरैया",
  Panapur: "पानापुर",
  Nagra: "नगरा",
  Lahladpur: "लहलादपुर",
  Amnour: "अमनौर",
  Maker: "मकेर",

  // 19. Siwan (सिवान)
  "Siwan Sadar": "सिवान सदर",
  Mairwa: "मैरवा",
  Darauli: "दरौली",
  Guthani: "गुठनी",
  Hussainganj: "हुसैनगंज",
  Andar: "आंदर",
  Raghunathpur: "रघुनाथपुर",
  Siswan: "सिसवन",
  "Lakri Nabiganj": "लकड़ी नबीगंज",
  Maharajganj: "महाराजगंज",
  Pachrukhi: "पचरुखी",
  Basantpur: "बसंतपुर",
  "Bhagwanpur Hat": "भगवानपुर हाट",
  Goreyakothi: "गोरेयाकोठी",
  Barharia: "बड़हरिया",
  Ziradei: "जीरादेई",
  Hasanpura: "हसनपुरा",
  Daraunda: "दरौंदा",

  // 20. Gopalganj (गोपालगंज)
  Gopalganj: "गोपालगंज",
  Thawe: "थावे",
  Kuchaikote: "कुचायकोट",
  Barauli: "बरौली",
  Sidhwalia: "सिधवलिया",
  Baikunthpur: "बैकुंठपुर",
  Manjha: "मांझा",
  Kateya: "कटेया",
  Panchdeori: "पंचदेवरी",
  Phulwariya: "फुलवरिया",
  Uchkagaon: "उचकागांव",
  Hathua: "हथुआ",
  Vijaypur: "विजयपुर",
  Bhorey: "भोरे",

  // 21. Darbhanga (दरभंगा)
  "Darbhanga Sadar": "दरभंगा सदर",
  Jale: "जाले",
  Singhwara: "सिंहवाड़ा",
  Keoti: "केवटी",
  Baheri: "बहेड़ी",
  Bahadurpur: "बहादुरपुर",
  "Hanuman Nagar": "हनुमाननगर",
  Hayaghat: "हायाघाट",
  Benipur: "बेनीपुर",
  Alinagar: "अलीनगर",
  Manigachhi: "मनीगाछी",
  Tardih: "तारडीह",
  Kiratpur: "किरतपुर",
  "Gora Bauram": "गौड़ाबौराम",
  Ghanshyampur: "घनश्यामपुर",
  Biraul: "बिरौल",
  "Kusheshwar Asthan": "कुशेश्वरस्थान",
  "Kusheshwar Asthan East": "कुशेश्वरस्थान पूर्वी",

  // 22. Madhubani (मधुबनी)
  Rahika: "रहिका",
  Pandaul: "पंडौल",
  Jhanjharpur: "झंझारपुर",
  Babubarhi: "बाबूबरही",
  Lakhnaur: "लखनौर",
  Madhepur: "मधेपुर",
  Andhratharhi: "अंधराठाढ़ी",
  Khutauna: "खुटौना",
  Laukahi: "लौकही",
  Jainagar: "जयनगर",
  Ladania: "लदनिया",
  Basopatti: "बासोपट्टी",
  Benipatti: "बेनीपट्टी",
  Bisphee: "बिस्फी",
  Harlakhi: "हरलाखी",
  Madhwapur: "मदवापुर",
  Kaluahi: "कलुआही",
  Khajauli: "खजौली",
  Rajnagar: "राजनगर",
  Phulparas: "फुलपरास",

  // 23. Samastipur (समस्तीपुर)
  "Samastipur Sadar": "समस्तीपुर सदर",
  Kalyanpur: "कल्याणपुर",
  Warisnagar: "वारिसनगर",
  Khanpur: "खानपुर",
  "Shivaji Nagar": "शिवाजीनगर",
  Sarairanjan: "सरायरंजन",
  Morwa: "मोरवा",
  Patori: "पटोरी",
  "Vidyapati Nagar": "विद्यापतिनगर",
  Dalsinghsarai: "दलसिंहसराय",
  Ujiarpur: "उजियारपुर",
  Bibhutipur: "विभूतिपुर",
  Rosera: "रोसड़ा",
  Hasanpur: "हसनपुर",
  Bithan: "बिथान",
  Singhia: "सिंघिया",
  Pusa: "पूसा",
  Tajpur: "ताजपुर",

  // 24. Purnia (पूर्णिया)
  "Purnia East": "पूर्णिया पूर्व",
  Kasba: "कसबा",
  Jalalgarh: "जलालगढ़",
  Srinagar: "श्रीनगर",
  Kenagar: "केनगर",
  Banmankhi: "बनमनखी",
  Dhamdaha: "धमदाहा",
  "Barhara Kothi": "बड़हरा कोठी",
  Bhawanipur: "भवानीपुर",
  Rupauli: "रूपौली",
  "B. Kothi": "बीकोठी",
  Dagarua: "डगरुआ",
  Baisa: "बैसा",
  Amour: "अमौर",

  // 25. Katihar (कटिहार)
  Katihar: "कटिहार",
  Korha: "कोढ़ा",
  Falka: "फलका",
  Sameli: "समेली",
  Kursela: "कुर्सेला",
  Barari: "बरारी",
  Mansahi: "मनसाही",
  Pranpur: "प्राणपुर",
  Dandkhora: "डंडखोरा",
  Hasanganj: "हसनगंज",
  Kadwa: "कदवा",
  Balrampur: "बलरामपुर",
  Barsoi: "बारसोई",
  Azamnagar: "आजमनगर",
  Manihari: "मनिहारी",
  Amdabad: "अमदाबाद",

  // 26. Araria (अररिया)
  Araria: "अररिया",
  Jokihat: "जोकीहाट",
  Kursakanta: "कुर्साकांटा",
  Raniganj: "रानीगंज",
  Bhargama: "भरगामा",
  Narpatganj: "नरपतगंज",
  Forbesganj: "फारबिसगंज",
  Palasi: "पलासी",
  Sikti: "सिकटी",

  // 27. Kishanganj (किशनगंज)
  Kishanganj: "किशनगंज",
  Pothia: "पोठिया",
  Kochadhaman: "कोचाधामन",
  Thakurganj: "ठाकुरगंज",
  Bahadurganj: "बहादुरगंज",
  Dighalbank: "दिघलबैंक",
  Terhagachh: "टेढ़ागाछ",

  // 28. Munger (मुंगेर)
  "Munger Sadar": "मुंगेर सदर",
  Jamalpur: "जमालपुर",
  Bariarpur: "बरियारपुर",
  Dharhara: "धरहरा",
  Kharagpur: "खड़गपुर",
  Asarganj: "असरगंज",
  Tarapur: "तारापुर",
  Tetiabamber: "टेटिया बम्बर",
  Sangrampur: "संग्रामपुर",

  // 29. Lakhisarai (लखीसराय)
  Lakhisarai: "लखीसराय",
  Surajgarha: "सूर्यगढ़ा",
  Barhiya: "बड़हिया",
  Halsi: "हलसी",
  "Ramgarh Chowk": "रामगढ़ चौक",
  Pipariya: "पिपरिया",
  Chanan: "चानन",

  // 30. Sheikhpura (शेखपुरा)
  Sheikhpura: "शेखपुरा",
  Barbigha: "बरबीघा",
  Ariari: "अरियरी",
  Chewara: "चेवाड़ा",
  Ghatkusumbha: "घाटकुसुम्भा",
  "Shekhopur Sarai": "शेखोपुर सराय",

  // 31. Jamui (जमुई)
  Jamui: "जमुई",
  Khaira: "खैरा",
  Sono: "सोनो",
  Jhajha: "झाझा",
  Gidhaur: "गिद्धौर",
  Laxmipur: "लक्ष्मीपुर",
  Barhat: "बरहट",
  Sikandra: "सिकंदरा",
  Aliganj: "अलीगंज",
  Chakai: "चकाई",

  // 32. Khagaria (खगड़िया)
  Khagaria: "खगड़िया",
  Alauli: "अलौली",
  Mansi: "मानसी",
  Chautham: "चौथम",
  Gogri: "गोगरी",
  Beldaur: "बेलदौर",
  Parbatta: "परबत्ता",

  // 33. Begusarai (बेगूसराय)
  Begusarai: "बेगूसराय",
  Barauni: "बरौनी",
  Teghra: "तेघड़ा",
  Bachhwara: "बछवाड़ा",
  Mansurchak: "मंसूरचक",
  "Cheria Bariarpur": "चेरिया बरियारपुर",
  Khodawandpur: "खोदावंदपुर",
  Bakhri: "बखरी",
  Garhpura: "गढ़पुरा",
  Naokothi: "नावकोठी",
  Birpur: "वीरपुर",
  Matihani: "मटीहानी",
  "Shamho Akha Kurha": "शाम्हो अकहा कुरहा",
  "Sahebpur Kamal": "साहेबपुर कमाल",
  Balia: "बलिया",
  Dandari: "डंडारी",
  Chaurahi: "छोराही",

  // 34. Saharsa (सहरसा)
  "Saharsa Sadar": "सहरसा सदर",
  Kahra: "कहरा",
  "Saur Bazar": "सौर बाजार",
  Patarghat: "पतरघट",
  "Simri Bakhtiarpur": "सिमरी बख्तियारपुर",
  Salkhua: "सलखुआ",
  "Banma Itahri": "बनमा ईटहरी",
  Sonbarsa: "सोनवर्षा",
  Nauhatta: "नवहट्टा",
  Mahishi: "महिषी",

  // 35. Madhepura (मधेपुरा)
  Madhepura: "मधेपुरा",
  Gamharia: "गम्हरिया",
  Singheshwar: "सिंहेश्वर",
  Kumarkhand: "कुमारखंड",
  Murliganj: "मुरलीगंज",
  Bihariganj: "बिहारीगंज",
  Udakishunganj: "उदाकिशुनगंज",
  Alamnagar: "आलमनगर",
  Chausa: "चौसा",
  Puraini: "पुरैनी",
  Gwalpara: "ग्वालपाड़ा",

  // 36. Supaul (सुपौल)
  Supaul: "सुपौल",
  Kishanpur: "किसनपुर",
  "Saraigarh Bhaptiyahi": "सरायगढ़ भपटियाही",
  Nirmali: "निर्मली",
  Marauna: "मरौना",
  Basantpur: "बसंतपुर",
  Raghopur: "राघोपुर",
  Pipra: "पिपरा",
  Triveniganj: "त्रिवेणीगंज",
  Chhatapur: "छातापुर",
  Pratapganj: "प्रतापगंज",

  // 37. Bhagalpur (भागलपुर)
  Jagdishpur: "जगदीशपुर",
  Nathnagar: "नाथनगर",
  Sabour: "सबौर",
  Sultanganj: "सुल्तानगंज",
  Shahkund: "शाहकुंड",
  Goradih: "गोराडीह",
  Kahalgaon: "कहलगांव",
  Sanhaula: "सन्हौला",
  Pirpainti: "पीरपैंती",
  Naugachhia: "नवगछिया",
  Ismailpur: "इस्माइलपुर",
  "Rangra Chowk": "रंगरा चौक",
  Gopalpur: "गोपालपुर",
  Kharik: "खरीक",
  Bihpur: "बिहपुर",
  Narayanpur: "नारायणपुर",

  // 38. Banka (बांका)
  Banka: "बांका",
  Amarpur: "अमरपुर",
  Rajaun: "रजौन",
  Barahat: "बाराहाट",
  Dhoraiya: "धोरैया",
  Shambhuganj: "शंभुगंज",
  Belhar: "बेलहर",
  Fullidumar: "फुलीडूमर",
  Katoria: "कटोरिया",
  Chandan: "चांदन",
  Bansi: "बौंसी",
};

window.blockTableLanguage = "hi"; // डिफ़ॉल्ट भाषा को हिंदी (Hindi) सेट किया गया है

window.toggleBlockTableLang = function () {
  window.blockTableLanguage = window.blockTableLanguage === "hi" ? "en" : "hi";
  // Re-calculate and render with new language instantly
  if (typeof updateBlockReport === "function") updateBlockReport();
};

window.getBlockName = function (props) {
  let engName =
    props.sdtname ||
    props.subdistrict ||
    props.block ||
    props.name ||
    props.SDTNAME ||
    props.SUBDISTRICT ||
    props.BLOCK ||
    "Unknown Block";

  engName = engName.trim();

  // Default to English if language is not set to Hindi
  if (window.blockTableLanguage !== "hi") return engName;

  // Check if GeoJSON already has a Hindi property
  let hindiName =
    props.sdtname_hi ||
    props.sdtname_hn ||
    props.sdtname_hindi ||
    props.hindi ||
    props.HINDI;
  if (hindiName) return hindiName;

  // Try exact match in dictionary
  if (window.blockHindiMap[engName]) return window.blockHindiMap[engName];

  // Try case-insensitive match in dictionary
  const lowerEngName = engName.toLowerCase();
  for (const key in window.blockHindiMap) {
    if (key.toLowerCase() === lowerEngName) {
      return window.blockHindiMap[key];
    }
  }

  // Return English name if translation not found
  return engName;
};

window.getDistrictName = function (props) {
  let dName =
    props.district ||
    props.dtname ||
    props.district_name ||
    props.dist ||
    props.DISTRICT ||
    props.DTNAME ||
    "Unknown District";

  // Sanitize district name to match districtsData mapping
  const nameMapping = {
    Purnia: "PURNEA",
    Munger: "MONGHYR",
    "Kaimur (Bhabua)": "BHABUA",
    Kaimur: "BHABUA",
    Jehanabad: "JAHANABAD",
    "Purba Champaran": "EAST CHAMPARAN",
    "Pashchim Champaran": "WEST CHAMPARAN",
    "East Champaran": "EAST CHAMPARAN",
    "West Champaran": "WEST CHAMPARAN",
    East_Champaran: "EAST CHAMPARAN",
    West_Champaran: "WEST CHAMPARAN",
  };

  let cleanName = dName;
  if (nameMapping[dName]) cleanName = nameMapping[dName];

  // Default to English if language is not set to Hindi
  if (window.blockTableLanguage !== "hi") return cleanName;

  // Fetch Hindi name from global districtsData (defined in districts.js)
  if (typeof districtsData !== "undefined") {
    const dist = districtsData.find(
      (d) => d.name.toLowerCase() === cleanName.trim().toLowerCase(),
    );
    if (dist && dist.hindi) return dist.hindi;
  }

  return dName; // Fallback to English if not found
};

// Feature 6 & 2: Intersection Engine
window.updateBlockReport = async function () {
  // Ensure subdistricts layer is loaded
  if (typeof geoJsonLayers === "undefined") {
    clearNowcastReport();
    return;
  }

  let subDistLayerGroup = geoJsonLayers["subdistricts"];

  // Background silent load if layer was disabled by default
  if (!subDistLayerGroup) {
    if (typeof loadGeoJsonLayer === "function") {
      subDistLayerGroup = await loadGeoJsonLayer("subdistricts");
    }
    if (!subDistLayerGroup) {
      clearNowcastReport();
      return;
    }
  }

  const drawnFeatures = [];

  drawnItems.eachLayer((layer) => {
    // Only use the base polygon, ignore auto-generated buffer rings for exact detection
    if (
      layer.feature &&
      !layer.feature.properties.generatedRing &&
      typeof layer.toGeoJSON === "function"
    ) {
      drawnFeatures.push(layer.toGeoJSON());
    }
  });

  if (
    drawnFeatures.length === 0 &&
    (typeof selectedDistricts === "undefined" || selectedDistricts.length === 0)
  ) {
    clearNowcastReport(
      "No District or Polygon selected. (कोई जिला या पॉलीगॉन चयनित नहीं)",
    );
    return;
  }

  const intersectedBlocks = [];
  const addedBlockIds = new Set(); // Prevent duplicates if multiple polygons overlap the same block
  const totalBlocksPerDistrict = {}; // ज़िले के कुल प्रखंडों को ट्रैक करने के लिए

  // Iterate over Sub-District GeoJSON features
  subDistLayerGroup.eachLayer((sdLayer) => {
    if (!sdLayer.feature) return;
    let intersects = false;

    const props = sdLayer.feature.properties;
    const distName = getDistrictName(props);
    const blockName = getBlockName(props);

    // पूरे ज़िले के प्रखंडों की कुल संख्या की गणना (Calculate total blocks per district)
    if (!totalBlocksPerDistrict[distName]) {
      totalBlocksPerDistrict[distName] = new Set();
    }
    if (blockName && blockName !== "Unknown Block") {
      totalBlocksPerDistrict[distName].add(blockName);
    }

    if (drawnFeatures.length > 0) {
      // 1. Polygon Mode: Strict Intersection
      for (const drawn of drawnFeatures) {
        try {
          if (turf.booleanIntersects(drawn, sdLayer.feature)) {
            intersects = true;
            break;
          }
        } catch (e) {
          console.warn(
            "Turf.js Intersection error (skipping bad geometry):",
            e,
          );
        }
      }
    } else if (
      typeof selectedDistricts !== "undefined" &&
      selectedDistricts.length > 0
    ) {
      // 2. District Mode: Show all blocks in selected districts
      let dName =
        props.district ||
        props.dtname ||
        props.district_name ||
        props.dist ||
        props.DISTRICT ||
        props.DTNAME ||
        "Unknown District";

      const nameMapping = {
        Purnia: "PURNEA",
        Munger: "MONGHYR",
        "Kaimur (Bhabua)": "BHABUA",
        Kaimur: "BHABUA",
        Jehanabad: "JAHANABAD",
        "Purba Champaran": "EAST CHAMPARAN",
        "Pashchim Champaran": "WEST CHAMPARAN",
        "East Champaran": "EAST CHAMPARAN",
        "West Champaran": "WEST CHAMPARAN",
        East_Champaran: "EAST CHAMPARAN",
        West_Champaran: "WEST CHAMPARAN",
      };
      if (nameMapping[dName]) dName = nameMapping[dName];

      if (typeof districtsData !== "undefined") {
        const distObj = districtsData.find(
          (d) => d.name.toLowerCase() === dName.trim().toLowerCase(),
        );
        // FIX: String और Number mismatch को रोकने के लिए String में कन्वर्ट करके चेक किया गया
        if (
          distObj &&
          selectedDistricts.some((id) => String(id) === String(distObj.id))
        ) {
          intersects = true;
        }
      }
    }

    if (intersects) {
      const uniqueId = distName + "_" + blockName; // Composite key

      if (!addedBlockIds.has(uniqueId)) {
        addedBlockIds.add(uniqueId);
        intersectedBlocks.push({
          district: distName,
          block: blockName,
          props: props,
        });
      }
    }
  });

  if (intersectedBlocks.length > 0) {
    const grouped = groupByDistrict(intersectedBlocks);

    const totalBlocksCount = {};
    for (const d in totalBlocksPerDistrict) {
      totalBlocksCount[d] = totalBlocksPerDistrict[d].size;
    }

    renderNowcastTable(grouped, totalBlocksCount);
  } else {
    clearNowcastReport("No Sub-District selected. (कोई प्रखंड चयनित नहीं)");
  }
};

window.groupByDistrict = function (blocks) {
  const grouped = {};
  blocks.forEach((b) => {
    if (!grouped[b.district]) grouped[b.district] = [];
    grouped[b.district].push(b.block);
  });
  return grouped;
};

// Toggle function to hide/show block table
window.toggleBlockReportTable = function (isVisible) {
  window.isBlockTableVisible = isVisible;
  const cont = document.getElementById("blockTableContainer");
  if (cont) {
    cont.style.display = isVisible ? "block" : "none";
  }
};

window.renderNowcastTable = function (groupedData, totalBlocksCount = {}) {
  const panel = document.getElementById("blockReportPanel");
  if (!panel) return;

  let totalDistricts = Object.keys(groupedData).length;
  let totalBlocks = 0;

  // पहले कुल प्रखंडों की संख्या निकाल लें ताकि हेडिंग में दिखाया जा सके
  for (const blocks of Object.values(groupedData)) {
    totalBlocks += blocks.length;
  }

  let isChecked = window.isBlockTableVisible !== false ? "checked" : "";
  let displayStyle = window.isBlockTableVisible !== false ? "block" : "none";

  let isHi = window.blockTableLanguage === "hi";
  let titleText = isHi
    ? "प्रभावित क्षेत्र (जिला एवं प्रखंडवार विवरण)"
    : "Affected Areas (District & Block-wise)";
  let langBtnText = isHi
    ? "View in English"
    : "हिंदी में देखें (View in Hindi)";
  let totalDistText = isHi ? "कुल जिले प्रभावित" : "Total Districts Affected";
  let totalBlockText = isHi ? "कुल प्रखंड प्रभावित" : "Total Blocks Affected";

  let thSr = isHi ? "क्रम संख्या" : "Sr. No.";
  let thDist = isHi ? "जिला" : "District";
  let thBlock = isHi ? "चयनित प्रखंड" : "Selected Blocks";
  let thTotal = isHi ? "कुल प्रखंड" : "Total Blocks (Affected / Total)";

  // Sorting State Initialization
  if (!window.blockTableSort) {
    window.blockTableSort = { col: "district", dir: "asc" };
  }
  const sort = window.blockTableSort;
  const getSortIcon = (colName) => {
    if (sort.col !== colName)
      return '<i class="fas fa-sort" style="color:#aaa; margin-left:5px; font-size:12px;"></i>';
    return sort.dir === "asc"
      ? '<i class="fas fa-sort-up" style="margin-left:5px; font-size:12px;"></i>'
      : '<i class="fas fa-sort-down" style="margin-left:5px; font-size:12px;"></i>';
  };

  let tableHtml = `
    <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); width: 100%; border: 2px solid #667eea;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; margin-bottom: 15px; border-bottom: 2px solid #eee; padding-bottom: 10px; gap: 10px;">
            <h3 style="color: #d32f2f; margin: 0; font-size: 18px; display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-map-marked-alt"></i> ${titleText}
                <input type="checkbox" onchange="toggleBlockReportTable(this.checked)" ${isChecked} data-html2canvas-ignore="true" style="transform: scale(1.3); margin: 0; cursor: pointer; accent-color: #d32f2f;" title="Toggle Table Visibility">
                <button onclick="toggleBlockTableLang()" data-html2canvas-ignore="true" style="background: #17a2b8; color: white; border: none; border-radius: 4px; padding: 3px 8px; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 4px;"><i class="fas fa-language"></i> ${langBtnText}</button>
            </h3>
            <div style="display: flex; gap: 15px; align-items: center; flex-wrap: wrap;">
                <span style="font-size: 14px; font-weight: bold; background: #e8f0fe; padding: 5px 12px; border-radius: 6px; color: #1e3c72; border: 1px solid #b6d4fe;">
                    ${totalDistText}: ${totalDistricts} &nbsp;|&nbsp; ${totalBlockText}: ${totalBlocks}
                </span>
            </div>
        </div>
        <div id="blockTableContainer" style="overflow-x: auto; display: ${displayStyle};">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; text-align: left; font-size: 14px;">
                <thead>
                    <tr style="background: #f8f9fa; border-bottom: 2px solid #667eea;">
                        <th style="padding: 10px; border: 1px solid #dee2e6;">${thSr}</th>
                        <th style="padding: 10px; border: 1px solid #dee2e6; cursor: pointer; white-space: nowrap;" onclick="handleTableSort('district')" title="Sort by District">${thDist} ${getSortIcon("district")}</th>
                        <th style="padding: 10px; border: 1px solid #dee2e6;">${thBlock}</th>
                        <th style="padding: 10px; border: 1px solid #dee2e6; text-align: center; cursor: pointer; white-space: nowrap;" onclick="handleTableSort('total')" title="Sort by Count">${thTotal} ${getSortIcon("total")}</th>
                    </tr>
                </thead>
                <tbody>
    `;

  let srNo = 1;

  // टेबल डेटा को Array में बदलें ताकि उसे सॉर्ट किया जा सके
  let rows = Object.keys(groupedData).map((dist) => ({
    district: dist,
    blocks: groupedData[dist].sort((a, b) =>
      a.localeCompare(b, isHi ? "hi" : "en"),
    ),
    affectedCount: groupedData[dist].length,
    totalInDist: totalBlocksCount[dist] || groupedData[dist].length,
  }));

  // चुने गए कॉलम के आधार पर डेटा सॉर्ट करें
  rows.sort((a, b) => {
    let comparison = 0;
    if (sort.col === "district") {
      comparison = a.district.localeCompare(b.district, isHi ? "hi" : "en");
    } else if (sort.col === "total") {
      comparison = a.affectedCount - b.affectedCount;
      if (comparison === 0) comparison = a.totalInDist - b.totalInDist;
    }
    return sort.dir === "asc" ? comparison : -comparison;
  });

  for (const row of rows) {
    const blocksStr = row.blocks.join(", ");
    tableHtml += `
            <tr style="background: ${srNo % 2 === 0 ? "#f8f9fa" : "#ffffff"};">
                <td style="padding: 10px; border: 1px solid #dee2e6; text-align: center;">${srNo}</td>
                <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold; color: #2c3e50;">${row.district}</td>
                <td style="padding: 10px; border: 1px solid #dee2e6; line-height: 1.6;">${blocksStr}</td>
                <td style="padding: 10px; border: 1px solid #dee2e6; text-align: center; font-weight: bold; color: #d32f2f; white-space: nowrap;">${row.affectedCount} / ${row.totalInDist}</td>
            </tr>
        `;
    srNo++;
  }

  tableHtml += `
                </tbody>
            </table>
        </div>
    </div>
    `;

  panel.innerHTML = tableHtml;
  panel.style.display = "block";
  window.currentBlockReportData = {
    groupedData,
    totalBlocksCount,
    totalDistricts,
    totalBlocks,
  };
};

// क्लिक करने पर टेबल सॉर्ट करने का फंक्शन
window.handleTableSort = function (colName) {
  if (!window.blockTableSort)
    window.blockTableSort = { col: "district", dir: "asc" };

  if (window.blockTableSort.col === colName) {
    window.blockTableSort.dir =
      window.blockTableSort.dir === "asc" ? "desc" : "asc";
  } else {
    window.blockTableSort.col = colName;
    window.blockTableSort.dir = "asc";
  }

  if (
    window.currentBlockReportData &&
    window.currentBlockReportData.groupedData
  ) {
    renderNowcastTable(
      window.currentBlockReportData.groupedData,
      window.currentBlockReportData.totalBlocksCount || {},
    );
  }
};

window.clearNowcastReport = function (msg = "") {
  const panel = document.getElementById("blockReportPanel");
  if (panel) {
    if (msg) {
      panel.innerHTML = `<div style="background: #f8d7da; color: #721c24; padding: 15px; border-radius: 8px; border: 1px solid #f5c6cb; font-weight: bold;"><i class="fas fa-exclamation-circle"></i> ${msg}</div>`;
      panel.style.display = "block";
    } else {
      let isChecked = window.isBlockTableVisible !== false ? "checked" : "";
      let displayStyle =
        window.isBlockTableVisible !== false ? "block" : "none";

      let isHi = window.blockTableLanguage === "hi";
      let titleText = isHi
        ? "प्रभावित क्षेत्र (जिला एवं प्रखंडवार विवरण)"
        : "Affected Areas (District & Block-wise)";
      let langBtnText = isHi ? "View in English" : "हिंदी में देखें";
      let totalDistText = isHi
        ? "कुल जिले प्रभावित"
        : "Total Districts Affected";
      let totalBlockText = isHi
        ? "कुल प्रखंड प्रभावित"
        : "Total Blocks Affected";
      let thSr = isHi ? "क्रम संख्या" : "Sr. No.";
      let thDist = isHi ? "जिला" : "District";
      let thBlock = isHi ? "चयनित प्रखंड" : "Selected Blocks";
      let thTotal = isHi ? "कुल प्रखंड" : "Total Blocks (Affected / Total)";
      let noBlockText = isHi ? "कोई प्रखंड चयनित नहीं" : "No Block Selected";

      // Default empty table structure instead of hiding
      panel.innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); width: 100%; border: 2px solid #667eea;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; margin-bottom: 15px; border-bottom: 2px solid #eee; padding-bottom: 10px; gap: 10px;">
                <h3 style="color: #d32f2f; margin: 0; font-size: 18px; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-map-marked-alt"></i> ${titleText}
                    <input type="checkbox" onchange="toggleBlockReportTable(this.checked)" ${isChecked} data-html2canvas-ignore="true" style="transform: scale(1.3); margin: 0; cursor: pointer; accent-color: #d32f2f;" title="Toggle Table Visibility">
                    <button onclick="toggleBlockTableLang()" data-html2canvas-ignore="true" style="background: #17a2b8; color: white; border: none; border-radius: 4px; padding: 3px 8px; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 4px;"><i class="fas fa-language"></i> ${langBtnText}</button>
                </h3>
                <div style="display: flex; gap: 15px; align-items: center; flex-wrap: wrap;">
                    <span style="font-size: 14px; font-weight: bold; background: #e8f0fe; padding: 5px 12px; border-radius: 6px; color: #1e3c72; border: 1px solid #b6d4fe;">
                        ${totalDistText}: 0 &nbsp;|&nbsp; ${totalBlockText}: 0
                    </span>
                </div>
            </div>
            <div id="blockTableContainer" style="overflow-x: auto; display: ${displayStyle};">
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; text-align: left; font-size: 14px;">
                    <thead>
                        <tr style="background: #f8f9fa; border-bottom: 2px solid #667eea;">
                            <th style="padding: 10px; border: 1px solid #dee2e6;">${thSr}</th>
                            <th style="padding: 10px; border: 1px solid #dee2e6; cursor: pointer; white-space: nowrap;" onclick="handleTableSort('district')">${thDist} <i class="fas fa-sort" style="color:#aaa; margin-left:5px; font-size:12px;"></i></th>
                            <th style="padding: 10px; border: 1px solid #dee2e6;">${thBlock}</th>
                            <th style="padding: 10px; border: 1px solid #dee2e6; text-align: center; cursor: pointer; white-space: nowrap;" onclick="handleTableSort('total')">${thTotal} <i class="fas fa-sort" style="color:#aaa; margin-left:5px; font-size:12px;"></i></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colspan="4" style="padding: 15px; text-align: center; color: #7f8c8d; font-weight: bold;">${noBlockText}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
      `;
      panel.style.display = "block";
    }
  }
  window.currentBlockReportData = null;
};

// ============================================================================
// INIT & HOOKS
// ============================================================================
document.addEventListener("DOMContentLoaded", function () {
  initAdvancedDraw();

  // Show default empty table on load
  clearNowcastReport();

  // Feature 7: Live Update Hooks
  if (typeof map !== "undefined" && map) {
    map.on("draw:created", function () {
      setTimeout(updateBlockReport, 150);
    });
    map.on("draw:edited", function () {
      setTimeout(updateBlockReport, 150);
    });
    map.on("draw:deleted", function () {
      setTimeout(updateBlockReport, 150);
    });
  }
});
