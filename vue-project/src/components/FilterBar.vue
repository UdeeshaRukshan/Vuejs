<script setup>
const filters = defineModel({ type: Object, required: true })
defineProps({ categories: { type: Array, default: () => [] } })
const emit = defineEmits(['apply', 'clear'])
</script>

<template>
  <form class="card border-0 shadow-sm mb-4" @submit.prevent="emit('apply')">
    <div class="card-body">
      <div class="row g-3 align-items-end">
        <div class="col-lg-4">
          <label class="form-label" for="search">Search notes</label>
          <div class="input-group">
            <span class="input-group-text bg-white"><i class="bi bi-search"></i></span>
            <input id="search" v-model="filters.search" class="form-control border-start-0" placeholder="Title, note, or code..." />
          </div>
        </div>
        <div class="col-sm-6 col-lg-3">
          <label class="form-label" for="category">Category</label>
          <select id="category" v-model="filters.categoryId" class="form-select">
            <option value="">All categories</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
          </select>
        </div>
        <div class="col-sm-6 col-lg-2">
          <label class="form-label" for="from">From</label>
          <input id="from" v-model="filters.from" class="form-control" type="date" :max="filters.to || undefined" />
        </div>
        <div class="col-sm-6 col-lg-2">
          <label class="form-label" for="to">To</label>
          <input id="to" v-model="filters.to" class="form-control" type="date" :min="filters.from || undefined" />
        </div>
        <div class="col-sm-6 col-lg-1 d-grid">
          <button class="btn btn-primary" type="submit" aria-label="Apply filters"><i class="bi bi-funnel"></i></button>
        </div>
      </div>
      <button class="btn btn-link btn-sm px-0 mt-2 text-decoration-none" type="button" @click="emit('clear')">
        Clear all filters
      </button>
    </div>
  </form>
</template>
