// STEP 2: Create a minimal router setup - replace your router/index.ts

import { createRouter, createWebHistory } from 'vue-router';

// Simple test components - create these as separate .vue files OR define inline
const LandingViewTest = {
  name: 'LandingViewTest',
  template: `
    <div class="test-component landing">
      <h1>🏠 Landing Page Test</h1>
      <p>Current time: {{ new Date().toLocaleTimeString() }}</p>
      <button @click="goToJourney" class="nav-button">Go to Journey →</button>
      <div class="component-info">
        <strong>Component:</strong> LandingViewTest<br>
        <strong>Route:</strong> {{ $route.fullPath }}<br>
        <strong>Mounted:</strong> {{ mounted }}
      </div>
    </div>
  `,
  setup() {
    const router = useRouter();
    const mounted = ref(false);
    
    const goToJourney = () => {
      console.log('🚀 Button clicked: navigating to journey');
      router.push('/journey').catch(err => console.error('Navigation error:', err));
    };
    
    onMounted(() => {
      mounted.value = true;
      console.log('✅ LandingViewTest mounted');
    });
    
    return { goToJourney, mounted };
  }
};

const JourneyViewTest = {
  name: 'JourneyViewTest',
  template: `
    <div class="test-component journey">
      <h1>🚀 Journey Page Test</h1>
      <p>Current time: {{ new Date().toLocaleTimeString() }}</p>
      <button @click="goToLanding" class="nav-button">← Back to Landing</button>
      <div class="component-info">
        <strong>Component:</strong> JourneyViewTest<br>
        <strong>Route:</strong> {{ $route.fullPath }}<br>
        <strong>Mounted:</strong> {{ mounted }}
      </div>
    </div>
  `,
  setup() {
    const router = useRouter();
    const mounted = ref(false);
    
    const goToLanding = () => {
      console.log('🏠 Button clicked: navigating to landing');
      router.push('/').catch(err => console.error('Navigation error:', err));
    };
    
    onMounted(() => {
      mounted.value = true;
      console.log('✅ JourneyViewTest mounted');
      // NOTE: NO router.go(0) here!
    });
    
    return { goToLanding, mounted };
  }
};

const HomeViewTest = {
  name: 'HomeViewTest',
  template: `
    <div class="test-component home">
      <h1>📱 Home Page Test</h1>
      <p>Current time: {{ new Date().toLocaleTimeString() }}</p>
      <div class="component-info">
        <strong>Component:</strong> HomeViewTest<br>
        <strong>Route:</strong> {{ $route.fullPath }}<br>
        <strong>Mounted:</strong> {{ mounted }}
      </div>
    </div>
  `,
  setup() {
    const mounted = ref(false);
    
    onMounted(() => {
      mounted.value = true;
      console.log('✅ HomeViewTest mounted');
    });
    
    return { mounted };
  }
};

// Import necessary Vue functions
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import LandingView from '@/views/LandingView.vue';
import JourneyView from '@/views/JourneyView.vue';

const routes = [
  {
    path: '/',
    name: 'landing',
    component: LandingView },
  {
    path: '/journey',
    name: 'journey',
    component: JourneyView
    },
  {
    path: '/home',
    name: 'home',
    component: HomeViewTest
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// Debug logging
router.beforeEach((to, from, next) => {
  console.log(`🔄 Router beforeEach: ${from.fullPath} → ${to.fullPath}`);
  next();
});

router.afterEach((to, from, failure) => {
  if (failure) {
    console.error('❌ Router afterEach - Navigation failed:', failure);
  } else {
    console.log(`✅ Router afterEach: ${from.fullPath} → ${to.fullPath}`);
  }
});

export default router;