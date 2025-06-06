<template>
  <div class="journey-view">
    <!-- Animated Background (unchanged) -->
    <div class="journey-background">
      <div class="floating-shapes">
        <div v-for="n in 15" :key="n" class="shape" :style="getShapeStyle(n)"></div>
      </div>
      <div class="grid-pattern"></div>
    </div>

    <!-- Main Journey Container -->
    <div class="journey-container">

      <!-- Phase 1: Journey Setup Form (identical to before) -->
      <div v-if="currentPhase === 'setup'" class="setup-phase">
        <div class="setup-header">
          <div class="setup-icon">🎮</div>
          <h1 class="setup-title">Start Your Investment Journey</h1>
          <div class="setup-subtitle">Configure your adventure settings</div>
        </div>

        <div class="setup-form">
          <div class="form-section">
            <div class="section-header">
              <div class="section-icon">📅</div>
              <h3>Select Journey Date</h3>
            </div>
            <div class="date-selector">
              <div class="date-input-group">
                <label>Start Date</label>
                <input 
                  type="date" 
                  v-model="journeySetup.startDate" 
                  class="date-input"
                  :max="new Date().toISOString().split('T')[0]"
                />
              </div>
            </div>
          </div>

          <div class="form-section">
            <div class="section-header">
              <div class="section-icon">📦</div>
              <h3>Choose Investment Product</h3>
            </div>
            <div class="product-selector">
              <div 
                v-for="product in availableProducts" 
                :key="product.id"
                :class="['product-card', { active: journeySetup.selectedProduct === product.id }]"
                @click="selectProduct(product.id)"
              >
                <div class="product-icon">{{ product.icon }}</div>
                <div class="product-name">{{ product.name }}</div>
                <div class="product-description">{{ product.description }}</div>
                <div class="product-risk">
                  <span class="risk-label">Risk:</span>
                  <div class="risk-stars">
                    <span v-for="n in 5" :key="n" :class="['star', { filled: n <= product.risk }]">⭐</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="form-section">
            <div class="section-header">
              <div class="section-icon">💰</div>
              <h3>Investment Amount</h3>
            </div>
            <div class="amount-selector">
              <div class="amount-input-group">
                <label>Initial Investment (₹)</label>
                <input 
                  type="number" 
                  v-model="journeySetup.amount" 
                  class="amount-input"
                  min="10000"
                  max="10000000"
                  step="1000"
                  placeholder="Enter amount"
                />
                <div class="amount-suggestions">
                  <button 
                    v-for="amount in suggestedAmounts" 
                    :key="amount"
                    class="amount-btn"
                    @click="journeySetup.amount = amount"
                    :class="{ active: journeySetup.amount === amount }"
                  >
                    ₹{{ formatAmount(amount) }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="setup-actions">
            <button 
              class="continue-btn"
              @click="proceedToDiceRoll"
              :disabled="!isSetupComplete"
            >
              <span class="btn-icon">🎲</span>
              <span class="btn-text">PROCEED TO DICE ROLL</span>
              <span class="btn-arrow">→</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Phase 2: Dice Rolling Game (identical to before) -->
      <div v-if="currentPhase === 'dice'" class="dice-phase">
        <div class="dice-header">
          <h2 class="dice-title">Roll the Dice to Determine Journey Length</h2>
          <div class="dice-subtitle">Roll at least 2 dice to unlock your investment timeline</div>
          <div class="dice-progress">
            <div class="progress-text">Rolls Completed: {{ diceRolls.length }} / {{ minRolls }}</div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: (diceRolls.length / minRolls) * 100 + '%' }"></div>
            </div>
          </div>
        </div>

        <div class="dice-arena">
          <div class="dice-container">
            <div 
              v-for="(dice, index) in activeDice" 
              :key="index"
              :class="['dice-cube', { rolling: dice.isRolling }]"
              :style="getDiceStyle(index)"
            >
              <div class="dice-face front">{{ dice.value }}</div>
              <div class="dice-face back">{{ dice.value }}</div>
              <div class="dice-face right">{{ dice.value }}</div>
              <div class="dice-face left">{{ dice.value }}</div>
              <div class="dice-face top">{{ dice.value }}</div>
              <div class="dice-face bottom">{{ dice.value }}</div>
              <div class="dice-glow"></div>
            </div>
          </div>

          <div class="dice-results">
            <div v-if="diceRolls.length > 0" class="results-display">
              <h3>Roll Results:</h3>
              <div class="results-grid">
                <div 
                  v-for="(result, index) in diceRolls" 
                  :key="index"
                  class="result-item"
                >
                  <div class="result-dice">🎲</div>
                  <div class="result-value">{{ result }}</div>
                  <div class="result-label">Roll {{ index + 1 }}</div>
                </div>
              </div>
              <div class="total-days">
                <div class="total-label">Total Journey Days:</div>
                <div class="total-value">{{ totalDays }}</div>
              </div>
            </div>
          </div>

          <div class="dice-controls">
            <button 
              class="roll-btn"
              @click="rollDice"
              :disabled="isRolling || (diceRolls.length >= maxRolls)"
            >
              <div class="roll-btn-content">
                <span class="roll-icon">🎲</span>
                <span class="roll-text">
                  {{ isRolling ? 'ROLLING...' : 'ROLL DICE' }}
                </span>
              </div>
              <div class="roll-particles">
                <span v-for="n in 6" :key="n" class="particle">✨</span>
              </div>
            </button>

            <div v-if="diceRolls.length >= minRolls" class="journey-controls">
              <button class="start-journey-btn" @click="startInvestmentJourney">
                <span class="journey-icon">🚀</span>
                <span class="journey-text">START JOURNEY</span>
              </button>
              
              <button 
                v-if="diceRolls.length < maxRolls"
                class="roll-more-btn" 
                @click="rollDice"
                :disabled="isRolling"
              >
                <span class="more-icon">🎯</span>
                <span class="more-text">ROLL MORE</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Phase 3: Investment Journey Display (Modified) -->
      <div v-if="currentPhase === 'journey'" class="journey-phase">
        <!-- New two-column wrapper -->
        <div class="journey-content">
          
          <!-- Left: Bot Panel -->
          <div class="bot-panel">
            <div class="bot-container">
              <div class="bot-avatar">🤖</div>
              <div class="bot-message">
                {{ botMessage }}
              </div>
            </div>
          </div>

          <!-- Right: Data View (unchanged content) -->
          <div class="data-panel">
            <!-- Timeline Section -->
            <div class="timeline-section">
              <div class="timeline-header">
                <h2 class="timeline-title">
                  <span class="title-icon">📈</span>
                  Your Investment Journey
                  <span class="journey-badge">{{ totalDays }} DAYS</span>
                </h2>
              </div>
              
              <div class="timeline-wrapper">
                <div class="timeline-controls">
                  <button 
                    class="nav-btn prev" 
                    @click="previousDay"
                    :disabled="currentDayIndex === 0"
                  >
                    ←
                  </button>
                  
                  <div class="timeline-container">
                    <div class="timeline-line"></div>
                    <div 
                      v-for="(day, index) in journeyDays" 
                      :key="index"
                      :class="['timeline-node', { 
                        active: index === currentDayIndex,
                        'has-events': day.events && day.events.length > 0 
                      }]"
                      @click="goToDay(index)"
                    >
                      <div class="node-circle">
                        <span class="node-number">{{ index + 1 }}</span>
                      </div>
                      <div class="node-date">{{ formatDate(day.date) }}</div>
                      <div v-if="day.events && day.events.length > 0" class="event-indicators">
                        <div 
                          v-for="event in day.events" 
                          :key="event.type"
                          :class="['event-dot', event.type.toLowerCase()]"
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    class="nav-btn next" 
                    @click="nextDay"
                    :disabled="currentDayIndex === journeyDays.length - 1"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>

            <!-- Portfolio Section -->
            <div class="portfolio-display">
              <div class="portfolio-grid">
                
                <!-- Start Portfolio -->
                <div class="portfolio-card start-card">
                  <div class="card-header">
                    <div class="card-icon">🎯</div>
                    <h3 class="card-title">START PORTFOLIO</h3>
                    <div class="card-subtitle">Day 1: {{ formatDate(journeyDays[0]?.date) }}</div>
                  </div>
                  <div class="card-content">
                    <div class="portfolio-stocks">
                      <div 
                        v-for="stock in startPortfolio" 
                        :key="stock.name"
                        class="stock-item"
                      >
                        <div class="stock-info">
                          <div class="stock-name">{{ stock.name }}</div>
                          <div class="stock-details">{{ stock.shares }} shares @ ₹{{ stock.price }}</div>
                        </div>
                        <div class="stock-value">₹{{ formatCurrency(stock.value) }}</div>
                      </div>
                    </div>
                    <div class="portfolio-summary">
                      <div class="summary-item">
                        <span>Cash:</span>
                        <span>₹{{ formatCurrency(startCash) }}</span>
                      </div>
                      <div class="summary-item total">
                        <span>Total Value:</span>
                        <span>₹{{ formatCurrency(startTotal) }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Current Day View -->
                <div class="portfolio-card current-card">
                  <div class="card-header">
                    <div class="card-icon">📊</div>
                    <h3 class="card-title">DAY {{ currentDayIndex + 1 }} SNAPSHOT</h3>
                    <div class="card-subtitle">{{ formatDate(currentDay?.date) }}</div>
                  </div>
                  
                  <div class="card-content">
                    <!-- Day Events -->
                    <div v-if="currentDayEvents.length > 0" class="day-events">
                      <h4 class="events-title">📈 Today's Transactions</h4>
                      <div 
                        v-for="(event, index) in currentDayEvents" 
                        :key="index"
                        :class="['event-card', event.type.toLowerCase()]"
                      >
                        <div class="event-header">
                          <div class="event-type">{{ event.type }}</div>
                          <div class="event-stock">{{ event.stock }}</div>
                        </div>
                        <div class="event-details">
                          <div class="detail-row">
                            <span>Quantity:</span>
                            <span>{{ event.quantity }} shares</span>
                          </div>
                          <div class="detail-row">
                            <span>Price:</span>
                            <span>₹{{ event.price }}</span>
                          </div>
                          <div class="detail-row">
                            <span>Total:</span>
                            <span>₹{{ formatCurrency(event.quantity * event.price) }}</span>
                          </div>
                        </div>
                        
                        <!-- Bot Advisor (for this event) -->
                        <div class="bot-advisor">
                          <div class="bot-avatar">🤖</div>
                          <div class="bot-message">{{ getBotComment(event) }}</div>
                        </div>
                      </div>
                    </div>

                    <div v-else class="no-events">
                      <div class="no-events-icon">😌</div>
                      <div class="no-events-text">No transactions today</div>
                      <div class="bot-advisor">
                        <div class="bot-avatar">🤖</div>
                        <div class="bot-message">Sometimes the best investment action is patience!</div>
                      </div>
                    </div>

                    <!-- Current Holdings -->
                    <div class="current-holdings">
                      <h4 class="holdings-title">💼 Current Portfolio Status</h4>
                      <div class="holdings-stats">
                        <div class="stat-card">
                          <div class="stat-icon">💰</div>
                          <div class="stat-value">₹{{ formatCurrency(currentDay?.portfolio?.cash || 0) }}</div>
                          <div class="stat-label">Cash</div>
                        </div>
                        <div class="stat-card">
                          <div class="stat-icon">📈</div>
                          <div class="stat-value">₹{{ formatCurrency(currentDay?.portfolio?.totalValue || 0) }}</div>
                          <div class="stat-label">Portfolio Value</div>
                        </div>
                        <div class="stat-card">
                          <div class="stat-icon">🎯</div>
                          <div :class="['stat-value', currentDay?.portfolio?.percentChange >= 0 ? 'positive' : 'negative']">
                            {{ currentDay?.portfolio?.percentChange >= 0 ? '+' : '' }}{{ (currentDay?.portfolio?.percentChange || 0).toFixed(1) }}%
                          </div>
                          <div class="stat-label">Performance</div>
                        </div>
                        <div class="stat-card">
                          <div class="stat-icon">🏆</div>
                          <div :class="['stat-value', versusNifty >= 0 ? 'positive' : 'negative']">
                            {{ versusNifty >= 0 ? '+' : '' }}{{ versusNifty.toFixed(1) }}%
                          </div>
                          <div class="stat-label">vs NIFTY</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Final Portfolio -->
                <div class="portfolio-card final-card">
                  <div class="card-header">
                    <div class="card-icon">🏆</div>
                    <h3 class="card-title">FINAL PORTFOLIO</h3>
                    <div class="card-subtitle">Day {{ journeyDays.length }}: {{ formatDate(journeyDays[journeyDays.length - 1]?.date) }}</div>
                  </div>
                  <div class="card-content">
                    <div class="portfolio-stocks">
                      <div 
                        v-for="stock in finalPortfolio" 
                        :key="stock.name"
                        class="stock-item"
                      >
                        <div class="stock-info">
                          <div class="stock-name">{{ stock.name }}</div>
                          <div class="stock-details">{{ stock.shares }} shares @ ₹{{ stock.price }}</div>
                        </div>
                        <div class="stock-value">₹{{ formatCurrency(stock.value) }}</div>
                      </div>
                    </div>
                    <div class="portfolio-summary">
                      <div class="summary-item">
                        <span>Cash:</span>
                        <span>₹{{ formatCurrency(finalCash) }}</span>
                      </div>
                      <div class="summary-item total">
                        <span>Total Value:</span>
                        <span>₹{{ formatCurrency(finalTotal) }}</span>
                      </div>
                      <div class="summary-item performance">
                        <span>Performance:</span>
                        <span :class="['value', finalPerformance >= 0 ? 'positive' : 'negative']">
                          {{ finalPerformance >= 0 ? '+' : '' }}{{ finalPerformance.toFixed(1) }}%
                        </span>
                      </div>
                      <div class="summary-item vs-nifty">
                        <span>vs NIFTY:</span>
                        <span :class="['value', finalVsNifty >= 0 ? 'positive' : 'negative']">
                          {{ finalVsNifty >= 0 ? '+' : '' }}{{ finalVsNifty.toFixed(1) }}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Performance Chart -->
              <div class="chart-section">
                <div class="chart-header">
                  <h3 class="chart-title">
                    <span class="chart-icon">📊</span>
                    Portfolio vs NIFTY Performance
                  </h3>
                  <div class="chart-legend">
                    <div class="legend-item">
                      <div class="legend-color portfolio"></div>
                      <span>Your Portfolio</span>
                    </div>
                    <div class="legend-item">
                      <div class="legend-color nifty"></div>
                      <span>NIFTY 50</span>
                    </div>
                  </div>
                </div>
                <div class="chart-container">
                  <!-- SVG Chart will be rendered here -->
                  <svg class="performance-chart" viewBox="0 0 800 300">
                    <!-- Grid lines -->
                    <defs>
                      <pattern id="grid" width="50" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 50 0 L 0 0 0 30" fill="none" stroke="rgba(70, 130, 180, 0.1)" stroke-width="1"/>
                      </pattern>
                    </defs>
                    <rect width="800" height="300" fill="url(#grid)" />
                    
                    <!-- Portfolio line -->
                    <path 
                      :d="portfolioPath" 
                      fill="none" 
                      stroke="#4682B4" 
                      stroke-width="3" 
                      stroke-linecap="round"
                    />
                    
                    <!-- NIFTY line -->
                    <path 
                      :d="niftyPath" 
                      fill="none" 
                      stroke="#B0C4DE" 
                      stroke-width="2" 
                      stroke-dasharray="5,5"
                    />
                    
                    <!-- Data points -->
                    <circle 
                      v-for="(point, index) in chartPoints" 
                      :key="index"
                      :cx="point.x" 
                      :cy="point.portfolioY" 
                      :r="index === currentDayIndex ? 6 : 4"
                      fill="#4682B4" 
                      :class="{ active: index === currentDayIndex }"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Journey Actions (unchanged) -->
            <div class="journey-actions">
              <button class="action-btn primary" @click="startNewJourney">
                <span class="btn-icon">🔄</span>
                <span class="btn-text">NEW JOURNEY</span>
              </button>
              <button class="action-btn secondary" @click="exitJourney">
                <span class="btn-icon">🏠</span>
                <span class="btn-text">EXIT JOURNEY</span>
              </button>
              <button class="action-btn success">
                <span class="btn-icon">💾</span>
                <span class="btn-text">SAVE & CONTINUE</span>
              </button>
            </div>
          </div> <!-- /.data-panel -->

        </div> <!-- /.journey-content -->
      </div> <!-- /.journey-phase -->

    </div> <!-- /.journey-container -->
  </div> <!-- /.journey-view -->
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Phase management
const currentPhase = ref('setup'); // 'setup', 'dice', 'journey'

// Setup form data
const journeySetup = ref({
  startDate: '',
  selectedProduct: '',
  amount: 100000
});

// Available products
const availableProducts = ref([
  {
    id: 'balanced',
    name: 'Balanced Portfolio',
    description: 'Moderate risk with diversified investments',
    icon: '⚖️',
    risk: 3
  },
  {
    id: 'growth',
    name: 'Growth Portfolio',
    description: 'Higher risk with growth-focused stocks',
    icon: '🚀',
    risk: 4
  },
  {
    id: 'conservative',
    name: 'Conservative Portfolio',
    description: 'Lower risk with stable investments',
    icon: '🛡️',
    risk: 2
  }
]);

const suggestedAmounts = ref([50000, 100000, 250000, 500000, 1000000]);

// Dice rolling state
const activeDice = ref([]);
const diceRolls = ref([]);
const isRolling = ref(false);
const minRolls = ref(2);
const maxRolls = ref(5);

// Journey data
const journeyDays = ref([]);
const currentDayIndex = ref(0);

// Mock portfolio data
const startPortfolio = ref([
  { name: 'Stock A', shares: 55, price: 450, value: 24750 },
  { name: 'Stock B', shares: 20, price: 1200, value: 24000 },
  { name: 'Stock C', shares: 32, price: 780, value: 24960 },
  { name: 'Stock D', shares: 75, price: 330, value: 24750 }
]);

const finalPortfolio = ref([
  { name: 'Stock A', shares: 55, price: 485, value: 26675 },
  { name: 'Stock B', shares: 20, price: 1285, value: 25700 },
  { name: 'Stock C', shares: 32, price: 825, value: 26400 },
  { name: 'Stock E', shares: 45, price: 590, value: 26550 }
]);

// Computed properties
const isSetupComplete = computed(() => {
  return journeySetup.value.startDate && 
         journeySetup.value.selectedProduct && 
         journeySetup.value.amount >= 10000;
});

const totalDays = computed(() => {
  return diceRolls.value.reduce((sum, roll) => sum + roll, 0) + 5; // Base 5 days + dice rolls
});

const currentDay = computed(() => {
  return journeyDays.value[currentDayIndex.value];
});

const currentDayEvents = computed(() => {
  return currentDay.value?.events || [];
});

const startCash = computed(() => 0);
const startTotal = computed(() => {
  return startPortfolio.value.reduce((sum, stock) => sum + stock.value, 0) + startCash.value;
});

const finalCash = computed(() => 1000);
const finalTotal = computed(() => {
  return finalPortfolio.value.reduce((sum, stock) => sum + stock.value, 0) + finalCash.value;
});

const finalPerformance = computed(() => {
  return ((finalTotal.value - startTotal.value) / startTotal.value) * 100;
});

const finalVsNifty = computed(() => 4.6);

const versusNifty = computed(() => {
  const dayData = currentDay.value;
  return dayData?.portfolio?.percentChange - dayData?.portfolio?.niftyChange || 0;
});

// Chart data
const chartPoints = computed(() => {
  if (!journeyDays.value.length) return [];
  
  return journeyDays.value.map((day, index) => {
    const x = 100 + (index * 600 / (journeyDays.value.length - 1));
    const portfolioY = 250 - (day.portfolio?.percentChange || 0) * 8;
    const niftyY = 250 - (day.portfolio?.niftyChange || 0) * 8;
    
    return { x, portfolioY, niftyY };
  });
});

const portfolioPath = computed(() => {
  if (chartPoints.value.length < 2) return '';
  
  let path = `M ${chartPoints.value[0].x} ${chartPoints.value[0].portfolioY}`;
  for (let i = 1; i < chartPoints.value.length; i++) {
    path += ` L ${chartPoints.value[i].x} ${chartPoints.value[i].portfolioY}`;
  }
  return path;
});

const niftyPath = computed(() => {
  if (chartPoints.value.length < 2) return '';
  
  let path = `M ${chartPoints.value[0].x} ${chartPoints.value[0].niftyY}`;
  for (let i = 1; i < chartPoints.value.length; i++) {
    path += ` L ${chartPoints.value[i].x} ${chartPoints.value[i].niftyY}`;
  }
  return path;
});

// NEW: botMessage computed property for left panel
const botMessage = computed(() => {
  // If there is at least one event today, use the first event for a comment
  if (currentDayEvents.value.length > 0) {
    return getBotComment(currentDayEvents.value[0]);
  } else {
    return "Hello! I’m your SmartVest assistant. Let me guide you through today’s data.";
  }
});

// Methods
const getShapeStyle = (index) => {
  const size = 20 + Math.random() * 40;
  const duration = 15 + Math.random() * 10;
  const delay = Math.random() * 5;
  
  return {
    left: Math.random() * 100 + '%',
    top: Math.random() * 100 + '%',
    width: size + 'px',
    height: size + 'px',
    animationDuration: duration + 's',
    animationDelay: delay + 's'
  };
};

const formatAmount = (amount) => {
  if (amount >= 1000000) {
    return (amount / 1000000) + 'M';
  } else if (amount >= 1000) {
    return (amount / 1000) + 'K';
  }
  return amount.toString();
};

const formatCurrency = (value) => {
  return value.toLocaleString('en-IN');
};

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short'
  });
};

const selectProduct = (productId) => {
  journeySetup.value.selectedProduct = productId;
};

const proceedToDiceRoll = () => {
  if (isSetupComplete.value) {
    currentPhase.value = 'dice';
    initializeDice();
  }
};

const initializeDice = () => {
  activeDice.value = [
    { value: 1, isRolling: false },
    { value: 1, isRolling: false }
  ];
};

const getDiceStyle = (index) => {
  const offset = index * 120 - 60;
  return {
    transform: `translateX(${offset}px)`,
    animationDelay: index * 0.1 + 's'
  };
};

const rollDice = async () => {
  if (isRolling.value || diceRolls.value.length >= maxRolls.value) return;
  
  isRolling.value = true;
  
  // Start rolling animation
  activeDice.value.forEach(dice => {
    dice.isRolling = true;
  });
  
  // Simulate rolling
  const rollInterval = setInterval(() => {
    activeDice.value.forEach(dice => {
      dice.value = Math.floor(Math.random() * 6) + 1;
    });
  }, 100);
  
  // Stop after 2 seconds
  setTimeout(() => {
    clearInterval(rollInterval);
    
    // Final values
    const finalValues = activeDice.value.map(() => Math.floor(Math.random() * 6) + 1);
    const total = finalValues.reduce((sum, val) => sum + val, 0);
    
    activeDice.value.forEach((dice, index) => {
      dice.value = finalValues[index];
      dice.isRolling = false;
    });
    
    diceRolls.value.push(total);
    isRolling.value = false;
  }, 2000);
};

const startInvestmentJourney = () => {
  generateJourneyData();
  currentPhase.value = 'journey';
};

const generateJourneyData = () => {
  const startDate = new Date(journeySetup.value.startDate);
  const days = totalDays.value;
  
  journeyDays.value = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    const day = {
      date: date.toISOString().split('T')[0],
      day: i + 1,
      events: [],
      portfolio: {
        cash: 1000 + Math.random() * 5000,
        totalValue: 100000 + (Math.random() - 0.3) * 20000 + (i * 1000),
        percentChange: (Math.random() - 0.3) * 10 + (i * 0.5),
        niftyChange: (Math.random() - 0.4) * 8 + (i * 0.3)
      }
    };
    
    // Add some random events
    if (Math.random() > 0.7) {
      const eventType = Math.random() > 0.5 ? 'BUY' : 'SELL';
      day.events.push({
        type: eventType,
        stock: `Stock ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`,
        quantity: Math.floor(Math.random() * 50) + 10,
        price: Math.floor(Math.random() * 1000) + 200
      });
    }
    
    journeyDays.value.push(day);
  }
};

const getBotComment = (event) => {
  const comments = {
    BUY: [
      "Great timing! This stock shows strong fundamentals.",
      "Smart move! Market indicators suggest upward potential.",
      "Excellent choice! This adds good diversification to your portfolio."
    ],
    SELL: [
      "Good decision! Taking profits is always wise.",
      "Smart exit! Technical indicators were showing weakness.",
      "Well timed! This helps rebalance your portfolio."
    ]
  };
  
  const eventComments = comments[event.type] || ["Keep up the good work!"];
  return eventComments[Math.floor(Math.random() * eventComments.length)];
};

const goToDay = (index) => {
  currentDayIndex.value = index;
};

const previousDay = () => {
  if (currentDayIndex.value > 0) {
    currentDayIndex.value--;
  }
};

const nextDay = () => {
  if (currentDayIndex.value < journeyDays.value.length - 1) {
    currentDayIndex.value++;
  }
};

const startNewJourney = () => {
  // Reset all data
  currentPhase.value = 'setup';
  journeySetup.value = {
    startDate: '',
    selectedProduct: '',
    amount: 100000
  };
  diceRolls.value = [];
  journeyDays.value = [];
  currentDayIndex.value = 0;
};

const exitJourney = () => {
  router.push('/');
};

// Initialize with current date
onMounted(() => {
  const today = new Date();
  today.setDate(today.getDate() - 30); // 30 days ago as default
  journeySetup.value.startDate = today.toISOString().split('T')[0];
});
</script>

<style scoped>
.journey-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #F8FBFF 0%, #E6F3FF 25%, #F0F8FF 75%, #E1F5FF 100%);
  position: relative;
  overflow: hidden;
}

/* Animated Background (unchanged) */
.journey-background {
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
  background: radial-gradient(circle, rgba(135, 206, 250, 0.1), transparent);
  border-radius: 50%;
  animation: floatShape infinite ease-in-out;
}

@keyframes floatShape {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(180deg); }
}

.grid-pattern {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(70, 130, 180, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(70, 130, 180, 0.05) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridMove 30s infinite linear;
}

@keyframes gridMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

.journey-container {
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

/* -------------------------------------------------------------
   Setup Phase (unchanged)
   ------------------------------------------------------------- */
.setup-phase {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
}

.setup-header {
  text-align: center;
  margin-bottom: 50px;
}

.setup-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  animation: iconFloat 3s infinite ease-in-out;
}

@keyframes iconFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.setup-title {
  font-size: 3rem;
  font-weight: 700;
  color: #2C3E50;
  margin-bottom: 15px;
  text-shadow: 0 2px 4px rgba(70, 130, 180, 0.1);
}

.setup-subtitle {
  font-size: 1.2rem;
  color: #34495E;
  font-weight: 500;
}

.setup-form {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 25px;
  padding: 40px;
  box-shadow: 0 20px 50px rgba(70, 130, 180, 0.1);
  border: 2px solid rgba(135, 206, 250, 0.3);
  backdrop-filter: blur(10px);
}

.form-section {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
}

.section-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #E6F3FF, #B8E6FF);
  border-radius: 50%;
  border: 2px solid rgba(70, 130, 180, 0.2);
}

.section-header h3 {
  color: #2C3E50;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.date-input-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.date-input-group label {
  font-weight: 600;
  color: #34495E;
  font-size: 1.1rem;
}

.date-input {
  padding: 15px 20px;
  border: 2px solid rgba(70, 130, 180, 0.2);
  border-radius: 15px;
  font-size: 1.1rem;
  background: rgba(240, 248, 255, 0.5);
  transition: all 0.3s ease;
}

.date-input:focus {
  outline: none;
  border-color: #4682B4;
  background: rgba(230, 243, 255, 0.7);
}

.product-selector {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.product-card {
  background: rgba(240, 248, 255, 0.5);
  border: 2px solid rgba(70, 130, 180, 0.2);
  border-radius: 20px;
  padding: 25px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(70, 130, 180, 0.15);
  border-color: #87CEEB;
}

.product-card.active {
  border-color: #4682B4;
  background: rgba(230, 243, 255, 0.7);
  box-shadow: 0 10px 25px rgba(70, 130, 180, 0.2);
}

.product-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.product-name {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2C3E50;
  margin-bottom: 10px;
}

.product-description {
  color: #34495E;
  margin-bottom: 15px;
  line-height: 1.4;
}

.product-risk {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.risk-label {
  font-weight: 600;
  color: #34495E;
}

.risk-stars {
  display: flex;
}

.star {
  font-size: 0.9rem;
  opacity: 0.3;
  transition: opacity 0.3s ease;
}

.star.filled {
  opacity: 1;
}

.amount-input-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.amount-input-group label {
  font-weight: 600;
  color: #34495E;
  font-size: 1.1rem;
}

.amount-input {
  padding: 15px 20px;
  border: 2px solid rgba(70, 130, 180, 0.2);
  border-radius: 15px;
  font-size: 1.3rem;
  font-weight: 600;
  background: rgba(240, 248, 255, 0.5);
  transition: all 0.3s ease;
  text-align: center;
}

.amount-input:focus {
  outline: none;
  border-color: #4682B4;
  background: rgba(230, 243, 255, 0.7);
}

.amount-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.amount-btn {
  padding: 8px 16px;
  background: rgba(70, 130, 180, 0.1);
  border: 1px solid rgba(70, 130, 180, 0.3);
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.amount-btn:hover {
  background: rgba(135, 206, 250, 0.2);
  transform: translateY(-2px);
}

.amount-btn.active {
  background: linear-gradient(45deg, #4682B4, #87CEEB);
  color: white;
  border-color: transparent;
}

.setup-actions {
  text-align: center;
  margin-top: 40px;
}

.continue-btn {
  background: linear-gradient(135deg, #4682B4, #87CEEB);
  color: white;
  border: none;
  padding: 18px 40px;
  border-radius: 50px;
  font-size: 1.3rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 25px rgba(70, 130, 180, 0.3);
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 0 auto;
}

.continue-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(70, 130, 180, 0.4);
}

.continue-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-icon {
  font-size: 1.5rem;
}

.btn-text {
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-arrow {
  font-size: 1.2rem;
}

/* -------------------------------------------------------------
   Dice Phase (unchanged)
   ------------------------------------------------------------- */
.dice-phase {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
  text-align: center;
}

.dice-header {
  margin-bottom: 50px;
}

.dice-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2C3E50;
  margin-bottom: 15px;
}

.dice-subtitle {
  font-size: 1.2rem;
  color: #34495E;
  margin-bottom: 30px;
}

.dice-progress {
  max-width: 400px;
  margin: 0 auto;
}

.progress-text {
  font-weight: 600;
  color: #2C3E50;
  margin-bottom: 10px;
}

.progress-bar {
  height: 8px;
  background: rgba(70, 130, 180, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4682B4, #87CEEB);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.dice-arena {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 25px;
  padding: 50px 40px;
  box-shadow: 0 20px 50px rgba(70, 130, 180, 0.1);
  border: 2px solid rgba(135, 206, 250, 0.3);
  backdrop-filter: blur(10px);
  margin-bottom: 30px;
}

.dice-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  margin-bottom: 40px;
  perspective: 1000px;
}

.dice-cube {
  position: relative;
  width: 80px;
  height: 80px;
  transform-style: preserve-3d;
  transition: transform 0.5s ease;
}

.dice-cube.rolling {
  animation: rollDice 0.1s infinite;
}

@keyframes rollDice {
  0% { transform: rotateX(0) rotateY(0); }
  25% { transform: rotateX(90deg) rotateY(45deg); }
  50% { transform: rotateX(180deg) rotateY(90deg); }
  75% { transform: rotateX(270deg) rotateY(135deg); }
  100% { transform: rotateX(360deg) rotateY(180deg); }
}

.dice-face {
  position: absolute;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #4682B4, #87CEEB);
  border: 3px solid white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 900;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  box-shadow: 0 5px 15px rgba(70, 130, 180, 0.3);
}

.dice-face.front { transform: translateZ(40px); }
.dice-face.back { transform: rotateY(180deg) translateZ(40px); }
.dice-face.right { transform: rotateY(90deg) translateZ(40px); }
.dice-face.left { transform: rotateY(-90deg) translateZ(40px); }
.dice-face.top { transform: rotateX(90deg) translateZ(40px); }
.dice-face.bottom { transform: rotateX(-90deg) translateZ(40px); }

.dice-glow {
  position: absolute;
  width: 120%;
  height: 120%;
  top: -10%;
  left: -10%;
  background: radial-gradient(circle, rgba(135, 206, 250, 0.3), transparent);
  border-radius: 50%;
  animation: diceGlow 2s infinite alternate;
}

@keyframes diceGlow {
  0% { opacity: 0.5; transform: scale(1); }
  100% { opacity: 0.8; transform: scale(1.1); }
}

.dice-results {
  margin-bottom: 40px;
}

.results-display h3 {
  color: #2C3E50;
  margin-bottom: 20px;
}

.results-grid {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 25px;
}

.result-item {
  background: rgba(240, 248, 255, 0.5);
  border: 2px solid rgba(70, 130, 180, 0.2);
  border-radius: 15px;
  padding: 15px;
  text-align: center;
  min-width: 80px;
}

.result-dice {
  font-size: 1.5rem;
  margin-bottom: 8px;
}

.result-value {
  font-size: 1.5rem;
  font-weight: 900;
  color: #2C3E50;
  margin-bottom: 5px;
}

.result-label {
  font-size: 0.9rem;
  color: #34495E;
  font-weight: 600;
}

.total-days {
  background: linear-gradient(135deg, rgba(70, 130, 180, 0.1), rgba(135, 206, 250, 0.1));
  border: 2px solid rgba(70, 130, 180, 0.3);
  border-radius: 15px;
  padding: 20px;
  display: inline-block;
}

.total-label {
  font-size: 1.1rem;
  color: #34495E;
  margin-bottom: 8px;
}

.total-value {
  font-size: 2.5rem;
  font-weight: 900;
  color: #2C3E50;
}

.dice-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
}

.roll-btn {
  background: linear-gradient(135deg, #4682B4, #87CEEB);
  color: white;
  border: none;
  padding: 0;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 25px rgba(70, 130, 180, 0.3);
  position: relative;
  overflow: hidden;
}

.roll-btn:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 15px 35px rgba(70, 130, 180, 0.4);
}

.roll-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.roll-btn-content {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 18px 35px;
  position: relative;
  z-index: 2;
}

.roll-icon {
  font-size: 1.8rem;
  animation: rollIconFloat 2s infinite ease-in-out;
}

@keyframes rollIconFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-3px) rotate(180deg); }
}

.roll-text {
  font-size: 1.3rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.roll-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.particle {
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 1rem;
  animation: particleFloat 3s infinite ease-out;
  transform: translate(-50%, -50%);
}

.particle:nth-child(1) { animation-delay: 0s; transform: translate(-50%, -50%) rotate(0deg) translateY(-50px); }
.particle:nth-child(2) { animation-delay: 0.5s; transform: translate(-50%, -50%) rotate(60deg) translateY(-50px); }
.particle:nth-child(3) { animation-delay: 1s; transform: translate(-50%, -50%) rotate(120deg) translateY(-50px); }
.particle:nth-child(4) { animation-delay: 1.5s; transform: translate(-50%, -50%) rotate(180deg) translateY(-50px); }
.particle:nth-child(5) { animation-delay: 2s; transform: translate(-50%, -50%) rotate(240deg) translateY(-50px); }
.particle:nth-child(6) { animation-delay: 2.5s; transform: translate(-50%, -50%) rotate(300deg) translateY(-50px); }

@keyframes particleFloat {
  0% { opacity: 1; transform: translate(-50%, -50%) rotate(var(--rotation, 0deg)) translateY(0); }
  100% { opacity: 0; transform: translate(-50%, -50%) rotate(var(--rotation, 0deg)) translateY(-80px); }
}

.journey-controls {
  display: flex;
  gap: 20px;
}

.start-journey-btn {
  background: linear-gradient(135deg, #4CAF50, #8BC34A);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 50px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(76, 175, 80, 0.3);
  display: flex;
  align-items: center;
  gap: 10px;
}

.start-journey-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 25px rgba(76, 175, 80, 0.4);
}

.roll-more-btn {
  background: linear-gradient(135deg, #FF9800, #FFC107);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 50px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(255, 152, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 10px;
}

.roll-more-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 12px 25px rgba(255, 152, 0, 0.4);
}

/* -------------------------------------------------------------
   Journey Phase (modified layout)
   ------------------------------------------------------------- */
.journey-phase {
  max-width: 1400px;
  margin: 0 auto;
}

/* New: Container that holds both bot + data */
.journey-content {
  display: flex;
  gap: 20px;
}

/* Left: fixed-width bot panel */
.bot-panel {
  width: 300px;
  background: rgba(255, 255, 255, 0.90);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 10px 25px rgba(70, 130, 180, 0.1);
  border: 2px solid rgba(135, 206, 250, 0.3);
  backdrop-filter: blur(10px);
  align-self: flex-start;
}

.bot-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.bot-avatar {
  font-size: 3rem;
  background: linear-gradient(135deg, #4682B4, #87CEEB);
  padding: 15px;
  border-radius: 50%;
  color: white;
  margin-bottom: 15px;
  box-shadow: 0 8px 20px rgba(70, 130, 180, 0.3);
}

.bot-message {
  font-size: 1rem;
  color: #2C3E50;
  line-height: 1.4;
  padding: 10px;
  background: rgba(240, 248, 255, 0.7);
  border: 1px solid rgba(70, 130, 180, 0.2);
  border-radius: 12px;
}

/* Right: data panel flexes to fill remaining space */
.data-panel {
  flex: 1;
}

/* Timeline Section (unchanged) */
.timeline-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 25px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 15px 35px rgba(70, 130, 180, 0.1);
  border: 2px solid rgba(135, 206, 250, 0.3);
  backdrop-filter: blur(10px);
}

.timeline-header {
  text-align: center;
  margin-bottom: 30px;
}

.timeline-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2C3E50;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin: 0;
}

.title-icon {
  font-size: 2.2rem;
}

.journey-badge {
  background: linear-gradient(45deg, #4682B4, #87CEEB);
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 1px;
}

.timeline-wrapper {
  overflow-x: auto;
}

.timeline-controls {
  display: flex;
  align-items: center;
  gap: 20px;
  min-width: 800px;
}

.nav-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4682B4, #87CEEB);
  color: white;
  border: none;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(70, 130, 180, 0.3);
}

.nav-btn:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 20px rgba(70, 130, 180, 0.4);
}

.nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.timeline-container {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px 0;
}

.timeline-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #E6F3FF, #B8E6FF, #E6F3FF);
  transform: translateY(-50%);
  z-index: 0;
}

.timeline-node {
  position: relative;
  z-index: 1;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.node-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #E6F3FF, #B8E6FF);
  border: 3px solid #4682B4;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(70, 130, 180, 0.2);
}

.timeline-node.active .node-circle {
  background: linear-gradient(135deg, #4682B4, #87CEEB);
  color: white;
  transform: scale(1.2);
  box-shadow: 0 8px 25px rgba(70, 130, 180, 0.4);
}

.timeline-node:hover .node-circle {
  transform: scale(1.1);
  box-shadow: 0 8px 20px rgba(70, 130, 180, 0.3);
}

.node-number {
  font-weight: 900;
  font-size: 1.1rem;
}

.node-date {
  margin-top: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #34495E;
  text-align: center;
}

.event-indicators {
  position: absolute;
  bottom: -15px;
  display: flex;
  gap: 3px;
}

.event-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.event-dot.buy {
  background: #4CAF50;
}

.event-dot.sell {
  background: #FF5722;
}

/* Portfolio Display (unchanged) */
.portfolio-display {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

.portfolio-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 10px 25px rgba(70, 130, 180, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.portfolio-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(70, 130, 180, 0.15);
}

.start-card {
  border: 2px solid rgba(255, 152, 0, 0.3);
  border-top: 5px solid #FF9800;
}

.current-card {
  border: 2px solid rgba(33, 150, 243, 0.3);
  border-top: 5px solid #2196F3;
}

.final-card {
  border: 2px solid rgba(76, 175, 80, 0.3);
  border-top: 5px solid #4CAF50;
}

.card-header {
  text-align: center;
  margin-bottom: 20px;
  border-bottom: 2px solid rgba(70, 130, 180, 0.1);
  padding-bottom: 15px;
}

.card-icon {
  font-size: 2rem;
  margin-bottom: 10px;
}

.card-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2C3E50;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.card-subtitle {
  font-size: 0.9rem;
  color: #34495E;
  font-weight: 500;
}

.portfolio-stocks {
  margin-bottom: 20px;
}

.stock-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: rgba(240, 248, 255, 0.5);
  border-radius: 10px;
  margin-bottom: 10px;
  border: 1px solid rgba(70, 130, 180, 0.1);
  transition: all 0.3s ease;
}

.stock-item:hover {
  background: rgba(230, 243, 255, 0.7);
  transform: translateX(3px);
}

.stock-info {
  flex: 1;
}

.stock-name {
  font-weight: 700;
  color: #2C3E50;
  margin-bottom: 3px;
}

.stock-details {
  font-size: 0.9rem;
  color: #34495E;
}

.stock-value {
  font-weight: 700;
  color: #4682B4;
  font-size: 1.1rem;
}

.portfolio-summary {
  border-top: 2px solid rgba(70, 130, 180, 0.1);
  padding-top: 15px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-weight: 500;
}

.summary-item.total {
  font-weight: 700;
  font-size: 1.1rem;
  color: #2C3E50;
  border-top: 1px solid rgba(70, 130, 180, 0.2);
  padding-top: 8px;
  margin-top: 8px;
}

.summary-item.performance,
.summary-item.vs-nifty {
  font-weight: 700;
}

.value.positive {
  color: #4CAF50;
}

.value.negative {
  color: #F44336;
}

/* Day Events (unchanged) */
.day-events {
  margin-bottom: 25px;
}

.events-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2C3E50;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.event-card {
  background: rgba(240, 248, 255, 0.5);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 15px;
  border-left: 4px solid;
  transition: all 0.3s ease;
}

.event-card.buy {
  border-left-color: #4CAF50;
  background: rgba(76, 175, 80, 0.1);
}

.event-card.sell {
  border-left-color: #FF5722;
  background: rgba(255, 87, 34, 0.1);
}

.event-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(70, 130, 180, 0.1);
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.event-type {
  font-weight: 700;
  font-size: 1.1rem;
  color: #2C3E50;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
}

.event-stock {
  font-weight: 700;
  color: #4682B4;
  font-size: 1.1rem;
}

.event-details {
  margin-bottom: 15px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  color: #34495E;
}

.detail-row span:last-child {
  font-weight: 600;
  color: #2C3E50;
}

.no-events {
  text-align: center;
  padding: 30px 20px;
  color: #34495E;
}

.no-events-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.no-events-text {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 20px;
}

/* Bot Advisor (unchanged) */
.bot-advisor {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: rgba(255, 255, 255, 0.7);
  padding: 15px;
  border-radius: 15px;
  border: 1px solid rgba(70, 130, 180, 0.2);
}

.bot-avatar {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #4682B4, #87CEEB);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.bot-message {
  background: rgba(240, 248, 255, 0.7);
  padding: 10px 15px;
  border-radius: 15px;
  border-bottom-left-radius: 5px;
  font-size: 0.95rem;
  line-height: 1.4;
  color: #2C3E50;
  flex: 1;
}

/* Current Holdings (unchanged) */
.current-holdings {
  border-top: 2px solid rgba(70, 130, 180, 0.1);
  padding-top: 20px;
}

.holdings-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2C3E50;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.holdings-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.stat-card {
  background: rgba(240, 248, 255, 0.5);
  border: 1px solid rgba(70, 130, 180, 0.2);
  border-radius: 12px;
  padding: 15px;
  text-align: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  background: rgba(230, 243, 255, 0.7);
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 1.3rem;
  margin-bottom: 8px;
}

.stat-value {
  font-weight: 700;
  font-size: 1.1rem;
  color: #2C3E50;
  margin-bottom: 5px;
}

.stat-value.positive {
  color: #4CAF50;
}

.stat-value.negative {
  color: #F44336;
}

.stat-label {
  font-size: 0.8rem;
  color: #34495E;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

/* Chart Section (unchanged) */
.chart-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 10px 25px rgba(70, 130, 180, 0.1);
  border: 2px solid rgba(135, 206, 250, 0.3);
  backdrop-filter: blur(10px);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2C3E50;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
}

.chart-icon {
  font-size: 1.5rem;
}

.chart-legend {
  display: flex;
  gap: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #34495E;
  font-weight: 500;
}

.legend-color {
  width: 15px;
  height: 3px;
  border-radius: 2px;
}

.legend-color.portfolio {
  background: #4682B4;
}

.legend-color.nifty {
  background: #B0C4DE;
}

.chart-container {
  height: 300px;
  background: linear-gradient(135deg, #F8FBFF, #E6F3FF);
  border-radius: 15px;
  border: 1px solid rgba(70, 130, 180, 0.2);
  padding: 20px;
}

.performance-chart {
  width: 100%;
  height: 100%;
}

/* Journey Actions (unchanged) */
.journey-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
  padding: 30px;
}

.action-btn {
  padding: 15px 30px;
  border: none;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.action-btn.primary {
  background: linear-gradient(135deg, #4682B4, #87CEEB);
  color: white;
  box-shadow: 0 8px 20px rgba(70, 130, 180, 0.3);
}

.action-btn.secondary {
  background: linear-gradient(135deg, #607D8B, #90A4AE);
  color: white;
  box-shadow: 0 8px 20px rgba(96, 125, 139, 0.3);
}

.action-btn.success {
  background: linear-gradient(135deg, #4CAF50, #8BC34A);
  color: white;
  box-shadow: 0 8px 20px rgba(76, 175, 80, 0.3);
}

.action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.2);
}

/* Responsive Design (unchanged) */
@media (max-width: 1200px) {
  .portfolio-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .holdings-stats {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
  .journey-container {
    padding: 15px;
  }
  
  .setup-title {
    font-size: 2rem;
  }
  
  .dice-title {
    font-size: 2rem;
  }
  
  .product-selector {
    grid-template-columns: 1fr;
  }
  
  .dice-container {
    gap: 20px;
  }
  
  .timeline-controls {
    min-width: 600px;
  }
  
  .nav-btn {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
  
  .node-circle {
    width: 50px;
    height: 50px;
  }
  
  .holdings-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .journey-actions {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .setup-form {
    padding: 25px;
  }
  
  .dice-arena {
    padding: 30px 20px;
  }
  
  .dice-cube {
    width: 60px;
    height: 60px;
  }
  
  .dice-face {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
  
  .timeline-controls {
    min-width: 500px;
  }
  
  .chart-container {
    height: 250px;
  }
  
  /* On very narrow screens, stack bot above data */
  .journey-content {
    flex-direction: column;
    gap: 20px;
  }
  
  .bot-panel {
    width: 100%;
  }
  
  .data-panel {
    width: 100%;
  }
}
</style>
