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
        return jsonify({"error": "City parameter is required"}), 400

    # Fetch current weather data
    api_url = f"https://api.shecodes.io/weather/v1/current?query={city}&key={API_KEY}&units=metric"
    response = requests.get(api_url)
    return jsonify(response.json())

@app.route("/forecast", methods=["GET"])
def get_forecast():
    city = request.args.get("city")
    if not city:
        return jsonify({"error": "City parameter is required"}), 400

    # Fetch forecast data
    api_url = f"https://api.shecodes.io/weather/v1/forecast?query={city}&key={API_KEY}&units=metric"
    response = requests.get(api_url)
    return jsonify(response.json())

@app.route('/get-api-key', methods=['GET'])
def get_api_key():
    if not API_KEY:
        return jsonify({"error": "API key is not configured"}), 500
    return jsonify({"apiKey": API_KEY})  # Return the API key from the environment variable

if __name__ == "__main__":
    app.run(debug=True)
