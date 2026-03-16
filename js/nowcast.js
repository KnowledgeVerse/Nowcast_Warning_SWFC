// Nowcast Weather Warning System - Main JavaScript

// Global state
let selectedDistricts = [];
let selectedWarningLevel = "yellow";
let selectedPhenomena = [];
let selectedWindSpeed = "30-40";
let selectedIntensity = 0;
let isAutoTimeUpdate = true; // Flag for auto-update
let timeUpdateInterval; // Interval reference
let map = null;
let districtLayers = {};

// --- Added Missing Data ---
const weatherPhenomena = [
  { id: "thunderstorm", name: "Thunderstorm", hindi: "मेघ गर्जन", icon: "⛈️" },
  { id: "lightning", name: "Lightning", hindi: "वज्रपात", icon: "⚡" },
  { id: "hail", name: "Hailstorm", hindi: "ओलावृष्टि", icon: "🌨️" },
  { id: "rain", name: "Rain", hindi: "वर्षा", icon: "🌧️" },
  { id: "gusty_wind", name: "Gusty Wind", hindi: "तेज हवा", icon: "🌬️" },
];

const warningConfig = {
  yellow: {
    code: "YELLOW",
    action: "Watch (Be Updated)",
    bgClass: "yellow",
    guideline:
      "इस मौसम को देखते हुए लोगों से आग्रह है कि वे सतर्क और सावधान रहें।",
  },
  orange: {
    code: "ORANGE",
    action: "Alert (Be Prepared)",
    bgClass: "orange",
    guideline:
      "लोगों से आग्रह है कि वे सतर्क रहें। यदि आप खुले में हों तो शीघ्रताशीघ्र किसी पक्के मकान की शरण लें।",
  },
  red: {
    code: "RED",
    action: "Warning (Take Action)",
    bgClass: "red",
    guideline:
      "अत्यंत सतर्क रहें। बिजली के खंभों और ऊँचे पेड़ों से दूर रहें। सुरक्षित स्थानों पर रहें।",
  },
};

const intensityLevels = {
  hi: ["हल्का", "मध्यम", "तीव्र", "अत्यंत तीव्र"],
  en: ["Light", "Moderate", "Severe", "Very Severe"],
};

const defaultEmails =
  "seoc-dmd-bihar@bihar.gov.in, aananda.shanker@gmail.com, NWFC <nowcastdivision@gmail.com>, secy-disastermgmt-bih <secy-disastermgmt-bih@nic.in>, State Eoc Disaster Management Bihar <disasterseocbih@gmail.com>, 9 BN NDRF BIHTA PATNA <ndrfpatna@gmail.com>";
// --------------------------

// Initialize on page load
document.addEventListener("DOMContentLoaded", function () {
  initializeMap();
  loadDistricts();
  loadPhenomena();
  setupEventListeners();

  // Start Time Module
  updateDateTime();
  timeUpdateInterval = setInterval(updateDateTime, 300000); // Update every 5 minutes

  // Set default warning level
  selectWarningLevel("yellow");

  // Footer Load Script
  fetch("footer.html")
    .then((response) => response.text())
    .then((data) => {
      const footerContainer = document.getElementById("footer-container");
      if (footerContainer) footerContainer.innerHTML = data;
    })
    .catch((error) => console.error("Error loading footer:", error));
});

// Helper: Get region color based on global subRegionDistricts
function getDistrictRegionColor(id) {
  if (typeof subRegionDistricts !== "undefined") {
    if (subRegionDistricts.nw && subRegionDistricts.nw.includes(id))
      return "#00897b";
    if (subRegionDistricts.nc && subRegionDistricts.nc.includes(id))
      return "#1976d2";
    if (subRegionDistricts.ne && subRegionDistricts.ne.includes(id))
      return "#673ab7";
    if (subRegionDistricts.sw && subRegionDistricts.sw.includes(id))
      return "#f44336";
    if (subRegionDistricts.sc && subRegionDistricts.sc.includes(id))
      return "#fbc02d";
    if (subRegionDistricts.se && subRegionDistricts.se.includes(id))
      return "#795548";
  }
  return "#3388ff";
}

// Initialize Leaflet Map
function initializeMap() {
  // 1. Define Base Layers (Street, Satellite, Hybrid, Clear)
  const streetLayer = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    },
  );

  const satelliteLayer = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution: "Tiles © Esri",
      maxZoom: 19,
    },
  );

  const hybridLayer = L.layerGroup([
    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { attribution: "Tiles © Esri", maxZoom: 19 },
    ),
    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
      { attribution: "Tiles © Esri", maxZoom: 19 },
    ),
  ]);

  const clearLayer = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
      attribution: "© OpenStreetMap, © CARTO",
      maxZoom: 19,
    },
  );

  // 2. Define "Solid Color" Layer (Empty layer for custom background)
  const solidColorLayer = L.layerGroup();

  map = L.map("map", {
    center: [25.6, 85.6],
    zoom: 7,
    zoomControl: true,
    scrollWheelZoom: false,
    layers: [solidColorLayer], // Default layer set to Solid/Clear per request
  });

  // Dynamic Font Size for Map Labels based on Zoom Level
  map.on("zoomend", function () {
    const zoom = map.getZoom();
    let fontSize = "11px"; // Default
    if (zoom <= 6) fontSize = "9px";
    else if (zoom === 7) fontSize = "11px";
    else if (zoom === 8) fontSize = "14px";
    else if (zoom >= 9) fontSize = "16px";
    document
      .getElementById("map")
      .style.setProperty("--label-font-size", fontSize);
  });

  // Add Layer Control to Map
  const baseMaps = {
    "Solid/Clear": solidColorLayer,
    Street: streetLayer,
    Satellite: satelliteLayer,
    Hybrid: hybridLayer,
    "Light Theme": clearLayer,
  };
  L.control.layers(baseMaps).addTo(map);

  // --- Map Background Color Logic ---
  const mapDiv = document.getElementById("map");
  const colorInput = document.getElementById("mapBgColor");

  // Set initial background (White)
  if (mapDiv && colorInput) {
    mapDiv.style.backgroundColor = colorInput.value;

    colorInput.addEventListener("input", (e) => {
      // Change background color
      mapDiv.style.backgroundColor = e.target.value;

      // Automatically switch to 'Solid/Clear' layer so color is visible
      if (!map.hasLayer(solidColorLayer)) {
        // Remove other base layers
        [streetLayer, satelliteLayer, hybridLayer, clearLayer].forEach(
          (layer) => {
            if (map.hasLayer(layer)) {
              map.removeLayer(layer);
            }
          },
        );
        // Add solid layer
        map.addLayer(solidColorLayer);
      }
    });
  }
  // ----------------------------------

  // Define UTM Zone 45N projection (used in your GeoJSON)
  if (typeof proj4 !== "undefined") {
    proj4.defs(
      "EPSG:32645",
      "+proj=utm +zone=45 +datum=WGS84 +units=m +no_defs",
    );
  }

  // Load Bihar Map from GeoJSON
  // Fix for Hostinger/Linux Case Sensitivity: Try multiple filename variations
  const possiblePaths = [
    "data/bihar_districts.geojson", // Standard lowercase
    "data/Bihar_Districts.geojson", // CamelCase file
    "Data/bihar_districts.geojson", // Capitalized Folder
    "Data/Bihar_Districts.geojson", // Both Capitalized
    "data/bihar_district.geojson", // Singular name check
  ];

  // Recursive function to try loading paths one by one
  const loadGeoJSON = (paths, index) => {
    if (index >= paths.length) {
      return Promise.reject(
        new Error("Map file not found in any common path (404)."),
      );
    }
    return fetch(paths[index]).then((response) => {
      if (!response.ok) return loadGeoJSON(paths, index + 1);
      return response.json();
    });
  };

  loadGeoJSON(possiblePaths, 0)
    .then((data) => {
      // Check and Convert coordinates if they are in UTM (large numbers)
      if (typeof proj4 !== "undefined" && data.features.length > 0) {
        const sample = getSampleCoord(data.features[0].geometry.coordinates);
        // If coordinate > 180, it means it's projected (Meters), not Degrees
        if (sample && sample[0] > 180) {
          console.log("Converting coordinates from UTM to Lat/Lng...");
          data.features.forEach((f) => {
            f.geometry.coordinates = convertCoordinates(f.geometry.coordinates);
          });
        }
      }

      const geojsonLayer = L.geoJSON(data, {
        style: function (feature) {
          return {
            fillColor: "#3388ff",
            weight: 2,
            opacity: 1,
            color: "white",
            dashArray: "3",
            fillOpacity: 0.3,
          };
        },
        onEachFeature: function (feature, layer) {
          let districtName = feature.properties.D_NAME;
          let displayName = districtName; // Default to GeoJSON name

          // Name Mapping: Match GeoJSON names to CSV/App names
          const nameMapping = {
            Purnia: "PURNEA",
            Munger: "MONGHYR",
            "Kaimur (Bhabua)": "BHABUA",
            Kaimur: "BHABUA",
            Jehanabad: "JAHANABAD",
            "Purba Champaran": "EAST CHAMPARAN",
            "Pashchim Champaran": "WEST CHAMPARAN",
            "East Champaran": "EAST CHAMPARAN",
            East_Champaran: "EAST CHAMPARAN", // Added underscore support
            "West Champaran": "WEST CHAMPARAN",
            West_Champaran: "WEST CHAMPARAN", // Added underscore support
            Khagaria: "KHAGARIA",
            Lakhisarai: "LAKHISARAI",
            Sheikhpura: "SHEIKHPURA",
            Aurangabad: "AURANGABAD",
            Begusarai: "BEGUSARAI",
            Bhojpur: "BHOJPUR",
            Buxar: "BUXAR",
            Darbhanga: "DARBHANGA",
            Gaya: "GAYA",
            Gopalganj: "GOPALGANJ",
            Jamui: "JAMUI",
            Katihar: "KATIHAR",
            Kishanganj: "KISHANGANJ",
            Madhepura: "MADHEPURA",
            Madhubani: "MADHUBANI",
            Muzaffarpur: "MUZAFFARPUR",
            Nalanda: "NALANDA",
            Nawada: "NAWADA",
            Patna: "PATNA",
            Rohtas: "ROHTAS",
            Saharsa: "SAHARSA",
            Samastipur: "SAMASTIPUR",
            Saran: "SARAN",
            Sitamarhi: "SITAMARHI",
            Siwan: "SIWAN",
            Supaul: "SUPAUL",
            Vaishali: "VAISHALI",
            Araria: "ARARIA",
            Arwal: "ARWAL",
            Banka: "BANKA",
            Bhagalpur: "BHAGALPUR",
            Sheohar: "SHEOHAR",
          };

          if (nameMapping[districtName]) {
            districtName = nameMapping[districtName];
          }

          // Find matching district in global districtsData array
          if (typeof districtsData !== "undefined") {
            const district = districtsData.find(
              (d) => d.name.toLowerCase() === districtName.trim().toLowerCase(),
            );

            if (district) {
              displayName = district.name; // Use App Name (UPPERCASE)
              districtLayers[district.id] = layer;
              layer.bindPopup(`<b>${district.hindi}</b><br>${district.name}`);
              layer.on("click", (e) => {
                L.DomEvent.stopPropagation(e); // Stop click from propagating
                toggleDistrict(district.id);
              });

              // Apply region specific transparent color on load
              layer.setStyle({
                fillColor: getDistrictRegionColor(district.id),
                fillOpacity: 0.3,
              });

              // Add hover effect
              layer.on("mouseover", function () {
                if (!selectedDistricts.includes(district.id)) {
                  this.setStyle({ weight: 4, fillOpacity: 0.6 });
                }
              });
              layer.on("mouseout", function () {
                if (!selectedDistricts.includes(district.id)) {
                  this.setStyle({ weight: 2, fillOpacity: 0.3 });
                }
              });
            }
          }

          // Always Display District Name (Tooltip) - even if match fails
          layer.bindTooltip(displayName, {
            permanent: true,
            direction: "center",
            className: "district-label",
          });
        },
      }).addTo(map);

      map.fitBounds(geojsonLayer.getBounds());
    })
    .catch((error) => {
      console.error("Error loading map data:", error);
      alert(
        "Error: मैप डेटा लोड नहीं हो सका / Map Data could not be loaded.\n\n" +
          "Detail: " +
          error.message +
          "\n\n" +
          "Hostinger Fix: Ensure 'bihar_districts.geojson' exists in 'data' folder and matches Case Sensitivity.",
      );
    });
}

// Helper: Get sample coordinate to check projection
function getSampleCoord(coords) {
  if (typeof coords[0] === "number") return coords;
  return getSampleCoord(coords[0]);
}

// Helper: Recursive coordinate conversion
function convertCoordinates(coords) {
  if (typeof coords[0] === "number") {
    // Convert [x, y] from UTM 45N to [lon, lat] WGS84
    return proj4("EPSG:32645", "EPSG:4326", coords);
  } else {
    return coords.map(convertCoordinates);
  }
}

// Load districts into grid
function loadDistricts() {
  const grid = document.getElementById("districtGrid");
  grid.innerHTML = "";

  districtsData.forEach((district) => {
    const label = document.createElement("label");
    label.className = "district-checkbox";
    label.dataset.id = district.id;
    label.innerHTML = `
            <input type="checkbox" value="${district.id}" onchange="toggleDistrict(${district.id})">
            <span>${district.hindi} (${district.name})</span>
        `;
    grid.appendChild(label);
  });
}

// Load phenomena into grid
function loadPhenomena() {
  const grid = document.getElementById("phenomenaGrid");
  grid.innerHTML = "";

  weatherPhenomena.forEach((phenom) => {
    const label = document.createElement("label"); // Changed from div to label for better clicking
    label.className = "phenomena-item";
    label.dataset.id = phenom.id;
    label.innerHTML = `
            <input type="checkbox" value="${phenom.id}" onchange="togglePhenomena('${phenom.id}')">
            <span class="phenomena-icon">${phenom.icon}</span>
            <span>${phenom.hindi}</span>
        `;
    grid.appendChild(label);
  });
}

// Setup event listeners
function setupEventListeners() {
  // District search
  document
    .getElementById("districtSearch")
    .addEventListener("input", function (e) {
      const searchTerm = e.target.value.toLowerCase();
      document.querySelectorAll(".district-checkbox").forEach((label) => {
        const text = label.textContent.toLowerCase();
        label.style.display = text.includes(searchTerm) ? "flex" : "none";
      });
    });

  // Intensity selector
  document
    .getElementById("intensitySelector")
    .addEventListener("change", function (e) {
      selectedIntensity = parseInt(e.target.value);
    });
}

// अपडेट: चुने हुए जिलों की संख्या दिखाएं
function updateDistrictCount() {
  const countEl = document.getElementById("selectedDistrictCount");
  if (countEl) {
    countEl.innerText = selectedDistricts.length;
  }
}

// जिले चुनने पर लिस्ट को रिऑर्डर करें (चुने हुए सबसे ऊपर)
function reorderDistrictList() {
  const grid = document.getElementById("districtGrid");
  if (!grid) return;
  const labels = Array.from(grid.querySelectorAll(".district-checkbox"));
  labels.sort((a, b) => {
    const aSelected = a.classList.contains("selected");
    const bSelected = b.classList.contains("selected");
    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;
    return parseInt(a.dataset.id) - parseInt(b.dataset.id); // बाकी को डिफ़ॉल्ट क्रम में रखें
  });
  labels.forEach((label) => grid.appendChild(label));
}

// Toggle district selection
function toggleDistrict(districtId, skipZoom = false) {
  const index = selectedDistricts.indexOf(districtId);
  const checkbox = document.querySelector(
    `#districtGrid input[value="${districtId}"]`,
  );
  const label = document.querySelector(
    `.district-checkbox[data-id="${districtId}"]`,
  );

  if (index === -1) {
    selectedDistricts.push(districtId);
    if (checkbox) checkbox.checked = true;
    if (label) label.classList.add("selected");

    // Update map marker
    if (districtLayers[districtId]) {
      districtLayers[districtId].setStyle({
        fillColor: getDistrictRegionColor(districtId),
        weight: 3,
        color: "white",
        fillOpacity: 0.9,
      });
    }
  } else {
    selectedDistricts.splice(index, 1);
    if (checkbox) checkbox.checked = false;
    if (label) label.classList.remove("selected");

    // Update map marker back to transparent
    if (districtLayers[districtId]) {
      districtLayers[districtId].setStyle({
        fillColor: getDistrictRegionColor(districtId),
        weight: 2,
        color: "white",
        fillOpacity: 0.3,
      });
    }
  }

  reorderDistrictList(); // लिस्ट अपडेट करें
  updateDistrictCount(); // संख्या अपडेट करें

  // Auto-zoom to selected districts
  const autoZoomEnabled = document.getElementById("autoZoomToggle")?.checked;
  if (!skipZoom && map && autoZoomEnabled) {
    if (selectedDistricts.length > 0) {
      const group = L.featureGroup();
      selectedDistricts.forEach((id) => {
        if (districtLayers[id]) {
          group.addLayer(districtLayers[id]);
        }
      });
      if (group.getLayers().length > 0) {
        map.fitBounds(group.getBounds(), { maxZoom: 9, padding: [20, 20] });
      }
    } else {
      map.setView([25.6, 85.6], 7);
    }
  }
}
// Select all districts
function selectAllDistricts() {
  const group = L.featureGroup(); // बाउंड्स (Bounds) कैलकुलेट करने के लिए ग्रुप बनाएं
  districtsData.forEach((d) => {
    if (!selectedDistricts.includes(d.id)) {
      toggleDistrict(d.id, true); // bulk action me zoom skip karein
    }
    if (districtLayers[d.id]) {
      group.addLayer(districtLayers[d.id]);
    }
  });

  // मैप को सभी चुने हुए जिलों के हिसाब से फिट करें
  const autoZoomEnabled = document.getElementById("autoZoomToggle")?.checked;
  if (map && group.getLayers().length > 0 && autoZoomEnabled) {
    map.fitBounds(group.getBounds(), { maxZoom: 9, padding: [20, 20] });
  }
}
function clearDistricts() {
  [...selectedDistricts].forEach((id) => toggleDistrict(id, true)); // bulk action me zoom skip karein

  const autoZoomEnabled = document.getElementById("autoZoomToggle")?.checked;
  if (map && autoZoomEnabled) {
    map.setView([25.6, 85.6], 7); // मैप को डिफ़ॉल्ट ज़ूम पर सेट करें
  }
}

// Toggle phenomena selection
function togglePhenomena(phenomId) {
  const index = selectedPhenomena.indexOf(phenomId);
  const item = document.querySelector(`.phenomena-item[data-id="${phenomId}"]`);

  if (index === -1) {
    selectedPhenomena.push(phenomId);
    if (item) item.classList.add("selected");
  } else {
    selectedPhenomena.splice(index, 1);
    if (item) item.classList.remove("selected");
  }

  // Toggle Wind Speed Section visibility based on 'Gusty Wind'
  if (phenomId === "gusty_wind") {
    const windSection = document.getElementById("windSpeedSection");
    if (windSection) {
      const isSelected = selectedPhenomena.includes("gusty_wind");
      windSection.style.display = isSelected ? "block" : "none";
      if (!isSelected) selectWindSpeed(null); // Clear selection if hidden
    }
  }
}

// Select warning level
function selectWarningLevel(level) {
  selectedWarningLevel = level;
  document.querySelectorAll(".warning-option").forEach((opt) => {
    opt.classList.remove("selected");
    opt.querySelector("input").checked = false;
  });

  const selectedOption = document.querySelector(`.warning-option.${level}`);
  if (selectedOption) {
    selectedOption.classList.add("selected");
    selectedOption.querySelector("input").checked = true;
  }
}

// Select wind speed
function selectWindSpeed(speed) {
  selectedWindSpeed = speed;
  document.querySelectorAll(".wind-option").forEach((opt) => {
    opt.classList.remove("selected");
    opt.querySelector("input").checked = false;
  });

  // Find the clicked option
  const options = document.querySelectorAll(".wind-option");
  options.forEach((opt) => {
    if (opt.querySelector("input").value === speed) {
      opt.classList.add("selected");
      opt.querySelector("input").checked = true;
    }
  });
}

// Toggle multiple districts automatically by Region checkbox
function toggleRegion(region, isChecked) {
  if (typeof subRegionDistricts !== "undefined" && subRegionDistricts[region]) {
    const districts = subRegionDistricts[region];
    districts.forEach((districtId) => {
      const isSelected = selectedDistricts.includes(districtId);
      if (isChecked && !isSelected) {
        toggleDistrict(districtId, true); // bulk action me zoom skip karein
      } else if (!isChecked && isSelected) {
        toggleDistrict(districtId, true); // bulk action me zoom skip karein
      }
    });

    // Auto-zoom to selected districts
    const autoZoomEnabled = document.getElementById("autoZoomToggle")?.checked;
    if (map && autoZoomEnabled) {
      if (selectedDistricts.length > 0) {
        const group = L.featureGroup();
        selectedDistricts.forEach((id) => {
          if (districtLayers[id]) {
            group.addLayer(districtLayers[id]);
          }
        });
        if (group.getLayers().length > 0) {
          map.fitBounds(group.getBounds(), { maxZoom: 9, padding: [20, 20] });
        }
      } else {
        map.setView([25.6, 85.6], 7);
      }
    }
  }
}

// Update date and time
function updateDateTime() {
  if (!isAutoTimeUpdate) return;
  const now = new Date();
  // समय को निकटतम 5 मिनट के गुणज में राउंड करें (Round to nearest 5 minutes)
  const coeff = 1000 * 60 * 5;
  const roundedDate = new Date(Math.round(now.getTime() / coeff) * coeff);
  updateTimeDisplay(roundedDate);
}

function updateTimeDisplay(dateObj) {
  const formatCustomDate = (d) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[d.getMonth()];
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 बजे को 12 दिखाएं
    const strHours = String(hours).padStart(2, "0");
    return `${month} ${day},${year} ; ${strHours}:${minutes} ${ampm}`;
  };
  const timeStr = formatCustomDate(dateObj);
  const issueEl = document.getElementById("issueDateTime");
  if (issueEl) issueEl.innerText = timeStr;

  const validDate = new Date(dateObj.getTime() + 3 * 60 * 60 * 1000); // +3 hours
  const validStr = formatCustomDate(validDate);
  const validEl = document.getElementById("validityTime");
  if (validEl) validEl.innerText = validStr;
}

function toggleTimeManualMode() {
  isAutoTimeUpdate = !isAutoTimeUpdate;
  const btn = document.querySelector(".btn-time-edit");
  const inputs = document.getElementById("manualTimeInputs");

  if (isAutoTimeUpdate) {
    if (btn) {
      btn.classList.remove("active");
      btn.innerHTML = '<i class="fas fa-edit"></i> Edit Time';
    }
    if (inputs) inputs.style.display = "none";
    updateDateTime();
  } else {
    if (btn) {
      btn.classList.add("active");
      btn.innerHTML = '<i class="fas fa-times"></i> Cancel Edit';
    }
    if (inputs) inputs.style.display = "block";
    const now = new Date();
    const coeff = 1000 * 60 * 5;
    const roundedDate = new Date(Math.round(now.getTime() / coeff) * coeff);
    roundedDate.setMinutes(
      roundedDate.getMinutes() - roundedDate.getTimezoneOffset(),
    );
    const manualInput = document.getElementById("manualIssueInput");
    if (manualInput) manualInput.value = roundedDate.toISOString().slice(0, 16);
  }
}

function applyManualTime() {
  const inputVal = document.getElementById("manualIssueInput").value;
  if (inputVal) {
    const manualDate = new Date(inputVal);
    updateTimeDisplay(manualDate);
  }
}

// Generate Nowcast (Updated Logic from index.html)
function generateNowcast() {
  // 1. Get Selected Districts
  const selectedDistrictsList = [];
  const districtCheckboxes = document.querySelectorAll(
    ".district-checkbox.selected",
  ); // Assuming class 'selected' is toggled
  // Also check for checked inputs just in case class isn't used alone
  document
    .querySelectorAll(".district-checkbox input:checked")
    .forEach((input) => {
      const parent = input.closest(".district-checkbox");
      if (!parent.classList.contains("selected")) {
        // Add if not already processed via class
        const label = parent.innerText.trim();
        processDistrictLabel(label, selectedDistrictsList);
      }
    });

  // Use class based selection primary
  districtCheckboxes.forEach((cb) => {
    const label = cb.innerText.trim();
    processDistrictLabel(label, selectedDistrictsList);
  });

  // Deduplicate logic just in case
  const uniqueDistricts = [
    ...new Map(
      selectedDistrictsList.map((item) => [item["en"], item]),
    ).values(),
  ];

  // Validation
  if (uniqueDistricts.length === 0) {
    alert(
      "कृपया कम से कम एक जिला चुनें!\nPlease select at least one district!",
    );
    return;
  }

  // 2. Format District Lists
  let districtTextEn = "";
  let districtTextHi = "";

  if (uniqueDistricts.length > 0) {
    // English Formatting
    const enNames = uniqueDistricts.map((d) => d.en.toUpperCase());
    if (enNames.length === 1) {
      districtTextEn = enNames[0] + " district";
    } else if (enNames.length === 2) {
      districtTextEn = enNames.join(" and ") + " districts";
    } else {
      const last = enNames.pop();
      districtTextEn = enNames.join(", ") + " and " + last + " districts";
    }

    // Hindi Formatting
    const hiNames = uniqueDistricts.map((d) => d.hi);
    if (hiNames.length === 1) {
      districtTextHi = hiNames[0] + " जिले";
    } else if (hiNames.length === 2) {
      districtTextHi = hiNames.join(" और ") + " जिले";
    } else {
      const last = hiNames.pop();
      districtTextHi = hiNames.join(", ") + " और " + last + " जिले";
    }
  } else {
    districtTextEn = "[SELECT DISTRICT]";
    districtTextHi = "[जिला चुनें]";
  }

  // 3. Get Warning Level
  const warningLevelInput = document.querySelector(
    'input[name="warningLevel"]:checked',
  );
  const warningLevel = warningLevelInput ? warningLevelInput.value : "green";

  // 4. Get Selected Phenomena & Select Template
  // Get all selected items
  const phenomenaItems = document.querySelectorAll(".phenomena-item.selected");

  // Map selected DOM elements back to data objects to maintain fixed order
  let selectedPhenomData = [];

  // We look for the ID stored in the input value within the label
  phenomenaItems.forEach((item) => {
    const input = item.querySelector("input");
    if (input) {
      const pData = weatherPhenomena.find((p) => p.id === input.value);
      if (pData) selectedPhenomData.push(pData);
    }
  });

  if (selectedPhenomData.length === 0) {
    alert(
      "कृपया कम से कम एक मौसम घटना चुनें!\nPlease select at least one weather phenomenon!",
    );
    return;
  }

  // Sort selected phenomena based on index in global weatherPhenomena array (Fixed Order)
  selectedPhenomData.sort((a, b) => {
    return weatherPhenomena.indexOf(a) - weatherPhenomena.indexOf(b);
  });

  // Check for specific conditions
  const hasWind = selectedPhenomData.some((p) => p.id === "gusty_wind");
  const hasHail = selectedPhenomData.some((p) => p.id === "hail");
  const hasRain = selectedPhenomData.some((p) => p.id === "rain");

  // Filter out Wind from the main list (handled separately in text generation)
  const mainPhenomena = selectedPhenomData.filter((p) => p.id !== "gusty_wind");

  // Determine Wind Speed Text based on Alert Level
  let windSpeedHi = "";
  let windSpeedEn = "";

  if (hasWind) {
    // Use selected wind speed if available, otherwise fallback to auto
    const windInput = document.querySelector('input[name="windSpeed"]:checked');
    let speedRange = windInput ? windInput.value : null;

    if (!speedRange) {
      speedRange = "30-40"; // Default
      if (warningLevel === "orange") speedRange = "40-50";
      if (warningLevel === "red") speedRange = "50-60";
      if (warningLevel === "red" && hasHail) speedRange = "60-70";
    }

    windSpeedHi = `(हवा की गति ${speedRange} कि.मी. प्रति घंटे तक)`;
    windSpeedEn = `(wind speed upto ${speedRange} Kmph)`;
  }

  // 5. Generate Warning Text
  let warningEn = "";
  let warningHi = "";

  // Construct Phenomena List String (Hindi)
  let phenomStrHi = "";
  if (mainPhenomena.length > 0) {
    let names = mainPhenomena.map((p) => {
      if (p.id === "rain" && warningLevel === "red") return "भारी वर्षा";
      return p.hindi;
    });

    if (names.length === 1) {
      phenomStrHi = names[0];
    } else {
      const last = names.pop();
      phenomStrHi = names.join(", ") + " तथा " + last;
    }
  }

  // Construct Phenomena List String (English)
  let phenomStrEn = "";
  if (mainPhenomena.length > 0) {
    let names = mainPhenomena.map((p) => {
      if (p.id === "rain" && warningLevel === "red") return "heavy rain";
      return p.name.toLowerCase();
    });

    if (names.length === 1) {
      phenomStrEn = names[0];
    } else {
      const last = names.pop();
      phenomStrEn = names.join(", ") + " and " + last;
    }
  }

  // Attach Wind to Phenomena String
  let fullPhenomHi = phenomStrHi;
  let fullPhenomEn = phenomStrEn;

  if (hasWind) {
    if (fullPhenomHi) fullPhenomHi += " के साथ तेज हवा " + windSpeedHi;
    else fullPhenomHi = "तेज हवा " + windSpeedHi;

    if (fullPhenomEn)
      fullPhenomEn += " accompanied with Gusty wind " + windSpeedEn;
    else fullPhenomEn = "Gusty wind " + windSpeedEn;
  }

  // GENERATE SENTENCES BASED ON WARNING LEVEL
  if (warningLevel === "yellow") {
    warningHi = `${districtTextHi} के कुछ भागों में अगले एक से तीन घंटे में हल्के से मध्यम दर्जे की ${fullPhenomHi} जारी रहने की संभावना है।`;
    warningEn = `Some parts of ${districtTextEn} would experience light to moderate ${fullPhenomEn} will continue in next one to three hours.`;
  } else if (warningLevel === "orange") {
    warningHi = `${districtTextHi} के कुछ भागों में अगले दो से तीन घंटे में मध्यम दर्जे की ${fullPhenomHi} होने की प्रबल संभावना है।`;
    warningEn = `Some parts of ${districtTextEn} would experience moderate ${fullPhenomEn} within next two to three hours.`;
  } else if (warningLevel === "red") {
    warningHi = `${districtTextHi} के कुछ भागों में अगले दो से तीन घंटे में तीव्र दर्जे की ${fullPhenomHi} की प्रबल संभावना है।`;
    warningEn = `Some parts of ${districtTextEn} would experience severe ${fullPhenomEn} within next two to three hours.`;
  } else {
    warningHi = "कोई चेतावनी नहीं।";
    warningEn = "No Warning.";
  }

  // Cleanup double spaces if any
  warningHi = warningHi.replace(/\s+/g, " ").trim();
  warningEn = warningEn.replace(/\s+/g, " ").trim();
  warningHi = warningHi.replace(/"/g, "");
  warningEn = warningEn.replace(/"/g, "");

  // 6. Update UI
  document.getElementById("warningTextHindi").innerText = warningHi;
  document.getElementById("warningTextEnglish").innerText = warningEn;

  // Update Warning Code Box
  const codeBox = document.getElementById("warningCodeBox");
  codeBox.className = `warning-code-box ${warningLevel}`;

  let codeTitle = "NO WARNING";
  if (warningLevel === "yellow") codeTitle = "YELLOW: Watch (be updated)";
  if (warningLevel === "orange") codeTitle = "ORANGE: Alert (be prepared)";
  if (warningLevel === "red") codeTitle = "RED: Warning (Take action)";
  codeBox.innerText = codeTitle;

  // Update Guidelines
  const guidelinesDiv = document.getElementById("guidelinesText");
  guidelinesDiv.className = `guidelines-text ${warningLevel}`;

  let guidelineHTML = "";
  if (
    warningLevel === "yellow" ||
    warningLevel === "orange" ||
    warningLevel === "red"
  ) {
    guidelineHTML = `
          <strong>नोट:</strong> इस मौसम को देखते हुए लोगों से आग्रह है कि वे सतर्क और सावधान रहें। यदि आप खुले में हों तो शीघ्रताशीघ्र किसी पक्के मकान की शरण लें। ऊँचे पेड़ और बिजली के खंभों से दूर रहें। किसान अपने खेतों में न जाएं एवं मौसम सामान्य होने की प्रतीक्षा करें।<br>
          <strong>Note:</strong> In view of this weather, people are requested to be alert and cautious. If you are in the open, take shelter in a concrete house as soon as possible. Stay away from tall trees and electric poles. Farmers should not go to their fields and wait for the weather to become normal.<br><br>
          इस मौसम की विस्तृत तथा अद्यतन जानकारी के लिए मौसम विज्ञान केंद्र, पटना की वेबसाइट देखें: / For detailed and updated information about this weather, visit the website of Meteorological Centre, Patna:<br>
          <strong>Website:</strong> <a href="https://mausam.imd.gov.in/patna/" target="_blank">https://mausam.imd.gov.in/patna/</a><br>
          <strong>Facebook:</strong> <a href="https://www.facebook.com/IMDpatna/" target="_blank">https://www.facebook.com/IMDpatna/</a><br>
          <strong>Twitter:</strong> <a href="https://twitter.com/imd_patna" target="_blank">https://twitter.com/imd_patna</a>
      `;
  } else {
    guidelineHTML = "No specific guidelines.";
  }
  guidelinesDiv.innerHTML = guidelineHTML;

  // Show Loading Animation & Display output
  showLoading();
  setTimeout(() => {
    hideLoading();
    document.getElementById("nowcastOutput").style.display = "block";
    document.getElementById("nowcastOutput").classList.add("active");
    document
      .getElementById("nowcastOutput")
      .scrollIntoView({ behavior: "smooth" });
  }, 500);
}

// Helper to process label "Name / नाम"
function processDistrictLabel(label, list) {
  let en = label;
  let hi = label;

  const match = label.match(/^(.+?)\s*\((.+?)\)$/);
  if (match) {
    hi = match[1].trim();
    en = match[2].trim();
  } else if (label.includes("/")) {
    const parts = label.split("/");
    en = parts[0].trim();
    hi = parts.length > 1 ? parts[1].trim() : en;
  }

  const exists = list.find((d) => d.en === en);
  if (!exists) {
    list.push({ en, hi });
  }
}

// Preview nowcast
function previewNowcast() {
  generateNowcast();
}

// Clear all selections
function clearAll() {
  clearDistricts();
  selectedPhenomena = [];
  document.querySelectorAll(".phenomena-item").forEach((item) => {
    item.classList.remove("selected");
    item.querySelector("input").checked = false;
  });

  // Clear region highlights map reset
  document
    .querySelectorAll('#regionSelector input[type="checkbox"]')
    .forEach((cb) => {
      cb.checked = false;
    });

  // Reset email modal if needed, though strictly not necessary as it regenerates on open
  if (document.getElementById("emailModal").style.display !== "none") {
    openEmailModal(); // Refresh if open
  }

  document.getElementById("nowcastOutput").classList.remove("active");

  // Reset map view to default center and zoom
  if (map) {
    map.setView([25.6, 85.6], 7);
  }
}

// --- Email Generation Logic (Updated per request) ---
function openEmailModal() {
  const modal = document.getElementById("emailModal");
  const textarea = document.getElementById("emailListText");

  // Get selected district emails
  const selectedDistrictEmails = selectedDistricts
    .map((id) => {
      const dist = districtsData.find((d) => d.id === id);
      return dist && dist.email ? dist.email : null;
    })
    .filter((email) => email !== null);

  // Combine default and selected
  let allEmails = defaultEmails;
  if (selectedDistrictEmails.length > 0) {
    // Join with comma and space
    allEmails += ", " + selectedDistrictEmails.join(", ");
  }

  textarea.value = allEmails;
  modal.style.display = "flex";
}

function closeEmailModal() {
  document.getElementById("emailModal").style.display = "none";
}

function copyEmailToClipboard() {
  const textarea = document.getElementById("emailListText");
  textarea.select();
  textarea.setSelectionRange(0, 99999); // For mobile devices

  // Use clipboard API if available, else execCommand fallback
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard
      .writeText(textarea.value)
      .then(() => {
        alert("Emails copied to clipboard! \nईमेल कॉपी कर लिए गए हैं!");
      })
      .catch((err) => {
        console.error("Async: Could not copy text: ", err);
        document.execCommand("copy");
        alert("Emails copied to clipboard! \nईमेल कॉपी कर लिए गए हैं!");
      });
  } else {
    document.execCommand("copy");
    alert("Emails copied to clipboard! \nईमेल कॉपी कर लिए गए हैं!");
  }
}

// Share emails on WhatsApp
function shareOnWhatsApp() {
  const textarea = document.getElementById("emailListText");
  const text = textarea.value;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent("यहाँ चयनित ईमेल पते हैं:\n\n" + text)}`;
  window.open(whatsappUrl, "_blank");
}

// Show loading overlay
function showLoading() {
  document.getElementById("loadingOverlay").classList.add("active");
}

// Hide loading overlay
function hideLoading() {
  document.getElementById("loadingOverlay").classList.remove("active");
}

// Helper: Get formatted filename with timestamp
function getNowcastFilename(extension) {
  const now = new Date();
  const d = String(now.getDate()).padStart(2, "0");
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const y = now.getFullYear();
  const h = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  return `Nowcast_${d}-${m}-${y}_${h}-${min}-${s}.${extension}`;
}

// Download as PDF
function downloadNowcastPDF() {
  const element = document.getElementById("warningCardContainer");

  html2canvas(element, {
    scale: 3,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff",
  }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jspdf.jsPDF("p", "mm", "a4");

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(getNowcastFilename("pdf"));
  });
}

// Download as Image
function downloadNowcastImage() {
  const element = document.getElementById("warningCardContainer");

  html2canvas(element, {
    scale: 3,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff",
  }).then((canvas) => {
    const link = document.createElement("a");
    link.download = getNowcastFilename("png");
    link.href = canvas.toDataURL();
    link.click();
  });
}

// Copy Nowcast Image to Clipboard
function copyNowcastImage() {
  const element = document.getElementById("warningCardContainer");
  showLoading();

  html2canvas(element, {
    scale: 3,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff",
  }).then((canvas) => {
    canvas.toBlob((blob) => {
      if (!navigator.clipboard || !window.ClipboardItem) {
        hideLoading();
        alert(
          "आपका ब्राउज़र इमेज कॉपी करने का समर्थन नहीं करता है। कृपया डाउनलोड विकल्प का उपयोग करें।\nYour browser does not support image copying. Please use download.",
        );
        return;
      }

      const item = new ClipboardItem({ "image/png": blob });
      navigator.clipboard
        .write([item])
        .then(() => {
          hideLoading();

          // Success Animation on Button
          const copyBtn = document.getElementById("copyImageBtn");
          if (copyBtn) {
            const originalHtml = copyBtn.innerHTML;
            copyBtn.innerHTML =
              '<i class="fas fa-check-circle" style="transform: scale(1.2);"></i> Copied!';
            copyBtn.style.background = "#28a745"; // Success Green Color

            // Revert back after 3 seconds
            setTimeout(() => {
              copyBtn.innerHTML = originalHtml;
              copyBtn.style.background = "#ff9800"; // Original Orange Color
            }, 3000);
          }

          // Show alert after a slight delay so button updates first
          setTimeout(() => {
            alert(
              "चेतावनी की इमेज सफलतापूर्वक कॉपी हो गई है! अब आप इसे कहीं भी (Ctrl+V) पेस्ट कर सकते हैं।\nWarning image copied to clipboard successfully!",
            );
          }, 100);
        })
        .catch((err) => {
          hideLoading();
          console.error("Clipboard copy failed:", err);
          alert("कॉपी करने में त्रुटि आई।\nError copying image.");
        });
    }, "image/png");
  });
}

function getNowcastShareText() {
  const hindiText = document.getElementById("warningTextHindi").innerText;
  const englishText = document.getElementById("warningTextEnglish").innerText;
  const level = document.getElementById("warningCodeBox").innerText;
  return `*Bihar Weather Nowcast*\n\n*Warning Level:* ${level}\n\n*Hindi:*\n${hindiText}\n\n*English:*\n${englishText}\n\nMore details: https://biharmausam.com/`;
}

// --- Unified Advanced Share Logic ---
async function processAndShare(platform) {
  showLoading();
  try {
    const element = document.getElementById("warningCardContainer");

    // 1. Image Capture and Processing
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
    });

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/png"),
    );
    const filename = getNowcastFilename("png");
    const file = new File([blob], filename, { type: "image/png" });
    const shareText = getNowcastShareText();

    // 2. Try Web Share API (Direct Attachment on Mobile & Edge)
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: "Bihar Weather Warning",
          text:
            platform === "twitter"
              ? "मेघगर्जन / बिजली / सतही हवा के साथ बारिश की चेतावनी\n"
              : shareText,
        });
        hideLoading();
        return; // Success (Image directly attached to App)
      } catch (err) {
        console.log(
          "Web Share cancelled/failed, falling back to Clipboard",
          err,
        );
      }
    }

    // 3. Fallback for Desktop (Clipboard)
    let copiedToClipboard = false;
    try {
      if (navigator.clipboard && window.ClipboardItem) {
        const item = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([item]);
        copiedToClipboard = true;
      } else {
        throw new Error("Clipboard API not supported");
      }
    } catch (err) {
      console.warn("Clipboard blocked, triggering auto-download", err);
      // 4. Ultimate Fallback (Auto-Download)
      const link = document.createElement("a");
      link.download = filename;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }

    hideLoading();

    // 5. Open Share Window with clear instructions
    const instructionMsg = copiedToClipboard
      ? "इमेज क्लिपबोर्ड पर कॉपी हो गई है! कृपया शेयर बॉक्स में जाकर 'Paste (Ctrl+V / Long Press)' करें।\nImage copied! Please 'Paste' it in the message box."
      : "इमेज डाउनलोड हो गई है! कृपया मैसेज के साथ इसे अटैच करें।\nImage downloaded! Please attach it to your message.";

    // Delay to let browser UI catch up before alerting
    setTimeout(() => {
      alert(instructionMsg);
      openPlatformWindow(platform, shareText);
    }, 100);
  } catch (error) {
    hideLoading();
    console.error("Share error:", error);
    alert("शेयर करने में त्रुटि आई / Error generating share image.");
  }
}

// 6. Handle Specific Platform URLs
function openPlatformWindow(platform, shareText) {
  if (platform === "whatsapp") {
    const text = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  } else if (platform === "facebook") {
    // FB Dialogs don't accept local images easily, pasting on the wall works best
    window.open("https://www.facebook.com/", "_blank");
  } else if (platform === "twitter") {
    const text = encodeURIComponent(
      "मेघगर्जन / बिजली / सतही हवा के साथ बारिश की चेतावनी\n" +
        window.location.href,
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  } else if (platform === "email") {
    const emailListEl = document.getElementById("emailListText");
    let emails = "";

    if (emailListEl && emailListEl.value.trim() !== "") {
      emails = emailListEl.value;
    } else {
      // Auto-generate if modal wasn't opened
      const selectedDistrictEmails = selectedDistricts
        .map((id) => {
          const dist = districtsData.find((d) => d.id === id);
          return dist && dist.email ? dist.email : null;
        })
        .filter((email) => email !== null);

      emails = defaultEmails;
      if (selectedDistrictEmails.length > 0) {
        emails += ", " + selectedDistrictEmails.join(", ");
      }
    }

    const subject = "मेघगर्जन /बिजली/ सतही हवा के साथ बारिश की चेतावनी";
    const body =
      "Bihar Weather Nowcast Warning\n\n(कृपया चेतावनी की इमेज यहाँ अटैच/पेस्ट करें / Please attach or paste the image here)";

    window.location.href = `mailto:${emails}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
}

// 7. Link to HTML Buttons
function shareNowcastWhatsApp() {
  processAndShare("whatsapp");
}
function shareNowcastFacebook() {
  processAndShare("facebook");
}
function shareNowcastTwitter() {
  processAndShare("twitter");
}
function shareNowcastEmail() {
  processAndShare("email");
}

// Print nowcast
function printNowcast() {
  const printWindow = window.open("", "_blank");
  const content = document.getElementById("warningCardContainer").outerHTML;

  printWindow.document.write(`
        <html>
        <head>
            <title>Nowcast Weather Warning</title>
            <style>
                body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                .warning-card-wrapper { 
                    border: 3px solid #000; 
                    padding: 10px;
                    background: #ffffff;
                    max-width: 800px; 
                    margin: 0 auto;
                }
                .imd-warning-container { border: none; }
                .imd-header { 
                    display: flex; 
                    justify-content: space-between; 
                    padding: 15px; 
                    border-bottom: 2px solid #000;
                }
                .imd-logo-section { display: flex; align-items: center; gap: 15px; }
                .imd-emblem { width: auto; height: 110px; object-fit: contain; }
                .imd-title-section { text-align: center; flex: 1; }
                .imd-title-section h2 { color: #d32f2f; font-size: 20px; margin: 0; }
                .imd-title-section h3 { font-size: 14px; margin: 0 0 5px 0; }
                .nowcast-main-heading { color: #d32f2f; font-size: 20px; margin: 0 0 20px 0; text-align: center; text-transform: uppercase; font-weight: bold; }
                .imd-anniversary { width: auto; height: 110px; object-fit: contain; }
                .imd-contact-bar { 
                    display: flex; 
                    justify-content: space-between; 
                    padding: 8px 15px; 
                    background: #f5f5f5; 
                    border-bottom: 1px solid #000;
                    font-size: 12px;
                }
                .imd-warning-content { padding: 20px; }
                .warning-code-section { 
                    display: flex; 
                    align-items: center; 
                    gap: 20px; 
                    margin-bottom: 20px;
                }
                .warning-code-box { 
                    padding: 10px 30px; 
                    font-weight: bold; 
                    border: 2px solid #000;
                }
                .warning-validity { margin-left: auto; text-align: right; font-size: 14px; }
                .warning-text-hindi { font-size: 16px; margin-bottom: 15px; }
                .warning-text-english { font-size: 15px; margin-bottom: 20px; }
                .guidelines-section { border-top: 2px solid #000; padding-top: 15px; }
                .guidelines-text { 
                    background: #fff3cd; 
                    padding: 15px; 
                    border-left: 5px solid #ffc107;
                }
                .imd-footer { 
                    display: flex; 
                    justify-content: space-between; 
                    padding: 15px; 
                    border-top: 2px solid #000;
                    background: #f5f5f5;
                }
                .warning-legend { display: flex; gap: 10px; }
                .legend-item { 
                    padding: 5px 15px; 
                    font-size: 12px; 
                    font-weight: bold;
                    border: 1px solid #000;
                }
                .legend-item.green { background: #4caf50; color: white; }
                .legend-item.yellow { background: #ffeb3b; color: black; }
                .legend-item.orange { background: #ff9800; color: white; }
                .legend-item.red { background: #f44336; color: white; }
                @media print {
                    body { padding: 0; }
                }
            </style>
        </head>
        <body>
            ${content}
            <script>
                window.onload = function() { 
                    setTimeout(function() { 
                        window.print(); 
                        window.close(); 
                    }, 500);
                };
            <\/script>
        </body>
        </html>
    `);
  printWindow.document.close();
}
