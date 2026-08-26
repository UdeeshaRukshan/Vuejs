<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiMessage } from '@/services/api'
import { useEntryStore } from '@/stores/entries'

const route = useRoute()
const router = useRouter()
const store = useEntryStore()
const error = ref('')
const deleting = ref(false)

function formatDate(value) {
  return new Intl.DateTimeFormat('en', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(value))
}

async function remove() {
  if (!window.confirm('Delete this learning entry? This cannot be undone.')) return
  deleting.value = true
  try {
    await store.deleteEntry(route.params.id)
    router.push({ name: 'dashboard' })
  } catch (requestError) {
    error.value = apiMessage(requestError)
    deleting.value = false
  }
}

onMounted(async () => {
  try {
    await store.fetchEntry(route.params.id)
  } catch (requestError) {
    error.value = apiMessage(requestError)
  }
})
</script>

<template>
  <main class="container py-4 py-lg-5 detail-page">
    <RouterLink class="back-link text-decoration-none" :to="{ name: 'dashboard' }"><i class="bi bi-arrow-left me-2"></i>All entries</RouterLink>
    <div v-if="error" class="alert alert-danger mt-4" role="alert">{{ error }}</div>
    <div v-if="store.loading" class="text-center py-5"><div class="spinner-border text-primary"></div></div>
    <article v-else-if="store.currentEntry" class="card border-0 shadow-sm mt-4">
      <div class="card-body p-4 p-lg-5">
        <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
          <div>
            <span class="category-badge mb-3" :style="{ '--category-colour': store.currentEntry.category.color }">{{ store.currentEntry.category.name }}</span>
            <h1 class="display-6 fw-bold mb-2">{{ store.currentEntry.title }}</h1>
            <time class="text-secondary" :datetime="store.currentEntry.learnedAt.slice(0, 10)">Learned on {{ formatDate(store.currentEntry.learnedAt) }}</time>
          </div>
          <div class="d-flex gap-2 align-self-md-start">
            <RouterLink class="btn btn-outline-primary" :to="{ name: 'entry-edit', params: { id: store.currentEntry.id } }"><i class="bi bi-pencil me-2"></i>Edit</RouterLink>
            <button class="btn btn-outline-danger" :disabled="deleting" type="button" @click="remove"><i class="bi bi-trash me-2"></i>Delete</button>
          </div>
        </div>
        <div class="notes-content">{{ store.currentEntry.content }}</div>
        <div v-if="store.currentEntry.codeSnippet" class="mt-5">
          <h2 class="h6 text-uppercase text-secondary mb-3">Code or command</h2>
          <pre class="code-block"><code>{{ store.currentEntry.codeSnippet }}</code></pre>
        </div>
      </div>
    </article>
  </main>
</template>
