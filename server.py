from flask import Flask, request, jsonify
import requests
import os
from dotenv import load_dotenv
from flask_cors import CORS  # Import CORS

# Load environment variables from a .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Get the API key from the environment variable
API_KEY = os.getenv("API_KEY")

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Welcome to the Weather API!"})

@app.route("/weather", methods=["GET"])
def get_weather():
    city = request.args.get("city")
    if not city:
        app.logger.error("City parameter is missing in /weather request.")
        return jsonify({"error": "City parameter is required"}), 400

    app.logger.info(f"Fetching weather data for city: {city}")
    api_url = f"https://api.shecodes.io/weather/v1/current?query={city}&key={API_KEY}&units=metric"
    response = requests.get(api_url)
    if response.status_code != 200:
        app.logger.error(f"Failed to fetch weather data: {response.text}")
        return jsonify({"error": "Failed to fetch weather data"}), response.status_code

    app.logger.info(f"Weather data fetched successfully for city: {city}")
    return jsonify(response.json())

@app.route("/forecast", methods=["GET"])
def get_forecast():
    city = request.args.get("city")
    if not city:
        app.logger.error("City parameter is missing in /forecast request.")
        return jsonify({"error": "City parameter is required"}), 400

    app.logger.info(f"Fetching forecast data for city: {city}")
    api_url = f"https://api.shecodes.io/weather/v1/forecast?query={city}&key={API_KEY}&units=metric"
    response = requests.get(api_url)
    if response.status_code != 200:
        app.logger.error(f"Failed to fetch forecast data: {response.text}")
        return jsonify({"error": "Failed to fetch forecast data"}), response.status_code

    app.logger.info(f"Forecast data fetched successfully for city: {city}")
    return jsonify(response.json())

@app.route('/get-api-key', methods=['GET'])
def get_api_key():
    if not API_KEY:
        return jsonify({"error": "API key is not configured"}), 500
    return jsonify({"apiKey": API_KEY})  # Return the API key from the environment variable

if __name__ == "__main__":
    app.run(debug=True)
