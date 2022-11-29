<script setup>
function twoHourForecast() {
  fetch('https://api.data.gov.sg/v1/environment/2-hour-weather-forecast')
    .then((response) => response.json())
    .then((data) => console.log(data));

}
twoHourForecast()
</script>

<template>
  <main>

  </main>
</template>
