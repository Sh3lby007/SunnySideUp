<template>
  <div :class="{ backgroundImage }">
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
      <!-- Data bind the search result to a variable which will be used in an api to get their latitude and longtitude values. All the functions can be called when user clicks enter key on their keyboard -->
      <div class="control">
        <input
          class="input"
          type="text"
          placeholder="Search for City/Country"
          v-model="cityName"
          @keyup.enter="getWeather(), getForecast(), getLocation()"
        />
      </div>

      <div class="control">
        <a
          class="button is-info"
          @click="getWeather(), getForecast(), getLocation"
          >Search</a
        >
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

    <div class="box has-text-centered is-transparent">2 hour forecast</div>

    <!-- Only show forecast once API has successfully retrieved the data -->
    <!-- <div v-if="tempForecast !== undefined">
    <div
      v-for="(threeHour, i) in tempForecast.list[i].main.temp"
      :key="threeHour"
    >
      {{ threeHour }} - {{ tempForecast.list[i].dt_text }}
    </div>
  </div> -->
  </div>
</template>

<script setup>
import { ref } from "vue";

let tempForecast = ref(undefined);
let currentTemp = ref(undefined);
let windData = ref(undefined);
let currentWeather = ref(undefined);
let cityName = ref("");
let backgroundImage = ref("bg-default");

async function getForecast() {
  const { lat, lon } = await getLocation();
  const weatherForecast = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=c3e7d4b44bd41c743b5e4c019926a500`
  ).then((response) => response.json());

  tempForecast.value = weatherForecast.list;
  // console.log(tempForecast.value);
}

async function getLocation() {
  const directGeocode = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${cityName.value}&appid=c3e7d4b44bd41c743b5e4c019926a500`
  ).then((response) => response.json());

  // This api returns an array with a name 0 and since we only want the lat and lon values, therefore pulling them out and assigning them the correct values.
  const { lat, lon } = directGeocode[0];

  return { lat, lon };
}

async function getWeather() {
  // Have to declare here since the lat and lon variables are not global but limited to getLocation() function
  const { lat, lon } = await getLocation();
  const weatherData = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=c3e7d4b44bd41c743b5e4c019926a500`
  ).then((response) => response.json());
  currentTemp.value = weatherData.main;
  currentWeather.value = weatherData.weather[0];
  windData.value = weatherData.wind;

  switch (currentWeather.value.main) {
    case "Clouds":
      console.log("clouds");
      backgroundImage.value = "bg-cloudy";
      break;
    case "Rain":
      console.log("rain");
      backgroundImage.value = "bg-rain";
      break;
    default:
      console.log("debug");
      return "bg-default";
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

.backgroundImage {
  background-image: url("src/assets/bg-rainy.jpg");
  height: 100vh;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}

.backgroundImage {
  background-image: url("src/assets/weather-bg.jpg");
  height: 100vh;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
}

.backgroundImage {
  background-image: url("src/assets/bg-cloudy.jpg");
  height: 100vh;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}
</style>
