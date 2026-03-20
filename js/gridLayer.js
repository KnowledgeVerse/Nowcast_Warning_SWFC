// js/gridLayer.js

let customGridLayerInstance = null;

function updateGridLayer() {
  if (typeof map === "undefined" || map === null) return;
  const mapObj = map;

  if (customGridLayerInstance) {
    mapObj.removeLayer(customGridLayerInstance);
  }

  const spacing = parseFloat(document.getElementById("gridSpacing").value) || 1;
  const color = document.getElementById("gridColor").value || "#333333";
  const weight = parseFloat(document.getElementById("gridWeight").value) || 0.8;
  const opacity =
    parseFloat(document.getElementById("gridOpacity").value) || 0.5;

  if (typeof L.latlngGraticule !== "undefined") {
    customGridLayerInstance = L.latlngGraticule({
      showLabel: true,
      color: color,
      weight: weight,
      opacity: opacity,
      zoomInterval: [
        { start: 2, end: 4, interval: spacing * 5 },
        { start: 5, end: 7, interval: spacing * 2 },
        { start: 8, end: 10, interval: spacing },
        { start: 11, end: 20, interval: spacing / 2 },
      ],
    });

    if (document.getElementById("toggleGrid").checked) {
      customGridLayerInstance.addTo(mapObj);
    }
  } else {
    console.warn("L.latlngGraticule plugin not loaded.");
  }
}

function toggleCustomGrid(show) {
  if (show) {
    updateGridLayer();
  } else {
    if (customGridLayerInstance && typeof map !== "undefined" && map !== null) {
      map.removeLayer(customGridLayerInstance);
    }
  }
}
