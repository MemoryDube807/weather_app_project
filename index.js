function showTemperature(response) {
  let temperatureElement = document.querySelector("#current-temperature");
  let cityElement = document.querySelector("#current-city");
  let rainElement = document.querySelector("#rain");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let timeElement = document.querySelector("#current-date");
  let date = new Date(response.data.time * 1000);
  let iconElement = document.querySelector("#icon");

  let temperature = response.data.temperature.current;

  temperatureElement.innerHTML = Math.round(temperature);
  cityElement.innerHTML = response.data.city;
  timeElement.innerHTML = formatDate(date);
  rainElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = response.data.temperature.humidity;
  windElement.innerHTML = response.data.wind.speed;
  iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="current-temperature-icon" />`;

  getForecast(response.data.city);
}

function formatDate(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];

  return `${day} ${hours}:${minutes}`;
}

function searchCity(city) {
  let apiUrl = `https://weather-app-project-7req.onrender.com/weather?city=${city}`;
  axios.get(apiUrl).then(showTemperature);
}

function handleSearch(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");
  searchCity(searchInput.value);
}

let searchForm = document.querySelector("#search-form");
if (searchForm) {
  searchForm.addEventListener("submit", handleSearch);
}

function getForecast(city) {
  let apiUrl = `https://weather-app-project-7req.onrender.com/forecast?city=${city}`;
  axios.get(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  let forecastHtml = "";

  response.data.daily.forEach(function (day, index) {
    if (index > 0 && index < 7) {
      let date = new Date(day.time * 1000); // Convert timestamp to date
      let options = { weekday: "short" }; // Format to short weekday (e.g., Tue)
      let dayName = date.toLocaleDateString(undefined, options);

      forecastHtml += `
        <div class="weather-forecast-day">
          <div class="weather-forecast-date">${dayName}</div>
          <img src="${day.condition.icon_url}" class="weather-forecast-icon" />
          <div class="weather-forecast-temperatures">
            <div class="weather-forecast-temperature"><strong>${Math.round(
              day.temperature.maximum
            )}°C</strong></div>
            <div class="weather-forecast-temperature">${Math.round(
              day.temperature.minimum
            )}°C</div>
          </div>
        </div>`;
    }
  });

  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHtml;
}

// Fetch the API key from the deployed backend server
async function getApiKey() {
  try {
    const response = await fetch(
      "https://weather-app-project-7req.onrender.com/get-api-key"
    ); // Use deployed backend URL
    if (!response.ok) {
      throw new Error("Failed to fetch API key");
    }
    const data = await response.json();
    return data.apiKey; // Ensure the backend returns { apiKey: "your_api_key" }
  } catch (error) {
    console.error("Error fetching API key:", error);
  }
}

// Example usage
getApiKey().then((apiKey) => {
  if (apiKey) {
    console.log("API Key:", apiKey);
    // Use the API key in your application logic
  }
});

// Default city
searchCity("Nkayi");

// Show/Hide "Back to Top" button
window.addEventListener("scroll", function () {
  let backToTopButton = document.querySelector("#back-to-top");
  if (window.scrollY > 300) {
    backToTopButton.style.display = "block";
  } else {
    backToTopButton.style.display = "none";
  }
});

// Scroll to the top when "Back to Top" button is clicked
let backToTopButton = document.querySelector("#back-to-top");
backToTopButton.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
