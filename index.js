let temp;
let time;
let adjustedTime;
let cityName;
let search = document.querySelector("#search");
search.value = "";
let searchBtn = document.querySelector("#searchBtn");
let latitude;
let longitude;
let myChart;

searchBtn.addEventListener("click", () => {
  cityName = search.value;
  locationSearch(cityName);
  search.value = "";
});

function locationSearch(cityName) {
  fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`
  )
    .then((response) => response.json())
    .then((result) => {
      console.log(result.results[0].latitude);
      console.log(result.results[0].longitude);
      latitude = result.results[0].latitude;
      longitude = result.results[0].longitude;
      fetchWeather(latitude, longitude);
    });
}

function fetchWeather(latitude, longitude) {
  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&wind_speed_unit=ms&forecast_days=1`
  )
    .then((response) => response.json())
    .then((result) => {
      console.log(result.hourly.time);
      time = result.hourly.time;
      temp = result.hourly.temperature_2m;
      adjustedTime = time.map((str) => str.replace(/2024-12-27T/g, ""));
      drawChart(temp, adjustedTime);
    });
}

function drawChart(temp, time) {
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
          label: "Temperature C°",
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
