// Weather phenomena templates in Hindi and English
const weatherTemplates = {
  thunderstorm: {
    hindi: "मेघगर्जन/वज्रपात",
    english: "Thunderstorm/Lightning",
    template: {
      hindi:
        "राज्य के {district} जिले के एक या दो स्थानों पर मेघगर्जन/वज्रपात की संभावना है।",
      english:
        "Thunderstorm/lightning likely to occur at one or two places over {district} district.",
    },
  },
  "gusty-wind": {
    hindi: "तेज़ हवा",
    english: "Gusty Wind",
    template: {
      hindi:
        "राज्य के {district} जिले के एक या दो स्थानों पर तेज़ हवा (30-40 किमी प्रति घंटा) की संभावना है।",
      english:
        "Gusty wind (30-40 kmph) likely to occur at one or two places over {district} district.",
    },
  },
  "heat-wave": {
    hindi: "लू (उष्ण लहर)",
    english: "Heat Wave",
    template: {
      hindi:
        "{district} जिले के एक या दो स्थानों पर लू (उष्ण लहर) की संभावना है।",
      english: "Heat wave likely at isolated places over {district} district.",
    },
  },
  hailstorm: {
    hindi: "ओलावृष्टि",
    english: "Hailstorm",
    template: {
      hindi: "{district} जिले के एक या दो स्थानों पर ओलावृष्टि की संभावना है।",
      english:
        "Hailstorm likely to occur at one or two places over {district} district.",
    },
  },
  "heavy-rain": {
    hindi: "भारी वर्षा",
    english: "Heavy Rainfall",
    template: {
      hindi:
        "{district} जिले के एक या दो स्थानों पर भारी वर्षा होने की संभावना है।",
      english:
        "Heavy rainfall likely to occur at one or two places over {district} district.",
    },
  },
  "dense-fog": {
    hindi: "घना कोहरा",
    english: "Dense Fog",
    template: {
      hindi:
        "{district} जिले के एक या दो स्थानों पर घना कोहरा छाए रहने की संभावना है।",
      english:
        "Dense fog likely to prevail at one or two places over {district} district.",
    },
  },
  "cold-day": {
    hindi: "शीत दिवस",
    english: "Cold Day",
    template: {
      hindi:
        "{district} जिले में शीत दिवस जैसी स्थितियाँ बनी रहने की संभावना है।",
      english:
        "Cold day like conditions likely to prevail over {district} district.",
    },
  },
  "warm-night": {
    hindi: "गर्म रात्रि",
    english: "Warm Night",
    template: {
      hindi:
        "{district} जिले के एक या दो स्थानों पर गर्म रात्रि की संभावना है।",
      english: "Warm night likely at isolated places over {district} district.",
    },
  },
};

// Alert color codes
const alertColors = {
  green: { bg: "#d4edda", border: "#c3e6cb", text: "#155724" },
  yellow: { bg: "#fff3cd", border: "#ffeaa7", text: "#856404" },
  orange: { bg: "#ffe0b2", border: "#ffcc80", text: "#e65100" },
  red: { bg: "#ffcdd2", border: "#ef9a9a", text: "#b71c1c" },
};

// Function to generate weather forecast
function generateWeatherForecast(districtId, selectedPhenomena) {
  const district = getDistrictNameById(districtId);
  if (!district) return null;

  const forecasts = [];

  selectedPhenomena.forEach((phenomenon) => {
    if (weatherTemplates[phenomenon]) {
      const template = weatherTemplates[phenomenon];
      const forecast = {
        phenomenon: phenomenon,
        hindi: template.template.hindi.replace("{district}", district.hindi),
        english: template.template.english.replace("{district}", district.name),
        color: getAlertColor(phenomenon),
      };
      forecasts.push(forecast);
    }
  });

  return {
    district: district,
    forecasts: forecasts,
    timestamp: new Date().toLocaleString("hi-IN"),
  };
}

// Function to determine alert color based on phenomenon
function getAlertColor(phenomenon) {
  const alertMapping = {
    thunderstorm: "yellow",
    "gusty-wind": "yellow",
    "heat-wave": "orange",
    hailstorm: "orange",
    "heavy-rain": "orange",
    "dense-fog": "yellow",
    "cold-day": "green",
    "warm-night": "green",
  };
  return alertMapping[phenomenon] || "green";
}

// Function to format forecast for display
function formatForecastDisplay(forecastData) {
  if (!forecastData || forecastData.forecasts.length === 0) {
    return '<p class="placeholder-text">कृपया कम से कम एक मौसम घटना चुनें।</p>';
  }

  let html = `
        <div class="forecast-header">
            <h4>${forecastData.district.hindi} (${forecastData.district.name})</h4>
            <small>पूर्वानुमान समय: ${forecastData.timestamp}</small>
        </div>
    `;

  forecastData.forecasts.forEach((forecast) => {
    const color = alertColors[forecast.color];
    html += `
            <div class="forecast-item" style="background-color: ${color.bg}; border-left-color: ${color.border}; color: ${color.text};">
                <strong>${weatherTemplates[forecast.phenomenon].hindi}</strong><br>
                <small>${weatherTemplates[forecast.phenomenon].english}</small><br>
                <p style="margin-top: 10px;">${forecast.hindi}</p>
                <p style="font-style: italic; margin-top: 5px;">${forecast.english}</p>
            </div>
        `;
  });

  return html;
}
