<script setup>
import { useAuthStore } from '@/stores/auth'
import AppNavbar from '@/components/AppNavbar.vue'

const auth = useAuthStore()
</script>

<template>
  <div class="app-shell">
    <AppNavbar v-if="auth.isAuthenticated" />
    <RouterView />
  </div>
</template>
