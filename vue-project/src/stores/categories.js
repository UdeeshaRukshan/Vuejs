import { ref } from 'vue'
import { defineStore } from 'pinia'
import api, { apiMessage } from '@/services/api'

export const useCategoryStore = defineStore('categories', () => {
  const categories = ref([])
  const loading = ref(false)
  const error = ref('')

  async function fetchCategories() {
    loading.value = true
    error.value = ''
    try {
      const { data } = await api.get('/categories')
      categories.value = data.categories
    } catch (requestError) {
      error.value = apiMessage(requestError)
    } finally {
      loading.value = false
    }
  }

  async function createCategory(payload) {
    const { data } = await api.post('/categories', payload)
    categories.value = [...categories.value, data.category].sort((a, b) => a.name.localeCompare(b.name))
  }

  async function updateCategory(id, payload) {
    const { data } = await api.put(`/categories/${id}`, payload)
    categories.value = categories.value
      .map((category) => (category.id === id ? data.category : category))
      .sort((a, b) => a.name.localeCompare(b.name))
  }

  async function deleteCategory(id) {
    await api.delete(`/categories/${id}`)
    categories.value = categories.value.filter((category) => category.id !== id)
  }

  return { categories, loading, error, fetchCategories, createCategory, updateCategory, deleteCategory }
})
