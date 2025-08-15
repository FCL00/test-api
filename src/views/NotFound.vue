<template>
  <main class="container">
    <h1>NOT FOUND</h1>
    <router-link to="/">&LeftArrow; GO BACK</router-link>
  </main>
</template>

<script lang="ts" setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
}
</style>
