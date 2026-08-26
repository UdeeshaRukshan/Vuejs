<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const form = reactive({ name: '', email: '', password: '' })

async function submit() {
  try {
    await auth.register(form)
    router.push({ name: 'dashboard' })
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
        <h1 class="h3 mb-2">Start tracking what you learn</h1>
        <p class="text-secondary mb-4">Your first set of developer categories will be ready automatically.</p>
        <div v-if="auth.error" class="alert alert-danger" role="alert">{{ auth.error }}</div>
        <form @submit.prevent="submit">
          <div class="mb-3">
            <label class="form-label" for="name">Name</label>
            <input id="name" v-model.trim="form.name" class="form-control form-control-lg" autocomplete="name" minlength="2" maxlength="80" required />
          </div>
          <div class="mb-3">
            <label class="form-label" for="email">Email address</label>
            <input id="email" v-model.trim="form.email" class="form-control form-control-lg" type="email" autocomplete="email" required />
          </div>
          <div class="mb-4">
            <label class="form-label" for="password">Password</label>
            <input id="password" v-model="form.password" class="form-control form-control-lg" type="password" autocomplete="new-password" minlength="8" required />
            <div class="form-text">Use at least 8 characters.</div>
          </div>
          <button class="btn btn-primary btn-lg w-100" :disabled="auth.loading" type="submit">
            <span v-if="auth.loading" class="spinner-border spinner-border-sm me-2"></span>Create account
          </button>
        </form>
        <p class="text-center text-secondary mt-4 mb-0">
          Already have an account? <RouterLink :to="{ name: 'login' }">Log in</RouterLink>
        </p>
      </div>
    </div>
  </main>
</template>
