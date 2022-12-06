<template>
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
    <!-- Data bind the search result to a variable which will be used in an api to get their latitude and longtitude values. -->
    <div class="control">
      <input
        class="input"
        type="text"
        placeholder="Search for City/Country"
        v-model="cityName"
      />
    </div>

    <div class="control">
      <a class="button is-info" @click="getTemperature">Search</a>
    </div>
  </div>
  <!-- !== Means strict inequality, so if the currentWeather is defined when the API is fetched, we want the div below to show value. -->
  <div
    v-if="currentWeather !== undefined"
    class="weather-info has-text-centered"
  >
    <div class="date">
      {{
        new Intl.DateTimeFormat("default", {
          day: "2-digit",
          weekday: "long",
          month: "long",
          year: "numeric",
        }).format(new Date())
      }}
    </div>
    <div class="temp">Temperature - {{ currentWeather }}°C</div>
    <div class="weather is-size-2">
      Windspeed - {{ currentWeather }}km/h <br />Wind Direction -
      {{ currentWeather.winddirection }}
    </div>
  </div>

  <div class="box has-text-centered is-transparent">2 hour forecast</div>

  <!-- Only show forecast once API has successfully retrieved the data -->
  <div v-if="tempData !== undefined">
    <div v-for="(hour, i) in tempData.time" :key="hour">
      {{ hour }} - {{ tempData.temperature_2m[i] }}
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const tempData = ref(undefined);
const currentWeather = ref(undefined);
const cityName = ref("");
const latitude = ref(undefined);
const longitude = ref(undefined);

// function getLocation() {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(function (position) {
//       position.coords.latitude + position.coords.longitude;
//     });
//   } else {
//     alert("Geo Location not supported on this device");
//   }
// }

async function getForecast() {
  const weatherForecast = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude.value}&lon=${longitude.value}&appid=c3e7d4b44bd41c743b5e4c019926a500`
  );
}

async function getLocation() {
  const directGeocode = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${cityName.value}&appid=c3e7d4b44bd41c743b5e4c019926a500`
  ).then((response) => response.json());

  console.log(directGeocode);
  // This api returns an array with a name 0 and since we only want the lat and lon values, therefore pulling them out and assigning them the correct values.
  const { lat, lon } = directGeocode[0];

  return { lat, lon };
}
getLocation();

async function getTemperature() {
  // Have to declare here since the lat and lon variables are not global but limited to getLocation() function
  const { lat, lon } = await getLocation();
  const weatherData = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=c3e7d4b44bd41c743b5e4c019926a500`
  ).then((response) => response.json());
  console.log(weatherData);
  currentWeather.value = weatherData.main.temp;
  tempData.value = weatherData.hourly;
}

// Run the function immediately on page load
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
  margin-bottom: 15%;
}

.box {
  opacity: 0.4;
}
</style>
