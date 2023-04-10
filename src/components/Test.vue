<script setup>
import { ref, computed } from "vue";

// Global variables required to be used for global scope.
const API_KEY = import.meta.env.VITE_APP_API_KEY;
const today = new Date();

/**
 * We just need the next 3 days of the week to be displayed.
 * Therefore we loop through the today variable to generate
 * an array of the next 3 days from today. Since this only
 * happens once when today changes, we use a computed func
 * so as to only call this func when there is a change.
 */
const getDays = computed(() => {
  const formatter = new Intl.DateTimeFormat("default", { weekday: "short" });
  const days = [];
  for (let i = 0; i < 4; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push(formatter.format(date));
  }
  return days;
});

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

let inputLocation = ref("");
let city = ref("");
let countryName = ref("");
async function getLocation() {
  const directGeocode = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${inputLocation.value}&appid=${API_KEY}`
  ).then((response) => response.json());

  // This api returns an array with a name 0 and since we only want the lat and lon values, therefore pulling them out and assigning them the correct values.
  const { lat, lon, name, country } = directGeocode[0];

  city.value = name;
  countryName.value = country;

  return { lat, lon };
}

const dtValues = [
  today.getTime() / 1000, // current time
  today.getTime() / 1000 + 86400, // 24 hr later
  today.getTime() / 1000 + 172800, // 48 hr later
  today.getTime() / 1000 + 259200, // 72 hr later
];
// Corresponds to a 1.5hr range in seconds.
const range = ref(5400);

// tempForecast becomes the array which we require to loop through to get the forecast data we need.
let tempForecast = ref([]);
async function getForecast(lat, lon) {
  const weatherForecast = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  ).then((response) => response.json());

  const filteredData = weatherForecast.list.filter((item) => {
    for (const dtValue of dtValues) {
      if (item.dt >= dtValue - range && item.dt <= dtValue + range) {
        return true;
      }
    }
    return false;
  });

  tempForecast.value = filteredData;
  console.log(filteredData);
}

let currentTemp = ref(undefined);
let windData = ref(undefined);
let currentWeather = ref(undefined);

async function getWeather(lat, lon) {
  const weatherData = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  ).then((response) => response.json());
  currentTemp.value = weatherData.main;
  currentWeather.value = weatherData.weather[0];
  windData.value = weatherData.wind;
}
</script>

<template>
  <div class="container">
    <div class="columns is-desktop is-align-items-center">
      <div class="column is-half">
        <div class="weather-side">
          <div class="weather-gradient"></div>
          <div class="date-container">
            <h2 class="is-size-4">
              {{
                new Intl.DateTimeFormat("default", {
                  weekday: "long",
                }).format(today)
              }}
            </h2>
            <span class="is-block is-size-5">{{
              new Intl.DateTimeFormat("default", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }).format(today)
            }}</span>
            <div class="is-flex is-align-items-center">
              <i class="fas fa-map-marker-alt"></i>
              <span v-if="city" class="is-inline-block is-size-4 my-4 ml-3"
                >{{ city }}, {{ countryName }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <div class="column is-half"></div>
    </div>
  </div>

  <div
    class="containers is-flex is-align-items-center is-justify-content-center"
  >
    <div class="weather-side">
      <div class="weather-gradient"></div>

      <div class="date-container">
        <h2 class="is-size-4">
          {{
            new Intl.DateTimeFormat("default", {
              weekday: "long",
            }).format(today)
          }}
        </h2>
        <span class="is-block is-size-5">{{
          new Intl.DateTimeFormat("default", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).format(today)
        }}</span>
        <div class="is-flex is-align-items-center">
          <i class="fas fa-map-marker-alt"></i>
          <span v-if="city" class="is-inline-block is-size-4 my-4 ml-3"
            >{{ city }}, {{ countryName }}</span
          >
        </div>
      </div>

      <!-- !== Means strict inequality, so if the currentTemp is defined when the API is fetched, we want the div below to show value. -->

      <div class="weather-container" v-if="currentTemp !== undefined">
        <!-- https://fontawesome.com/icons/categories/weather
        Below icon tag to be rendered conditionally depending on the weather returned from data -->
        <i class="fa-solid fa-cloud"></i>
        <h1 class="is-size-1 has-text-weight-bold">{{ currentTemp.temp }}°C</h1>
        <h3 class="has-text-weight-semibold">{{ currentWeather.main }}</h3>
      </div>
    </div>

    <div class="info-side">
      <div class="today-info">
        <div class="columns is-mobile is-vcentered">
          <div class="column">
            <span class="title has-text-white">Humidity</span>
          </div>
          <div class="column is-narrow" v-if="currentTemp !== undefined">
            <span>{{ currentTemp.humidity }} %</span>
          </div>
        </div>

        <div class="columns is-mobile is-vcentered">
          <div class="column">
            <span class="title has-text-white">Wind</span>
          </div>
          <div class="column is-narrow" v-if="windData !== undefined">
            <span>{{ windData.speed }} km/h</span>
          </div>
        </div>
      </div>

      <div class="week-container">
        <ul class="week-list" v-if="currentTemp !== undefined">
          <li
            v-for="(day, index) in getDays"
            :key="index"
            :class="{ active: index === 0 }"
          >
            <!-- 
                https://fontawesome.com/icons/categories/weather
                Below icon tag to be rendered conditionally depending on the weather returned from data -->
            <i></i>
            <span class="day-name">{{ day }}</span>
            <span class="day-temp">{{ currentTemp.temp }}°C</span>
          </li>
        </ul>
      </div>

      <div class="field px-5 has-addons">
        <div class="control has-icons-left is-expanded">
          <input
            type="text"
            placeholder="Enter Location"
            class="input is-rounded is-link"
            v-model="inputLocation"
            @keyup.enter="getData"
          />
          <span class="icon is-left">
            <i class="fas fa-map-marker-alt"></i>
          </span>
        </div>

        <div class="control">
          <input
            @click="getData"
            class="button is-link is-light is-rounded is-outlined"
            type="submit"
            value="Search"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Montserrat:400,700,900&display=swap");

* {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  line-height: 1.25em;
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
  background-image: linear-gradient(135deg, #72edf2 10%, #5151e5 100%);
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
</style>
