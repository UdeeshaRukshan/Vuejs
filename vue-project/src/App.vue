<script setup>
import { ref } from 'vue'
import MainPage from './pages/MainPage.vue'

const showMainPage = ref(false)
</script>

<template>
  <MainPage v-if="showMainPage" />

  <template v-else>
    <h1>You did it!</h1>
    <p>
      Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
      documentation
    </p>
    <button class="btn btn-primary" type="button" @click="showMainPage = true">
      <i class="bi bi-plus-circle"></i>
    </button>
  </template>
</template>

<style scoped></style>
