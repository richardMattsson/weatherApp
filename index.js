let temp;
let time;
let adjustedTime;
let cityName;
const searchfield = document.querySelector("#search");
searchfield.value = "";
let searchBtn = document.querySelector("#searchBtn");
searchBtn.disabled = true;
let latitude;
let longitude;
let myChart;
const oneDay = document.querySelector("#oneDay");
const threeDays = document.querySelector("#threeDays");
const sevenDays = document.querySelector("#sevenDays");
let numberOfDays;
let forecastOption = "temperature_2m";
let type = "line";

const dropDown = document.querySelector("#dropDown");

const temperature = document.querySelector("#temp");
const rainOption = document.querySelector("#rain");
const snowOption = document.querySelector("#snow");

temperature.addEventListener("click", () => {
  forecastOption = "temperature_2m";
  console.log(forecastOption);
});
rainOption.addEventListener("click", () => {
  forecastOption = "rain";
  console.log(forecastOption);
});
snowOption.addEventListener("click", () => {
  forecastOption = "snowfall";
  console.log(forecastOption);
});

oneDay.addEventListener("click", () => {
  numberOfDays = 1;
  searchBtn.disabled = false;
});
threeDays.addEventListener("click", () => {
  numberOfDays = 3;
  searchBtn.disabled = false;
});
sevenDays.addEventListener("click", () => {
  numberOfDays = 7;
  searchBtn.disabled = false;
});

searchBtn.addEventListener("click", () => {
  cityName = searchfield.value;
  locationSearch(cityName, numberOfDays, forecastOption);
});

function locationSearch(cityName, numberOfDays, forecastOption) {
  fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`
  )
    .then((response) => response.json())
    .then((result) => {
      cityName = result.results[0].name;
      latitude = result.results[0].latitude;
      longitude = result.results[0].longitude;
      fetchWeather(cityName, latitude, longitude, numberOfDays, forecastOption);
    });
}

function fetchWeather(
  cityName,
  latitude,
  longitude,
  numberOfDays,
  forecastOption
) {
  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=${forecastOption}&forecast_days=${numberOfDays}`
  )
    .then((response) => response.json())
    .then((result) => {
      console.log(result);

      if (forecastOption === "temperature_2m") {
        time = result.hourly.time;
        temp = result.hourly.temperature_2m;
        // adjustedTime = time.map((str) => str.substring(/2024-12-28T/g, ""));
        adjustedTime = time.map((str) => str.substring(str.indexOf("T") + 1));
        type = "line";
        drawChart(type, cityName, temp, adjustedTime);
      } else if (forecastOption === "rain") {
        time = result.hourly.time;
        rain = result.hourly.rain;
        // adjustedTime = time.map((str) => str.substring(/2024-12-28T/g, ""));
        adjustedTime = time.map((str) => str.substring(str.indexOf("T") + 1));
        type = "bar";
        drawChart(type, cityName, rain, adjustedTime);
      } else if (forecastOption === "snowfall") {
        time = result.hourly.time;
        snow = result.hourly.snowfall;
        // adjustedTime = time.map((str) => str.substring(/2024-12-28T/g, ""));
        adjustedTime = time.map((str) => str.substring(str.indexOf("T") + 1));
        type = "bar";
        drawChart(type, cityName, snow, adjustedTime);
      }
    });
}

function drawChart(type, cityName, data, labels) {
  const ctx = document.getElementById("myChart");

  if (myChart) {
    myChart.destroy();
  }

  myChart = new Chart(ctx, {
    type: type,
    data: {
      labels: labels,
      datasets: [
        {
          label: `${cityName}`,
          data: data,
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  });
}
