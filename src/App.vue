<template>
  <div>
    <Search />
    <RouterView />
  </div>
</template>

<script setup>
import Search from "./components/Search.vue";
import { RouterView } from "vue-router";
</script>
