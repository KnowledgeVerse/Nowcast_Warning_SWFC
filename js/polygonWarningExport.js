// js/polygonWarningExport.js

let mapLeftInstance = null;
let mapRightInstance = null;
let currentMiniBaseLayerLeft = null;
let currentMiniBaseLayerRight = null;
let miniGridLayerLeft = null;
let miniGridLayerRight = null;
let biharBoundsLeft = null;
let warningBoundsRight = null;
let leftZoomCtrl = null;
let rightZoomCtrl = null;

function generateNowcastWithMap() {
  if (
    typeof selectedDistricts === "undefined" ||
    selectedDistricts.length === 0
  ) {
    alert(
      "कृपया कम से कम एक जिला चुनें!\nPlease select at least one district!",
    );
    return;
  }

  // Generate text and prepare main UI first
  if (typeof generateNowcast === "function") {
    generateNowcast(false);
  }

  // Wait for generateNowcast's 500ms timeout to reveal the container
  // Otherwise Leaflet map size is 0x0 and zoom fails
  setTimeout(() => {
    const mapSection = document.getElementById("mapSectionInCard");
    if (!mapSection) return;

    mapSection.style.display = "flex"; // Show map container inside the main card

    // Prevent Canvas Clipping and Layout Shifting
    const cardContainer = document.getElementById("warningCardContainer");
    if (cardContainer) cardContainer.style.aspectRatio = "auto";
    const aspectSelect = document.getElementById("imageAspectRatio");
    if (aspectSelect) aspectSelect.value = "auto";

    // Select Hex color per warnings
    let hexColor = "#ffff00";
    if (typeof selectedWarningLevel !== "undefined") {
      if (selectedWarningLevel === "orange") hexColor = "#ffa500";
      if (selectedWarningLevel === "red") hexColor = "#ff0000";
      if (selectedWarningLevel === "green") hexColor = "#00ff00";
    }

    // Initialize Submaps
    if (!mapLeftInstance) {
      mapLeftInstance = L.map("miniMapLeft", {
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        zoomAnimation: false,
        fadeAnimation: false,
        preferCanvas: true,
      }).setView([25.6, 85.6], 6);
      currentMiniBaseLayerLeft = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      ).addTo(mapLeftInstance);
      // Add Scale Bar to Left Map
      L.control
        .scale({ position: "bottomleft", metric: true, imperial: false })
        .addTo(mapLeftInstance);
    }

    if (!mapRightInstance) {
      mapRightInstance = L.map("miniMapRight", {
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        zoomAnimation: false,
        fadeAnimation: false,
        preferCanvas: true,
      }).setView([25.6, 85.6], 7);
      currentMiniBaseLayerRight = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      ).addTo(mapRightInstance);
      // Add Scale Bar to Right Map
      L.control
        .scale({ position: "bottomleft", metric: true, imperial: false })
        .addTo(mapRightInstance);
    }

    // Ensure current layers match dropdown if UI was used
    if (typeof changeMiniMapBaseLayer === "function") {
      const baseDrop = document.getElementById("miniMapBaseLayer");
      if (baseDrop && baseDrop.value !== "street") {
        changeMiniMapBaseLayer();
      }
    }

    // Explicitly invalidate size after UI is visible
    mapLeftInstance.invalidateSize();
    mapRightInstance.invalidateSize();

    // Purge overlays before re-render
    mapLeftInstance.eachLayer((layer) => {
      if (layer.options && layer.options.pane === "overlayPane" && !layer._url)
        mapLeftInstance.removeLayer(layer);
    });
    mapRightInstance.eachLayer((layer) => {
      if (layer.options && layer.options.pane === "overlayPane" && !layer._url)
        mapRightInstance.removeLayer(layer);
    });

    // Remove existing Legend control if any to prevent duplicates
    if (mapRightInstance.legendControl) {
      mapRightInstance.removeControl(mapRightInstance.legendControl);
      mapRightInstance.legendControl = null;
    }

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

    const possiblePaths = [
      "data/bihar_districts.geojson",
      "data/Bihar_Districts.geojson",
      "Data/bihar_districts.geojson",
      "Data/Bihar_Districts.geojson",
      "data/bihar_district.geojson",
    ];

    const loadGeoJSONData = (paths, index) => {
      if (index >= paths.length)
        return Promise.reject(new Error("GeoJSON not found"));
      return fetch(paths[index]).then((res) => {
        if (!res.ok) return loadGeoJSONData(paths, index + 1);
        return res.json();
      });
    };

    loadGeoJSONData(possiblePaths, 0)
      .then((data) => {
        if (
          typeof proj4 !== "undefined" &&
          typeof getSampleCoord === "function" &&
          typeof convertCoordinates === "function"
        ) {
          if (data.features.length > 0) {
            const sample = getSampleCoord(
              data.features[0].geometry.coordinates,
            );
            if (sample && sample[0] > 180) {
              data.features.forEach(
                (f) =>
                  (f.geometry.coordinates = convertCoordinates(
                    f.geometry.coordinates,
                  )),
              );
            }
          }
        }

        // Collect Unique Phenomena for Legend
        let uniquePhenomena = new Set();
        if (typeof selectedPhenomena !== "undefined") {
          selectedPhenomena.forEach((p) => uniquePhenomena.add(p));
        }

        // Check if any custom warning polygons are drawn
        const hasDrawnPolygons =
          typeof drawnItems !== "undefined" &&
          drawnItems.getLayers().length > 0;

        // Render Full Map Structure
        const leftLayer = L.geoJSON(data, {
          style: function (feature) {
            let dName = feature.properties.D_NAME;
            if (nameMapping[dName]) dName = nameMapping[dName];

            let isSelected = false;
            if (typeof districtsData !== "undefined") {
              const dist = districtsData.find(
                (d) => d.name.toLowerCase() === dName.trim().toLowerCase(),
              );
              if (dist && selectedDistricts.includes(dist.id))
                isSelected = true;
            }

            let applyColor = isSelected && !hasDrawnPolygons;

            return {
              fillColor: applyColor ? hexColor : "transparent",
              weight: 1,
              color: "#444",
              fillOpacity: applyColor ? 0.7 : 0,
            };
          },
        }).addTo(mapLeftInstance);

        // Render Right Zoomed View Structure
        let selectedRightFeaturesGroup = L.featureGroup();

        const rightLayer = L.geoJSON(data, {
          style: function (feature) {
            let dName = feature.properties.D_NAME;
            if (nameMapping[dName]) dName = nameMapping[dName];

            let isSelected = false;
            if (typeof districtsData !== "undefined") {
              const dist = districtsData.find(
                (d) => d.name.toLowerCase() === dName.trim().toLowerCase(),
              );
              if (dist && selectedDistricts.includes(dist.id))
                isSelected = true;
            }

            let applyColor = isSelected && !hasDrawnPolygons;

            return {
              fillColor: applyColor ? hexColor : "transparent",
              weight: isSelected ? 2 : 1,
              color: isSelected ? "#000" : "#666",
              fillOpacity: applyColor ? 0.6 : 0,
            };
          },
          onEachFeature: function (feature, layer) {
            let dName = feature.properties.D_NAME;
            if (nameMapping[dName]) dName = nameMapping[dName];

            let isSelected = false;
            if (typeof districtsData !== "undefined") {
              const dist = districtsData.find(
                (d) => d.name.toLowerCase() === dName.trim().toLowerCase(),
              );
              if (dist && selectedDistricts.includes(dist.id)) {
                isSelected = true;
                selectedRightFeaturesGroup.addLayer(layer);
              }
            }

            // Only display labels for selected districts to avoid map clutter
            if (isSelected || hasDrawnPolygons) {
              layer.bindTooltip(dName.toUpperCase(), {
                permanent: true,
                direction: "center",
                className: "map-label",
                style:
                  "font-weight: bold; background: transparent; border: none; box-shadow: none;",
              });
            }
          },
        }).addTo(mapRightInstance);

        // Overlay custom Drawn Polygons onto Mini Maps
        let customPolygonsGroup = L.featureGroup();

        if (typeof drawnItems !== "undefined") {
          // Extract layers to sort them by size
          let layersArray = [];
          drawnItems.eachLayer((layer) => {
            if (layer.getBounds && layer.getLatLngs) {
              layersArray.push(layer);
            }
          });

          // Sort descending by diagonal length (Largest polygons/rings first, inner polygons last)
          layersArray.sort((a, b) => {
            let distA = a
              .getBounds()
              .getSouthWest()
              .distanceTo(a.getBounds().getNorthEast());
            let distB = b
              .getBounds()
              .getSouthWest()
              .distanceTo(b.getBounds().getNorthEast());
            return distB - distA;
          });

          layersArray.forEach((layer) => {
            // Use the feature property color to avoid exporting selection dashes/styles
            const warningCol =
              layer.feature?.properties?.warningColor ||
              layer.options.fillColor ||
              hexColor;
            const polyOpacity =
              layer.options.fillOpacity !== undefined
                ? layer.options.fillOpacity
                : 0.6;
            const polyStyle = {
              color: warningCol,
              fillColor: warningCol,
              weight:
                layer.options.weight !== undefined ? layer.options.weight : 3,
              fillOpacity: polyOpacity,
              dashArray: null,
            };

            // Left map polygon
            L.polygon(layer.getLatLngs(), polyStyle).addTo(mapLeftInstance);

            // Right map polygon
            let rightPoly = L.polygon(layer.getLatLngs(), polyStyle).addTo(
              mapRightInstance,
            );
            customPolygonsGroup.addLayer(rightPoly);

            // Add Phenomena Icons if available
            if (
              layer.feature &&
              layer.feature.properties &&
              layer.feature.properties.phenomena
            ) {
              layer.feature.properties.phenomena.forEach((phenomId) => {
                uniquePhenomena.add(phenomId);
              });
            }
          });
        }

        // Build Legend Control for mapRightInstance
        if (uniquePhenomena.size > 0) {
          let legendHtml =
            '<div style="font-weight:bold; border-bottom:1px solid #ccc; margin-bottom:5px; padding-bottom:3px; font-size:13px; color:#333; text-transform:uppercase;">Weather Warning</div>';
          uniquePhenomena.forEach((phenomId) => {
            let phenomObj = weatherPhenomena.find((p) => p.id === phenomId);
            if (phenomObj) {
              legendHtml += `<div style="display:flex; align-items:center; gap:8px; margin-bottom:5px; font-size:15px; font-weight:bold; color:#000; white-space:nowrap;"><span style="font-size:22px;">${phenomObj.icon}</span> ${phenomObj.name}</div>`;
            }
          });
          const legendControl = L.control({ position: "bottomright" });
          legendControl.onAdd = function () {
            const div = L.DomUtil.create("div", "info legend-export");
            div.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
            div.style.padding = "10px 15px";
            div.style.borderRadius = "8px";
            div.style.border = "3px solid " + hexColor;
            div.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
            div.innerHTML = legendHtml;
            return div;
          };
          legendControl.addTo(mapRightInstance);
          mapRightInstance.legendControl = legendControl;
        }

        // Adjust Right Map Zoom Priority (Focus on Polygons if they exist)
        setTimeout(() => {
          mapLeftInstance.invalidateSize();
          mapRightInstance.invalidateSize();

          // Fit Left Map to whole Bihar outline
          if (leftLayer.getLayers().length > 0) {
            biharBoundsLeft = leftLayer.getBounds();
            mapLeftInstance.fitBounds(biharBoundsLeft, {
              padding: [10, 10],
              animate: false,
            });
          }

          if (customPolygonsGroup.getLayers().length > 0) {
            warningBoundsRight = customPolygonsGroup.getBounds();
            mapRightInstance.fitBounds(warningBoundsRight, {
              padding: [10, 10],
              maxZoom: 15,
              animate: false,
            });
          } else if (selectedRightFeaturesGroup.getLayers().length > 0) {
            warningBoundsRight = selectedRightFeaturesGroup.getBounds();
            mapRightInstance.fitBounds(warningBoundsRight, {
              padding: [10, 10],
              maxZoom: 15,
              animate: false,
            });
          }
        }, 800); // Ensure DOM is fully painted before calculating fitBounds on export
      })
      .catch((e) => console.error("Error loading GeoJSON for export map:", e));
  }, 800); // Slight delay increase to sync with display rendering
}

// --- BULLETIN EDIT MODE AND MAP TOOLS ---

window.toggleBulletinEditMode = function (isEdit) {
  document.getElementById("warningTextHindi").contentEditable = isEdit;
  document.getElementById("warningTextEnglish").contentEditable = isEdit;

  const toolbar = document.getElementById("miniMapEditorToolbar");
  if (toolbar) toolbar.style.display = isEdit ? "block" : "none";

  [mapLeftInstance, mapRightInstance].forEach((m, idx) => {
    if (m) {
      if (isEdit) {
        m.dragging.enable();
        m.touchZoom.enable();
        m.doubleClickZoom.enable();
        m.scrollWheelZoom.enable();
        m.boxZoom.enable();
        m.keyboard.enable();

        if (idx === 0 && !leftZoomCtrl) {
          leftZoomCtrl = L.control.zoom({ position: "topleft" }).addTo(m);
        } else if (idx === 1 && !rightZoomCtrl) {
          rightZoomCtrl = L.control.zoom({ position: "topleft" }).addTo(m);
        }
      } else {
        m.dragging.disable();
        m.touchZoom.disable();
        m.doubleClickZoom.disable();
        m.scrollWheelZoom.disable();
        m.boxZoom.disable();
        m.keyboard.disable();

        if (idx === 0 && leftZoomCtrl) {
          m.removeControl(leftZoomCtrl);
          leftZoomCtrl = null;
        }
        if (idx === 1 && rightZoomCtrl) {
          m.removeControl(rightZoomCtrl);
          rightZoomCtrl = null;
        }
      }
    }
  });

  // visual hint for editable text
  const hiTxt = document.getElementById("warningTextHindi");
  const enTxt = document.getElementById("warningTextEnglish");
  if (isEdit) {
    if (hiTxt) {
      hiTxt.style.border = "1px dashed #007bff";
      hiTxt.style.padding = "5px";
      hiTxt.style.backgroundColor = "#f8f9fa";
    }
    if (enTxt) {
      enTxt.style.border = "1px dashed #007bff";
      enTxt.style.padding = "5px";
      enTxt.style.backgroundColor = "#f8f9fa";
    }
  } else {
    if (hiTxt) {
      hiTxt.style.border = "none";
      hiTxt.style.padding = "0";
      hiTxt.style.backgroundColor = "transparent";
    }
    if (enTxt) {
      enTxt.style.border = "none";
      enTxt.style.padding = "0";
      enTxt.style.backgroundColor = "transparent";
    }
  }
};

window.updateMiniMapSize = function () {
  const h = document.getElementById("miniMapHeightSlider").value;
  const valLabel = document.getElementById("miniMapHeightVal");
  if (valLabel) valLabel.innerText = h;

  const mapSec = document.getElementById("mapSectionInCard");
  if (mapSec) {
    mapSec.style.height = h + "px";
  }
  if (mapLeftInstance) mapLeftInstance.invalidateSize();
  if (mapRightInstance) mapRightInstance.invalidateSize();
};

window.updateMiniMapWidth = function () {
  const leftPct = document.getElementById("miniMapWidthSlider").value;
  const rightPct = 100 - leftPct;

  const valLabel = document.getElementById("miniMapWidthVal");
  if (valLabel) valLabel.innerText = leftPct + ":" + rightPct;

  const leftWrapper = document.getElementById("leftMapWrapper");
  const rightWrapper = document.getElementById("rightMapWrapper");

  if (leftWrapper) leftWrapper.style.width = `calc(${leftPct}% - 7.5px)`;
  if (rightWrapper) rightWrapper.style.width = `calc(${rightPct}% - 7.5px)`;

  if (mapLeftInstance) mapLeftInstance.invalidateSize();
  if (mapRightInstance) mapRightInstance.invalidateSize();
};

window.autoFitBiharRatio = function () {
  const mapSec = document.getElementById("mapSectionInCard");
  if (mapSec && mapSec.children[0]) {
    const leftMapDiv = mapSec.children[0]; // 40% div
    const currentWidth = leftMapDiv.offsetWidth;
    const targetHeight = currentWidth / 1.65;

    const slider = document.getElementById("miniMapHeightSlider");
    if (slider) slider.value = Math.round(targetHeight);

    window.updateMiniMapSize(); // Apply height
    setTimeout(() => window.autoFitBiharMap(), 100); // Wait for DOM resize then center
  }
};

window.autoFitBiharMap = function () {
  if (mapLeftInstance && biharBoundsLeft) {
    mapLeftInstance.fitBounds(biharBoundsLeft, { padding: [10, 10] });
  }
  if (mapRightInstance && warningBoundsRight) {
    mapRightInstance.fitBounds(warningBoundsRight, { padding: [10, 10] });
  }
};

window.changeMiniMapBaseLayer = function () {
  const type = document.getElementById("miniMapBaseLayer").value;
  const getLayer = (type) => {
    switch (type) {
      case "street":
        return L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        );
      case "satellite":
        return L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        );
      case "hybrid":
        return L.layerGroup([
          L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          ),
          L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
          ),
        ]);
      case "topo":
        return L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png");
      case "terrain":
        return L.tileLayer(
          "http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
          { subdomains: ["mt0", "mt1", "mt2", "mt3"] },
        );
      case "clear":
        return L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        );
      default:
        return L.layerGroup();
    }
  };

  if (mapLeftInstance) {
    if (currentMiniBaseLayerLeft)
      mapLeftInstance.removeLayer(currentMiniBaseLayerLeft);
    currentMiniBaseLayerLeft = getLayer(type).addTo(mapLeftInstance);
    currentMiniBaseLayerLeft.bringToBack();
  }
  if (mapRightInstance) {
    if (currentMiniBaseLayerRight)
      mapRightInstance.removeLayer(currentMiniBaseLayerRight);
    currentMiniBaseLayerRight = getLayer(type).addTo(mapRightInstance);
    currentMiniBaseLayerRight.bringToBack();
  }
};

window.toggleMiniMapGrid = function () {
  const enabled = document.getElementById("miniMapGridToggle").checked;
  const color = document.getElementById("miniMapGridColor").value;

  if (miniGridLayerLeft && mapLeftInstance)
    mapLeftInstance.removeLayer(miniGridLayerLeft);
  if (miniGridLayerRight && mapRightInstance)
    mapRightInstance.removeLayer(miniGridLayerRight);

  if (enabled && typeof L.latlngGraticule !== "undefined") {
    miniGridLayerLeft = L.latlngGraticule({
      showLabel: true,
      color: color,
      weight: 1,
      opacity: 0.6,
      zoomInterval: [{ start: 2, end: 15, interval: 0.5 }],
    }).addTo(mapLeftInstance);
    miniGridLayerRight = L.latlngGraticule({
      showLabel: true,
      color: color,
      weight: 1,
      opacity: 0.6,
      zoomInterval: [{ start: 2, end: 15, interval: 0.25 }],
    }).addTo(mapRightInstance);
  }
};

function downloadMapWarningImage() {
  // Just redirect to standard image download as everything is integrated now
  if (typeof downloadNowcastImage === "function") {
    downloadNowcastImage();
  }
}
