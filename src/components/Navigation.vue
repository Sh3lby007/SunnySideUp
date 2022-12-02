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
    <div class="control">
      <input class="input" type="text" placeholder="Search for City/Country" />
    </div>
    <div class="control">
      <a class="button is-info" @click="getForecast"> Search </a>
    </div>

    <div class="control">
      <a class="button is-info" @click="getTemperature"> temp</a>
    </div>
  </div>

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
        }).format(new Date(currentWeather.time))
      }}
    </div>
    <div class="temp">{{ currentWeather.temperature }}°C</div>
    <div class="weather is-size-2">
      Windspeed - {{ currentWeather.windspeed }}km/h
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

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      position.coords.latitude + position.coords.longitude;
    });
  } else {
    alert("Geo Location not supported on this device");
  }
}

async function getTemperature() {
  const weatherData = await fetch(
    "https://api.open-meteo.com/v1/forecast?current_weather=true&latitude=1.3521&longitude=103.8198&hourly=temperature_2m&timezone=Asia%2FSingapore"
  )
    .then((response) => response.json())
    .then((data) => (console.log(data), data));

  currentWeather.value = weatherData.current_weather;
  tempData.value = weatherData.hourly;
}

// Run the function immediately on page load
getTemperature();
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
