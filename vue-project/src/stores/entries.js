import { ref } from 'vue'
import { defineStore } from 'pinia'
import api, { apiMessage } from '@/services/api'

export const useEntryStore = defineStore('entries', () => {
  const entries = ref([])
  const currentEntry = ref(null)
  const loading = ref(false)
  const error = ref('')

  async function fetchEntries(filters = {}) {
    loading.value = true
    error.value = ''
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value))
      const { data } = await api.get('/entries', { params })
      entries.value = data.entries
    } catch (requestError) {
      error.value = apiMessage(requestError)
    } finally {
      loading.value = false
    }
  }

  async function fetchEntry(id) {
    loading.value = true
    error.value = ''
    try {
      const { data } = await api.get(`/entries/${id}`)
      currentEntry.value = data.entry
      return data.entry
    } catch (requestError) {
      error.value = apiMessage(requestError)
      throw requestError
    } finally {
      loading.value = false
    }
  }

  async function saveEntry(payload, id) {
    const { data } = id
      ? await api.put(`/entries/${id}`, payload)
      : await api.post('/entries', payload)
    currentEntry.value = data.entry
    return data.entry
  }

  async function deleteEntry(id) {
    await api.delete(`/entries/${id}`)
    entries.value = entries.value.filter((entry) => entry.id !== id)
    if (currentEntry.value?.id === id) currentEntry.value = null
  }

  return { entries, currentEntry, loading, error, fetchEntries, fetchEntry, saveEntry, deleteEntry }
})
