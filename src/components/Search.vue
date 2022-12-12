<template>
  <!-- Previously, backgroundImage class was encapsulated in a curly braces which denominates it as an object. This was not even mentioned in the class and style bindings documentation because it was already mentioned in the template syntax documentation as it's the most basic attribute binding. 
  As our goal is for the actual background image to change class name depending on what switch case, we just have to bind the backgroundImage variable as a basic string and not an object, Depending on the value checked by the switch case, the backgroundImage ref will change accordingly. -->

  <div :class="backgroundImage">
    <div class="container is-max-desktop">
      <div class="notification px-5 has-text-centered">
        <span class="icon-text">
          <span class="icon">
            <i class="fa-solid fa-sun"></i>
          </span>
          <span>Shelby Vue Weather </span>
        </span>
      </div>
    </div>

    <div class="field has-addons has-addons-centered">
      <!-- Data bind the search result to a variable which will be used in an api to get their latitude and longtitude values. Calls the aggregate function when user hits enter on the keyboard. -->
      <div class="control">
        <input
          class="input"
          type="text"
          placeholder="Search for City/Country"
          v-model="cityName"
          @keyup.enter="getData"
        />
      </div>

      <div class="control">
        <button class="button is-info" @click="getData">Search</button>
      </div>
    </div>

    <!-- !== Means strict inequality, so if the currentTemp is defined when the API is fetched, we want the div below to show value. -->
    <div
      v-if="currentTemp !== undefined"
      class="weather-info has-text-centered"
    >
      <div class="location has-text-white">{{ cityName }}</div>
      <div class="date has-text-white">
        {{
          new Intl.DateTimeFormat("default", {
            day: "2-digit",
            weekday: "long",
            month: "long",
            year: "numeric",
          }).format(new Date())
        }}
      </div>
      <div class="temp has-text-white">
        Temperature - {{ currentTemp.temp }}°C
      </div>
      <div class="min_max has-text-white is-size-2">
        {{ currentTemp.temp_max }} / {{ currentTemp.temp_min }}°C
      </div>
      <div class="weather is-size-3 has-text-white">
        Current Weather - {{ currentWeather.main }}
      </div>
      <div class="wind is-size-2 has-text-white">
        Windspeed - {{ windData.speed }}km/h
      </div>
    </div>

    <!-- Only show forecast once API has successfully retrieved the data.
    The :value only can be a string, number or symbol and must be unique. i is a number since it is the index of the tempForecast array -->
    <div v-if="tempForecast !== undefined">
      <div v-for="(threeHour, i) in tempForecast" :key="i">
        {{ threeHour.main.temp }} -- {{ threeHour.dt_txt }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
// Global variables required to be used for global scope.
let tempForecast = ref(undefined);
let currentTemp = ref(undefined);
let windData = ref(undefined);
let currentWeather = ref(undefined);
let cityName = ref("");

/**
 * Background Image class string for the main div element.
 * Defaults to the `bg-default` class defined in current file
 * so that there is a default background image shown.
 */
let backgroundImage = ref("bg-default");

async function getLocation() {
  const directGeocode = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${cityName.value}&appid={API KEY}`
  ).then((response) => response.json());

  // This api returns an array with a name 0 and since we only want the lat and lon values, therefore pulling them out and assigning them the correct values.
  const { lat, lon } = directGeocode[0];

  return { lat, lon };
}

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

/*
 * tempForecast becomes the array which we require to loop through to get the forecast data we need.
 *
 */
async function getForecast(lat, lon) {
  const weatherForecast = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid={API KEY}`
  ).then((response) => response.json());

  tempForecast.value = weatherForecast.list;
}

async function getWeather(lat, lon) {
  const weatherData = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid={API KEY}`
  ).then((response) => response.json());
  currentTemp.value = weatherData.main;
  currentWeather.value = weatherData.weather[0];
  windData.value = weatherData.wind;

  // Check for currentWeather value and change backgroundImage variable value to display appropriate background images that is concurrent with weather.
  switch (currentWeather.value.main) {
    case "Clouds":
      console.log("clouds");
      backgroundImage.value = "bg-cloudy";
      break;
    case "Rain":
      console.log("rain");
      backgroundImage.value = "bg-rainy";
      break;

    /*
     * We don't need to add an additonal break in the default case because if the
     * previous 2 cases is skipped, this will automatically be the case we want.
     */
    default:
      console.log("default");
      backgroundImage.value = "bg-default";
  }
}
</script>

<style>
.container {
  opacity: 0.5;
  margin-bottom: 5%;
}

.notification {
  height: 8vh;
}

.input {
  margin-bottom: 15%;
}

.location {
  font-size: 25px;
  margin-bottom: 2.5%;
}

.date {
  font-size: 20px;
  margin-bottom: 2.5%;
}

.temp {
  display: inline-block;
  padding: 10px 25px;
  font-size: 50px;
  font-weight: 700;
  font-style: italic;
}

.weather {
  margin-bottom: 5%;
}

.box {
  opacity: 0.4;
}

.bg-rainy {
  background-image: url("src/assets/bg-rainy.jpg");
  height: 100vh;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}

.bg-default {
  background-image: url("src/assets/weather-bg.jpg");
  height: 100vh;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
}

.bg-cloudy {
  background-image: url("src/assets/bg-cloudy.jpg");
  height: 100vh;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}
</style>
