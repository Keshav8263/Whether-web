document.addEventListener("DOMContentLoaded", () => {
  const API_KEY = "d58d26e67474b1ee61dec9e919d3afd5";
  const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

  const cityInput = document.getElementById("city-input");
  const searchBtn = document.getElementById("search-btn");
  const weatherDisplay = document.getElementById("weather-display");
  const statusMessage = document.getElementById("status-message");

  const cityNameEl = document.getElementById("city-name");
  const temperatureEl = document.getElementById("temperature");
  const descriptionEl = document.getElementById("description");
  const feelsLikeEl = document.getElementById("feels-like");
  const humidityEl = document.getElementById("humidity");
  const windSpeedEl = document.getElementById("wind-speed");
  const pressureEl = document.getElementById("pressure");
  const weatherIconEl = document.getElementById("weather-icon");

  // Map OpenWeatherMap icons to Font Awesome classes
  const weatherIcons = {
    "01d": "fa-solid fa-sun text-yellow-400", // clear sky (day)
    "01n": "fa-solid fa-moon text-gray-300", // clear sky (night)
    "02d": "fa-solid fa-cloud-sun text-yellow-400", // few clouds (day)
    "02n": "fa-solid fa-cloud-moon text-gray-300", // few clouds (night)
    "03d": "fa-solid fa-cloud text-gray-400", // scattered clouds
    "03n": "fa-solid fa-cloud text-gray-400",
    "04d": "fa-solid fa-cloud text-gray-500", // broken clouds
    "04n": "fa-solid fa-cloud text-gray-500",
    "09d": "fa-solid fa-cloud-showers-heavy text-blue-400", // shower rain
    "09n": "fa-solid fa-cloud-showers-heavy text-blue-400",
    "10d": "fa-solid fa-cloud-sun-rain text-blue-400", // rain (day)
    "10n": "fa-solid fa-cloud-moon-rain text-blue-400", // rain (night)
    "11d": "fa-solid fa-bolt text-yellow-500", // thunderstorm
    "11n": "fa-solid fa-bolt text-yellow-500",
    "13d": "fa-solid fa-snowflake text-blue-200", // snow
    "13n": "fa-solid fa-snowflake text-blue-200",
    "50d": "fa-solid fa-smog text-gray-400", // mist
    "50n": "fa-solid fa-smog text-gray-400",
  };

  const displayWeather = (data) => {
    if (!data) return;

    const { name, main, weather, wind } = data;

    cityNameEl.textContent = name;
    temperatureEl.textContent = Math.round(main.temp);
    descriptionEl.textContent = weather[0].description;
    feelsLikeEl.textContent = Math.round(main.feels_like);
    humidityEl.textContent = main.humidity;
    windSpeedEl.textContent = (wind.speed * 3.6).toFixed(1); // convert to km/h
    pressureEl.textContent = main.pressure;

    // Update weather icon
    const iconClass =
      weatherIcons[weather[0].icon] || "fa-solid fa-cloud text-gray-400";
    weatherIconEl.className = iconClass + " text-6xl"; // reset and apply FA class

    weatherDisplay.classList.remove("hidden");
    weatherDisplay.classList.add("fade-in");
    statusMessage.classList.add("hidden");
  };

  const fetchWeather = async (url) => {
    statusMessage.textContent = "Fetching weather data...";
    weatherDisplay.classList.add("hidden");
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      displayWeather(data);
    } catch (error) {
      statusMessage.textContent = `Error: ${error.message}. Please try again.`;
      console.error("Failed to fetch weather data:", error);
    }
  };

  const getWeatherByCity = () => {
    const city = cityInput.value.trim();
    if (city) {
      const url = `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`;
      fetchWeather(url);
    } else {
      statusMessage.textContent = "Please enter a city name.";
    }
  };

  const getWeatherByLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const url = `${BASE_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
          fetchWeather(url);
        },
        (error) => {
          statusMessage.textContent =
            "Could not get your location. Please enter a city manually.";
          console.error("Geolocation error:", error);
        }
      );
    } else {
      statusMessage.textContent =
        "Geolocation is not supported by your browser. Please enter a city manually.";
    }
  };

  searchBtn.addEventListener("click", getWeatherByCity);
  cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      getWeatherByCity();
    }
  });

  getWeatherByLocation();
});
