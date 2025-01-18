<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import type { Note } from '@/model/Note';

// Basis-URL der API
const API_BASE_URL = import.meta.env.VITE_APP_BACKEND_BASE_URL;

// Reaktive Variablen
const route = useRoute();
const note = ref<Note | null>(null);
const errorMessage = ref('');
const isEditing = ref(false); // Bearbeitungsmodus

// Details einer Notiz abrufen
const fetchNoteDetails = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/notizblock/${route.params.id}`);
    note.value = response.data;
  } catch (error) {
    errorMessage.value = 'Fehler beim Laden der Notizdetails.';
  }
};

const updateNote = async () => {
  if (!note.value) return;
  try {
    await axios.put(`${API_BASE_URL}/notizblock/${note.value.id}`, note.value);
    isEditing.value = false; // Bearbeitungsmodus verlassen
  } catch (error) {
    errorMessage.value = 'Fehler beim Aktualisieren der Notiz.';
  }
};

// Notizdetails beim Laden der Seite abrufen
onMounted(() => {
  fetchNoteDetails();
});
</script>

<template>
  <div class="container">
    <h2 class="title">Notiz Details</h2>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <!-- Anzeige der Notiz -->
    <div v-if="note">
      <!-- Bearbeitungsmodus -->
      <div v-if="isEditing" class="edit-mode">
        <input v-model="note.title" placeholder="Titel" class="input-field" />
        <textarea v-model="note.content" placeholder="Inhalt" class="textarea-field"></textarea>
        <input v-model="note.tags" placeholder="Schlagworte" class="input-field" />
        <div class="buttons">
          <button @click="updateNote" class="btn-save">Speichern</button>
          <button @click="isEditing = false" class="btn-cancel">Abbrechen</button>
        </div>
      </div>

      <!-- Lesemodus -->
      <div v-else class="view-mode">
        <h3>{{ note.title }}</h3>
        <p>{{ note.content }}</p>
        <p><strong>Schlagworte:</strong> {{ note.tags.join(', ') }}</p>
        <p><strong>Erstellt am:</strong> {{ note.createdAt }}</p>
        <p><strong>Aktualisiert am:</strong> {{ note.updatedAt }}</p>
        <button @click="isEditing = true" class="btn-edit">Bearbeiten</button>
      </div>
    </div>

    <p v-else class="loading">Lädt...</p>
  </div>
</template>

<style scoped>
/* Hauptcontainer */
.container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center; /* Centrer le contenu */
}

/* Titel */
.title {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1.5rem;
}

/* Fehlermeldung */
.error-message {
  color: red;
  font-size: 1rem;
  margin-bottom: 1rem;
}

/* Notizbereich (Bearbeitungsmodus) */
.edit-mode .input-field,
.edit-mode .textarea-field {
  width: 80%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  box-sizing: border-box;
  margin-left: auto;
  margin-right: auto;
}

/* Textarea */
.textarea-field {
  height: 150px;
}

/* Buttons */
.buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.btn-save,
.btn-cancel,
.btn-edit {
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 150px;
}

.btn-save {
  background-color: #4caf50; /* Grün */
}

.btn-cancel {
  background-color: #f44336; /* Rot */
}

.btn-edit {
  background-color: #ff9800;
  width: 200px; /* Large button for editing */
}

/* Lesemodus */
.view-mode h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
}

.view-mode p {
  font-size: 1rem;
  color: #555;
}

/* Ladeanzeige */
.loading {
  font-size: 1.2rem;
  color: #999;
}
</style>
