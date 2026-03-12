// e:\Lal Kamal Project\SWFC\Bihar-Weather-Forecast\js\bulk_import.js

// Configuration for Parsing (Keywords to identify phenomena from text)
const phenDefs = [
  { id: "dry", keywords: ["dry", "shu", "clear", "शुष्क"] },
  { id: "rain", keywords: ["rain", "bhari", "varsha", "भारी"] },
  { id: "heatwave", keywords: ["heat", "wave", "loo", "ushn", "लू"] },
  { id: "warmnight", keywords: ["warm", "night", "garm", "गर्म"] },
  { id: "coldwave", keywords: ["cold", "wave", "sheet", "lahar", "शीत"] },
  { id: "coldday", keywords: ["cold", "day", "divas", "दिवस"] },
  { id: "densefog", keywords: ["fog", "kohra", "dhund", "कोहरा"] },
  {
    id: "thunderstorm",
    keywords: ["thunder", "lightning", "megh", "garjan", "ts", "मेघ"],
  },
  { id: "gustywind", keywords: ["gusty", "wind", "tez", "hawa", "तेज़"] },
  { id: "squall", keywords: ["squall", "jhoka", "झोंके"] },
  { id: "frost", keywords: ["frost", "pala", "पाला"] },
  { id: "hailstorm", keywords: ["hail", "ola", "ओलावृष्टि"] },
  { id: "duststorm", keywords: ["dust", "andhi", "आंधी"] },
  { id: "snow", keywords: ["snow", "barf", "बर्फबारी"] },
  { id: "cyclone", keywords: ["cyclone", "chakravat", "चक्रवात"] },
  { id: "seastate", keywords: ["sea", "samudra", "समुद्र"] },
];

// Configuration for Colors (Must match main.js)
const phenColors = {
  dry: "#ffffff",
  rain: "#007bff",
  heatwave: "#fd7e14",
  warmnight: "#e83e8c",
  coldwave: "#00bcd4",
  coldday: "#20c997",
  densefog: "#6c757d",
  thunderstorm: "#ffc107",
  gustywind: "#17a2b8",
  squall: "#607d8b",
  frost: "#b2ebf2",
  seastate: "#0d47a1",
  cyclone: "#b71c1c",
  duststorm: "#d7ccc8",
  snow: "#f5f5f5",
  hailstorm: "#6f42c1",
};

const warningColors = {
  red: "rgb(255, 0, 0)",
  orange: "rgb(255, 192, 0)",
  yellow: "rgb(255, 255, 0)",
  green: "rgb(0, 153, 0)",
};

// Region Definitions (Order matches the 12 rows requirement)
const regions = [
  { code: "nw", name: "North West (NW)" },
  { code: "nc", name: "North Central (NC)" },
  { code: "ne", name: "North East (NE)" },
  { code: "sw", name: "South West (SW)" },
  { code: "sc", name: "South Central (SC)" },
  { code: "se", name: "South East (SE)" },
];

document.addEventListener("DOMContentLoaded", init);

function init() {
  console.log("Initializing Bulk Import...");

  // Check if districts.js is loaded
  if (typeof subRegionDistricts === "undefined") {
    console.error("districts.js not loaded!");
    alert("Error: districts.js not loaded. Grid cannot be generated.");
    return;
  }

  renderGrid();
  setupPasteListener();
}

function renderGrid() {
  const headerRow = document.getElementById("headerRow");
  const tbody = document.getElementById("gridBody");

  if (!headerRow || !tbody) {
    console.error("Table elements not found!");
    return;
  }

  // Clear existing content to prevent duplicates
  // Keep the first th (Region/Type)
  while (headerRow.children.length > 1) {
    headerRow.removeChild(headerRow.lastChild);
  }
  tbody.innerHTML = "";

  const today = new Date();

  // 1. Generate Date Headers
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
    const th = document.createElement("th");
    th.innerHTML = `Day ${i + 1}<br><small>${dateStr}</small>`;
    headerRow.appendChild(th);
  }

  // 2. Generate Rows (12 Rows: 6 Regions * 2 Types)
  regions.forEach((region) => {
    // Forecast Row
    const trForecast = document.createElement("tr");
    trForecast.innerHTML = `<td class="row-header">${region.name}<div class="row-sub-header">T. Max: Range</div></td>`;
    for (let i = 0; i < 7; i++) {
      trForecast.innerHTML += `<td contenteditable="true" data-region="${region.code}" data-type="max_temp" data-day="${i}"></td>`;
    }
    tbody.appendChild(trForecast);

    // Warning Row
    const trWarning = document.createElement("tr");
    trWarning.innerHTML = `<td class="row-header">${region.name}<div class="row-sub-header">T. Min: Range</div></td>`;
    for (let i = 0; i < 7; i++) {
      trWarning.innerHTML += `<td contenteditable="true" data-region="${region.code}" data-type="min_temp" data-day="${i}"></td>`;
    }
    tbody.appendChild(trWarning);
  });

  console.log("Grid rendered successfully.");
}

function setupPasteListener() {
  const table = document.getElementById("importGrid");

  table.addEventListener("paste", (e) => {
    e.preventDefault();
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData("Text");

    // Parse rows and columns from pasted text
    const rows = pastedData.trim().split(/\r\n|\n|\r/);

    // Identify start cell
    let target = e.target;
    // If user clicked inside the div/text of td, get the td
    while (target && target.tagName !== "TD") {
      target = target.parentElement;
    }

    if (!target || !target.isContentEditable) return;

    const startRowIndex = target.parentElement.rowIndex - 1; // Adjust for header
    const startColIndex = target.cellIndex - 1; // Adjust for row header

    const tableRows = table.querySelectorAll("tbody tr");

    rows.forEach((row, rIdx) => {
      const cells = row.split(/\t/);
      const targetRow = tableRows[startRowIndex + rIdx];

      if (targetRow) {
        cells.forEach((cellData, cIdx) => {
          // +1 to skip the row header cell
          const targetCell = targetRow.cells[startColIndex + cIdx + 1];
          if (targetCell && targetCell.isContentEditable) {
            targetCell.innerText = cellData.trim();
            targetCell.classList.add("status-success");
            setTimeout(
              () => targetCell.classList.remove("status-success"),
              1000,
            );
          }
        });
      }
    });
  });
}

function clearGrid() {
  document
    .querySelectorAll("td[contenteditable]")
    .forEach((td) => (td.innerText = ""));
}

function processAndSave() {
  // Initialize Data Structures
  const weeklyMaxTemp = Array(7)
    .fill(null)
    .map(() => ({}));
  const weeklyMinTemp = Array(7)
    .fill(null)
    .map(() => ({}));

  // Helper to get districts for a region code
  const getDistricts = (code) => {
    // Use subRegionDistricts from districts.js
    return subRegionDistricts[code] || [];
  };

  // Iterate through grid cells
  const cells = document.querySelectorAll("td[contenteditable]");
  let hasData = false;

  cells.forEach((cell) => {
    const regionCode = cell.dataset.region;
    const type = cell.dataset.type;
    const dayIndex = parseInt(cell.dataset.day);
    const text = cell.innerText.trim();

    if (!text) return;
    hasData = true;

    const districtIds = getDistricts(regionCode);

    // Parse Temperature Range (e.g., "24-26" -> 24)
    // We take the first number before '-'
    const parts = text.split("-");
    const val = parseInt(parts[0].trim());

    if (!isNaN(val)) {
      districtIds.forEach((id) => {
        const strId = String(id);
        if (type === "max_temp") {
          if (!weeklyMaxTemp[dayIndex][strId])
            weeklyMaxTemp[dayIndex][strId] = {};
          weeklyMaxTemp[dayIndex][strId].val = val;
          weeklyMaxTemp[dayIndex][strId].range = text;
        } else if (type === "min_temp") {
          if (!weeklyMinTemp[dayIndex][strId])
            weeklyMinTemp[dayIndex][strId] = {};
          weeklyMinTemp[dayIndex][strId].val = val;
          weeklyMinTemp[dayIndex][strId].range = text;
        }
      });
    }
  });

  if (!hasData) {
    alert("Grid is empty. Please paste data first.");
    return;
  }

  // Save to LocalStorage
  const payload = {
    max: weeklyMaxTemp,
    min: weeklyMinTemp,
  };

  localStorage.setItem("bihar_temperature_data", JSON.stringify(payload));

  // Sync date if not set
  if (!localStorage.getItem("bihar_forecast_date")) {
    localStorage.setItem("bihar_forecast_date", new Date().toISOString());
  }

  // Generate Table instead of redirecting
  generateDistrictForecastTable(weeklyMaxTemp, weeklyMinTemp);
  document.getElementById("generatedTableSection").style.display = "block";

  alert("Data saved and Forecast Table generated successfully!");
  // window.location.href = "Temperature_Forecast.html"; // Redirect removed
}

function identifyPhenomenon(text) {
  const lower = text.toLowerCase();
  for (const def of phenDefs) {
    if (def.keywords.some((k) => lower.includes(k))) {
      return def.id;
    }
  }
  return null;
}

function identifyWarning(text) {
  const lower = text.toLowerCase();
  if (lower.includes("red") || lower.includes("lal"))
    return { level: 3, color: warningColors.red };
  if (lower.includes("orange") || lower.includes("narangi"))
    return { level: 2, color: warningColors.orange };
  if (lower.includes("yellow") || lower.includes("pila"))
    return { level: 1, color: warningColors.yellow };
  return { level: 0, color: warningColors.green };
}

// ---------- New Table Generation & Export Logic ----------

function generateDistrictForecastTable(maxData, minData) {
  const container = document.getElementById("forecastTableContainer");
  if (!container) return;

  const today = new Date();
  const dateHeaders = [];

  // Helper for date suffix (17th, 18th etc.)
  const getDaySuffix = (n) => {
    if (n > 3 && n < 21) return "th";
    switch (n % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayNum = d.getDate();
    const dayNumPad = String(dayNum).padStart(2, "0");
    const month = d.toLocaleString("default", { month: "short" });
    dateHeaders.push(
      `${dayNumPad}<sup style="text-transform: lowercase; font-size: 0.6em;">${getDaySuffix(dayNum)}</sup><br>${month}`,
    );
  }

  let html = `
    <div style="text-align:center; font-weight:bold; font-size:16px; margin-bottom:10px; font-family:Arial, sans-serif;">
        जिलावार तापमान पूर्वानुमान सारणी / District Wise Temperature Forecast Table
    </div>
    <table class="gen-table" id="exportTable">
        <thead>
            <tr>
                <th rowspan="2" style="width:10%; vertical-align: middle;">METEOROLOGICAL<br>SECTOR</th>
                <th rowspan="2" style="width:25%; vertical-align: middle;">NAME OF THE DISTRICTS</th>
                <th rowspan="2" style="width:10%; vertical-align: middle;">Tmax (°C) /<br>Tmin (°C)</th>
                <th colspan="7" style="text-align:center; font-weight:bold;">
                    अगले सात दिनों तक अधिकतम और न्यूनतम तापमान का पूर्वानुमान /<br>
                    Maximum & Minimum Temperature forecast for next 7 days
                </th>
            </tr>
            <tr>
                ${dateHeaders.map((d) => `<th>${d}</th>`).join("")}
            </tr>
        </thead>
        <tbody>
  `;

  regions.forEach((region) => {
    // Get districts for this region
    const districtIds = subRegionDistricts[region.code] || [];
    const districtNames = districtIds
      .map((id) => {
        const d = districtsData.find((x) => x.id === id);
        return d ? `${d.name} (${d.hindi})` : id;
      })
      .join(", ");

    // Get data for the first district of the region (assuming uniform data per region from grid)
    const sampleId = String(districtIds[0]);

    // Row 1: Max Temp
    html += `
        <tr class="row-max-temp region-${region.code}">
            <td rowspan="2" style="font-weight:bold; vertical-align:middle;">${region.name}</td>
            <td rowspan="2" style="vertical-align:middle; text-align:left;">${districtNames}</td>
            <td style="font-weight:bold; color:#d35400;">Max Temp</td>
            ${Array(7)
              .fill(0)
              .map((_, i) => {
                const item = maxData[i][sampleId];
                const display = item?.range || item?.val || "-";
                return `<td>${display}</td>`;
              })
              .join("")}
        </tr>
      `;

    // Row 2: Min Temp
    html += `
        <tr class="row-min-temp region-${region.code}">
            <td style="font-weight:bold; color:#2980b9;">Min Temp</td>
            ${Array(7)
              .fill(0)
              .map((_, i) => {
                const item = minData[i][sampleId];
                const display = item?.range || item?.val || "-";
                return `<td>${display}</td>`;
              })
              .join("")}
        </tr>
      `;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;

  // Save generated HTML for Bulletin
  localStorage.setItem("bihar_temp_forecast_table_html", html);
}

function exportToImage() {
  const element = document.getElementById("forecastTableContainer");
  html2canvas(element, { backgroundColor: "#ffffff" }).then((canvas) => {
    const link = document.createElement("a");
    link.download = `Temperature_Forecast_Table_${new Date().toISOString().split("T")[0]}.png`;
    link.href = canvas.toDataURL();
    link.click();
  });
}

function exportToPDF() {
  const element = document.getElementById("forecastTableContainer");
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
        `Temperature_Forecast_Table_${new Date().toISOString().split("T")[0]}.pdf`,
      );
    },
  );
}

function exportToWord() {
  const html = document.getElementById("forecastTableContainer").innerHTML;
  const header =
    "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
    "xmlns:w='urn:schemas-microsoft-com:office:word' " +
    "xmlns='http://www.w3.org/TR/REC-html40'>" +
    "<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";
  const footer = "</body></html>";
  const sourceHTML = header + html + footer;

  const source =
    "data:application/vnd.ms-word;charset=utf-8," +
    encodeURIComponent(sourceHTML);
  const fileDownload = document.createElement("a");
  document.body.appendChild(fileDownload);
  fileDownload.href = source;
  fileDownload.download = `Temperature_Forecast_Table_${new Date().toISOString().split("T")[0]}.doc`;
  fileDownload.click();
  document.body.removeChild(fileDownload);
}

function exportToExcel() {
  const html = document.getElementById("exportTable").outerHTML;
  const blob = new Blob(["\ufeff", html], {
    type: "application/vnd.ms-excel",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Temperature_Forecast_Table_${new Date().toISOString().split("T")[0]}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
