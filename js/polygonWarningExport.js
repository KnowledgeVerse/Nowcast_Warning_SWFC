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
            return {
              fillColor: isSelected ? hexColor : "#cccccc",
              weight: 1,
              color: "white",
              fillOpacity: isSelected ? 0.9 : 0.4,
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
              fillColor: hexColor,
              weight: 2,
              color: "#000",
              fillOpacity: 0.7,
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
            // Left map polygon
            L.polygon(layer.getLatLngs(), layer.options).addTo(mapLeftInstance);

            // Right map polygon
            let rightPoly = L.polygon(layer.getLatLngs(), layer.options).addTo(
              mapRightInstance,
            );
            customPolygonsGroup.addLayer(rightPoly);

            // Add Phenomena Icons if available
            if (
              layer.feature &&
              layer.feature.properties &&
              layer.feature.properties.phenomena
            ) {
              let iconsHtml = "";
              layer.feature.properties.phenomena.forEach((phenomId) => {
                let phenomObj = weatherPhenomena.find((p) => p.id === phenomId);
                if (phenomObj) iconsHtml += phenomObj.icon;
              });

              if (iconsHtml !== "") {
                let center = layer.getBounds().getCenter();
                let iconMarker = L.marker(center, {
                  icon: L.divIcon({
                    className: "map-phenom-marker",
                    html: `<div style="background:rgba(255,255,255,0.85); padding:3px 6px; border-radius:6px; font-size:18px; border:2px solid ${layer.options.color || "#000"}; display:inline-block; white-space:nowrap; box-shadow:0 2px 5px rgba(0,0,0,0.3);">${iconsHtml}</div>`,
                    iconSize: null,
                  }),
                });
                iconMarker.addTo(mapRightInstance);
                customPolygonsGroup.addLayer(iconMarker);
              }
            }
          });
        }

        // Adjust Right Map Zoom Priority (Focus on Polygons if they exist)
        setTimeout(() => {
          if (customPolygonsGroup.getLayers().length > 0) {
            mapRightInstance.fitBounds(customPolygonsGroup.getBounds(), {
              padding: [40, 40],
              maxZoom: 10,
            });
          } else if (rightLayer.getLayers().length > 0) {
            mapRightInstance.fitBounds(rightLayer.getBounds(), {
              padding: [30, 30],
              maxZoom: 9,
            });
          }
        }, 100);
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
