// ===============================
// WEATHER APP
// Complete JavaScript
// ===============================


// ---------- DOM ELEMENTS ----------

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");

const errorMessage = document.getElementById("errorMessage");
const loading = document.getElementById("loading");

const cityName = document.getElementById("cityName");
const weatherDescription = document.getElementById("weatherDescription");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");

const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const feelsLike = document.getElementById("feelsLike");

const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");

const forecastContainer = document.getElementById("forecastContainer");

const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");

const uvIndex = document.getElementById("uvIndex");
const uvLevel = document.getElementById("uvLevel");

const aqiValue = document.getElementById("aqiValue");
const aqiLevel = document.getElementById("aqiLevel");

const recentCities = document.getElementById("recentCities");

const themeBtn = document.getElementById("themeBtn");
const unitBtn = document.getElementById("unitBtn");

const weatherAlert = document.getElementById("weatherAlert");
const alertTitle = document.getElementById("alertTitle");
const alertMessage = document.getElementById("alertMessage");


// ---------- VARIABLES ----------

let currentWeatherData = null;
let currentUnit = "C";


// ---------- WEATHER CODE ----------

function getWeatherInfo(code) {

    if (code === 0) {
        return {
            description: "Clear Sky",
            icon: "☀️",
            type: "clear"
        };
    }

    if (code === 1 || code === 2) {
        return {
            description: "Partly Cloudy",
            icon: "🌤️",
            type: "clear"
        };
    }

    if (code === 3) {
        return {
            description: "Cloudy",
            icon: "☁️",
            type: "cloudy"
        };
    }

    if (code >= 45 && code <= 48) {
        return {
            description: "Foggy",
            icon: "🌫️",
            type: "cloudy"
        };
    }

    if (code >= 51 && code <= 57) {
        return {
            description: "Drizzle",
            icon: "🌦️",
            type: "rain"
        };
    }

    if (code >= 61 && code <= 67) {
        return {
            description: "Rain",
            icon: "🌧️",
            type: "rain"
        };
    }

    if (code >= 71 && code <= 77) {
        return {
            description: "Snow",
            icon: "❄️",
            type: "snow"
        };
    }

    if (code >= 80 && code <= 82) {
        return {
            description: "Rain Showers",
            icon: "🌦️",
            type: "rain"
        };
    }

    if (code >= 85 && code <= 86) {
        return {
            description: "Snow Showers",
            icon: "🌨️",
            type: "snow"
        };
    }

    if (code >= 95 && code <= 99) {
        return {
            description: "Thunderstorm",
            icon: "⛈️",
            type: "storm"
        };
    }

    return {
        description: "Unknown Weather",
        icon: "🌤️",
        type: "clear"
    };
}


// ---------- SEARCH CITY ----------

async function searchCity(city) {

    if (!city.trim()) {
        showError("Please enter a city name.");
        return;
    }

    hideError();
    showLoading();

    try {

        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const response = await fetch(geoURL);

        if (!response.ok) {
            throw new Error("Unable to search city.");
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            throw new Error("City not found.");
        }

        const location = data.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        const displayName =
            `${location.name}${location.country ? ", " + location.country : ""}`;

        await getWeather(
            latitude,
            longitude,
            displayName
        );

        saveRecentCity(displayName);

    } catch (error) {

        console.error(error);

        showError(
            error.message || "Something went wrong."
        );

    } finally {

        hideLoading();
    }
}


// ---------- GET WEATHER ----------

async function getWeather(
    latitude,
    longitude,
    displayName
) {

    const weatherURL =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code,uv_index,surface_pressure,visibility` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max` +
        `&forecast_days=5&timezone=auto`;

    const response = await fetch(weatherURL);

    if (!response.ok) {
        throw new Error("Weather data unavailable.");
    }

    const data = await response.json();

    currentWeatherData = {
        latitude: latitude,
        longitude: longitude,
        displayName: displayName,
        data: data
    };

    displayWeather(
        data,
        displayName
    );

    await getAirQuality(
        latitude,
        longitude
    );
}


// ---------- DISPLAY WEATHER ----------

function displayWeather(
    data,
    displayName
) {

    cityName.textContent = displayName;

    const current = data.current;

    const weatherInfo =
        getWeatherInfo(
            current.weather_code
        );

    weatherDescription.textContent =
        weatherInfo.description;

    weatherIcon.textContent =
        weatherInfo.icon;

    updateTemperature(
        current.temperature_2m
    );

    humidity.textContent =
        `${current.relative_humidity_2m}%`;

    windSpeed.textContent =
        `${current.wind_speed_10m} km/h`;

    updateFeelsLike(
        current.apparent_temperature
    );

    updatePressure(
        current.surface_pressure
    );

    updateVisibility(
        current.visibility
    );

    changeWeatherBackground(
        weatherInfo.type
    );

    displayForecast(data);

    displaySunTimes(data);

    displayUV(data);

    createWeatherAlert(data);
}


// ---------- TEMPERATURE ----------

function updateTemperature(celsius) {

    let value;

    if (currentUnit === "C") {

        value = celsius;

    } else {

        value =
            (celsius * 9 / 5) + 32;
    }

    temperature.textContent =
        `${Math.round(value)}°${currentUnit}`;

    setTemperatureColor(celsius);
}


// ---------- FEELS LIKE ----------

function updateFeelsLike(celsius) {

    let value;

    if (currentUnit === "C") {

        value = celsius;

    } else {

        value =
            (celsius * 9 / 5) + 32;
    }

    feelsLike.textContent =
        `${Math.round(value)}°${currentUnit}`;
}


// ---------- PRESSURE ----------

function updatePressure(value) {

    if (
        value === undefined ||
        value === null
    ) {

        pressure.textContent =
            "-- hPa";

        return;
    }

    pressure.textContent =
        `${Math.round(value)} hPa`;
}


// ---------- VISIBILITY ----------

function updateVisibility(value) {

    if (
        value === undefined ||
        value === null
    ) {

        visibility.textContent =
            "-- km";

        return;
    }

    const visibilityKm =
        value / 1000;

    visibility.textContent =
        `${visibilityKm.toFixed(1)} km`;
}


// ---------- TEMPERATURE COLOR ----------

function setTemperatureColor(celsius) {

    temperature.classList.remove(
        "temperature-cold",
        "temperature-normal",
        "temperature-hot"
    );

    if (celsius < 15) {

        temperature.classList.add(
            "temperature-cold"
        );

    } else if (celsius <= 30) {

        temperature.classList.add(
            "temperature-normal"
        );

    } else {

        temperature.classList.add(
            "temperature-hot"
        );
    }
}


// ---------- FORECAST ----------

function displayForecast(data) {

    forecastContainer.innerHTML = "";

    const daily = data.daily;

    for (let i = 0; i < 5; i++) {

        const date =
            new Date(daily.time[i]);

        const dayName =
            date.toLocaleDateString(
                "en-US",
                {
                    weekday: "short"
                }
            );

        const weatherInfo =
            getWeatherInfo(
                daily.weather_code[i]
            );

        let maxTemp =
            daily.temperature_2m_max[i];

        let minTemp =
            daily.temperature_2m_min[i];

        if (currentUnit === "F") {

            maxTemp =
                (maxTemp * 9 / 5) + 32;

            minTemp =
                (minTemp * 9 / 5) + 32;
        }

        const card =
            document.createElement("div");

        card.className =
            "forecast-card";

        card.innerHTML = `
            <h4>${dayName}</h4>

            <div class="forecast-icon">
                ${weatherInfo.icon}
            </div>

            <p>${weatherInfo.description}</p>

            <strong>
                ${Math.round(maxTemp)}° /
                ${Math.round(minTemp)}°${currentUnit}
            </strong>
        `;

        forecastContainer.appendChild(card);
    }
}


// ---------- SUNRISE / SUNSET ----------

function displaySunTimes(data) {

    const daily = data.daily;

    if (
        daily.sunrise &&
        daily.sunrise[0]
    ) {

        const sunriseDate =
            new Date(
                daily.sunrise[0]
            );

        sunrise.textContent =
            sunriseDate.toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );
    }

    if (
        daily.sunset &&
        daily.sunset[0]
    ) {

        const sunsetDate =
            new Date(
                daily.sunset[0]
            );

        sunset.textContent =
            sunsetDate.toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );
    }
}


// ---------- UV INDEX ----------

function displayUV(data) {

    const current =
        data.current;

    const daily =
        data.daily;

    let uv =
        current.uv_index;

    const currentHour =
        new Date().getHours();

    if (
        currentHour < 6 ||
        currentHour >= 18
    ) {

        uvIndex.textContent = "0";

        uvLevel.textContent =
            "No UV at Night 🌙";

        return;
    }

    if (
        uv === undefined ||
        uv === null
    ) {

        uv =
            daily.uv_index_max
                ? daily.uv_index_max[0]
                : 0;
    }

    uvIndex.textContent =
        Number(uv).toFixed(1);

    if (uv <= 2) {

        uvLevel.textContent =
            "Low 🟢";

    } else if (uv <= 5) {

        uvLevel.textContent =
            "Moderate 🟡";

    } else if (uv <= 7) {

        uvLevel.textContent =
            "High 🟠";

    } else if (uv <= 10) {

        uvLevel.textContent =
            "Very High 🔴";

    } else {

        uvLevel.textContent =
            "Extreme 🟣";
    }
}


// ---------- AIR QUALITY ----------

async function getAirQuality(
    latitude,
    longitude
) {

    try {

        const airURL =
            `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}` +
            `&current=us_aqi,pm10,pm2_5&timezone=auto`;

        const response =
            await fetch(airURL);

        if (!response.ok) {
            throw new Error(
                "Air quality unavailable."
            );
        }

        const data =
            await response.json();

        const aqi =
            data.current.us_aqi;

        if (
            aqi === undefined ||
            aqi === null
        ) {

            aqiValue.textContent =
                "--";

            aqiLevel.textContent =
                "--";

            return;
        }

        aqiValue.textContent =
            Math.round(aqi);

        if (aqi <= 50) {

            aqiLevel.textContent =
                "Good 🟢";

        } else if (aqi <= 100) {

            aqiLevel.textContent =
                "Moderate 🟡";

        } else if (aqi <= 150) {

            aqiLevel.textContent =
                "Unhealthy for Sensitive Groups 🟠";

        } else if (aqi <= 200) {

            aqiLevel.textContent =
                "Unhealthy 🔴";

        } else if (aqi <= 300) {

            aqiLevel.textContent =
                "Very Unhealthy 🟣";

        } else {

            aqiLevel.textContent =
                "Hazardous 🟥";
        }

        createWeatherAlert(
            currentWeatherData.data
        );

    } catch (error) {

        console.error(
            "Air Quality Error:",
            error
        );

        aqiValue.textContent =
            "--";

        aqiLevel.textContent =
            "--";
    }
}


// ---------- WEATHER ALERTS ----------

function createWeatherAlert(data) {

    if (!data) {
        return;
    }

    const current =
        data.current;

    const temperatureC =
        current.temperature_2m;

    const weatherCode =
        current.weather_code;

    const uv =
        current.uv_index || 0;

    let alert = null;


    // Extreme Heat
    if (temperatureC >= 40) {

        alert = {
            title: "🔥 Extreme Heat Alert",
            message:
                `Temperature is ${Math.round(temperatureC)}°C. Stay hydrated and avoid prolonged direct sunlight.`
        };
    }


    // Thunderstorm
    else if (
        weatherCode >= 95 &&
        weatherCode <= 99
    ) {

        alert = {
            title: "⛈️ Thunderstorm Alert",
            message:
                "Thunderstorm conditions are possible. Stay indoors and avoid open areas."
        };
    }


    // Heavy Rain
    else if (
        weatherCode === 65 ||
        weatherCode === 67 ||
        weatherCode === 82
    ) {

        alert = {
            title: "🌧️ Heavy Rain Alert",
            message:
                "Heavy rain conditions are possible. Carry an umbrella and be careful while travelling."
        };
    }


    // Snow
    else if (
        weatherCode >= 71 &&
        weatherCode <= 86
    ) {

        alert = {
            title: "❄️ Snow Alert",
            message:
                "Snowy conditions are possible. Take care while travelling."
        };
    }


    // High UV
    else if (uv >= 8) {

        alert = {
            title: "☀️ High UV Alert",
            message:
                "UV levels are very high. Use sun protection and avoid prolonged direct sunlight."
        };
    }


    // AQI Alert
    else {

        const aqiText =
            aqiValue.textContent;

        const aqi =
            parseInt(aqiText);

        if (
            !isNaN(aqi) &&
            aqi > 150
        ) {

            alert = {
                title: "🌫️ Air Quality Alert",
                message:
                    `Air quality is unhealthy with an AQI of ${aqi}. Consider limiting outdoor activity.`
            };
        }
    }


    // Show / Hide Alert

    if (alert) {

        alertTitle.textContent =
            alert.title;

        alertMessage.textContent =
            alert.message;

        weatherAlert.classList.remove(
            "hidden"
        );

    } else {

        weatherAlert.classList.add(
            "hidden"
        );
    }
}


// ---------- WEATHER BACKGROUND ----------

function changeWeatherBackground(type) {

    document.body.classList.remove(
        "weather-clear",
        "weather-cloudy",
        "weather-rain",
        "weather-snow",
        "weather-storm"
    );

    if (type === "clear") {

        document.body.classList.add(
            "weather-clear"
        );

    } else if (type === "cloudy") {

        document.body.classList.add(
            "weather-cloudy"
        );

    } else if (type === "rain") {

        document.body.classList.add(
            "weather-rain"
        );

    } else if (type === "snow") {

        document.body.classList.add(
            "weather-snow"
        );

    } else if (type === "storm") {

        document.body.classList.add(
            "weather-storm"
        );
    }
}


// ---------- RECENT SEARCHES ----------

function saveRecentCity(city) {

    let cities =
        JSON.parse(
            localStorage.getItem(
                "recentCities"
            )
        ) || [];

    cities =
        cities.filter(
            item => item !== city
        );

    cities.unshift(city);

    cities =
        cities.slice(0, 5);

    localStorage.setItem(
        "recentCities",
        JSON.stringify(cities)
    );

    displayRecentCities();
}


function displayRecentCities() {

    if (!recentCities) {
        return;
    }

    const cities =
        JSON.parse(
            localStorage.getItem(
                "recentCities"
            )
        ) || [];

    recentCities.innerHTML = "";

    cities.forEach(city => {

        const button =
            document.createElement(
                "button"
            );

        button.textContent =
            city;

        button.addEventListener(
            "click",
            () => {
                searchCity(city);
            }
        );

        recentCities.appendChild(
            button
        );
    });
}


// ---------- DARK MODE ----------

function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            "weatherTheme"
        );

    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark-mode"
        );

        themeBtn.textContent =
            "☀️ Light Mode";

    } else {

        document.body.classList.remove(
            "dark-mode"
        );

        themeBtn.textContent =
            "🌙 Dark Mode";
    }
}


themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark-mode"
        );

        const isDark =
            document.body.classList.contains(
                "dark-mode"
            );

        if (isDark) {

            themeBtn.textContent =
                "☀️ Light Mode";

            localStorage.setItem(
                "weatherTheme",
                "dark"
            );

        } else {

            themeBtn.textContent =
                "🌙 Dark Mode";

            localStorage.setItem(
                "weatherTheme",
                "light"
            );
        }
    }
);


// ---------- UNIT TOGGLE ----------

unitBtn.addEventListener(
    "click",
    () => {

        if (!currentWeatherData) {
            return;
        }

        if (currentUnit === "C") {

            currentUnit = "F";

        } else {

            currentUnit = "C";
        }

        displayWeather(
            currentWeatherData.data,
            currentWeatherData.displayName
        );
    }
);


// ---------- SEARCH BUTTON ----------

searchBtn.addEventListener(
    "click",
    () => {

        const city =
            cityInput.value.trim();

        searchCity(city);
    }
);


// ---------- ENTER KEY ----------

cityInput.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {

            searchCity(
                cityInput.value.trim()
            );
        }
    }
);


// ---------- USE MY LOCATION ----------

locationBtn.addEventListener(
    "click",
    () => {

        if (!navigator.geolocation) {

            showError(
                "Geolocation is not supported by your browser."
            );

            return;
        }

        hideError();
        showLoading();

        navigator.geolocation.getCurrentPosition(

            async (position) => {

                try {

                    const latitude =
                        position.coords.latitude;

                    const longitude =
                        position.coords.longitude;

                    await getWeather(
                        latitude,
                        longitude,
                        "My Location"
                    );

                } catch (error) {

                    console.error(error);

                    showError(
                        "Unable to get weather for your location."
                    );

                } finally {

                    hideLoading();
                }
            },

            () => {

                hideLoading();

                showError(
                    "Location permission was denied."
                );
            }
        );
    }
);


// ---------- LOADING ----------

function showLoading() {

    loading.classList.remove(
        "hidden"
    );
}


function hideLoading() {

    loading.classList.add(
        "hidden"
    );
}


// ---------- ERROR ----------

function showError(message) {

    errorMessage.textContent =
        message;

    errorMessage.classList.remove(
        "hidden"
    );
}


function hideError() {

    errorMessage.classList.add(
        "hidden"
    );
}


// ---------- INITIAL LOAD ----------

loadTheme();

displayRecentCities();