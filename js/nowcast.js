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

// Toggle district selection
function toggleDistrict(districtId) {
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
}
// Select all districts
function selectAllDistricts() {
  districtsData.forEach((d) => {
    if (!selectedDistricts.includes(d.id)) {
      toggleDistrict(d.id);
    }
  });
}
function clearDistricts() {
  [...selectedDistricts].forEach((id) => toggleDistrict(id));
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
        toggleDistrict(districtId);
      } else if (!isChecked && isSelected) {
        toggleDistrict(districtId);
      }
    });
  }
}

// Update date and time
function updateDateTime() {
  if (!isAutoTimeUpdate) return;
  const now = new Date();
  updateTimeDisplay(now);
}

function updateTimeDisplay(dateObj) {
  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  const timeStr = dateObj.toLocaleString("en-US", options);
  const issueEl = document.getElementById("issueDateTime");
  if (issueEl) issueEl.innerText = timeStr;

  const validDate = new Date(dateObj.getTime() + 3 * 60 * 60 * 1000); // +3 hours
  const validStr = validDate.toLocaleString("en-US", options);
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
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    const manualInput = document.getElementById("manualIssueInput");
    if (manualInput) manualInput.value = now.toISOString().slice(0, 16);
  }
}

function applyManualTime() {
  const inputVal = document.getElementById("manualIssueInput").value;
  if (inputVal) {
    const manualDate = new Date(inputVal);
    updateTimeDisplay(manualDate);
  }
}

// Generate Nowcast
function generateNowcast() {
  if (selectedDistricts.length === 0) {
    alert(
      "कृपया कम से कम एक जिला चुनें!\nPlease select at least one district!",
    );
    return;
  }

  if (selectedPhenomena.length === 0) {
    alert(
      "कृपया कम से कम एक मौसम घटना चुनें!\nPlease select at least one weather phenomenon!",
    );
    return;
  }

  showLoading();

  setTimeout(() => {
    generateWarningText();
    document.getElementById("nowcastOutput").classList.add("active");
    hideLoading();

    // Scroll to output
    document
      .getElementById("nowcastOutput")
      .scrollIntoView({ behavior: "smooth" });
  }, 1000);
}

// Generate warning text
function generateWarningText() {
  const config = warningConfig[selectedWarningLevel];
  const districts = selectedDistricts.map((id) =>
    districtsData.find((d) => d.id === id),
  );

  // Get district names
  const districtNamesHi = districts.map((d) => d.hindi).join(", ");
  const districtNamesEn = districts.map((d) => d.name.toUpperCase()).join(", ");

  // Get phenomena names
  const phenomenaList = selectedPhenomena.map((id) =>
    weatherPhenomena.find((p) => p.id === id),
  );

  const phenomNamesHi = phenomenaList.map((p) => p.hindi).join(", ");
  const phenomNamesEn = phenomenaList
    .map((p) => p.name.toLowerCase())
    .join(", ");

  // Get intensity text
  const intensityHi = intensityLevels.hi[selectedIntensity];
  const intensityEn = intensityLevels.en[selectedIntensity];

  // Update warning code box
  const codeBox = document.getElementById("warningCodeBox");
  codeBox.textContent = `${config.code}: ${config.action}`;
  codeBox.className = `warning-code-box ${config.bgClass}`;

  // Generate Hindi text
  const windTextHi = selectedWindSpeed
    ? `(हवा की गति ${selectedWindSpeed} कि.मी. प्रति घंटे तक)`
    : "";
  const warningTextHi = `${districtNamesHi} जिले के एक या दो स्थानों में अगले दो से तीन घंटे में ${intensityHi} ${phenomNamesHi} ${windTextHi} के साथ होने की संभावना है।`;

  // Generate English text
  const windTextEn = selectedWindSpeed
    ? `(wind speed upto ${selectedWindSpeed} Kmph)`
    : "";
  const warningTextEn = `Some parts of ${districtNamesEn} district would experience ${intensityEn} ${phenomNamesEn} accompanied with Gusty wind ${windTextEn} within next two to three hours`;

  // Update DOM
  document.getElementById("warningTextHindi").textContent = warningTextHi;
  document.getElementById("warningTextEnglish").textContent = warningTextEn;

  // Update guidelines
  const guidelinesBox = document.querySelector(".guidelines-text");
  guidelinesBox.textContent = config.guideline;
  guidelinesBox.className = `guidelines-text ${config.bgClass}`;
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
  const element = document.getElementById("imdWarningContainer");

  html2canvas(element, {
    scale: 2,
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
  const element = document.getElementById("imdWarningContainer");

  html2canvas(element, {
    scale: 2,
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

// Export to Word
function exportToWord() {
  const element = document.getElementById("imdWarningContainer");

  // HTML स्ट्रिंग बनाएँ (Word इसे समझ सकता है)
  const html = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Nowcast Warning</title></head>
      <body>
          ${element.innerHTML}
      </body>
      </html>
  `;

  const blob = new Blob(["\ufeff", html], {
    type: "application/msword",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = getNowcastFilename("doc");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export to Excel (CSV)
function exportToExcel() {
  // डेटा निकालें
  const issueTime = document
    .getElementById("issueDateTime")
    .innerText.replace(/\n/g, " ");
  const validTime = document
    .getElementById("validityTime")
    .innerText.replace(/\n/g, " ");
  const warningLevel = document.getElementById("warningCodeBox").innerText;
  const hindiText = document
    .getElementById("warningTextHindi")
    .innerText.replace(/(\r\n|\n|\r)/gm, " ");
  const englishText = document
    .getElementById("warningTextEnglish")
    .innerText.replace(/(\r\n|\n|\r)/gm, " ");

  // CSV कंटेंट (Excel के लिए BOM के साथ)
  const BOM = "\uFEFF";
  const csvContent =
    BOM +
    "Issue Time,Validity Time,Warning Level,Hindi Warning,English Warning\n" +
    `"${issueTime}","${validTime}","${warningLevel}","${hindiText}","${englishText}"`;

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", getNowcastFilename("csv"));
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Print nowcast
function printNowcast() {
  const printWindow = window.open("", "_blank");
  const content = document.getElementById("imdWarningContainer").outerHTML;

  printWindow.document.write(`
        <html>
        <head>
            <title>Nowcast Weather Warning</title>
            <style>
                body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                .imd-warning-container { 
                    border: 3px solid #000; 
                    max-width: 800px; 
                    margin: 0 auto;
                }
                .imd-header { 
                    display: flex; 
                    justify-content: space-between; 
                    padding: 15px; 
                    border-bottom: 2px solid #000;
                }
                .imd-logo-section { display: flex; align-items: center; gap: 15px; }
                .imd-emblem { width: 80px; height: 80px; }
                .imd-title-section { text-align: center; flex: 1; }
                .imd-title-section h2 { color: #d32f2f; font-size: 20px; margin: 0; }
                .imd-title-section h3 { font-size: 14px; margin: 0 0 5px 0; }
                .imd-anniversary { width: 100px; }
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
