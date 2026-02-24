// Configuration
const regions = [
  { code: "nw", name: "North West Bihar", districts: [38, 11, 13, 35, 31] },
  {
    code: "nc",
    name: "North Central Bihar",
    districts: [23, 37, 34, 33, 10, 30, 21],
  },
  {
    code: "ne",
    name: "North East Bihar",
    districts: [36, 1, 18, 27, 16, 20, 29],
  },
  { code: "sw", name: "South West Bihar", districts: [28, 6, 8, 9, 2, 3] },
  {
    code: "sc",
    name: "South Central Bihar",
    districts: [26, 24, 14, 25, 12, 19, 32, 5],
  },
  { code: "se", name: "South East Bihar", districts: [15, 22, 4, 17, 7] },
];

const distConfig = {
  DRY: {
    class: "bg-dry",
    hi: "मौसम शुष्क रहने की संभावना है।",
    en: "Dry weather most likely.",
  },
  ISOL: {
    class: "bg-isol",
    hi: "एक या दो स्थानों पर वर्षा की संभावना है।",
    en: "Rainfall likely at isolated places.",
  },
  SCT: {
    class: "bg-sct",
    hi: "कुछ स्थानों पर वर्षा की संभावना है।",
    en: "Rainfall likely at a few places.",
  },
  FWS: {
    class: "bg-fws",
    hi: "अनेक स्थानों पर वर्षा की संभावना है।",
    en: "Rainfall likely at many places.",
  },
  WS: {
    class: "bg-ws",
    hi: "अधिकांश स्थानों पर वर्षा की संभावना है।",
    en: "Rainfall likely at most places.",
  },
  NA: {
    class: "bg-na",
    hi: "जानकारी उपलब्ध नहीं।",
    en: "Data not available.",
  },
};

// State
let forecastData = []; // 6 regions x 7 days
let startDate = new Date();
let editingCell = { r: -1, c: -1 };

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  initDate();
  initData();
  renderTable(); // Automatically render and save table HTML on load
});

function initDate() {
  const storedDate = localStorage.getItem("bihar_forecast_date");
  if (storedDate) {
    startDate = new Date(storedDate);
  } else {
    startDate = new Date();
  }

  const options = { day: "numeric", month: "long", year: "numeric" };
  const el = document.getElementById("displayDate");
  if (el) el.innerText = startDate.toLocaleDateString("en-IN", options);
}

function initData() {
  // 1. Try loading saved detailed forecast data
  const saved = localStorage.getItem("bihar_detailed_forecast_data");
  if (saved) {
    try {
      forecastData = JSON.parse(saved);
      return;
    } catch (e) {
      console.error(e);
    }
  }

  // 2. Try loading from Main App Forecast Data (index.html logic)
  if (loadFromMainForecast()) {
    return;
  }

  // 3. Fallback to Default (DRY)
  resetToDefault();
}

function loadFromMainForecast() {
  const raw = localStorage.getItem("bihar_weather_data");
  if (!raw) return false;

  try {
    const data = JSON.parse(raw);
    const mainForecast = data.forecast; // Array of 7 days
    if (!mainForecast || !Array.isArray(mainForecast)) return false;

    forecastData = [];
    // Mapping: 0->DRY, 1->ISOL, 2->SCT, 3->FWS, 4->WS
    const distMap = { 0: "DRY", 1: "ISOL", 2: "SCT", 3: "FWS", 4: "WS" };

    for (let r = 0; r < 6; r++) {
      // 6 Regions
      let row = [];
      const regionDistricts = regions[r].districts;

      for (let d = 0; d < 7; d++) {
        // 7 Days
        const dayData = mainForecast[d] || {};

        // Find the maximum distribution value in this region for this day
        // This ensures if any district has rain, the region reflects it.
        let maxDistVal = 0;

        regionDistricts.forEach((id) => {
          const distInfo = dayData[String(id)];
          if (distInfo && distInfo.distribution > maxDistVal) {
            maxDistVal = distInfo.distribution;
          }
        });

        row.push({
          dist: distMap[maxDistVal] || "DRY",
          customDistricts: [], // We start with no custom districts
        });
      }
      forecastData.push(row);
    }
    return true;
  } catch (e) {
    console.error("Error loading main forecast data:", e);
    return false;
  }
}

function resetToDefault() {
  forecastData = [];
  for (let r = 0; r < 6; r++) {
    let row = [];
    for (let c = 0; c < 7; c++) {
      row.push({
        dist: "DRY",
        customDistricts: [],
      });
    }
    forecastData.push(row);
  }
}

function saveData() {
  localStorage.setItem(
    "bihar_detailed_forecast_data",
    JSON.stringify(forecastData),
  );
}

// --- Rendering ---
function updateButtonSelection(activeId) {
  document.getElementById("btnGenerate").classList.remove("btn-selected");
  document.getElementById("btnSync").classList.remove("btn-selected");
  if (activeId) document.getElementById(activeId).classList.add("btn-selected");
}

function syncWithForecast() {
  updateButtonSelection("btnSync");
  if (loadFromMainForecast()) {
    saveData();
    renderTable();
    alert("Data synced with Main Forecast successfully!");
  } else {
    alert("No Main Forecast data found to sync.");
  }
}
window.syncWithForecast = syncWithForecast;

function generateTable() {
  updateButtonSelection("btnGenerate");
  renderTable();
  // alert("Forecast Table Generated Successfully!");
}
window.generateTable = generateTable;

function renderTable() {
  const container = document.getElementById("tableContainer");
  let html = `<table class="forecast-table" id="exportTable">
      <thead>
          <tr>
              <th rowspan="2" style="width:10%; vertical-align: middle;">Meteorological Sector</th>
              <th rowspan="2" style="width:20%; vertical-align: middle;">Name of the Districts<br>(जिलों के नाम)</th>
              <th colspan="7" style="background-color: #e9ecef; color: black; font-weight: bold; font-size: 14px; text-align: center; text-transform: none; border: 1px solid #333;">
                  सात दिनों के लिए वर्षा का स्थानिक वितरण पूर्वानुमान<br>
                  (Spatial distribution forecast of Rainfall for next Seven Days)
              </th>
          </tr>
          <tr>`;

  // Generate Date Headers
  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);

    // Add suffix
    const dayNum = d.getDate();
    const dayNumPad = String(dayNum).padStart(2, "0");
    const suffix =
      dayNum > 3 && dayNum < 21
        ? "th"
        : dayNum % 10 == 1
          ? "st"
          : dayNum % 10 == 2
            ? "nd"
            : dayNum % 10 == 3
              ? "rd"
              : "th";

    html += `<th>${dayNumPad}<sup style="text-transform: lowercase; font-size: 0.6em;">${suffix}</sup><br>${d.toLocaleString("default", { month: "short" })}</th>`;
  }
  html += `</tr></thead><tbody>`;

  // Generate Rows
  regions.forEach((region, rIdx) => {
    // Get District Names string
    const distNames = region.districts
      .map((id) => {
        // districtsData is global from districts.js
        const d =
          typeof districtsData !== "undefined"
            ? districtsData.find((x) => x.id === id)
            : null;
        return d ? d.name : id;
      })
      .join(", ");

    html += `<tr>
          <td style="font-weight:bold;">${region.name}</td>
          <td style="text-align:left; font-size:11px; color:#555;">${distNames}</td>`;

    for (let cIdx = 0; cIdx < 7; cIdx++) {
      const cellData = forecastData[rIdx][cIdx];
      const config = distConfig[cellData.dist] || distConfig["DRY"];
      const bgClass = config.class;

      let content = "";

      // Logic for District Specific Text
      if (cellData.customDistricts && cellData.customDistricts.length > 0) {
        // Get Hindi names for selected districts
        const selectedNamesHi = cellData.customDistricts
          .map((id) => {
            const d =
              typeof districtsData !== "undefined"
                ? districtsData.find((x) => x.id === parseInt(id))
                : null;
            return d ? d.hindi : id;
          })
          .join(", ");

        // Format: "Districts में <br> Hindi Text <br> English Text"
        content = `<strong>${selectedNamesHi} में</strong><br>${config.hi}<br>${config.en}`;
      } else {
        // Standard Text
        content = `${config.hi}<br>${config.en}`;
      }

      html += `<td class="${bgClass}" onclick="openEditModal(${rIdx}, ${cIdx})">
                      ${content}
                   </td>`;
    }
    html += `</tr>`;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;

  // Save generated HTML for Bulletin
  localStorage.setItem("bihar_detailed_forecast_html", html);
}

// --- Interactions ---
function fillAllDry() {
  if (confirm("Are you sure you want to reset all data to DRY?")) {
    resetToDefault();
    saveData();
    renderTable(); // Immediately show the table as requested
  }
}
window.fillAllDry = fillAllDry;

function togglePasteArea() {
  const area = document.getElementById("pasteArea");
  area.style.display = area.style.display === "block" ? "none" : "block";
}

function processPaste() {
  const text = document.getElementById("pasteInput").value.trim();
  if (!text) return;

  const rows = text.split(/\n/);
  let rCount = 0;

  rows.forEach((row) => {
    if (rCount >= 6) return;
    let cols = row.split(/\t|,/);
    if (cols.length > 7) {
      cols = cols.slice(cols.length - 7);
    }

    cols.forEach((val, cCount) => {
      if (cCount >= 7) return;
      let cleanVal = val.trim().toUpperCase();
      if (cleanVal.includes("DRY")) cleanVal = "DRY";
      else if (cleanVal.includes("ISO")) cleanVal = "ISOL";
      else if (cleanVal.includes("SCT")) cleanVal = "SCT";
      else if (cleanVal.includes("FWS")) cleanVal = "FWS";
      else if (cleanVal.includes("WS")) cleanVal = "WS";
      else if (cleanVal.includes("NA")) cleanVal = "NA";
      else cleanVal = "DRY";

      forecastData[rCount][cCount] = {
        dist: cleanVal,
        customDistricts: [],
      };
    });
    rCount++;
  });

  saveData();
  renderTable();
  togglePasteArea();
}
window.processPaste = processPaste;
window.togglePasteArea = togglePasteArea;

// --- Modal Logic ---
function openEditModal(r, c) {
  editingCell = { r, c };
  const data = forecastData[r][c];
  const region = regions[r];

  const d = new Date(startDate);
  d.setDate(startDate.getDate() + c);
  const dateStr = d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
  document.getElementById("modalTitle").innerText =
    `${region.name} - ${dateStr}`;

  document.getElementById("modalDistSelect").value = data.dist;

  const listContainer = document.getElementById("modalDistrictList");
  listContainer.innerHTML = "";

  region.districts.forEach((id) => {
    const d =
      typeof districtsData !== "undefined"
        ? districtsData.find((x) => x.id === id)
        : null;
    const isChecked = data.customDistricts.includes(id) ? "checked" : "";
    const name = d ? `${d.name} (${d.hindi})` : id;
    const lbl = document.createElement("label");
    lbl.className = "district-item";
    lbl.innerHTML = `<input type="checkbox" value="${id}" ${isChecked}> ${name}`;
    listContainer.appendChild(lbl);
  });

  document.getElementById("editModal").style.display = "flex";
}
window.openEditModal = openEditModal;

function closeModal() {
  document.getElementById("editModal").style.display = "none";
}
window.closeModal = closeModal;

function saveModalData() {
  const r = editingCell.r;
  const c = editingCell.c;

  const distVal = document.getElementById("modalDistSelect").value;

  const checkboxes = document.querySelectorAll(
    "#modalDistrictList input:checked",
  );
  const selectedIds = Array.from(checkboxes).map((cb) => parseInt(cb.value));

  const regionTotal = regions[r].districts.length;
  let finalCustom = selectedIds;
  if (selectedIds.length === regionTotal) {
    finalCustom = [];
  }

  forecastData[r][c] = {
    dist: distVal,
    customDistricts: finalCustom,
  };

  saveData();
  renderTable();
  closeModal();
}
window.saveModalData = saveModalData;

// --- Export Functions ---
function exportTableImage() {
  const table = document.getElementById("exportTable");
  html2canvas(table, { backgroundColor: "#ffffff" }).then((canvas) => {
    const link = document.createElement("a");
    link.download = `Detailed_Forecast_${startDate.toISOString().split("T")[0]}.png`;
    link.href = canvas.toDataURL();
    link.click();
  });
}
window.exportTableImage = exportTableImage;

function exportToPDF() {
  const element = document.getElementById("exportTable");
  html2canvas(element, { backgroundColor: "#ffffff", scale: 2 }).then(
    (canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const { jsPDF } = window.jspdf;
      // Landscape A4
      const pdf = new jsPDF("l", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // If image height is greater than page height, scale it down
      let finalHeight = imgHeight;
      let finalWidth = pdfWidth;

      if (imgHeight > pdfHeight) {
        finalHeight = pdfHeight - 20;
        finalWidth = (imgProps.width * finalHeight) / imgProps.height;
      }

      pdf.addImage(imgData, "PNG", 10, 10, finalWidth - 20, finalHeight);
      pdf.save(
        `Detailed_Forecast_${startDate.toISOString().split("T")[0]}.pdf`,
      );
    },
  );
}
window.exportToPDF = exportToPDF;

function exportToWord() {
  const html = document.getElementById("tableContainer").innerHTML;
  const header =
    "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
    "xmlns:w='urn:schemas-microsoft-com:office:word' " +
    "xmlns='http://www.w3.org/TR/REC-html40'>" +
    "<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript<\/title><\/head><body>";
  const footer = "<\/body><\/html>";
  const sourceHTML = header + html + footer;

  const source =
    "data:application/vnd.ms-word;charset=utf-8," +
    encodeURIComponent(sourceHTML);
  const fileDownload = document.createElement("a");
  document.body.appendChild(fileDownload);
  fileDownload.href = source;
  fileDownload.download = `Detailed_Forecast_${startDate.toISOString().split("T")[0]}.doc`;
  fileDownload.click();
  document.body.removeChild(fileDownload);
}
window.exportToWord = exportToWord;

function exportToExcel() {
  const html = document.getElementById("exportTable").outerHTML;
  const blob = new Blob(["\ufeff", html], {
    type: "application/vnd.ms-excel",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Detailed_Forecast_${startDate.toISOString().split("T")[0]}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
window.exportToExcel = exportToExcel;

// --- District Data Fallback ---
if (typeof districtsData === "undefined") {
  window.districtsData = [
    { id: 1, name: "ARARIA", hindi: "अररिया" },
    { id: 2, name: "ARWAL", hindi: "अरवल" },
    { id: 3, name: "AURANGABAD", hindi: "औरंगाबाद" },
    { id: 4, name: "BANKA", hindi: "बांका" },
    { id: 5, name: "BEGUSARAI", hindi: "बेगूसराय" },
    { id: 6, name: "BHABUA", hindi: "भभुआ" },
    { id: 7, name: "BHAGALPUR", hindi: "भागलपुर" },
    { id: 8, name: "BHOJPUR", hindi: "भोजपुर" },
    { id: 9, name: "BUXAR", hindi: "बक्सर" },
    { id: 10, name: "DARBHANGA", hindi: "दरभंगा" },
    { id: 11, name: "EAST CHAMPARAN", hindi: "पूर्वी चंपारण" },
    { id: 12, name: "GAYA", hindi: "गया" },
    { id: 13, name: "GOPALGANJ", hindi: "गोपालगंज" },
    { id: 14, name: "JAHANABAD", hindi: "जहानाबाद" },
    { id: 15, name: "JAMUI", hindi: "जमुई" },
    { id: 16, name: "KATIHAR", hindi: "कटिहार" },
    { id: 17, name: "KHAGARIA", hindi: "खगड़िया" },
    { id: 18, name: "KISHANGANJ", hindi: "किशनगंज" },
    { id: 19, name: "LAKHISARAI", hindi: "लखीसराय" },
    { id: 20, name: "MADHEPURA", hindi: "मधेपुरा" },
    { id: 21, name: "MADHUBANI", hindi: "मधुबनी" },
    { id: 22, name: "MONGHYR", hindi: "मुंगेर" },
    { id: 23, name: "MUZAFFARPUR", hindi: "मुजफ्फरपुर" },
    { id: 24, name: "NALANDA", hindi: "नालंदा" },
    { id: 25, name: "NAWADA", hindi: "नवादा" },
    { id: 26, name: "PATNA", hindi: "पटना" },
    { id: 27, name: "PURNEA", hindi: "पूर्णिया" },
    { id: 28, name: "ROHTAS", hindi: "रोहतास" },
    { id: 29, name: "SAHARSA", hindi: "सहरसा" },
    { id: 30, name: "SAMASTIPUR", hindi: "समस्तीपुर" },
    { id: 31, name: "SARAN", hindi: "सारण" },
    { id: 32, name: "SHEIKHPURA", hindi: "शेखपुरा" },
    { id: 33, name: "SHEOHAR", hindi: "शिवहर" },
    { id: 34, name: "SITAMARHI", hindi: "सीतामढ़ी" },
    { id: 35, name: "SIWAN", hindi: "सिवान" },
    { id: 36, name: "SUPAUL", hindi: "सुपौल" },
    { id: 37, name: "VAISHALI", hindi: "वैशाली" },
    { id: 38, name: "WEST CHAMPARAN", hindi: "पश्चिमी चंपारण" },
  ];
}
