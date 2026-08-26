<script setup>
defineProps({ entry: { type: Object, required: true } })

function formatDate(value) {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(value))
}
</script>

<template>
  <article class="card entry-card h-100 border-0 shadow-sm">
    <div class="card-body d-flex flex-column">
      <div class="d-flex align-items-start justify-content-between gap-3 mb-3">
        <span class="category-badge" :style="{ '--category-colour': entry.category.color }">
          {{ entry.category.name }}
        </span>
        <time class="small text-secondary text-nowrap" :datetime="entry.learnedAt.slice(0, 10)">
          {{ formatDate(entry.learnedAt) }}
        </time>
      </div>
      <h2 class="h5 mb-2">{{ entry.title }}</h2>
      <p class="text-secondary entry-preview mb-3">{{ entry.content }}</p>
      <pre v-if="entry.codeSnippet" class="code-preview"><code>{{ entry.codeSnippet }}</code></pre>
      <div class="mt-auto pt-2 d-flex justify-content-between align-items-center">
        <RouterLink class="stretched-link fw-semibold text-decoration-none" :to="{ name: 'entry-detail', params: { id: entry.id } }">
          View notes <i class="bi bi-arrow-right ms-1"></i>
        </RouterLink>
        <RouterLink class="position-relative btn btn-sm btn-light" :to="{ name: 'entry-edit', params: { id: entry.id } }" aria-label="Edit entry">
          <i class="bi bi-pencil"></i>
        </RouterLink>
      </div>
    </div>
  </article>
</template>
