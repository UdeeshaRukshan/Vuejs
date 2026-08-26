import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import api, { apiMessage } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const initialized = ref(false)
  const loading = ref(false)
  const error = ref('')
  const isAuthenticated = computed(() => Boolean(user.value))

  async function restoreSession() {
    try {
      const { data } = await api.get('/auth/me')
      user.value = data.user
    } catch {
      user.value = null
    } finally {
      initialized.value = true
    }
  }

  async function login(credentials) {
    loading.value = true
    error.value = ''
    try {
      const { data } = await api.post('/auth/login', credentials)
      user.value = data.user
    } catch (requestError) {
      error.value = apiMessage(requestError)
      throw requestError
    } finally {
      loading.value = false
    }
  }

  async function register(payload) {
    loading.value = true
    error.value = ''
    try {
      const { data } = await api.post('/auth/register', payload)
      user.value = data.user
    } catch (requestError) {
      error.value = apiMessage(requestError)
      throw requestError
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await api.post('/auth/logout')
    } finally {
      user.value = null
    }
  }

  return { user, initialized, loading, error, isAuthenticated, restoreSession, login, register, logout }
})
