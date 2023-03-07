<script setup>
/**
 * Aggregate function to load all the data, with a single set of
 * latitude and longitude values from getLocation.
 */
async function getData() {
  // Have to declare here since the lat and lon variables are not global but limited to getLocation() function
  const { lat, lon } = await getLocation();

  /**
   * The reason why calling these async function calls do not need to put await in front
   * is because these are fire and forget functions, since they do the value updating internally.
   */
  getForecast(lat, lon);
  getWeather(lat, lon);
}

async function getLocation() {
  const directGeocode = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${cityName.value}&appid=${API_KEY}`
  ).then((response) => response.json());

  // This api returns an array with a name 0 and since we only want the lat and lon values, therefore pulling them out and assigning them the correct values.
  const { lat, lon } = directGeocode[0];

  return { lat, lon };
}

// tempForecast becomes the array which we require to loop through to get the forecast data we need.

async function getForecast(lat, lon) {
  const weatherForecast = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  ).then((response) => response.json());

  tempForecast.value = weatherForecast.list;
}

async function getWeather(lat, lon) {
  const weatherData = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  ).then((response) => response.json());
  currentTemp.value = weatherData.main;
  currentWeather.value = weatherData.weather[0];
  windData.value = weatherData.wind;
}

<template>
  <div class="containers">
    <div class="weather-side">
      <div class="weather-gradient"></div>

      <div class="date-container">
        <h2 class="is-size-4">
          {{
            new Intl.DateTimeFormat("default", {
              weekday: "long",
            }).format(new Date())
          }}
        </h2>
        <span class="is-block is-size-5">{{
          new Intl.DateTimeFormat("default", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).format(new Date())
        }}</span>
        <i class="fas fa-2x fa-map-marker-alt">
          <span class="is-inline-block is-size-4 my-4 ml-3">Singapore</span>
        </i>
      </div>

      <div class="weather-container">
        <!-- https://fontawesome.com/icons/categories/weather
        Below icon tag to be rendered conditionally depending on the weather returned from data -->
        <i></i>
        <h1 class="weather-temp">29dgree</h1>
        <h3 class="weather-desc">sunny</h3>
      </div>
    </div>

    <div class="info-side">
      <div class="today-info-container">
        <div class="today-info">
          <div class="precipitation">
            <span class="title has-text-white">Precipitation</span>
            <span class="value">0%</span>
            <div class="clear"></div>
          </div>
          <div class="humidity">
            <span class="title has-text-white">Humidity</span>
            <span class="value">0%</span>
            <div class="clear"></div>
          </div>
          <div class="wind">
            <span class="title has-text-white">Wind</span>
            <span class="value">24 km/h</span>
            <div class="clear"></div>
          </div>
        </div>
      </div>

      <div class="week-container">
        <ul class="week-list">
          <li class="active">
            <!-- 
                https://fontawesome.com/icons/categories/weather
                Below icon tag to be rendered conditionally depending on the weather returned from data -->
            <i></i>
            <span class="day-name">{{
              new Intl.DateTimeFormat("default", {
                weekday: "short",
              }).format(new Date())
            }}</span>
            <span class="day-temp">29degree</span>
          </li>
          <li class="active">
            <!-- 
                https://fontawesome.com/icons/categories/weather
                Below icon tag to be rendered conditionally depending on the weather returned from data -->
            <i></i>
            <span class="day-name">Tues</span>
            <span class="day-temp">29degree</span>
          </li>
          <li class="active">
            <!-- 
                https://fontawesome.com/icons/categories/weather
                Below icon tag to be rendered conditionally depending on the weather returned from data -->
            <i></i>
            <span class="day-name">Tues</span>
            <span class="day-temp">29degree</span>
          </li>
          <li class="active">
            <!-- 
                https://fontawesome.com/icons/categories/weather
                Below icon tag to be rendered conditionally depending on the weather returned from data -->
            <i></i>
            <span class="day-name">Tues</span>
            <span class="day-temp">29degree</span>
          </li>
        </ul>
      </div>

      <div class="location-container">
        <!-- can convert to input or pop out smth to change location -->
        <button class="location-button">
          <i class="fas fa-map-marker-alt">
            <span>Change location</span>
          </i>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Montserrat:400,700,900&display=swap");

:root {
  --gradient: linear-gradient(135deg, #72edf2 10%, #5151e5 100%);
}

* {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  line-height: 1.25em;
}

.clear {
  clear: both;
}

body {
  margin: 0;
  width: 100%;
  height: 100vh;
  font-family: "Montserrat", sans-serif;
  background-color: #343d4b;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
}

.containers {
  border-radius: 25px;
  -webkit-box-shadow: 0 0 70px -10px rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 70px -10px rgba(0, 0, 0, 0.2);
  background-color: #222831;
  color: #ffffff;
  height: 400px;
}

.weather-side {
  position: relative;
  height: 100%;
  border-radius: 25px;
  background-image: url("https://images.unsplash.com/photo-1559963110-71b394e7494d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=675&q=80");
  width: 300px;
  -webkit-box-shadow: 0 0 20px -10px rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 20px -10px rgba(0, 0, 0, 0.2);
  -webkit-transition: -webkit-transform 300ms ease;
  transition: -webkit-transform 300ms ease;
  -o-transition: transform 300ms ease;
  transition: transform 300ms ease;
  transition: transform 300ms ease, -webkit-transform 300ms ease;
  -webkit-transform: translateZ(0) scale(1.02) perspective(1000px);
  transform: translateZ(0) scale(1.02) perspective(1000px);
  float: left;
}

.weather-side:hover {
  -webkit-transform: scale(1.1) perspective(1500px) rotateY(10deg);
  transform: scale(1.1) perspective(1500px) rotateY(10deg);
}

.weather-gradient {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-image: var(--gradient);
  border-radius: 25px;
  opacity: 0.8;
}

.date-container {
  position: absolute;
  top: 25px;
  left: 25px;
}

.weather-container {
  position: absolute;
  bottom: 25px;
  left: 25px;
}

.weather-icon.feather {
  height: 60px;
  width: auto;
}

.weather-temp {
  margin: 0;
  font-weight: 700;
  font-size: 4em;
}

.weather-desc {
  margin: 0;
}

.info-side {
  position: relative;
  float: left;
  height: 100%;
  padding-top: 25px;
}

.today-info {
  padding: 15px;
  margin: 0 25px 25px 25px;
  box-shadow: 0 0 50px -5px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
}
.week-list {
  list-style-type: none;
  padding: 0;
  margin: 10px 35px;
  -webkit-box-shadow: 0 0 50px -5px rgba(0, 0, 0, 0.25);
  box-shadow: 0 0 50px -5px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  /* background: #; */
}

.week-list > li {
  float: left;
  padding: 15px;
  cursor: pointer;
  -webkit-transition: 200ms ease;
  -o-transition: 200ms ease;
  transition: 200ms ease;
  border-radius: 10px;
}

.week-list > li:hover {
  -webkit-transform: scale(1.1);
  -ms-transform: scale(1.1);
  transform: scale(1.1);
  background: #fff;
  color: #222831;
  -webkit-box-shadow: 0 0 40px -5px rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 40px -5px rgba(0, 0, 0, 0.2);
}

.week-list > li.active {
  background: #fff;
  color: #222831;
  border-radius: 10px;
}

.week-list > li .day-name {
  display: block;
  margin: 10px 0 0 0;
  text-align: center;
}

.week-list > li .day-icon {
  display: block;
  height: 30px;
  width: auto;
  margin: 0 auto;
}

.week-list > li .day-temp {
  display: block;
  text-align: center;
  margin: 10px 0 0 0;
  font-weight: 700;
}

.location-container {
  padding: 25px 35px;
}

.location-button {
  outline: none;
  width: 100%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border: none;
  border-radius: 25px;
  padding: 10px;
  font-family: "Montserrat", sans-serif;
  background-image: var(--gradient);
  color: #ffffff;
  font-weight: 700;
  -webkit-box-shadow: 0 0 30px -5px rgba(0, 0, 0, 0.25);
  box-shadow: 0 0 30px -5px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  -webkit-transition: -webkit-transform 200ms ease;
  transition: -webkit-transform 200ms ease;
  -o-transition: transform 200ms ease;
  transition: transform 200ms ease;
  transition: transform 200ms ease, -webkit-transform 200ms ease;
}

.location-button:hover {
  -webkit-transform: scale(0.95);
  -ms-transform: scale(0.95);
  transform: scale(0.95);
}

.location-button .feather {
  height: 1em;
  width: auto;
  margin-right: 5px;
}
</style>
