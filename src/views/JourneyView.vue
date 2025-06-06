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
                <div class="dice-magic-circle" :class="{ active: isRolling }"></div>
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
                    <div class="chain-line"></div>
                    <div class="transaction-cards-row">
                      <div 
                        v-for="(day, index) in lastFiveTransactionDays" 
                        :key="day.day"
                        :class="['transaction-card', { 
                          active: day.day === currentDay?.day,
                          'has-events': day.events && day.events.length > 0 
                        }]"
                        @click="goToDay(day.day - 1)"
                      >
                        <div class="card-glow"></div>
                        <div class="transaction-card-header">
                          <div class="day-number">{{ day.day }}</div>
                          <div class="day-date">{{ formatDate(day.date) }}</div>
                        </div>
                        
                        <div class="transaction-summary">
                          <div v-if="day.events && day.events.length > 0" class="has-transactions">
                            <div class="transaction-count">{{ day.events.length }} Transaction{{ day.events.length > 1 ? 's' : '' }}</div>
                            <div class="transaction-types">
                              <span 
                                v-for="event in day.events" 
                                :key="event.type"
                                :class="['transaction-type', event.type.toLowerCase()]"
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
                            <span :class="['change-value', day.portfolio?.percentChange >= 0 ? 'positive' : 'negative']">
                              {{ day.portfolio?.percentChange >= 0 ? '+' : '' }}{{ (day.portfolio?.percentChange || 0).toFixed(1) }}%
                            </span>
                          </div>
                        </div>
                        
                        <div class="active-indicator"></div>
                        <div class="chain-connector" v-if="index < lastFiveTransactionDays.length - 1"></div>
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
                    <h3 class="card-title">TODAY'S SNAPSHOT</h3>
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
                      </div>
                    </div>

                    <div v-else class="no-events">
                      <div class="no-events-icon">😌</div>
                      <div class="no-events-text">No transactions today</div>
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
                    <h3 class="card-title">FINAL RESULTS</h3>
                    <div class="card-subtitle">Journey Complete</div>
                  </div>
                  <div class="card-content">
                    <div class="final-summary">
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

const currentDayEvents = computed(() => {
  return currentDay.value?.events || [];
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
  background: linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 25%, #80cbc4 50%, #4db6ac 75%, #26a69a 100%);
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
  background: radial-gradient(circle, rgba(0, 150, 136, 0.2), rgba(0, 188, 212, 0.1));
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
    linear-gradient(rgba(0, 150, 136, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 150, 136, 0.1) 1px, transparent 1px);
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
    rgba(0, 188, 212, 0.1) 50%, 
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
  filter: drop-shadow(0 0 20px rgba(0, 150, 136, 0.6));
}

@keyframes iconFloat {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-10px) scale(1.05); }
}

.setup-title {
  font-size: 2.5rem;
  font-weight: 900;
  color: #004d40;
  margin-bottom: 15px;
  text-shadow: 
    0 0 20px rgba(0, 150, 136, 0.4),
    0 4px 8px rgba(0, 0, 0, 0.2);
  background: linear-gradient(45deg, #00695c, #00acc1);
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
  color: #00695c;
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
    0 15px 35px rgba(0, 150, 136, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(0, 150, 136, 0.3);
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
  background: linear-gradient(135deg, rgba(0, 150, 136, 0.2), rgba(0, 188, 212, 0.1));
  border-radius: 50%;
  border: 2px solid rgba(0, 150, 136, 0.4);
  animation: iconPulse 2s infinite alternate;
}

@keyframes iconPulse {
  0% { box-shadow: 0 0 10px rgba(0, 150, 136, 0.3); }
  100% { box-shadow: 0 0 20px rgba(0, 188, 212, 0.5); }
}

.section-header h3 {
  color: #004d40;
  font-size: 1.4rem;
  font-weight: 900;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 150, 136, 0.2);
}

.date-input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.date-input-group label {
  font-weight: 800;
  color: #00695c;
  font-size: 1.1rem;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.date-input {
  padding: 12px 15px;
  border: 2px solid rgba(0, 150, 136, 0.3);
  border-radius: 12px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.8);
  color: #004d40;
  transition: all 0.3s ease;
}

.date-input:focus {
  outline: none;
  border-color: #00acc1;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 0 15px rgba(0, 188, 212, 0.3);
}

/* Enhanced Product Selection with Graphics */
.product-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.product-card {
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(0, 150, 136, 0.3);
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
  background: radial-gradient(circle, rgba(0, 188, 212, 0.2), transparent);
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
    0 15px 30px rgba(0, 150, 136, 0.3),
    0 0 20px rgba(0, 188, 212, 0.4);
  border-color: #00acc1;
}

.product-card.active {
  border-color: #00acc1;
  background: rgba(224, 242, 241, 0.9);
  box-shadow: 
    0 8px 25px rgba(0, 150, 136, 0.4),
    0 0 30px rgba(0, 188, 212, 0.3);
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
  filter: drop-shadow(0 0 10px rgba(0, 150, 136, 0.4));
  transition: all 0.3s ease;
}

.product-card:hover .product-icon {
  transform: scale(1.1) rotate(5deg);
  filter: drop-shadow(0 0 15px rgba(0, 188, 212, 0.6));
}

.product-name {
  font-size: 1.1rem;
  font-weight: 900;
  color: #004d40;
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
  border: 2px solid rgba(0, 150, 136, 0.3);
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.8);
  color: #004d40;
  transition: all 0.3s ease;
  text-align: center;
}

.amount-input:focus {
  outline: none;
  border-color: #00acc1;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 0 15px rgba(0, 188, 212, 0.3);
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
  border: 2px solid rgba(0, 150, 136, 0.4);
  border-radius: 15px;
  font-weight: 800;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #00695c;
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
  background: linear-gradient(90deg, transparent, rgba(0, 188, 212, 0.3), transparent);
  transition: left 0.3s ease;
}

.amount-btn:hover::before {
  left: 100%;
}

.amount-btn:hover {
  background: rgba(224, 242, 241, 0.9);
  transform: translateY(-1px);
  border-color: #00acc1;
}

.amount-btn.active {
  background: linear-gradient(45deg, #00acc1, #26a69a);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 15px rgba(0, 150, 136, 0.4);
}

/* Enhanced Dice Section with More Graphics */
.dice-section {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 25px;
  padding: 30px;
  box-shadow: 
    0 15px 35px rgba(0, 150, 136, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(0, 150, 136, 0.3);
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
  color: #004d40;
  margin-bottom: 10px;
  text-shadow: 0 3px 6px rgba(0, 150, 136, 0.4);
}

.dice-subtitle {
  font-size: 1.1rem;
  color: #00695c;
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
  color: #004d40;
  margin-bottom: 8px;
  font-size: 1rem;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.progress-bar {
  height: 6px;
  background: rgba(0, 150, 136, 0.2);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00acc1, #26a69a);
  border-radius: 3px;
  transition: width 0.5s ease;
  box-shadow: 0 0 10px rgba(0, 188, 212, 0.5);
}

/* Enhanced Dice Arena with More Graphics */
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
}

.dice-magic-circle {
  position: absolute;
  width: 200px;
  height: 200px;
  border: 3px solid rgba(0, 150, 136, 0.3);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: all 0.3s ease;
}

.dice-magic-circle.active {
  opacity: 1;
  animation: magicCircle 2s infinite linear;
  border-color: #00acc1;
  box-shadow: 
    0 0 20px rgba(0, 188, 212, 0.5),
    inset 0 0 20px rgba(0, 150, 136, 0.2);
}

@keyframes magicCircle {
  0% { transform: translate(-50%, -50%) rotate(0deg) scale(1); }
  50% { transform: translate(-50%, -50%) rotate(180deg) scale(1.05); }
  100% { transform: translate(-50%, -50%) rotate(360deg) scale(1); }
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
  0% { transform: rotateX(0) rotateY(0) rotateZ(0); }
  25% { transform: rotateX(90deg) rotateY(45deg) rotateZ(45deg); }
  50% { transform: rotateX(180deg) rotateY(90deg) rotateZ(90deg); }
  75% { transform: rotateX(270deg) rotateY(135deg) rotateZ(135deg); }
  100% { transform: rotateX(360deg) rotateY(180deg) rotateZ(180deg); }
}

.dice-face {
  position: absolute;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #00acc1, #26a69a);
  border: 2px solid white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 900;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  box-shadow: 0 4px 12px rgba(0, 150, 136, 0.3);
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
  background: radial-gradient(circle, rgba(0, 188, 212, 0.4), transparent);
  border-radius: 50%;
  animation: diceGlow 2s infinite alternate;
}

@keyframes diceGlow {
  0% { opacity: 0.5; transform: scale(1); }
  100% { opacity: 0.8; transform: scale(1.1); }
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
  0% { transform: scale(0); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.8; }
  100% { transform: scale(3); opacity: 0; }
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
  }
  50% { 
    opacity: 1; 
    transform: scale(1) rotate(180deg); 
  }
  100% { 
    opacity: 0; 
    transform: scale(0.5) rotate(360deg); 
  }
}

.dice-results {
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(224, 242, 241, 0.5);
  border-radius: 15px;
  padding: 20px;
  border: 1px solid rgba(0, 150, 136, 0.2);
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
  border: 2px solid rgba(0, 150, 136, 0.3);
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
  color: #004d40;
}

.total-days {
  background: linear-gradient(135deg, rgba(0, 150, 136, 0.2), rgba(0, 188, 212, 0.1));
  border: 2px solid rgba(0, 150, 136, 0.4);
  border-radius: 12px;
  padding: 15px;
  display: inline-block;
}

.total-label {
  font-size: 1rem;
  color: #00695c;
  margin-bottom: 5px;
}

.total-value {
  font-size: 2rem;
  font-weight: 900;
  color: #004d40;
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
  background: linear-gradient(135deg, #00acc1, #26a69a);
  color: white;
  border: none;
  padding: 0;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(0, 150, 136, 0.3);
  position: relative;
  overflow: hidden;
}

.roll-btn:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 10px 25px rgba(0, 150, 136, 0.4);
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

/* Left Panel */
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
    0 10px 25px rgba(0, 150, 136, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(0, 150, 136, 0.3);
  backdrop-filter: blur(10px);
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid rgba(0, 150, 136, 0.1);
}

.summary-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(0, 150, 136, 0.2), rgba(0, 188, 212, 0.1));
  border-radius: 50%;
  border: 2px solid rgba(0, 150, 136, 0.3);
}

.summary-header h3 {
  color: #004d40;
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
  color: #00695c;
}

.item-value {
  font-weight: 700;
  color: #004d40;
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
  background: rgba(224, 242, 241, 0.5);
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid rgba(0, 150, 136, 0.2);
}

.roll-icon {
  font-size: 1rem;
}

.roll-value {
  font-weight: 900;
  color: #004d40;
  font-size: 1.1rem;
}

.total-summary {
  text-align: center;
  font-weight: 900;
  color: #004d40;
  background: linear-gradient(135deg, rgba(0, 150, 136, 0.2), rgba(0, 188, 212, 0.1));
  padding: 12px;
  border-radius: 10px;
  font-size: 1.1rem;
  border: 2px solid rgba(0, 150, 136, 0.3);
}

/* Enhanced Dice Control Panel */
.dice-control-panel {
  border: 2px solid rgba(0, 150, 136, 0.4);
}

.journey-dice-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 15px 0;
  border-top: 1px solid rgba(0, 150, 136, 0.2);
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
  background: linear-gradient(135deg, #00acc1, #26a69a);
  border: 2px solid white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 150, 136, 0.3);
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
  border: 2px solid rgba(0, 150, 136, 0.3);
  border-radius: 12px;
  padding: 15px 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 800;
  color: #004d40;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.nav-quick-btn:hover {
  background: linear-gradient(135deg, rgba(224, 242, 241, 0.9), rgba(240, 248, 255, 0.9));
  border-color: #00acc1;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 150, 136, 0.3);
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

/* Enhanced Timeline Section with Blue Theme and Chain Design */
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
  overflow-x: auto;
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

.chain-line {
  position: absolute;
  top: 50%;
  left: 5%;
  right: 5%;
  height: 4px;
  background: linear-gradient(90deg, 
    rgba(25, 118, 210, 0.3), 
    rgba(33, 150, 243, 0.5), 
    rgba(25, 118, 210, 0.3)
  );
  transform: translateY(-50%);
  z-index: 0;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.2);
}

.transaction-cards-row {
  display: flex;
  gap: 0;
  justify-content: space-between;
  position: relative;
  z-index: 1;
  overflow-x: auto;
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

.chain-connector {
  position: absolute;
  right: -10px;
  top: 50%;
  width: 20px;
  height: 4px;
  background: linear-gradient(90deg, rgba(33, 150, 243, 0.4), rgba(25, 118, 210, 0.3));
  transform: translateY(-50%);
  z-index: 0;
  border-radius: 2px;
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

/* Portfolio Display */
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
    0 8px 20px rgba(0, 150, 136, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.portfolio-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 25px rgba(0, 150, 136, 0.3);
}

.current-card {
  border: 2px solid rgba(33, 150, 243, 0.3);
  border-top: 4px solid #2196F3;
}

.final-card {
  border: 2px solid rgba(76, 175, 80, 0.3);
  border-top: 4px solid #4CAF50;
}

.card-header {
  text-align: center;
  margin-bottom: 15px;
  border-bottom: 2px solid rgba(0, 150, 136, 0.1);
  padding-bottom: 12px;
}

.card-icon {
  font-size: 1.8rem;
  margin-bottom: 8px;
}

.card-title {
  font-size: 1.2rem;
  font-weight: 900;
  color: #004d40;
  margin: 0 0 5px 0;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  text-shadow: 0 2px 4px rgba(0, 150, 136, 0.3);
}

.card-subtitle {
  font-size: 0.9rem;
  color: #00695c;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Day Events */
.day-events {
  margin-bottom: 20px;
}

.events-title {
  font-size: 1rem;
  font-weight: 700;
  color: #004d40;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.event-card {
  background: rgba(224, 242, 241, 0.5);
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 12px;
  border-left: 3px solid;
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
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 150, 136, 0.2);
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
  color: #004d40;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(0, 150, 136, 0.3);
}

.event-stock {
  font-weight: 900;
  color: #00acc1;
  font-size: 1.1rem;
  text-shadow: 0 2px 4px rgba(0, 150, 136, 0.3);
}

.event-details {
  margin-bottom: 10px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  color: #00695c;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 3px 0;
}

.detail-row span:first-child {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.detail-row span:last-child {
  font-weight: 800;
  color: #004d40;
  text-shadow: 0 1px 3px rgba(0, 150, 136, 0.2);
}

.no-events {
  text-align: center;
  padding: 25px 15px;
  color: #00695c;
}

.no-events-icon {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.no-events-text {
  font-size: 1rem;
  font-weight: 500;
}

/* Current Holdings */
.current-holdings {
  border-top: 2px solid rgba(0, 150, 136, 0.1);
  padding-top: 15px;
}

.holdings-title {
  font-size: 1rem;
  font-weight: 700;
  color: #004d40;
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
  background: rgba(224, 242, 241, 0.5);
  border: 1px solid rgba(0, 150, 136, 0.2);
  border-radius: 10px;
  padding: 12px;
  text-align: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  background: rgba(178, 223, 219, 0.4);
  transform: translateY(-1px);
}

.stat-icon {
  font-size: 1.2rem;
  margin-bottom: 6px;
}

.stat-value {
  font-weight: 900;
  font-size: 1.1rem;
  color: #004d40;
  margin-bottom: 3px;
  text-shadow: 0 2px 4px rgba(0, 150, 136, 0.2);
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
  color: #00695c;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 800;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
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
  border-bottom: 1px solid rgba(0, 150, 136, 0.1);
  font-weight: 700;
}

.final-item span:first-child {
  color: #00695c;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.final-item span:last-child {
  color: #004d40;
  text-shadow: 0 1px 3px rgba(0, 150, 136, 0.2);
}

.final-item.highlight {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.15), rgba(139, 195, 74, 0.15));
  padding: 12px 15px;
  border-radius: 10px;
  border-bottom: none;
  font-weight: 900;
  border: 2px solid rgba(76, 175, 80, 0.3);
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
  background: linear-gradient(135deg, #00acc1, #26a69a);
  color: white;
  box-shadow: 0 6px 15px rgba(0, 150, 136, 0.3);
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
  
  .transaction-cards-container {
    padding: 15px 5px;
    gap: 0;
  }
  
  .transaction-card {
    min-width: 120px;
    max-width: 130px;
    padding: 14px 12px;
    margin: 0 -6px;
  }
  
  .day-number {
    font-size: 1.5rem;
  }
  
  .day-date {
    font-size: 0.7rem;
  }
  
  .transaction-count {
    font-size: 0.8rem;
  }
  
  .transaction-type {
    font-size: 0.65rem;
    padding: 1px 4px;
  }
  
  .change-label, .change-value {
    font-size: 0.7rem;
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
  
  .transaction-cards-container {
    padding: 10px 5px;
    overflow-x: auto;
  }
  
  .transaction-card {
    min-width: 100px;
    max-width: 110px;
    padding: 12px 8px;
    margin: 0 -4px;
  }
  
  .day-number {
    font-size: 1.3rem;
  }
  
  .day-date {
    font-size: 0.65rem;
  }
  
  .transaction-count {
    font-size: 0.7rem;
  }
  
  .transaction-type {
    font-size: 0.6rem;
    padding: 1px 3px;
  }
  
  .change-label, .change-value {
    font-size: 0.65rem;
  }
  
  .no-transaction-icon {
    font-size: 1.1rem;
  }
  
  .no-transaction-text {
    font-size: 0.65rem;
  }
}
</style>