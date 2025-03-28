const express = require("express");
const axios = require("axios");
const cors = require("cors"); // Import CORS middleware

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for specific origin
const corsOptions = {
  origin: "https://memo-weather.netlify.app", // Updated to your actual Netlify domain
};
app.use(cors(corsOptions)); // Restrict CORS to the Netlify domain

// Serve a default response for the root path
app.get("/", (req, res) => {
  console.log("Root endpoint accessed"); // Log when the root endpoint is accessed
  res.send(
    "Weather App Backend is running. Use /api/current or /api/forecast endpoints."
  );
});

// Endpoint to get current weather
app.get("/api/current", async (req, res) => {
  const city = req.query.city;
  const apiKey = process.env.WEATHER_API_KEY; // Use environment variable for API key
  const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

  try {
    const response = await axios.get(apiUrl);
    res.json({
      city: response.data.location.name,
      temperature: {
        current: response.data.current.temp_c,
        humidity: response.data.current.humidity,
      },
      wind: {
        speed: response.data.current.wind_kph,
      },
      condition: {
        description: response.data.current.condition.text,
        icon_url: response.data.current.condition.icon,
      },
      time: response.data.location.localtime_epoch,
    });
  } catch (error) {
    console.error(
      "Error fetching current weather:",
      error.message,
      error.response?.data
    ); // Log detailed error
    res
      .status(500)
      .json({
        error: "Unable to fetch weather data",
        details: error.response?.data,
      });
  }
});

// Endpoint to get weather forecast
app.get("/api/forecast", async (req, res) => {
  const city = req.query.city;
  const apiKey = process.env.WEATHER_API_KEY; // Use environment variable for API key
  const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7`;

  try {
    const response = await axios.get(apiUrl);
    res.json({
      daily: response.data.forecast.forecastday.map((day) => ({
        time: day.date_epoch,
        temperature: {
          maximum: day.day.maxtemp_c,
          minimum: day.day.mintemp_c,
        },
        condition: {
          icon_url: day.day.condition.icon,
        },
      })),
    });
  } catch (error) {
    console.error(
      "Error fetching weather forecast:",
      error.message,
      error.response?.data
    ); // Log detailed error
    res
      .status(500)
      .json({
        error: "Unable to fetch forecast data",
        details: error.response?.data,
      });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`); // Updated log message for clarity
});
