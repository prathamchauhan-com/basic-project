document.querySelector(".weatherForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = document.querySelector(".cityInfo").value;
  const card = document.getElementById("weatherCard");
  const forecastContainer = document.getElementById("forecastContainer");
  const errorMsg = document.getElementById("errorMsg");

  card.style.display = "none";
  forecastContainer.style.display = "none";
  errorMsg.textContent = "";

  try {
    // ⚡ Use OpenWeatherMap API directly (replace with your API key)
    const apiKey = "fc34f8c9fd134fa5c677ba1507e42df9";
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const response = await fetch(currentUrl);
    const data = await response.json();

    if (data.cod !== 200) {
      errorMsg.textContent = "City not found!";
      return;
    }

    document.querySelector(".cityD").textContent = data.name;
    document.querySelector(".dateD").textContent = new Date().toDateString();
    document.querySelector(".tempD").textContent = `${Math.round(data.main.temp)}°C`;
    document.querySelector(".descD").textContent = data.weather[0].description;
    document.querySelector(".humidityD").textContent = `Humidity: ${data.main.humidity}%`;

    // Set icon
    const weatherIcon = document.querySelector(".weatherIcon");
    weatherIcon.className = "wi weatherIcon " + getWeatherIcon(data.weather[0].main);

    card.style.display = "block";

    // Forecast (next 3 days)
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    const forecastRes = await fetch(forecastUrl);
    const forecastData = await forecastRes.json();

    const grid = document.getElementById("forecastGrid");
    grid.innerHTML = "";
    let count = 0;
    const seenDates = new Set();

    forecastData.list.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!seenDates.has(date) && count < 3) {
        seenDates.add(date);
        count++;
        const div = document.createElement("div");
        div.className = "forecast-card";
        div.innerHTML = `
          <p><strong>${date}</strong></p>
          <i class="wi ${getWeatherIcon(item.weather[0].main)}" style="font-size:2em;"></i>
          <p>${Math.round(item.main.temp)}°C</p>
        `;
        grid.appendChild(div);
      }
    });

    forecastContainer.style.display = "block";
  } catch (err) {
    errorMsg.textContent = "⚠️ Failed to fetch weather data.";
  }
});

function getWeatherIcon(condition) {
  switch (condition.toLowerCase()) {
    case "clear": return "wi-day-sunny";
    case "clouds": return "wi-cloudy";
    case "rain": return "wi-rain";
    case "snow": return "wi-snow";
    case "thunderstorm": return "wi-thunderstorm";
    case "mist": return "wi-fog";
    default: return "wi-na";
  }
}
