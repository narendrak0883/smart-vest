<template>
  <div id="app">
    <header class="app-header">
      <div class="header-content">
        <div class="rupee-symbols left">
          <span class="rupee">₹</span>
          <span class="rupee">₹</span>
          <span class="rupee">₹</span>
        </div>
        <div class="title-section">
          <h1 class="app-title">SMARTVEST</h1>
          <p class="app-subtitle">Your Investment Journey Starts Here</p>
        </div>
        <div class="rupee-symbols right">
          <span class="rupee">₹</span>
          <span class="rupee">₹</span>
          <span class="rupee">₹</span>
        </div>
      </div>
      <div class="header-decoration">
        <div class="floating-rupee">₹</div>
        <div class="floating-rupee">₹</div>
        <div class="floating-rupee">₹</div>
        <div class="floating-rupee">₹</div>
      </div>
    </header>

    <!-- Router view without complex transitions -->
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
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
}

/* BEAUTIFUL BLUE HEADER WITH RUPEE GRAPHICS */
.app-header {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #3b82f6 100%);
  padding: 2rem 1rem;
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.3);
  text-align: center;
  position: relative;
  overflow: hidden;
  border-bottom: 3px solid #60a5fa;
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
  gap: 2rem;
  position: relative;
  z-index: 2;
}

.title-section {
  text-align: center;
}

.app-title {
  margin: 0;
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: 3px;
  color: #ffffff;
  text-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 4px 8px rgba(59, 130, 246, 0.4),
    0 0 20px rgba(255, 255, 255, 0.1);
  background: linear-gradient(45deg, #ffffff, #e0f2fe, #ffffff);
  background-clip: text;
  -webkit-background-clip: text;
  animation: titleGlow 2s ease-in-out infinite alternate;
}

.app-subtitle {
  margin: 0.5rem 0 0 0;
  font-size: 1rem;
  color: #e0f2fe;
  font-weight: 300;
  letter-spacing: 1px;
  opacity: 0.9;
}

.rupee-symbols {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.rupee {
  font-size: 2rem;
  color: #fbbf24;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  animation: bounce 2s ease-in-out infinite;
  transition: all 0.3s ease;
  cursor: pointer;
}

.rupee:hover {
  transform: scale(1.2);
  color: #f59e0b;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}

.rupee:nth-child(1) { animation-delay: 0s; }
.rupee:nth-child(2) { animation-delay: 0.3s; }
.rupee:nth-child(3) { animation-delay: 0.6s; }

.header-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.floating-rupee {
  position: absolute;
  font-size: 1.5rem;
  color: rgba(251, 191, 36, 0.3);
  animation: float 6s ease-in-out infinite;
}

.floating-rupee:nth-child(1) {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.floating-rupee:nth-child(2) {
  top: 60%;
  right: 15%;
  animation-delay: 1.5s;
}

.floating-rupee:nth-child(3) {
  top: 30%;
  left: 5%;
  animation-delay: 3s;
}

.floating-rupee:nth-child(4) {
  bottom: 20%;
  right: 8%;
  animation-delay: 4.5s;
}

/* ANIMATIONS */
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes titleGlow {
  0% { text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(59, 130, 246, 0.4), 0 0 20px rgba(255, 255, 255, 0.1); }
  100% { text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(59, 130, 246, 0.6), 0 0 30px rgba(255, 255, 255, 0.2); }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg);
    opacity: 0.3;
  }
  25% { 
    transform: translateY(-20px) rotate(90deg);
    opacity: 0.6;
  }
  50% { 
    transform: translateY(-10px) rotate(180deg);
    opacity: 0.4;
  }
  75% { 
    transform: translateY(-15px) rotate(270deg);
    opacity: 0.5;
  }
}

/* DEBUG AND NAVIGATION STYLES */
.debug-header {
  background: #f0f0f0;
  padding: 10px;
  border-bottom: 2px solid #ccc;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.test-btn {
  background: #1976d2;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.3s ease;
}

.test-btn:hover {
  background: #1565c0;
}

.simple-nav {
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  padding: 15px;
  display: flex;
  gap: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.nav-link:hover {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.nav-link.router-link-active {
  background: linear-gradient(135deg, #059669, #047857);
  border-color: #260572;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.router-container {
  padding: 30px;
  min-height: 500px;
  margin: 0 auto;
}

.route-debug {
  background: linear-gradient(135deg, #fffbf0, #fef3c7);
  padding: 15px;
  margin-bottom: 25px;
  border: 2px solid #f59e0b;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.5;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
}

.route-component {
  min-height: 400px;
  border: 3px groove #063883;
  padding: 30px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.1);
}

.no-component {
  color: #dc2626;
  font-weight: bold;
  font-size: 1.1rem;
  padding: 50px;
  text-align: center;
  border: 3px solid #ef4444;
  border-radius: 12px;
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.2);
}

/* RESPONSIVE DESIGN */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .rupee-symbols {
    flex-direction: row;
    gap: 1rem;
  }
  
  .rupee-symbols.left,
  .rupee-symbols.right {
    order: 2;
  }
  
  .title-section {
    order: 1;
  }
  
  .app-title {
    font-size: 2rem;
    letter-spacing: 2px;
  }
  
  .app-subtitle {
    font-size: 0.9rem;
  }
  
  .rupee {
    font-size: 1.5rem;
  }
  
  .simple-nav {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .router-container {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .app-header {
    padding: 1.5rem 1rem;
  }
  
  .app-title {
    font-size: 1.8rem;
    letter-spacing: 1px;
  }
  
  .app-subtitle {
    font-size: 0.8rem;
  }
  
  .rupee {
    font-size: 1.2rem;
  }
  
  .floating-rupee {
    font-size: 1rem;
  }
  
  .debug-header {
    flex-direction: column;
    gap: 5px;
    text-align: center;
  }
  
  .router-container {
    padding: 15px;
  }
}

/* SMOOTH SCROLLING */
html {
  scroll-behavior: smooth;
}

/* FOCUS STYLES FOR ACCESSIBILITY */
.nav-link:focus,
.test-btn:focus,
.rupee:focus {
  outline: 2px solid #fbbf24;
  outline-offset: 2px;
}
</style>