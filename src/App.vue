<template>
  <div id="app">
    <Navigation />
    <RouterView />
  </div>
</template>

<script setup>
import Navigation from "./components/Navigation.vue";
import { RouterView } from "vue-router";
</script>

<style>
#app {
  background-image: url("./assets/weather-bg.jpg");
  height: 100vh;
}
</style>
