const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config(); // Load environment variables from .env

const app = express();
const PORT = 3000; // You can change the port if needed

app.use(cors()); // Allow requests from the frontend

// Proxy endpoint for current weather
app.get("/api/current", async (req, res) => {
  const city = req.query.city;
  const apiKey = process.env.SHECODES_API_KEY; // Securely load the API key

  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }

  const apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;

  try {
    const response = await axios.get(apiUrl);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

// Proxy endpoint for weather forecast
app.get("/api/forecast", async (req, res) => {
  const city = req.query.city;
  const apiKey = process.env.SHECODES_API_KEY;

  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }

  const apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;

  try {
    const response = await axios.get(apiUrl);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch forecast data" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
