<script setup>
import { reactive, ref } from 'vue'
import { apiMessage } from '@/services/api'
import { useCategoryStore } from '@/stores/categories'

const store = useCategoryStore()
const form = reactive({ name: '', color: '#0d6efd' })
const editingId = ref(null)
const error = ref('')
const saving = ref(false)

function edit(category) {
  editingId.value = category.id
  form.name = category.name
  form.color = category.color
  error.value = ''
}

function reset() {
  editingId.value = null
  form.name = ''
  form.color = '#0d6efd'
  error.value = ''
}

async function save() {
  saving.value = true
  error.value = ''
  try {
    if (editingId.value) await store.updateCategory(editingId.value, form)
    else await store.createCategory(form)
    reset()
  } catch (requestError) {
    error.value = apiMessage(requestError)
  } finally {
    saving.value = false
  }
}

async function remove(category) {
  if (!window.confirm(`Delete the “${category.name}” category?`)) return
  error.value = ''
  try {
    await store.deleteCategory(category.id)
  } catch (requestError) {
    error.value = apiMessage(requestError)
  }
}
</script>

<template>
  <div class="offcanvas offcanvas-end" tabindex="-1" id="categoryManager" aria-labelledby="categoryManagerLabel">
    <div class="offcanvas-header">
      <div>
        <h2 class="offcanvas-title h5 mb-1" id="categoryManagerLabel">Categories</h2>
        <p class="text-secondary small mb-0">Keep your learning library organised.</p>
      </div>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
      <div v-if="error" class="alert alert-danger py-2" role="alert">{{ error }}</div>
      <form class="card bg-light border-0 mb-4" @submit.prevent="save">
        <div class="card-body">
          <h3 class="h6">{{ editingId ? 'Edit category' : 'Add a category' }}</h3>
          <div class="row g-2">
            <div class="col">
              <label class="visually-hidden" for="categoryName">Category name</label>
              <input id="categoryName" v-model.trim="form.name" class="form-control" placeholder="e.g. Testing" maxlength="50" required />
            </div>
            <div class="col-auto">
              <label class="visually-hidden" for="categoryColor">Colour</label>
              <input id="categoryColor" v-model="form.color" class="form-control form-control-color" type="color" title="Category colour" />
            </div>
            <div class="col-auto">
              <button class="btn btn-primary" :disabled="saving" type="submit">
                <span v-if="saving" class="spinner-border spinner-border-sm"></span>
                <i v-else class="bi" :class="editingId ? 'bi-check-lg' : 'bi-plus-lg'"></i>
              </button>
            </div>
          </div>
          <button v-if="editingId" class="btn btn-link btn-sm px-0" type="button" @click="reset">Cancel editing</button>
        </div>
      </form>

      <div v-if="!store.categories.length" class="text-center text-secondary py-4">No categories yet.</div>
      <div v-for="category in store.categories" :key="category.id" class="category-row d-flex align-items-center gap-3 py-3 border-bottom">
        <span class="category-dot" :style="{ backgroundColor: category.color }"></span>
        <div class="flex-grow-1">
          <div class="fw-semibold">{{ category.name }}</div>
          <div class="small text-secondary">{{ category._count.entries }} {{ category._count.entries === 1 ? 'entry' : 'entries' }}</div>
        </div>
        <button class="btn btn-sm btn-light" type="button" :aria-label="`Edit ${category.name}`" @click="edit(category)"><i class="bi bi-pencil"></i></button>
        <button class="btn btn-sm btn-light text-danger" type="button" :aria-label="`Delete ${category.name}`" @click="remove(category)"><i class="bi bi-trash"></i></button>
      </div>
    </div>
  </div>
</template>
