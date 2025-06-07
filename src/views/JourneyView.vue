<template>
  <div class="journey-view">
    <!-- Animated Background -->
    <div class="journey-background">
      <div class="floating-shapes">
        <div v-for="n in 20" :key="n" class="shape" :style="getShapeStyle(n)"></div>
      </div>
      <div class="grid-pattern"></div>
      <div class="wave-animation"></div>
    </div>

    <!-- Main Journey Container -->
    <div class="journey-container">

      <!-- Combined Setup + Dice Phase (before journey starts) -->
      <div v-if="currentPhase !== 'journey'" class="combined-setup-phase">
        <div class="combined-header">
          <div class="setup-icon">🎮</div>
          <h1 class="setup-title">Start Your Investment Journey</h1>
          <div class="setup-subtitle">Configure your adventure and roll the dice</div>
        </div>

        <div class="combined-content">
          <!-- Left: Setup Form -->
          <div class="setup-section">
            <div class="setup-form">
              <div class="form-section">
                <div class="section-header">
                  <div class="section-icon">📅</div>
                  <h3>Journey Date</h3>
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
                  <h3>Investment Product</h3>
                </div>
                <div class="product-selector">
                  <div 
                    v-for="product in availableProducts" 
                    :key="product.id"
                    :class="['product-card', { active: journeySetup.selectedProduct === product.id }]"
                    @click="selectProduct(product.id)"
                  >
                    <div class="product-card-glow"></div>
                    <div class="product-icon">{{ product.icon }}</div>
                    <div class="product-name">{{ product.name }}</div>
                    <div class="product-risk">
                      <div class="risk-stars">
                        <span v-for="n in 5" :key="n" :class="['star', { filled: n <= product.risk }]">⭐</span>
                      </div>
                    </div>
                    <div class="selection-particles"></div>
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
                        @click="selectAmount(amount)"
                        :class="{ active: journeySetup.amount === amount }"
                      >
                        ₹{{ formatAmount(amount) }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Dice Section -->
          <div class="dice-section">
            <div class="dice-header">
              <h2 class="dice-title">Roll for Journey Length</h2>
              <div class="dice-subtitle">Roll to determine your investment timeline</div>
              <div v-if="currentPhase === 'dice'" class="dice-progress">
                <div class="progress-text">Rolls: {{ diceRolls.length }} / {{ minRolls }}</div>
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
                  <div class="dice-particles" :class="{ active: dice.isRolling }"></div>
                </div>
                <div class="sparkle-effects" :class="{ active: isRolling }">
                  <div v-for="n in 12" :key="n" class="sparkle" :style="getSparkleStyle(n)">✨</div>
                </div>
              </div>

              <div v-if="diceRolls.length > 0" class="dice-results">
                <div class="results-display">
                  <div class="results-grid">
                    <div 
                      v-for="(result, index) in diceRolls" 
                      :key="index"
                      class="result-item"
                    >
                      <div class="result-dice">🎲</div>
                      <div class="result-value">{{ result }}</div>
                    </div>
                  </div>
                  <div class="total-days">
                    <div class="total-label">Journey Days:</div>
                    <div class="total-value">{{ totalDays }}</div>
                  </div>
                </div>
              </div>

              <div class="dice-controls">
                <button 
                  v-if="!isSetupComplete"
                  class="setup-incomplete-btn"
                  disabled
                >
                  <span>Complete Setup First</span>
                </button>

                <button 
                  v-else
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
                  <div class="button-glow" :class="{ active: !isRolling && diceRolls.length < maxRolls }"></div>
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
                    <span class="more-text">ROLL MORE</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Journey Phase with Left Panel (setup summary) + Right Panel (data) -->
      <div v-if="currentPhase === 'journey'" class="journey-phase">
        <div class="journey-content">
          
          <!-- Left Panel: Setup Summary + Dice Control -->
          <div class="left-panel">
            <!-- Setup Summary -->
            <div class="setup-summary">
              <div class="summary-header">
                <div class="summary-icon">⚙️</div>
                <h3>Journey Setup</h3>
              </div>
              <div class="summary-content">
                <div class="summary-item">
                  <span class="item-label">Start Date:</span>
                  <span class="item-value">{{ formatDate(journeySetup.startDate) }}</span>
                </div>
                <div class="summary-item">
                  <span class="item-label">Product:</span>
                  <span class="item-value">{{ selectedProductName }}</span>
                </div>
                <div class="summary-item">
                  <span class="item-label">Initial Amount:</span>
                  <span class="item-value">₹{{ formatCurrency(journeySetup.amount) }}</span>
                </div>
                <div class="summary-item">
                  <span class="item-label">Journey Duration:</span>
                  <span class="item-value">{{ totalDays }} Days</span>
                </div>
              </div>
            </div>

            <!-- Enhanced Dice Control Panel -->
            <div class="dice-control-panel">
              <div class="summary-header">
                <div class="summary-icon">🎲</div>
                <h3>Dice Control</h3>
              </div>
              
              <!-- Current Dice Results -->
              <div class="dice-results-summary">
                <div class="roll-results">
                  <div 
                    v-for="(result, index) in diceRolls" 
                    :key="index"
                    class="roll-item"
                  >
                    <span class="roll-icon">🎲</span>
                    <span class="roll-value">{{ result }}</span>
                  </div>
                </div>
                <div class="total-summary">
                  <span>Total: {{ totalDays }} Days</span>
                </div>
              </div>

              <!-- Interactive Dice Section -->
              <div class="journey-dice-section">
                <div class="mini-dice-container">
                  <div 
                    v-for="(dice, index) in activeDice" 
                    :key="index"
                    :class="['mini-dice-cube', { rolling: dice.isRolling }]"
                  >
                    <div class="mini-dice-face">{{ dice.value }}</div>
                  </div>
                </div>

                <div class="dice-controls">
                  <button 
                    v-if="diceRolls.length < maxRolls"
                    class="journey-roll-btn"
                    @click="rollDiceFromJourney"
                    :disabled="isRolling"
                  >
                    <span class="roll-icon">🎲</span>
                    <span class="roll-text">
                      {{ isRolling ? 'ROLLING...' : 'ROLL MORE' }}
                    </span>
                  </button>
                  
                  <div v-else class="max-rolls-message">
                    <span class="message-icon">🎯</span>
                    <span>Maximum rolls reached</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Journey Navigation -->
            <div class="journey-navigation">
              <div class="summary-header">
                <div class="summary-icon">🗓️</div>
                <h3>Quick Navigation</h3>
              </div>
              <div class="nav-buttons">
                <button class="nav-quick-btn" @click="goToDay(0)">
                  <span class="nav-icon">🎯</span>
                  <span>Day 1</span>
                </button>
                <button class="nav-quick-btn" @click="goToDay(journeyDays.length - 1)">
                  <span class="nav-icon">🏆</span>
                  <span>Final Day</span>
                </button>
                <button class="nav-quick-btn" @click="goToMiddleDay">
                  <span class="nav-icon">📊</span>
                  <span>Mid Journey</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Right Panel: Journey Data -->
          <div class="right-panel">
            <!-- Timeline Section with Chain Design -->
            <div class="timeline-section">
              <div class="timeline-header">
                <h2 class="timeline-title">
                  <span class="title-icon">📈</span>
                  Recent Transaction Days
                  <span class="journey-badge">LAST 5 ACTIVITIES</span>
                </h2>
              </div>
              
              <div class="timeline-wrapper">
                <div class="timeline-controls">
                  <button 
                    class="nav-btn prev" 
                    @click="previousTransactionDay"
                    :disabled="currentTransactionIndex === 0"
                  >
                    ←
                  </button>
                  
                  <div class="transaction-chain-container">
                    <div class="transaction-cards-row">
                      <div 
                        v-for="(day, index) in lastFiveTransactionDays" 
                        :key="day.day"
                        :class="['transaction-card', { 
                          active: day.day === currentDay?.day,
                          'has-events': day.events && day.events.length > 0 
                        }]"
                        @click="goToDay(day.day - 1)"
                        :style="{ '--animation-order': index }"
                      >
                        <div class="card-glow"></div>
                        <div class="loading-shimmer"></div>
                        <div class="data-reveal-overlay"></div>
                        
                        <div class="transaction-card-header">
                          <div class="day-number" :data-day="day.day">{{ day.day }}</div>
                          <div class="day-date">{{ formatDate(day.date) }}</div>
                        </div>
                        
                        <div class="transaction-summary">
                          <div v-if="day.events && day.events.length > 0" class="has-transactions">
                            <div class="transaction-count counting-animation" :data-count="day.events.length">
                              {{ day.events.length }} Transaction{{ day.events.length > 1 ? 's' : '' }}
                            </div>
                            <div class="transaction-types">
                              <span 
                                v-for="(event, eventIndex) in day.events" 
                                :key="event.type"
                                :class="['transaction-type', event.type.toLowerCase()]"
                                :style="{ '--event-delay': eventIndex * 0.2 + 's' }"
                              >
                                {{ event.type }}
                              </span>
                            </div>
                          </div>
                          <div v-else class="no-transactions">
                            <div class="no-transaction-icon">💤</div>
                            <div class="no-transaction-text">No Activity</div>
                          </div>
                        </div>
                        
                        <div class="card-footer">
                          <div class="portfolio-change">
                            <span class="change-label">Portfolio:</span>
                            <span 
                              :class="['change-value', 'counting-number', day.portfolio?.percentChange >= 0 ? 'positive' : 'negative']"
                              :data-target="(day.portfolio?.percentChange || 0).toFixed(1)"
                            >
                              {{ day.portfolio?.percentChange >= 0 ? '+' : '' }}{{ (day.portfolio?.percentChange || 0).toFixed(1) }}%
                            </span>
                          </div>
                        </div>
                        
                        <div class="active-indicator"></div>
                        <div class="arrival-burst"></div>
                        <div class="data-particles"></div>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    class="nav-btn next" 
                    @click="nextTransactionDay"
                    :disabled="currentTransactionIndex === lastFiveTransactionDays.length - 1"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>

            <!-- Portfolio Display -->
            <div class="portfolio-display">
              <div class="portfolio-grid">
                
                <!-- Current Day View -->
                <div class="portfolio-card current-card">
                  <div class="card-header">
                    <div class="card-icon">📊</div>
                    <h3 class="card-title">SELECTED DAY</h3>
                    <div class="card-subtitle">Day {{ currentDay?.day || 1 }} - {{ formatDate(currentDay?.date) }}</div>
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
                      </div>
                    </div>

                    <div v-else class="no-events">
                      <div class="no-events-icon">😌</div>
                      <div class="no-events-text">No transactions this day</div>
                    </div>

                    <!-- Current Holdings -->
                    <div class="current-holdings">
                      <h4 class="holdings-title">💼 Portfolio Status</h4>
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
                          <div :class="['stat-value', currentDayVersusNifty >= 0 ? 'positive' : 'negative']">
                            {{ currentDayVersusNifty >= 0 ? '+' : '' }}{{ currentDayVersusNifty.toFixed(1) }}%
                          </div>
                          <div class="stat-label">vs NIFTY</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Final Portfolio / Journey Summary -->
                <div class="portfolio-card final-card">
                  <div class="card-header">
                    <div class="card-icon">{{ showFinalResults ? '🏆' : '📈' }}</div>
                    <h3 class="card-title">{{ showFinalResults ? 'FINAL RESULTS' : 'JOURNEY SUMMARY' }}</h3>
                    <div class="card-subtitle">{{ showFinalResults ? 'Journey Complete' : 'Progress Overview' }}</div>
                  </div>
                  <div class="card-content">
                    <div v-if="isJourneyDataLoading" class="loading-spinner-container">
                      <div class="loading-spinner">
                        <div class="spinner-ring"></div>
                        <div class="spinner-ring"></div>
                        <div class="spinner-ring"></div>
                        <div class="loading-text">Loading Journey Data...</div>
                      </div>
                    </div>
                    <div v-else-if="showFinalResults" class="final-summary">
                      <div class="final-item">
                        <span>Initial Investment:</span>
                        <span>₹{{ formatCurrency(journeySetup.amount) }}</span>
                      </div>
                      <div class="final-item">
                        <span>Final Value:</span>
                        <span>₹{{ formatCurrency(finalTotal) }}</span>
                      </div>
                      <div class="final-item highlight">
                        <span>Total Return:</span>
                        <span :class="['value', finalPerformance >= 0 ? 'positive' : 'negative']">
                          {{ finalPerformance >= 0 ? '+' : '' }}{{ finalPerformance.toFixed(1) }}%
                        </span>
                      </div>
                      <div class="final-item vs-nifty">
                        <span>vs NIFTY:</span>
                        <span :class="['value', finalVsNifty >= 0 ? 'positive' : 'negative']">
                          {{ finalVsNifty >= 0 ? '+' : '' }}{{ finalVsNifty.toFixed(1) }}%
                        </span>
                      </div>
                    </div>
                    <div v-else class="journey-overview">
                      <div class="overview-stats">
                        <div class="overview-item">
                          <div class="overview-icon">📅</div>
                          <div class="overview-value">Day {{ currentDay?.day || 1 }} of {{ totalDays }}</div>
                          <div class="overview-label">Progress</div>
                        </div>
                        <div class="overview-item">
                          <div class="overview-icon">📊</div>
                          <div class="overview-value">{{ lastFiveTransactionDays.length }}</div>
                          <div class="overview-label">Active Days</div>
                        </div>
                        <div class="overview-item">
                          <div class="overview-icon">💼</div>
                          <div class="overview-value">₹{{ formatCurrency(currentDay?.portfolio?.totalValue || journeySetup.amount) }}</div>
                          <div class="overview-label">Current Value</div>
                        </div>
                      </div>
                      <div class="progress-overview">
                        <div class="progress-bar-container">
                          <div class="progress-label">Journey Progress</div>
                          <div class="journey-progress-bar">
                            <div class="journey-progress-fill" :style="{ width: ((currentDay?.day || 1) / totalDays) * 100 + '%' }"></div>
                          </div>
                          <div class="progress-percentage">{{ Math.round(((currentDay?.day || 1) / totalDays) * 100) }}%</div>
                        </div>
                      </div>
                      <button class="end-journey-btn" @click="endJourney">
                        <span class="btn-icon">🎯</span>
                        <span class="btn-text">END JOURNEY & SEE RESULTS</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Journey Actions -->
            <div class="journey-actions">
              <button class="action-btn primary" @click="startNewJourney">
                <span class="btn-icon">🔄</span>
                <span class="btn-text">NEW JOURNEY</span>
              </button>
              <button class="action-btn secondary" @click="exitJourney">
                <span class="btn-icon">🏠</span>
                <span class="btn-text">EXIT</span>
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
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
const activeDice = ref([
  { value: 1, isRolling: false },
  { value: 1, isRolling: false }
]);
const diceRolls = ref([]);
const isRolling = ref(false);
const minRolls = ref(2);
const maxRolls = ref(5);

// Journey data
const journeyDays = ref([]);
const currentDayIndex = ref(0);
const currentTransactionIndex = ref(0);
const isJourneyDataLoading = ref(false);
const showFinalResults = ref(false);

// Computed properties
const isSetupComplete = computed(() => {
  const complete = journeySetup.value.startDate && 
         journeySetup.value.selectedProduct && 
         journeySetup.value.amount >= 10000;
  
  // Auto-enable dice rolling when setup is complete
  if (complete && currentPhase.value === 'setup') {
    currentPhase.value = 'dice';
  }
  
  return complete;
});

const totalDays = computed(() => {
  return diceRolls.value.reduce((sum, roll) => sum + roll, 0) + 5; // Base 5 days + dice rolls
});

const selectedProductName = computed(() => {
  const product = availableProducts.value.find(p => p.id === journeySetup.value.selectedProduct);
  return product ? product.name : '';
});

const currentDay = computed(() => {
  return journeyDays.value[currentDayIndex.value];
});

const firstDay = computed(() => {
  return journeyDays.value[0];
});

const currentDayEvents = computed(() => {
  return currentDay.value?.events || [];
});

const firstDayEvents = computed(() => {
  return firstDay.value?.events || [];
});

const firstDayVersusNifty = computed(() => {
  const dayData = firstDay.value;
  return dayData?.portfolio?.percentChange - dayData?.portfolio?.niftyChange || 0;
});

const currentDayVersusNifty = computed(() => {
  const dayData = currentDay.value;
  return dayData?.portfolio?.percentChange - dayData?.portfolio?.niftyChange || 0;
});

const finalTotal = computed(() => {
  const lastDay = journeyDays.value[journeyDays.value.length - 1];
  return lastDay?.portfolio?.totalValue || journeySetup.value.amount;
});

const finalPerformance = computed(() => {
  return ((finalTotal.value - journeySetup.value.amount) / journeySetup.value.amount) * 100;
});

const finalVsNifty = computed(() => 4.6);

const versusNifty = computed(() => {
  const dayData = currentDay.value;
  return dayData?.portfolio?.percentChange - dayData?.portfolio?.niftyChange || 0;
});

// Get last 5 days with buy/sell transactions
const lastFiveTransactionDays = computed(() => {
  if (!journeyDays.value.length) return [];
  
  const daysWithEvents = journeyDays.value.filter(day => 
    day.events && day.events.length > 0
  );
  
  // Get last 5 transaction days
  return daysWithEvents.slice(-5);
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

const getSparkleStyle = (index) => {
  const angle = (360 / 12) * index;
  const radius = 80 + Math.random() * 40;
  const delay = Math.random() * 2;
  
  return {
    transform: `rotate(${angle}deg) translateX(${radius}px)`,
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

const selectAmount = (amount) => {
  journeySetup.value.amount = amount;
};

const enableDiceRoll = () => {
  currentPhase.value = 'dice';
};

const getDiceStyle = (index) => {
  const offset = index * 80 - 40;
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
  isJourneyDataLoading.value = true;
  generateJourneyData();
  currentPhase.value = 'journey';
  
  // Simulate loading time for journey data
  setTimeout(() => {
    isJourneyDataLoading.value = false;
  }, 3000);
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
        totalValue: journeySetup.value.amount + (Math.random() - 0.3) * 20000 + (i * 1000),
        percentChange: (Math.random() - 0.3) * 10 + (i * 0.5),
        niftyChange: (Math.random() - 0.4) * 8 + (i * 0.3)
      }
    };
    
    // Add some random events (increased probability for more transaction days)
    if (Math.random() > 0.6) {
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

const rollDiceFromJourney = async () => {
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
  
  // Stop after 1.5 seconds (faster for journey phase)
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
    
    // Regenerate journey data with new total days
    generateJourneyData();
  }, 1500);
};

const goToDay = (index) => {
  currentDayIndex.value = index;
};

const goToMiddleDay = () => {
  const middleIndex = Math.floor(journeyDays.value.length / 2);
  currentDayIndex.value = middleIndex;
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

const previousTransactionDay = () => {
  if (currentTransactionIndex.value > 0) {
    currentTransactionIndex.value--;
    const transactionDay = lastFiveTransactionDays.value[currentTransactionIndex.value];
    currentDayIndex.value = transactionDay.day - 1;
  }
};

const nextTransactionDay = () => {
  if (currentTransactionIndex.value < lastFiveTransactionDays.value.length - 1) {
    currentTransactionIndex.value++;
    const transactionDay = lastFiveTransactionDays.value[currentTransactionIndex.value];
    currentDayIndex.value = transactionDay.day - 1;
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
  isJourneyDataLoading.value = false;
  showFinalResults.value = false;
};

const endJourney = () => {
  showFinalResults.value = true;
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
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 25%, #90caf9 50%, #64b5f6 75%, #42a5f5 100%);
  position: relative;
  overflow: hidden;
}

/* Enhanced Animated Background */
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
  background: radial-gradient(circle, rgba(25, 118, 210, 0.2), rgba(33, 150, 243, 0.1));
  border-radius: 50%;
  animation: floatShape infinite ease-in-out;
}

@keyframes floatShape {
  0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
  50% { transform: translateY(-30px) rotate(180deg) scale(1.1); }
}

.grid-pattern {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(25, 118, 210, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(25, 118, 210, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridMove 30s infinite linear;
}

@keyframes gridMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

.wave-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, 
    transparent 30%, 
    rgba(33, 150, 243, 0.1) 50%, 
    transparent 70%);
  animation: waveMove 20s infinite linear;
}

@keyframes waveMove {
  0% { transform: translateX(-100%) translateY(-100%); }
  100% { transform: translateX(100%) translateY(100%); }
}

.journey-container {
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

/* Combined Setup + Dice Phase */
.combined-setup-phase {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.combined-header {
  text-align: center;
  margin-bottom: 40px;
}

.setup-icon {
  font-size: 3.5rem;
  margin-bottom: 20px;
  animation: iconFloat 3s infinite ease-in-out;
  filter: drop-shadow(0 0 20px rgba(25, 118, 210, 0.6));
}

@keyframes iconFloat {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-10px) scale(1.05); }
}

.setup-title {
  font-size: 2.5rem;
  font-weight: 900;
  color: #0d47a1;
  margin-bottom: 15px;
  text-shadow: 
    0 0 20px rgba(25, 118, 210, 0.4),
    0 4px 8px rgba(0, 0, 0, 0.2);
  background: linear-gradient(45deg, #1565c0, #1976d2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% 200%;
  animation: titleShine 3s infinite alternate;
}

@keyframes titleShine {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

.setup-subtitle {
  font-size: 1.3rem;
  color: #1565c0;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.combined-content {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 35px;
  align-items: start;
}

/* Setup Section */
.setup-section {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 25px;
  padding: 30px;
  box-shadow: 
    0 15px 35px rgba(25, 118, 210, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(25, 118, 210, 0.3);
  backdrop-filter: blur(10px);
  height: fit-content;
}

.form-section {
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.section-icon {
  font-size: 1.5rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.2), rgba(33, 150, 243, 0.1));
  border-radius: 50%;
  border: 2px solid rgba(25, 118, 210, 0.4);
  animation: iconPulse 2s infinite alternate;
}

@keyframes iconPulse {
  0% { box-shadow: 0 0 10px rgba(25, 118, 210, 0.3); }
  100% { box-shadow: 0 0 20px rgba(33, 150, 243, 0.5); }
}

.section-header h3 {
  color: #0d47a1;
  font-size: 1.4rem;
  font-weight: 900;
  margin: 0;
  text-shadow: 0 2px 4px rgba(25, 118, 210, 0.2);
}

.date-input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.date-input-group label {
  font-weight: 800;
  color: #1565c0;
  font-size: 1.1rem;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.date-input {
  padding: 12px 15px;
  border: 2px solid rgba(25, 118, 210, 0.3);
  border-radius: 12px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.8);
  color: #0d47a1;
  transition: all 0.3s ease;
}

.date-input:focus {
  outline: none;
  border-color: #1976d2;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 0 15px rgba(33, 150, 243, 0.3);
}

/* Enhanced Product Selection with Graphics */
.product-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.product-card {
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(25, 118, 210, 0.3);
  border-radius: 15px;
  padding: 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.product-card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(33, 150, 243, 0.2), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
  animation: rotateGlow 4s infinite linear;
}

@keyframes rotateGlow {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.product-card:hover .product-card-glow {
  opacity: 1;
}

.product-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 
    0 15px 30px rgba(25, 118, 210, 0.3),
    0 0 20px rgba(33, 150, 243, 0.4);
  border-color: #1976d2;
}

.product-card.active {
  border-color: #1976d2;
  background: rgba(227, 242, 253, 0.9);
  box-shadow: 
    0 8px 25px rgba(25, 118, 210, 0.4),
    0 0 30px rgba(33, 150, 243, 0.3);
}

.product-card.active .product-card-glow {
  opacity: 1;
  animation: rotateGlow 2s infinite linear;
}

.selection-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card.active .selection-particles {
  opacity: 1;
  animation: particleBurst 1s ease-out;
}

@keyframes particleBurst {
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
}

.product-icon {
  font-size: 2rem;
  margin-bottom: 8px;
  filter: drop-shadow(0 0 10px rgba(25, 118, 210, 0.4));
  transition: all 0.3s ease;
}

.product-card:hover .product-icon {
  transform: scale(1.1) rotate(5deg);
  filter: drop-shadow(0 0 15px rgba(33, 150, 243, 0.6));
}

.product-name {
  font-size: 1.1rem;
  font-weight: 900;
  color: #0d47a1;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.risk-stars {
  display: flex;
  justify-content: center;
  gap: 2px;
}

.star {
  font-size: 0.8rem;
  opacity: 0.3;
  transition: all 0.3s ease;
  filter: drop-shadow(0 0 5px rgba(255, 193, 7, 0.3));
}

.star.filled {
  opacity: 1;
  animation: starTwinkle 2s infinite alternate;
}

@keyframes starTwinkle {
  0% { transform: scale(1); }
  100% { transform: scale(1.1); }
}

.amount-input-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.amount-input {
  padding: 12px 15px;
  border: 2px solid rgba(25, 118, 210, 0.3);
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.8);
  color: #0d47a1;
  transition: all 0.3s ease;
  text-align: center;
}

.amount-input:focus {
  outline: none;
  border-color: #1976d2;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 0 15px rgba(33, 150, 243, 0.3);
}

.amount-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.amount-btn {
  padding: 8px 15px;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(25, 118, 210, 0.4);
  border-radius: 15px;
  font-weight: 800;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #1565c0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.amount-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(33, 150, 243, 0.3), transparent);
  transition: left 0.3s ease;
}

.amount-btn:hover::before {
  left: 100%;
}

.amount-btn:hover {
  background: rgba(227, 242, 253, 0.9);
  transform: translateY(-1px);
  border-color: #1976d2;
}

.amount-btn.active {
  background: linear-gradient(45deg, #1976d2, #42a5f5);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 15px rgba(25, 118, 210, 0.4);
}

/* Enhanced Dice Section - Updated to Blue Theme */
.dice-section {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 25px;
  padding: 30px;
  box-shadow: 
    0 15px 35px rgba(25, 118, 210, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(25, 118, 210, 0.3);
  backdrop-filter: blur(10px);
  text-align: center;
  height: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 600px;
}

.dice-header {
  margin-bottom: 30px;
}

.dice-title {
  font-size: 2.2rem;
  font-weight: 900;
  color: #0d47a1;
  margin-bottom: 10px;
  text-shadow: 0 3px 6px rgba(25, 118, 210, 0.4);
}

.dice-subtitle {
  font-size: 1.1rem;
  color: #1565c0;
  margin-bottom: 20px;
  font-weight: 700;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.dice-progress {
  max-width: 300px;
  margin: 0 auto;
}

.progress-text {
  font-weight: 800;
  color: #0d47a1;
  margin-bottom: 8px;
  font-size: 1rem;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.progress-bar {
  height: 6px;
  background: rgba(25, 118, 210, 0.2);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #1976d2, #42a5f5);
  border-radius: 3px;
  transition: width 0.5s ease;
  box-shadow: 0 0 10px rgba(33, 150, 243, 0.5);
}

/* Enhanced Dice Arena - Cleaner Design */
.dice-arena {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
  flex: 1;
  justify-content: space-evenly;
  min-height: 400px;
}

.dice-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  perspective: 1000px;
  position: relative;
  padding: 40px;
  background: radial-gradient(circle, rgba(25, 118, 210, 0.1), transparent);
  border-radius: 20px;
}

.dice-cube {
  position: relative;
  width: 60px;
  height: 60px;
  transform-style: preserve-3d;
  transition: transform 0.5s ease;
  z-index: 2;
}

.dice-cube.rolling {
  animation: rollDice 0.1s infinite;
}

@keyframes rollDice {
  0% { 
    transform: rotateX(0) rotateY(0) rotateZ(0) scale(1);
    filter: hue-rotate(0deg);
  }
  25% { 
    transform: rotateX(90deg) rotateY(45deg) rotateZ(45deg) scale(1.1);
    filter: hue-rotate(90deg);
  }
  50% { 
    transform: rotateX(180deg) rotateY(90deg) rotateZ(90deg) scale(0.9);
    filter: hue-rotate(180deg);
  }
  75% { 
    transform: rotateX(270deg) rotateY(135deg) rotateZ(135deg) scale(1.1);
    filter: hue-rotate(270deg);
  }
  100% { 
    transform: rotateX(360deg) rotateY(180deg) rotateZ(180deg) scale(1);
    filter: hue-rotate(360deg);
  }
}

.dice-face {
  position: absolute;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #1976d2, #42a5f5, #e91e63);
  border: 2px solid white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 900;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.4);
  background-size: 200% 200%;
  animation: colorShift 3s infinite;
}

@keyframes colorShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.dice-face.front { transform: translateZ(30px); }
.dice-face.back { transform: rotateY(180deg) translateZ(30px); }
.dice-face.right { transform: rotateY(90deg) translateZ(30px); }
.dice-face.left { transform: rotateY(-90deg) translateZ(30px); }
.dice-face.top { transform: rotateX(90deg) translateZ(30px); }
.dice-face.bottom { transform: rotateX(-90deg) translateZ(30px); }

.dice-glow {
  position: absolute;
  width: 120%;
  height: 120%;
  top: -10%;
  left: -10%;
  background: radial-gradient(circle, rgba(33, 150, 243, 0.6), rgba(233, 30, 99, 0.4), transparent);
  border-radius: 50%;
  animation: diceGlow 2s infinite alternate;
}

@keyframes diceGlow {
  0% { 
    opacity: 0.5; 
    transform: scale(1);
    filter: hue-rotate(0deg);
  }
  100% { 
    opacity: 0.9; 
    transform: scale(1.2);
    filter: hue-rotate(180deg);
  }
}

.dice-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  opacity: 0;
}

.dice-particles.active {
  opacity: 1;
  animation: particleExplode 2s ease-out;
}

@keyframes particleExplode {
  0% { 
    transform: scale(0); 
    opacity: 1;
    filter: hue-rotate(0deg);
  }
  50% { 
    transform: scale(1.5); 
    opacity: 0.8;
    filter: hue-rotate(180deg);
  }
  100% { 
    transform: scale(3); 
    opacity: 0;
    filter: hue-rotate(360deg);
  }
}

.sparkle-effects {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
}

.sparkle-effects.active .sparkle {
  animation: sparkleFloat 2s ease-out infinite;
}

.sparkle {
  position: absolute;
  font-size: 1.2rem;
  opacity: 0;
  animation: none;
}

@keyframes sparkleFloat {
  0% { 
    opacity: 0; 
    transform: scale(0) rotate(0deg);
    filter: hue-rotate(0deg);
  }
  50% { 
    opacity: 1; 
    transform: scale(1) rotate(180deg);
    filter: hue-rotate(180deg);
  }
  100% { 
    opacity: 0; 
    transform: scale(0.5) rotate(360deg);
    filter: hue-rotate(360deg);
  }
}

.dice-results {
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(227, 242, 253, 0.5);
  border-radius: 15px;
  padding: 20px;
  border: 1px solid rgba(25, 118, 210, 0.2);
  width: 100%;
}

.results-display {
  text-align: center;
}

.results-grid {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 15px;
}

.result-item {
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(25, 118, 210, 0.3);
  border-radius: 12px;
  padding: 10px;
  text-align: center;
  min-width: 60px;
  animation: resultPulse 1s ease-in-out;
}

@keyframes resultPulse {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.result-dice {
  font-size: 1.2rem;
  margin-bottom: 5px;
}

.result-value {
  font-size: 1.3rem;
  font-weight: 900;
  color: #0d47a1;
}

.total-days {
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.2), rgba(33, 150, 243, 0.1));
  border: 2px solid rgba(25, 118, 210, 0.4);
  border-radius: 12px;
  padding: 15px;
  display: inline-block;
}

.total-label {
  font-size: 1rem;
  color: #1565c0;
  margin-bottom: 5px;
}

.total-value {
  font-size: 2rem;
  font-weight: 900;
  color: #0d47a1;
}

.dice-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  width: 100%;
}

.setup-incomplete-btn {
  background: rgba(108, 117, 125, 0.3);
  color: #6c757d;
  border: none;
  padding: 12px 25px;
  border-radius: 25px;
  font-weight: 600;
  cursor: not-allowed;
}

.roll-btn {
  background: linear-gradient(135deg, #1976d2, #42a5f5);
  color: white;
  border: none;
  padding: 0;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(25, 118, 210, 0.3);
  position: relative;
  overflow: hidden;
}

.roll-btn:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 10px 25px rgba(25, 118, 210, 0.4);
}

.roll-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.roll-btn-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 25px;
  position: relative;
  z-index: 2;
}

.button-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.button-glow.active {
  animation: buttonShine 2s infinite;
}

@keyframes buttonShine {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
  100% { transform: translateX(100%); }
}

.roll-icon {
  font-size: 1.5rem;
  animation: rollIconFloat 2s infinite ease-in-out;
}

@keyframes rollIconFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-3px) rotate(180deg); }
}

.roll-text {
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.journey-controls {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 10px;
}

.start-journey-btn {
  background: linear-gradient(135deg, #4CAF50, #8BC34A);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 25px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 15px rgba(76, 175, 80, 0.3);
  display: flex;
  align-items: center;
  gap: 8px;
}

.start-journey-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(76, 175, 80, 0.4);
}

.roll-more-btn {
  background: linear-gradient(135deg, #FF9800, #FFC107);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 25px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 15px rgba(255, 152, 0, 0.3);
}

.roll-more-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 152, 0, 0.4);
}

/* Journey Phase Layout */
.journey-phase {
  max-width: 1400px;
  margin: 0 auto;
}

.journey-content {
  display: flex;
  gap: 20px;
}

/* Left Panel - Updated to Blue Theme */
.left-panel {
  width: 500px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-self: flex-start;
}

.setup-summary, .dice-control-panel, .journey-navigation {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 15px;
  box-shadow: 
    0 10px 25px rgba(25, 118, 210, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(25, 118, 210, 0.3);
  backdrop-filter: blur(10px);
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid rgba(25, 118, 210, 0.1);
}

.summary-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.2), rgba(33, 150, 243, 0.1));
  border-radius: 50%;
  border: 2px solid rgba(25, 118, 210, 0.3);
}

.summary-header h3 {
  color: #0d47a1;
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 8px 0;
}

.item-label {
  font-weight: 600;
  color: #1565c0;
}

.item-value {
  font-weight: 700;
  color: #0d47a1;
}

.dice-results-summary {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.roll-results {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.roll-item {
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgba(227, 242, 253, 0.5);
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid rgba(25, 118, 210, 0.2);
}

.roll-icon {
  font-size: 1rem;
}

.roll-value {
  font-weight: 900;
  color: #0d47a1;
  font-size: 1.1rem;
}

.total-summary {
  text-align: center;
  font-weight: 900;
  color: #0d47a1;
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.2), rgba(33, 150, 243, 0.1));
  padding: 12px;
  border-radius: 10px;
  font-size: 1.1rem;
  border: 2px solid rgba(25, 118, 210, 0.3);
}

/* Enhanced Dice Control Panel */
.dice-control-panel {
  border: 2px solid rgba(25, 118, 210, 0.4);
}

.journey-dice-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 15px 0;
  border-top: 1px solid rgba(25, 118, 210, 0.2);
  margin-top: 15px;
}

.mini-dice-container {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.mini-dice-cube {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #1976d2, #42a5f5);
  border: 2px solid white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
}

.mini-dice-cube.rolling {
  animation: miniDiceRoll 0.2s infinite;
}

@keyframes miniDiceRoll {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(90deg); }
  50% { transform: rotate(180deg); }
  75% { transform: rotate(270deg); }
  100% { transform: rotate(360deg); }
}

.mini-dice-face {
  font-size: 1.2rem;
  font-weight: 900;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.journey-roll-btn {
  background: linear-gradient(135deg, #FF9800, #FFC107);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.journey-roll-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(255, 152, 0, 0.4);
}

.journey-roll-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.max-rolls-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  background: rgba(108, 117, 125, 0.1);
  border: 1px solid rgba(108, 117, 125, 0.3);
  border-radius: 15px;
  color: #6c757d;
  font-size: 0.9rem;
  font-weight: 600;
}

.message-icon {
  font-size: 1rem;
}

/* Journey Navigation */
.journey-navigation {
  border: 2px solid rgba(33, 150, 243, 0.3);
}

.nav-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav-quick-btn {
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(25, 118, 210, 0.3);
  border-radius: 12px;
  padding: 15px 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 800;
  color: #0d47a1;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.nav-quick-btn:hover {
  background: linear-gradient(135deg, rgba(227, 242, 253, 0.9), rgba(240, 248, 255, 0.9));
  border-color: #1976d2;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(25, 118, 210, 0.3);
}

.nav-icon {
  font-size: 1.2rem;
  width: 25px;
  text-align: center;
}

/* Right Panel */
.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

/* Enhanced Timeline Section - Removed Line and Scrollbar */
.timeline-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 25px;
  padding: 25px;
  box-shadow: 
    0 15px 35px rgba(25, 118, 210, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(25, 118, 210, 0.3);
  backdrop-filter: blur(10px);
}

.timeline-header {
  text-align: center;
  margin-bottom: 25px;
}

.timeline-title {
  font-size: 2rem;
  font-weight: 900;
  color: #0d47a1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 0;
  text-shadow: 0 3px 6px rgba(25, 118, 210, 0.3);
}

.title-icon {
  font-size: 2rem;
}

.journey-badge {
  background: linear-gradient(45deg, #1976d2, #2196f3);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 900;
  letter-spacing: 1.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.4);
}

.timeline-wrapper {
  padding: 10px 0;
}

.timeline-controls {
  display: flex;
  align-items: center;
  gap: 20px;
  min-width: 100%;
  justify-content: center;
}

.nav-btn {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1976d2, #2196f3);
  color: white;
  border: none;
  font-size: 1.3rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
  flex-shrink: 0;
}

.nav-btn:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 15px rgba(25, 118, 210, 0.4);
}

.nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.transaction-chain-container {
  position: relative;
  flex: 1;
  max-width: 900px;
}

.transaction-cards-row {
  display: flex;
  gap: 0;
  justify-content: space-between;
  position: relative;
  z-index: 1;
  padding: 20px 0;
}

.transaction-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 16px 14px;
  min-width: 140px;
  max-width: 160px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid rgba(25, 118, 210, 0.2);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(25, 118, 210, 0.1);
  flex-shrink: 0;
  margin: 0 -5px;
  opacity: 0;
  transform: translateY(100px) scale(0.5);
  animation: dramaticSlideIn 1.2s ease-out forwards;
}

.transaction-card:nth-child(1) { 
  animation-delay: 1s; 
  transform: translateX(-200px) translateY(80px) scale(0.5) rotateY(-30deg);
}
.transaction-card:nth-child(2) { 
  animation-delay: 2s; 
  transform: translateX(-100px) translateY(100px) scale(0.5) rotateY(-20deg);
}
.transaction-card:nth-child(3) { 
  animation-delay: 3s; 
  transform: translateY(120px) scale(0.5);
}
.transaction-card:nth-child(4) { 
  animation-delay: 4s; 
  transform: translateX(100px) translateY(100px) scale(0.5) rotateY(20deg);
}
.transaction-card:nth-child(5) { 
  animation-delay: 5s; 
  transform: translateX(200px) translateY(80px) scale(0.5) rotateY(30deg);
}
.transaction-card:nth-child(6) { 
  animation-delay: 6s; 
  transform: translateX(150px) translateY(90px) scale(0.5) rotateY(25deg);
}

@keyframes dramaticSlideIn {
  0% {
    opacity: 0;
  }
  20% {
    opacity: 0.3;
    transform: translateX(0) translateY(-30px) scale(0.8) rotateY(0deg);
  }
  40% {
    opacity: 0.6;
    transform: translateX(0) translateY(-10px) scale(1.1) rotateY(0deg);
  }
  60% {
    opacity: 0.8;
    transform: translateX(0) translateY(5px) scale(0.95) rotateY(0deg);
  }
  80% {
    opacity: 0.9;
    transform: translateX(0) translateY(-2px) scale(1.02) rotateY(0deg);
  }
  100% {
    opacity: 1;
    transform: translateX(0) translateY(0) scale(1) rotateY(0deg);
  }
}

.loading-shimmer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(33, 150, 243, 0.4),
    transparent
  );
  animation: shimmerSweep 0.8s ease-out;
  animation-delay: calc(var(--animation-order) * 1s + 1.2s);
  border-radius: 16px;
}

@keyframes shimmerSweep {
  0% {
    left: -100%;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    left: 100%;
    opacity: 0;
  }
}

.data-reveal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(25, 118, 210, 0.8),
    rgba(33, 150, 243, 0.6)
  );
  opacity: 1;
  animation: revealData 0.6s ease-out forwards;
  animation-delay: calc(var(--animation-order) * 1s + 1.4s);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 900;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
  padding: 5px;
  line-height: 1.2;
}

.data-reveal-overlay::before {
  content: 'Loading Data...';
  animation: pulseText 0.5s infinite alternate;
}

@keyframes revealData {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  80% {
    opacity: 0.8;
    transform: scale(1.05);
  }
  100% {
    opacity: 0;
    transform: scale(1.1);
    pointer-events: none;
  }
}

@keyframes pulseText {
  0% { opacity: 0.7; }
  100% { opacity: 1; }
}

.arrival-burst {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 215, 0, 0.8),
    rgba(33, 150, 243, 0.6),
    transparent
  );
  transform: translate(-50%, -50%) scale(0);
  animation: burstExplosion 0.8s ease-out;
  animation-delay: calc(var(--animation-order) * 1s + 1s);
  pointer-events: none;
}

@keyframes burstExplosion {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, -50%) scale(4);
    opacity: 0;
  }
}

.data-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  animation: particleFloat 1s ease-out;
  animation-delay: calc(var(--animation-order) * 1s + 1.6s);
}

.data-particles::before,
.data-particles::after {
  content: '✨';
  position: absolute;
  font-size: 1rem;
  color: #ffd700;
  animation: floatUp 1.5s ease-out forwards;
}

.data-particles::before {
  top: 20%;
  left: 20%;
  animation-delay: 0s;
}

.data-particles::after {
  top: 30%;
  right: 20%;
  animation-delay: 0.3s;
}

@keyframes floatUp {
  0% {
    opacity: 0;
    transform: translateY(0) scale(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-20px) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-40px) scale(0.5);
  }
}

.day-number {
  font-size: 1.8rem;
  font-weight: 900;
  color: #1976d2;
  text-shadow: 0 2px 4px rgba(25, 118, 210, 0.3);
  margin-bottom: 2px;
  animation: countUp 0.8s ease-out;
  animation-delay: calc(var(--animation-order) * 1s + 1.8s);
  animation-fill-mode: both;
}

@keyframes countUp {
  0% {
    transform: scale(2) rotate(180deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(0deg);
    opacity: 0.8;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.transaction-count.counting-animation {
  animation: fadeInUp 0.6s ease-out;
  animation-delay: calc(var(--animation-order) * 1s + 2s);
  animation-fill-mode: both;
  opacity: 0;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.transaction-type {
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  opacity: 0;
  transform: scale(0);
  animation: popIn 0.4s ease-out forwards;
  animation-delay: calc(var(--animation-order) * 1s + 2.2s + var(--event-delay, 0s));
}

@keyframes popIn {
  0% {
    opacity: 0;
    transform: scale(0) rotate(-180deg);
  }
  70% {
    opacity: 1;
    transform: scale(1.2) rotate(10deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

.change-value.counting-number {
  animation: numberReveal 0.8s ease-out;
  animation-delay: calc(var(--animation-order) * 1s + 2.4s);
  animation-fill-mode: both;
}

@keyframes numberReveal {
  0% {
    opacity: 0;
    transform: rotateX(90deg) scale(0.5);
  }
  50% {
    opacity: 0.7;
    transform: rotateX(45deg) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: rotateX(0deg) scale(1);
  }
}

.transaction-card::after {
  content: '✨';
  position: absolute;
  top: -10px;
  right: -5px;
  font-size: 1.2rem;
  opacity: 0;
  animation: sparkleAppear 0.6s ease-out forwards;
  animation-delay: inherit;
  z-index: 10;
}

@keyframes sparkleAppear {
  0% {
    opacity: 0;
    transform: scale(0) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1.5) rotate(180deg);
  }
  100% {
    opacity: 0;
    transform: scale(0.5) rotate(360deg);
  }
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(33, 150, 243, 0.15), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
  animation: rotateGlow 4s infinite linear;
}

.transaction-card:hover .card-glow {
  opacity: 1;
}

.transaction-card:hover {
  transform: translateY(-8px) scale(1.05);
  box-shadow: 0 12px 30px rgba(25, 118, 210, 0.25);
  border-color: #1976d2;
  z-index: 10;
}

.transaction-card.active {
  border-color: #1976d2;
  background: rgba(227, 242, 253, 0.98);
  box-shadow: 0 8px 25px rgba(25, 118, 210, 0.3);
  transform: translateY(-5px) scale(1.08);
  z-index: 5;
}

.transaction-card.active .card-glow {
  opacity: 1;
}

.active-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #1976d2, #2196f3);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 16px 16px 0 0;
}

.transaction-card.active .active-indicator {
  opacity: 1;
  animation: activeGlow 2s infinite alternate;
}

@keyframes activeGlow {
  0% { box-shadow: 0 0 5px rgba(33, 150, 243, 0.5); }
  100% { box-shadow: 0 0 15px rgba(33, 150, 243, 0.8); }
}

.transaction-card-header {
  text-align: center;
  margin-bottom: 12px;
  border-bottom: 1px solid rgba(25, 118, 210, 0.1);
  padding-bottom: 8px;
}

.day-number {
  font-size: 1.8rem;
  font-weight: 900;
  color: #1976d2;
  text-shadow: 0 2px 4px rgba(25, 118, 210, 0.3);
  margin-bottom: 2px;
}

.day-date {
  font-size: 0.75rem;
  color: #1565c0;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.transaction-summary {
  margin-bottom: 12px;
  min-height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.has-transactions {
  text-align: center;
}

.transaction-count {
  font-size: 0.8rem;
  color: #0d47a1;
  font-weight: 700;
  margin-bottom: 6px;
}

.transaction-types {
  display: flex;
  gap: 3px;
  justify-content: center;
  flex-wrap: wrap;
}

.transaction-type {
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.transaction-type.buy {
  background: rgba(46, 125, 50, 0.15);
  color: #2e7d32;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.transaction-type.sell {
  background: rgba(211, 47, 47, 0.15);
  color: #d32f2f;
  border: 1px solid rgba(244, 67, 54, 0.3);
}

.no-transactions {
  text-align: center;
  opacity: 0.6;
}

.no-transaction-icon {
  font-size: 1.2rem;
  margin-bottom: 4px;
}

.no-transaction-text {
  font-size: 0.7rem;
  color: #1565c0;
  font-weight: 600;
}

.card-footer {
  border-top: 1px solid rgba(25, 118, 210, 0.1);
  padding-top: 8px;
}

.portfolio-change {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.change-label {
  font-size: 0.7rem;
  color: #1565c0;
  font-weight: 600;
}

.change-value {
  font-size: 0.8rem;
  font-weight: 900;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.change-value.positive {
  color: #2e7d32;
}

.change-value.negative {
  color: #c62828;
}

/* Portfolio Display - Updated to Blue Theme */
.portfolio-display {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.portfolio-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.portfolio-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 
    0 8px 20px rgba(25, 118, 210, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  border: 2px solid rgba(25, 118, 210, 0.3);
}

.portfolio-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 25px rgba(25, 118, 210, 0.3);
}

.current-card {
  border-top: 4px solid #2196F3;
}

.final-card {
  border-top: 4px solid #1976d2;
}

.card-header {
  text-align: center;
  margin-bottom: 15px;
  border-bottom: 2px solid rgba(25, 118, 210, 0.1);
  padding-bottom: 12px;
}

.card-icon {
  font-size: 1.8rem;
  margin-bottom: 8px;
}

.card-title {
  font-size: 1.2rem;
  font-weight: 900;
  color: #0d47a1;
  margin: 0 0 5px 0;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  text-shadow: 0 2px 4px rgba(25, 118, 210, 0.3);
}

.card-subtitle {
  font-size: 0.9rem;
  color: #1565c0;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Loading Spinner */
.loading-spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  flex-direction: column;
  gap: 20px;
}

.loading-spinner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.spinner-ring {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(25, 118, 210, 0.2);
  border-top: 4px solid #1976d2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  position: absolute;
}

.spinner-ring:nth-child(1) {
  animation-delay: 0s;
  width: 60px;
  height: 60px;
}

.spinner-ring:nth-child(2) {
  animation-delay: 0.3s;
  width: 80px;
  height: 80px;
  border-color: rgba(33, 150, 243, 0.2);
  border-top-color: #2196f3;
  top: -10px;
  left: -10px;
}

.spinner-ring:nth-child(3) {
  animation-delay: 0.6s;
  width: 100px;
  height: 100px;
  border-color: rgba(66, 165, 245, 0.2);
  border-top-color: #42a5f5;
  top: -20px;
  left: -20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  margin-top: 70px;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1565c0;
  text-align: center;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

/* Day Events */
.day-events {
  margin-bottom: 20px;
}

.events-title {
  font-size: 1rem;
  font-weight: 700;
  color: #0d47a1;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.event-card {
  background: rgba(227, 242, 253, 0.5);
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 12px;
  border-left: 3px solid;
  transition: all 0.3s ease;
  border: 1px solid rgba(25, 118, 210, 0.2);
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
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.event-type {
  font-weight: 900;
  font-size: 1.1rem;
  color: #0d47a1;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(25, 118, 210, 0.3);
}

.event-stock {
  font-weight: 900;
  color: #1976d2;
  font-size: 1.1rem;
  text-shadow: 0 2px 4px rgba(25, 118, 210, 0.3);
}

.event-details {
  margin-bottom: 10px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  color: #1565c0;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 3px 0;
}

.detail-row span:first-child {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.detail-row span:last-child {
  font-weight: 800;
  color: #0d47a1;
  text-shadow: 0 1px 3px rgba(25, 118, 210, 0.2);
}

.no-events {
  text-align: center;
  padding: 25px 15px;
  color: #1565c0;
}

.no-events-icon {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.no-events-text {
  font-size: 1rem;
  font-weight: 500;
}

/* Current Holdings - Updated to Blue Theme */
.current-holdings {
  border-top: 2px solid rgba(25, 118, 210, 0.1);
  padding-top: 15px;
}

.holdings-title {
  font-size: 1rem;
  font-weight: 700;
  color: #0d47a1;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.holdings-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.stat-card {
  background: rgba(227, 242, 253, 0.5);
  border: 1px solid rgba(25, 118, 210, 0.2);
  border-radius: 10px;
  padding: 12px;
  text-align: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  background: rgba(227, 242, 253, 0.8);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
}

.stat-icon {
  font-size: 1.2rem;
  margin-bottom: 6px;
}

.stat-value {
  font-weight: 900;
  font-size: 1.1rem;
  color: #0d47a1;
  margin-bottom: 3px;
  text-shadow: 0 2px 4px rgba(25, 118, 210, 0.2);
}

.stat-value.positive {
  color: #2e7d32;
  text-shadow: 0 2px 4px rgba(76, 175, 80, 0.3);
}

.stat-value.negative {
  color: #c62828;
  text-shadow: 0 2px 4px rgba(244, 67, 54, 0.3);
}

.stat-label {
  font-size: 0.8rem;
  color: #1565c0;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 800;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Journey Overview */
.journey-overview {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.overview-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.overview-item {
  background: rgba(227, 242, 253, 0.5);
  border: 1px solid rgba(25, 118, 210, 0.2);
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  transition: all 0.3s ease;
}

.overview-item:hover {
  background: rgba(227, 242, 253, 0.8);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
}

.overview-icon {
  font-size: 1.5rem;
  margin-bottom: 8px;
}

.overview-value {
  font-weight: 900;
  font-size: 1.2rem;
  color: #0d47a1;
  margin-bottom: 4px;
  text-shadow: 0 2px 4px rgba(25, 118, 210, 0.2);
}

.overview-label {
  font-size: 0.8rem;
  color: #1565c0;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 800;
}

.progress-overview {
  background: rgba(227, 242, 253, 0.3);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(25, 118, 210, 0.2);
}

.progress-bar-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-label {
  font-weight: 700;
  color: #0d47a1;
  font-size: 1rem;
  text-align: center;
}

.journey-progress-bar {
  height: 8px;
  background: rgba(25, 118, 210, 0.2);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.journey-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #1976d2, #42a5f5);
  border-radius: 4px;
  transition: width 0.5s ease;
  box-shadow: 0 0 10px rgba(33, 150, 243, 0.5);
  position: relative;
}

.journey-progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 6px;
  height: 100%;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 0 4px 4px 0;
}

.progress-percentage {
  text-align: center;
  font-weight: 900;
  color: #0d47a1;
  font-size: 0.9rem;
}

.end-journey-btn {
  background: linear-gradient(135deg, #1976d2, #42a5f5);
  color: white;
  border: none;
  padding: 15px 25px;
  border-radius: 25px;
  font-weight: 900;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  box-shadow: 0 6px 15px rgba(25, 118, 210, 0.3);
}

.end-journey-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(25, 118, 210, 0.4);
}

.btn-icon {
  font-size: 1.2rem;
}

.btn-text {
  font-size: 1rem;
}

/* Final Summary */
.final-summary {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.final-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid rgba(25, 118, 210, 0.1);
  font-weight: 700;
}

.final-item span:first-child {
  color: #1565c0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.final-item span:last-child {
  color: #0d47a1;
  text-shadow: 0 1px 3px rgba(25, 118, 210, 0.2);
}

.final-item.highlight {
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.15), rgba(33, 150, 243, 0.15));
  padding: 12px 15px;
  border-radius: 10px;
  border-bottom: none;
  font-weight: 900;
  border: 2px solid rgba(25, 118, 210, 0.3);
}

.value.positive {
  color: #2e7d32;
  text-shadow: 0 2px 4px rgba(76, 175, 80, 0.3);
  font-weight: 900;
}

.value.negative {
  color: #c62828;
  text-shadow: 0 2px 4px rgba(244, 67, 54, 0.3);
  font-weight: 900;
}

/* Journey Actions */
.journey-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  padding: 20px;
  margin-top: 25px;
}

.action-btn {
  padding: 15px 30px;
  border: none;
  border-radius: 25px;
  font-weight: 900;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.action-btn.primary {
  background: linear-gradient(135deg, #1976d2, #42a5f5);
  color: white;
  box-shadow: 0 6px 15px rgba(25, 118, 210, 0.3);
}

.action-btn.secondary {
  background: linear-gradient(135deg, #607D8B, #90A4AE);
  color: white;
  box-shadow: 0 6px 15px rgba(96, 125, 139, 0.3);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .combined-content {
    grid-template-columns: 1fr;
    gap: 25px;
  }
  
  .dice-section {
    min-height: auto;
  }
  
  .journey-content {
    flex-direction: column;
    gap: 20px;
  }
  
  .left-panel {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .setup-summary, .dice-control-panel, .journey-navigation {
    flex: 1;
    min-width: 300px;
  }
  
  .portfolio-grid {
    grid-template-columns: 1fr;
  }
  
  .holdings-stats {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .transaction-cards-row {
    padding: 15px 0;
  }
  
  .transaction-card {
    min-width: 120px;
    max-width: 140px;
    padding: 14px 12px;
    margin: 0 -3px;
  }
  
  .day-number {
    font-size: 1.6rem;
  }
  
  .day-date {
    font-size: 0.7rem;
  }
}

@media (max-width: 768px) {
  .journey-container {
    padding: 15px;
  }
  
  .combined-header .setup-title {
    font-size: 2rem;
  }
  
  .product-selector {
    grid-template-columns: 1fr;
  }
  
  .dice-container {
    gap: 20px;
  }
  
  .timeline-controls {
    flex-direction: column;
    gap: 15px;
  }
  
  .transaction-chain-container {
    order: 2;
    max-width: 100%;
  }
  
  .nav-btn {
    order: 1;
  }
  
  .nav-btn.next {
    order: 3;
  }
  
  .transaction-cards-row {
    padding: 15px 5px;
    gap: 5px;
    justify-content: flex-start;
  }
  
  .transaction-card {
    min-width: 110px;
    max-width: 120px;
    padding: 12px 10px;
    margin: 0 -2px;
  }
  
  .day-number {
    font-size: 1.4rem;
  }
  
  .day-date {
    font-size: 0.65rem;
  }
  
  .transaction-count {
    font-size: 0.75rem;
  }
  
  .transaction-type {
    font-size: 0.6rem;
    padding: 1px 4px;
  }
  
  .change-label, .change-value {
    font-size: 0.65rem;
  }
  
  .left-panel {
    flex-direction: column;
  }
  
  .setup-summary, .dice-control-panel, .journey-navigation {
    min-width: auto;
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
  .setup-section, .dice-section {
    padding: 20px;
  }
  
  .dice-cube {
    width: 50px;
    height: 50px;
  }
  
  .dice-face {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
  
  .transaction-cards-row {
    padding: 10px 5px;
    justify-content: flex-start;
  }
  
  .transaction-card {
    min-width: 100px;
    max-width: 105px;
    padding: 10px 8px;
    margin: 0 -1px;
  }
  
  .day-number {
    font-size: 1.2rem;
  }
  
  .day-date {
    font-size: 0.6rem;
  }
  
  .transaction-count {
    font-size: 0.7rem;
  }
  
  .transaction-type {
    font-size: 0.55rem;
    padding: 1px 3px;
  }
  
  .change-label, .change-value {
    font-size: 0.6rem;
  }
  
  .no-transaction-icon {
    font-size: 1rem;
  }
  
  .no-transaction-text {
    font-size: 0.6rem;
  }
}

</style>