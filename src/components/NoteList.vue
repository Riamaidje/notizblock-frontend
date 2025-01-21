<template>
  <div class="app" :class="{ 'dark-theme': isDarkTheme }">
    <!-- Navigation -->
    <nav class="navbar">
      <button
        @click="currentPage = 'home'"
        :class="{ active: currentPage === 'home' }"
        class="nav-button"
      >{{ translations.home }}</button>
      <button
        @click="currentPage = 'notizblock'"
        :class="{ active: currentPage === 'notizblock' }"
        class="nav-button"
      >{{ translations.myNotes }}</button>
      <button
        @click="currentPage = 'addNote'"
        :class="{ active: currentPage === 'addNote' }"
        class="nav-button"
      >{{ translations.addNote }}</button>
      <button
        @click="currentPage = 'filterNotes'"
        :class="{ active: currentPage === 'filterNotes' }"
        class="nav-button"
      >{{ translations.searchNotes }}</button>
      <button
        @click="currentPage = 'pdfDownload'"
        :class="{ active: currentPage === 'pdfDownload' }"
        class="nav-button"
      >{{ translations.downloadPDF }}</button>
      <button
        @click="currentPage = 'settings'"
        :class="{ active: currentPage === 'settings' }"
        class="nav-button"
      >{{ translations.settings }}</button>
    </nav>

    <!-- Page Content -->
    <transition name="fade" mode="out-in">
      <div :key="currentPage" class="content">
        <!-- Home Page -->
        <div v-if="currentPage === 'home'" class="page home-page">
          <h1>{{ translations.welcome }}</h1>
          <p>{{ translations.navigationInstruction }}</p>
        </div>

        <!-- Settings -->
        <div v-if="currentPage === 'settings'" class="page">
          <h2>{{ translations.settings }}</h2>
          <div>
            <label>
              <input type="checkbox" v-model="isDarkTheme" /> {{ translations.darkThemeToggle }}
            </label>
          </div>
          <div>
            <label for="languageSelect">{{ translations.changeLanguage }}</label>
            <select id="languageSelect" v-model="language" @change="changeLanguage">
              <option value="de">Deutsch</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>

        <!-- Notes -->
        <div v-if="currentPage === 'notizblock'" class="page">
          <h2>{{ translations.myNotes }}</h2>
          <div v-for="note in notes" :key="note.id" class="note-card">
            <h3>{{ note.title }}</h3>
            <p>{{ note.content }}</p>
            <button @click="editNote(note)" class="button edit-button">{{ translations.edit }}</button>
            <button @click="deleteNote(note.id)" class="button delete-button">{{ translations.delete }}</button>
            <button @click="downloadNotePDF(note)" class="button pdf-button">{{ translations.downloadPDF }}</button>
          </div>
        </div>

        <!-- Add Note -->
        <div v-if="currentPage === 'addNote'" class="page">
          <h2>{{ translations.addNote }}</h2>
          <input v-model="newNote.title" :placeholder="translations.noteTitle" class="input title-input" />
          <textarea v-model="newNote.content" :placeholder="translations.noteContent" class="input content-input"></textarea>
          <button @click="addNote" class="button add-button">{{ translations.add }}</button>
        </div>

        <!-- Filter Notes -->
        <div v-if="currentPage === 'filterNotes'" class="page">
          <h2>{{ translations.searchNotes }}</h2>
          <input v-model="filter" :placeholder="translations.searchPlaceholder" class="input search-input" />
          <div v-for="note in filteredNotes" :key="note.id" class="note-card">
            <h3>{{ note.title }}</h3>
            <p>{{ note.content }}</p>
          </div>
        </div>

        <!-- PDF Download -->
        <div v-if="currentPage === 'pdfDownload'" class="page">
          <h2>{{ translations.downloadPDF }}</h2>
          <button @click="downloadPDF" class="button pdf-button">{{ translations.download }}</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { jsPDF } from 'jspdf';

// States
const currentPage = ref<'home' | 'notizblock' | 'addNote' | 'filterNotes' | 'settings' | 'pdfDownload'>('home');
const notes = ref<{ id: number, title: string, content: string }[]>([]);
const newNote = ref<{ id: number, title: string, content: string }>({ id: -1, title: '', content: '' });
const filter = ref('');
const isDarkTheme = ref(false);
const language = ref('de');

const translations = ref(getTranslations(language.value));

const filteredNotes = computed(() =>
  filter.value
    ? notes.value.filter(note => note.title.toLowerCase().includes(filter.value.toLowerCase()))
    : notes.value
);

// Watchers
watch(language, (newLang) => {
  translations.value = getTranslations(newLang);
});

watch(isDarkTheme, (newValue) => {
  document.body.className = newValue ? 'dark-theme' : '';
});
const changeLanguage = () => {
  translations.value = getTranslations(language.value);
};

// Methods
function getTranslations(lang: string) {
  const locales: Record<string, Record<string, string>> = {
    de: {
      home: 'Startseite',
      myNotes: 'Meine Notizen',
      addNote: 'Notiz erstellen',
      searchNotes: 'Notizen durchsuchen',
      downloadPDF: 'PDF herunterladen',
      settings: 'Einstellungen',
      welcome: 'Willkommen bei der Notizblock-App',
      navigationInstruction: 'Nutzen Sie die obigen Schaltflächen, um zu navigieren.',
      darkThemeToggle: 'Dunkles Thema aktivieren',
      changeLanguage: 'Sprache ändern:',
      edit: 'Bearbeiten',
      delete: 'Löschen',
      noteTitle: 'Titel der Notiz',
      noteContent: 'Inhalt der Notiz',
      add: 'Hinzufügen',
      searchPlaceholder: 'Suchen...'
    },
    en: {
      home: 'Home',
      myNotes: 'My Notes',
      addNote: 'Add Note',
      searchNotes: 'Search Notes',
      downloadPDF: 'Download PDF',
      settings: 'Settings',
      welcome: 'Welcome to the Notepad App',
      navigationInstruction: 'Use the buttons above to navigate.',
      darkThemeToggle: 'Enable Dark Theme',
      changeLanguage: 'Change Language:',
      edit: 'Edit',
      delete: 'Delete',
      noteTitle: 'Note Title',
      noteContent: 'Note Content',
      add: 'Add',
      searchPlaceholder: 'Search...'
    },
    fr: {
      home: 'Accueil',
      myNotes: 'Mes Notes',
      addNote: 'Ajouter une Note',
      searchNotes: 'Rechercher des Notes',
      downloadPDF: 'Télécharger PDF',
      settings: 'Paramètres',
      welcome: 'Bienvenue dans l’application de Bloc-notes',
      navigationInstruction: 'Utilisez les boutons ci-dessus pour naviguer.',
      darkThemeToggle: 'Activer le thème sombre',
      changeLanguage: 'Changer la langue :',
      edit: 'Modifier',
      delete: 'Supprimer',
      noteTitle: 'Titre de la note',
      noteContent: 'Contenu de la note',
      add: 'Ajouter',
      searchPlaceholder: 'Rechercher...'
    }
  };
  return locales[lang] || locales['en'];
}

const addNote = () => {
  if (newNote.value.title && newNote.value.content) {
    if (newNote.value.id !== -1) {
      const index = notes.value.findIndex(note => note.id === newNote.value.id);
      if (index !== -1) {
        notes.value[index] = { ...newNote.value };
      }
    } else {
      notes.value.push({ id: Date.now(), title: newNote.value.title, content: newNote.value.content });
    }

    newNote.value = { id: -1, title: '', content: '' };
    currentPage.value = 'notizblock';
  }
};

const editNote = (note: { id: number, title: string, content: string }) => {
  newNote.value = { ...note };
  currentPage.value = 'addNote';
};

const deleteNote = (noteId: number) => {
  notes.value = notes.value.filter(note => note.id !== noteId);
};

const downloadNotePDF = (note: { title: string, content: string }) => {
  const doc = new jsPDF();
  doc.text(note.title, 10, 10);
  doc.text(note.content, 10, 20);
  doc.save(`${note.title}.pdf`);
};

const downloadPDF = () => {
  const doc = new jsPDF();
  notes.value.forEach((note, index) => {
    doc.text(`Note ${index + 1}: ${note.title}`, 10, 10 + (index * 20));
    doc.text(note.content, 10, 20 + (index * 20));
  });
  doc.save('all_notes.pdf');
};
</script>

<style scoped>
body {
  font-family: 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f0f0f0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  transition: background-color 0.3s, color 0.3s;
}

.app {
  display: grid;
  grid-template-rows: 60px auto;
  height: 100vh;
  width: 100vw;
  grid-template-areas:
    "navbar"
    "content";
}

.navbar {
  grid-area: navbar;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background-color: #ff6f61;
  padding: 0;
  position: sticky;
  top: 0;
  height: 60px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.nav-button {
  background-color: transparent;
  border: none;
  color: white;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  font-size: 14px;
}

.nav-button:hover,
.nav-button.active {
  background-color: rgba(255, 255, 255, 0.2);
}

.content {
  grid-area: content;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  overflow-y: auto;
}

.note-card {
  background-color: #ff9f89;
  border-radius: 5px;
  padding: 10px;
  margin: 10px 0;
}

.note-card h3 {
  margin: 0;
}

.input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}

.title-input {
  font-size: 18px;
}

.content-input {
  height: 150px;
}

.search-input {
  margin-bottom: 20px;
}

.button {
  background-color: #ff6f61;
  border: none;
  color: white;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 5px;
  margin: 5px;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #ff4e30;
}

.dark-theme {
  background-color: #121212;
  color: #e0e0e0;
}

.dark-theme .navbar {
  background-color: #1a1a1a;
}

.dark-theme .nav-button {
  background-color: transparent;
  color: #e0e0e0;
}

.dark-theme .nav-button:hover,
.dark-theme .nav-button.active {
  background-color: rgba(255, 255, 255, 0.2);
}

.dark-theme .content {
  background-color: #1e1e1e;
  color: #e0e0e0;
}

.dark-theme .note-card {
  background-color: #2a2a2a;
  color: #e0e0e0;
}

.dark-theme .input {
  background-color: #2a2a2a;
  color: #e0e0e0;
  border: 1px solid #444;
}

.dark-theme .button {
  background-color: #444;
  color: white;
}

.dark-theme .button:hover {
  background-color: #555;
}
</style>
