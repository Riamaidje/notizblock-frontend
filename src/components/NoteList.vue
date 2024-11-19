<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import type {Note} from "@/model/Note";

const notes = ref<Note[]>([]);
const errorMessage = ref('');

const fetchNotes = async () => {
  try {
    const response = await axios.get('/notizblock');
    notes.value = response.data;
  } catch (error) {
    errorMessage.value = 'Failed to load notes. Please try again later.';
  }
};

onMounted(() => {
  // fetchNotes();
  notes.value.push({
    id: 123,
    title: "l",
    content: "LI",
    tags:[],
    createdAt:"",
    updatedAt:""
  })
});
</script>

<template>
  <div>
    <h2>Notes</h2>

    <p v-if="errorMessage">{{ errorMessage }}</p>

    <ul v-if="notes.length > 0">
      <li v-for="note in notes" :key="note.id">
        <h3>{{ note.title }}</h3>
        <p>{{ note.content }}</p>
        <router-link :to="{ name: 'noteDetails', params: { id: note.id } }">
          View Details
        </router-link>
      </li>
    </ul>

    <p v-else>No notes available.</p>
  </div>
</template>

<style scoped>
h2 {
  margin-bottom: 1rem;
}

li {
  margin-bottom: 1rem;
  border: 1px solid #f32727;
  padding: 0.5rem;
  border-radius: 5px;
}
</style>
