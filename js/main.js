// ---------- Intensity lines (Scripts.xlsx order) ----------
const intensityLines = {
  dry: ["मौसम शुष्क रहने की संभावना है।"],
  heavyrain: [
    "भारी वर्षा होने की संभावना है।",
    "बहुत भारी वर्षा होने की संभावना है।",
    "अत्यधिक भारी वर्षा होने की संभावना है।",
  ],
  heatwave: [
    "लू (उष्ण लहर) की संभावना है।",
    "भीषण लू (उष्ण लहर) की संभावना है।",
  ],
  warmnight: ["गर्म रात्रि की संभावना है।", "भीषण गर्म रात्रि की संभावना है।"],
  coldwave: ["शीत लहर की संभावना है।", "भीषण शीत लहर की संभावना है।"],
  coldday: [
    "शीत दिवस होने की संभावना है।",
    "भीषण शीत दिवस होने की संभावना है।",
  ],
  densefog: [
    "मध्यम कोहरा छाए रहने की संभावना है।",
    "घना कोहरा छाए रहने की संभावना है।",
    "बहुत घना कोहरा छाए रहने की संभावना है।",
  ],
  thunderstorm: [
    "हल्के से मध्यम दर्जे की मेघ गर्जन तथा वज्रपात के साथ वर्षा होने की संभावना है।",
    "मध्यम दर्जे की मेघ गर्जन, वज्रपात के साथ वर्षा होने की प्रबल संभावना है।",
    "तीव्र दर्जे की मेघ गर्जन, वज्रपात तथा भारी वर्षा के साथ तेज हवा की प्रबल संभावना है।",
  ],
  gustywind: [
    "तेज़ हवा (30-40 कि.मी. प्रति घंटे) रहने की संभावना है।",
    "तेज़ हवा (40-50 कि.मी. प्रति घंटे) रहने की संभावना है।",
    "तेज़ हवा (50-60 कि.मी. प्रति घंटे) रहने की संभावना है।",
  ],
  squall: [
    "मध्यम तीव्रता के तेज़ हवा के झोंके चलने की संभावना है।",
    "तीव्र गति के तेज़ हवा के झोंके चलने की प्रबल संभावना है।",
    "अत्यंत तीव्र गति के तेज़ हवा के झोंके चलने की अत्यधिक संभावना है。",
  ],
  frost: ["जमीन के स्तर पर पाला पड़ने की संभावना है।"],
  seastate: [
    "समुद्र अशांत से बहुत अशांत रहने की संभावना है।",
    "समुद्र ऊँचा से बहुत ऊँचा रहने की संभावना है।",
    "अभूतपूर्व समुद्र रहने की संभावना है।",
  ],
  cyclone: [
    "चक्रवाती तूफान की संभावना है।",
    "भीषण चक्रवाती तूफान की संभावना है।",
    "बहुत भीषण चक्रवाती तूफान की संभावना है।",
    "अत्यधिक भीषण चक्रवाती तूफान की संभावना है।",
    "सुपर साइक्लोन की संभावना है।",
  ],
  duststorm: ["दृश्यता में कमी के साथ धूल भरी आंधी चलने की संभावना है।"],
  snow: [
    "भारी बर्फबारी की संभावना है।",
    "बहुत भारी बर्फबारी की संभावना है।",
    "अत्यधिक भारी बर्फबारी की संभावना है।",
  ],
  hailstorm: ["ओलावृष्टि की संभावना है।"],
};

const intensityLinesEn = {
  dry: ["Weather likely to remain dry."],
  heavyrain: [
    "Heavy rainfall likely.",
    "Very heavy rainfall likely.",
    "Extremely heavy rainfall likely.",
  ],
  heatwave: ["Heat wave likely.", "Severe heat wave likely."],
  warmnight: ["Warm night likely.", "Severe warm night likely."],
  coldwave: ["Cold wave likely.", "Severe cold wave likely."],
  coldday: ["Cold day likely.", "Severe cold day likely."],
  densefog: [
    "Moderate fog likely.",
    "Dense fog likely.",
    "Very dense fog likely.",
  ],
  thunderstorm: [
    "Light to moderate thunderstorm & lightning with rain likely.",
    "Moderate thunderstorm & lightning with rain very likely.",
    "Severe thunderstorm & lightning with heavy rain very likely.",
  ],
  gustywind: [
    "Gusty wind (30-40 kmph) likely.",
    "Gusty wind (40-50 kmph) likely.",
    "Gusty wind (50-60 kmph) likely.",
  ],
  squall: [
    "Moderate squall likely.",
    "Severe squall likely.",
    "Very severe squall likely.",
  ],
  frost: ["Frost at ground level likely."],
  seastate: [
    "Rough to very rough sea likely.",
    "High to very high sea likely.",
    "Phenomenal sea likely.",
  ],
  cyclone: [
    "Cyclonic storm likely.",
    "Severe cyclonic storm likely.",
    "Very severe cyclonic storm likely.",
    "Extremely severe cyclonic storm likely.",
    "Super cyclone likely.",
  ],
  duststorm: ["Dust / sand storm with visibility reduction likely."],
  snow: [
    "Heavy snow likely.",
    "Very heavy snow likely.",
    "Extremely heavy snow likely.",
  ],
  hailstorm: ["Hailstorm likely."],
};

// ---------- Phenomena colour-map ----------
const phenColors = {
  dry: "#ffffff", // White
  heavyrain: "#007bff", // Blue
  heatwave: "#fd7e14", // Orange
  warmnight: "#e83e8c", // Pink
  coldwave: "#00bcd4", // Cyan
  coldday: "#20c997", // Teal
  densefog: "#6c757d", // Grey
  thunderstorm: "#ffc107", // Amber
  gustywind: "#17a2b8", // Info
  squall: "#607d8b", // Blue Grey
  frost: "#b2ebf2", // Light Cyan
  seastate: "#0d47a1", // Dark Blue
  cyclone: "#b71c1c", // Dark Red
  duststorm: "#d7ccc8", // Tan
  snow: "#f5f5f5", // White/Grey
  hailstorm: "#6f42c1", // Indigo
};

// ---------- Audio Assets ----------
const weatherSounds = {
  thunderstorm: "assets/audio/thunderstorm.mp3",
  gustywind: "assets/audio/gustywind.mp3",
  heatwave: "assets/audio/heatwave.mp3",
  hailstorm: "assets/audio/hailstorm.mp3",
  heavyrain: "assets/audio/heavyrain.mp3",
  densefog: "assets/audio/densefog.mp3",
  coldday: "assets/audio/coldday.mp3",
  warmnight: "assets/audio/warmnight.mp3",
};

// ---------- Dropdown Options (Custom Colors) ----------
const forecastDropdownOptions = [
  { value: 0, text: "DRY – शुष्क", color: null },
  {
    value: 1,
    text: "ISOL (ONE OR TWO PLACES) – एक दो स्थानों पर",
    color: "rgb(51, 204, 51)",
  },
  {
    value: 2,
    text: "SCATTERED (FEW PLACES) – कुछ स्थानों पर",
    color: "rgb(0, 153, 0)",
  },
  {
    value: 3,
    text: "FAIRLY WIDESPREAD (MANY PLACES) – अनेक स्थानों पर",
    color: "rgb(51, 204, 255)",
  },
  {
    value: 4,
    text: "WIDESPREAD (MOST PLACES) – अधिकांश स्थानों पर",
    color: "rgb(0, 102, 255)",
  },
];

const warningDropdownOptions = [
  { value: 0, text: "NO WARNING – कोई चेतावनी नहीं", color: "rgb(0, 153, 0)" },
  { value: 1, text: "YELLOW – पीला", color: "rgb(255, 255, 0)" },
  { value: 2, text: "ORANGE – नारंगी", color: "rgb(255, 192, 0)" },
  { value: 3, text: "RED – लाल", color: "rgb(255, 0, 0)" },
];

// Combine options for the Color Selection dropdown
const combinedColorOptions = [
  { value: "default", text: "Select Color...", color: null },
  { value: "#ffffff", text: "Dry (White) – शुष्क", color: "#ffffff" },
  ...forecastDropdownOptions
    .filter((o) => o.value !== 0)
    .map((o) => ({ ...o, text: "Forecast: " + o.text })),
  ...warningDropdownOptions.map((o) => ({ ...o, text: "Warning: " + o.text })),
];

// ---------- Legend Static Items ----------
const forecastLegendItems = [
  { color: "transparent", text: "DRY<br>शुष्क", border: "1px solid #999" },
  {
    color: "rgb(51, 204, 51)",
    text: "ISOL (ONE OR TWO PLACES)<br>एक दो स्थानों पर",
  },
  { color: "rgb(0, 153, 0)", text: "SCATTERED (FEW PLACES)<br>कुछ स्थानों पर" },
  {
    color: "rgb(51, 204, 255)",
    text: "FAIRLY WIDESPREAD (MANY PLACES)<br>अनेक स्थानों पर",
  },
  {
    color: "rgb(0, 102, 255)",
    text: "WIDESPREAD (MOST PLACES)<br>अधिकांश स्थानों पर",
  },
];

const warningLegendItems = [
  {
    color: "rgb(255, 0, 0)",
    text: "RED (लाल) – WARNING<br>(Take Action / तुरंत कार्रवाई करें)",
  },
  {
    color: "rgb(255, 192, 0)",
    text: "ORANGE (नारंगी) – ALERT<br>(Be Prepared / सतर्क रहें)",
  },
  {
    color: "rgb(255, 255, 0)",
    text: "YELLOW (पीला) – WATCH<br>(Be Updated / अपडेट रहें)",
  },
  {
    color: "rgb(0, 153, 0)",
    text: "GREEN (हरा) – NO WARNING<br>(No Action / कोई चेतावनी नहीं)",
  },
];

// ---------- Helper: Get Distribution Text (Single Source of Truth) ----------
function getDistributionText(val, lang) {
  const mapping = {
    0: {
      hi: "मौसम शुष्क रहने की संभावना है",
      en: "Weather likely to remain dry",
    },
    1: { hi: "एक-दो स्थानों पर", en: "at one or two places" },
    2: { hi: "कुछ स्थानों पर", en: "at a few places" },
    3: { hi: "अनेक स्थानों पर", en: "at many places" },
    4: { hi: "अधिकांश स्थानों पर", en: "at most places" },
  };
  // Strict mapping based on dropdown value
  return mapping[val] ? mapping[val][lang] : mapping[1][lang];
}

// ---------- Globals ----------
let selectedDistricts = [],
  selectedPhenomena = [],
  showFoothill = false,
  forecastBaseDate = new Date(),
  currentDay = 1,
  activeDays = new Set([1]),
  weeklyForecastData = Array(7)
    .fill(null)
    .map(() => ({})),
  weeklyWarningData = Array(7)
    .fill(null)
    .map(() => ({})),
  weeklyData = weeklyForecastData, // Default to Forecast
  currentReviewMode = null, // Default to null (no specific review mode active)
  districtPhenomenaMap = weeklyData[0],
  phenomenaMarkersLayer,
  isAudioEnabled = false,
  currentAudio = new Audio(),
  // Independent State Variables
  currentDistribution = 0,
  currentWarning = 0,
  currentColor = null;

let isLayoutEditMode = false;
let mapEffectConfig = {
  enabled: false,
  mode: "manual",
  manualEffect: "thunderstorm",
};
let weatherEffectState = {
  animationFrame: null,
  ctx: null,
  drops: [],
  width: 0,
  height: 0,
};

let currentLang = localStorage.getItem("lang") || "hi";

const uiTranslations = {
  hi: {
    title: "बिहार मौसम पूर्वानुमान प्रणाली",
    regional: "क्षेत्रीय समूह चुनें:",
    multiple: "एकाधिक जिले चुनें:",
    searchPlaceholder: "जिला खोजें...",
    placeCount: "DISTRIBUTION",
    warning: "WARNING",
    colorSelect: "COLOR SELECTION",
    phenomena: "मौसम घटनाएँ:",
    forecastRes: "पूर्वानुमान परिणाम:",
    btnGenerate: "पूर्वानुमान तैयार करें",
    btnUpdateForecast: "Forecast Map Update",
    btnUpdateWarning: "Warning Map Update",
    btnClear: "साफ़ करें",
    btnExportTxt: "टेक्स्ट निर्यात करें",
    btnExportPdf: "PDF निर्यात करें",
    btnCopy: "क्लिपबोर्ड पर कॉपी करें",
    btnSelectAll: "सभी चुनें",
    btnClearAll: "साफ़ करें",
    placeholder: "कोई जिला चुने और मौसम घटनाएँ चुनें...",
    placeOptions: [
      "शुष्क (Dry)",
      "एक या दो स्थानों पर",
      "कुछ स्थानों पर",
      "अनेक स्थानों पर",
      "अधिकांश स्थानों पर",
    ],
  },
  en: {
    title: "Bihar Weather Forecast System",
    regional: "Select Regional Groups:",
    multiple: "Select Multiple Districts:",
    searchPlaceholder: "Search District...",
    placeCount: "DISTRIBUTION",
    warning: "WARNING",
    colorSelect: "COLOR SELECTION",
    phenomena: "Weather Phenomena:",
    forecastRes: "Forecast Result:",
    btnGenerate: "Generate Forecast",
    btnUpdateForecast: "Forecast Map Update",
    btnUpdateWarning: "Warning Map Update",
    btnClear: "Clear",
    btnExportTxt: "Export Text",
    btnExportPdf: "Export PDF",
    btnCopy: "Copy to Clipboard",
    btnSelectAll: "Select All",
    btnClearAll: "Clear All",
    placeholder: "Select a district and weather phenomena...",
    placeOptions: [
      "Dry Weather",
      "At one or two places",
      "At a few places",
      "At many places",
      "At most places",
    ],
  },
};

// ---------- Phenomena + Scripts.xlsx sub-options ----------
const phenDefs = [
  {
    id: "dry",
    hindi: "शुष्क मौसम", // Not in Rule 3, keeping default
    english: "Dry Weather",
    icon: "fa-sun",
    image: "assets/weather-icons/dry.png",
  },
  {
    id: "heavyrain",
    hindi: "भारी वर्षा",
    english: "Heavy Rainfall",
    icon: "fa-cloud-showers-heavy",
    image: "assets/weather-icons/heavyrain.png",
  },
  {
    id: "heatwave",
    hindi: "उष्ण लहर",
    english: "Heat Wave",
    icon: "fa-fire",
    image: "assets/weather-icons/heatwave.png",
  },
  {
    id: "warmnight",
    hindi: "गर्म रात",
    english: "Warm Night",
    icon: "fa-temperature-high",
    image: "assets/weather-icons/warmnight.png",
  },
  {
    id: "coldwave",
    hindi: "शीत लहर",
    english: "Cold Wave",
    icon: "fa-temperature-low",
    image: "assets/weather-icons/coldwave.png",
  },
  {
    id: "coldday",
    hindi: "शीत दिवस",
    english: "Cold Day",
    icon: "fa-snowflake",
    image: "assets/weather-icons/coldday.png",
  },
  {
    id: "densefog",
    hindi: "घना कोहरा",
    english: "Dense Fog",
    icon: "fa-smog",
    image: "assets/weather-icons/densefog.png",
  },
  {
    id: "thunderstorm",
    hindi: "मेघ गर्जन, वज्रपात",
    english: "Thunderstorm/Lightning",
    icon: "fa-cloud-bolt",
    image: "assets/weather-icons/thunderstorm.png",
  },
  {
    id: "gustywind",
    hindi: "तेज़ हवा",
    english: "Gusty Wind",
    icon: "fa-wind",
    image: "assets/weather-icons/gustywind.png",
  },
  {
    id: "squall",
    hindi: "तेज़ हवा के झोंके",
    english: "Squall",
    icon: "fa-wind",
    image: "assets/weather-icons/squall.png",
  },
  {
    id: "frost",
    hindi: "पाला",
    english: "Frost",
    icon: "fa-icicles",
    image: "assets/weather-icons/frost.png",
  },
  {
    id: "seastate",
    hindi: "समुद्र की स्थिति",
    english: "Sea State",
    icon: "fa-water",
    image: "assets/weather-icons/sea.png",
  },
  {
    id: "cyclone",
    hindi: "चक्रवात",
    english: "Cyclone",
    icon: "fa-hurricane",
    image: "assets/weather-icons/cyclone.png",
  },
  {
    id: "duststorm",
    hindi: "धूल भरी आंधी",
    english: "Dust Storm",
    icon: "fa-wind",
    image: "assets/weather-icons/dust.png",
  },
  {
    id: "snow",
    hindi: "बर्फबारी",
    english: "Snow",
    icon: "fa-snowflake",
    image: "assets/weather-icons/snow.png",
  },
  {
    id: "hailstorm",
    hindi: "ओलावृष्टि", // Not in Rule 3 explicitly but standard
    english: "Hailstorm",
    icon: "fa-cloud-meatball",
    image: "assets/weather-icons/hailstorm.png",
  },
];

// ---------- SVG Icons for Export Compatibility ----------
const phenomenonSvgs = {
  thunderstorm:
    '<svg viewBox="0 0 512 512" fill="currentColor" width="1em" height="1em"><path d="M296 464h-56V338.78l68.74-75.48a32 32 0 0 0-4.28-46.66C296.7 210.8 286.33 208 271.46 208H240V112c0-8.84-7.16-16-16-16h-16c-8.84 0-16 7.16-16 16v104h-31.46c-14.87 0-25.24 2.8-33 8.64a32 32 0 0 0-4.28 46.66l68.74 75.48V464zM400 32H112C50.14 32 0 82.14 0 144v224c0 61.86 50.14 112 112 112h288c61.86 0 112-50.14 112-112V144c0-61.86-50.14-112-112-112zM112 448c-44.11 0-80-35.89-80-80V144c0-44.11 35.89-80 80-80h288c44.11 0 80 35.89 80 80v224c0 44.11-35.89 80-80 80H112z"/></svg>', // Bolt/Cloud approx
  gustywind:
    '<svg viewBox="0 0 512 512" fill="currentColor" width="1em" height="1em"><path d="M480 288c0-53-43-96-96-96h-64v-32h64c70.7 0 128 57.3 128 128s-57.3 128-128 128H176c-8.8 0-16-7.2-16-16s7.2-16 16-16h208c53 0 96-43 96-96zM128 32C57.3 32 0 89.3 0 160s57.3 128 128 128h256c8.8 0 16-7.2 16-16s-7.2-16-16-16H128c-53 0-96-43-96-96s43-96 96-96h288c8.8 0 16-7.2 16-16s-7.2-16-16-16H128zm0 384c-53 0-96 43-96 96s43 96 96 96h112c8.8 0 16-7.2 16-16s-7.2-16-16-16H128c-35.3 0-64-28.7-64-64s28.7-64 64-64h160c8.8 0 16-7.2 16-16s-7.2-16-16-16H128z"/></svg>',
  squall:
    '<svg viewBox="0 0 512 512" fill="currentColor" width="1em" height="1em"><!-- PASTE YOUR SVG CONTENT HERE --></svg>',
  heatwave:
    '<svg viewBox="0 0 384 512" fill="currentColor" width="1em" height="1em"><path d="M192 0C139 0 96 43 96 96V256c0 11.8-1.3 23.4-3.9 34.6C60.9 308.6 32 348.2 32 392c0 66.3 53.7 120 120 120s120-53.7 120-120c0-43.8-28.9-83.4-60.1-101.4-2.6-11.2-3.9-22.8-3.9-34.6V96c0-53-43-96-96-96zM64 96c0-70.7 57.3-128 128-128s128 57.3 128 128v160c0 17.7 14.3 32 32 32s32-14.3 32-32V96C384 43 341 0 288 0H96C43 0 0 43 0 96v160c0 17.7 14.3 32 32 32s32-14.3 32-32V96z"/></svg>', // Thermometer approx
  hailstorm:
    '<svg viewBox="0 0 512 512" fill="currentColor" width="1em" height="1em"><path d="M144 208c-44.2 0-80 35.8-80 80s35.8 80 80 80 80-35.8 80-80-35.8-80-80-80zm256-32c-61.9 0-112 50.1-112 112s50.1 112 112 112 112-50.1 112-112-50.1-112-112-112zM256 32C114.6 32 0 146.6 0 288c0 92.6 49.3 174.2 123.2 219.8 8.1 5 18.7 2.5 23.7-5.6 5-8.1 2.5-18.7-5.6-23.7C79.2 439.6 32 368.5 32 288c0-123.7 100.3-224 224-224s224 100.3 224 224c0 80.5-47.2 151.6-109.3 190.5-8.1 5-10.6 15.6-5.6 23.7 5 8.1 15.6 10.6 23.7 5.6C462.7 462.2 512 380.6 512 288 512 146.6 397.4 32 256 32z"/></svg>', // Cloud/Dots approx
  heavyrain:
    '<svg viewBox="0 0 512 512" fill="currentColor" width="1em" height="1em"><path d="M96 320c-53 0-96-43-96-96s43-96 96-96h16c0-70.7 57.3-128 128-128s128 57.3 128 128h16c53 0 96 43 96 96s-43 96-96 96H96zm32 64c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32s32-14.3 32-32v-64c0-17.7-14.3-32-32-32zm128 0c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32s32-14.3 32-32v-64c0-17.7-14.3-32-32-32zm128 0c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32s32-14.3 32-32v-64c0-17.7-14.3-32-32-32z"/></svg>',
  densefog:
    '<svg viewBox="0 0 512 512" fill="currentColor" width="1em" height="1em"><path d="M464 256H48c-26.5 0-48 21.5-48 48s21.5 48 48 48h416c26.5 0 48-21.5 48-48s-21.5-48-48-48zm0 112H48c-26.5 0-48 21.5-48 48s21.5 48 48 48h416c26.5 0 48-21.5 48-48s-21.5-48-48-48zM80 144h352c26.5 0 48-21.5 48-48s-21.5-48-48-48H80c-26.5 0-48 21.5-48 48s21.5 48 48 48z"/></svg>',
  coldday:
    '<svg viewBox="0 0 448 512" fill="currentColor" width="1em" height="1em"><path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192zm-192 96c-53 0-96-43-96-96s43-96 96-96 96 43 96 96-43 96-96 96z"/></svg>', // Snowflake approx
  warmnight:
    '<svg viewBox="0 0 384 512" fill="currentColor" width="1em" height="1em"><path d="M192 0C139 0 96 43 96 96V256c0 11.8-1.3 23.4-3.9 34.6C60.9 308.6 32 348.2 32 392c0 66.3 53.7 120 120 120s120-53.7 120-120c0-43.8-28.9-83.4-60.1-101.4-2.6-11.2-3.9-22.8-3.9-34.6V96c0-53-43-96-96-96zM64 96c0-70.7 57.3-128 128-128s128 57.3 128 128v160c0 17.7 14.3 32 32 32s32-14.3 32-32V96C384 43 341 0 288 0H96C43 0 0 43 0 96v160c0 17.7 14.3 32 32 32s32-14.3 32-32V96z"/></svg>',
  dry: '<svg viewBox="0 0 512 512" fill="currentColor" width="1em" height="1em"><path d="M256 160c-52.9 0-96 43.1-96 96s43.1 96 96 96 96-43.1 96-96-43.1-96-96-96zm246.4 80.5l-94.7-47.3 33.5-100.4c4.5-13.6-8.4-26.5-21.9-21.9l-100.4 33.5-47.4-94.8c-6.4-12.8-24.6-12.8-31 0l-47.3 94.7L92.7 70.8c-13.6-4.5-26.5 8.4-21.9 21.9l33.5 100.4-94.7 47.4c-12.8 6.4-12.8 24.6 0 31l94.7 47.3-33.5 100.5c-4.5 13.6 8.4 26.5 21.9 21.9l100.4-33.5 47.3 94.7c6.4 12.8 24.6 12.8 31 0l47.3-94.7 100.4 33.5c13.6 4.5 26.5-8.4 21.9-21.9l-33.5-100.4 94.7-47.3c13-6.5 13-24.7.2-31.1zm-155.9 106c-49.9 49.9-131.1 49.9-181 0-49.9-49.9-49.9-131.1 0-181 49.9-49.9 131.1-49.9 181 0 49.9 49.9 49.9 131.1 0 181z"/></svg>',
};

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  buildRegionalGrid();
  buildMultipleDistrictGrid();
  buildPhenomenaPanel();
  buildColorSelectionDropdown();
  attachHandlers();
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
    document.getElementById("darkModeToggle").innerHTML =
      '<i class="fas fa-sun"></i>';
    document.getElementById("darkModeToggle").title = "Light Mode";
  }
  updateLanguageUI();
  initMap();
  validateDistrictCoverage();
  loadSavedData(); // Load data on startup
  initVisitorCounter();

  // Check login persistence
  if (localStorage.getItem("admin_logged_in") === "true") {
    document.body.classList.add("logged-in");
    const lbl = document.getElementById("lblLayoutEdit");
    if (lbl) lbl.style.display = "inline-flex";
  }
});

// ---------- UI builders ----------
function buildRegionalGrid() {
  const box = document.getElementById("regionalGrid");
  box.innerHTML = ""; // Clear to prevent duplicates

  // Add ALL Option (First)
  const allLbl = document.createElement("label");
  allLbl.className = "regional-checkbox region-all";
  allLbl.innerHTML = `<input type="checkbox" value="ALL" onchange="handleRegionChange(this)"><span>ALL</span>`;
  box.appendChild(allLbl);

  Object.entries(regionalGroups).forEach(([key, g]) => {
    const lbl = document.createElement("label");
    lbl.className = `regional-checkbox region-${key}`;
    const text = currentLang === "hi" ? g.name : g.english;
    lbl.innerHTML = `<input type="checkbox" value="${key}" onchange="handleRegionChange(this)"><span>${text}</span>`;
    box.appendChild(lbl);
  });
}
function buildMultipleDistrictGrid() {
  const grid = document.getElementById("districtGrid");
  grid.innerHTML = ""; // Clear existing content to prevent duplicates
  districtsData.forEach((d) => {
    const lbl = document.createElement("label");
    lbl.className = "district-checkbox";
    const text = currentLang === "hi" ? d.hindi : d.name;
    lbl.innerHTML = `<input type="checkbox" value="${d.id}" onchange="updateMultipleSelection()"><span>${text}</span>`;
    grid.appendChild(lbl);
  });
  filterDistricts(); // Ensure all items are visible by default
}
function buildPhenomenaPanel() {
  const box = document.getElementById("phenomenaContainer");
  phenDefs.forEach((d) => {
    const row = document.createElement("div");
    row.className = "phenomenon-row";
    row.style.borderLeft = `5px solid ${phenColors[d.id]}`;
    const name = currentLang === "hi" ? d.hindi : d.english;
    const lines =
      currentLang === "hi" ? intensityLines[d.id] : intensityLinesEn[d.id];

    const isChecked =
      localStorage.getItem(`bihar_hide_icon_${d.id}`) === "true"
        ? "checked"
        : "";
    const hideIconHtml = `<label style="margin-left:auto; font-size:0.9em; display:flex; align-items:center; cursor:pointer; white-space:nowrap;">
                      <input type="checkbox" id="hideIcon-${d.id}" ${isChecked} onchange="localStorage.setItem('bihar_hide_icon_${d.id}', this.checked); updateMapStyle()" style="margin-right:4px;"> 
                      Hide Icon
                    </label>`;

    row.innerHTML = `
      <input class="main-check same-size" type="checkbox" value="${d.id}" onchange="togglePhenom('${d.id}')">
      <div class="phenom-icon"><img src="${d.image}" class="phenom-anim-${d.id}" style="width: 100%; height: 100%; object-fit: contain;"></div>
      <label><strong>${name}</strong></label>
      <select class="sub-select intensity-select same-size" id="intensity-${d.id}">
        ${lines.map((s, i) => `<option value="${i}">${s}</option>`).join("")}
      </select>${hideIconHtml}`;
    box.appendChild(row);
  });
}
function buildColorSelectionDropdown() {
  const select = document.getElementById("globalColorSelect");
  select.innerHTML = "";
  combinedColorOptions.forEach((opt) => {
    const option = document.createElement("option");
    option.value = opt.color || "";
    option.innerText = opt.text;
    if (opt.color) option.style.backgroundColor = opt.color;
    select.appendChild(option);
  });
}

// ---------- Handlers ----------
function attachHandlers() {
  document.getElementById("districtSearch").oninput = filterDistricts;
  document.getElementById("generateForecast").onclick = generateForecast;
  document.getElementById("clearSelection").onclick = clearSelection;
  document.getElementById("exportText").onclick = exportToText;
  document.getElementById("exportPDF").onclick = exportToPDF;
  document.getElementById("copyClipboard").onclick = copyToClipboard;
  document.getElementById("darkModeToggle").onclick = toggleDarkMode;
  document.getElementById("langToggle").onclick = toggleLanguage;
  document.getElementById("backToTop").onclick = scrollToTop;
  document.getElementById("toggleFoothill").onchange = (e) => {
    showFoothill = e.target.checked;
    updateMapStyle();
    updateLegend();
  };
  const fhToggle = document.getElementById("toggleFoothill");
  if (fhToggle) {
    fhToggle.checked = false;
  }
  document.getElementById("updateForecastMap").onclick = () =>
    handleMapUpdate("forecast");
  document.getElementById("updateWarningMap").onclick = () =>
    handleMapUpdate("warning");
  document.getElementById("clearMapSelection").onclick = clearDistrictSelection;
  document.getElementById("btnTable").onclick = toggleTableView;
  document.getElementById("btnTestData").onclick = generateDemoData; // Switched to new Demo function
  document.getElementById("downloadMap").onclick = downloadMapImage;
  document.getElementById("downloadSmartImages").onclick = downloadSmartImages;
  document.getElementById("downloadSmartPDF").onclick = downloadSmartPDF;
  document.getElementById("toggleStreetView").onchange = (e) => {
    toggleTiles(e.target.checked);
  };
  document.getElementById("toggleAnimations").onchange = (e) => {
    const mapDiv = document.getElementById("map");
    if (e.target.checked) {
      mapDiv.classList.remove("static-icons");
    } else {
      mapDiv.classList.add("static-icons");
    }
  };
  document.getElementById("toggleSatelliteView").onchange = (e) => {
    toggleSatellite(e.target.checked);
  };
  document.getElementById("toggleHybridView").onchange = (e) => {
    toggleHybrid(e.target.checked);
  };
  document.getElementById("fitMapBounds").onclick = () => {
    if (geojsonLayer) map.fitBounds(geojsonLayer.getBounds());
  };
  document.getElementById("copyDayData").onclick = copyCurrentDayToAll;
  document.getElementById("copyDayDataSelect").onclick = openCopyModal;
  document.querySelectorAll(".map-region-check").forEach((cb) => {
    cb.onchange = (e) => toggleMapRegion(e.target.value, e.target.checked);
  });
  document.getElementById("openDisplayHeader").onclick = () => {
    window.open("display.html", "_blank");
  };
  document.getElementById("openLivePreview").onclick = () => {
    window.open("live.html", "_blank");
  };
  document.getElementById("toggleAudioEffects").onchange = (e) => {
    isAudioEnabled = e.target.checked;
    const slider = document.getElementById("audioVolumeSlider");
    if (slider) slider.style.display = isAudioEnabled ? "block" : "none";
    if (!isAudioEnabled) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } else {
      // If enabled, check if any phenomenon is already selected and play its sound
      const checked = document.querySelector(
        "#phenomenaContainer input:checked",
      );
      if (checked) togglePhenom(checked.value);
    }
  };
  const volSlider = document.getElementById("audioVolumeSlider");
  if (volSlider) {
    currentAudio.volume = volSlider.value;
    volSlider.oninput = (e) => (currentAudio.volume = e.target.value);
  }

  // Audio Visualizer Events
  currentAudio.onplay = () => {
    const ind = document.getElementById("audioPlayingIndicator");
    if (ind) ind.style.display = "block";
  };
  currentAudio.onpause = () => {
    const ind = document.getElementById("audioPlayingIndicator");
    if (ind) ind.style.display = "none";
  };
  currentAudio.onended = () => {
    const ind = document.getElementById("audioPlayingIndicator");
    if (ind) ind.style.display = "none";
  };

  document.getElementById("userLogoBtn").onclick = handleUserLogoClick;

  // ---------- INDEPENDENT STATE HANDLERS ----------

  // 1. Distribution Change
  document.getElementById("globalPlaceCount").addEventListener("change", () => {
    currentDistribution =
      parseInt(document.getElementById("globalPlaceCount").value) || 0;

    // Auto-set color based on distribution
    const opt = forecastDropdownOptions.find(
      (o) => o.value === currentDistribution,
    );
    if (opt && opt.color) {
      currentColor = opt.color;
      const cSelect = document.getElementById("globalColorSelect");
      if (cSelect) {
        cSelect.value = opt.color;
        cSelect.style.backgroundColor = opt.color;
      }
    }
    updateDropdownBackgrounds();
  });

  // 2. Warning Change
  document.getElementById("globalWarning").addEventListener("change", () => {
    currentWarning =
      parseInt(document.getElementById("globalWarning").value) || 0;

    // Auto-set color based on warning level
    const opt = warningDropdownOptions.find((o) => o.value === currentWarning);
    if (opt && opt.color) {
      currentColor = opt.color;
      const cSelect = document.getElementById("globalColorSelect");
      if (cSelect) {
        cSelect.value = opt.color;
        cSelect.style.backgroundColor = opt.color;
      }
    }
    updateDropdownBackgrounds();
  });

  // 3. Color Change
  document
    .getElementById("globalColorSelect")
    .addEventListener("change", (e) => {
      const val = e.target.value;
      if (val && val !== "default") {
        currentColor = val;
        e.target.style.backgroundColor = val;
      } else {
        currentColor = null;
        e.target.style.backgroundColor = "";
      }
    });

  // Clear Forecast & Warning Button
  const btnClearFW = document.getElementById("btnClearFW");
  if (btnClearFW) {
    btnClearFW.onclick = clearForecastWarningData;

    // Inject Custom Date Picker
    const dateWrapper = document.createElement("div");
    dateWrapper.style.display = "inline-flex";
    dateWrapper.style.alignItems = "center";
    dateWrapper.style.marginRight = "10px";
    const todayStr = new Date().toISOString().split("T")[0];
    dateWrapper.innerHTML = `
        <label style="margin-right:5px; font-weight:bold; font-size:0.9em; color:#333;">Date:</label>
        <input type="date" id="customDateInput" value="${todayStr}" style="padding:4px; border:1px solid #ccc; border-radius:4px;">
        <button id="resetDateBtn" title="Reset to Today" style="margin-left:5px; padding:4px 8px; border:1px solid #ccc; border-radius:4px; background:#f8f9fa; cursor:pointer;">
            <i class="fas fa-sync-alt"></i>
        </button>
    `;
    btnClearFW.parentNode.insertBefore(dateWrapper, btnClearFW);

    const dateInput = document.getElementById("customDateInput");

    dateInput.addEventListener("change", (e) => {
      forecastBaseDate = e.target.value ? new Date(e.target.value) : new Date();
      localStorage.setItem(
        "bihar_forecast_date",
        forecastBaseDate.toISOString(),
      );
      updateMapDateHeader();
      updateMapHeaderText();
    });

    document.getElementById("resetDateBtn").onclick = () => {
      const today = new Date();
      // Adjust for local timezone to set input value correctly
      const offset = today.getTimezoneOffset();
      const localDate = new Date(today.getTime() - offset * 60 * 1000);
      const tStr = localDate.toISOString().split("T")[0];

      dateInput.value = tStr;
      forecastBaseDate = today;
      localStorage.setItem(
        "bihar_forecast_date",
        forecastBaseDate.toISOString(),
      );
      updateMapDateHeader();
      updateMapHeaderText();
    };
  }

  // Show Update Button Handler
  const btnShowUpdate = document.getElementById("btnShowUpdate");
  if (btnShowUpdate) {
    btnShowUpdate.onclick = () => {
      const options = document.getElementById("hiddenUpdateOptions");
      if (options)
        options.style.display =
          options.style.display === "none" ? "flex" : "none";
    };
  }

  const btnToggleDrag = document.getElementById("btnToggleDrag");
  if (btnToggleDrag) {
    btnToggleDrag.onclick = toggleLayoutEditMode;
  }

  const bgBtn = document.getElementById("bgChangeBtn");
  if (bgBtn) {
    bgBtn.onclick = () => document.getElementById("bgColorInput").click();
  }

  // Load saved map background
  const savedMapBg = localStorage.getItem("bihar_map_bg");
  if (savedMapBg) {
    updateMapBackground(savedMapBg);
  }

  // Load Map Effect Config
  const savedEffect = localStorage.getItem("bihar_map_effect_config");
  if (savedEffect) {
    mapEffectConfig = JSON.parse(savedEffect);
    const toggle = document.getElementById("toggleMapEffect");
    const select = document.getElementById("mapEffectSelect");
    if (toggle) toggle.checked = mapEffectConfig.enabled;
    if (select) select.value = mapEffectConfig.manualEffect;
  }
  initWeatherCanvas();
  applyMapEffect();

  document
    .getElementById("toggleLegend")
    .addEventListener("change", updateLegend);
}
function updateMultipleSelection() {
  selectedDistricts = Array.from(
    document.querySelectorAll("#districtGrid input:checked"),
  ).map((cb) => cb.value);
  updateMapStyle();
}
function filterDistricts() {
  const query = document.getElementById("districtSearch").value.toLowerCase();
  document
    .querySelectorAll("#districtGrid .district-checkbox")
    .forEach((lbl) => {
      const text = lbl.innerText.toLowerCase();
      lbl.style.display = text.includes(query) ? "flex" : "none";
    });
}
function handleRegionChange(checkbox) {
  const val = checkbox.value;
  const checked = checkbox.checked;

  if (val === "ALL") {
    // Select/Deselect All Regions
    document
      .querySelectorAll("#regionalGrid input:not([value='ALL'])")
      .forEach((cb) => {
        cb.checked = checked;
      });
    // Trigger update to select districts
    updateRegionalSelection();
    return;
  }

  // If any specific region is unchecked, uncheck ALL
  if (!checked) {
    const allCb = document.querySelector("#regionalGrid input[value='ALL']");
    if (allCb) allCb.checked = false;
  }

  const hierarchy = {
    northern: ["foothill", "north-west", "north-central", "north-east"],
    southern: ["south-west", "south-central", "south-east"],
  };
  if (hierarchy[val] && checked) {
    hierarchy[val].forEach((sub) => {
      const el = document.querySelector(`#regionalGrid input[value="${sub}"]`);
      if (el) el.checked = true;
    });
  }
  updateRegionalSelection();
}
function updateRegionalSelection() {
  const checkedRegions = Array.from(
    document.querySelectorAll("#regionalGrid input:checked"),
  ).map((cb) => cb.value);
  const regionDistricts = new Set();

  checkedRegions.forEach((key) => {
    if (regionalGroups[key]) {
      regionalGroups[key].districts.forEach((d) =>
        regionDistricts.add(String(d)),
      );
    }
  });

  document.querySelectorAll("#districtGrid input").forEach((cb) => {
    const parent = cb.closest(".district-checkbox");
    if (regionDistricts.has(cb.value)) {
      cb.checked = true;
      parent.classList.add("highlighted");
    } else if (parent.classList.contains("highlighted")) {
      cb.checked = false;
      parent.classList.remove("highlighted");
    }
  });

  updateMultipleSelection();
}
function selectAllRegions() {
  document
    .querySelectorAll("#regionalGrid input")
    .forEach((cb) => (cb.checked = true));
  updateRegionalSelection();
}
function clearRegionalSelection() {
  document
    .querySelectorAll("#regionalGrid input")
    .forEach((cb) => (cb.checked = false));
  updateRegionalSelection();
}
function selectAllDistricts() {
  document
    .querySelectorAll("#districtGrid input")
    .forEach((cb) => (cb.checked = true));
  updateMultipleSelection();
}
function clearDistrictSelection() {
  document.querySelectorAll("#districtGrid input").forEach((cb) => {
    cb.checked = false;
    cb.closest(".district-checkbox").classList.remove("highlighted");
  });
  document
    .querySelectorAll("#regionalGrid input")
    .forEach((cb) => (cb.checked = false));
  document
    .querySelectorAll(".map-region-check")
    .forEach((cb) => (cb.checked = false));
  updateMapStyle();
  updateMultipleSelection();
}

function setReviewMode(mode) {
  const btnF = document.getElementById("btnReviewForecast");
  const btnW = document.getElementById("btnReviewWarning");
  const headerText = document.getElementById("mapHeaderText");

  // Toggle logic: if clicking the already active mode, deselect it
  if (currentReviewMode === mode) {
    currentReviewMode = null;
    // Reset buttons
    if (btnF) {
      btnF.style.background = ""; // Reset to default CSS
      btnF.style.color = "#333";
    }
    if (btnW) {
      btnW.style.background = ""; // Reset to default CSS
      btnW.style.color = "#333";
    }
    // Hide header text
    if (headerText) headerText.style.display = "none";
  } else {
    currentReviewMode = mode;
    if (mode === "forecast") {
      weeklyData = weeklyForecastData;
      if (btnF) {
        btnF.style.background = "#17a2b8";
        btnF.style.color = "white";
      }
      if (btnW) {
        btnW.style.background = "";
        btnW.style.color = "#333";
      }
    } else {
      weeklyData = weeklyWarningData;
      if (btnF) {
        btnF.style.background = "";
        btnF.style.color = "#333";
      }
      if (btnW) {
        btnW.style.background = "#28a745";
        btnW.style.color = "white";
      }
    }
    // Show header text
    if (headerText) headerText.style.display = "block";
  }

  // Update current day view based on new mode data
  districtPhenomenaMap = weeklyData[currentDay - 1];

  updateMapHeaderText();
  updateMapStyle();
  updateLegend();
  resetTableView();
}

function togglePhenom(id) {
  // Play/Stop sound based on checkbox state
  const checkbox = document.querySelector(
    `#phenomenaContainer input[value="${id}"]`,
  );

  if (checkbox && checkbox.checked) {
    if (isAudioEnabled && weatherSounds[id]) {
      if (!currentAudio.paused) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      currentAudio.src = weatherSounds[id];
      currentAudio.play().catch((e) => console.warn("Audio play failed:", e));
    }
  } else {
    updateLegend(); // Update legend when checkbox changes
    // Stop audio if unchecked
    if (!currentAudio.paused) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
  }
  updateLegend();
}

// ---------- Forecast ----------
function generateForecast() {
  const overlay = document.getElementById("loadingOverlay");
  if (overlay) overlay.style.display = "flex";

  setTimeout(() => {
    let fullHtml = "";
    const today = new Date(forecastBaseDate);

    // Generate forecast for all 7 days
    for (let i = 1; i <= 7; i++) {
      const dayDate = new Date(today);
      dayDate.setDate(today.getDate() + (i - 1));
      const dateStr = dayDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      const dayData = weeklyData[i - 1];
      const dayHtml = generateDayForecastHtml(i, dateStr, dayData);
      fullHtml += dayHtml;
    }

    document.getElementById("forecastContent").innerHTML =
      fullHtml || '<p class="placeholder-text">No forecast data available.</p>';
    resetTableView();
    if (overlay) overlay.style.display = "none";
  }, 800);
}

function generateDayForecastHtml(dayNum, dateStr, dayData) {
  // Group districts by unique phenomena + intensity + color
  const groups = {};

  Object.entries(dayData).forEach(([distId, data]) => {
    if (!data.phenomena || data.phenomena.size === 0) return;

    // Create a unique key for grouping
    const phenArray = Array.from(data.phenomena).sort();
    const intensities = data.intensities || {};
    const keyParts = phenArray.map((p) => `${p}:${intensities[p] || 0}`);
    const key =
      keyParts.join("|") +
      `|${data.color}|${data.distribution}|${data.warningLevel}`;

    if (!groups[key]) {
      groups[key] = {
        districts: [],
        phenomena: phenArray,
        intensities: intensities,
        color: data.color,
        distribution: data.distribution || 0,
        warningLevel: data.warningLevel || 0,
      };
    }
    groups[key].districts.push(parseInt(distId));
  });

  if (Object.keys(groups).length === 0) {
    // No warning for this day
    return `
      <div class="forecast-item" style="background:#d4edda; border-left:5px solid #28a745;">
        <strong>Day ${dayNum} (${dateStr})</strong>
        <p style="margin-top:5px;">${currentLang === "hi" ? "कोई चेतावनी नहीं।" : "No Warning."}</p>
      </div>`;
  }

  let dayHtml = "";

  // Sort groups by severity (simple heuristic: Red > Orange > Yellow > Green)
  // For now, just render
  Object.values(groups).forEach((group) => {
    const areaText = getAreaText(group.districts);
    const color = group.color || "#28a745";
    const coverageHi = getDistributionText(group.distribution, "hi");
    const coverageEn = getDistributionText(group.distribution, "en");

    let hindiDesc = "";
    let englishDesc = "";

    group.phenomena.forEach((pId) => {
      const intensityIdx = group.intensities[pId] || 0;
      const pDef = phenDefs.find((pd) => pd.id === pId);

      if (pDef) {
        const hText = intensityLines[pId][intensityIdx];
        const eText = intensityLinesEn[pId][intensityIdx];

        // Construct sentences based on templates
        if (currentLang === "hi") {
          // Area + " के " + Coverage Text + " " + Phenomenon Text
          hindiDesc += `<p><strong>${pDef.hindi}:</strong> ${areaText.hindi} के ${coverageHi} ${hText}</p>`;
        }

        let sentence = eText.replace(/\.$/, ""); // Remove trailing dot
        englishDesc += `<p><strong>${pDef.english}:</strong> ${sentence} ${coverageEn} in ${areaText.english} of the state.</p>`;
      }
    });

    dayHtml += `
      <div class="forecast-item" style="background:${color}20; border-left:5px solid ${color};">
         <div style="display:flex; justify-content:space-between;">
            <strong>Day ${dayNum} (${dateStr})</strong>
            <span style="font-size:0.8em; opacity:0.7;">${currentLang === "hi" ? "चेतावनी" : "Warning"}</span>
         </div>
         <div style="margin-top:10px;">${currentLang === "hi" ? hindiDesc : englishDesc}</div>
         ${currentLang === "hi" ? `<div style="margin-top:10px; border-top:1px dashed #ccc; padding-top:5px; font-size:0.9em; color:#555;">${englishDesc}</div>` : ""}
      </div>
    `;
  });

  return dayHtml;
}

function getAreaText(districtIds) {
  // Check for ALL selection
  const allCb = document.querySelector("#regionalGrid input[value='ALL']");
  const isAllSelected =
    (allCb && allCb.checked) ||
    (districtIds.length === districtsData.length && districtsData.length > 0);

  if (isAllSelected) {
    return {
      hindi: "राज्य के बिहार के अधिकांश जिलों में",
      english: "Most districts of Bihar state",
      isAll: true,
    };
  }

  let remainingIds = new Set(districtIds);
  let regionsFoundHi = [];
  let regionsFoundEn = [];

  // Prioritize specific sub-regions for grouping
  const specificRegions = [
    "north-west",
    "north-central",
    "north-east",
    "south-west",
    "south-central",
    "south-east",
  ];

  specificRegions.forEach((key) => {
    const group = regionalGroups[key];
    if (!group) return;
    const groupIds = group.districts;

    if (groupIds.every((id) => remainingIds.has(id))) {
      // Clean names: "उत्तर-पश्चिम क्षेत्र" -> "उत्तर-पश्चिम"
      let nameHi = group.name.replace(" क्षेत्र", "").replace(" बिहार", "");
      let nameEn = group.english.replace(" Region", "");

      regionsFoundHi.push(nameHi);
      regionsFoundEn.push(nameEn);
      groupIds.forEach((id) => remainingIds.delete(id));
    }
  });

  let distNamesHi = [];
  let distNamesEn = [];

  // Sort remaining districts
  const sortedRemaining = Array.from(remainingIds).sort((a, b) => a - b);
  sortedRemaining.forEach((id) => {
    const d = getDistrictNameById(id);
    if (d) {
      distNamesHi.push(d.hindi);
      distNamesEn.push(d.name);
    }
  });

  // Construct Hindi String
  let finalHi = "राज्य के ";
  let partsHi = [];

  if (regionsFoundHi.length > 0) {
    let regionStr =
      regionsFoundHi.length === 1
        ? regionsFoundHi[0]
        : regionsFoundHi.slice(0, -1).join(", ") +
          " एवं " +
          regionsFoundHi[regionsFoundHi.length - 1];
    partsHi.push(regionStr + " भाग के जिलों");
  }

  if (distNamesHi.length > 0) {
    let distStr =
      distNamesHi.length === 1
        ? distNamesHi[0]
        : distNamesHi.slice(0, -1).join(", ") +
          " एवं " +
          distNamesHi[distNamesHi.length - 1];
    partsHi.push(distStr + " जिलों");
  }

  finalHi += partsHi.join(", ");

  // Construct English String
  let finalEn = "";
  let partsEn = [];

  if (regionsFoundEn.length > 0) {
    let regionStr =
      regionsFoundEn.length === 1
        ? regionsFoundEn[0]
        : regionsFoundEn.slice(0, -1).join(", ") +
          " and " +
          regionsFoundEn[regionsFoundEn.length - 1];
    partsEn.push(regionStr + " parts");
  }

  if (distNamesEn.length > 0) {
    let distStr =
      distNamesEn.length === 1
        ? distNamesEn[0]
        : distNamesEn.slice(0, -1).join(", ") +
          " and " +
          distNamesEn[distNamesEn.length - 1];
    partsEn.push(distStr + " districts");
  }

  finalEn = partsEn.join(", ");

  return { hindi: finalHi, english: finalEn, isAll: false };
}

function displayConsolidatedForecast(list) {
  // Deprecated by generateDayForecastHtml but kept for compatibility if needed
  // ... logic replaced by generateForecast ...
  const distNames = list.map((x) =>
    currentLang === "hi" ? x.district.hindi : x.district.name,
  );
  const joiner = currentLang === "hi" ? " और " : " and ";
  const distStr =
    distNames.length === 1
      ? distNames[0]
      : distNames.length === 2
        ? distNames.join(joiner)
        : distNames.slice(0, -1).join(", ") +
          joiner +
          distNames[distNames.length - 1];

  let html = "";
  selectedPhenomena.forEach((p) => {
    const color = phenColors[p.phenom];
    const intensitySentence =
      currentLang === "hi"
        ? intensityLines[p.phenom][p.intensity]
        : intensityLinesEn[p.phenom][p.intensity];

    const placePhrase = uiTranslations[currentLang].placeOptions[p.place];

    const phenomName =
      currentLang === "hi"
        ? phenDefs.find((x) => x.id === p.phenom).hindi
        : phenDefs.find((x) => x.id === p.phenom).english;

    let finalSentence = "";
    if (currentLang === "hi") {
      finalSentence = `${distStr} जिलों के ${placePhrase} ${intensitySentence}`;
    } else {
      finalSentence = `${intensitySentence} ${placePhrase} over ${distStr} district(s).`;
    }

    html += `<div class="forecast-item" style="background:${color}20; border-left:5px solid ${color};">
               <strong>${phenomName}</strong>
               <p style="margin-top:10px;font-size:1.05em">${finalSentence}</p>
             </div>`;
  });
  document.getElementById("forecastContent").innerHTML = html;
}

// ---------- Export ----------
function exportToText() {
  const txt = document.getElementById("forecastContent").innerText;
  if (!txt || txt.includes("कोई जिला चुने")) {
    alert("पहले पूर्वानुमान तैयार करें।");
    return;
  }
  const blob = new Blob([txt], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `forecast-${new Date().toISOString().split("T")[0]}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}
function exportToPDF() {
  const html = document.getElementById("forecastContent").innerHTML;
  if (!html || html.includes("कोई जिला चुने")) {
    alert("पहले पूर्वानुमान तैयार करें।");
    return;
  }
  const win = window.open("", "_blank");
  win.document.write(
    `<html><head><title>बिहार मौसम पूर्वानुमान</title><style>body{font-family:'Noto Sans Devanagari',sans-serif;padding:20px}</style></head><body><h1>बिहार मौसम पूर्वानुमान</h1><p>तिथि: ${new Date().toLocaleString(
      "hi-IN",
    )}</p>${html}</body></html>`,
  );
  win.document.close();
  win.print();
}
function downloadMapImage() {
  const node = document.getElementById("map");
  node.classList.add("static-icons"); // Freeze animations
  // Use dom-to-image to capture the map div
  domtoimage
    .toPng(node, {
      width: node.offsetWidth,
      height: node.offsetHeight,
    })
    .then(function (dataUrl) {
      const link = document.createElement("a");
      link.download = `bihar-weather-map-${
        new Date().toISOString().split("T")[0]
      }.png`;
      link.href = dataUrl;
      link.click();
    })
    .catch(function (error) {
      console.error("Map download failed:", error);
      alert("मैप इमेज डाउनलोड करने में त्रुटि हुई।");
    })
    .finally(function () {
      node.classList.remove("static-icons"); // Unfreeze
    });
}

function resetTableView() {
  const mapWrapper = document.querySelector(".map-wrapper");
  if (mapWrapper) mapWrapper.style.display = "block";
  document.getElementById("map").style.display = "block";
  document.getElementById("forecastOutput").style.display = "block";
  const tableContainer = document.getElementById("tableViewContainer");
  if (tableContainer) tableContainer.style.display = "none";
  // Ensure map fits bounds when shown again
  if (map) map.invalidateSize();
}

function toggleTableView() {
  const mapWrapper = document.querySelector(".map-wrapper");
  const mapFrame = document.getElementById("map");
  const forecastOut = document.getElementById("forecastOutput");
  const tableContainer = document.getElementById("tableViewContainer");

  if (tableContainer.style.display === "none") {
    // Show Table
    if (mapWrapper) mapWrapper.style.display = "none";
    mapFrame.style.display = "none";
    forecastOut.style.display = "none";
    tableContainer.style.display = "block";
    renderTable();
    renderTableControls();
  } else {
    // Hide Table (Reset)
    resetTableView();
  }
}

let tableSortState = { column: "day", direction: "asc" };

function sortTable(column) {
  if (tableSortState.column === column) {
    tableSortState.direction =
      tableSortState.direction === "asc" ? "desc" : "asc";
  } else {
    tableSortState.column = column;
    tableSortState.direction = "asc";
  }
  renderTable();
}
window.sortTable = sortTable;

function renderTable(dataSource) {
  // Inject CSS for IMD Table Styling
  const styleId = "imd-table-style";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
      #imdTable { width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 12px; margin-top: 0; table-layout: fixed; }
      #imdTable th { background-color: #003366; color: white; padding: 12px; text-align: center; font-size: 14px; border: 1px solid #000; position: sticky; top: 0; z-index: 5; }
      #imdTable td { padding: 12px; border: 1px solid #000; vertical-align: top; color: #000; }
      #imdTable.compact { font-size: 11px; }
      #imdTable.compact th { padding: 6px; font-size: 12px; }
      #imdTable.compact td { padding: 6px; }
    `;
    document.head.appendChild(style);
  }

  // Update Table Headers
  const hideCols = document.getElementById("chkHideTableCols")?.checked;
  const filterColor =
    document.getElementById("filterTableColor")?.value || "all";
  const isCompact = document.getElementById("chkCompactView")?.checked;
  const hideWarningCol = document.getElementById("chkHideWarningCol")?.checked;
  const applyTextBg = document.getElementById("chkTextBgColor")?.checked;

  // Define widths based on user request
  let wDay = "5%";
  let wDate = "10%";
  let wArea = "20%";
  let wPhenom = "15%";
  let wDesc = "20%";
  let wColor = "10%";

  if (hideCols) {
    if (hideWarningCol) {
      // 4 Columns: Day, Date, Desc En, Desc Hi
      // User Request: Day+Date=20%, Desc=40%, Desc=40%
      wDay = "8%";
      wDate = "12%";
      wDesc = "40%";
    } else {
      // 5 Columns: Day, Date, Desc En, Desc Hi, Color
      wDay = "7%";
      wDate = "13%";
      wDesc = "35%";
      wColor = "10%";
    }
  }

  const table = document.getElementById("imdTable");
  if (table) {
    if (isCompact) table.classList.add("compact");
    else table.classList.remove("compact");
    table.style.tableLayout = "fixed"; // Ensure fixed layout is inline

    const getSortIcon = (col) => {
      if (tableSortState.column !== col)
        return '<i class="fas fa-sort" style="opacity:0.3; font-size:0.8em; margin-left:5px;"></i>';
      return tableSortState.direction === "asc"
        ? '<i class="fas fa-sort-up" style="margin-left:5px;"></i>'
        : '<i class="fas fa-sort-down" style="margin-left:5px;"></i>';
    };

    table.innerHTML = `
        <thead>
            <tr>
                <th style="width: ${wDay}; cursor:pointer; text-align: center; font-weight: bold;" onclick="sortTable('day')">DAY ${getSortIcon("day")}</th>
                <th style="width: ${wDate}; cursor:pointer; text-align: center; font-weight: bold;" onclick="sortTable('day')">DATE ${getSortIcon("day")}</th>
                ${!hideCols ? `<th style="width: ${wArea}; cursor:pointer; text-align: center; font-weight: bold;" onclick="sortTable('area')">AFFECTED AREA<br>(प्रभावित क्षेत्र) ${getSortIcon("area")}</th>` : ""}
                ${!hideCols ? `<th style="width: ${wPhenom}; cursor:pointer; text-align: center; font-weight: bold;" onclick="sortTable('phenom')">WEATHER PHENOMENON<br>(मौसम घटना) ${getSortIcon("phenom")}</th>` : ""}
                <th style="width: ${wDesc}; text-align: center; font-weight: bold;">WARNING DESCRIPTION<br>(English)</th>
                <th style="width: ${wDesc}; text-align: center; font-weight: bold;">चेतावनी विवरण<br>(हिन्दी)</th>
                ${!hideWarningCol ? `<th style="width: ${wColor}; cursor:pointer; text-align: center; font-weight: bold;" onclick="sortTable('color')">WARNING COLOUR<br>(चेतावनी रंग) ${getSortIcon("color")}</th>` : ""}
            </tr>
        </thead>
        <tbody></tbody>
      `;
  }

  // Update Header Title (Visible on Screen)
  const issueDate = new Date(forecastBaseDate);
  const endDate = new Date(forecastBaseDate);
  endDate.setDate(endDate.getDate() + 6);

  const options = { day: "2-digit", month: "long", year: "numeric" };
  const issueStr = issueDate.toLocaleDateString("en-IN", options);

  const startDay = issueDate.getDate().toString().padStart(2, "0");
  const endDay = endDate.getDate().toString().padStart(2, "0");
  const startMonth = issueDate.toLocaleDateString("en-IN", { month: "long" });
  const endMonth = endDate.toLocaleDateString("en-IN", { month: "long" });
  const startYear = issueDate.getFullYear();
  const endYear = endDate.getFullYear();

  let rangeStr = "";
  if (startMonth === endMonth && startYear === endYear) {
    rangeStr = `${startDay}–${endDay} ${startMonth} ${startYear}`;
  } else if (startYear === endYear) {
    rangeStr = `${startDay} ${startMonth} – ${endDay} ${endMonth} ${startYear}`;
  } else {
    rangeStr = `${startDay} ${startMonth} ${startYear} – ${endDay} ${endMonth} ${endYear}`;
  }

  const headerText = `Issued On: ${issueStr}: Weather Warning for Next 7 Days (${rangeStr})`;
  const headerEl = document.querySelector("#tableViewContainer h3");
  if (headerEl) headerEl.innerText = headerText;

  const tbody = document.querySelector("#imdTable tbody");
  if (!tbody) return;

  tbody.innerHTML = ""; // Clear existing content
  const today = new Date(forecastBaseDate);
  const dataToRender = dataSource || weeklyData;
  let rowDataList = [];

  for (let i = 1; i <= 7; i++) {
    const dayDate = new Date(today);
    dayDate.setDate(today.getDate() + (i - 1));
    const dateStr = dayDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const dayData = dataToRender[i - 1];
    const groups = {};
    Object.entries(dayData).forEach(([distId, data]) => {
      if (!data.phenomena || data.phenomena.size === 0) return;
      const phenArray = Array.from(data.phenomena).sort();
      const intensities = data.intensities || {};
      const keyParts = phenArray.map((p) => `${p}:${intensities[p] || 0}`);
      const key =
        keyParts.join("|") +
        `|${data.color}|${data.distribution}|${data.warningLevel}`;

      if (!groups[key]) {
        groups[key] = {
          districts: [],
          phenomena: phenArray,
          intensities: intensities,
          color: data.color,
          warningLevel: data.warningLevel || 0,
          distribution: data.distribution || 0,
        };
      }
      groups[key].districts.push(parseInt(distId));
    });

    if (Object.keys(groups).length === 0) {
      rowDataList.push({
        type: "no-warning",
        day: i,
        date: dateStr,
        colorClass: "warning-green",
        colorText: "Green (No Warning)",
        sortData: { day: i, area: "", phenom: "", color: 0 },
      });
    } else {
      Object.values(groups).forEach((group) => {
        let colorClass = "warning-green";
        let colorText = "Green (No Warning)";
        let w = group.warningLevel;

        // Fallback: Infer warning level from color if not explicitly set
        if (!w && group.color) {
          const c = group.color.toLowerCase();
          if (
            c.includes("255, 0, 0") ||
            c.includes("#dc3545") ||
            c.includes("red")
          )
            w = 3;
          else if (
            c.includes("255, 192, 0") ||
            c.includes("#fd7e14") ||
            c.includes("orange")
          )
            w = 2;
          else if (
            c.includes("255, 255, 0") ||
            c.includes("#ffc107") ||
            c.includes("yellow")
          )
            w = 1;
        }

        if (w === 1) {
          colorClass = "warning-yellow";
          colorText = "Yellow (Watch)";
        } else if (w === 2) {
          colorClass = "warning-orange";
          colorText = "Orange (Alert)";
        } else if (w === 3) {
          colorClass = "warning-red";
          colorText = "Red (Warning)";
        }

        const areaText = getAreaText(group.districts);
        const phenomStr = group.phenomena.map((p) => p).join(", ");

        rowDataList.push({
          type: "warning",
          day: i,
          date: dateStr,
          group: group,
          colorClass: colorClass,
          colorText: colorText,
          cachedAreaText: areaText,
          sortData: {
            day: i,
            area: areaText.english,
            phenom: phenomStr,
            color: group.warningLevel,
          },
        });
      });
    }
  }

  // Filter
  if (filterColor !== "all") {
    rowDataList = rowDataList.filter((item) => item.colorClass === filterColor);
  }

  // Sort
  if (tableSortState.column) {
    rowDataList.sort((a, b) => {
      let valA = a.sortData[tableSortState.column];
      let valB = b.sortData[tableSortState.column];

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return tableSortState.direction === "asc" ? -1 : 1;
      if (valA > valB) return tableSortState.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  // Render
  rowDataList.forEach((item, index) => {
    const neutralBg = index % 2 === 0 ? "#ffffff" : "#e6f3ff";
    const groupColor = item.group ? item.group.color : null;

    // Logic 4 & 5: Conditional Colour Application
    // Day/Date always neutral
    // Text Columns (Area, Phenom, Desc): Colored ONLY if Warning Col is Hidden AND Option Checked
    let textColBg = neutralBg;
    if (hideWarningCol && applyTextBg && groupColor) {
      textColBg = groupColor;
    }

    // Warning Column: Colored ONLY if Visible AND Color Selected
    let warningColBg = neutralBg;
    if (!hideWarningCol && groupColor) {
      warningColBg = groupColor;
    }

    if (item.type === "no-warning") {
      let noWarnBg = neutralBg;
      let noWarnStyle = "";
      if (hideWarningCol && applyTextBg) {
        noWarnBg = "#28a745";
        noWarnStyle = "color:white; font-weight:bold;";
      }

      const row = `
        <tr style="background-color:${neutralBg}">
          <td style="text-align:center; background-color:${neutralBg}">Day ${item.day}</td>
          <td style="text-align:center; background-color:${neutralBg}">${item.date}</td>
          ${!hideCols ? `<td>-</td>` : ""}
          ${!hideCols ? `<td style="text-align:center;">Nil</td>` : ""}
          <td style="background-color:${noWarnBg}; ${noWarnStyle}">No Warning</td>
          <td style="background-color:${noWarnBg}; ${noWarnStyle}">राज्य में कोई चेतावनी नहीं।</td>
          ${!hideWarningCol ? `<td style="background-color:#28a745; color:white; font-weight:bold; text-align:center;">Green (No Warning)</td>` : ""}
        </tr>`;
      tbody.innerHTML += row;
    } else {
      const group = item.group;
      const areaText = item.cachedAreaText || getAreaText(group.districts);
      const phenomCount = group.phenomena.length;

      group.phenomena.forEach((pId, index) => {
        const pDef = phenDefs.find((pd) => pd.id === pId);
        let name = pDef ? `${pDef.english}<br>(${pDef.hindi})` : pId;
        const idx = group.intensities[pId] || 0;
        const eText = intensityLinesEn[pId][idx];
        const hText = intensityLines[pId][idx];

        const speedMatch = eText.match(/(\d+-\d+\s*kmph)/i);
        if (speedMatch) {
          name += `<br><small>(${speedMatch[0]})</small>`;
        }

        // Rule 2: Warning Description Formatting
        const phenomNameEn = eText.replace(/likely\.?$/i, "").trim(); // Extract phenomenon from intensity text
        // For Hindi, we use the Phenomenon Name from phenDefs as per Rule 2 structure
        const phenomNameHi = pDef
          ? pDef.hindi
          : hText.replace(/होने की संभावना है।?$/i, "").trim();

        const distEn = getDistributionText(group.distribution, "en");
        const distHi = getDistributionText(group.distribution, "hi");

        let descEn, descHi;
        if (areaText.isAll) {
          descEn = `${phenomNameEn} likely to occur ${distEn} in most parts of the state.`;
          descHi = `राज्य के अधिकांश भागों में ${distHi} ${phenomNameHi} होने की संभावना है।`;
        } else {
          descEn = `${phenomNameEn} likely to occur ${distEn} in the ${areaText.english}.`;
          // Strip "राज्य के " from areaText.hindi for the description sentence to avoid duplication if present
          const areaHiClean = areaText.hindi.replace(/^राज्य के /, "");
          descHi = `राज्य के ${areaHiClean} में ${distHi} ${phenomNameHi} होने की संभावना है।`;
        }

        let row = `<tr style="background-color:${neutralBg}">`;

        if (index === 0) {
          row += `<td rowspan="${phenomCount}" style="text-align:center; vertical-align:middle; background-color:${neutralBg}">Day ${item.day}</td>`;
          row += `<td rowspan="${phenomCount}" style="text-align:center; vertical-align:middle; background-color:${neutralBg}">${item.date}</td>`;
          if (!hideCols) {
            row += `<td rowspan="${phenomCount}" style="vertical-align:middle; background-color:${textColBg}">
                               <strong>${areaText.english}</strong><br>
                               <span style="color:#555;">(${areaText.hindi})</span>
                            </td>`;
          }
        }

        if (!hideCols)
          row += `<td style="text-align:center; vertical-align:middle; background-color:${textColBg}">${name}</td>`;
        row += `<td style="background-color:${textColBg}">${descEn}</td>`;
        row += `<td style="background-color:${textColBg}">${descHi}</td>`;

        if (index === 0 && !hideWarningCol) {
          row += `<td rowspan="${phenomCount}" style="background-color:${warningColBg}; font-weight:bold; text-align:center; vertical-align:middle;">${item.colorText}</td>`;
        }

        row += `</tr>`;
        tbody.innerHTML += row;
      });
    }
  });

  // Save Table HTML for Bulletin (with Header)
  const tableEl = document.getElementById("imdTable");
  if (tableEl) {
    const tableClone = tableEl.cloneNode(true);
    // Add the export header to the clone
    if (typeof addExportHeader === "function") {
      addExportHeader(tableClone);
    }
    // Only save if we are rendering Warning Data
    if (weeklyData === weeklyWarningData) {
      localStorage.setItem("bihar_warning_table_html", tableClone.outerHTML);
    }
  }
}

async function download7DaysPDF() {
  // Deprecated in favor of downloadSmartPDF
  downloadSmartPDF();
}

async function downloadSmartPDF() {
  const chkForecast = document.getElementById("chkDlForecast").checked;
  const chkWarning = document.getElementById("chkDlWarning").checked;

  if (!chkForecast && !chkWarning) {
    alert("Please select at least one type (Forecast or Warning) to download.");
    return;
  }

  const { jsPDF } = window.jspdf;
  let doc = null;
  const originalDay = currentDay;
  const originalReviewMode = currentReviewMode;
  const originalWeeklyData = weeklyData;

  const overlay = document.getElementById("loadingOverlay");
  if (overlay) {
    overlay.style.display = "flex";
    overlay.querySelector("p").innerText = "Generating Smart PDF...";
  }

  try {
    const processType = async (type, dataArray) => {
      // Set context for rendering
      currentReviewMode = type;
      weeklyData = dataArray;

      const groups = getDayGroups(dataArray);

      for (const group of groups) {
        // Set day to start of group (header logic will handle the range text)
        currentDay = group.start;
        districtPhenomenaMap = weeklyData[currentDay - 1];

        // Update Map UI
        updateMapDateHeader();
        updateMapHeaderText();
        updateMapStyle();
        updateLegend();

        // Wait for render
        await new Promise((r) => setTimeout(r, 800));

        const node = document.getElementById("map");
        node.classList.add("static-icons"); // Freeze animations

        const width = node.offsetWidth;
        const height = node.offsetHeight;

        const dataUrl = await domtoimage.toPng(node, {
          width: node.offsetWidth,
          height: node.offsetHeight,
          bgcolor: "#ffffff",
        });

        if (!doc) {
          // Initialize PDF with the dimensions of the first image (in pixels)
          doc = new jsPDF({
            orientation: width > height ? "l" : "p",
            unit: "px",
            format: [width, height],
          });
        } else {
          // Add new page with dimensions of the current image
          doc.addPage([width, height], width > height ? "l" : "p");
        }

        doc.addImage(dataUrl, "PNG", 0, 0, width, height);
        node.classList.remove("static-icons"); // Unfreeze
      }
    };

    if (chkForecast) {
      await processType("forecast", weeklyForecastData);
    }
    if (chkWarning) {
      await processType("warning", weeklyWarningData);
    }

    if (doc) {
      doc.save(
        `Bihar_Weather_Smart_Report_${
          new Date().toISOString().split("T")[0]
        }.pdf`,
      );
    }
  } catch (e) {
    console.error("PDF Generation Error:", e);
    alert("PDF generate karne me truti hui.");
  } finally {
    // Restore state
    currentDay = originalDay;
    currentReviewMode = originalReviewMode;
    weeklyData = originalWeeklyData;
    districtPhenomenaMap = weeklyData[currentDay - 1];

    // Refresh UI
    updateMapDateHeader();
    updateMapHeaderText();
    updateMapStyle();
    updateLegend();

    if (overlay) {
      overlay.style.display = "none";
      overlay.querySelector("p").innerText =
        "पूर्वानुमान तैयार किया जा रहा है... / Generating Forecast...";
    }
  }
}

async function downloadSmartImages() {
  const chkForecast = document.getElementById("chkDlForecast").checked;
  const chkWarning = document.getElementById("chkDlWarning").checked;

  if (!chkForecast && !chkWarning) {
    alert("Please select at least one type (Forecast or Warning) to download.");
    return;
  }

  const originalDay = currentDay;
  const originalReviewMode = currentReviewMode;
  const originalWeeklyData = weeklyData;

  const today = new Date().toISOString().split("T")[0];
  const overlay = document.getElementById("loadingOverlay");

  if (overlay) {
    overlay.style.display = "flex";
    overlay.querySelector("p").innerText = "Downloading Smart Images...";
  }

  try {
    const processType = async (type, dataArray) => {
      currentReviewMode = type;
      weeklyData = dataArray;
      const groups = getDayGroups(dataArray);

      for (const group of groups) {
        currentDay = group.start;
        districtPhenomenaMap = weeklyData[currentDay - 1];

        updateMapDateHeader();
        updateMapHeaderText();
        updateMapStyle();
        updateLegend();

        await new Promise((r) => setTimeout(r, 800));

        const node = document.getElementById("map");
        node.classList.add("static-icons"); // Freeze animations
        const dataUrl = await domtoimage.toPng(node, {
          width: node.offsetWidth,
          height: node.offsetHeight,
        });
        node.classList.remove("static-icons"); // Unfreeze

        const link = document.createElement("a");
        const rangeStr =
          group.start === group.end
            ? `Day-${group.start}`
            : `Day-${group.start}-to-${group.end}`;
        link.download = `${today}-${type}-${rangeStr}.png`;
        link.href = dataUrl;
        link.click();
      }
    };

    if (chkForecast) await processType("forecast", weeklyForecastData);
    if (chkWarning) await processType("warning", weeklyWarningData);
  } catch (e) {
    console.error("Image Download Error:", e);
  } finally {
    // Restore state
    currentDay = originalDay;
    currentReviewMode = originalReviewMode;
    weeklyData = originalWeeklyData;
    districtPhenomenaMap = weeklyData[currentDay - 1];

    updateMapDateHeader();
    updateMapHeaderText();
    updateMapStyle();
    updateLegend();

    if (overlay) {
      overlay.style.display = "none";
      overlay.querySelector("p").innerText =
        "पूर्वानुमान तैयार किया जा रहा है... / Generating Forecast...";
    }
  }
}

function getDayGroups(dataArray) {
  const groups = [];
  let i = 0;
  while (i < 7) {
    let start = i + 1;
    let end = i + 1;
    while (end < 7 && areDaysEqual(dataArray[end - 1], dataArray[end])) {
      end++;
    }
    groups.push({ start, end });
    i = end;
  }
  return groups;
}

function downloadAllMaps() {
  // Deprecated in favor of downloadSmartImages
  downloadSmartImages();
}

function copyToClipboard() {
  const txt = document.getElementById("forecastContent").innerText;
  if (!txt || txt.includes("कोई जिला चुने")) {
    alert("पहले पूर्वानुमान तैयार करें।");
    return;
  }
  navigator.clipboard
    .writeText(txt)
    .then(() => {
      alert("पूर्वानुमान क्लिपबोर्ड पर कॉपी किया गया!");
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
      alert("कॉपी करने में विफल।");
    });
}
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDark);
  const btn = document.getElementById("darkModeToggle");
  btn.innerHTML = isDark
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';
  btn.title = isDark ? "Light Mode" : "Dark Mode";
}

function toggleLanguage() {
  currentLang = currentLang === "hi" ? "en" : "hi";
  localStorage.setItem("lang", currentLang);
  updateLanguageUI();
}

function updateLanguageUI() {
  const t = uiTranslations[currentLang];
  const btn = document.getElementById("langToggle");
  btn.innerText = currentLang.toUpperCase();

  // Header
  document.querySelector("header h1").innerText = t.title;
  const h2 = document.querySelector("header h2");
  if (h2) h2.style.display = "none";

  // Labels
  document.querySelector("#regionalGroups label").innerText = t.regional;
  document.querySelector("#multipleDistricts label").innerText = t.multiple;
  document.querySelector(".place-count-panel label").innerText = t.placeCount;
  const warningLabel = document.querySelector(".warning-panel label");
  if (warningLabel) warningLabel.innerText = t.warning;
  const colorLabel = document.querySelector(".color-selection-panel label");
  if (colorLabel) colorLabel.innerText = t.colorSelect;
  document.querySelector(".weather-phenomena h3").innerText = t.phenomena;
  document.querySelector(".forecast-output h3").innerText = t.forecastRes;

  // Search Placeholder
  document.getElementById("districtSearch").placeholder = t.searchPlaceholder;

  // Buttons
  document.getElementById("generateForecast").innerText = t.btnGenerate;
  document.getElementById("updateForecastMap").innerText = t.btnUpdateForecast;
  document.getElementById("updateWarningMap").innerText = t.btnUpdateWarning;
  document.getElementById("clearSelection").innerText = t.btnClear;
  document.getElementById("exportText").innerText = t.btnExportTxt;
  document.getElementById("exportPDF").innerText = t.btnExportPdf;
  document.getElementById("copyClipboard").innerText = t.btnCopy;

  // Select All / Clear All buttons
  const regBtns = document.querySelectorAll("#regionalGroups button");
  if (regBtns.length >= 2) {
    regBtns[0].innerText = t.btnSelectAll;
    regBtns[1].innerText = t.btnClearAll;
  }
  const distBtns = document.querySelectorAll("#multipleDistricts button");
  if (distBtns.length >= 2) {
    distBtns[0].innerText = t.btnSelectAll;
    distBtns[1].innerText = t.btnClearAll;
  }

  // Update Regional Grid Text
  document
    .querySelectorAll("#regionalGrid .regional-checkbox")
    .forEach((lbl) => {
      const input = lbl.querySelector("input");
      const key = input.value;
      const group = regionalGroups[key];
      const span = lbl.querySelector("span");
      if (group && span) {
        span.innerText = currentLang === "hi" ? group.name : group.english;
      }
    });

  // Update District Grid Text
  document
    .querySelectorAll("#districtGrid .district-checkbox")
    .forEach((lbl) => {
      const input = lbl.querySelector("input");
      const id = parseInt(input.value);
      const dist = districtsData.find((d) => d.id === id);
      const span = lbl.querySelector("span");
      if (dist && span) {
        span.innerText = currentLang === "hi" ? dist.hindi : dist.name;
      }
    });

  // Update Phenomena Panel
  document
    .querySelectorAll("#phenomenaContainer .phenomenon-row")
    .forEach((row) => {
      const input = row.querySelector("input");
      const id = input.value;
      const pDef = phenDefs.find((p) => p.id === id);
      const label = row.querySelector("label");
      if (pDef && label) {
        const text = currentLang === "hi" ? pDef.hindi : pDef.english;
        label.innerHTML = `<strong>${text}</strong>`;
      }
      const select = row.querySelector("select");
      if (select && pDef) {
        const lines =
          currentLang === "hi" ? intensityLines[id] : intensityLinesEn[id];
        const selectedIdx = select.selectedIndex;
        select.innerHTML = lines
          .map((s, i) => `<option value="${i}">${s}</option>`)
          .join("");
        if (selectedIdx < lines.length) select.selectedIndex = selectedIdx;
      }
    });

  // Update Place Count Dropdown
  const placeSelect = document.getElementById("globalPlaceCount");
  if (placeSelect) {
    const selectedVal = placeSelect.value;
    placeSelect.innerHTML = "";
    forecastDropdownOptions.forEach((optData) => {
      const opt = document.createElement("option");
      opt.value = optData.value;
      opt.innerText = optData.text;
      if (optData.color) opt.style.backgroundColor = optData.color;
      placeSelect.appendChild(opt);
    });
    placeSelect.value = selectedVal;
  }

  // Update Warning Dropdown
  const warningSelect = document.getElementById("globalWarning");
  if (warningSelect) {
    const selectedVal = warningSelect.value;
    warningSelect.innerHTML = "";
    warningDropdownOptions.forEach((optData) => {
      const opt = document.createElement("option");
      opt.value = optData.value;
      opt.innerText = optData.text;
      if (optData.color) opt.style.backgroundColor = optData.color;
      warningSelect.appendChild(opt);
    });
    warningSelect.value = selectedVal;
  }
  updateDropdownBackgrounds();
}

function updateDropdownBackgrounds() {
  const pSelect = document.getElementById("globalPlaceCount");
  if (pSelect) {
    const val = parseInt(pSelect.value);
    const opt = forecastDropdownOptions.find((o) => o.value === val);
    if (opt && opt.color) {
      pSelect.style.backgroundColor = opt.color;
    } else {
      pSelect.style.backgroundColor = "";
    }
  }
  const wSelect = document.getElementById("globalWarning");
  if (wSelect) {
    const val = parseInt(wSelect.value);
    const opt = warningDropdownOptions.find((o) => o.value === val);
    if (opt && opt.color) {
      wSelect.style.backgroundColor = opt.color;
    } else {
      wSelect.style.backgroundColor = "";
    }
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ---------- Clear ----------
function clearSelection() {
  if (
    !confirm(
      "Are you sure you want to clear ALL Forecast and Warning data for ALL days?",
    )
  )
    return;

  selectedDistricts = [];
  selectedPhenomena = [];

  // Clear ALL data (Forecast & Warning for all 7 days)
  weeklyForecastData = Array(7)
    .fill(null)
    .map(() => ({}));
  weeklyWarningData = Array(7)
    .fill(null)
    .map(() => ({}));

  // Default to Forecast data for clearing if no mode is active, or clear both?
  // For safety, we just reset the current view's data pointer
  districtPhenomenaMap = weeklyData[currentDay - 1];

  document.querySelectorAll("#districtGrid input").forEach((cb) => {
    cb.checked = false;
    cb.closest(".district-checkbox").classList.remove("highlighted");
  });
  document
    .querySelectorAll("#regionalGrid input")
    .forEach((cb) => (cb.checked = false));
  document
    .querySelectorAll("#phenomenaContainer input")
    .forEach((cb) => (cb.checked = false));
  document
    .querySelectorAll(".intensity-select")
    .forEach((s) => (s.selectedIndex = 0));
  document.getElementById("forecastContent").innerHTML =
    '<p class="placeholder-text">कोई जिला चुने और मौसम घटनाएँ चुनें...</p>';
  updateMapStyle();
  resetTableView();
  saveData();
  updateLegend();
}

function clearForecastWarningData() {
  if (!confirm("Are you sure you want to clear all Forecast and Warning data?"))
    return;

  weeklyForecastData = Array(7)
    .fill(null)
    .map(() => ({}));
  weeklyWarningData = Array(7)
    .fill(null)
    .map(() => ({}));

  districtPhenomenaMap = weeklyData[currentDay - 1];

  saveData();
  resetTableView();
  updateMapStyle();
  alert("Forecast and Warning data cleared.");
}

function generateDemoData() {
  if (
    !confirm(
      "Start DEMO MODE? This will generate a 7-day forecast scenario covering All Bihar, Continuous Days, and Multi-Region logic.",
    )
  )
    return;

  // Clear existing
  weeklyForecastData = Array(7)
    .fill(null)
    .map(() => ({}));
  weeklyWarningData = Array(7)
    .fill(null)
    .map(() => ({}));

  // Helper to set data for a day
  const setDayData = (
    dataArray,
    dayIndex,
    districtIds,
    phenomId,
    intensity,
    color,
    distribution = 1,
    warningLevel = 0,
  ) => {
    const dayData = dataArray[dayIndex];
    districtIds.forEach((id) => {
      const strId = String(id);
      if (!dayData[strId])
        dayData[strId] = {
          phenomena: new Set(),
          intensities: {},
          color: color,
          distribution: distribution,
          warningLevel: warningLevel,
        };
      dayData[strId].phenomena.add(phenomId);
      dayData[strId].intensities[phenomId] = intensity;
      dayData[strId].color = color;
      dayData[strId].distribution = distribution;
      dayData[strId].warningLevel = warningLevel;
    });
  };

  // --- Day 1: Multi-Region (NW + NE), Yellow Warning, Scattered ---
  const day1Districts = [
    ...regionalGroups["north-west"].districts,
    ...regionalGroups["north-east"].districts,
  ];
  setDayData(
    weeklyForecastData,
    0,
    day1Districts,
    "thunderstorm",
    2,
    "#ffc107", // Yellow Color
    2, // Scattered (Few Places)
    1, // Yellow Warning
  );
  setDayData(
    weeklyWarningData,
    0,
    day1Districts,
    "thunderstorm",
    2,
    "rgb(255, 255, 0)",
    2,
    1,
  );

  // --- Day 2: ALL BIHAR, Orange Warning, Widespread ---
  const allDistricts = districtsData.map((d) => d.id);
  setDayData(
    weeklyForecastData,
    1,
    allDistricts,
    "heavyrain",
    1,
    "#fd7e14", // Orange Color
    4, // Widespread (Most Places)
    2, // Orange Warning
  );

  setDayData(
    weeklyWarningData,
    1,
    allDistricts,
    "heavyrain",
    1,
    "rgb(255, 192, 0)",
    4,
    2,
  );

  // --- Day 3: Northern Region, Red Warning, Fairly Widespread (Continuous Start) ---
  const northDistricts = regionalGroups["northern"].districts;
  setDayData(
    weeklyForecastData,
    2,
    northDistricts,
    "heatwave",
    1,
    "#dc3545", // Red Color
    3, // Fairly Widespread (Many Places)
    3, // Red Warning
  );
  setDayData(
    weeklyWarningData,
    2,
    northDistricts,
    "heatwave",
    1,
    "rgb(255, 0, 0)",
    3,
    3,
  );

  // --- Day 4: SAME AS DAY 3 (Continuous Scenario) ---
  setDayData(
    weeklyForecastData,
    3,
    northDistricts,
    "heatwave",
    1,
    "#dc3545",
    3,
    3,
  );
  setDayData(
    weeklyWarningData,
    3,
    northDistricts,
    "heatwave",
    1,
    "rgb(255, 0, 0)",
    3,
    3,
  );

  // --- Day 5: Specific Districts (Patna, Gaya), Yellow, Isolated ---
  const specificDistricts = [26, 12, 24]; // Patna, Gaya, Nalanda
  setDayData(
    weeklyForecastData,
    4,
    specificDistricts,
    "gustywind",
    0,
    "#ffc107", // Yellow
    1, // Isolated (One or Two Places)
    1, // Yellow Warning
  );
  setDayData(
    weeklyWarningData,
    4,
    specificDistricts,
    "gustywind",
    0,
    "rgb(255, 255, 0)",
    1,
    1,
  );

  // --- Day 6: Southern Region, Orange, Many Places, Multi-Phenom ---
  const southDistricts = regionalGroups["southern"].districts;
  setDayData(
    weeklyForecastData,
    5,
    southDistricts,
    "thunderstorm",
    0,
    "#fd7e14",
    3,
    2,
  );
  setDayData(
    weeklyWarningData,
    5,
    southDistricts,
    "thunderstorm",
    0,
    "rgb(255, 192, 0)",
    3,
    2,
  );

  setDayData(
    weeklyForecastData,
    5,
    southDistricts,
    "hailstorm",
    0,
    "#fd7e14",
    3,
    2,
  );
  setDayData(
    weeklyWarningData,
    5,
    southDistricts,
    "hailstorm",
    0,
    "rgb(255, 192, 0)",
    3,
    2,
  );

  // --- Day 7: Foothills, Green (No Warning), Dry ---
  const foothillDistricts = regionalGroups["foothill"].districts;
  setDayData(
    weeklyForecastData,
    6,
    foothillDistricts,
    "dry",
    0,
    "#28a745",
    0,
    0,
  );
  setDayData(
    weeklyWarningData,
    6,
    foothillDistricts,
    "dry",
    0,
    "rgb(0, 153, 0)",
    0,
    0,
  );

  saveData();
  // Refresh current view
  switchDay(currentDay);
  resetTableView();
  alert(
    "Demo Mode Active! Check the Table View to see the 7-day forecast scenarios.",
  );
}

function resetUI() {
  selectedDistricts = [];
  selectedPhenomena = [];

  document.querySelectorAll("#districtGrid input").forEach((cb) => {
    cb.checked = false;
    cb.closest(".district-checkbox").classList.remove("highlighted");
  });
  document
    .querySelectorAll("#regionalGrid input")
    .forEach((cb) => (cb.checked = false));
  document
    .querySelectorAll(".map-region-check")
    .forEach((cb) => (cb.checked = false));
  document
    .querySelectorAll("#phenomenaContainer input")
    .forEach((cb) => (cb.checked = false));
  document
    .querySelectorAll(".intensity-select")
    .forEach((s) => (s.selectedIndex = 0));

  const pSelect = document.getElementById("globalPlaceCount");
  if (pSelect) {
    pSelect.value = 0;
    updateDropdownBackgrounds();
  }
  const wSelect = document.getElementById("globalWarning");
  if (wSelect) {
    wSelect.value = 0;
    updateDropdownBackgrounds();
  }
  const cSelect = document.getElementById("globalColorSelect");
  if (cSelect) {
    cSelect.value = "";
    cSelect.style.backgroundColor = "";
  }

  document.getElementById("forecastContent").innerHTML =
    '<p class="placeholder-text">कोई जिला चुने और मौसम घटनाएँ चुनें...</p>';
}

function handleMapUpdate(mode) {
  if (mode === "forecast") {
    weeklyData = weeklyForecastData; // Ensure we are updating the right data
  } else {
    weeklyData = weeklyWarningData; // Ensure we are updating the right data
  }

  // Update the current view reference so map shows the correct data
  districtPhenomenaMap = weeklyData[currentDay - 1];

  updateMapWithPhenomena();

  // Force table update if warning mode, to ensure bulletin gets latest data
  if (mode === "warning") {
    // Ensure table exists for rendering
    if (!document.getElementById("imdTable")) {
      const container = document.getElementById("tableViewContainer");
      if (container) {
        const tbl = document.createElement("table");
        tbl.id = "imdTable";
        container.appendChild(tbl);
      }
    }
    renderTable(weeklyWarningData);
  }
}

function loadSavedData() {
  const raw = localStorage.getItem("bihar_weather_data");
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      // Check if it's the new format with forecast/warning keys
      if (parsed.forecast && parsed.warning) {
        // Deserialize Forecast
        weeklyForecastData = parsed.forecast.map((day) => {
          const newDay = {};
          for (const [id, data] of Object.entries(day)) {
            newDay[id] = {
              phenomena: new Set(data.phenomena),
              intensities: data.intensities || {},
              color: data.color,
              distribution: data.distribution || 0,
            };
          }
          return newDay;
        });
        // Deserialize Warning
        weeklyWarningData = parsed.warning.map((day) => {
          const newDay = {};
          for (const [id, data] of Object.entries(day)) {
            newDay[id] = {
              phenomena: new Set(data.phenomena),
              intensities: data.intensities || {},
              color: data.color,
              distribution: data.distribution || 0,
              warningLevel: data.warningLevel || 0,
            };
          }
          return newDay;
        });

        // Set initial active data
        const modeForecast = document.getElementById("modeForecast");
        if (modeForecast && modeForecast.checked) {
          weeklyData = weeklyForecastData;
        } else if (modeForecast && !modeForecast.checked) {
          weeklyData = weeklyWarningData;
        } else {
          // Default to Forecast if toggle is missing/undefined
          weeklyData = weeklyForecastData;
        }
        districtPhenomenaMap = weeklyData[currentDay - 1];
        updateMapStyle();
        updateLegend();
      }
    } catch (e) {
      console.error("Failed to load saved data", e);
    }
  }
}

function updateMapWithPhenomena() {
  if (!selectedDistricts.length) {
    alert("कृपया कम से कम एक जिला चुनें।");
    return;
  }
  const activePhenomenaList = Array.from(
    document.querySelectorAll("#phenomenaContainer input:checked"),
  ).map((cb) => cb.value);

  if (!activePhenomenaList.length) {
    alert("कृपया कम से कम एक मौसम घटना चुनें।");
    return;
  }

  const activePhenomenaMap = {};
  document
    .querySelectorAll("#phenomenaContainer input:checked")
    .forEach((cb) => {
      const id = cb.value;
      const intensitySelect = document.getElementById(`intensity-${id}`);
      activePhenomenaMap[id] = intensitySelect
        ? intensitySelect.selectedIndex
        : 0;
    });

  if (activeDays.size === 0) {
    activeDays.add(currentDay);
  }

  activeDays.forEach((dayNum) => {
    const dayData = weeklyData[dayNum - 1];
    selectedDistricts.forEach((id) => {
      if (!dayData[id]) {
        dayData[id] = {
          phenomena: new Set(),
          intensities: {},
          color: currentColor, // Strictly use currentColor
          distribution: currentDistribution,
          warningLevel: currentWarning,
        };
      } else {
        dayData[id].color = currentColor; // Strictly update color (clears if null)
        dayData[id].distribution = currentDistribution;
        dayData[id].warningLevel = currentWarning;
      }

      Object.keys(activePhenomenaMap).forEach((pId) => {
        dayData[id].phenomena.add(pId);
        dayData[id].intensities[pId] = activePhenomenaMap[pId];
      });
    });
  });

  updateMapStyle();
  saveData();
  updateLegend();
}

function copyCurrentDayToAll() {
  if (
    !confirm(
      `Are you sure you want to copy Day ${currentDay} data to all other days? This will overwrite existing data.`,
    )
  )
    return;

  const sourceData = weeklyData[currentDay - 1];

  for (let i = 0; i < 7; i++) {
    if (i === currentDay - 1) continue;
    const newDayData = {};
    // Deep copy the district map (Sets need to be cloned)
    for (const [distId, phenSet] of Object.entries(sourceData)) {
      newDayData[distId] = {
        phenomena: new Set(phenSet.phenomena),
        intensities: { ...phenSet.intensities },
        color: phenSet.color,
        distribution: phenSet.distribution,
        warningLevel: phenSet.warningLevel,
      };
    }
    weeklyData[i] = newDayData;
  }

  // Update map style to reflect changes immediately
  updateMapStyle();

  alert(`Day ${currentDay} data copied to all other days.`);
  saveData();

  // Update table if we just copied warning data (Copy to All) or if table is visible
  if (
    weeklyData === weeklyWarningData ||
    document.getElementById("tableViewContainer").style.display === "block"
  ) {
    renderTable(weeklyWarningData);
  }
}

function openCopyModal() {
  const container = document.getElementById("copyDaysContainer");
  container.innerHTML = "";
  for (let i = 1; i <= 7; i++) {
    if (i === currentDay) continue; // Skip current day
    const div = document.createElement("label");
    div.className = "checkbox-container";
    div.innerHTML = `
        Day ${i}
        <input type="checkbox" value="${i}" class="copy-target-day">
        <span class="checkmark"></span>
    `;
    container.appendChild(div);
  }
  document.getElementById("copyModal").style.display = "flex";
}

function submitCopyDays() {
  const checkboxes = document.querySelectorAll(".copy-target-day:checked");
  if (checkboxes.length === 0) {
    alert("Please select at least one day.");
    return;
  }

  const sourceData = weeklyData[currentDay - 1];
  checkboxes.forEach((cb) => {
    const targetIndex = parseInt(cb.value) - 1;
    const newDayData = {};
    for (const [distId, phenSet] of Object.entries(sourceData)) {
      newDayData[distId] = {
        phenomena: new Set(phenSet.phenomena),
        intensities: { ...phenSet.intensities },
        color: phenSet.color,
        distribution: phenSet.distribution,
        warningLevel: phenSet.warningLevel,
      };
    }
    weeklyData[targetIndex] = newDayData;
  });

  alert(`Forecast copied to ${checkboxes.length} selected days.`);
  document.getElementById("copyModal").style.display = "none";
  saveData();

  // FIX: Update table if we just copied warning data (Copy to Select) or if table is visible
  if (
    weeklyData === weeklyWarningData ||
    document.getElementById("tableViewContainer").style.display === "block"
  ) {
    renderTable(weeklyWarningData);
  }
}

function saveData() {
  const serialize = (dataArr) =>
    dataArr.map((dayData) => {
      const newDay = {};
      for (const [id, set] of Object.entries(dayData)) {
        newDay[id] = {
          phenomena: Array.from(set.phenomena),
          intensities: set.intensities,
          color: set.color,
          distribution: set.distribution || 0,
          warningLevel: set.warningLevel || 0,
        };
      }
      return newDay;
    });

  const payload = {
    forecast: serialize(weeklyForecastData),
    warning: serialize(weeklyWarningData),
  };

  localStorage.setItem("bihar_weather_data", JSON.stringify(payload));
}

function handleUserLogoClick() {
  const isLoggedIn = document.body.classList.contains("logged-in");
  // Always toggle Dropdown
  const dropdown = document.getElementById("userDropdown");
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
  renderUserMenu(isLoggedIn);
}

function closeLoginModal() {
  document.getElementById("loginModal").style.display = "none";
}

function submitLogin() {
  const id = document.getElementById("loginId").value;
  const pass = document.getElementById("loginPass").value;

  if (id === "admin" && pass === "Kamal@007") {
    // Success
    document.body.classList.add("logged-in");
    localStorage.setItem("admin_logged_in", "true");
    document.getElementById("userLogoBtn").classList.add("active-session");
    closeLoginModal();
    const lbl = document.getElementById("lblLayoutEdit");
    if (lbl) lbl.style.display = "inline-flex";
    alert("Login Successful! Welcome Admin.");
  } else {
    // Fail
    document.getElementById("loginError").style.display = "block";
  }
}

function performLogout() {
  document.body.classList.remove("logged-in");
  localStorage.removeItem("admin_logged_in");
  document.getElementById("userLogoBtn").classList.remove("active-session");
  document.getElementById("userDropdown").style.display = "none";
  const lbl = document.getElementById("lblLayoutEdit");
  if (lbl) {
    lbl.style.display = "none";
    if (isLayoutEditMode) toggleLayoutEditMode(false);
  }
  alert("Logged Out Successfully.");
}

function renderUserMenu(isLoggedIn) {
  const dropdown = document.getElementById("userDropdown");
  let html = "";
  if (isLoggedIn) {
    html += `<a href="#" onclick="performLogout()" style="color: red;">Sign Out</a>`;
  } else {
    html += `<a href="#" onclick="openLoginModal()">Sign In</a>`;
  }
  dropdown.innerHTML =
    html +
    `
    <a href="#" onclick="showAbout()">About Bihar Weather Forecast System</a>
    <a href="#" onclick="showContact()">Contact Us</a>
  `;
}

function showAbout() {
  document.getElementById("userDropdown").style.display = "none";
  document.getElementById("aboutModal").style.display = "flex";
}

function showContact() {
  document.getElementById("userDropdown").style.display = "none";
  document.getElementById("contactModal").style.display = "flex";
}

function openLoginModal() {
  document.getElementById("userDropdown").style.display = "none";
  document.getElementById("loginModal").style.display = "flex";
  document.getElementById("loginError").style.display = "none";
  document.getElementById("loginId").value = "";
  document.getElementById("loginPass").value = "";
  // Reset password visibility
  const passInput = document.getElementById("loginPass");
  passInput.type = "password";
  const icon = document.getElementById("togglePassword");
  if (icon) {
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}

function togglePasswordVisibility() {
  const passInput = document.getElementById("loginPass");
  const icon = document.getElementById("togglePassword");
  if (passInput.type === "password") {
    passInput.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    passInput.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}

function shareApp() {
  if (navigator.share) {
    navigator
      .share({
        title: "Bihar Weather Forecast",
        text: "Check out the Bihar Weather Forecast System developed by Lal Kamal.",
        url: window.location.href,
      })
      .catch(console.error);
  } else {
    alert("Link copied to clipboard!");
    navigator.clipboard.writeText(window.location.href);
  }
}

// Close dropdown if clicked outside
window.onclick = function (event) {
  if (!event.target.matches(".user-logo")) {
    const dropdown = document.getElementById("userDropdown");
    if (dropdown && dropdown.style.display === "block") {
      dropdown.style.display = "none";
    }
  }
};

// ---------- Map & Shapefile ----------
let map, geojsonLayer, tileLayer, satelliteLayer, hybridLayer, mapDateControl;
let zoomControl = null;

function initMap() {
  // Initialize Leaflet Map
  // Default zoom disabled as requested
  map = L.map("map", {
    center: [25.6, 85.6],
    zoom: 8,
    zoomSnap: 0.25,
    zoomControl: false, // We will add it if enabled, or use custom
    scrollWheelZoom: false,
    doubleClickZoom: false,
    dragging: false,
    boxZoom: false,
  });

  // Handle Responsive Resize
  window.addEventListener("resize", () => {
    if (map) map.invalidateSize();
    updateMapElementScale();
  });

  // Sync Map View with Live Preview
  map.on("moveend", () => {
    localStorage.setItem(
      "bihar_map_view",
      JSON.stringify({
        center: map.getCenter(),
        zoom: map.getZoom(),
      }),
    );
  });

  // Base Layers
  tileLayer = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 18,
      attribution: "© OpenStreetMap",
    },
  );

  satelliteLayer = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      maxZoom: 18,
      attribution: "Tiles &copy; Esri",
    },
  );

  hybridLayer = L.tileLayer(
    "http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}",
    { attribution: "Google", maxZoom: 20 },
  );

  // Add default layer
  tileLayer.addTo(map);

  phenomenaMarkersLayer = L.layerGroup().addTo(map);

  // Add Static Overlays (Logos & Arrow)
  const mapContainer = map.getContainer();
  const overlaysContainer = L.DomUtil.create(
    "div",
    "map-overlays-container",
    mapContainer,
  );
  overlaysContainer.style.position = "absolute";
  overlaysContainer.style.top = "0";
  overlaysContainer.style.left = "0";
  overlaysContainer.style.width = "100%";
  overlaysContainer.style.height = "100%";
  overlaysContainer.style.pointerEvents = "none";
  overlaysContainer.style.zIndex = "1000";

  overlaysContainer.innerHTML = `
      <div id="overlayLeft" style="position:absolute; top:10px; left:10px; z-index:1001; display:flex; flex-direction:column; align-items:center; pointer-events:auto;">
          <img src="assets/logo.png" class="map-logo-left" style="height:90px; margin-left: 10px;">
          <div style="text-align:center; margin-top:5px; display:flex; flex-direction:column; align-items:center;">
              <div class="map-logo-text" style="margin-top:0; font-size:16px; background:rgba(255,255,255,0.8); padding:2px 5px; border-radius:4px; white-space:nowrap;">मौसम विज्ञान केंद्र, पटना</div>
              <div id="mapDateOverlay" class="map-date-text" style="margin-top:2px; font-weight:bold; color:#000; background:rgba(255,255,255,0.8); padding:2px 5px; border-radius:4px; font-size:14px; box-shadow: 0 1px 3px rgba(0,0,0,0.2); white-space:nowrap;">Loading...</div>
          </div>
      </div>
      <div id="overlayRight" style="position:absolute; top:10px; right:10px; z-index:1001; display:flex; gap:10px; align-items:center; pointer-events:auto;">
          <img src="assets/IMD_150_Year_Logo.png" style="height:90px;">
          <img src="assets/North_Arrow.png" style="height:80px;">
      </div>
      <div id="mapLegend" class="info legend" style="position:absolute; bottom:30px; right:10px; z-index:1001; pointer-events:auto; display:none;"></div>
  `;

  updateMapDateHeader(); // Set initial date in new overlay
  updateLegend();
  loadLayoutPositions();
  updateMapElementScale(); // Initial scale calculation

  // Layer Control (Hidden by default, toggled via UI buttons if needed, or we can add standard control)
  // We are using custom buttons for toggling, but let's add standard control for Satellite
  // L.control.layers({ "Street View": tileLayer, "Satellite View": satelliteLayer }).addTo(map);

  // Load Shapefile (Bihar.shp and Bihar.dbf)
  const basePath = "data/Bihar_Districts_Shapefile/Bihar";

  Promise.all([
    fetch(`${basePath}.shp`).then((r) => {
      if (!r.ok) throw new Error("SHP file not found");
      return r.arrayBuffer();
    }),
    fetch(`${basePath}.dbf`).then((r) => {
      if (!r.ok) throw new Error("DBF file not found");
      return r.arrayBuffer();
    }),
    fetch(`${basePath}.prj`).then((r) => {
      if (!r.ok) {
        console.warn("PRJ file not found. Map might not render correctly.");
        return null;
      }
      return r.text();
    }),
  ])
    .then(([shpBuffer, dbfBuffer, prjStr]) => {
      if (!prjStr) {
        alert(
          "Warning: Bihar.prj file missing. Map projection may be incorrect.",
        );
      }
      // Parse and combine SHP + DBF
      const geojson = shp.combine([
        shp.parseShp(shpBuffer, prjStr || undefined),
        shp.parseDbf(dbfBuffer),
      ]);

      // Add to Map
      geojsonLayer = L.geoJSON(geojson, {
        style: (feature) => {
          const oid = parseInt(feature.properties.OBJECTID);
          const isFoothill =
            showFoothill && subRegionDistricts.fh.includes(oid);
          return {
            fillColor: getDistrictRegionColor(oid),
            weight: 2,
            opacity: 1,
            color: "#333", // Dark border
            dashArray: isFoothill ? "5, 5" : "",
            fillOpacity: isFoothill ? 0.5 : 0.2,
          };
        },
        onEachFeature: (feature, layer) => {
          // Tooltip with District Name
          if (feature.properties && feature.properties.D_NAME) {
            layer.bindTooltip(feature.properties.D_NAME, {
              permanent: true,
              direction: "center",
              className: "map-label",
            });
          }

          layer.on({
            mouseover: (e) => {
              const layer = e.target;
              layer.setStyle({
                weight: 3,
                color: "#666",
                fillOpacity: 0.7,
              });
              layer.bringToFront();
            },
            mouseout: () => updateMapStyle(),
            click: () => {
              const oid = feature.properties.OBJECTID;
              toggleDistrictByMap(oid);
            },
          });
        },
      }).addTo(map);

      // Fit map to Bihar bounds
      map.fitBounds(geojsonLayer.getBounds(), { padding: [10, 10] });

      // Handle label visibility on zoom
      const toggleLabels = () => {
        const pane = document.querySelector(".leaflet-tooltip-pane");
        if (!pane) return;
        if (map.getZoom() < 6) pane.classList.add("labels-hidden");
        else pane.classList.remove("labels-hidden");
      };
      map.on("zoomend", toggleLabels);
      toggleLabels(); // Initial check
    })
    .catch((err) => {
      console.error("Error loading shapefile:", err);
      alert(
        "Map loading failed. Ensure you are using a Local Server and data files exist.\n" +
          err.message,
      );
    });
}

function toggleMapZoom(enable) {
  if (enable) {
    map.dragging.enable();
    map.touchZoom.enable();
    map.doubleClickZoom.enable();
    map.scrollWheelZoom.enable();
    map.boxZoom.enable();
    if (!zoomControl) {
      zoomControl = L.control.zoom({ position: "bottomright" }).addTo(map);
    }
  } else {
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    if (zoomControl) {
      map.removeControl(zoomControl);
      zoomControl = null;
    }
    fitMapBounds();
  }
}

function toggleTiles(show) {
  if (show) {
    // Turn on Street, Turn off Satellite & Hybrid
    if (map.hasLayer(satelliteLayer)) map.removeLayer(satelliteLayer);
    if (map.hasLayer(hybridLayer)) map.removeLayer(hybridLayer);
    if (!map.hasLayer(tileLayer)) map.addLayer(tileLayer);
    document.getElementById("toggleSatelliteView").checked = false;
    document.getElementById("toggleHybridView").checked = false;
  } else {
    if (map.hasLayer(tileLayer)) map.removeLayer(tileLayer);
  }
}

function toggleSatellite(show) {
  if (show) {
    // Turn on Satellite, Turn off Street & Hybrid
    if (map.hasLayer(tileLayer)) map.removeLayer(tileLayer);
    if (map.hasLayer(hybridLayer)) map.removeLayer(hybridLayer);
    if (!map.hasLayer(satelliteLayer)) map.addLayer(satelliteLayer);
    document.getElementById("toggleStreetView").checked = false;
    document.getElementById("toggleHybridView").checked = false;
  } else {
    if (map.hasLayer(satelliteLayer)) map.removeLayer(satelliteLayer);
  }
}

function toggleHybrid(show) {
  if (show) {
    // Turn on Hybrid, Turn off Street & Satellite
    if (map.hasLayer(tileLayer)) map.removeLayer(tileLayer);
    if (map.hasLayer(satelliteLayer)) map.removeLayer(satelliteLayer);
    if (!map.hasLayer(hybridLayer)) map.addLayer(hybridLayer);
    document.getElementById("toggleStreetView").checked = false;
    document.getElementById("toggleSatelliteView").checked = false;
  } else {
    if (map.hasLayer(hybridLayer)) map.removeLayer(hybridLayer);
  }
}

function toggleDistrictByMap(oid) {
  // Find the checkbox corresponding to the Shapefile OBJECTID
  const cb = document.querySelector(`#districtGrid input[value="${oid}"]`);
  if (cb) {
    cb.checked = !cb.checked;
    // Update selection logic
    updateMultipleSelection();
  }
}

function updateMapStyle(skipMarkers = false) {
  if (!geojsonLayer) return;

  if (!skipMarkers && phenomenaMarkersLayer) {
    phenomenaMarkersLayer.clearLayers();
  }

  // If no review mode is active, we only show the current selection highlight, not the saved weather data
  const showWeatherData = currentReviewMode !== null;

  // If we are not showing weather data, we shouldn't show the legend either (or show empty)
  if (!showWeatherData) {
    /* Logic handled in updateLegend mostly, but map needs to be clean */
  }

  geojsonLayer.eachLayer((layer) => {
    const oid = String(layer.feature.properties.OBJECTID);

    // Check for phenomena specific color
    let phenomColor = null;
    let assignedPhenomenaList = [];

    const distData = showWeatherData ? districtPhenomenaMap[oid] : null;

    if (
      showWeatherData &&
      distData &&
      distData.phenomena &&
      distData.phenomena.size > 0
    ) {
      // Find highest priority color based on phenDefs order
      for (const pDef of phenDefs) {
        if (distData.phenomena.has(pDef.id)) {
          if (!phenomColor) phenomColor = phenColors[pDef.id];

          const isHidden =
            localStorage.getItem(`bihar_hide_icon_${pDef.id}`) === "true";
          if (isHidden) continue;

          assignedPhenomenaList.push(pDef);
        }
      }
    }

    // Marker and Text Logic
    // Only show markers if we are showing weather data
    if (!skipMarkers && showWeatherData) {
      if (assignedPhenomenaList.length > 0) {
        layer.feature.properties.phenomenaText = assignedPhenomenaList
          .map((p) => p.hindi)
          .join(", ");

        // Generate HTML for multiple icons
        let iconsHtml = "";
        // If multiple, use smaller size
        const iconSize = assignedPhenomenaList.length > 1 ? "18px" : "32px";

        assignedPhenomenaList.forEach((p) => {
          // Use Image tag
          iconsHtml += `<div class="phenom-anim-${p.id}" style="width: ${iconSize}; height: ${iconSize}; margin: 1px; display:flex; align-items:center; justify-content:center;">
                            <img src="${p.image}" style="width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 0 2px #fff);">
                          </div>`;
        });

        const icon = L.divIcon({
          html: iconsHtml,
          className: "map-phenom-marker",
          iconSize: [40, 40], // Container size
          iconAnchor: [20, 20],
        });
        // Calculate center of polygon
        const center = layer.getBounds().getCenter();
        const marker = L.marker(center, {
          icon: icon,
          interactive: true,
        }).addTo(phenomenaMarkersLayer);

        const popupContent = `
          <div style="text-align: center; min-width: 150px;">
            <h4 style="margin: 0 0 8px 0; border-bottom: 1px solid #eee; padding-bottom: 5px;">
              ${layer.feature.properties.D_NAME}
            </h4>
            ${assignedPhenomenaList
              .map(
                (p) => `
              <div style="margin-bottom: 6px; line-height: 1.2;">
                <strong style="display: flex; align-items: center; gap: 5px; color: ${phenColors[p.id]}">
                  <img src="${p.image}" style="width: 20px; height: 20px;"> ${p.hindi}
                </strong><br>
                <small style="color: #555;">${p.english}</small>
              </div>
            `,
              )
              .join("")}
          </div>
        `;

        marker.bindPopup(popupContent);
      } else {
        delete layer.feature.properties.phenomenaText;
      }
    }

    if (
      showWeatherData &&
      distData &&
      (distData.phenomena.size > 0 || distData.color)
    ) {
      // Use stored color if available, else fallback to phenom color
      layer.setStyle({
        fillColor: distData.color || phenomColor || "#667eea",
        fillOpacity: 0.8,
        color: "#333",
        weight: 2,
        dashArray: "",
      });
    } else if (selectedDistricts.includes(oid)) {
      // Highlight selected
      layer.setStyle({
        fillColor: "#667eea",
        fillOpacity: 0.6,
        color: "#2c3e50",
        weight: 2,
        dashArray: "",
      });
    } else {
      // Default style
      const isFoothill =
        showFoothill && subRegionDistricts.fh.includes(parseInt(oid));
      layer.setStyle({
        fillColor: getDistrictRegionColor(oid),
        fillOpacity: isFoothill ? 0.5 : 0.2,
        color: "#333", // Dark border
        weight: 2,
        dashArray: isFoothill ? "5, 5" : "",
      });
    }
  });
}

function updateLegend() {
  const legendDiv = document.getElementById("mapLegend");
  const showLegend = document.getElementById("toggleLegend")?.checked;

  if (!legendDiv || currentReviewMode === null) {
    if (legendDiv) legendDiv.style.display = "none";
    return;
  }

  if (!showLegend) {
    legendDiv.style.display = "none";
    return;
  }
  legendDiv.style.display = "block";
  legendDiv.innerHTML = "";

  const activePhenomena = new Set();

  // Collect active phenomena from checkboxes
  document
    .querySelectorAll("#phenomenaContainer input:checked")
    .forEach((cb) => {
      activePhenomena.add(cb.value);
    });
  // Also from map data if any
  if (districtPhenomenaMap) {
    Object.values(districtPhenomenaMap).forEach((d) => {
      if (d.phenomena) {
        d.phenomena.forEach((p) => activePhenomena.add(p));
      }
    });
  }

  // 1. Render Phenomena (First)
  if (activePhenomena.size > 0) {
    legendDiv.innerHTML += `<div style="margin: 5px 0 2px 0; font-weight:bold; border-bottom:1px solid #ccc;">PHENOMENA</div>`;
    phenDefs.forEach((p) => {
      if (activePhenomena.has(p.id)) {
        legendDiv.innerHTML += `
          <div style="display:flex; align-items:center; margin-bottom:6px;">
            <div style="width:35px; height:35px; text-align:center; margin-right:8px; display:flex; justify-content:center; align-items:center;">
                <img src="${p.image}" style="max-width: 100%; max-height: 100%;">
            </div>
            <div style="line-height:1.2;">
                <span style="font-weight:bold;">${p.english}</span><br>
                <span style="font-size:0.9em; color:#555;">${p.hindi}</span>
            </div>
          </div>`;
      }
    });
  }

  // 2. Render Forecast OR Warning based on mode
  let showForecast = true;
  if (currentReviewMode) {
    showForecast = currentReviewMode === "forecast";
  }

  if (showForecast) {
    legendDiv.innerHTML += `<div style="margin: 10px 0 5px 0; font-weight:bold; border-bottom:1px solid #ccc;">Forecast: Distribution</div>`;
    forecastLegendItems.forEach((item) => {
      const borderStyle = item.border ? `border:${item.border};` : "";
      legendDiv.innerHTML += `
        <div style="display:flex; align-items:center; margin-bottom:6px; line-height:1.2;">
          <span style="width:20px; height:20px; background:${item.color}; ${borderStyle} margin-right:8px; flex-shrink:0;"></span>
          <span style="font-size:0.9em;">${item.text}</span>
        </div>`;
    });
  } else {
    legendDiv.innerHTML += `<div style="margin: 10px 0 5px 0; font-weight:bold; border-bottom:1px solid #ccc;">Warning</div>`;
    warningLegendItems.forEach((item) => {
      legendDiv.innerHTML += `
        <div style="display:flex; align-items:center; margin-bottom:6px; line-height:1.2; text-align:left;">
          <span style="width:20px; height:20px; background:${item.color}; border:1px solid #999; margin-right:8px; flex-shrink:0;"></span>
          <span style="font-size:0.9em;">${item.text}</span>
        </div>`;
    });
  }

  if (legendDiv.innerHTML === "") {
    legendDiv.innerHTML = "<em>No items selected</em>";
  }
}

function getDistrictRegionColor(id) {
  id = parseInt(id);
  // Colors for 6 sub-regions
  if (subRegionDistricts.nw.includes(id)) return "#00897b"; // North West (Teal)
  if (subRegionDistricts.nc.includes(id)) return "#1976d2"; // North Central (Blue)
  if (subRegionDistricts.ne.includes(id)) return "#673ab7"; // North East (Deep Purple)
  if (subRegionDistricts.sw.includes(id)) return "#f44336"; // South West (Red)
  if (subRegionDistricts.sc.includes(id)) return "#fbc02d"; // South Central (Yellow)
  if (subRegionDistricts.se.includes(id)) return "#795548"; // South East (Brown)
  return "#3388ff"; // Fallback
}

function validateDistrictCoverage() {
  const allIds = districtsData.map((d) => d.id);
  const coveredIds = new Set();

  Object.values(regionalGroups).forEach((g) => {
    g.districts.forEach((id) => coveredIds.add(id));
  });

  const missing = allIds.filter((id) => !coveredIds.has(id));

  if (missing.length > 0) {
    const names = missing
      .map((id) => {
        const d = getDistrictNameById(id);
        return d ? `${d.name} (${d.hindi})` : `ID: ${id}`;
      })
      .join(", ");
    console.error("Validation Error: Missing districts:", names);
    alert(
      `Configuration Error:\nThe following districts are not assigned to any regional group:\n${names}`,
    );
  }
}

function initVisitorCounter() {
  let count = localStorage.getItem("page_views");
  if (!count) {
    count = 1117; // Start with base number
  } else {
    count = parseInt(count) + 1;
  }
  localStorage.setItem("page_views", count);
  const el = document.getElementById("visitorCount");
  if (el) {
    // Speedometer rolling effect
    const duration = 2000; // 2 seconds
    const start = 0;
    const end = count;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      // Ease-out function
      const easeOut = 1 - Math.pow(1 - progress, 3);

      el.innerText = Math.floor(easeOut * (end - start) + start);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      } else {
        el.innerText = end;
        el.classList.add("blink-active");
      }
    }
    requestAnimationFrame(animation);
  }
}

function toggleMapRegion(regionCode, isChecked) {
  let districts = subRegionDistricts[regionCode];

  if (!districts && regionalGroups[regionCode]) {
    districts = regionalGroups[regionCode].districts;
  }

  if (!districts) return;

  districts.forEach((id) => {
    const cb = document.querySelector(`#districtGrid input[value="${id}"]`);
    if (cb) {
      cb.checked = isChecked;
      const parent = cb.closest(".district-checkbox");
      if (isChecked) parent.classList.add("highlighted");
      else parent.classList.remove("highlighted");
    }
  });

  updateMultipleSelection();
}

function switchDay(day) {
  const isMulti = document.getElementById("multiDaySelectToggle")?.checked;

  if (isMulti) {
    if (activeDays.has(day)) {
      if (activeDays.size > 1) activeDays.delete(day);
    } else {
      activeDays.add(day);
    }
    currentDay = day; // Focus view on the clicked day
  } else {
    activeDays.clear();
    activeDays.add(day);
    currentDay = day;
  }

  districtPhenomenaMap = weeklyData[currentDay - 1];

  // Auto-clear legend/UI if day has no data
  if (!districtPhenomenaMap || Object.keys(districtPhenomenaMap).length === 0) {
    resetUI();
  }

  // Update UI tabs
  // Fix: Target specific day buttons instead of relying on index
  for (let i = 1; i <= 7; i++) {
    const btn = document.querySelector(`button[onclick="switchDay(${i})"]`);
    if (btn) {
      if (activeDays.has(i)) btn.classList.add("active");
      else btn.classList.remove("active");
    }
  }

  updateMapDateHeader();
  updateMapHeaderText(); // Update the specific text
  updateMapStyle();
  resetTableView();
  updateLegend();
}

function updateMapDateHeader() {
  const el = document.getElementById("mapDateOverlay");
  if (el) {
    const date = new Date(forecastBaseDate);

    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    const dateStr = date
      .toLocaleDateString("en-IN", options)
      .replace(/\//g, "-");

    el.innerHTML = `Date: ${dateStr}`;
  }
}

// Helper to compare two day data objects for equality
function areDaysEqual(d1, d2) {
  if (!d1 || !d2) return false;
  const keys1 = Object.keys(d1);
  const keys2 = Object.keys(d2);
  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    const val1 = d1[key];
    const val2 = d2[key];
    if (!val2) return false;
    if (val1.color !== val2.color) return false;
    if (val1.phenomena.size !== val2.phenomena.size) return false;
    const p1 = Array.from(val1.phenomena).sort();
    const p2 = Array.from(val2.phenomena).sort();
    if (JSON.stringify(p1) !== JSON.stringify(p2)) return false;
  }
  return true;
}

function updateMapHeaderText() {
  const el = document.getElementById("mapHeaderText");
  if (!el) return;

  // Only update text if visible (active review mode)
  if (currentReviewMode === null) {
    el.style.display = "none";
    return;
  } else {
    el.style.display = "block";
  }

  // Calculate Continuous Range
  let startDay = currentDay;
  let endDay = currentDay;

  // Check backwards
  while (
    startDay > 1 &&
    areDaysEqual(weeklyData[startDay - 1 - 1], weeklyData[startDay - 1])
  ) {
    startDay--;
  }
  // Check forwards
  while (
    endDay < 7 &&
    areDaysEqual(weeklyData[endDay - 1], weeklyData[endDay])
  ) {
    endDay++;
  }

  const date = new Date(forecastBaseDate);
  // Start Date for Range Start
  const startDate = new Date(date);
  startDate.setDate(date.getDate() + (startDay - 1));

  // End Date for Range End
  const endDate = new Date(date);
  endDate.setDate(date.getDate() + endDay); // +1 day logic is handled by using endDay directly (since currentDay is 0-based index + 1)
  // Wait, logic check:
  // Day 1: Date + 0. Valid till Date + 1.
  // If Range is Day 1 to Day 1: Start = Date+0, End = Date+1.
  // If Range is Day 1 to Day 2: Start = Date+0, End = Date+2.
  // So endDate calculation:
  // endDate.setDate(date.getDate() + endDay);
  // Correct.

  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  const startStr = startDate
    .toLocaleDateString("en-IN", options)
    .replace(/\//g, ".");
  const endStr = endDate
    .toLocaleDateString("en-IN", options)
    .replace(/\//g, ".");

  const modeText =
    currentReviewMode === "forecast"
      ? "वर्षा का पूर्वानुमान"
      : "मौसम की चेतावनी";
  const modeColor = currentReviewMode === "forecast" ? "#0056b3" : "#c0392b"; // Blue / Red

  let dayText = "";
  if (startDay === endDay) {
    dayText = `दिन - ${startDay}`;
  } else {
    dayText = `दिन ${startDay} से दिन - ${endDay}`;
  }

  // Logic for text: Day 1
  // (23.01.2025 के 0830 IST से 24.01.2025 के 0830 IST तक मान्य)

  el.innerHTML = `
        <div>
            <div style="text-align:center; color:${modeColor}; font-weight:bold; font-size:1.8em; margin-bottom:5px; white-space:nowrap; line-height: 1.2;">
                ${modeText} ${dayText} के लिए
            </div>
            <div style="text-align:center; font-size:1.3em; font-weight:bold; color:#333; line-height: 1.2;">
                (${startStr} के 0830 IST से ${endStr} के 0830 IST तक मान्य)
            </div>
        </div>
    `;
}

// Ensure Review Buttons are inactive on load
document.addEventListener("DOMContentLoaded", () => {
  const btnF = document.getElementById("btnReviewForecast");
  const btnW = document.getElementById("btnReviewWarning");
  if (btnF) {
    btnF.style.background = "";
    btnF.style.color = "#333";
  }
  if (btnW) {
    btnW.style.background = "";
    btnW.style.color = "#333";
  }
  currentReviewMode = null;
  const headerText = document.getElementById("mapHeaderText");
  if (headerText) headerText.style.display = "none";
});

function toggleLayoutEditMode(isChecked) {
  isLayoutEditMode = isChecked;
  const chk = document.getElementById("chkLayoutEdit");
  if (chk) chk.checked = isLayoutEditMode;

  if (isLayoutEditMode) {
    alert(
      "Layout Edit Mode Enabled.\n- Drag elements to reposition.\n- Use Mouse Wheel to resize elements.",
    );
    enableDrag("overlayLeft");
    enableDrag("overlayRight");
    enableDrag("mapLegend");
    enableDrag("mapHeaderText");
  } else {
    saveLayoutPositions();
    alert("Layout Saved.");
  }
}

function enableDrag(selector) {
  const el = selector.startsWith(".")
    ? document.querySelector(selector)
    : document.getElementById(selector);
  if (!el) return;

  el.style.cursor = isLayoutEditMode ? "move" : "default";

  el.onmousedown = function (e) {
    if (!isLayoutEditMode) return;
    e.preventDefault();

    let startX = e.clientX;
    let startY = e.clientY;

    // Convert right/bottom to left/top for consistent dragging
    if (el.style.right && el.style.right !== "auto") {
      el.style.left = el.offsetLeft + "px";
      el.style.right = "auto";
    }
    if (el.style.bottom && el.style.bottom !== "auto") {
      el.style.top = el.offsetTop + "px";
      el.style.bottom = "auto";
    }

    document.onmousemove = function (e) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      el.style.top = el.offsetTop + dy + "px";
      el.style.left = el.offsetLeft + dx + "px";
      startX = e.clientX;
      startY = e.clientY;
    };

    document.onmouseup = function () {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };

  // Enable resizing via mouse wheel
  el.onwheel = function (e) {
    if (!isLayoutEditMode) return;
    e.preventDefault();
    let scale = parseFloat(el.getAttribute("data-scale")) || 1;
    if (e.deltaY < 0) scale += 0.1;
    else scale -= 0.1;
    scale = Math.min(Math.max(0.5, scale), 3); // Limit scale between 0.5x and 3x

    if (el.id === "mapHeaderText" || el.id === "slideHeader") {
      el.style.transform = `translateX(-50%) scale(${scale})`;
    } else {
      el.style.transform = `scale(${scale})`;
    }
    el.setAttribute("data-scale", scale.toFixed(2));
  };
}

function saveLayoutPositions() {
  const layout = {};
  const ids = ["overlayLeft", "overlayRight", "mapLegend", "mapHeaderText"];
  ids.forEach((id) => {
    const el = id.startsWith(".")
      ? document.querySelector(id)
      : document.getElementById(id);
    if (el) {
      layout[id] = {
        top: el.style.top,
        left: el.style.left,
        right: el.style.right,
        bottom: el.style.bottom,
        position: el.style.position,
        zIndex: el.style.zIndex,
        scale: el.getAttribute("data-scale"),
      };
    }
  });
  localStorage.setItem("bihar_map_layout", JSON.stringify(layout));
}

function loadLayoutPositions() {
  const raw = localStorage.getItem("bihar_map_layout");
  if (!raw) return;
  try {
    const layout = JSON.parse(raw);
    for (const [id, style] of Object.entries(layout)) {
      const el = id.startsWith(".")
        ? document.querySelector(id)
        : document.getElementById(id);
      if (el) {
        if (style.top) el.style.top = style.top;
        if (style.left) el.style.left = style.left;
        if (style.right) el.style.right = style.right;
        if (style.bottom) el.style.bottom = style.bottom;
        if (style.position) el.style.position = style.position;
        if (style.zIndex) el.style.zIndex = style.zIndex;
        if (style.scale) {
          el.style.transform = `scale(${style.scale})`;
          el.setAttribute("data-scale", style.scale);
        }
      }
    }
  } catch (e) {
    console.error("Error loading layout", e);
  }
}

function changeBodyBackground(color) {
  document.body.style.background = color;
  document.body.style.animation = "none"; // Disable gradient animation
}
window.changeBodyBackground = changeBodyBackground;

function updateMapBackground(color) {
  const mapDiv = document.getElementById("map");
  if (mapDiv) mapDiv.style.background = color;
  localStorage.setItem("bihar_map_bg", color);
}
window.updateMapBackground = updateMapBackground;

// ---------- Map Weather Effects ----------
function handleEffectChange() {
  const select = document.getElementById("mapEffectSelect");
  const val = select.value;

  mapEffectConfig.mode = "manual";
  mapEffectConfig.manualEffect = val;

  // Auto-enable if user selects an effect and it was disabled (optional UX)
  const toggle = document.getElementById("toggleMapEffect");
  if (!mapEffectConfig.enabled && toggle) {
    mapEffectConfig.enabled = true;
    toggle.checked = true;
  }

  saveMapEffectConfig();
  applyMapEffect();
}
window.handleEffectChange = handleEffectChange;

function toggleMapEffect(checked) {
  mapEffectConfig.enabled = checked;
  saveMapEffectConfig();
  applyMapEffect();
}
window.toggleMapEffect = toggleMapEffect;

function saveMapEffectConfig() {
  localStorage.setItem(
    "bihar_map_effect_config",
    JSON.stringify(mapEffectConfig),
  );
}

function initWeatherCanvas() {
  const canvas = document.getElementById("weatherCanvas");
  if (!canvas) return;
  weatherEffectState.ctx = canvas.getContext("2d");

  const resize = () => {
    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
      weatherEffectState.width = canvas.width;
      weatherEffectState.height = canvas.height;
    }
  };
  window.addEventListener("resize", resize);
  resize();

  // Init drops
  weatherEffectState.drops = [];
  for (let i = 0; i < 200; i++) {
    weatherEffectState.drops.push({
      x: Math.random() * weatherEffectState.width,
      y: Math.random() * weatherEffectState.height,
      l: Math.random() * 20 + 10,
      s: Math.random() * 4 + 2,
    });
  }
}

function animateRain() {
  const ctx = weatherEffectState.ctx;
  const w = weatherEffectState.width;
  const h = weatherEffectState.height;

  if (!ctx) return;

  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(255,255,255,0.6)";
  ctx.lineWidth = 1.5;
  ctx.lineCap = "round";

  weatherEffectState.drops.forEach((d) => {
    ctx.beginPath();
    ctx.moveTo(d.x, d.y);
    ctx.lineTo(d.x, d.y + d.l);
    ctx.stroke();

    d.y += d.s;
    if (d.y > h) {
      d.y = -20;
      d.x = Math.random() * w;
    }
  });

  weatherEffectState.animationFrame = requestAnimationFrame(animateRain);
}

function animateWind() {
  const ctx = weatherEffectState.ctx;
  const w = weatherEffectState.width;
  const h = weatherEffectState.height;

  if (!ctx) return;

  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";

  weatherEffectState.drops.forEach((d) => {
    ctx.beginPath();
    ctx.moveTo(d.x, d.y);
    ctx.lineTo(d.x + d.l * 5, d.y + d.l * 0.5);
    ctx.stroke();

    d.x += d.s * 5;
    d.y += d.s * 0.5;

    if (d.x > w) {
      d.x = -200;
      d.y = Math.random() * h;
    }
  });

  weatherEffectState.animationFrame = requestAnimationFrame(animateWind);
}

function applyMapEffect() {
  const canvas = document.getElementById("weatherCanvas");
  const lightning = document.getElementById("weatherLightning");
  const fog = document.getElementById("weatherFog");

  // Reset
  if (weatherEffectState.animationFrame)
    cancelAnimationFrame(weatherEffectState.animationFrame);
  if (canvas) {
    canvas.classList.remove("active");
    if (weatherEffectState.ctx)
      weatherEffectState.ctx.clearRect(
        0,
        0,
        weatherEffectState.width,
        weatherEffectState.height,
      );
  }
  if (lightning) lightning.classList.remove("active");
  if (fog) fog.classList.remove("active");

  if (!mapEffectConfig.enabled) return;

  const effect = mapEffectConfig.manualEffect;

  if (effect === "thunderstorm" || effect === "heavyrain") {
    if (canvas) canvas.classList.add("active");
    animateRain();
  }
  if (effect === "gustywind") {
    if (canvas) canvas.classList.add("active");
    animateWind();
  }
  if (effect === "thunderstorm") {
    if (lightning) lightning.classList.add("active");
  }
  if (effect === "densefog") {
    if (fog) fog.classList.add("active");
  }
}

function toggleCleanMap(checked) {
  if (checked) {
    if (map.hasLayer(tileLayer)) map.removeLayer(tileLayer);
    if (map.hasLayer(satelliteLayer)) map.removeLayer(satelliteLayer);
    if (map.hasLayer(hybridLayer)) map.removeLayer(hybridLayer);

    document.getElementById("toggleStreetView").checked = false;
    document.getElementById("toggleSatelliteView").checked = false;
    document.getElementById("toggleHybridView").checked = false;
  } else {
    if (!map.hasLayer(tileLayer)) map.addLayer(tileLayer);
    document.getElementById("toggleStreetView").checked = true;
  }
}
window.toggleCleanMap = toggleCleanMap;

function updateMapElementScale() {
  const mapDiv = document.getElementById("map");
  if (!mapDiv) return;

  // Base width for 100% scale (e.g., standard laptop)
  const baseWidth = 1200;
  const currentWidth = mapDiv.offsetWidth;

  let scale = currentWidth / baseWidth;
  // Clamp scale: min 0.5 (mobile), max 1.1 (large screens)
  scale = Math.min(Math.max(scale, 0.5), 1.1);

  document.documentElement.style.setProperty("--map-overlay-scale", scale);
}

function renderTableControls() {
  const container = document.getElementById("tableViewContainer");
  if (!container) return;

  if (document.getElementById("tableControls")) return;

  const controls = document.createElement("div");
  controls.id = "tableControls";
  controls.style.marginBottom = "15px";
  controls.style.display = "flex";
  controls.style.gap = "10px";
  controls.style.justifyContent = "flex-end";

  controls.innerHTML = `
      <label style="display: flex; align-items: center; gap: 5px; font-weight: bold; color: #2c3e50; margin-right: 15px;">
          Filter:
          <select id="filterTableColor" onchange="renderTable()" style="padding: 4px; border-radius: 4px; border: 1px solid #ccc;">
              <option value="all">All</option>
              <option value="warning-red">Red</option>
              <option value="warning-orange">Orange</option>
              <option value="warning-yellow">Yellow</option>
              <option value="warning-green">Green</option>
          </select>
      </label>
      <label style="display: flex; align-items: center; gap: 5px; font-weight: bold; cursor: pointer; color: #2c3e50; margin-right: 15px;">
          <input type="checkbox" id="chkCompactView" onchange="renderTable()">
          Compact View
      </label>
      <label style="display: flex; align-items: center; gap: 5px; font-weight: bold; cursor: pointer; color: #2c3e50; margin-right: 15px;">
          <input type="checkbox" id="chkHideWarningCol" onchange="renderTable(); document.getElementById('chkTextBgColor').disabled = !this.checked;">
          Hide Warning Colour
      </label>
      <label title="Apply colour to text background" style="display: flex; align-items: center; gap: 5px; font-weight: bold; cursor: pointer; color: #2c3e50; margin-right: 15px;">
          <input type="checkbox" id="chkTextBgColor" disabled onchange="renderTable()">
          <i class="fas fa-fill-drip" style="font-size: 1.2em;"></i>
      </label>
      <label style="margin-right: auto; display: flex; align-items: center; gap: 5px; font-weight: bold; cursor: pointer; color: #2c3e50;">
          <input type="checkbox" id="chkHideTableCols" onchange="renderTable()">
          Hide Area & Phenomenon
      </label>
      <button class="btn-secondary" onclick="downloadTableImage()"><i class="fas fa-camera"></i> Image</button>
      <button class="btn-secondary" onclick="downloadTablePDF()"><i class="fas fa-file-pdf"></i> PDF</button>
      <button class="btn-secondary" onclick="downloadTableExcel()"><i class="fas fa-file-excel"></i> Excel</button>
      <button class="btn-secondary" onclick="copyTableToClipboard()"><i class="fas fa-copy"></i> Copy</button>
  `;

  container.insertBefore(controls, container.firstChild);
}

function addExportHeader(table) {
  const thead = table.querySelector("thead");
  if (!thead) return null;

  const issueDate = new Date(forecastBaseDate);
  const endDate = new Date(forecastBaseDate);
  endDate.setDate(endDate.getDate() + 6);

  const options = { day: "2-digit", month: "long", year: "numeric" };
  const issueStr = issueDate.toLocaleDateString("en-IN", options);

  const startDay = issueDate.getDate().toString().padStart(2, "0");
  const endDay = endDate.getDate().toString().padStart(2, "0");
  const startMonth = issueDate.toLocaleDateString("en-IN", { month: "long" });
  const endMonth = endDate.toLocaleDateString("en-IN", { month: "long" });
  const startYear = issueDate.getFullYear();
  const endYear = endDate.getFullYear();

  let rangeStr = "";
  if (startMonth === endMonth && startYear === endYear) {
    rangeStr = `${startDay}–${endDay} ${startMonth} ${startYear}`;
  } else if (startYear === endYear) {
    rangeStr = `${startDay} ${startMonth} – ${endDay} ${endMonth} ${startYear}`;
  } else {
    rangeStr = `${startDay} ${startMonth} ${startYear} – ${endDay} ${endMonth} ${endYear}`;
  }

  const hideCols = document.getElementById("chkHideTableCols")?.checked;
  const hideWarningCol = document.getElementById("chkHideWarningCol")?.checked;
  const colSpan = (hideCols ? 5 : 7) - (hideWarningCol ? 1 : 0);

  const row = document.createElement("tr");
  row.id = "export-header-row";
  row.style.backgroundColor = "#ffffff";
  row.innerHTML = `
        <td colspan="${colSpan}" style="text-align: center; border: none; padding: 15px; color: #000;">
            <div style="font-size: 18px; font-weight: bold; font-family: Arial, sans-serif;">Issued On: ${issueStr}: Weather Warning for Next 7 Days (${rangeStr})</div>
        </td>
    `;

  thead.insertBefore(row, thead.firstChild);
  return row;
}

function downloadTableImage() {
  const originalTable = document.getElementById("imdTable");
  if (!originalTable) return;

  // Create temporary container
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.left = "0";
  container.style.zIndex = "-9999";
  container.style.width = originalTable.offsetWidth + "px";
  container.style.backgroundColor = "#ffffff";
  container.style.padding = "20px";
  document.body.appendChild(container);

  // Clone table
  const tableClone = originalTable.cloneNode(true);
  tableClone.style.width = "100%";

  // Add header
  addExportHeader(tableClone);

  container.appendChild(tableClone);

  const width = container.offsetWidth;
  const height = container.offsetHeight;

  domtoimage
    .toPng(container, {
      bgcolor: "#ffffff",
      width: width,
      height: height,
    })
    .then(function (dataUrl) {
      const link = document.createElement("a");
      link.download = `weather-warning-table-${new Date().toISOString().split("T")[0]}.png`;
      link.href = dataUrl;
      link.click();
      document.body.removeChild(container);
    })
    .catch(function (error) {
      console.error("Image download failed", error);
      alert("Image generation failed.");
      document.body.removeChild(container);
    });
}
window.downloadTableImage = downloadTableImage;

function downloadTablePDF() {
  const originalTable = document.getElementById("imdTable");
  if (!originalTable) return;

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.left = "0";
  container.style.zIndex = "-9999";
  container.style.width = originalTable.offsetWidth + "px";
  container.style.backgroundColor = "#ffffff";
  container.style.padding = "20px";
  document.body.appendChild(container);

  const tableClone = originalTable.cloneNode(true);
  tableClone.style.width = "100%";
  addExportHeader(tableClone);
  container.appendChild(tableClone);

  const width = container.offsetWidth;
  const height = container.offsetHeight;

  const { jsPDF } = window.jspdf;

  domtoimage
    .toPng(container, {
      bgcolor: "#ffffff",
      width: width,
      height: height,
    })
    .then(function (dataUrl) {
      const img = new Image();
      img.src = dataUrl;
      img.onload = function () {
        const doc = new jsPDF({
          orientation: width > height ? "l" : "p",
          unit: "px",
          format: [width, height],
        });

        doc.addImage(dataUrl, "PNG", 0, 0, width, height);
        doc.save(
          `weather-warning-table-${new Date().toISOString().split("T")[0]}.pdf`,
        );
        document.body.removeChild(container);
      };
    })
    .catch(function (error) {
      console.error("PDF generation failed", error);
      alert("PDF generation failed.");
      document.body.removeChild(container);
    });
}
window.downloadTablePDF = downloadTablePDF;

function downloadTableExcel() {
  const originalTable = document.getElementById("imdTable");
  if (!originalTable) return;

  const tableClone = originalTable.cloneNode(true);
  addExportHeader(tableClone);

  const html = tableClone.outerHTML;
  const blob = new Blob(["\ufeff", html], {
    type: "application/vnd.ms-excel",
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `weather-warning-table-${new Date().toISOString().split("T")[0]}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
window.downloadTableExcel = downloadTableExcel;

async function copyTableToClipboard() {
  const originalTable = document.getElementById("imdTable");
  if (!originalTable) return;

  const tableClone = originalTable.cloneNode(true);
  addExportHeader(tableClone);

  const html = tableClone.outerHTML;

  try {
    const blobHtml = new Blob([html], { type: "text/html" });
    const blobText = new Blob([tableClone.innerText], { type: "text/plain" });
    const data = [
      new ClipboardItem({
        "text/html": blobHtml,
        "text/plain": blobText,
      }),
    ];
    await navigator.clipboard.write(data);
    alert("Table copied to clipboard!");
  } catch (err) {
    console.error("Clipboard API failed, falling back to execCommand", err);
    // Fallback
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "-9999px";
    container.appendChild(tableClone);
    document.body.appendChild(container);

    const range = document.createRange();
    range.selectNode(tableClone);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);

    try {
      document.execCommand("copy");
      alert("Table copied to clipboard!");
    } catch (e) {
      alert("Failed to copy table.");
    }

    window.getSelection().removeAllRanges();
    document.body.removeChild(container);
  }
}
window.copyTableToClipboard = copyTableToClipboard;

function changeAspectRatio(ratio) {
  const wrapper = document.querySelector(".map-wrapper");
  if (!wrapper) return;

  if (ratio === "custom") {
    wrapper.style.aspectRatio = "unset";
    wrapper.style.resize = "both";
    wrapper.style.overflow = "hidden"; // Required for resize handle
    wrapper.style.minHeight = "300px";
    // Set explicit pixel dimensions to enable smooth resizing from current state
    wrapper.style.width = wrapper.offsetWidth + "px";
    wrapper.style.height = wrapper.offsetHeight + "px";
  } else {
    wrapper.style.resize = "none";
    wrapper.style.overflow = "visible";
    wrapper.style.aspectRatio = ratio;
    wrapper.style.width = "100%";
    wrapper.style.height = "auto";
    wrapper.style.minHeight = "unset";
  }
  setTimeout(() => {
    if (map) {
      map.invalidateSize();
      fitMapToWidth();
    }
  }, 100);
}
window.changeAspectRatio = changeAspectRatio;

function fitMapToWidth() {
  if (map && geojsonLayer) {
    const width = map.getSize().x;
    const padding = width * 0.02; // 2% padding
    map.fitBounds(geojsonLayer.getBounds(), { padding: [padding, padding] });
  }
}
window.fitMapToWidth = fitMapToWidth;
