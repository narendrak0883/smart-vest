<template>
  <div id="app">
    <!-- Loading overlay for route transitions -->
    <div v-if="isRouteLoading" class="route-loading-overlay">
      <div class="route-loading-spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      <div class="loading-text">Loading...</div>
    </div>

    <!-- Router view with transitions -->
    <router-view v-slot="{ Component, route: currentRoute }">
      <transition
        :name="transitionName"
        mode="out-in"
        @before-enter="onBeforeEnter"
        @after-enter="onAfterEnter"
        @enter-cancelled="onEnterCancelled"
      >
        <component 
          :is="Component" 
          :key="currentRoute.fullPath"
          v-if="Component"
        />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const isRouteLoading = ref(false);
const transitionName = ref('fade');
let loadingTimeout = null;

// Handle route loading states
const onBeforeEnter = () => {
  console.log('Transition: before-enter', route.fullPath);
  isRouteLoading.value = true;
  
  // Safety timeout to prevent stuck loading state
  if (loadingTimeout) clearTimeout(loadingTimeout);
  loadingTimeout = setTimeout(() => {
    console.warn('Loading timeout triggered');
    isRouteLoading.value = false;
  }, 3000);
};

const onAfterEnter = () => {
  console.log('Transition: after-enter', route.fullPath);
  if (loadingTimeout) {
    clearTimeout(loadingTimeout);
    loadingTimeout = null;
  }
  nextTick(() => {
    isRouteLoading.value = false;
  });
};

const onEnterCancelled = () => {
  console.log('Transition: enter-cancelled');
  if (loadingTimeout) {
    clearTimeout(loadingTimeout);
    loadingTimeout = null;
  }
  isRouteLoading.value = false;
};

// Watch for route changes to set appropriate transitions
watch(
  () => route.fullPath,
  (newPath, oldPath) => {
    if (oldPath && newPath !== oldPath) {
      console.log('Route changed from:', oldPath, 'to:', newPath);
      
      // Set transition based on navigation direction
      if (oldPath === '/' && newPath === '/journey') {
        transitionName.value = 'slide-left';
      } else if (oldPath === '/journey' && newPath === '/') {
        transitionName.value = 'slide-right';
      } else {
        transitionName.value = 'fade';
      }
    }
  },
  { flush: 'sync' }
);

// Enhanced error handling without auto-redirects
router.onError((error) => {
  console.error('Router error:', error);
  isRouteLoading.value = false;
  
  // Clear any pending timeouts
  if (loadingTimeout) {
    clearTimeout(loadingTimeout);
    loadingTimeout = null;
  }
});

// Log navigation events for debugging
router.beforeEach((to, from, next) => {
  console.log('Router beforeEach:', { from: from.fullPath, to: to.fullPath });
  next();
});

router.afterEach((to, from) => {
  console.log('Router afterEach:', { from: from.fullPath, to: to.fullPath });
});

onMounted(() => {
  console.log('App mounted, current route:', route.fullPath);
  isRouteLoading.value = false;
});
</script>

<style>
/* Global app styles */
#app {
  position: relative;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

/* Route loading overlay */
.route-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(25, 118, 210, 0.1);
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  opacity: 0;
  animation: fadeInOverlay 0.3s ease-out forwards;
}

@keyframes fadeInOverlay {
  to { opacity: 1; }
}

.route-loading-spinner {
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
}

.spinner-ring {
  position: absolute;
  width: 60px;
  height: 60px;
  border: 4px solid rgba(25, 118, 210, 0.2);
  border-top: 4px solid #1976d2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-ring:nth-child(1) {
  animation-delay: 0s;
}

.spinner-ring:nth-child(2) {
  width: 70px;
  height: 70px;
  top: -5px;
  left: -5px;
  animation-delay: 0.1s;
  border-color: rgba(33, 150, 243, 0.2);
  border-top-color: #2196f3;
}

.spinner-ring:nth-child(3) {
  width: 80px;
  height: 80px;
  top: -10px;
  left: -10px;
  animation-delay: 0.2s;
  border-color: rgba(66, 165, 245, 0.2);
  border-top-color: #42a5f5;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1565c0;
  text-shadow: 0 2px 4px rgba(25, 118, 210, 0.2);
}

/* Route transition styles */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Global responsive styles */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

/* Ensure components take full height */
.router-view-container {
  min-height: 100vh;
}
</style>