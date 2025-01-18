<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';

// Définition des liens de navigation
const links = [
  { name: 'NoteList', label: '', to: { name: 'noteList' } },
];
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <!-- Générer les liens de navigation -->
        <div v-for="link in links" :key="link.name">
          <RouterLink :to="link.to" class="nav-link">
            {{ link.label }}
          </RouterLink>
        </div>
      </nav>
    </div>
  </header>

  <!-- Affichage des vues liées à la navigation -->
  <RouterView />
</template>

<style scoped>
/* Global styles pour centrer l'application */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body, html {
  height: 100%;
  display: flex;
  justify-content: center;  /* Centre horizontalement */
  align-items: center;      /* Centre verticalement */
  font-family: Arial, sans-serif;
}

/* Style du header */
header {
  width: 100%;
  max-width: 1200px;        /* Limite la largeur du header */
  line-height: 1.5;
  text-align: center;
}

/* Conteneur de la navigation centré */
.wrapper {
  width: 100%;
  display: flex;
  justify-content: center;  /* Centre horizontalement */
}

/* Style de la barre de navigation */
nav {
  font-size: 14px;
  display: flex;
  justify-content: center;  /* Centre horizontalement */
  text-align: center;
  width: 100%;
  margin-top: 2rem;
}

/* Style des liens de navigation */
.nav-link {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
  text-decoration: none;
  color: inherit;
}

/* Retirer la bordure du premier lien */
.nav-link:first-of-type {
  border: 0;
}

/* Styles spécifiques pour les écrans larges */
@media (min-width: 1024px) {
  header {
    display: flex;
    flex-direction: column;  /* Centrer le contenu sur de grandes résolutions */
    place-items: center;
  }

  nav {
    text-align: left;
    font-size: 1rem;
    margin-left: 0;  /* Retirer l'alignement de texte à gauche */
    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
