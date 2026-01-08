import os
import requests
from flask import Flask, render_template, jsonify, request
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

API_KEY = os.getenv("WEATHER_API_KEY")
BASE_URL = "https://api.openweathermap.org/data/2.5/weather"


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/weather")
def weather():
    city = request.args.get("city")

    if not city:
        return jsonify({"error": "City name is required"}), 400

    params = {
        "q": city,
        "appid": API_KEY,
        "units": "metric"
    }

    try:
        res = requests.get(BASE_URL, params=params, timeout=5)
        data = res.json()

        if res.status_code != 200:
            return jsonify({"error": "City not found"}), 404

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
    app.run(debug=True)
