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
}

*::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none; /* Chrome, Safari, Opera */
}

html, body {
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 0;
  height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* COMPACT FIXED HEADER */
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
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
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

/* ROUTER CONTAINER */
.router-container {
  flex: 1;
  margin-top: 60px;
  overflow: hidden;
  height: calc(100vh - 60px);
}

.route-component {
  height: 100%;
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

/* RESPONSIVE DESIGN */
@media (max-width: 768px) {
  .app-header {
    padding: 0.4rem 0.8rem;
    height: 45px;
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
    margin-top: 55px;
    height: calc(100vh - 55px);
  }
}

@media (max-width: 480px) {
  .app-header {
    padding: 0.3rem 0.5rem;
    height: 40px;
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
    margin-top: 50px;
    height: calc(100vh - 50px);
  }
}

/* SMOOTH SCROLLING */
html {
  scroll-behavior: smooth;
}

/* FOCUS STYLES FOR ACCESSIBILITY */
.rupee:focus {
  outline: 1px solid #fbbf24;
  outline-offset: 1px;
}
</style>