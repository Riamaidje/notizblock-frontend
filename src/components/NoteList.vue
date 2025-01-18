<template>
  <div class="app">
    <!-- Navigation -->
    <nav class="navbar">
      <button
        @click="currentPage = 'home'"
        :class="{ active: currentPage === 'home' }"
        class="nav-button">Startseite
      </button>
      <button
        @click="currentPage = 'settings'"
        :class="{ active: currentPage === 'settings' }"
        class="nav-button">Einstellungen
      </button>
      <button
        @click="currentPage = 'notizblock'"
        :class="{ active: currentPage === 'notizblock' }"
        class="nav-button">Meine Notizen
      </button>
      <button
        @click="currentPage = 'addNote'"
        :class="{ active: currentPage === 'addNote' }"
        class="nav-button">Notiz erstellen
      </button>
      <button
        @click="currentPage = 'filterNotes'"
        :class="{ active: currentPage === 'filterNotes' }"
        class="nav-button">Notizen durchsuchen
      </button>
      <button
        @click="currentPage = 'pdfDownload'"
        :class="{ active: currentPage === 'pdfDownload' }"
        class="nav-button">PDF herunterladen
      </button>
    </nav>

    <!-- Page Content -->
    <transition name="fade" mode="out-in">
      <div :key="currentPage" class="content">
        <!-- Home Page -->
        <div v-if="currentPage === 'home'" class="page home-page">
          <h1>Willkommen bei der Notizblock-App</h1>
          <p>Nutzen Sie die obigen Schaltflächen, um zu navigieren.</p>
        </div>

        <!-- Einstellungen -->
        <div v-if="currentPage === 'settings'" class="page">
          <h2>Einstellungen</h2>
          <div>
            <label>
              <input type="checkbox" v-model="isDarkTheme" /> Dunkles Thema aktivieren
            </label>
          </div>
          <div>
            <label for="languageSelect">Sprache ändern:</label>
            <select id="languageSelect" v-model="language">
              <option value="de">Deutsch</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>
          <div>
            <label for="sortNotes">Notizen sortieren nach:</label>
            <select id="sortNotes" v-model="sortOption" @change="sortNotes">
              <option value="date">Datum</option>
              <option value="title">Titel</option>
            </select>
          </div>
          <div>
            <button @click="resetData" class="button delete-button">Daten zurücksetzen</button>
          </div>
        </div>

        <!-- Notes Pages -->
        <div v-if="currentPage === 'notizblock'" class="page">
          <h2>Meine Notizen</h2>
          <div v-for="note in notes" :key="note.id" class="note-card">
            <h3>{{ note.title }}</h3>
            <p>{{ note.content }}</p>
            <button @click="editNote(note)" class="button edit-button">Bearbeiten</button>
            <button @click="deleteNote(note.id)" class="button delete-button">Löschen</button>
            <button @click="downloadNotePDF(note)" class="button pdf-button">PDF herunterladen</button>
          </div>
        </div>

        <!-- Add New Note -->
        <div v-if="currentPage === 'addNote'" class="page">
          <h2>Notiz erstellen</h2>
          <input v-model="newNote.title" placeholder="Titel der Notiz" class="input title-input" />
          <textarea v-model="newNote.content" placeholder="Inhalt der Notiz" class="input content-input"></textarea>
          <button @click="addNote" class="button add-button">Hinzufügen</button>
        </div>

        <!-- Filter Notes -->
        <div v-if="currentPage === 'filterNotes'" class="page">
          <h2>Notizen durchsuchen</h2>
          <input v-model="filter" placeholder="Suchen..." class="input search-input" />
          <div v-for="note in filteredNotes" :key="note.id" class="note-card">
            <h3>{{ note.title }}</h3>
            <p>{{ note.content }}</p>
          </div>
        </div>

        <!-- PDF Download -->
        <div v-if="currentPage === 'pdfDownload'" class="page">
          <h2>Notizen als PDF herunterladen</h2>
          <button @click="downloadPDF" class="button pdf-button">Herunterladen</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { jsPDF } from 'jspdf';

// States and Variables
const currentPage = ref<'home' | 'notizblock' | 'addNote' | 'filterNotes' | 'settings' | 'pdfDownload'>('home');
const notes = ref<{ id: number, title: string, content: string }[]>([]);
const newNote = ref<{ id: number, title: string, content: string }>({ id: -1, title: '', content: '' });
const filter = ref('');
const filteredNotes = computed(() =>
  filter.value
    ? notes.value.filter(note =>
      note.title.toLowerCase().includes(filter.value.toLowerCase())
    )
    : notes.value
);

// Settings
const isDarkTheme = ref(false);
const language = ref('de');
const sortOption = ref('date');

// Watchers
watch(isDarkTheme, (newValue) => {
  document.body.className = newValue ? 'dark-theme' : '';
});

// Methods

// Add a new note or edit an existing one
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

// Sort notes based on selected option
const sortNotes = () => {
  if (sortOption.value === 'date') {
    notes.value.sort((a, b) => a.id - b.id);
  } else if (sortOption.value === 'title') {
    notes.value.sort((a, b) => a.title.localeCompare(b.title));
  }
};

// Reset all data
const resetData = () => {
  if (confirm('Möchten Sie wirklich alle Daten zurücksetzen?')) {
    notes.value = [];
    newNote.value = { id: -1, title: '', content: '' };
  }
};

// Edit an existing note
const editNote = (note: { id: number, title: string, content: string }) => {
  newNote.value = { ...note };
  currentPage.value = 'addNote';
};

// Delete a note
const deleteNote = (noteId: number) => {
  notes.value = notes.value.filter(note => note.id !== noteId);
};

// Download the PDF of a specific note
const downloadNotePDF = (note: { title: string, content: string }) => {
  const doc = new jsPDF();
  doc.text(note.title, 10, 10); // Title of the note
  doc.text(note.content, 10, 20); // Content of the note
  doc.save(`${note.title}.pdf`); // Save the PDF with the note's title
};

// Download all notes in PDF
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
/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap');

body {
  font-family: 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f0f0f0;
}

/* Navbar */
.navbar {
  background-color: #ff6f61;
  padding: 10px;
  display: flex;
  justify-content: space-around;
}

.nav-button {
  background-color: #ff6f61;
  border: none;
  color: white;
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
}

.nav-button:hover, .nav-button.active {
  background-color: #ff4e30;
}

/* Page Content */
.content {
  padding: 20px;
  background-color: white;
  border-radius: 10px;
}

/* Note Cards */
.note-card {
  background-color: #ff9f89;
  border-radius: 5px;
  padding: 10px;
  margin: 10px 0;
}

.note-card h3 {
  margin: 0;
}

/* Input Fields */
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

/* Buttons */
.button {
  background-color: #ff6f61;
  border: none;
  color: white;
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  margin: 5px;
}

.button:hover {
  background-color: #ff4e30;
}

/* Dark Theme */
.dark-theme {
  background-color: #333;
  color: white;
}

.dark-theme .navbar {
  background-color: #222;
}

.dark-theme .nav-button {
  background-color: #444;
}

.dark-theme .button {
  background-color: #444;
}
</style>
