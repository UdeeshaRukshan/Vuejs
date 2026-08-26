<script setup>
import { onMounted, reactive } from 'vue'
import CategoryManager from '@/components/CategoryManager.vue'
import EntryCard from '@/components/EntryCard.vue'
import FilterBar from '@/components/FilterBar.vue'
import { useCategoryStore } from '@/stores/categories'
import { useEntryStore } from '@/stores/entries'

const categoryStore = useCategoryStore()
const entryStore = useEntryStore()
const filters = reactive({ search: '', categoryId: '', from: '', to: '' })

async function loadEntries() {
  await entryStore.fetchEntries(filters)
}

function clearFilters() {
  Object.assign(filters, { search: '', categoryId: '', from: '', to: '' })
  loadEntries()
}

onMounted(() => Promise.all([categoryStore.fetchCategories(), loadEntries()]))
</script>

<template>
  <main class="container py-4 py-lg-5">
    <header class="d-flex flex-column flex-md-row align-items-md-end justify-content-between gap-3 mb-4">
      <div>
        <p class="eyebrow mb-2">Your knowledge base</p>
        <h1 class="display-6 fw-bold mb-2">Things I’ve learned</h1>
        <p class="text-secondary mb-0">Capture today’s discoveries. Find them when you need them.</p>
      </div>
      <button class="btn btn-outline-secondary align-self-start" type="button" data-bs-toggle="offcanvas" data-bs-target="#categoryManager" aria-controls="categoryManager">
        <i class="bi bi-tags me-2"></i>Manage categories
      </button>
    </header>

    <FilterBar v-model="filters" :categories="categoryStore.categories" @apply="loadEntries" @clear="clearFilters" />

    <div v-if="entryStore.error" class="alert alert-danger" role="alert">{{ entryStore.error }}</div>
    <div v-if="entryStore.loading" class="text-center py-5" aria-live="polite">
      <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading entries</span></div>
    </div>

    <div v-else-if="entryStore.entries.length" class="row g-4">
      <div v-for="entry in entryStore.entries" :key="entry.id" class="col-md-6 col-xl-4">
        <EntryCard :entry="entry" />
      </div>
    </div>

    <section v-else class="empty-state card border-0 shadow-sm text-center">
      <div class="card-body p-5">
        <div class="empty-icon mx-auto mb-3"><i class="bi bi-lightbulb"></i></div>
        <h2 class="h4">No learning entries found</h2>
        <p class="text-secondary mb-4">Add your first note or clear the filters to see everything.</p>
        <RouterLink class="btn btn-primary" :to="{ name: 'entry-new' }"><i class="bi bi-plus-lg me-2"></i>Add an entry</RouterLink>
      </div>
    </section>

    <CategoryManager />
  </main>
</template>
