
import { createRouter, createWebHistory } from 'vue-router';
import NoteList from '@/components/NoteList.vue';
import NoteDetails from '@/components/NoteDetails.vue';

const routes = [
  { path: '/', name: 'noteList', component: NoteList },
  { path: '/note/:id', name: 'noteDetails', component: NoteDetails },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
