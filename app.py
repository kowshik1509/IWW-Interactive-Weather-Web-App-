import os
import requests
from flask import Flask, render_template, jsonify, request
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# OpenWeatherMap API configuration
API_KEY = os.getenv("WEATHER_API_KEY")
BASE_URL = "https://api.openweathermap.org/data/2.5/weather"


@app.route("/")
def index():
    """Render the main UI"""
    return render_template("index.html")


@app.route("/weather")
def get_weather():
    """
    Fetch weather data for a given city using OpenWeatherMap API.
    Returns JSON response for AJAX calls.
    """
    city = request.args.get("city")

    if not city:
        return jsonify({"error": "City name is required"}), 400

    params = {
        "q": city,
        "appid": API_KEY,
        "units": "metric"
    }

    try:
        response = requests.get(BASE_URL, params=params, timeout=5)
        data = response.json()

        if response.status_code != 200:
            return jsonify({"error": data.get("message", "City not found")}), 404

        weather_data = {
            "city": data["name"],
            "country": data["sys"]["country"],
            "temperature": data["main"]["temp"],
            "condition": data["weather"][0]["main"],
            "description": data["weather"][0]["description"],
            "humidity": data["main"]["humidity"],
            "wind_speed": data["wind"]["speed"],
            "icon": data["weather"][0]["icon"]
        }

        return jsonify(weather_data)

    except requests.exceptions.RequestException:
        return jsonify({"error": "Network error. Please try again."}), 500


if __name__ == "__main__":
    app.run(debug=True)
