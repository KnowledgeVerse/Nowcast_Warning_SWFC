// js/geojsonLayers.js
// Dynamic GeoJSON Layer Management System

const geoJsonLayers = {
  state: null,
  district_hq: null,
  sub_district_hq: null,
  subdistricts: null,
  villages: null,
  fmo_patna: null,
  nh_bihar: null,
  railway: null,
  water_areas: null,
  water_lines: null,
};

// Configuration for each layer (path, default color, default opacity)
const geoJsonConfigs = {
  state: {
    name: "Bihar State",
    url: [
      "geojson/BIHAR_STATE.geojson",
      "geojson/Bihar_State.geojson",
      "geojson/bihar_state.geojson",
    ],
    color: "#2c3e50",
    opacity: 1.0,
    weight: 2,
  },
  district_hq: {
    name: "District HQ",
    url: [
      "geojson/BIHAR_District_Hq.geojson",
      "geojson/Bihar_District_Hq.geojson",
      "geojson/bihar_district_hq.geojson",
    ],
    color: "#e74c3c",
    opacity: 1.0,
    weight: 2,
  },
  sub_district_hq: {
    name: "Sub-District HQ",
    url: [
      "geojson/BIHAR_Sub_District_Hq.geojson",
      "geojson/BIHAR_Sub_District Hq.geojson",
      "geojson/bihar_sub_district_hq.geojson",
    ],
    color: "#e67e22",
    opacity: 1.0,
    weight: 2,
  },
  subdistricts: {
    name: "Sub-Districts",
    url: [
      "geojson/BIHAR_SUBDISTRICTS.geojson",
      "geojson/Bihar_Subdistricts.geojson",
      "geojson/bihar_subdistricts.geojson",
    ],
    color: "#000000",
    opacity: 0.8,
    weight: 1.5,
  },
  villages: {
    name: "Villages",
    url: [
      "geojson/BIHAR_VILLAGES.geojson",
      "geojson/Bihar_Villages.geojson",
      "geojson/bihar_villages.geojson",
    ],
    color: "#16a085",
    opacity: 0.8,
    weight: 0.5,
  },
  fmo_patna: {
    name: "FMO Patna",
    url: [
      "geojson/FMO_Patna_Bihar.geojson",
      "geojson/FMO_Patna.geojson",
      "geojson/fmo_patna_bihar.geojson",
      "geojson/fmo_patna.geojson",
    ],
    color: "#f1c40f",
    opacity: 0.8,
    weight: 2,
  },
  nh_bihar: {
    name: "National Highways",
    url: [
      "geojson/NH_Bihar.geojson",
      "geojson/nh_bihar.geojson",
      "geojson/Nh_Bihar.geojson",
    ],
    color: "#e53935",
    opacity: 0.8,
    weight: 2,
  },
  railway: {
    name: "Railways",
    url: [
      "geojson/Railway_Bihar.geojson",
      "geojson/railway_bihar.geojson",
      "geojson/Railway_bihar.geojson",
    ],
    color: "#616161",
    opacity: 0.8,
    weight: 2,
  },
  water_areas: {
    name: "Water Areas",
    url: [
      "geojson/water_areas_dcw_Bihar.geojson",
      "geojson/water_areas_dcw_bihar.geojson",
      "geojson/Water_Areas_Dcw_Bihar.geojson",
    ],
    color: "#3498db",
    opacity: 0.8,
    weight: 2,
  },
  water_lines: {
    name: "Water Lines",
    url: [
      "geojson/Water_Lines_Bihar.geojson",
      "geojson/water_lines_bihar.geojson",
      "geojson/Water_lines_bihar.geojson",
    ],
    color: "#2980b9",
    opacity: 0.8,
    weight: 2,
  },
};

// Helper: Generate style for a layer dynamically
function getGeoJsonStyle(key) {
  return {
    color: geoJsonConfigs[key].color,
    weight: geoJsonConfigs[key].weight,
    opacity: geoJsonConfigs[key].opacity,
    fillColor: geoJsonConfigs[key].color,
    fillOpacity: 0, // 0 means completely transparent inside polygons
  };
}

// Core Function: Load layer dynamically (Lazy Load)
async function loadGeoJsonLayer(key) {
  // If already loaded, return cached instance
  if (geoJsonLayers[key]) {
    return geoJsonLayers[key];
  }

  try {
    if (typeof showLoading === "function") showLoading(); // Use existing loading overlay

    const urls = Array.isArray(geoJsonConfigs[key].url)
      ? geoJsonConfigs[key].url
      : [geoJsonConfigs[key].url];
    let response;
    for (const u of urls) {
      response = await fetch(u);
      if (response.ok) break;
    }

    if (!response || !response.ok)
      throw new Error(
        `HTTP Error: ${response ? response.status : "Not Found"}`,
      );

    const data = await response.json();

    const layer = L.geoJSON(data, {
      style: () => getGeoJsonStyle(key),
      pointToLayer: (feature, latlng) => {
        // Custom style for Point Features (Like HQ markers)
        return L.circleMarker(latlng, {
          radius: 3 + geoJsonConfigs[key].weight,
          fillColor: geoJsonConfigs[key].color,
          color: "#fff",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8, // keep points (HQ markers) slightly filled so they are visible
        });
      },
      onEachFeature: (feature, layer) => {
        // 1. Dynamic Popups mapping all properties
        let popupContent = `<div style="font-size: 13px; max-height: 200px; overflow-y: auto;">
          <strong style="color: ${geoJsonConfigs[key].color}; border-bottom: 1px solid #ccc; display:block; padding-bottom: 4px; margin-bottom: 5px;">
            ${geoJsonConfigs[key].name} Data
          </strong>`;
        if (feature.properties) {
          for (const prop in feature.properties) {
            popupContent += `<b>${prop}:</b> ${feature.properties[prop]}<br>`;
          }
        }
        popupContent += `</div>`;
        layer.bindPopup(popupContent);

        // 2. Hover Highlight Effect
        layer.on({
          mouseover: (e) => {
            const l = e.target;
            l.setStyle({ weight: 4, fillOpacity: 0.15 }); // slight fill on hover to know what is selected
            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
              l.bringToFront();
            }
          },
          mouseout: (e) => {
            geoJsonLayers[key].resetStyle(e.target);
          },
        });
      },
    });

    geoJsonLayers[key] = layer;

    if (typeof hideLoading === "function") hideLoading();
    return layer;
  } catch (err) {
    if (typeof hideLoading === "function") hideLoading();
    console.error(`Error loading GeoJSON for [${key}]:`, err);
    alert(
      `Could not load ${geoJsonConfigs[key].name} layer.\nEnsure file exists at: ${geoJsonConfigs[key].url}`,
    );
    return null;
  }
}

// UI Trigger: Toggle visibility and trigger fetch if needed
window.toggleCustomGeoJson = async function (key, isChecked) {
  if (typeof map === "undefined" || !map) return;

  if (isChecked) {
    const layer = await loadGeoJsonLayer(key);
    if (layer) {
      layer.addTo(map);
      // Fit bounds to newly activated layer
      map.fitBounds(layer.getBounds(), { padding: [20, 20] });
    } else {
      document.getElementById(`gj_chk_${key}`).checked = false; // reset UI if failed
    }
  } else {
    if (geoJsonLayers[key] && map.hasLayer(geoJsonLayers[key])) {
      map.removeLayer(geoJsonLayers[key]);
    }
  }
};

// UI Trigger: Live update of color and opacity
window.updateGeoJsonStyle = function (key) {
  geoJsonConfigs[key].color = document.getElementById(`gj_col_${key}`).value;
  geoJsonConfigs[key].opacity = parseFloat(
    document.getElementById(`gj_op_${key}`).value,
  );

  const wtEl = document.getElementById(`gj_wt_${key}`);
  if (wtEl) {
    geoJsonConfigs[key].weight = parseFloat(wtEl.value);
  }

  if (geoJsonLayers[key]) {
    geoJsonLayers[key].eachLayer((layer) => {
      if (layer instanceof L.CircleMarker) {
        layer.setRadius(3 + geoJsonConfigs[key].weight);
        layer.setStyle({
          fillColor: geoJsonConfigs[key].color,
          fillOpacity: 0.8,
        });
      } else if (layer.setStyle) {
        layer.setStyle(getGeoJsonStyle(key));
      }
    });
  }
};
