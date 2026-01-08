const form = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const card = document.getElementById("weatherCard");
const loading = document.getElementById("loading");
const error = document.getElementById("error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const city = cityInput.value.trim();
  if (!city) return;

  card.classList.add("hidden");
  error.textContent = "";
  loading.classList.remove("hidden");

  try {
    const res = await fetch(`/weather?city=${city}`);
    const data = await res.json();

    loading.classList.add("hidden");

    if (data.error) {
      error.textContent = data.error;
      return;
    }

    document.getElementById("city").textContent =
      `${data.city}, ${data.country}`;
    document.getElementById("temp").textContent =
      `${data.temperature}°C`;
    document.getElementById("condition").textContent =
      data.description;
    document.getElementById("humidity").textContent =
      `${data.humidity}%`;
    document.getElementById("wind").textContent =
      `${data.wind_speed} m/s`;
    document.getElementById("icon").src =
      `https://openweathermap.org/img/wn/${data.icon}@2x.png`;

    card.classList.remove("hidden");

  } catch {
    loading.classList.add("hidden");
    error.textContent = "Failed to fetch data";
  }
});
