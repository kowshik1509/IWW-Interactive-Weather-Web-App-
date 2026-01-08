import os
import requests
from flask import Flask, render_template, jsonify, request
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

API_KEY = "YOUR API KEY "
BASE_URL = "https://api.openweathermap.org/data/2.5/weather"


@app.route("/")
def index():
    # Renders the frontend UI
    return render_template("index.html")


@app.route("/weather")
def weather():
    city = request.args.get("city")

    if not city:
        return jsonify({"error": "City name is required"}), 400

    # -----------------------------
    # DEMO MODE (NO API KEY)
    # -----------------------------
    if not API_KEY:
        return jsonify({
            "city": city,
            "country": "DEMO",
            "temperature": 25,
            "description": "clear sky (demo)",
            "humidity": 50,
            "wind_speed": 3,
            "icon": "01d"
        })

    # -----------------------------
    # REAL WEATHER MODE (API KEY)
    # -----------------------------
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

        return jsonify({
            "city": data["name"],
            "country": data["sys"]["country"],
            "temperature": data["main"]["temp"],
            "description": data["weather"][0]["description"],
            "humidity": data["main"]["humidity"],
            "wind_speed": data["wind"]["speed"],
            "icon": data["weather"][0]["icon"]
        })

    except requests.exceptions.RequestException:
        return jsonify({"error": "Network error"}), 500


if __name__ == "__main__":
    app.run(port=8080,debug=True)
