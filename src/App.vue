<template>
  <div id="app">
    <Search />
    <RouterView />
  </div>
</template>

<script setup>
import Search from "./components/Search.vue";
import { RouterView } from "vue-router";
</script>

<style>
#app {
  background-image: url("./assets/weather-bg.jpg");
  height: 100vh;
}
</style>
