const axios = require("axios");

exports.handler = async (event) => {
  const apiKey = process.env.SHECODES_API_KEY; // Use the API key from Netlify environment variables
  const { city, type } = event.queryStringParameters;

  let apiUrl;
  if (type === "current") {
    apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  } else if (type === "forecast") {
    apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid type parameter" }),
    };
  }

  try {
    const response = await axios.get(apiUrl);
    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch weather data" }),
    };
  }
};
