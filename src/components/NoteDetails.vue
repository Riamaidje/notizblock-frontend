<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import type { Note } from '@/model/Note';

const route = useRoute();
const note = ref<Note | null>(null);
const errorMessage = ref('');

const fetchNoteDetails = async () => {
  try {
    const response = await axios.get(`/notizblock/${route.params.id}`);
    note.value = response.data;
  } catch (error) {
    errorMessage.value = 'Failed to load note details.';
  }
};

onMounted(() => {
  fetchNoteDetails();
});
</script>

<template>
  <div>
    <h2>Note Details</h2>
    <p v-if="errorMessage">{{ errorMessage }}</p>
    <div v-if="note">
      <h3>{{ note.title }}</h3>
      <p>{{ note.content }}</p>
      <p><strong>Tags:</strong> {{ note.tags.join(', ') }}</p>
      <p><strong>Created At:</strong> {{ note.createdAt }}</p>
      <p><strong>Last Updated:</strong> {{ note.updatedAt }}</p>
    </div>
    <p v-else>Loading...</p>
  </div>
</template>

<style scoped>
h2 {
  margin-bottom: 1rem;
}

div {
  border: 1px solid #7092db;
  padding: 1rem;
  border-radius: 5px;
}
</style>
