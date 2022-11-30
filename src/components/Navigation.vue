<template>
  <div class="container is-max-desktop">
    <div class="notification px-5 has-text-centered">
      <span class="icon-text">
        <span class="icon">
          <i class="fa-solid fa-sun"></i>
        </span>
        <span>Shelby Vue Weather</span>
      </span>
    </div>
  </div>

  <div class="field has-addons has-addons-centered">
    <div class="control">
      <input class="input" type="text" placeholder="Search for City/Country" />
    </div>
    <div class="control">
      <a class="button is-info" @click="twoHourForecast"> Search </a>
    </div>
  </div>

  <div class="weather-info has-text-centered">
    <div class="location">
      <div class="dropdown is-hoverable">
        <div class="dropdown-trigger">
          <button
            class="button"
            aria-haspopup="true"
            aria-controls="dropdown-menu4"
          >
            <span>Area/Town</span>
            <span class="icon is-small">
              <i class="fas fa-angle-down" aria-hidden="true"></i>
            </span>
          </button>
        </div>
        <div class="dropdown-menu" id="dropdown-menu4" role="menu">
          <div class="dropdown-content">
            <div class="dropdown-item">
              <p>Input meta data from api here to choose towns</p>
            </div>
          </div>
        </div>
      </div>
      , {{ weather.country }}
    </div>
    <div class="date">
      {{
        new Intl.DateTimeFormat("default", {
          day: "2-digit",
          weekday: "long",
          month: "long",
          year: "numeric",
        }).format(time)
      }}
    </div>
    <div class="temp">25°C</div>
    <div class="weather">Rain</div>
  </div>

  <box class="box has-text-centered is-transparent">2 hour forecast</box>
</template>

<script setup>
import { ref, reactive } from "vue";
let time = ref(new Date());

const weather = reactive({
  area: "Jurong",
  country: "Singapore",
});

function twoHourForecast() {
  fetch("https://api.data.gov.sg/v1/environment/2-hour-weather-forecast")
    .then((response) => response.json())
    .then((data) => console.log(data));
}
twoHourForecast();
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
