const DEFAULT_CITY = "New York";

document.addEventListener("DOMContentLoaded", () => {
    getWeather(DEFAULT_CITY);
});

function getWeather(cityName) {
    const city = cityName || document.getElementById("cityInput").value;
    if (!city) return;

    const loading = document.getElementById("loading");
    const card = document.getElementById("weatherCard");
    const error = document.getElementById("error");

    loading.classList.remove("hidden");
    card.classList.add("hidden");
    error.textContent = "";

    fetch(`/weather?city=${city}`)
        .then(response => response.json())
        .then(data => {
            loading.classList.add("hidden");

            if (data.error) {
                error.textContent = data.error;
                return;
            }

            document.getElementById("location").textContent =
                `${data.city}, ${data.country}`;

            document.getElementById("temperature").textContent =
                `${data.temperature}°C`;

            document.getElementById("condition").textContent =
                data.description;

            document.getElementById("humidity").textContent =
                `💧 Humidity: ${data.humidity}%`;

            document.getElementById("wind").textContent =
                `🌬️ Wind: ${data.wind_speed} m/s`;

            document.getElementById("weatherIcon").src =
                `https://openweathermap.org/img/wn/${data.icon}@2x.png`;

            card.classList.remove("hidden");
        })
        .catch(() => {
            loading.classList.add("hidden");
            error.textContent = "Unable to fetch weather data.";
        });
}
