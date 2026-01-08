const form = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const card = document.getElementById("weatherCard");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const pinBtn = document.getElementById("pinBtn");
const pinnedContainer = document.getElementById("pinnedContainer");

let currentCityData = null;

// Load pinned cities on start
document.addEventListener("DOMContentLoaded", loadPinnedCities);

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;

  fetchWeather(city);
});

async function fetchWeather(city) {
  error.textContent = "";
  card.classList.add("hidden");
  loading.classList.remove("hidden");

  try {
    const res = await fetch(`/weather?city=${encodeURIComponent(city)}`);
    const data = await res.json();
    loading.classList.add("hidden");

    if (data.error) {
      error.textContent = data.error;
      return;
    }

    currentCityData = data;

    document.getElementById("city").textContent = `${data.city}, ${data.country}`;
    document.getElementById("temp").textContent = `${data.temperature}°C`;
    document.getElementById("condition").textContent = data.description;
    document.getElementById("humidity").textContent = `${data.humidity}%`;
    document.getElementById("wind").textContent = `${data.wind_speed} m/s`;
    document.getElementById("icon").src =
      `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
    applyWeatherTheme(data.description);
    card.classList.remove("hidden");
    

  } catch (err) {
    loading.classList.add("hidden");
    error.textContent = "Failed to fetch weather";
  }
}

// PIN FEATURE
pinBtn.addEventListener("click", () => {
  if (!currentCityData) return;

  const pins = JSON.parse(localStorage.getItem("pins")) || [];
  if (pins.find(p => p.city === currentCityData.city)) return;

  pins.push(currentCityData);
  localStorage.setItem("pins", JSON.stringify(pins));
  loadPinnedCities();
});

function loadPinnedCities() {
  pinnedContainer.innerHTML = "";
  const pins = JSON.parse(localStorage.getItem("pins")) || [];

  pins.forEach((pin, index) => {
    const div = document.createElement("div");
    div.className = "pin-card";

    div.innerHTML = `
      <button class="unpin-btn" title="Unpin">✖</button>
      <h4>${pin.city}</h4>
      <span>${pin.temperature}°C</span>
    `;

    // Click card → load weather
    div.addEventListener("click", () => {
      fetchWeather(pin.city);
    });

    // Unpin button
    div.querySelector(".unpin-btn").addEventListener("click", (e) => {
      e.stopPropagation(); // prevent card click
      removePin(index);
    });

    pinnedContainer.appendChild(div);
  });
}

function removePin(index) {
  const pins = JSON.parse(localStorage.getItem("pins")) || [];
  pins.splice(index, 1);
  localStorage.setItem("pins", JSON.stringify(pins));
  loadPinnedCities();
}

function applyWeatherTheme(description) {
  document.body.className = ""; // reset

  const weather = description.toLowerCase();

  if (weather.includes("clear")) {
    document.body.classList.add("weather-clear");
  } else if (weather.includes("cloud")) {
    document.body.classList.add("weather-clouds");
  } else if (weather.includes("rain") || weather.includes("drizzle")) {
    document.body.classList.add("weather-rain");
  } else if (weather.includes("snow")) {
    document.body.classList.add("weather-snow");
  } else if (weather.includes("mist") || weather.includes("fog")) {
    document.body.classList.add("weather-mist");
  } else if (weather.includes("storm") || weather.includes("thunder")) {
    document.body.classList.add("weather-storm");
  }
}
