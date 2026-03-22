// js/polygonWarningExport.js

let mapLeftInstance = null;
let mapRightInstance = null;

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
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      ).addTo(mapLeftInstance);
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
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      ).addTo(mapRightInstance);
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
              fillColor: applyColor ? hexColor : "#cccccc",
              weight: 1,
              color: "white",
              fillOpacity: applyColor ? 0.9 : 0.4,
            };
          },
        }).addTo(mapLeftInstance);
        mapLeftInstance.fitBounds(leftLayer.getBounds());

        // Render Right Zoomed View Structure
        const rightLayer = L.geoJSON(data, {
          filter: function (feature) {
            let dName = feature.properties.D_NAME;
            if (nameMapping[dName]) dName = nameMapping[dName];

            if (typeof districtsData !== "undefined") {
              const dist = districtsData.find(
                (d) => d.name.toLowerCase() === dName.trim().toLowerCase(),
              );
              return dist && selectedDistricts.includes(dist.id);
            }
            return false;
          },
          style: function (feature) {
            return {
              fillColor: hasDrawnPolygons ? "transparent" : hexColor,
              weight: 2,
              color: "#000",
              fillOpacity: hasDrawnPolygons ? 0 : 0.7,
            };
          },
          onEachFeature: function (feature, layer) {
            let dName = feature.properties.D_NAME;
            if (nameMapping[dName]) dName = nameMapping[dName];
            layer.bindTooltip(dName.toUpperCase(), {
              permanent: true,
              direction: "center",
              className: "map-label",
              style:
                "font-weight: bold; background: transparent; border: none; box-shadow: none;",
            });
          },
        }).addTo(mapRightInstance);

        // Overlay custom Drawn Polygons onto Mini Maps
        let customPolygonsGroup = L.featureGroup();

        if (typeof drawnItems !== "undefined") {
          drawnItems.eachLayer((layer) => {
            // Use the feature property color to avoid exporting selection dashes/styles
            const warningCol =
              layer.feature?.properties?.warningColor ||
              layer.options.fillColor ||
              hexColor;
            const polyStyle = {
              color: warningCol,
              fillColor: warningCol,
              weight: 3,
              fillOpacity: 0.6,
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

          if (customPolygonsGroup.getLayers().length > 0) {
            mapRightInstance.fitBounds(customPolygonsGroup.getBounds(), {
              padding: [30, 30],
              maxZoom: 14,
              animate: false,
            });
          } else if (rightLayer.getLayers().length > 0) {
            mapRightInstance.fitBounds(rightLayer.getBounds(), {
              padding: [30, 30],
              maxZoom: 14,
              animate: false,
            });
          }
        }, 400);
      })
      .catch((e) => console.error("Error loading GeoJSON for export map:", e));
  }, 600); // 600ms matches the timeout in generateNowcast()
}

function downloadMapWarningImage() {
  // Just redirect to standard image download as everything is integrated now
  if (typeof downloadNowcastImage === "function") {
    downloadNowcastImage();
  }
}
