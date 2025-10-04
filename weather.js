const themeToggle = document.getElementById("themeToggle");
let darkMode = false;

themeToggle.addEventListener("click", () => {
  darkMode = !darkMode;
  document.body.style.background = darkMode
    ? "linear-gradient(135deg, #0f2027, #203a43, #2c5364)"
    : "linear-gradient(135deg, #1cb5e0, #000851)";
  themeToggle.textContent = darkMode ? "☀️" : "🌙";
});

async function fetchWeather(city) {
  const card = document.getElementById("weatherCard");
  const forecastContainer = document.getElementById("forecastContainer");
  const errorMsg = document.getElementById("errorMsg");
  const loading = document.getElementById("loading");

  card.style.display = "none";
  forecastContainer.style.display = "none";
  errorMsg.textContent = "";
  loading.style.display = "block";

  try {
    const apiKey = "fc34f8c9fd134fa5c677ba1507e42df9"; // Replace with your OpenWeatherMap key
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const res = await fetch(currentUrl);
    const data = await res.json();

    if (data.cod !== 200) throw new Error("City not found");

    document.querySelector(".cityD").textContent = data.name;
    document.querySelector(".dateD").textContent = new Date().toDateString();
    document.querySelector(".tempD").textContent = `${Math.round(data.main.temp)}°C`;
    document.querySelector(".descD").textContent = data.weather[0].description;
    document.querySelector(".humidityD").textContent = `Humidity: ${data.main.humidity}%`;

    const icon = document.querySelector(".weatherIcon");
    icon.className = "wi weatherIcon " + getWeatherIcon(data.weather[0].main);

    // Dynamic background based on weather
    changeBackground(data.weather[0].main);

    card.style.display = "block";

    // Forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    const forecastRes = await fetch(forecastUrl);
    const forecastData = await forecastRes.json();

    const grid = document.getElementById("forecastGrid");
    grid.innerHTML = "";
    let count = 0;
    const seenDates = new Set();

    forecastData.list.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!seenDates.has(date) && count < 5) {
        seenDates.add(date);
        count++;
        const div = document.createElement("div");
        div.className = "forecast-card";
        div.innerHTML = `
          <p><strong>${date.split(" ")[0]}</strong></p>
          <i class="wi ${getWeatherIcon(item.weather[0].main)}"></i>
          <p>${Math.round(item.main.temp)}°C</p>
        `;
        div.addEventListener("click", () => {
          alert(`${date}\nCondition: ${item.weather[0].description}\nTemp: ${item.main.temp}°C\nHumidity: ${item.main.humidity}%`);
        });
        grid.appendChild(div);
      }
    });

    forecastContainer.style.display = "block";

  } catch (err) {
    errorMsg.textContent = "⚠️ " + err.message;
  } finally {
    loading.style.display = "none";
  }
}

// Form submit
document.querySelector(".weatherForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const city = document.querySelector(".cityInfo").value.trim();
  if(city) fetchWeather(city);
});

// Weather icons
function getWeatherIcon(condition) {
  switch (condition.toLowerCase()) {
    case "clear": return "wi-day-sunny";
    case "clouds": return "wi-cloudy";
    case "rain": return "wi-rain";
    case "drizzle": return "wi-sprinkle";
    case "snow": return "wi-snow";
    case "thunderstorm": return "wi-thunderstorm";
    case "mist":
    case "fog":
    case "haze": return "wi-fog";
    default: return "wi-na";
  }
}

// Change background dynamically
function changeBackground(condition) {
  let bg;
  switch (condition.toLowerCase()) {
    case "clear": bg = "linear-gradient(135deg, #fceabb, #f8b500)"; break;
    case "clouds": bg = "linear-gradient(135deg, #bdc3c7, #2c3e50)"; break;
    case "rain": bg = "linear-gradient(135deg, #4facfe, #00f2fe)"; break;
    case "snow": bg = "linear-gradient(135deg, #e0eafc, #cfdef3)"; break;
    default: bg = "linear-gradient(135deg, #1cb5e0, #000851)";
  }
  document.body.style.background = bg;
}
