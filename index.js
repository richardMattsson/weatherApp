let temp;
let time;
let adjustedTime;
let cityName;
let searchfield = document.querySelector("#search");
searchfield.value = "";
let searchBtn = document.querySelector("#searchBtn");
let latitude;
let longitude;
let myChart;
let oneDay = document.querySelector("#oneDay");
let threeDays = document.querySelector("#threeDays");
let sevenDays = document.querySelector("#sevenDays");
let numberOfDays;

oneDay.addEventListener("click", () => {
  numberOfDays = 1;
  console.log(numberOfDays);
});
threeDays.addEventListener("click", () => {
  numberOfDays = 3;
  console.log(numberOfDays);
});
sevenDays.addEventListener("click", () => {
  numberOfDays = 7;
  console.log(numberOfDays);
});

searchBtn.addEventListener("click", () => {
  cityName = searchfield.value;
  locationSearch(cityName, numberOfDays);
});

function locationSearch(cityName, numberOfDays) {
  fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`
  )
    .then((response) => response.json())
    .then((result) => {
      console.log(result.results[0].name);
      cityName = result.results[0].name;
      console.log(cityName);
      latitude = result.results[0].latitude;
      longitude = result.results[0].longitude;
      fetchWeather(cityName, latitude, longitude, numberOfDays);
    });
}

function fetchWeather(cityName, latitude, longitude, numberOfDays) {
  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&wind_speed_unit=ms&forecast_days=${numberOfDays}`
  )
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      time = result.hourly.time;
      temp = result.hourly.temperature_2m;
      // adjustedTime = time.map((str) => str.substring(/2024-12-28T/g, ""));
      adjustedTime = time.map((str) => str.substring(str.indexOf("T") + 1));
      console.log(adjustedTime);
      drawChart(cityName, temp, adjustedTime);
    });
}

function drawChart(cityName, temp, time) {
  const ctx = document.getElementById("myChart");

  if (myChart) {
    myChart.destroy();
  }

  myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: time,
      datasets: [
        {
          label: `${cityName} C°`,
          data: temp,
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
