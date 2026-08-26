<script setup>
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const form = reactive({ email: '', password: '' })

async function submit() {
  try {
    await auth.login(form)
    router.push(typeof route.query.redirect === 'string' ? route.query.redirect : '/')
  } catch {
    // The store exposes a friendly error message.
  }
}
</script>

<template>
  <main class="auth-page">
    <div class="auth-card card border-0 shadow-lg">
      <div class="card-body p-4 p-md-5">
        <div class="brand-mark brand-mark-lg mb-4"><i class="bi bi-journal-code"></i></div>
        <h1 class="h3 mb-2">Welcome back</h1>
        <p class="text-secondary mb-4">Continue building your personal learning library.</p>
        <div v-if="auth.error" class="alert alert-danger" role="alert">{{ auth.error }}</div>
        <form @submit.prevent="submit">
          <div class="mb-3">
            <label class="form-label" for="email">Email address</label>
            <input id="email" v-model.trim="form.email" class="form-control form-control-lg" type="email" autocomplete="email" required />
          </div>
          <div class="mb-4">
            <label class="form-label" for="password">Password</label>
            <input id="password" v-model="form.password" class="form-control form-control-lg" type="password" autocomplete="current-password" minlength="8" required />
          </div>
          <button class="btn btn-primary btn-lg w-100" :disabled="auth.loading" type="submit">
            <span v-if="auth.loading" class="spinner-border spinner-border-sm me-2"></span>Log in
          </button>
        </form>
        <p class="text-center text-secondary mt-4 mb-0">
          New here? <RouterLink :to="{ name: 'register' }">Create an account</RouterLink>
        </p>
      </div>
    </div>
  </main>
</template>
