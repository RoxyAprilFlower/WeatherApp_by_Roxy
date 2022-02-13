let now = new Date();

let days = ["Sun", "Mon", "Tue", "Wen", "Thu", "Fri", "Sat"];

setInterval(function () {
  let actualTime = document.querySelector("#time");
  let day = days[now.getDay()];
  let hours = now.getHours();
  let minutes = now.getMinutes();
  actualTime.innerHTML = day + " " + hours + ":" + minutes;
}, 1);

// weather change
let apiKey = "71de372771c3992f95fbdfcd38b960d2";
let city = "Prague";
let units = "metric";

function search(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#exampleFormControlInput1");
  let citySearch = document.querySelector("#citySearch");
  citySearch.innerHTML = ` ${searchInput.value}`;
  axios
    .get(generateApiUrl(searchInput.value, apiKey, units))
    .then(showTemperature);
}
let form = document.querySelector("form");
form.addEventListener("submit", search);

function generateApiUrl(city, apiKey, units) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  return apiUrl;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "71de372771c3992f95fbdfcd38b960d2";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
}
function showTemperature(response) {
  let temperature = Math.round(response.data.main.temp);
  let tempNumber = document.querySelector("#tempNumber");

  let minTemp = document.getElementById("minTemp");
  minTemp.innerHTML = Math.round(response.data.main.temp_min);

  let maxTemp = document.getElementById("maxTemp");
  maxTemp.innerHTML = Math.round(response.data.main.temp_max);

  tempNumber.innerHTML = ` ${temperature}`;
  document.getElementById("citySearch").innerHTML = response.data.name;
  document.querySelector("#exampleFormControlInput1").value = "";
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

axios.get(generateApiUrl(city, apiKey, units)).then(showTemperature);

//F
function changeF(event) {
  let units = "imperial";
  let city = document.getElementById("citySearch").innerHTML;
  axios.get(generateApiUrl(city, apiKey, units)).then(showTemperature);
}
let temperatureF = document.querySelector("#f");
temperatureF.addEventListener("click", changeF);

//C
function changeC(event) {
  let units = "metric";
  let city = document.getElementById("citySearch").innerHTML;
  axios.get(generateApiUrl(city, apiKey, units)).then(showTemperature);
}
let temperatureC = document.querySelector("#c");
temperatureC.addEventListener("click", changeC);

/// by Location
function showTemByLocation(event) {
  axios.get(generateApiUrl(city, apiKey, units)).then(showTemperature);
}
let temByLocation = document.querySelector("button");
temByLocation.addEventListener("click", showTemByLocation);

function showPossition(position) {
  let units = "metric";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = "71de372771c3992f95fbdfcd38b960d2";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(function (response) {
    console.log(response);
  });
}
navigator.geolocation.getCurrentPosition(showPossition);
// forecast
function displayForecast(response) {
  if (!response) return;
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast", "#maxmin");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML += `<div class="row block">
  <div class="col-6">${formatDay(forecastDay.dt)}</div>
  <div class="col-2">${Math.round(forecastDay.temp.max)}°</div>
  <div class="col-2 night">${Math.round(forecastDay.temp.min)}°</div>
  <div class="col-2"><img style="width:50px!important" src="http://openweathermap.org/img/wn/${
    forecastDay.weather[0].icon
  }@2x.png"></div>
</div>`;
    }
  });
  forecastElement.innerHTML = forecastHTML + `</div>`;
  console.log(forecastHTML);
}
displayForecast();

// forecast day
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wen", "Thu", "Fri", "Sat"];
  return days[day];
}
