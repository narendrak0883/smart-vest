<template>
  <div id="app">
    <header class="app-header">
      <div class="header-content">
        <div class="rupee-symbols left">
          <span class="rupee">₹</span>
          <span class="rupee">₹</span>
        </div>
        <div class="title-section">
          <h1 class="app-title">SMARTVEST</h1>
          <p class="app-subtitle">Your Investment Journey</p>
        </div>
        <div class="rupee-symbols right">
          <span class="rupee">₹</span>
          <span class="rupee">₹</span>
        </div>
      </div>
    </header>

    <!-- Router view with top padding to account for fixed header -->
    <div class="router-container">
      <router-view v-slot="{ Component, route: currentRoute }">
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
/* HIDE SCROLLBARS GLOBALLY */
* {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  box-sizing: border-box; /* Better sizing */
}

*::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none; /* Chrome, Safari, Opera */
}

html, body {
  height: 100vh;
  height: 100dvh; /* Dynamic viewport height for mobile */
  margin: 0;
  padding: 0;
  overflow-x: hidden; /* Prevent horizontal scroll */
  overflow-y: auto; /* Allow vertical scroll if needed */
}

#app {
  font-family: "Inter", Sans-serif;
  margin: 0;
  padding: 0;
  min-height: 100vh;
  min-height: 100dvh; /* Dynamic viewport height */
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

/* IMPROVED FIXED HEADER */
.app-header {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #3b82f6 100%);
  padding: 0.5rem 1rem;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
  text-align: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  border-bottom: 2px solid #60a5fa;
  height: auto; /* Flexible height */
  min-height: 50px; /* Minimum height */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  /* Safe area support for notched devices */
  padding-left: max(1rem, env(safe-area-inset-left));
  padding-right: max(1rem, env(safe-area-inset-right));
  padding-top: max(0.5rem, env(safe-area-inset-top));
}

.app-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
  animation: shimmer 3s ease-in-out infinite;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 800px;
}

.title-section {
  text-align: center;
  flex: 1;
}

.app-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 800;
  letter-spacing: 2px;
  color: #ffffff;
  text-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.3),
    0 2px 4px rgba(59, 130, 246, 0.4);
  background: linear-gradient(45deg, #ffffff, #e0f2fe, #ffffff);
  background-clip: text;
  -webkit-background-clip: text;
  animation: titleGlow 2s ease-in-out infinite alternate;
}

.app-subtitle {
  margin: 0;
  font-size: 0.6rem;
  color: #e0f2fe;
  font-weight: 300;
  letter-spacing: 0.5px;
  opacity: 0.9;
}

.rupee-symbols {
  display: flex;
  gap: 0.3rem;
}

.rupee {
  font-size: 1rem;
  color: #fbbf24;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  animation: bounce 2s ease-in-out infinite;
  transition: all 0.3s ease;
  cursor: pointer;
}

.rupee:hover {
  transform: scale(1.1);
  color: #f59e0b;
}

.rupee:nth-child(1) { animation-delay: 0s; }
.rupee:nth-child(2) { animation-delay: 0.3s; }

/* ANIMATIONS */
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes titleGlow {
  0% { text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(59, 130, 246, 0.4); }
  100% { text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(59, 130, 246, 0.6); }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-5px); }
  60% { transform: translateY(-2px); }
}

/* IMPROVED ROUTER CONTAINER */
.router-container {
  flex: 1;
  padding-top: 60px; /* Use padding instead of margin */
  overflow: auto; /* Allow scrolling if content is too tall */
  min-height: 0; /* Allow shrinking */
  width: 100%;
  position: relative;
  /* Safe area support */
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
  padding-bottom: env(safe-area-inset-bottom);
}

.route-component {
  height: 100%;
  min-height: calc(100vh - 60px); /* Ensure minimum height */
  min-height: calc(100dvh - 60px); /* Dynamic viewport height */
  width: 100%;
  overflow: auto; /* Allow scrolling within component */
}

.no-component {
  color: #dc2626;
  font-weight: bold;
  font-size: 1rem;
  padding: 30px;
  text-align: center;
  border: 2px solid #ef4444;
  border-radius: 8px;
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  margin: 20px;
}

/* JOURNEY COMPONENT FIXES */
.journey-view {
  height: 100%;
  max-height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0.5rem;
  box-sizing: border-box;
}

/* ENHANCED RESPONSIVE DESIGN */

/* Very small phones (portrait) - 320px and below */
@media (max-width: 320px) {
  .app-header {
    padding: 0.2rem 0.3rem;
    min-height: 35px;
    padding-left: max(0.3rem, env(safe-area-inset-left));
    padding-right: max(0.3rem, env(safe-area-inset-right));
  }
  
  .header-content {
    gap: 0.3rem;
  }
  
  .app-title {
    font-size: 0.8rem;
    letter-spacing: 0.3px;
  }
  
  .app-subtitle {
    font-size: 0.45rem;
  }
  
  .rupee {
    font-size: 0.7rem;
  }
  
  .router-container {
    padding-top: 45px;
  }
  
  .route-component {
    min-height: calc(100vh - 45px);
    min-height: calc(100dvh - 45px);
  }
  
  .journey-view {
    padding: 0.2rem;
  }
}

/* Small phones (landscape) and large phones (portrait) */
@media (max-width: 480px) {
  .app-header {
    padding: 0.3rem 0.5rem;
    min-height: 40px;
    padding-left: max(0.5rem, env(safe-area-inset-left));
    padding-right: max(0.5rem, env(safe-area-inset-right));
  }
  
  .header-content {
    gap: 0.5rem;
  }
  
  .app-title {
    font-size: 0.9rem;
    letter-spacing: 0.5px;
  }
  
  .app-subtitle {
    font-size: 0.5rem;
  }
  
  .rupee {
    font-size: 0.8rem;
  }
  
  .router-container {
    padding-top: 50px;
  }
  
  .route-component {
    min-height: calc(100vh - 50px);
    min-height: calc(100dvh - 50px);
  }
  
  .journey-view {
    padding: 0.2rem;
  }
}

/* Medium phones and small tablets */
@media (max-width: 600px) {
  .app-header {
    padding: 0.35rem 0.6rem;
    min-height: 42px;
  }
  
  .app-title {
    font-size: 0.95rem;
    letter-spacing: 0.8px;
  }
  
  .app-subtitle {
    font-size: 0.52rem;
  }
  
  .rupee {
    font-size: 0.85rem;
  }
  
  .router-container {
    padding-top: 52px;
  }
  
  .route-component {
    min-height: calc(100vh - 52px);
    min-height: calc(100dvh - 52px);
  }
  
  .journey-view {
    padding: 0.25rem;
  }
}

/* Tablets (portrait) */
@media (max-width: 768px) {
  .app-header {
    padding: 0.4rem 0.8rem;
    min-height: 45px;
    padding-left: max(0.8rem, env(safe-area-inset-left));
    padding-right: max(0.8rem, env(safe-area-inset-right));
  }
  
  .header-content {
    gap: 0.8rem;
  }
  
  .app-title {
    font-size: 1rem;
    letter-spacing: 1px;
  }
  
  .app-subtitle {
    font-size: 0.55rem;
  }
  
  .rupee {
    font-size: 0.9rem;
  }
  
  .router-container {
    padding-top: 55px;
  }
  
  .route-component {
    min-height: calc(100vh - 55px);
    min-height: calc(100dvh - 55px);
  }
  
  .journey-view {
    padding: 0.3rem;
  }
}

/* Large tablets */
@media (max-width: 1024px) {
  .app-header {
    min-height: 48px;
    padding: 0.45rem 0.9rem;
  }
  
  .app-title {
    font-size: 1.1rem;
    letter-spacing: 1.5px;
  }
  
  .app-subtitle {
    font-size: 0.58rem;
  }
  
  .rupee {
    font-size: 0.95rem;
  }
  
  .router-container {
    padding-top: 58px;
  }
  
  .route-component {
    min-height: calc(100vh - 58px);
    min-height: calc(100dvh - 58px);
  }
  
  .journey-view {
    padding: 0.4rem;
  }
}

/* Default desktop styles (1024px and above) */
@media (min-width: 1025px) {
  .app-header {
    padding: 0.5rem 1rem;
    min-height: 50px;
  }
  
  .header-content {
    gap: 1rem;
  }
  
  .app-title {
    font-size: 1.2rem;
    letter-spacing: 2px;
  }
  
  .app-subtitle {
    font-size: 0.6rem;
  }
  
  .rupee {
    font-size: 1rem;
  }
  
  .router-container {
    padding-top: 60px;
  }
  
  .route-component {
    min-height: calc(100vh - 60px);
    min-height: calc(100dvh - 60px);
  }
  
  .journey-view {
    padding: 0.5rem;
  }
}

/* Very tall screens */
@media (min-height: 900px) {
  .app-header {
    min-height: 55px;
    padding: 0.6rem 1rem;
  }
  
  .app-title {
    font-size: 1.3rem;
  }
  
  .app-subtitle {
    font-size: 0.65rem;
  }
  
  .router-container {
    padding-top: 65px;
  }
  
  .route-component {
    min-height: calc(100vh - 65px);
    min-height: calc(100dvh - 65px);
  }
}

/* Landscape orientation adjustments */
@media (max-height: 500px) and (orientation: landscape) {
  .app-header {
    min-height: 35px;
    padding: 0.3rem 0.8rem;
  }
  
  .app-title {
    font-size: 0.9rem;
    letter-spacing: 1px;
  }
  
  .app-subtitle {
    font-size: 0.5rem;
  }
  
  .rupee {
    font-size: 0.8rem;
  }
  
  .router-container {
    padding-top: 45px;
  }
  
  .route-component {
    min-height: calc(100vh - 45px);
    min-height: calc(100dvh - 45px);
  }
  
  .journey-view {
    padding: 0.2rem;
  }
}

/* Ultra-wide screens */
@media (min-width: 1400px) {
  .header-content {
    max-width: 1000px;
  }
  
  .app-title {
    font-size: 1.4rem;
    letter-spacing: 2.5px;
  }
  
  .app-subtitle {
    font-size: 0.7rem;
  }
  
  .rupee {
    font-size: 1.1rem;
  }
}

/* High DPI screens */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .app-title {
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

/* SMOOTH SCROLLING */
html {
  scroll-behavior: smooth;
}

/* FOCUS STYLES FOR ACCESSIBILITY */
.rupee:focus {
  outline: 2px solid #fbbf24;
  outline-offset: 2px;
  border-radius: 2px;
}

/* PRINT STYLES */
@media print {
  .app-header {
    position: static;
    box-shadow: none;
    background: #1e3c72 !important;
    color: white !important;
  }
  
  .router-container {
    padding-top: 0;
  }
  
  .rupee {
    animation: none;
  }
}

/* REDUCED MOTION SUPPORT */
@media (prefers-reduced-motion: reduce) {
  .rupee,
  .app-title,
  .app-header::before {
    animation: none;
  }
  
  .rupee:hover {
    transform: none;
  }
  
  html {
    scroll-behavior: auto;
  }
}

/* DARK MODE SUPPORT (if needed in future) */
@media (prefers-color-scheme: dark) {
  /* Styles can be added here if dark mode is implemented */
}
</style>