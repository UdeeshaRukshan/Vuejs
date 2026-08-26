<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiMessage } from '@/services/api'
import { useCategoryStore } from '@/stores/categories'
import { useEntryStore } from '@/stores/entries'

const route = useRoute()
const router = useRouter()
const categoryStore = useCategoryStore()
const entryStore = useEntryStore()
const entryId = computed(() => route.params.id)
const isEditing = computed(() => Boolean(entryId.value))
const saving = ref(false)
const pageLoading = ref(false)
const error = ref('')
const form = reactive({
  title: '',
  content: '',
  codeSnippet: '',
  learnedAt: new Date().toISOString().slice(0, 10),
  categoryId: '',
})

onMounted(async () => {
  pageLoading.value = true
  try {
    await categoryStore.fetchCategories()
    if (isEditing.value) {
      const entry = await entryStore.fetchEntry(entryId.value)
      Object.assign(form, {
        title: entry.title,
        content: entry.content,
        codeSnippet: entry.codeSnippet || '',
        learnedAt: entry.learnedAt.slice(0, 10),
        categoryId: entry.categoryId,
      })
    } else if (categoryStore.categories.length) {
      form.categoryId = categoryStore.categories[0].id
    }
  } catch (requestError) {
    error.value = apiMessage(requestError)
  } finally {
    pageLoading.value = false
  }
})

async function submit() {
  saving.value = true
  error.value = ''
  try {
    const entry = await entryStore.saveEntry(form, entryId.value)
    router.push({ name: 'entry-detail', params: { id: entry.id } })
  } catch (requestError) {
    error.value = apiMessage(requestError)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <main class="container py-4 py-lg-5 form-page">
    <RouterLink class="back-link text-decoration-none" :to="isEditing ? { name: 'entry-detail', params: { id: entryId } } : { name: 'dashboard' }">
      <i class="bi bi-arrow-left me-2"></i>Back
    </RouterLink>
    <div class="card border-0 shadow-sm mt-4">
      <div class="card-body p-4 p-lg-5">
        <h1 class="h2 mb-2">{{ isEditing ? 'Edit learning entry' : 'Add what you learned' }}</h1>
        <p class="text-secondary mb-4">Write enough context so your future self can use it.</p>
        <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
        <div v-if="pageLoading" class="text-center py-5"><div class="spinner-border text-primary"></div></div>
        <form v-else @submit.prevent="submit">
          <div class="mb-4">
            <label class="form-label" for="title">Title</label>
            <input id="title" v-model.trim="form.title" class="form-control form-control-lg" maxlength="160" placeholder="e.g. Revert a merge commit safely" required />
          </div>
          <div class="row g-4 mb-4">
            <div class="col-md-6">
              <label class="form-label" for="category">Category</label>
              <select id="category" v-model="form.categoryId" class="form-select" required>
                <option disabled value="">Choose a category</option>
                <option v-for="category in categoryStore.categories" :key="category.id" :value="category.id">{{ category.name }}</option>
              </select>
              <div v-if="!categoryStore.categories.length" class="form-text text-danger">Create a category from the dashboard first.</div>
            </div>
            <div class="col-md-6">
              <label class="form-label" for="learnedAt">Date learned</label>
              <input id="learnedAt" v-model="form.learnedAt" class="form-control" type="date" required />
            </div>
          </div>
          <div class="mb-4">
            <label class="form-label" for="content">Notes</label>
            <textarea id="content" v-model.trim="form.content" class="form-control" rows="8" maxlength="20000" placeholder="Explain the idea, when to use it, and anything easy to forget..." required></textarea>
          </div>
          <div class="mb-4">
            <label class="form-label" for="codeSnippet">Command or code <span class="text-secondary fw-normal">(optional)</span></label>
            <textarea id="codeSnippet" v-model="form.codeSnippet" class="form-control code-input" rows="7" maxlength="20000" spellcheck="false" placeholder="git revert -m 1 &lt;merge-commit-sha&gt;"></textarea>
          </div>
          <div class="d-flex justify-content-end gap-2">
            <RouterLink class="btn btn-light" :to="{ name: 'dashboard' }">Cancel</RouterLink>
            <button class="btn btn-primary" :disabled="saving || !categoryStore.categories.length" type="submit">
              <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>{{ isEditing ? 'Save changes' : 'Save entry' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>
