// js/autoBulletin.js
// 1️⃣7️⃣ & 1️⃣8️⃣ NOWCAST BULLETIN AUTO GENERATOR (HINDI + ENGLISH)

function generateAutoBulletin() {
  let warningPolys =
    typeof drawnItems !== "undefined" ? drawnItems.getLayers() : [];

  if (warningPolys.length === 0) {
    alert(
      "No Warning Polygons drawn on the map. Please draw a polygon first or use standard district selection.",
    );
    return;
  }

  let allPhenomena = new Set();
  let highestLevel = "Yellow";

  // Read attributes from drawn Polygons
  warningPolys.forEach((layer) => {
    if (layer.feature && layer.feature.properties) {
      const props = layer.feature.properties;

      // Collect phenomena
      if (props.phenomena) {
        props.phenomena.forEach((p) => allPhenomena.add(p));
      }

      // Detect highest warning
      if (props.warningColor === "#f44336") highestLevel = "Red";
      else if (props.warningColor === "#ff9800" && highestLevel !== "Red")
        highestLevel = "Orange";
    }
  });

  const phenomArr = Array.from(allPhenomena);
  const hasThunder =
    phenomArr.includes("thunderstorm") || phenomArr.includes("lightning");

  // Hindi Construct
  let phenomHi = [];
  if (hasThunder) phenomHi.push("मेघ गर्जन तथा वज्रपात");
  if (phenomArr.includes("rain")) phenomHi.push("भारी वर्षा");
  if (phenomArr.includes("hail")) phenomHi.push("ओलावृष्टि");
  if (phenomArr.includes("gusty_wind"))
    phenomHi.push("तेज हवा (40-50 किमी/घंटा)");

  // English Construct
  let phenomEn = [];
  if (hasThunder) phenomEn.push("Thunderstorm with lightning");
  if (phenomArr.includes("rain")) phenomEn.push("Heavy Rain");
  if (phenomArr.includes("hail")) phenomEn.push("Hailstorm");
  if (phenomArr.includes("gusty_wind"))
    phenomEn.push("Gusty Winds (40-50 Kmph)");

  // Target District text logic (We bridge drawn logic by grabbing globally selected districts or a standard text if none selected)
  let distEnStr = "the selected map regions";
  let distHiStr = "मानचित्र पर चयनित क्षेत्रों";

  if (
    typeof selectedDistricts !== "undefined" &&
    selectedDistricts.length > 0 &&
    typeof districtsData !== "undefined"
  ) {
    let selEn = [];
    let selHi = [];
    selectedDistricts.forEach((id) => {
      const dist = districtsData.find((d) => d.id === id);
      if (dist) {
        selEn.push(dist.en || dist.name);
        selHi.push(dist.hi || dist.hindi);
      }
    });
    distEnStr = selEn.join(", ") + " districts";
    distHiStr = selHi.join(", ") + " जिलों";
  }

  const hiText = `अगले 1-3 घंटों के दौरान ${distHiStr} में ${phenomHi.join(" और ")} की संभावना है।`;
  const enText = `${phenomEn.join(" and ")} likely over ${distEnStr} during next 1-3 hours.`;

  // Inject directly into the standard Warning Panels output
  const hiEl = document.getElementById("warningTextHindi");
  const enEl = document.getElementById("warningTextEnglish");

  if (hiEl) hiEl.innerText = hiText;
  if (enEl) enEl.innerText = enText;

  // Open Output
  const outputDiv = document.getElementById("nowcastOutput");
  if (outputDiv) {
    outputDiv.style.display = "block";
    outputDiv.classList.add("active");
    outputDiv.scrollIntoView({ behavior: "smooth" });
  }

  // Set standard warning level box
  if (typeof selectWarningLevel === "function") {
    selectWarningLevel(highestLevel.toLowerCase());
  }
}
