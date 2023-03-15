<template>
  <div>
    <Test />
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import Test from "./components/Test.vue";
</script>
