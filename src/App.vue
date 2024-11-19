<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';

const links = [
  { name: 'NoteList', label: 'All Notes', to: { name: 'noteList' } },
];
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <div v-for="link in links" :key="link.name">
          <RouterLink :to="link.to" class="nav-link">{{ link.label }}</RouterLink>
        </div>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

nav {
  width: 100%;
  font-size: 14px;
  text-align: center;
  margin-top: 2rem;
}

.nav-link {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

.nav-link:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;
    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
