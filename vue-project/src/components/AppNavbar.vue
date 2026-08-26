<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

async function logout() {
  await auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
    <div class="container">
      <RouterLink class="navbar-brand fw-semibold d-flex align-items-center gap-2" to="/">
        <span class="brand-mark"><i class="bi bi-journal-code"></i></span>
        Learning Tracker
      </RouterLink>
      <div class="d-flex align-items-center gap-3">
        <span class="d-none d-md-inline text-white-50">Hi, {{ auth.user?.name }}</span>
        <RouterLink class="btn btn-primary btn-sm" :to="{ name: 'entry-new' }">
          <i class="bi bi-plus-lg me-1"></i>New entry
        </RouterLink>
        <button class="btn btn-outline-light btn-sm" type="button" @click="logout">
          <i class="bi bi-box-arrow-right"></i><span class="d-none d-sm-inline ms-1">Log out</span>
        </button>
      </div>
    </div>
  </nav>
</template>
