// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import LandingView from '../views/LandingView.vue';
import HomeView from '../views/HomeView.vue';
import JourneyView from '../views/JourneyView.vue';

const routes = [
  {
    path: '/',
    name: 'landing',
    component: LandingView
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView
  },
  {
    path: '/journey',
    name: 'journey',
    component: JourneyView
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;