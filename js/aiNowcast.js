// js/aiNowcast.js
// 2️⃣, 3️⃣, 4️⃣, 5️⃣, 1️⃣2️⃣, 2️⃣0️⃣ AI NOWCASTING DASHBOARD

let stormCellsLayer = null;

function runAINowcast() {
  if (typeof map === "undefined" || map === null) return;

  document.getElementById("aiNowcastPanel").style.display = "block";

  // Simulate AI Detection (Supercell, Squall Line, Lightning Outbreak)
  const aiDetections = [
    {
      dist: "Gaya",
      eta: "45 mins",
      warning: "Orange",
      risk: "Supercell & Hail",
      color: "#ff9800",
      coords: [24.796, 85.008],
    },
    {
      dist: "Jamui",
      eta: "60 mins",
      warning: "Yellow",
      risk: "Thunderstorm",
      color: "#ffeb3b",
      coords: [24.922, 86.223],
    },
    {
      dist: "Rohtas",
      eta: "30 mins",
      warning: "Red",
      risk: "Squall Line (70kmph)",
      color: "#f44336",
      coords: [24.954, 84.015],
    },
  ];

  const tbody = document.getElementById("aiAlertTableBody");
  tbody.innerHTML = "";

  if (stormCellsLayer) map.removeLayer(stormCellsLayer);
  stormCellsLayer = L.featureGroup().addTo(map);

  aiDetections.forEach((alert, idx) => {
    // Populate Table
    const tr = document.createElement("tr");
    tr.style.borderBottom = "1px solid #eee";
    tr.innerHTML = `
            <td style="padding: 8px;"><strong>${alert.dist}</strong></td>
            <td style="padding: 8px;">${alert.eta}</td>
            <td style="padding: 8px; color:${alert.color}; font-weight:bold; text-shadow:0 0 1px #000;">${alert.warning}</td>
            <td style="padding: 8px;">${alert.risk}</td>
            <td style="padding: 8px;">
                <button class="btn-success" style="padding:4px 8px; border:none; border-radius:4px; font-size:11px; cursor:pointer;" onclick="acceptAIAwaring('${alert.dist}', '${alert.warning}')">Accept</button>
            </td>
        `;
    tbody.appendChild(tr);

    // Map Visualization (12. Thunderstorm Cell Detection)
    const circle = L.circle(alert.coords, {
      color: alert.color,
      fillColor: alert.color,
      fillOpacity: 0.4,
      radius: 15000, // 15km radius storm cell
    }).bindPopup(`<b>AI Detection: ${alert.risk}</b><br>ETA: ${alert.eta}`);

    // Storm Motion Arrow (14. Auto Storm Tracking)
    const destination = [alert.coords[0] + 0.2, alert.coords[1] + 0.2];
    const motion = L.polyline([alert.coords, destination], {
      color: "#000",
      weight: 2,
      dashArray: "5, 5",
    });

    stormCellsLayer.addLayer(circle);
    stormCellsLayer.addLayer(motion);
  });

  map.fitBounds(stormCellsLayer.getBounds(), { padding: [50, 50] });
}

function acceptAIAwaring(districtName, warningLevel) {
  alert(
    `AI Warning accepted for ${districtName}. Adding to bulletin generation pipeline.`,
  );
  // Bridge to standard system logic: Automatically checks the district box
  const searchInputs = Array.from(
    document.querySelectorAll(".district-checkbox span"),
  );
  const matched = searchInputs.find((span) =>
    span.innerText.toLowerCase().includes(districtName.toLowerCase()),
  );
  if (matched) {
    const checkbox = matched.parentElement.querySelector("input");
    if (!checkbox.checked) checkbox.click(); // uses existing toggle logic
    selectWarningLevel(warningLevel.toLowerCase());
  }
}

// Global exposure for Pro Control Panel layer toggle
function generateStormCells() {
  runAINowcast();
  return stormCellsLayer;
}
