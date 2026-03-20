// js/impactForecast.js

function generateImpactForecast() {
  if (
    typeof selectedDistricts === "undefined" ||
    selectedDistricts.length === 0
  ) {
    alert(
      "कृपया प्रभाव पूर्वानुमान के लिए कम से कम एक जिला चुनें!\nPlease select at least one district for impact forecast.",
    );
    return;
  }

  const impactContainer = document.getElementById("impactForecastOutput");
  if (!impactContainer) return;

  impactContainer.innerHTML = "";

  selectedDistricts.forEach((districtId) => {
    const dist =
      typeof districtsData !== "undefined"
        ? districtsData.find((d) => d.id === districtId)
        : null;
    if (!dist) return;

    // Mock blocks selection formula for predictability per district
    const mockBlocks = [
      "Atri",
      "Sadar",
      "Tekari",
      "Wazirganj",
      "BodHgaya",
      "Danapur",
      "Barh",
      "Patna Sadar",
    ];
    const randomBlock = mockBlocks[(districtId * 7) % mockBlocks.length];

    const eta = Math.floor(Math.random() * 50) + 10; // 10 to 60 minutes
    let windSpeedStr =
      typeof selectedWindSpeed !== "undefined" && selectedWindSpeed
        ? selectedWindSpeed
        : "40-50";

    let rainStr = "10 mm";
    if (typeof selectedIntensity !== "undefined") {
      if (selectedIntensity === 1) rainStr = "20-30 mm";
      else if (selectedIntensity === 2) rainStr = "40-60 mm";
      else if (selectedIntensity === 3) rainStr = "60-100+ mm";
    }

    const card = document.createElement("div");
    card.style.cssText =
      "background: #f8f9fa; border-left: 4px solid #e74c3c; padding: 15px; margin-bottom: 15px; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);";
    card.innerHTML = `
            <h4 style="margin: 0 0 10px 0; color: #2c3e50;"><i class="fas fa-map-marker-alt"></i> District: ${dist.en || dist.name}</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
                <div><strong><i class="fas fa-building"></i> Block / Subdiv:</strong> <br>${randomBlock}</div>
                <div><strong><i class="fas fa-clock"></i> Storm arrival:</strong> <br>${eta} minutes</div>
                <div><strong><i class="fas fa-wind"></i> Est. wind speed:</strong> <br>${windSpeedStr} km/h</div>
                <div><strong><i class="fas fa-cloud-showers-heavy"></i> Est. rainfall:</strong> <br>${rainStr}</div>
            </div>
        `;
    impactContainer.appendChild(card);
  });

  document.getElementById("impactForecastModal").style.display = "flex";
}

function closeImpactModal() {
  const modal = document.getElementById("impactForecastModal");
  if (modal) modal.style.display = "none";
}
