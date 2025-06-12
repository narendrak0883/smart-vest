<template>
  <!-- Splash Screen -->
  <div v-if="showSplash" class="splash-screen">
    <div class="splash-background">
      <!-- Enhanced floating elements with investment icons -->
      <div class="floating-icons">
        <div v-for="n in 10" :key="n" class="floating-icon" :style="getFloatingStyle(n)">
          {{ getInvestmentIcon(n) }}
        </div>
      </div>
      <div class="splash-grid-pattern"></div>
    </div>
    <div class="splash-content">
      <div class="splash-logo-container">
        <div class="splash-logo">
          <div class="logo-rings">
            <div class="ring ring-1"></div>
            <div class="ring ring-2"></div>
          </div>
          <div class="logo-center">
            <div class="logo-inner">💎</div>
          </div>
        </div>
      </div>
      <div class="splash-text">
        <h1 class="splash-title">
          <span class="title-vivekam">Vivekam's</span>
          <span class="title-smartvest">SmartVest</span>
        </h1>
        <div class="splash-tagline">
          Interactive Investment Journey Simulator
        </div>
      </div>
      <div class="loading-container">
        <div class="loading-bar">
          <div class="loading-progress" :style="{ width: loadingProgress + '%' }"></div>
          <div class="loading-spark"></div>
        </div>
        <div class="loading-text">Preparing Your Journey {{ loadingProgress }}%</div>
      </div>
    </div>
  </div>

  <!-- Main Landing Page - Optimized for No Scroll -->
  <div v-else class="landing-page">
    <!-- Enhanced Background -->
    <div class="page-background">
      <div class="floating-shapes">
        <div v-for="n in 15" :key="n" class="shape" :style="getShapeStyle(n)"></div>
      </div>
      <div class="grid-pattern"></div>
    </div>

    <div class="landing-container">
      
      <!-- Compact Header Section -->
      <div class="header-section">
        <div class="logo-container">
          <div class="main-logo">
            <div class="logo-glow"></div>
            <div class="logo-inner">💎</div>
          </div>
        </div>
        <div class="app-title-container">
          <h1 class="app-title">
            <span class="title-part-1">Vivekam's</span>
            <span class="title-part-2">SmartVest</span>
          </h1>
          <div class="app-subtitle">
            Learn to Earn - Interactive Investment Journey
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
              <div class="point-icon-container">
                <span class="point-icon">📊</span>
              </div>
              <div class="point-content">
                <span class="point-title">Visualize</span>
                <span class="point-desc">Interactive simulation</span>
              </div>
            </div>
            <div class="value-point">
              <div class="point-icon-container">
                <span class="point-icon">⚡</span>
              </div>
              <div class="point-content">
                <span class="point-title">Process</span>
                <span class="point-desc">Systematic approach</span>
              </div>
            </div>
            <div class="value-point">
              <div class="point-icon-container">
                <span class="point-icon">🏆</span>
              </div>
              <div class="point-content">
                <span class="point-title">Beat Market</span>
                <span class="point-desc">Outperform returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Compact Dashboard Section -->
      <div class="main-dashboard">
        <div class="dashboard-left">
          <!-- Compact Performance Metrics -->
          <div class="performance-grid">
            <div class="metric-card cagr">
              <div class="metric-icon">📈</div>
              <div class="metric-value counting-animation" data-target="14.17">14.17%</div>
              <div class="metric-label">CAGR</div>
            </div>
            <div class="metric-card value">
              <div class="metric-icon">💰</div>
              <div class="metric-value counting-animation" data-target="17.49">₹17.49L</div>
              <div class="metric-label">Final Value</div>
            </div>
            <div class="metric-card vs-nifty">
              <div class="metric-icon">🥇</div>
              <div class="metric-value counting-animation" data-target="3.05">+3.05%</div>
              <div class="metric-label">vs Nifty</div>
            </div>
          </div>
          
          <!-- Compact Investment Summary -->
          <div class="investment-summary">
            <div class="summary-header">
              <div class="summary-icon">📈</div>
              <h3>Journey Summary</h3>
            </div>
            <div class="summary-stats">
              <div class="stat">
                <span class="stat-label">Start:</span>
                <span class="stat-value">14-Jan-2017</span>
              </div>
              <div class="stat">
                <span class="stat-label">Initial:</span>
                <span class="stat-value">₹10L</span>
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
          <!-- Compact Chart -->
          <div class="chart-section">
            <div class="chart-header">
              <div class="chart-title-container">
                <div class="chart-icon">📊</div>
                <h3>Performance</h3>
              </div>
              <div class="chart-legend">
                <span class="legend-item">
                  <span class="legend-color portfolio"></span>
                  Portfolio
                </span>
                <span class="legend-item">
                  <span class="legend-color nifty"></span>
                  NIFTY 50
                </span>
              </div>
            </div>
            
            <div class="chart-container">
              <svg class="chart-svg" viewBox="0 0 300 120">
                <defs>
                  <linearGradient id="portfolioGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:#1976d2;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#42a5f5;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#64b5f6;stop-opacity:1" />
                  </linearGradient>
                  <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#1976d2;stop-opacity:0.3" />
                    <stop offset="100%" style="stop-color:#42a5f5;stop-opacity:0.1" />
                  </linearGradient>
                </defs>
                
                <!-- Chart background area -->
                <path d="M 20,100 Q 80,80 150,60 Q 220,40 280,30 L 280,110 L 20,110 Z" 
                      fill="url(#chartGradient)" 
                      class="chart-area"/>
                
                <!-- Portfolio line -->
                <path d="M 20,100 Q 80,80 150,60 Q 220,40 280,30" 
                      stroke="url(#portfolioGradient)" 
                      stroke-width="3" 
                      fill="none" 
                      class="chart-line portfolio-line"/>
                
                <!-- Nifty line -->
                <path d="M 20,100 Q 80,90 150,80 Q 220,70 280,60" 
                      stroke="#90A4AE" 
                      stroke-width="2" 
                      fill="none" 
                      stroke-dasharray="6,3"
                      class="chart-line nifty-line"/>
                
                <!-- Animated data points -->
                <circle cx="280" cy="30" r="4" fill="#42a5f5" class="data-point active">
                  <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite"/>
                </circle>
                <circle cx="280" cy="60" r="3" fill="#90A4AE" class="data-point"/>
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
              <span>{{ formatNumber(activeUsers) }}K Active</span>
            </div>
          </div>
          
          <div class="start-journey-container">
            <button class="start-journey-btn" @click="startJourney" :disabled="isStarting">
              <div class="btn-content">
                <span class="btn-icon">🚀</span>
                <span class="btn-text">
                  {{ isStarting ? 'STARTING...' : 'START JOURNEY' }}
                </span>
              </div>
            </button>
          </div>
          
          <div class="success-info">
            <div class="success-rate">{{ successRate }}% Success</div>
            <div class="success-subtitle">Try before Trust</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted, nextTick } from 'vue';
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

// Investment-focused icons
const investmentIcons = ['📈', '📊', '💰', '🎯', '💎', '🏆', '⚡', '🎮', '🚀', '🌟'];

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
  const duration = 6 + Math.random() * 3;
  const size = 12 + Math.random() * 6;
  
  return {
    left: Math.random() * 100 + '%',
    animationDelay: delay + 's',
    animationDuration: duration + 's',
    fontSize: size + 'px'
  };
};

const getShapeStyle = (index) => {
  const size = 15 + Math.random() * 25;
  const duration = 12 + Math.random() * 8;
  const delay = Math.random() * 3;
  
  return {
    left: Math.random() * 100 + '%',
    top: Math.random() * 100 + '%',
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

const startJourney = async () => {
  if (isStarting.value) return;
  
  console.log('Starting journey navigation...');
  
  try {
    isStarting.value = true;
    
    // Add visual feedback delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    console.log('Navigating to journey...');
    
    // Simple navigation - try push first, then replace if it fails
    try {
      await router.push({ name: 'journey' });
      console.log('Navigation successful with router.push');
    } catch (error) {
      console.warn('Router.push failed, trying replace:', error);
      await router.replace('/journey');
      console.log('Navigation successful with router.replace');
    }
    
  } catch (error) {
    console.error('Navigation failed:', error);
    
    // Only use window.location as absolute last resort
    console.log('Using window.location as fallback');
    window.location.href = '/journey';
  } finally {
    // Reset loading state after navigation attempt
    setTimeout(() => {
      isStarting.value = false;
    }, 800);
  }
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
        // Trigger counting animations
        nextTick(() => {
          triggerCountingAnimations();
        });
      }, 400);
    }
  }, 40);
  
  // Animate stats
  statsInterval = setInterval(() => {
    activeUsers.value += Math.floor(Math.random() * 3);
    if (Math.random() > 0.7) {
      successRate.value = Math.min(96, successRate.value + 1);
    }
  }, 3000);
});

onUnmounted(() => {
  if (statsInterval) clearInterval(statsInterval);
});

// Counting animation function
const triggerCountingAnimations = () => {
  const elements = document.querySelectorAll('.counting-animation');
  elements.forEach(el => {
    const target = parseFloat(el.getAttribute('data-target'));
    if (target) {
      let current = 0;
      const increment = target / 40;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        
        if (el.textContent.includes('₹')) {
          el.textContent = `₹${current.toFixed(2)}L`;
        } else if (el.textContent.includes('%')) {
          el.textContent = `${current >= 0 ? '+' : ''}${current.toFixed(2)}%`;
        } else {
          el.textContent = `${current.toFixed(2)}%`;
        }
      }, 40);
    }
  });
};
</script>

<style scoped>
/* Optimized Splash Screen */
.splash-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 25%, #90caf9 50%, #64b5f6 75%, #42a5f5 100%);
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
  opacity: 0.6;
  filter: drop-shadow(0 0 8px rgba(25, 118, 210, 0.4));
}

@keyframes floatUpSplash {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.6;
  }
  90% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

.splash-grid-pattern {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(25, 118, 210, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(25, 118, 210, 0.1) 1px, transparent 1px);
  background-size: 40px 40px;
  animation: gridMove 25s infinite linear;
}

@keyframes gridMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(40px, 40px); }
}

.splash-content {
  text-align: center;
  z-index: 2;
  position: relative;
}

.splash-logo-container {
  margin-bottom: 25px;
}

.splash-logo {
  position: relative;
  width: 80px;
  height: 80px;
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
  border: 2px solid rgba(25, 118, 210, 0.3);
}

.ring-1 {
  width: 100%;
  height: 100%;
  animation: ringRotate 3s linear infinite;
  border-color: #1976d2;
}

.ring-2 {
  width: 120%;
  height: 120%;
  top: -10%;
  left: -10%;
  animation: ringRotate 4s linear infinite reverse;
  border-color: #42a5f5;
}

@keyframes ringRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.logo-center {
  z-index: 2;
  animation: logoFloat 2s infinite ease-in-out;
  background: linear-gradient(135deg, #1976d2, #42a5f5);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 20px rgba(25, 118, 210, 0.4);
}

.logo-inner {
  font-size: 1.5rem;
  animation: iconFloat 1.5s infinite ease-in-out;
}

@keyframes logoFloat {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-5px) scale(1.05); }
}

@keyframes iconFloat {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(10deg); }
}

.splash-text {
  margin-bottom: 30px;
}

.splash-title {
  margin-bottom: 15px;
}

.title-vivekam {
  display: block;
  font-size: 1.4rem;
  font-weight: 400;
  color: #0d47a1;
  margin-bottom: 5px;
  letter-spacing: 2px;
  text-shadow: 0 2px 4px rgba(25, 118, 210, 0.3);
}

.title-smartvest {
  display: block;
  font-size: 2.5rem;
  font-weight: 900;
  background: linear-gradient(45deg, #0d47a1, #1976d2, #42a5f5);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: titleGradient 3s infinite alternate;
  text-shadow: 0 4px 8px rgba(25, 118, 210, 0.3);
}

@keyframes titleGradient {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

.splash-tagline {
  font-size: 1rem;
  color: #1565c0;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.loading-bar {
  width: 250px;
  height: 6px;
  background: rgba(25, 118, 210, 0.2);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.loading-progress {
  height: 100%;
  background: linear-gradient(90deg, #1976d2, #42a5f5, #64b5f6);
  border-radius: 3px;
  transition: width 0.1s ease;
  position: relative;
  box-shadow: 0 0 10px rgba(33, 150, 243, 0.5);
}

.loading-spark {
  position: absolute;
  right: -3px;
  top: -1.5px;
  width: 9px;
  height: 9px;
  background: radial-gradient(circle, #64b5f6, transparent);
  border-radius: 50%;
  animation: sparkPulse 1s infinite;
}

@keyframes sparkPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.7; }
}

.loading-text {
  font-weight: 700;
  color: #0d47a1;
  font-size: 0.9rem;
  text-shadow: 0 2px 4px rgba(25, 118, 210, 0.2);
}

/* Main Page - Optimized for No Scroll */
.landing-page {
  height: 100%;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 25%, #90caf9 50%, #64b5f6 75%, #42a5f5 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
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

.floating-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  background: radial-gradient(circle, rgba(25, 118, 210, 0.2), rgba(33, 150, 243, 0.1));
  border-radius: 50%;
  animation: floatShape infinite ease-in-out;
}

@keyframes floatShape {
  0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
  50% { transform: translateY(-20px) rotate(180deg) scale(1.1); }
}

.grid-pattern {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(25, 118, 210, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(25, 118, 210, 0.1) 1px, transparent 1px);
  background-size: 40px 40px;
  animation: gridMove 25s infinite linear;
}

.landing-container {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
}

/* Compact Header */
.header-section {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 20px;
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 
    0 8px 20px rgba(25, 118, 210, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(25, 118, 210, 0.3);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.header-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #1976d2, #42a5f5, #64b5f6);
}

.main-logo {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1976d2, #42a5f5);
  border-radius: 15px;
  box-shadow: 0 6px 15px rgba(25, 118, 210, 0.3);
  position: relative;
  overflow: hidden;
}

.logo-glow {
  position: absolute;
  width: 120%;
  height: 120%;
  background: radial-gradient(circle, rgba(66, 165, 245, 0.4), transparent);
  animation: logoGlow 3s infinite alternate;
}

@keyframes logoGlow {
  0% { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(1.1); opacity: 0.8; }
}

.logo-inner {
  font-size: 1.5rem;
  z-index: 2;
  animation: iconFloat 2s infinite ease-in-out;
}

.app-title {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.title-part-1 {
  font-size: 1rem;
  font-weight: 400;
  color: #0d47a1;
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(25, 118, 210, 0.2);
}

.title-part-2 {
  font-size: 1.6rem;
  font-weight: 900;
  background: linear-gradient(45deg, #0d47a1, #1976d2, #42a5f5);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: titleGradient 3s infinite alternate;
  text-shadow: 0 4px 8px rgba(25, 118, 210, 0.3);
}

.app-subtitle {
  font-size: 0.8rem;
  color: #1565c0;
  font-weight: 600;
  margin-top: 4px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-stats {
  text-align: right;
}

.live-performance {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgba(76, 175, 80, 0.15);
  padding: 5px 10px;
  border-radius: 12px;
  border: 2px solid rgba(76, 175, 80, 0.3);
  font-size: 0.7rem;
  font-weight: 700;
  color: #2e7d32;
  box-shadow: 0 3px 8px rgba(76, 175, 80, 0.2);
}

.status-dot {
  width: 5px;
  height: 5px;
  background: #4CAF50;
  border-radius: 50%;
  animation: statusPulse 2s infinite;
  box-shadow: 0 0 6px rgba(76, 175, 80, 0.5);
}

@keyframes statusPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.2); }
}

.performance-value {
  font-size: 1rem;
  font-weight: 900;
  color: #4CAF50;
  text-shadow: 0 2px 4px rgba(76, 175, 80, 0.3);
}

/* Compact Value Proposition */
.value-proposition {
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(25, 118, 210, 0.3);
  border-radius: 15px;
  padding: 15px;
  box-shadow: 
    0 8px 20px rgba(25, 118, 210, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.value-proposition::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #1976d2, #42a5f5, #64b5f6);
}

.tagline-main {
  font-size: 1rem;
  color: #0d47a1;
  font-weight: 600;
  text-align: center;
  margin-bottom: 12px;
  line-height: 1.3;
  text-shadow: 0 2px 4px rgba(25, 118, 210, 0.2);
}

.highlight-text {
  background: linear-gradient(45deg, #1976d2, #42a5f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
}

.value-points {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.value-point {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: rgba(227, 242, 253, 0.5);
  border-radius: 12px;
  border: 2px solid rgba(25, 118, 210, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.value-point:hover {
  background: rgba(227, 242, 253, 0.8);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(25, 118, 210, 0.2);
  border-color: #1976d2;
}

.point-icon-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  background: linear-gradient(135deg, #1976d2, #42a5f5);
  border-radius: 50%;
  box-shadow: 0 4px 10px rgba(25, 118, 210, 0.3);
}

.point-icon {
  font-size: 1.1rem;
  z-index: 2;
}

.point-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.point-title {
  font-size: 0.85rem;
  font-weight: 800;
  color: #0d47a1;
  text-shadow: 0 1px 3px rgba(25, 118, 210, 0.2);
}

.point-desc {
  font-size: 0.7rem;
  color: #1565c0;
  font-weight: 500;
}

/* Compact Dashboard */
.main-dashboard {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 15px;
  flex: 1;
  min-height: 0;
}

.dashboard-left {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Compact Performance Grid */
.performance-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.metric-card {
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(25, 118, 210, 0.3);
  border-radius: 12px;
  padding: 12px 8px;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 
    0 6px 15px rgba(25, 118, 210, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.metric-card:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 20px rgba(25, 118, 210, 0.3);
  border-color: #1976d2;
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #1976d2, #42a5f5);
}

.metric-icon {
  font-size: 1.3rem;
  margin-bottom: 6px;
  filter: drop-shadow(0 2px 4px rgba(25, 118, 210, 0.3));
  animation: iconFloat 2.5s infinite ease-in-out;
}

.metric-value {
  font-size: 1rem;
  font-weight: 900;
  color: #0d47a1;
  margin-bottom: 4px;
  display: block;
  text-shadow: 0 2px 4px rgba(25, 118, 210, 0.3);
}

.metric-label {
  font-size: 0.7rem;
  color: #1565c0;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-weight: 700;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Compact Investment Summary */
.investment-summary {
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(25, 118, 210, 0.3);
  border-radius: 12px;
  padding: 15px;
  box-shadow: 
    0 6px 15px rgba(25, 118, 210, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  position: relative;
}

.investment-summary::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #1976d2, #42a5f5);
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  padding-bottom: 6px;
  border-bottom: 2px solid rgba(25, 118, 210, 0.1);
}

.summary-icon {
  font-size: 1.1rem;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.2), rgba(33, 150, 243, 0.1));
  border-radius: 50%;
  border: 2px solid rgba(25, 118, 210, 0.4);
  animation: iconPulse 2s infinite alternate;
}

@keyframes iconPulse {
  0% { box-shadow: 0 0 6px rgba(25, 118, 210, 0.3); }
  100% { box-shadow: 0 0 12px rgba(33, 150, 243, 0.5); }
}

.investment-summary h3 {
  margin: 0;
  color: #0d47a1;
  font-size: 1rem;
  font-weight: 800;
  text-shadow: 0 2px 4px rgba(25, 118, 210, 0.2);
}

.summary-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid rgba(25, 118, 210, 0.1);
  font-size: 0.8rem;
}

.stat.highlight {
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.15), rgba(33, 150, 243, 0.1));
  padding: 8px 12px;
  border-radius: 8px;
  border-bottom: none;
  grid-column: 1 / -1;
  border: 2px solid rgba(25, 118, 210, 0.3);
  box-shadow: 0 3px 8px rgba(25, 118, 210, 0.2);
}

.stat-label {
  font-weight: 600;
  color: #1565c0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-weight: 800;
  color: #0d47a1;
  text-shadow: 0 1px 3px rgba(25, 118, 210, 0.2);
}

.stat.highlight .stat-value {
  color: #4CAF50;
  font-size: 0.9rem;
  text-shadow: 0 2px 4px rgba(76, 175, 80, 0.3);
}

/* Compact Chart Section */
.dashboard-right {
  display: flex;
  flex-direction: column;
}

.chart-section {
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(25, 118, 210, 0.3);
  border-radius: 12px;
  padding: 15px;
  box-shadow: 
    0 6px 15px rgba(25, 118, 210, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  flex: 1;
  position: relative;
}

.chart-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #1976d2, #42a5f5);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.chart-title-container {
  display: flex;
  align-items: center;
  gap: 6px;
}

.chart-icon {
  font-size: 1.1rem;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.2), rgba(33, 150, 243, 0.1));
  border-radius: 50%;
  border: 2px solid rgba(25, 118, 210, 0.4);
}

.chart-header h3 {
  margin: 0;
  color: #0d47a1;
  font-weight: 800;
  font-size: 1rem;
  text-shadow: 0 2px 4px rgba(25, 118, 210, 0.2);
}

.chart-legend {
  display: flex;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.7rem;
  color: #1565c0;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.legend-color {
  width: 10px;
  height: 3px;
  border-radius: 1.5px;
}

.legend-color.portfolio {
  background: linear-gradient(90deg, #1976d2, #42a5f5);
}

.legend-color.nifty {
  background: #90A4AE;
}

.chart-container {
  height: 100px;
  background: linear-gradient(135deg, rgba(227, 242, 253, 0.5), rgba(240, 248, 255, 0.3));
  border-radius: 10px;
  border: 2px solid rgba(25, 118, 210, 0.2);
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.chart-svg {
  width: 100%;
  height: 100%;
  z-index: 2;
}

.chart-line {
  stroke-linecap: round;
  stroke-linejoin: round;
}

.portfolio-line {
  animation: lineGrow 2s ease-out;
}

.nifty-line {
  animation: lineGrow 2s ease-out 0.5s both;
}

@keyframes lineGrow {
  from {
    stroke-dasharray: 600;
    stroke-dashoffset: 600;
  }
  to {
    stroke-dasharray: 600;
    stroke-dashoffset: 0;
  }
}

.data-point {
  transition: all 0.3s ease;
}

/* Compact Action Section */
.action-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 15px;
  box-shadow: 
    0 8px 20px rgba(25, 118, 210, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(25, 118, 210, 0.3);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.action-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #1976d2, #42a5f5, #64b5f6);
}

.action-content {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 20px;
  align-items: center;
  position: relative;
  z-index: 2;
}

.session-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.current-date {
  font-size: 0.9rem;
  font-weight: 800;
  color: #0d47a1;
  text-shadow: 0 2px 4px rgba(25, 118, 210, 0.3);
}

.active-status {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.7rem;
  color: #1565c0;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.start-journey-container {
  display: flex;
  justify-content: center;
}

.start-journey-btn {
  background: linear-gradient(135deg, #1976d2, #42a5f5);
  border: none;
  border-radius: 20px;
  padding: 12px 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 15px rgba(25, 118, 210, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.start-journey-btn:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 8px 20px rgba(25, 118, 210, 0.5);
}

.start-journey-btn:active {
  transform: translateY(-1px) scale(1.01);
}

.start-journey-btn:disabled {
  opacity: 0.8;
  cursor: not-allowed;
  transform: none;
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-weight: 900;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 2;
}

.btn-icon {
  font-size: 1rem;
  animation: iconFloat 2.5s infinite ease-in-out;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.success-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.success-rate {
  font-size: 1rem;
  font-weight: 900;
  color: #4CAF50;
  text-shadow: 0 2px 4px rgba(76, 175, 80, 0.3);
}

.success-subtitle {
  font-size: 0.7rem;
  color: #1565c0;
  font-weight: 600;
  font-style: italic;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Counting Animation */
.counting-animation {
  transition: all 0.3s ease;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .main-dashboard {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .dashboard-left {
    order: 2;
  }
  
  .dashboard-right {
    order: 1;
  }
  
  .action-content {
    grid-template-columns: 1fr;
    gap: 12px;
    text-align: center;
  }
  
  .header-section {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 12px;
  }
  
  .value-points {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}

@media (max-width: 768px) {
  .landing-container {
    padding: 8px;
    gap: 8px;
  }
  
  .header-section {
    padding: 12px;
  }
  
  .title-part-1 {
    font-size: 0.9rem;
  }
  
  .title-part-2 {
    font-size: 1.4rem;
  }
  
  .performance-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .summary-stats {
    grid-template-columns: 1fr;
  }
  
  .chart-container {
    height: 80px;
  }
  
  .start-journey-btn {
    padding: 10px 20px;
  }
  
  .btn-content {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .title-vivekam {
    font-size: 1.2rem;
  }
  
  .title-smartvest {
    font-size: 2rem;
  }
  
  .title-part-2 {
    font-size: 1.2rem;
  }
  
  .tagline-main {
    font-size: 0.9rem;
  }
  
  .chart-header {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
  
  .chart-legend {
    flex-direction: column;
    gap: 6px;
  }
  
  .value-point {
    flex-direction: column;
    text-align: center;
    gap: 6px;
  }
}
</style>