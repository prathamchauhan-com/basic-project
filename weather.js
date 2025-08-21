const weatherForm = document.querySelector(".weatherForm");
const cityinfo = document.querySelector(".cityInfo");
const card = document.querySelector(".card");
const APIKey = "fc34f8c9fd134fa5c677ba1507e42df9";

weatherForm.addEventListener("submit", async event => {
  event.preventDefault();

  const city = cityinfo.value;
  if (city) {
    try {
      const weatherData = await getWeather(city);
      weatherinfo(weatherData);
    }
    catch (error) {
      console.error(error);
      errorinfo(error);
    }
  }
  else {
    errorinfo("Please enter a city name");
  }
});

async function getWeather(city) {

  const APIUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;

  const response = await fetch(APIUrl);
  //console.log(response);
  if (!response.ok) {
    throw new Error("Couldn't fetch weather information.");
  }
  return await response.json();
}

function weatherinfo(data) {
  console.log(data);
  const { name: city,
    main: { temp, humidity },
    weather: [{ description, id }] } = data;

  card.style.display = "flex";
  card.textContent = "";

  const cityName = document.createElement("h1");
  const tempD = document.createElement("p");
  const humidityD = document.createElement("p");
  const descriptionD = document.createElement("p");
  const emojiD = document.createElement("p");

  cityName.textContent = city;
  tempD.textContent = `${(temp - 273.15).toFixed(2)}⁰C`;
  humidityD.textContent = `Humidity: ${humidity}%`;
  descriptionD.textContent = description;
  emojiD.textContent = emojiInfo(id);


  cityName.classList.add("cityD");
  tempD.classList.add("tempD");
  humidityD.classList.add("humidityD");
  descriptionD.classList.add("descD");
  emojiD.classList.add("emojiD");

  card.appendChild(cityName);
  card.appendChild(tempD);
  card.appendChild(humidityD);
  card.appendChild(descriptionD);
  card.appendChild(emojiD);
}

function emojiInfo(weatherId) {

  switch (true) {
    case (weatherId >= 200 && weatherId < 300):
      return "⚡";

    case (weatherId >= 300 && weatherId < 400):
      return "💧";

    case (weatherId >= 500 && weatherId < 600):
      return "☔";

    case (weatherId >= 600 && weatherId < 700):
      return "⛄";

    case (weatherId >= 700 && weatherId < 800):
      return "🌪";

    case (weatherId === 800):
      return "🌞";

    case (weatherId >= 800 && weatherId < 810):
      return "☁️";

    default:
      return "❓";
  }
}

function errorinfo(message) {
  const errorD = document.createElement("p");
  errorD.textContent = message;
  errorD.classList.add("errorD");

  card.textContent = "";
  card.style.display = "flex";
  card.appendChild(errorD);
}