// src/router/index.ts - Enhanced router configuration
import { createRouter, createWebHistory } from 'vue-router';
import LandingView from '../views/LandingView.vue';
import HomeView from '../views/HomeView.vue';
import JourneyView from '../views/JourneyView.vue';

const routes = [
  {
    path: '/',
    name: 'landing',
    component: LandingView,
    meta: {
      title: 'Vivekam\'s SmartVest'
    }
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Home - SmartVest'
    }
  },
  {
    path: '/journey',
    name: 'journey',
    component: JourneyView,
    meta: {
      title: 'Investment Journey - SmartVest'
    }
  },
  // Catch-all redirect to landing
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // Enhanced scroll behavior
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, behavior: 'smooth' };
    }
  }
});

// Global navigation guards for debugging
router.beforeEach((to, from, next) => {
  console.log(`🔄 Navigating from ${from.path} to ${to.path}`);
  
  // Update document title
  if (to.meta?.title) {
    document.title = to.meta.title as string;
  }
  
  next();
});

router.afterEach((to, from, failure) => {
  if (failure) {
    console.error('❌ Navigation failed:', failure);
  } else {
    console.log(`✅ Navigation complete: ${from.path} → ${to.path}`);
  }
});

// Handle navigation errors globally
router.onError((error) => {
  console.error('🚨 Router error:', error);
});

export default router;