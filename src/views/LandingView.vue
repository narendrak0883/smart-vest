// LandingPage.vue - Optimized Version

<template>
  <!-- Splash Screen -->
  <div v-if="showSplash" class="splash-screen">
    <div class="splash-background">
      <!-- Reduced floating elements to just 8 relevant investment icons -->
      <div class="floating-icons">
        <div v-for="n in 8" :key="n" class="floating-icon" :style="getFloatingStyle(n)">
          {{ getInvestmentIcon(n) }}
        </div>
      </div>
    </div>
    <div class="splash-content">
      <div class="splash-logo-container">
        <div class="splash-logo">
          <div class="logo-rings">
            <div class="ring ring-1"></div>
            <div class="ring ring-2"></div>
          </div>
          <!-- Using your company logo -->
          <div class="logo-center">
            <img src="../assets/logo.jpeg" alt="SmartVest Logo" class="logo-img">
          </div>
        </div>
      </div>
      <div class="splash-text">
        <h1 class="splash-title">
          <span class="title-vivekam">Vivekam's</span>
          <span class="title-smartvest">SmartVest</span>
        </h1>
        <div class="splash-tagline">
          Interactive Investment Simulator
        </div>
      </div>
      <div class="loading-container">
        <div class="loading-bar">
          <div class="loading-progress" :style="{ width: loadingProgress + '%' }"></div>
          <div class="loading-spark"></div>
        </div>
        <div class="loading-text">Loading {{ loadingProgress }}%</div>
      </div>
    </div>
  </div>

  <!-- Main Landing Page - Compact Design -->
  <div v-else class="landing-page">
    <!-- Simplified Background -->
    <div class="page-background">
      <div class="background-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
      </div>
      <!-- Reduced particles to 12 -->
      <div class="floating-particles">
        <div v-for="n in 12" :key="n" class="particle" :style="getParticleStyle(n)"></div>
      </div>
    </div>

    <div class="landing-container">
      
      <!-- Compact Header Section -->
      <div class="header-section">
        <div class="logo-container">
          <div class="main-logo">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNDY4MkI0O3N0b3Atb3BhY2l0eToxIiAvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM4N0NFRUIsc3RvcC1vcGFjaXR5OjEiIC8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHN0b2tlIGQ9Ik04IDQ1TDIwIDEwTDMwIDMwTDUyIDgiIHN0cm9rZT0idXJsKCNncmFkaWVudCkiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxjaXJjbGUgY3g9IjUyIiBjeT0iOCIgcj0iNCIgZmlsbD0iIzg3Q0VFQiIvPgo8L3N2Zz4K" alt="SmartVest Logo" class="logo-img">
          </div>
        </div>
        <div class="app-title-container">
          <h1 class="app-title">
            <span class="title-part-1">Vivekam's</span>
            <span class="title-part-2">SmartVest</span>
          </h1>
          <div class="app-subtitle">
            Learn to Earn - Interactive Investment Game
          </div>
        </div>
        <div class="header-stats">
          <div class="live-performance">
            <div class="status-indicator">
              <div class="status-dot"></div>
              <span>LIVE</span>
            </div>
            <div class="performance-value">+14.17% CAGR</div>
          </div>
        </div>
      </div>
      
      <!-- Compact Value Proposition -->
      <div class="value-proposition">
        <div class="value-content">
          <div class="tagline-main">
            No magic, just method. <span class="highlight-text">Real returns are earned, not wished for.</span>
          </div>
          <div class="value-points">
            <div class="value-point">
              <span class="point-icon">📊</span>
              <span>Visualize Investment Strategies</span>
            </div>
            <div class="value-point">
              <span class="point-icon">⚡</span>
              <span>Process-Based Investing</span>
            </div>
            <div class="value-point">
              <span class="point-icon">🏆</span>
              <span>Beat Market Returns</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Combined Performance & Chart Section -->
      <div class="main-dashboard">
        <div class="dashboard-left">
          <!-- Performance Metrics -->
          <div class="performance-grid">
            <div class="metric-card cagr">
              <div class="metric-icon">📈</div>
              <div class="metric-value">14.17%</div>
              <div class="metric-label">CAGR</div>
            </div>
            <div class="metric-card value">
              <div class="metric-icon">💰</div>
              <div class="metric-value">₹17.49L</div>
              <div class="metric-label">Final Value</div>
            </div>
            <div class="metric-card vs-nifty">
              <div class="metric-icon">🥇</div>
              <div class="metric-value">+3.05%</div>
              <div class="metric-label">vs Nifty</div>
            </div>
          </div>
          
          <!-- Investment Summary -->
          <div class="investment-summary">
            <h3>Investment Journey</h3>
            <div class="summary-stats">
              <div class="stat">
                <span class="stat-label">Start Date:</span>
                <span class="stat-value">14-Jan-2017</span>
              </div>
              <div class="stat">
                <span class="stat-label">Initial:</span>
                <span class="stat-value">₹10.00L</span>
              </div>
              <div class="stat">
                <span class="stat-label">Duration:</span>
                <span class="stat-value">8 Years</span>
              </div>
              <div class="stat highlight">
                <span class="stat-label">Returns:</span>
                <span class="stat-value">+74.9%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="dashboard-right">
          <!-- Simplified Chart -->
          <div class="chart-section">
            <div class="chart-header">
              <h3>Performance Visualization</h3>
              <div class="chart-legend">
                <span class="legend-item">
                  <span class="legend-color portfolio"></span>
                  Your Portfolio
                </span>
                <span class="legend-item">
                  <span class="legend-color nifty"></span>
                  NIFTY 50
                </span>
              </div>
            </div>
            
            <div class="chart-container">
              <svg class="chart-svg" viewBox="0 0 300 150">
                <defs>
                  <linearGradient id="portfolioGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:#4682B4;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#87CEEB;stop-opacity:1" />
                  </linearGradient>
                </defs>
                
                <!-- Portfolio line -->
                <path d="M 20,120 Q 80,100 150,80 Q 220,60 280,40" 
                      stroke="url(#portfolioGradient)" 
                      stroke-width="3" 
                      fill="none" 
                      class="chart-line portfolio-line"/>
                
                <!-- Nifty line -->
                <path d="M 20,120 Q 80,110 150,100 Q 220,90 280,80" 
                      stroke="#B0C4DE" 
                      stroke-width="2" 
                      fill="none" 
                      stroke-dasharray="5,5"
                      class="chart-line nifty-line"/>
                
                <!-- Key data points -->
                <circle cx="280" cy="40" r="4" fill="#87CEEB" class="data-point active"/>
                <circle cx="280" cy="80" r="3" fill="#B0C4DE" class="data-point"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Compact Action Section -->
      <div class="action-section">
        <div class="action-content">
          <div class="session-info">
            <div class="current-date">{{ currentDate }}</div>
            <div class="active-status">
              <div class="status-dot"></div>
              <span>{{ formatNumber(activeUsers) }}K Active Users</span>
            </div>
          </div>
          
          <div class="start-journey-container">
            <button class="start-journey-btn" @click="startJourney" :disabled="isStarting">
              <div class="btn-content">
                <span class="btn-icon">🚀</span>
                <span class="btn-text">
                  {{ isStarting ? 'STARTING...' : 'START YOUR JOURNEY' }}
                </span>
              </div>
            </button>
          </div>
          
          <div class="success-info">
            <div class="success-rate">{{ successRate }}% Success Rate</div>
            <div class="success-subtitle">Try and Test before you Trust</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Reactive state
const showSplash = ref(true);
const loadingProgress = ref(0);
const isStarting = ref(false);
const activeUsers = ref(1247);
const successRate = ref(89);

// Animation intervals
let statsInterval;

// Investment-focused icons only
const investmentIcons = ['📈', '📊', '💰', '🎯', '💎', '🏆', '⚡', '🎮'];

// Current date
const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short', 
    year: 'numeric'
  });
});

// Utility functions
const getInvestmentIcon = (index) => {
  return investmentIcons[index % investmentIcons.length];
};

const getFloatingStyle = (index) => {
  const delay = Math.random() * 3;
  const duration = 6 + Math.random() * 2;
  const size = 18 + Math.random() * 8;
  
  return {
    left: Math.random() * 100 + '%',
    animationDelay: delay + 's',
    animationDuration: duration + 's',
    fontSize: size + 'px'
  };
};

const getParticleStyle = (index) => {
  const size = 2 + Math.random() * 3;
  const duration = 12 + Math.random() * 6;
  const delay = Math.random() * 3;
  
  return {
    left: Math.random() * 100 + '%',
    width: size + 'px',
    height: size + 'px',
    animationDuration: duration + 's',
    animationDelay: delay + 's'
  };
};

const formatNumber = (num) => {
  if (num > 1000) {
    return (num / 1000).toFixed(1);
  }
  return num.toString();
};

// Actions
const startJourney = async () => {
  if (isStarting.value) return;
  
  isStarting.value = true;
  
  // Add some loading delay for effect
  setTimeout(() => {
    router.push('/journey');
  }, 1200);
};

// Lifecycle
onMounted(() => {
  // Splash screen loading animation
  const loadingInterval = setInterval(() => {
    loadingProgress.value += 3;
    if (loadingProgress.value >= 100) {
      clearInterval(loadingInterval);
      setTimeout(() => {
        showSplash.value = false;
      }, 600);
    }
  }, 50);
  
  // Animate stats
  statsInterval = setInterval(() => {
    activeUsers.value += Math.floor(Math.random() * 2);
    if (Math.random() > 0.8) {
      successRate.value = Math.min(95, successRate.value + 1);
    }
  }, 4000);
});

onUnmounted(() => {
  if (statsInterval) clearInterval(statsInterval);
});
</script>

<style scoped>
/* Splash Screen Optimized Styles */
.splash-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #E6F3FF 0%, #B8E6FF 50%, #87CEEB 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  overflow: hidden;
}

.splash-background {
  position: absolute;
  width: 100%;
  height: 100%;
}

.floating-icons {
  position: absolute;
  width: 100%;
  height: 100%;
}

.floating-icon {
  position: absolute;
  animation: floatUpSplash infinite linear;
  opacity: 0.4;
}

@keyframes floatUpSplash {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.4;
  }
  90% {
    opacity: 0.4;
  }
  100% {
    transform: translateY(-100px) rotate(180deg);
    opacity: 0;
  }
}

.splash-content {
  text-align: center;
  z-index: 2;
  position: relative;
}

.splash-logo-container {
  margin-bottom: 30px;
}

.splash-logo {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-rings {
  position: absolute;
  width: 100%;
  height: 100%;
}

.ring {
  position: absolute;
  border-radius: 50%;
  border: 2px solid rgba(70, 130, 180, 0.3);
}

.ring-1 {
  width: 100%;
  height: 100%;
  animation: ringRotate 4s linear infinite;
}

.ring-2 {
  width: 120%;
  height: 120%;
  top: -10%;
  left: -10%;
  animation: ringRotate 6s linear infinite reverse;
}

@keyframes ringRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.logo-center {
  z-index: 2;
  animation: logoFloat 3s infinite ease-in-out;
}

.logo-img {
  width: 50px;
  height: 50px;
  filter: drop-shadow(0 2px 8px rgba(70, 130, 180, 0.3));
}

@keyframes logoFloat {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-8px) scale(1.05); }
}

.splash-text {
  margin-bottom: 40px;
}

.splash-title {
  margin-bottom: 15px;
}

.title-vivekam {
  display: block;
  font-size: 2rem;
  font-weight: 300;
  color: #2C3E50;
  margin-bottom: 8px;
  letter-spacing: 2px;
}

.title-smartvest {
  display: block;
  font-size: 3.5rem;
  font-weight: 900;
  background: linear-gradient(45deg, #4682B4, #87CEEB);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: titleGradient 3s infinite alternate;
}

@keyframes titleGradient {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

.splash-tagline {
  font-size: 1.2rem;
  color: #34495E;
  font-weight: 500;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.loading-bar {
  width: 250px;
  height: 6px;
  background: rgba(70, 130, 180, 0.2);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
}

.loading-progress {
  height: 100%;
  background: linear-gradient(90deg, #4682B4, #87CEEB);
  border-radius: 3px;
  transition: width 0.1s ease;
  position: relative;
}

.loading-spark {
  position: absolute;
  right: -3px;
  top: -1px;
  width: 8px;
  height: 8px;
  background: radial-gradient(circle, #87CEEB, transparent);
  border-radius: 50%;
  animation: sparkPulse 1s infinite;
}

@keyframes sparkPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.7; }
}

.loading-text {
  font-weight: 600;
  color: #34495E;
  font-size: 1rem;
}

/* Main Page Optimized Styles */
.landing-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #F8FBFF 0%, #E6F3FF 50%, #F0F8FF 100%);
  position: relative;
  overflow-x: hidden;
}

.page-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.background-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(135, 206, 250, 0.08);
  animation: shapeFloat infinite ease-in-out;
}

.shape-1 {
  width: 300px;
  height: 300px;
  top: 10%;
  right: -50px;
  animation-duration: 20s;
}

.shape-2 {
  width: 200px;
  height: 200px;
  bottom: 10%;
  left: -50px;
  animation-duration: 25s;
  animation-delay: -10s;
}

@keyframes shapeFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.floating-particles {
  position: absolute;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  background: radial-gradient(circle, #87CEEB, transparent);
  border-radius: 50%;
  opacity: 0.3;
  animation: particleFloat infinite linear;
}

@keyframes particleFloat {
  0% {
    transform: translateY(100vh);
    opacity: 0;
  }
  10% {
    opacity: 0.3;
  }
  90% {
    opacity: 0.3;
  }
  100% {
    transform: translateY(-50px);
    opacity: 0;
  }
}

.landing-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  z-index: 1;
}

/* Compact Header */
.header-section {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 30px;
  margin-bottom: 30px;
  padding: 25px 30px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(70, 130, 180, 0.1);
  border: 1px solid rgba(135, 206, 250, 0.2);
  backdrop-filter: blur(10px);
}

.main-logo {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #E6F3FF, #B8E6FF);
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(70, 130, 180, 0.15);
  position: relative;
  overflow: visible;
}

.main-logo::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(70, 130, 180, 0.1), rgba(135, 206, 235, 0.1));
  border-radius: 20px;
  animation: logoGlow 4s infinite alternate;
}

@keyframes logoGlow {
  0% { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(1.05); opacity: 0.8; }
}

.main-logo .logo-img {
  width: 50px;
  height: 50px;
  z-index: 2;
}

.app-title {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.title-part-1 {
  font-size: 1.4rem;
  font-weight: 400;
  color: #34495E;
  letter-spacing: 1px;
}

.title-part-2 {
  font-size: 2.5rem;
  font-weight: 900;
  background: linear-gradient(45deg, #2C3E50, #4682B4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.app-subtitle {
  font-size: 1rem;
  color: #34495E;
  font-weight: 500;
  margin-top: 5px;
}

.header-stats {
  text-align: right;
}

.live-performance {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(76, 175, 80, 0.1);
  padding: 6px 12px;
  border-radius: 15px;
  border: 1px solid rgba(76, 175, 80, 0.3);
  font-size: 0.9rem;
  font-weight: 600;
}

.status-dot {
  width: 6px;
  height: 6px;
  background: #4CAF50;
  border-radius: 50%;
  animation: statusPulse 2s infinite;
}

@keyframes statusPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.performance-value {
  font-size: 1.3rem;
  font-weight: 900;
  color: #4CAF50;
}

/* Compact Value Proposition */
.value-proposition {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(135, 206, 250, 0.2);
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(70, 130, 180, 0.1);
  backdrop-filter: blur(10px);
}

.tagline-main {
  font-size: 1.2rem;
  color: #2C3E50;
  font-weight: 600;
  text-align: center;
  margin-bottom: 20px;
  line-height: 1.4;
}

.highlight-text {
  background: linear-gradient(45deg, #4682B4, #87CEEB);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
}

.value-points {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.value-point {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background: rgba(240, 248, 255, 0.5);
  border-radius: 15px;
  border: 1px solid rgba(70, 130, 180, 0.1);
  transition: all 0.3s ease;
}

.value-point:hover {
  background: rgba(230, 243, 255, 0.7);
  transform: translateY(-2px);
}

.point-icon {
  font-size: 1.5rem;
}

/* Main Dashboard - Combined Layout */
.main-dashboard {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 30px;
  margin-bottom: 30px;
}

.dashboard-left {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

/* Performance Grid */
.performance-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.metric-card {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(135, 206, 250, 0.2);
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(70, 130, 180, 0.1);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.metric-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(70, 130, 180, 0.15);
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #4682B4, #87CEEB);
}

.metric-icon {
  font-size: 1.8rem;
  margin-bottom: 10px;
}

.metric-value {
  font-size: 1.4rem;
  font-weight: 900;
  color: #2C3E50;
  margin-bottom: 5px;
  display: block;
}

.metric-label {
  font-size: 0.9rem;
  color: #34495E;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

/* Investment Summary */
.investment-summary {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(135, 206, 250, 0.2);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 8px 20px rgba(70, 130, 180, 0.1);
  backdrop-filter: blur(10px);
}

.investment-summary h3 {
  margin: 0 0 15px 0;
  color: #2C3E50;
  font-size: 1.2rem;
  font-weight: 700;
}

.summary-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(70, 130, 180, 0.1);
}

.stat.highlight {
  background: rgba(76, 175, 80, 0.1);
  padding: 8px 12px;
  border-radius: 8px;
  border-bottom: none;
  grid-column: 1 / -1;
}

.stat-label {
  font-size: 0.9rem;
  color: #34495E;
  font-weight: 500;
}

.stat-value {
  font-weight: 700;
  color: #2C3E50;
}

.stat.highlight .stat-value {
  color: #4CAF50;
  font-size: 1.1rem;
}

/* Chart Section */
.dashboard-right {
  display: flex;
  flex-direction: column;
}

.chart-section {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(135, 206, 250, 0.2);
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 8px 20px rgba(70, 130, 180, 0.1);
  backdrop-filter: blur(10px);
  flex: 1;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header h3 {
  margin: 0;
  color: #2C3E50;
  font-weight: 700;
  font-size: 1.2rem;
}

.chart-legend {
  display: flex;
  gap: 15px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: #34495E;
}

.legend-color {
  width: 12px;
  height: 3px;
  border-radius: 2px;
}

.legend-color.portfolio {
  background: linear-gradient(90deg, #4682B4, #87CEEB);
}

.legend-color.nifty {
  background: #B0C4DE;
}

.chart-container {
  height: 180px;
  background: linear-gradient(135deg, #F8FBFF, #E6F3FF);
  border-radius: 12px;
  border: 1px solid rgba(70, 130, 180, 0.1);
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-svg {
  width: 100%;
  height: 100%;
}

.chart-line {
  stroke-linecap: round;
  stroke-linejoin: round;
}

.data-point {
  transition: all 0.3s ease;
}

.data-point.active {
  animation: pointPulse 2s infinite;
}

@keyframes pointPulse {
  0%, 100% { r: 4; }
  50% { r: 5; }
}

/* Compact Action Section */
.action-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(70, 130, 180, 0.1);
  border: 1px solid rgba(135, 206, 250, 0.2);
  backdrop-filter: blur(10px);
}

.action-content {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 30px;
  align-items: center;
}

.session-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.current-date {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2C3E50;
}

.active-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: #34495E;
  font-weight: 500;
}

.start-journey-container {
  display: flex;
  justify-content: center;
}

.start-journey-btn {
  background: linear-gradient(135deg, #4682B4, #87CEEB);
  border: none;
  border-radius: 25px;
  padding: 18px 35px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(70, 130, 180, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.start-journey-btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 12px 30px rgba(70, 130, 180, 0.4);
}

.start-journey-btn:active {
  transform: translateY(0) scale(1);
}

.start-journey-btn:disabled {
  opacity: 0.8;
  cursor: not-allowed;
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
  font-weight: 900;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-icon {
  font-size: 1.3rem;
  animation: iconFloat 3s infinite ease-in-out;
}

@keyframes iconFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

.success-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
}

.success-rate {
  font-size: 1.2rem;
  font-weight: 900;
  color: #4CAF50;
}

.success-subtitle {
  font-size: 0.9rem;
  color: #34495E;
  font-weight: 500;
  font-style: italic;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .main-dashboard {
    grid-template-columns: 1fr;
    gap: 25px;
  }
  
  .dashboard-left {
    order: 2;
  }
  
  .dashboard-right {
    order: 1;
  }
  
  .action-content {
    grid-template-columns: 1fr;
    gap: 20px;
    text-align: center;
  }
  
  .header-section {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 20px;
  }
  
  .value-points {
    grid-template-columns: 1fr;
    gap: 15px;
  }
}

@media (max-width: 768px) {
  .landing-container {
    padding: 15px;
  }
  
  .header-section {
    padding: 20px;
  }
  
  .title-part-1 {
    font-size: 1.2rem;
  }
  
  .title-part-2 {
    font-size: 2rem;
  }
  
  .performance-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .summary-stats {
    grid-template-columns: 1fr;
  }
  
  .chart-container {
    height: 150px;
  }
  
  .start-journey-btn {
    padding: 15px 25px;
  }
  
  .btn-content {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .title-vivekam {
    font-size: 1.8rem;
  }
  
  .title-smartvest {
    font-size: 3rem;
  }
  
  .title-part-2 {
    font-size: 1.8rem;
  }
  
  .tagline-main {
    font-size: 1.1rem;
  }
  
  .chart-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .chart-legend {
    flex-direction: column;
    gap: 8px;
  }
}
</style>