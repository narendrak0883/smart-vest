<!-- Step 1: Create a minimal test to isolate the issue -->

<!-- TEMPORARY TEST APP.VUE - Replace your current App.vue with this minimal version -->
<template>
  <div id="app">
    <!-- Debug info -->
    <div class="debug-header">
      <strong>🔍 Current Route:</strong> {{ $route.fullPath }} | 
      <strong>Component:</strong> {{ $route.name }}
      <button @click="testNavigation" class="test-btn">🧪 Test Navigation</button>
    </div>

    <!-- Simple navigation -->
    <nav class="simple-nav">
      <router-link to="/" class="nav-link">🏠 Landing</router-link>
      <router-link to="/journey" class="nav-link">🚀 Journey</router-link>
      <router-link to="/home" class="nav-link">📱 Home</router-link>
    </nav>

    <!-- Router view without complex transitions -->
    <div class="router-container">
      <router-view v-slot="{ Component, route: currentRoute }">
        <div class="route-debug">
          Route: {{ currentRoute.fullPath }} | Component: {{ Component?.type?.name || 'None' }}
        </div>
        <component 
          :is="Component" 
          :key="currentRoute.fullPath"
          v-if="Component"
          class="route-component"
        />
        <div v-else class="no-component">
          ❌ No component found for route: {{ currentRoute.fullPath }}
        </div>
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const testNavigation = async () => {
  console.log('🧪 Testing programmatic navigation...');
  console.log('Current route:', route.fullPath);
  
  try {
    if (route.path === '/') {
      console.log('Navigating to /journey...');
      await router.push('/journey');
    } else {
      console.log('Navigating to /...');
      await router.push('/');
    }
    console.log('✅ Navigation completed. New route:', route.fullPath);
  } catch (error) {
    console.error('❌ Navigation failed:', error);
  }
};

// Log all router events
router.beforeEach((to, from, next) => {
  console.log(`🔄 Router beforeEach: ${from.path} → ${to.path}`);
  next();
});

router.afterEach((to, from) => {
  console.log(`✅ Router afterEach: ${from.path} → ${to.path}`);
});

router.onError((error) => {
  console.error('🚨 Router error:', error);
});
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

.debug-header {
  background: #f0f0f0;
  padding: 10px;
  border-bottom: 2px solid #ccc;
  font-family: monospace;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.test-btn {
  background: #1976d2;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.simple-nav {
  background: #333;
  padding: 15px;
  display: flex;
  gap: 20px;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 10px 15px;
  border-radius: 4px;
  font-weight: bold;
  transition: background 0.3s;
}

.nav-link:hover,
.nav-link.router-link-active {
  background: #1976d2;
}

.router-container {
  padding: 20px;
  min-height: 500px;
}

.route-debug {
  background: #fffbf0;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ffa500;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
}

.route-component {
  min-height: 400px;
  border: 2px dashed #4CAF50;
  padding: 20px;
  border-radius: 8px;
}

.no-component {
  color: red;
  font-weight: bold;
  padding: 50px;
  text-align: center;
  border: 2px solid red;
  border-radius: 8px;
  background: #ffe6e6;
}
</style>