<template>
  <main class="center">
    <header class="header">
      <router-link to="/">
        <h1>Users Profile</h1>
      </router-link>
    </header>
    <router-view />
  </main>
</template>

<script lang="ts" setup>
import { RouterView, RouterLink } from 'vue-router'
</script>

<style scoped>
.header {
  display: flex;
  justify-content: start;
}
a {
  text-decoration: none;
  color: var(--brand-neutral-black);
}
</style>
