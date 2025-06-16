<template>
  <div class="journey-view">
    <!-- Animated Background -->
    <div class="journey-background">
      <div class="floating-shapes">
        <div v-for="n in 15" :key="n" class="shape" :style="getShapeStyle(n)"></div>
      </div>
      <div class="grid-pattern"></div>
    </div>

    <!-- Main Journey Container -->
    <div class="journey-container">

      <!-- Top Layout Row (visible during journey) -->
      <div v-if="currentPhase === 'journey'" class="top-layout-row">
        
        <!-- Left Pane: Configuration and NIFTY Comparison -->
        <div class="left-pane">
          <!-- Configuration Summary -->
          <div class="config-summary-panel">
            <div class="config-summary-header">
              <div class="summary-icon">⚙️</div>
              <h3 class="summary-title">Configuration</h3>
            </div>
            
            <div class="config-details-grid">
              <div class="config-detail-item">
                <div class="detail-icon">📅</div>
                <div class="detail-content">
                  <div class="detail-label">Date</div>
                  <div class="detail-value">{{ formatDateShort(journeySetup.startDate) }}</div>
                </div>
              </div>
              
              <div class="config-detail-item">
                <div class="detail-icon">📦</div>
                <div class="detail-content">
                  <div class="detail-label">Product</div>
                  <div class="detail-value">{{ selectedProductName.split(' ')[0] }}</div>
                </div>
              </div>
              
              <div class="config-detail-item">
                <div class="detail-icon">💰</div>
                <div class="detail-content">
                  <div class="detail-label">Amount</div>
                  <div class="detail-value">₹{{ formatAmount(journeySetup.amount) }}</div>
                </div>
              </div>
              
              <div class="config-detail-item">
                <div class="detail-icon">📊</div>
                <div class="detail-content">
                  <div class="detail-label">Stocks</div>
                  <div class="detail-value">{{ journeySetup.numberOfStocks }}</div>
                </div>
              </div>

              <!-- Enhanced Dice Control with single animated dice -->
              <div class="config-dice-control">
                <div 
                  class="dice-icon-enhanced" 
                  :class="{ 'rolling': isRolling }"
                  @click="rollDiceFromJourney"
                  v-if="diceRolls.length < maxRolls"
                >
                  <div class="dice-cube-mini">
                    <div class="dice-face-mini front">
                      <div class="dots">
                        <div class="dot center"></div>
                      </div>
                    </div>
                    <div class="dice-face-mini back">
                      <div class="dots">
                        <div class="dot top-left"></div>
                        <div class="dot bottom-right"></div>
                      </div>
                    </div>
                    <div class="dice-face-mini right">
                      <div class="dots">
                        <div class="dot top-left"></div>
                        <div class="dot center"></div>
                        <div class="dot bottom-right"></div>
                      </div>
                    </div>
                    <div class="dice-face-mini left">
                      <div class="dots">
                        <div class="dot top-left"></div>
                        <div class="dot top-right"></div>
                        <div class="dot bottom-left"></div>
                        <div class="dot bottom-right"></div>
                      </div>
                    </div>
                    <div class="dice-face-mini top">
                      <div class="dots">
                        <div class="dot top-left"></div>
                        <div class="dot top-right"></div>
                        <div class="dot center"></div>
                        <div class="dot bottom-left"></div>
                        <div class="dot bottom-right"></div>
                      </div>
                    </div>
                    <div class="dice-face-mini bottom">
                      <div class="dots">
                        <div class="dot top-left"></div>
                        <div class="dot top-right"></div>
                        <div class="dot center-left"></div>
                        <div class="dot center-right"></div>
                        <div class="dot bottom-left"></div>
                        <div class="dot bottom-right"></div>
                      </div>
                    </div>
                  </div>
                  <div class="dice-sparkles">
                    <div v-for="n in 6" :key="n" class="sparkle-mini" :style="getSparkleStyle(n)">✨</div>
                  </div>
                </div>
                <div class="dice-results-mini">
                  <div class="roll-history-mini">
                    <span 
                      v-for="(result, index) in diceRolls" 
                      :key="index"
                      class="roll-item-mini"
                    >
                      {{ result }}
                    </span>
                  </div>
                  <div class="total-days-mini">{{ totalDays }}d</div>
                </div>
              </div>
            </div>
          </div>

          <!-- NIFTY Comparison Panel -->
          <div class="nifty-comparison-panel">
            <div class="comparison-header">
              <div class="comparison-icon">📊</div>
              <div class="comparison-title">INDEX COMPARISON</div>
            </div>
            
            <div class="comparison-stats">
              <div class="comparison-stat">
                <div class="stat-label">Portfolio NAV:</div>
                <div class="stat-value">{{ ((currentDay?.smartVestData?.PortfolioNav || 1) - 1).toFixed(4) }}</div>
              </div>
              <div class="comparison-stat">
                <div class="stat-label">Index NAV:</div>
                <div class="stat-value">{{ ((currentDay?.smartVestData?.IndexNav || 1) - 1).toFixed(4) }}</div>
              </div>
              <div class="comparison-stat highlight">
                <div class="stat-label">Your Portfolio:</div>
                <div :class="['stat-value', currentDay?.portfolio?.percentChange >= 0 ? 'positive' : 'negative']">
                  {{ currentDay?.portfolio?.percentChange >= 0 ? '+' : '' }}{{ (currentDay?.portfolio?.percentChange || 0).toFixed(1) }}%
                </div>
              </div>
              <div class="comparison-stat highlight">
                <div class="stat-label">Index Change:</div>
                <div class="stat-value neutral">{{ (currentDay?.portfolio?.niftyChange || 0).toFixed(1) }}%</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Pane: Performance Metrics Toolbar + Three Portfolio Tiles -->
        <div class="right-pane">
          <!-- Performance Toolbar -->
          <div class="performance-toolbar">
            <div class="performance-metric-card portfolio-metric">
              <div class="metric-icon">📈</div>
              <div class="metric-content">
                <div class="metric-label">Portfolio</div>
                <div :class="['metric-value', currentDay?.metrics?.portfolioIRR >= 0 ? 'positive' : 'negative']">
                  {{ (currentDay?.metrics?.portfolioIRR || 0).toFixed(1) }}%
                </div>
                <div class="metric-visual">
                  <div class="progress-bar">
                    <div 
                      class="progress-fill portfolio-fill" 
                      :style="{ width: Math.abs((currentDay?.metrics?.portfolioIRR || 0)) * 2 + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="performance-metric-card nifty-metric">
              <div class="metric-icon">📊</div>
              <div class="metric-content">
                <div class="metric-label">Index</div>
                <div class="metric-value neutral">{{ (currentDay?.metrics?.niftyIRR || 0).toFixed(1) }}%</div>
                <div class="metric-visual">
                  <div class="progress-bar">
                    <div 
                      class="progress-fill nifty-fill" 
                      :style="{ width: Math.abs((currentDay?.metrics?.niftyIRR || 0)) * 2 + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="performance-metric-card vs-metric">
              <div class="metric-icon">⚡</div>
              <div class="metric-content">
                <div class="metric-label">vs Index</div>
                <div :class="['metric-value', currentDayVersusNifty >= 0 ? 'positive' : 'negative']">
                  {{ currentDayVersusNifty >= 0 ? '+' : '' }}{{ currentDayVersusNifty.toFixed(1) }}%
                </div>
                <div class="metric-visual">
                  <div class="progress-bar">
                    <div 
                      :class="['progress-fill', currentDayVersusNifty >= 0 ? 'vs-positive-fill' : 'vs-negative-fill']" 
                      :style="{ width: Math.abs(currentDayVersusNifty) * 3 + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="performance-metric-card value-metric">
              <div class="metric-icon">💰</div>
              <div class="metric-content">
                <div class="metric-label">Portfolio Value</div>
                <div class="metric-value portfolio-text">₹{{ formatAmount(currentDay?.smartVestData?.PortfolioValue || currentDay?.portfolio?.totalValue || journeySetup.amount) }}</div>
                <div class="metric-subtext">
                  Day {{ currentDay?.day || 1 }} of {{ totalDays }}
                </div>
              </div>
            </div>

            <div class="performance-metric-card journey-progress">
              <div class="metric-content">
                <div class="metric-label">Journey Progress</div>
                <div class="progress-circle">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="#e3f2fd" stroke-width="1.5" fill="transparent"/>
                    <circle 
                      cx="12" cy="12" r="10" 
                      stroke="#1976d2" 
                      stroke-width="1.5" 
                      fill="transparent"
                      :stroke-dasharray="`${2 * Math.PI * 10}`"
                      :stroke-dashoffset="`${2 * Math.PI * 10 * (1 - (currentDay?.day || 1) / totalDays)}`"
                      transform="rotate(-90 12 12)"
                    />
                  </svg>
                  <div class="progress-text journey-progress-value">{{ Math.round(((currentDay?.day || 1) / totalDays) * 100) }}%</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Three Portfolio Tiles - Enhanced with better colors and backgrounds -->
          <div class="three-panel-layout-right">
            
            <!-- Start Portfolio -->
            <div class="portfolio-panel start-portfolio">
              <div class="portfolio-bg-pattern start-pattern"></div>
              <div class="panel-header">
                <h3 class="panel-title">START</h3>
                <div class="panel-date">{{ formatDateShort(journeySetup.startDate) }}</div>
              </div>
              
              <div class="panel-content">
                <div v-if="selectedStartingStocks.length > 0" class="stock-holdings">
                  <div 
                    v-for="(stock, index) in paginatedStartStocks" 
                    :key="stock.symbol"
                    class="stock-line"
                  >
                    <span class="stock-symbol">{{ stock.symbol }}</span>
                    <span class="stock-price">{{ stock.quantity || Math.floor(journeySetup.amount / (journeySetup.numberOfStocks * stock.price)) }}</span>
                    <span class="stock-value">₹{{ formatAmount(stock.price * (stock.quantity || Math.floor(journeySetup.amount / (journeySetup.numberOfStocks * stock.price)))) }}</span>
                  </div>
                </div>

                <div v-else class="no-data-message">
                  <div class="no-data-icon">📊</div>
                  <div class="no-data-text">Configure your portfolio first</div>
                </div>
                
                <div class="pagination-controls" v-if="selectedStartingStocks.length > 4">
                  <button 
                    class="page-btn" 
                    @click="prevStartPage" 
                    :disabled="startStockPage === 0"
                  >‹</button>
                  <span class="page-indicator">{{ startStockPage + 1 }}/{{ totalStartPages }}</span>
                  <button 
                    class="page-btn" 
                    @click="nextStartPage" 
                    :disabled="startStockPage >= totalStartPages - 1"
                  >›</button>
                </div>
                
                <div v-if="selectedStartingStocks.length > 0" class="total-line">
                  <span class="total-amount">₹{{ formatAmount(journeySetup.amount) }}</span>
                </div>
              </div>
            </div>

            <!-- Current Day Snapshot -->
            <div class="portfolio-panel current-snapshot">
              <div class="portfolio-bg-pattern current-pattern"></div>
              <div class="panel-header">
                <h3 class="panel-title">DAY {{ currentDay?.day || 1 }}</h3>
                <div class="panel-subtitle">{{ formatDateShort(currentDay?.date) }}</div>
              </div>
              
              <div class="panel-content">
                <div v-if="currentDay?.portfolio?.holdings?.length > 0" class="current-holdings-list">
                  <div 
                    v-for="(holding, index) in paginatedCurrentHoldings" 
                    :key="holding.symbol"
                    class="holding-line-compact"
                  >
                    <span class="holding-symbol-compact">{{ holding.symbol }}</span>
                    <span class="holding-quantity-compact">{{ holding.quantity }}</span>
                    <span class="holding-value-compact">₹{{ formatAmount(holding.value) }}</span>
                  </div>
                </div>

                <div v-else class="no-data-message">
                  <div class="no-data-icon">📈</div>
                  <div class="no-data-text">No portfolio data available</div>
                </div>
                
                <div class="pagination-controls" v-if="(currentDay?.portfolio?.holdings || []).length > 3">
                  <button 
                    class="page-btn" 
                    @click="prevCurrentPage" 
                    :disabled="currentStockPage === 0"
                  >‹</button>
                  <span class="page-indicator">{{ currentStockPage + 1 }}/{{ Math.ceil((currentDay?.portfolio?.holdings || []).length / 3) }}</span>
                  <button 
                    class="page-btn" 
                    @click="nextCurrentPage" 
                    :disabled="currentStockPage >= Math.ceil((currentDay?.portfolio?.holdings || []).length / 3) - 1"
                  >›</button>
                </div>
                
                <div v-if="currentDay?.portfolio" class="performance-indicator">
                  <span :class="['perf-text', currentDay?.portfolio?.percentChange >= 0 ? 'positive' : 'negative']">
                    {{ currentDay?.portfolio?.percentChange >= 0 ? '+' : '' }}{{ (currentDay?.portfolio?.percentChange || 0).toFixed(1) }}%
                  </span>
                </div>
              </div>
            </div>

            <!-- Final Portfolio -->
            <div class="portfolio-panel final-portfolio">
              <div class="portfolio-bg-pattern final-pattern"></div>
              <div class="panel-header">
                <h3 class="panel-title">FINAL</h3>
                <div class="panel-date">{{ formatDateShort(getFinalDate()) }}</div>
              </div>
              
              <div class="panel-content">
                <div v-if="showFinalResults && finalDay?.portfolio?.holdings?.length > 0" class="final-results">
                  <div class="final-holdings-list">
                    <div 
                      v-for="(holding, index) in paginatedFinalHoldings" 
                      :key="holding.symbol"
                      class="final-stock-line"
                    >
                      <span class="stock-symbol">{{ holding.symbol }}</span>
                      <span class="stock-quantity">{{ holding.quantity }}</span>
                      <span class="stock-value">₹{{ formatAmount(holding.value) }}</span>
                    </div>
                  </div>
                  
                  <div class="pagination-controls" v-if="(finalDay?.portfolio?.holdings || []).length > 4">
                    <button 
                      class="page-btn" 
                      @click="prevFinalPage" 
                      :disabled="finalStockPage === 0"
                    >‹</button>
                    <span class="page-indicator">{{ finalStockPage + 1 }}/{{ totalFinalPages }}</span>
                    <button 
                      class="page-btn" 
                      @click="nextFinalPage" 
                      :disabled="finalStockPage >= totalFinalPages - 1"
                    >›</button>
                  </div>
                  
                  <div class="final-total-line">
                    <span :class="['final-perf', finalPerformance >= 0 ? 'positive' : 'negative']">
                      {{ finalPerformance >= 0 ? '+' : '' }}{{ finalPerformance.toFixed(1) }}%
                    </span>
                  </div>
                </div>
                
                <div v-else class="journey-progress">
                  <div v-if="!showFinalResults" class="progress-text">In Progress...</div>
                  <div v-else class="no-data-message">
                    <div class="no-data-icon">🏆</div>
                    <div class="no-data-text">Journey completed</div>
                  </div>
                  <div v-if="!showFinalResults" class="progress-stats">
                    {{ Math.round(((currentDay?.day || 1) / totalDays) * 100) }}% Complete
                  </div>
                  <button v-if="!showFinalResults" class="end-journey-btn" @click="endJourney">
                    END JOURNEY
                  </button>
                </div>
              </div>
            </div>

          </div>

          <!-- Gaming-Style Timeline Navigation - Moved Below Tiles -->
          <div class="gaming-timeline-navigation">
            <div class="timeline-header">
              <div class="timeline-title">
                <span class="timeline-icon">🎮</span>
                <span class="timeline-text">INVESTMENT QUEST</span>
              </div>
              <div class="timeline-status">
                <span class="status-text">Day {{ currentDay?.day || 1 }} of {{ totalDays }}</span>
                <div class="status-bar">
                  <div 
                    class="status-fill" 
                    :style="{ width: ((currentDay?.day || 1) / totalDays) * 100 + '%' }"
                  ></div>
                </div>
              </div>
            </div>

            <div class="gaming-timeline-container">
              <!-- Left Navigation -->
              <button 
                class="timeline-nav-btn prev-btn" 
                @click="previousTimelineDay"
                :disabled="timelineStartIndex === 0"
              >
                <span class="nav-icon">◀</span>
              </button>

              <!-- Timeline Track -->
              <div class="timeline-track">
                <div class="track-background"></div>
                <div 
                  class="track-progress" 
                  :style="{ width: Math.min(((currentDay?.day || 1) / totalDays) * 100, 100) + '%' }"
                ></div>
                
                <!-- Day Nodes -->
                <div class="timeline-nodes">
                  <div 
                    v-for="(day, index) in visibleTimelineDays" 
                    :key="day.day"
                    :class="['timeline-node', getNodeClass(day)]"
                    @click="handleDayClick(day, $event)"
                    @mouseenter="showDayTooltip($event, day)"
                    @mouseleave="hideDayTooltip"
                    :style="{ left: (index * (100 / (visibleTimelineDays.length - 1))) + '%' }"
                  >
                    <div class="node-ring"></div>
                    <div class="node-core">
                      <span class="node-day">{{ formatTimelineDate(day.date) }}</span>
                    </div>
                    <div class="node-effects" v-if="day.day === currentDay?.day">
                      <div class="pulse-ring"></div>
                      <div class="energy-particles">
                        <div v-for="n in 6" :key="n" class="particle" :style="getParticleStyle(n)"></div>
                      </div>
                    </div>
                    
                    <!-- Event Indicators -->
                    <div v-if="day.events && day.events.length > 0" class="event-indicators">
                      <div 
                        v-for="(event, eventIndex) in day.events.slice(0, 3)" 
                        :key="eventIndex"
                        :class="['event-indicator', event.type.toLowerCase()]"
                      >
                        <div class="event-icon">
                          {{ event.type === 'BUY' ? '📈' : event.type === 'SELL' ? '📉' : '💰' }}
                        </div>
                        <div class="event-glow"></div>
                      </div>
                      <div v-if="day.events.length > 3" class="event-count-badge">
                        +{{ day.events.length - 3 }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Navigation -->
              <button 
                class="timeline-nav-btn next-btn" 
                @click="nextTimelineDay"
                :disabled="timelineStartIndex + 5 >= journeyDays.length"
              >
                <span class="nav-icon">▶</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Combined Setup + Dice Phase -->
      <div v-if="currentPhase !== 'journey'" class="combined-setup-phase">
        <div class="combined-header">
          <div class="setup-icon">🎮</div>
          <h1 class="setup-title">Start Your Investment Journey</h1>
          <div class="setup-subtitle">Configure your adventure and roll the dice</div>
        </div>

        <div class="combined-content">
          <!-- Integrated Setup and Dice Layout -->
          <div class="integrated-setup-layout">
            <!-- Top Section: Form Fields in Grid -->
            <div class="setup-form-grid">
              <div class="form-section">
                <div class="section-header">
                  <div class="section-icon">📅</div>
                  <h3>Journey Date</h3>
                </div>
                <div class="date-input-group">
                  <label>Start Date</label>
                  <input 
                    type="date" 
                    v-model="journeySetup.startDate" 
                    class="date-input"
                    :max="maxDate"
                  />
                  <div class="date-hint">Select any date before {{ formatDate(maxDate) }}</div>
                </div>
              </div>

              <div class="form-section">
                <div class="section-header">
                  <div class="section-icon">💰</div>
                  <h3>Investment Amount</h3>
                </div>
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

            <!-- Middle Section: Stocks and Products -->
            <div class="middle-section">
              <div class="form-section stocks-section">
                <div class="section-header">
                  <div class="section-icon">📊</div>
                  <h3>Number of Stocks</h3>
                </div>
                <div class="stocks-selector-compact">
                  <div class="stocks-slider">
                    <input 
                      type="range" 
                      v-model="journeySetup.numberOfStocks" 
                      min="5"
                      max="25"
                      class="slider"
                    />
                    <div class="slider-value">{{ journeySetup.numberOfStocks }}</div>
                  </div>
                  <div class="stocks-presets">
                    <button 
                      v-for="num in [5, 10, 15, 20, 25]" 
                      :key="num"
                      :class="['preset-btn', { active: journeySetup.numberOfStocks === num }]"
                      @click="journeySetup.numberOfStocks = num"
                    >
                      {{ num }}
                    </button>
                  </div>
                </div>
              </div>

              <div class="form-section products-section">
                <div class="section-header">
                  <div class="section-icon">📦</div>
                  <h3>Investment Product</h3>
                </div>
                <div class="product-selector-compact">
                  <div 
                    v-for="product in availableProducts" 
                    :key="product.id"
                    :class="['product-card-compact', { active: journeySetup.selectedProduct === product.id }]"
                    @click="selectProduct(product.id)"
                  >
                    <div class="product-icon-compact">{{ product.icon }}</div>
                    <div class="product-info">
                      <div class="product-name-compact">{{ product.name.split(' ')[0] }}</div>
                      <div class="risk-stars">
                        <span v-for="n in 5" :key="n" :class="['star', { filled: n <= product.risk }]">⭐</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Bottom Section: Enhanced Dice Area -->
            <div class="dice-gaming-section">
              <div class="dice-header-enhanced">
                <div class="dice-title-main">🎲 Roll for Journey Length</div>
                <div class="dice-subtitle">Determine your investment timeline</div>
                <div v-if="currentPhase === 'dice'" class="dice-progress-bar">
                  <div class="progress-label">Rolls: {{ diceRolls.length }} / {{ minRolls }}</div>
                  <div class="progress-track">
                    <div class="progress-fill-dice" :style="{ width: (diceRolls.length / minRolls) * 100 + '%' }"></div>
                  </div>
                </div>
              </div>

              <div class="dice-main-area">
                <!-- Left: Dice Arena -->
                <div class="dice-arena-enhanced">
                  <div class="dice-container-main" :class="{ rolling: isRolling }">
                    <div 
                      v-for="(dice, index) in activeDice" 
                      :key="index"
                      :class="['dice-cube-enhanced', { rolling: dice.isRolling }]"
                      :style="getDiceStyle(index)"
                    >
                      <div class="dice-face-enhanced front">
                        <div class="dots">
                          <div class="dot center"></div>
                        </div>
                      </div>
                      <div class="dice-face-enhanced back">
                        <div class="dots">
                          <div class="dot top-left"></div>
                          <div class="dot bottom-right"></div>
                        </div>
                      </div>
                      <div class="dice-face-enhanced right">
                        <div class="dots">
                          <div class="dot top-left"></div>
                          <div class="dot center"></div>
                          <div class="dot bottom-right"></div>
                        </div>
                      </div>
                      <div class="dice-face-enhanced left">
                        <div class="dots">
                          <div class="dot top-left"></div>
                          <div class="dot top-right"></div>
                          <div class="dot bottom-left"></div>
                          <div class="dot bottom-right"></div>
                        </div>
                      </div>
                      <div class="dice-face-enhanced top">
                        <div class="dots">
                          <div class="dot top-left"></div>
                          <div class="dot top-right"></div>
                          <div class="dot center"></div>
                          <div class="dot bottom-left"></div>
                          <div class="dot bottom-right"></div>
                        </div>
                      </div>
                      <div class="dice-face-enhanced bottom">
                        <div class="dots">
                          <div class="dot top-left"></div>
                          <div class="dot top-right"></div>
                          <div class="dot center-left"></div>
                          <div class="dot center-right"></div>
                          <div class="dot bottom-left"></div>
                          <div class="dot bottom-right"></div>
                        </div>
                      </div>
                    </div>
                    <div class="sparkle-effects-main" :class="{ active: isRolling }">
                      <div v-for="n in 12" :key="n" class="sparkle-main" :style="getSparkleStyle(n)">✨</div>
                    </div>
                  </div>

                  <div class="dice-roll-button">
                    <div 
                      v-if="!isSetupComplete"
                      class="setup-incomplete-message"
                    >
                      <span>Complete Setup First</span>
                    </div>

                    <button
                      v-else
                      class="roll-btn-enhanced"
                      @click="rollDice"
                      :disabled="isRolling || (diceRolls.length >= maxRolls)"
                      :class="{ 
                        rolling: isRolling 
                      }"
                    >
                      <span class="roll-icon-main">🎲</span>
                      <span class="roll-text-main">
                        {{ isRolling ? 'ROLLING...' : 'ROLL DICE' }}
                      </span>
                    </button>
                  </div>
                </div>

                <!-- Right: Results & Stats -->
                <div class="dice-results-area">
                  <div v-if="diceRolls.length > 0" class="results-display-enhanced">
                    <div class="results-header">
                      <h4>🎯 Roll Results</h4>
                    </div>
                    <div class="results-grid-enhanced">
                      <div 
                        v-for="(result, index) in diceRolls" 
                        :key="index"
                        class="result-item-enhanced"
                      >
                        <div class="result-number">{{ result }}</div>
                        <div class="result-label">Roll {{ index + 1 }}</div>
                      </div>
                    </div>
                    <div class="total-summary">
                      <div class="total-label">Total Journey Days:</div>
                      <div class="total-value-enhanced">{{ totalDays }}</div>
                    </div>
                  </div>

                  <div v-else class="dice-instructions">
                    <div class="instruction-icon">🎮</div>
                    <h4>Ready to Start?</h4>
                    <p>Complete the setup form and roll the dice to determine your investment journey length!</p>
                    <div class="dice-info">
                      <div class="info-item">
                        <span class="info-icon">🎲</span>
                        <span>Each roll: 1-6 days</span>
                      </div>
                      <div class="info-item">
                        <span class="info-icon">📅</span>
                        <span>Base journey: 5 days</span>
                      </div>
                      <div class="info-item">
                        <span class="info-icon">🎯</span>
                        <span>Maximum: {{ maxRolls }} rolls</span>
                      </div>
                    </div>
                  </div>

                  <!-- Journey Preview -->
                  <div v-if="isSetupComplete" class="journey-preview">
                    <div class="preview-header">
                      <h4>📊 Journey Preview</h4>
                    </div>
                    <div class="preview-stats">
                      <div class="preview-item">
                        <span class="preview-icon">📅</span>
                        <div class="preview-content">
                          <div class="preview-label">Start Date</div>
                          <div class="preview-value">{{ formatDateShort(journeySetup.startDate) }}</div>
                        </div>
                      </div>
                      <div class="preview-item">
                        <span class="preview-icon">💰</span>
                        <div class="preview-content">
                          <div class="preview-label">Investment</div>
                          <div class="preview-value">₹{{ formatAmount(journeySetup.amount) }}</div>
                        </div>
                      </div>
                      <div class="preview-item">
                        <span class="preview-icon">📊</span>
                        <div class="preview-content">
                          <div class="preview-label">Stocks</div>
                          <div class="preview-value">{{ journeySetup.numberOfStocks }}</div>
                        </div>
                      </div>
                      <div class="preview-item">
                        <span class="preview-icon">📦</span>
                        <div class="preview-content">
                          <div class="preview-label">Strategy</div>
                          <div class="preview-value">{{ selectedProductName.split(' ')[0] }}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Error Display -->
                  <div v-if="journeyError" class="error-display">
                    <div class="error-header">
                      <span class="error-icon">⚠️</span>
                      <h4>Error Loading Journey</h4>
                    </div>
                    <div class="error-message">{{ journeyError }}</div>
                    <button class="retry-btn" @click="retryJourney">
                      <span class="btn-icon">🔄</span>
                      <span class="btn-text">Retry</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Journey Phase -->
      <div v-if="currentPhase === 'journey'" class="journey-phase">
        <div class="journey-content">
          
          <!-- Main Content Panel -->
          <div class="main-content-panel">

            <!-- Day Events Section -->
            <div v-if="currentPhase === 'journey'" class="day-events-section">
              <div class="day-events-header">
                <div class="events-icon">📊</div>
                <h3 class="events-title">DAY EVENTS</h3>
                <div class="current-day-info">Day {{ currentDay?.day || 1 }}: {{ formatDateShort(currentDay?.date) }}</div>
              </div>

              <div class="events-container">
                <div v-if="currentDayEvents.length > 0" class="events-list">
                  <div 
                    v-for="(event, index) in currentDayEvents" 
                    :key="index"
                    :class="['event-card', event.type.toLowerCase()]"
                  >
                    <div class="event-icon-badge">
                      <span v-if="event.type === 'BUY'" class="event-icon">📈</span>
                      <span v-else-if="event.type === 'SELL'" class="event-icon">📉</span>
                      <span v-else class="event-icon">💰</span>
                    </div>
                    
                    <div class="event-details">
                      <div class="event-header">
                        <span class="event-type">{{ event.type }} TRANSACTION</span>
                        <span v-if="event.stock" class="event-stock">{{ event.stock }}</span>
                      </div>
                      
                      <div class="event-info">
                        <span v-if="event.quantity" class="event-quantity">Quantity: {{ event.quantity }}</span>
                        <span v-if="event.price" class="event-price">₹{{ event.price }}</span>
                        <span v-if="event.amount" class="event-amount">₹{{ event.amount }}</span>
                      </div>
                    </div>

                    <div v-if="event.type === 'BUY'" class="event-total buy-total">
                      Total: ₹{{ formatAmount(event.quantity * event.price) }}
                    </div>
                    <div v-else-if="event.type === 'SELL'" class="event-total sell-total">
                      Total: ₹{{ formatAmount(event.quantity * event.price) }}
                    </div>
                    <div v-else-if="event.type === 'DIVIDEND'" class="event-total dividend-total">
                      Dividend: ₹{{ event.amount }}
                    </div>
                  </div>
                </div>

                <div v-else class="no-events-message">
                  <div class="no-events-icon">📭</div>
                  <div class="no-events-text">No trading activity today</div>
                  <div class="no-events-subtext">Market movements only</div>
                </div>
              </div>
            </div>

            <!-- Enhanced Performance Chart Section -->
            <div class="performance-chart-section">
              <div class="chart-header">
                <h3 class="chart-title">📊 PERFORMANCE ANALYTICS</h3>
                <div class="chart-legend">
                  <div class="legend-item portfolio">
                    <div class="legend-dot portfolio-dot"></div>
                    <span class="legend-text">Portfolio</span>
                  </div>
                  <div class="legend-item nifty">
                    <div class="legend-dot nifty-dot"></div>
                    <span class="legend-text">Index</span>
                  </div>
                </div>
              </div>
              
              <!-- Performance Metrics Grid -->
              <div class="performance-metrics-grid">
                <div class="metric-card returns">
                  <div class="metric-icon">📈</div>
                  <div class="metric-info">
                    <div class="metric-label">Total Returns</div>
                    <div :class="['metric-value', currentDay?.portfolio?.percentChange >= 0 ? 'positive' : 'negative']">
                      {{ currentDay?.portfolio?.percentChange >= 0 ? '+' : '' }}{{ (currentDay?.portfolio?.percentChange || 0).toFixed(1) }}%
                    </div>
                  </div>
                  <div class="metric-trend">
                    <div :class="['trend-arrow', currentDay?.portfolio?.percentChange >= 0 ? 'up' : 'down']">
                      {{ currentDay?.portfolio?.percentChange >= 0 ? '↗' : '↘' }}
                    </div>
                  </div>
                </div>

                <div class="metric-card outperformance">
                  <div class="metric-icon">⚡</div>
                  <div class="metric-info">
                    <div class="metric-label">vs Index</div>
                    <div :class="['metric-value', currentDayVersusNifty >= 0 ? 'positive' : 'negative']">
                      {{ currentDayVersusNifty >= 0 ? '+' : '' }}{{ currentDayVersusNifty.toFixed(1) }}%
                    </div>
                  </div>
                  <div class="metric-trend">
                    <div :class="['trend-arrow', currentDayVersusNifty >= 0 ? 'up' : 'down']">
                      {{ currentDayVersusNifty >= 0 ? '↗' : '↘' }}
                    </div>
                  </div>
                </div>

                <div class="metric-card value">
                  <div class="metric-icon">💎</div>
                  <div class="metric-info">
                    <div class="metric-label">Current Value</div>
                    <div class="metric-value portfolio-color">₹{{ formatAmount(currentDay?.smartVestData?.PortfolioValue || currentDay?.portfolio?.totalValue || journeySetup.amount) }}</div>
                  </div>
                  <div class="metric-visual">
                    <div class="progress-ring">
                      <svg viewBox="0 0 40 40">
                        <circle 
                          cx="20" cy="20" r="18" 
                          stroke="#e3f2fd" 
                          stroke-width="2" 
                          fill="transparent"
                        />
                        <circle 
                          cx="20" cy="20" r="18" 
                          stroke="url(#progressGradient)" 
                          stroke-width="2" 
                          fill="transparent"
                          :stroke-dasharray="`${2 * Math.PI * 18}`"
                          :stroke-dashoffset="`${2 * Math.PI * 18 * (1 - Math.min((currentDay?.day || 1) / totalDays, 1))}`"
                          transform="rotate(-90 20 20)"
                          stroke-linecap="round"
                        />
                        <defs>
                          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style="stop-color:#4CAF50;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#2196F3;stop-opacity:1" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Enhanced Chart Container -->
              <div class="enhanced-chart-container">
                <div class="chart-background">
                  <div class="grid-lines">
                    <div v-for="i in 5" :key="i" class="grid-line horizontal" :style="{ top: (i * 20) + '%' }"></div>
                    <div v-for="i in 10" :key="i" class="grid-line vertical" :style="{ left: (i * 10) + '%' }"></div>
                  </div>
                </div>
                
                <canvas ref="performanceChart" class="performance-canvas"></canvas>
                
                <div class="chart-overlay">
                  <div class="data-points">
                    <div class="data-point portfolio-point">
                      <div class="point-indicator"></div>
                      <div class="point-value">{{ (currentDay?.portfolio?.percentChange || 0).toFixed(1) }}%</div>
                    </div>
                    <div class="data-point nifty-point">
                      <div class="point-indicator"></div>
                      <div class="point-value">{{ (currentDay?.portfolio?.niftyChange || 0).toFixed(1) }}%</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Chart Statistics -->
              <div class="chart-statistics">
                <div class="stat-item">
                  <span class="stat-icon">📊</span>
                  <span class="stat-text">Day {{ currentDay?.day || 1 }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-icon">⏱️</span>
                  <span class="stat-text">{{ Math.round(((currentDay?.day || 1) / totalDays) * 100) }}% Complete</span>
                </div>
                <div class="stat-item">
                  <span class="stat-icon">🎯</span>
                  <span class="stat-text">{{ journeySetup.numberOfStocks }} Stocks</span>
                </div>
              </div>
            </div>

            <!-- Journey Actions with End Journey Button -->
            <div class="journey-actions-wrapper">
              <div class="journey-actions">
                <button class="action-btn primary" @click="startNewJourney">
                  <span class="btn-icon">🔄</span>
                  <span class="btn-text">NEW JOURNEY</span>
                </button>
                <button class="action-btn secondary" @click="exitJourney">
                  <span class="btn-icon">🏠</span>
                  <span class="btn-text">EXIT GAME</span>
                </button>
              </div>
              
              <!-- End Journey Button - Bottom Right -->
              <div class="end-journey-wrapper">
                <button v-if="!showFinalResults" class="end-journey-btn-corner" @click="endJourney">
                  <span class="btn-icon">🏁</span>
                  <span class="btn-text">END JOURNEY</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>

    <!-- Enhanced Compact Day Tooltip -->
    <div 
      v-if="dayTooltip.visible" 
      class="day-tooltip"
      :style="{ 
        left: dayTooltip.x + 'px', 
        top: dayTooltip.y + 'px',
        width: dayTooltip.width + 'px',
        maxHeight: dayTooltip.height + 'px'
      }"
    >
      <div class="tooltip-header">
        <div class="tooltip-day">Day {{ dayTooltip.day?.day }}</div>
        <div class="tooltip-date">{{ formatDateShort(dayTooltip.day?.date) }}</div>
        <button v-if="dayTooltip.isPinned" class="tooltip-close-btn" @click="closeDayTooltip">
          <span class="close-icon">✕</span>
        </button>
      </div>
      
      <div class="tooltip-content">
        <!-- Portfolio Summary -->
        <div class="tooltip-section-compact">
          <div class="section-title-compact">📈 Portfolio</div>
          <div class="stats-grid-compact">
            <div class="stat-compact">
              <span class="stat-label-compact">Portfolio Value</span>
              <span class="stat-value-compact">₹{{ formatAmount(dayTooltip.day?.smartVestData?.PortfolioValue || dayTooltip.day?.portfolio?.totalValue || 0) }}</span>
            </div>
            <div class="stat-compact">
              <span class="stat-label-compact">Index Value</span>
              <span class="stat-value-compact">{{ dayTooltip.day?.smartVestData?.IndexValue || dayTooltip.day?.portfolio?.indexValue || 'N/A' }}</span>
            </div>
            <div class="stat-compact">
              <span class="stat-label-compact">Portfolio NAV</span>
              <span :class="['stat-value-compact', (dayTooltip.day?.smartVestData?.PortfolioNav || 1) >= 1 ? 'positive' : 'negative']">
                {{ ((dayTooltip.day?.smartVestData?.PortfolioNav || 1) - 1).toFixed(4) }}
              </span>
            </div>
            <div class="stat-compact">
              <span class="stat-label-compact">Index NAV</span>
              <span class="stat-value-compact neutral">{{ ((dayTooltip.day?.smartVestData?.IndexNav || 1) - 1).toFixed(4) }}</span>
            </div>
            <div class="stat-compact">
              <span class="stat-label-compact">Change</span>
              <span :class="['stat-value-compact', dayTooltip.day?.portfolio?.percentChange >= 0 ? 'positive' : 'negative']">
                {{ dayTooltip.day?.portfolio?.percentChange >= 0 ? '+' : '' }}{{ (dayTooltip.day?.portfolio?.percentChange || 0).toFixed(1) }}%
              </span>
            </div>
            <div class="stat-compact">
              <span class="stat-label-compact">Cash</span>
              <span class="stat-value-compact">₹{{ formatAmount(dayTooltip.day?.portfolio?.cash || 0) }}</span>
            </div>
          </div>
        </div>

        <!-- Holdings List -->
        <div v-if="dayTooltip.day?.portfolio?.holdings?.length > 0" class="tooltip-holdings-compact">
          <div class="section-title-compact">💼 Holdings ({{ dayTooltip.day.portfolio.holdings.length }})</div>
          <div class="holdings-list-compact">
            <div 
              v-for="(holding, index) in dayTooltip.day.portfolio.holdings" 
              :key="holding.symbol"
              class="holding-row-compact"
            >
              <span class="holding-symbol-tooltip">{{ holding.symbol }}</span>
              <span class="holding-qty-tooltip">{{ holding.quantity }}</span>
              <span class="holding-value-tooltip">₹{{ formatAmount(holding.value) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Trading Activity (if any) -->
        <div v-if="dayTooltip.day?.events?.length > 0" class="tooltip-trades-compact">
          <div class="section-title-compact">💱 Day Events ({{ dayTooltip.day.events.length }})</div>
          <div class="trades-list-compact">
            <div 
              v-for="(event, index) in dayTooltip.day.events.slice(0, 4)" 
              :key="index"
              :class="['trade-row-compact', event.type.toLowerCase()]"
            >
              <span class="trade-icon-compact">{{ event.type === 'BUY' ? '📈' : event.type === 'SELL' ? '📉' : '💰' }}</span>
              <span class="trade-details-compact">
                {{ event.type }} {{ event.stock || event.type === 'DIVIDEND' ? event.stock || 'DIV' : 'N/A' }}
              </span>
              <span class="trade-qty-compact">
                {{ event.quantity || (event.amount ? '₹' + formatAmount(parseFloat(event.amount)) : '') }}
              </span>
            </div>
            <div v-if="dayTooltip.day.events.length > 4" class="more-events-indicator">
              +{{ dayTooltip.day.events.length - 4 }} more events
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';

// API Configuration
const API_BASE_URL = '/api/mobile';
const API_ENDPOINTS = {
  SMARTVEST_DATA: '/Getsmartvestdata'
};

// Phase management
const currentPhase = ref('setup'); // 'setup', 'dice', 'journey'

// Chart reference
const performanceChart = ref(null);
let chartInstance = null;

// Timeline state
const timelineStartIndex = ref(0);

// Pagination state for stocks
const startStockPage = ref(0);
const currentStockPage = ref(0);
const finalStockPage = ref(0);

// Day tooltip state
const dayTooltip = ref({
  visible: false,
  x: 0,
  y: 0,
  day: null,
  isPinned: false,
  width: 240,
  height: 300
});

// Setup form data
const journeySetup = ref({
  startDate: '',
  selectedProduct: 'BG', // Default to Bio Growth
  amount: 100000,
  numberOfStocks: 10
});

// Calculate max date (5 days before today)
const maxDate = computed(() => {
  const date = new Date();
  date.setDate(date.getDate() - 5);
  return date.toISOString().split('T')[0];
});

// Available products matching API requirements
const availableProducts = ref([
  {
    id: 'BG',
    name: 'Bio Growth',
    description: 'Biotechnology focused growth portfolio',
    icon: '🧬',
    risk: 4
  },
  {
    id: 'LG',
    name: 'LargeCap Growth',
    description: 'Large cap growth focused portfolio',
    icon: '📈',
    risk: 3
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
const minRolls = ref(1);
const maxRolls = ref(5);

// Journey data
const journeyDays = ref([]);
const currentDayIndex = ref(0);
const isJourneyDataLoading = ref(false);
const journeyError = ref(null);
const showFinalResults = ref(false);
const autoProgressEnabled = ref(true);
const progressInterval = ref(null);

// API Functions
const fetchSmartVestData = async (payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SMARTVEST_DATA}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.code !== "200") {
      throw new Error(result.message || 'API request failed');
    }

    return result.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

const mapApiDataToJourney = (apiData) => {
  const { DailyPortfolioDetails, SmartVestGraphData } = apiData;
  
  return DailyPortfolioDetails.map((dayData, index) => {
    const date = new Date(dayData.TransactionDate);
    const graphData = SmartVestGraphData[index];
    
    // Map holdings
    const holdings = dayData.Holdings.map(holding => ({
      symbol: holding.Symbol || 'N/A',
      quantity: holding.Quantity,
      currentPrice: holding.CurrentPrice,
      avgPrice: holding.BuyPrice,
      value: holding.Quantity * holding.CurrentPrice
    }));

    // Map transactions to events
    const events = (dayData.Transactions || []).map(transaction => ({
      type: transaction.OrderType.toUpperCase(),
      stock: transaction.Symbol,
      quantity: transaction.Quantity,
      price: transaction.Price.toFixed(2),
      amount: (transaction.Quantity * transaction.Price).toFixed(2)
    }));

    // Calculate portfolio metrics
    const portfolioValue = dayData.PortfolioValue;
    const indexValue = graphData ? graphData.IndexValue : dayData.IndexPrice;
    const portfolioNav = graphData ? graphData.PortfolioNav : 1;
    const indexNav = graphData ? graphData.IndexNav : 1;
    
    // Calculate percentage changes based on NAV
    const portfolioPercentChange = ((portfolioNav - 1) * 100);
    const indexPercentChange = ((indexNav - 1) * 100);

    return {
      date: date.toISOString().split('T')[0],
      day: index + 1,
      events: events,
      portfolio: {
        cash: dayData.Cash,
        totalValue: portfolioValue,
        invested: portfolioValue - dayData.Cash,
        pnl: dayData.CapitalGains,
        percentChange: portfolioPercentChange,
        niftyChange: indexPercentChange,
        indexValue: indexValue,
        holdings: holdings.sort((a, b) => b.value - a.value)
      },
      metrics: {
        portfolioIRR: portfolioPercentChange * (365 / (index + 1)),
        niftyIRR: indexPercentChange * (365 / (index + 1)),
        dividends: dayData.DividendReceived,
        capitalGains: dayData.CapitalGains,
        sharpeRatio: portfolioPercentChange / Math.max(0.1, Math.sqrt(index + 1))
      },
      smartVestData: graphData
    };
  });
};

// Computed properties
const isSetupComplete = computed(() => {
  const complete = journeySetup.value.startDate && 
         journeySetup.value.selectedProduct && 
         journeySetup.value.amount >= 10000 &&
         journeySetup.value.numberOfStocks >= 5;
  
  if (complete && currentPhase.value === 'setup') {
    currentPhase.value = 'dice';
  }
  
  return complete;
});

const totalDays = computed(() => {
  return diceRolls.value.reduce((sum, roll) => sum + roll, 0) + 5;
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

const currentDayVersusNifty = computed(() => {
  const dayData = currentDay.value;
  if (dayData?.smartVestData) {
    // Use NAV data if available
    const portfolioReturn = (dayData.smartVestData.PortfolioNav - 1) * 100;
    const indexReturn = (dayData.smartVestData.IndexNav - 1) * 100;
    return portfolioReturn - indexReturn;
  }
  // Fallback to existing calculation
  return dayData?.portfolio?.percentChange - dayData?.portfolio?.niftyChange || 0;
});

const finalDay = computed(() => {
  return journeyDays.value[journeyDays.value.length - 1];
});

const finalTotal = computed(() => {
  return finalDay.value?.smartVestData?.PortfolioValue || finalDay.value?.portfolio?.totalValue || journeySetup.value.amount;
});

const finalPerformance = computed(() => {
  return ((finalTotal.value - journeySetup.value.amount) / journeySetup.value.amount) * 100;
});

const selectedStartingStocks = computed(() => {
  // Get holdings from first day if available
  if (journeyDays.value.length > 0 && journeyDays.value[0].portfolio?.holdings) {
    return journeyDays.value[0].portfolio.holdings.map(holding => ({
      symbol: holding.symbol,
      price: holding.avgPrice || holding.currentPrice,
      quantity: holding.quantity
    }));
  }
  return [];
});

const visibleTimelineDays = computed(() => {
  if (!journeyDays.value.length) return [];
  return journeyDays.value.slice(timelineStartIndex.value, timelineStartIndex.value + 5);
});

const visibleChartDays = computed(() => {
  const totalDays = journeyDays.value.length;
  const step = Math.max(1, Math.floor(totalDays / 5));
  return Array.from({length: 6}, (_, i) => Math.min(i * step + 1, totalDays));
});

// Pagination computed properties
const totalStartPages = computed(() => Math.ceil(selectedStartingStocks.value.length / 4));
const totalCurrentPages = computed(() => Math.ceil((currentDay.value?.portfolio?.holdings || []).length / 3));
const totalFinalPages = computed(() => Math.ceil((finalDay.value?.portfolio?.holdings || []).length / 4));

const paginatedStartStocks = computed(() => {
  const start = startStockPage.value * 4;
  return selectedStartingStocks.value.slice(start, start + 4);
});

const paginatedCurrentHoldings = computed(() => {
  const holdings = currentDay.value?.portfolio?.holdings || [];
  const start = currentStockPage.value * 3;
  return holdings.slice(start, start + 3);
});

const paginatedFinalHoldings = computed(() => {
  const holdings = finalDay.value?.portfolio?.holdings || [];
  const start = finalStockPage.value * 4;
  return holdings.slice(start, start + 4);
});

// Methods
const getShapeStyle = (index) => {
  const size = 10 + Math.random() * 15;
  const duration = 10 + Math.random() * 6;
  const delay = Math.random() * 2;
  
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
  const angle = (360 / 8) * index;
  const radius = 40 + Math.random() * 20;
  const delay = Math.random() * 1;
  
  return {
    transform: `rotate(${angle}deg) translateX(${radius}px)`,
    animationDelay: delay + 's'
  };
};

const formatAmount = (amount) => {
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1) + 'M';
  } else if (amount >= 1000) {
    return (amount / 1000).toFixed(0) + 'K';
  }
  return amount.toString();
};

const formatCurrency = (value) => {
  return Math.abs(value).toLocaleString('en-IN');
};

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const formatDateShort = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short'
  });
};

const formatDayShort = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-GB', {
    month: 'short',
    day: 'numeric'
  });
};

const formatTimelineDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short'
  });
};

const getFinalDate = () => {
  if (!journeySetup.value.startDate) return new Date().toISOString().split('T')[0];
  const startDate = new Date(journeySetup.value.startDate);
  startDate.setDate(startDate.getDate() + totalDays.value - 1);
  return startDate.toISOString().split('T')[0];
};

const selectProduct = (productId) => {
  journeySetup.value.selectedProduct = productId;
};

const selectAmount = (amount) => {
  journeySetup.value.amount = amount;
};

const getDiceStyle = (index) => {
  const offset = index * 40 - 20;
  return {
    transform: `translateX(${offset}px)`,
    animationDelay: index * 0.1 + 's'
  };
};

const showDayTooltip = (event, day) => {
  console.log('Hovering over day:', day.day, 'isPinned:', dayTooltip.value.isPinned);
  
  if (dayTooltip.value.isPinned) return; // Don't show hover tooltip if one is pinned
  
  const rect = event.currentTarget.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Compact tooltip size
  const tooltipWidth = Math.min(240, viewportWidth * 0.85);
  const tooltipHeight = Math.min(300, viewportHeight * 0.7);
  
  let x = rect.left + rect.width / 2 - tooltipWidth / 2;
  let y = rect.top - tooltipHeight - 15;
  
  // Ensure tooltip stays within viewport horizontally
  if (x < 10) {
    x = 10;
  } else if (x + tooltipWidth > viewportWidth - 10) {
    x = viewportWidth - tooltipWidth - 10;
  }
  
  // Ensure tooltip stays within viewport vertically
  if (y < 10) {
    y = rect.bottom + 15; // Show below if not enough space above
    if (y + tooltipHeight > viewportHeight - 10) {
      y = Math.max(10, viewportHeight - tooltipHeight - 10); // Fit within viewport
    }
  }
  
  console.log('Setting tooltip position:', { x, y, width: tooltipWidth, height: tooltipHeight });
  
  dayTooltip.value = {
    visible: true,
    x: x,
    y: y,
    day: day,
    isPinned: false,
    width: tooltipWidth,
    height: tooltipHeight
  };
};

const hideDayTooltip = () => {
  console.log('Hiding tooltip, isPinned:', dayTooltip.value.isPinned);
  if (!dayTooltip.value.isPinned) {
    dayTooltip.value.visible = false;
  }
};

const handleDayClick = (day, event) => {
  // Navigate to the day
  goToDay(day.day - 1);
  
  // Pin the tooltip with responsive sizing
  const rect = event.currentTarget.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Mobile optimization - show at bottom center
  if (viewportWidth <= 768) {
    dayTooltip.value = {
      visible: true,
      x: viewportWidth / 2 - 120, // Center horizontally
      y: viewportHeight - 260, // Fixed position from bottom
      day: day,
      isPinned: true,
      width: 240,
      height: 250
    };
    return;
  }
  
  const tooltipWidth = Math.min(240, viewportWidth * 0.85);
  const tooltipHeight = Math.min(300, viewportHeight * 0.7);
  
  let x = rect.left + rect.width / 2 - tooltipWidth / 2;
  let y = rect.top - tooltipHeight - 15;
  
  // Ensure tooltip stays within viewport horizontally
  if (x < 10) {
    x = 10;
  } else if (x + tooltipWidth > viewportWidth - 10) {
    x = viewportWidth - tooltipWidth - 10;
  }
  
  // Ensure tooltip stays within viewport vertically
  if (y < 10) {
    y = rect.bottom + 15; // Show below if not enough space above
    if (y + tooltipHeight > viewportHeight - 10) {
      y = Math.max(10, viewportHeight - tooltipHeight - 10); // Fit within viewport
    }
  }
  
  dayTooltip.value = {
    visible: true,
    x: x,
    y: y,
    day: day,
    isPinned: true,
    width: tooltipWidth,
    height: tooltipHeight
  };
};

const closeDayTooltip = () => {
  dayTooltip.value.visible = false;
  dayTooltip.value.isPinned = false;
};

const previousTimelineDay = () => {
  if (timelineStartIndex.value > 0) {
    timelineStartIndex.value = Math.max(0, timelineStartIndex.value - 5);
  }
};

const nextTimelineDay = () => {
  if (timelineStartIndex.value + 5 < journeyDays.value.length) {
    timelineStartIndex.value = Math.min(journeyDays.value.length - 5, timelineStartIndex.value + 5);
  }
};

// Pagination methods
const prevStartPage = () => {
  if (startStockPage.value > 0) {
    startStockPage.value--;
  }
};

const nextStartPage = () => {
  if (startStockPage.value < totalStartPages.value - 1) {
    startStockPage.value++;
  }
};

const prevCurrentPage = () => {
  if (currentStockPage.value > 0) {
    currentStockPage.value--;
  }
};

const nextCurrentPage = () => {
  const totalPages = Math.ceil((currentDay.value?.portfolio?.holdings || []).length / 3);
  if (currentStockPage.value < totalPages - 1) {
    currentStockPage.value++;
  }
};

const prevFinalPage = () => {
  if (finalStockPage.value > 0) {
    finalStockPage.value--;
  }
};

const nextFinalPage = () => {
  if (finalStockPage.value < totalFinalPages.value - 1) {
    finalStockPage.value++;
  }
};

// Gaming timeline methods
const getNodeClass = (day) => {
  const current = currentDay.value?.day || 1;
  if (day.day === current) return 'active';
  if (day.day < current) return 'completed';
  if (day.day > current) return 'future';
  return '';
};

const getParticleStyle = (index) => {
  const angle = (360 / 6) * index;
  const radius = 30 + Math.random() * 10;
  
  return {
    transform: `rotate(${angle}deg) translateX(${radius}px)`,
    animationDelay: (index * 0.2) + 's'
  };
};

const rollDice = async () => {
  if (isRolling.value || diceRolls.value.length >= maxRolls.value) return;
  
  isRolling.value = true;
  
  // Set all dice to rolling state immediately
  activeDice.value.forEach(dice => {
    dice.isRolling = true;
  });
  
  // Show random values quickly while rolling
  const rollInterval = setInterval(() => {
    activeDice.value.forEach(dice => {
      dice.value = Math.floor(Math.random() * 6) + 1;
    });
  }, 150); // Slower interval to see the rolling
  
  setTimeout(() => {
    clearInterval(rollInterval);
    
    const finalValues = activeDice.value.map(() => Math.floor(Math.random() * 6) + 1);
    const total = finalValues.reduce((sum, val) => sum + val, 0);
    
    activeDice.value.forEach((dice, index) => {
      dice.value = finalValues[index];
      dice.isRolling = false; // Stop rolling animation
    });
    
    diceRolls.value.push(total);
    isRolling.value = false;
    
    if (diceRolls.value.length === 1) {
      startInvestmentJourney();
    }
  }, 2000); // Longer rolling duration to see the effect
};

const rollDiceFromJourney = async () => {
  if (isRolling.value || diceRolls.value.length >= maxRolls.value) return;
  
  isRolling.value = true;
  
  // Stop current auto-progression
  stopAutoProgression();
  
  // Set all dice to rolling state immediately
  activeDice.value.forEach(dice => {
    dice.isRolling = true;
  });
  
  // Show random values quickly while rolling
  const rollInterval = setInterval(() => {
    activeDice.value.forEach(dice => {
      dice.value = Math.floor(Math.random() * 6) + 1;
    });
  }, 150);
  
  setTimeout(async () => {
    clearInterval(rollInterval);
    
    const finalValues = activeDice.value.map(() => Math.floor(Math.random() * 6) + 1);
    const total = finalValues.reduce((sum, val) => sum + val, 0);
    
    activeDice.value.forEach((dice, index) => {
      dice.value = finalValues[index];
      dice.isRolling = false;
    });
    
    diceRolls.value.push(total);
    isRolling.value = false;
    
    // Store current progress
    const currentProgress = currentDayIndex.value;
    
    try {
      // Regenerate journey data with extended days
      await generateJourneyData();
      
      // Restore current progress or continue from where we left off
      currentDayIndex.value = Math.min(currentProgress, journeyDays.value.length - 1);
      
      nextTick(() => {
        initializeChart();
        
        // Restart auto-progression if it was enabled
        if (autoProgressEnabled.value && currentDayIndex.value < journeyDays.value.length - 1) {
          setTimeout(() => {
            startAutoProgression();
          }, 1000);
        }
      });
    } catch (error) {
      console.error('Error extending journey:', error);
      alert('Failed to extend journey. Please try again.');
    }
  }, 2000);
};

const startInvestmentJourney = async () => {
  isJourneyDataLoading.value = true;
  journeyError.value = null;
  
  try {
    await generateJourneyData();
    
    if (journeyDays.value.length === 0) {
      throw new Error('No data received from API');
    }
    
    // Find first day with actual holdings
    const firstDayWithHoldings = journeyDays.value.findIndex(day => 
      day.portfolio?.holdings && day.portfolio.holdings.length > 0
    );
    currentDayIndex.value = Math.max(0, firstDayWithHoldings);
    
    currentPhase.value = 'journey';
    
    nextTick(() => {
      setTimeout(() => {
        initializeChart();
        isJourneyDataLoading.value = false;
        startAutoProgression();
      }, 300);
    });
  } catch (error) {
    console.error('Error starting investment journey:', error);
    isJourneyDataLoading.value = false;
    journeyError.value = error.message || 'Failed to load investment data';
  }
};

const startAutoProgression = () => {
  if (!autoProgressEnabled.value) return;
  
  progressInterval.value = setInterval(() => {
    if (currentDayIndex.value < journeyDays.value.length - 1) {
      currentDayIndex.value++;
    } else {
      // Auto-complete journey when reaching the end
      endJourney();
      stopAutoProgression();
    }
  }, 500); // Slightly slower for better UX
};

const stopAutoProgression = () => {
  if (progressInterval.value) {
    clearInterval(progressInterval.value);
    progressInterval.value = null;
  }
};

const generateJourneyData = async () => {
  try {
    // Prepare API payload
    const payload = {
      portfolioId: "0",
      Product: journeySetup.value.selectedProduct,
      investment: journeySetup.value.amount.toString(),
      DaysToProceed: totalDays.value.toString(),
      numberOfStocks: journeySetup.value.numberOfStocks.toString(),
      Startdate: journeySetup.value.startDate
    };

    console.log('API Payload:', payload);

    // Fetch data from API
    const apiData = await fetchSmartVestData(payload);
    
    // Map API data to journey structure
    journeyDays.value = mapApiDataToJourney(apiData);
    
    console.log('Journey Data Loaded:', journeyDays.value);
    
  } catch (error) {
    console.error('Error generating journey data:', error);
    throw error;
  }
};

const initializeChart = () => {
  const ctx = performanceChart.value?.getContext('2d');
  if (!ctx || !journeyDays.value.length) return;
  
  const canvas = performanceChart.value;
  const width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
  const height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
  canvas.style.width = canvas.offsetWidth + 'px';
  canvas.style.height = canvas.offsetHeight + 'px';
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  
  // Use SmartVestGraphData for chart - NAV values
  const portfolioNavData = journeyDays.value
    .filter(day => day.smartVestData)
    .map(day => (day.smartVestData.PortfolioNav - 1) * 100);
  const indexNavData = journeyDays.value
    .filter(day => day.smartVestData)
    .map(day => (day.smartVestData.IndexNav - 1) * 100);
  
  // Fallback to portfolio percentage if no smartVestData
  const portfolioData = portfolioNavData.length > 0 ? portfolioNavData : 
    journeyDays.value.map(day => day.portfolio.percentChange);
  const niftyData = indexNavData.length > 0 ? indexNavData : 
    journeyDays.value.map(day => day.portfolio.niftyChange);
  
  ctx.clearRect(0, 0, width, height);
  
  const chartWidth = canvas.offsetWidth;
  const chartHeight = canvas.offsetHeight;
  const padding = { top: 15, right: 15, bottom: 15, left: 25 };
  const graphWidth = chartWidth - padding.left - padding.right;
  const graphHeight = chartHeight - padding.top - padding.bottom;
  
  const allData = [...portfolioData, ...niftyData];
  const maxValue = Math.max(...allData, 5);
  const minValue = Math.min(...allData, -5);
  const range = maxValue - minValue;
  
  // Draw grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 0.5;
  
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (i * graphHeight / 4);
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(chartWidth - padding.right, y);
    ctx.stroke();
  }
  
  // Draw zero line
  if (minValue < 0 && maxValue > 0) {
    const zeroY = padding.top + ((maxValue - 0) / range * graphHeight);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding.left, zeroY);
    ctx.lineTo(chartWidth - padding.right, zeroY);
    ctx.stroke();
  }
  
  // Draw lines with enhanced styling
  const drawLine = (data, color, shadowColor, lineWidth = 2) => {
    if (data.length === 0) return;
    
    // Draw shadow
    ctx.strokeStyle = shadowColor;
    ctx.lineWidth = lineWidth + 2;
    ctx.beginPath();
    data.forEach((value, index) => {
      const x = padding.left + (index * graphWidth / Math.max(1, data.length - 1));
      const y = padding.top + ((maxValue - value) / range * graphHeight) + 1;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    
    // Draw main line
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    data.forEach((value, index) => {
      const x = padding.left + (index * graphWidth / Math.max(1, data.length - 1));
      const y = padding.top + ((maxValue - value) / range * graphHeight);
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    
    // Add gradient fill
    ctx.save();
    ctx.globalAlpha = 0.15;
    const gradient = ctx.createLinearGradient(0, padding.top, 0, chartHeight - padding.bottom);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    data.forEach((value, index) => {
      const x = padding.left + (index * graphWidth / Math.max(1, data.length - 1));
      const y = padding.top + ((maxValue - value) / range * graphHeight);
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.lineTo(chartWidth - padding.right, chartHeight - padding.bottom);
    ctx.lineTo(padding.left, chartHeight - padding.bottom);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };
  
  drawLine(niftyData, '#42A5F5', 'rgba(66, 165, 245, 0.3)', 2);
  drawLine(portfolioData, '#66BB6A', 'rgba(102, 187, 106, 0.3)', 3);
};

const goToDay = (index) => {
  currentDayIndex.value = index;
  // Stop auto-progression when user manually navigates
  if (autoProgressEnabled.value) {
    stopAutoProgression();
    autoProgressEnabled.value = false;
  }
};

const startNewJourney = () => {
  stopAutoProgression();
  currentPhase.value = 'setup';
  journeySetup.value = {
    startDate: '',
    selectedProduct: 'BG',
    amount: 100000,
    numberOfStocks: 10
  };
  diceRolls.value = [];
  journeyDays.value = [];
  currentDayIndex.value = 0;
  timelineStartIndex.value = 0;
  startStockPage.value = 0;
  currentStockPage.value = 0;
  finalStockPage.value = 0;
  autoProgressEnabled.value = true;
  isJourneyDataLoading.value = false;
  journeyError.value = null;
  showFinalResults.value = false;
  dayTooltip.value = {
    visible: false,
    x: 0,
    y: 0,
    day: null,
    isPinned: false,
    width: 240,
    height: 300
  };
};

const retryJourney = () => {
  journeyError.value = null;
  if (diceRolls.value.length > 0) {
    startInvestmentJourney();
  }
};

const endJourney = () => {
  stopAutoProgression();
  showFinalResults.value = true;
  currentDayIndex.value = journeyDays.value.length - 1;
  
  nextTick(() => {
    initializeChart();
  });
};

const exitJourney = () => {
  stopAutoProgression();
  // Simulate router push
  console.log('Navigating to home...');
};

watch(currentDayIndex, () => {
  if (currentPhase.value === 'journey' && !isJourneyDataLoading.value) {
    nextTick(() => {
      initializeChart();
    });
  }
  // Reset pagination when day changes
  currentStockPage.value = 0;
});

watch(showFinalResults, () => {
  if (showFinalResults.value) {
    finalStockPage.value = 0;
  }
});

onMounted(() => {
  const today = new Date();
  today.setDate(today.getDate() - 30);
  journeySetup.value.startDate = today.toISOString().split('T')[0];
});

onUnmounted(() => {
  stopAutoProgression();
});
</script>

<style scoped>
/* Global Reset & Base */
* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

html {
  font-size: 12px;
}

@media (min-width: 768px) {
  html {
    font-size: 13px;
  }
}

@media (min-width: 1200px) {
  html {
    font-size: 14px;
  }
}

@media (max-width: 600px) {
  html {
    font-size: 10px;
  }
}

.journey-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #42a5f5 100%);
  position: relative;
  overflow-x: hidden;
}

/* Animated Background */
.journey-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}

.floating-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  background: radial-gradient(circle, rgba(25, 118, 210, 0.15), rgba(33, 150, 243, 0.05));
  border-radius: 50%;
  animation: floatShape infinite ease-in-out;
}

@keyframes floatShape {
  0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
  50% { transform: translateY(-15px) rotate(180deg) scale(1.05); }
}

.grid-pattern {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(25, 118, 210, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(25, 118, 210, 0.08) 1px, transparent 1px);
  background-size: 30px 30px;
  animation: gridMove 20s infinite linear;
}

@keyframes gridMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(30px, 30px); }
}

.journey-container {
  position: relative;
  z-index: 1;
  max-width: 100vw;
  margin: 0;
  padding: 0.2rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Top Layout Row - New Structure */
.top-layout-row {
  display: flex;
  gap: 0.8rem;
  margin-bottom: 0;
  align-items: flex-start;
}

@media (max-width: 1200px) {
  .top-layout-row {
    flex-direction: column;
    gap: 0.8rem;
  }
  
  .right-pane {
    gap: 0.6rem;
  }
}

@media (max-width: 768px) {
  .performance-toolbar { 
    flex-wrap: wrap;
    gap: 0.6rem;
  }
}

/* Left Pane */
.left-pane {
  flex: 0 0 300px;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

@media (max-width: 1200px) {
  .left-pane {
    flex: 1;
  }
}

/* Configuration Summary Panel */
.config-summary-panel {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.92) 100%);
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 0.4rem 1.2rem rgba(25, 118, 210, 0.2);
  border: 2px solid rgba(25, 118, 210, 0.3);
  backdrop-filter: blur(15px);
}

.config-summary-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgba(25, 118, 210, 0.2);
}

.config-details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
  align-items: start;
}

@media (max-width: 768px) {
  .config-details-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
}

.config-detail-item {
  background: rgba(227, 242, 253, 0.5);
  border: 1px solid rgba(25, 118, 210, 0.3);
  border-radius: 0.6rem;
  padding: 0.6rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.config-detail-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 0.2rem 0.6rem rgba(25, 118, 210, 0.2);
}

.config-dice-control {
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.15), rgba(255, 235, 59, 0.1));
  border: 1px solid rgba(255, 193, 7, 0.4);
  border-radius: 0.6rem;
  padding: 0.6rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  grid-column: 1 / -1;
  justify-content: space-between;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.config-dice-control:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 0 30px rgba(255, 193, 7, 0.6);
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.25), rgba(255, 235, 59, 0.15));
}

/* Enhanced Dice Icon with 3D rolling animation */
.dice-icon-enhanced {
  position: relative;
  width: 45px;
  height: 45px;
  cursor: pointer;
  transition: all 0.3s ease;
  perspective: 100px;
}

.dice-icon-enhanced:hover {
  transform: scale(1.1);
}

.dice-icon-enhanced.rolling {
  animation: diceRollShake 0.1s infinite ease-in-out;
}

@keyframes diceRollShake {
  0%, 100% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(2deg) scale(1.05); }
  75% { transform: rotate(-2deg) scale(0.95); }
}

.dice-cube-mini {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.4s ease;
  animation: diceFloat 3s infinite ease-in-out;
}

.dice-icon-enhanced.rolling .dice-cube-mini {
  animation: diceRoll3D 0.2s infinite linear;
}

@keyframes diceFloat {
  0%, 100% { transform: rotateX(15deg) rotateY(15deg) translateZ(0); }
  50% { transform: rotateX(25deg) rotateY(25deg) translateZ(2px); }
}

@keyframes diceRoll3D {
  0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
  16% { transform: rotateX(60deg) rotateY(60deg) rotateZ(60deg); }
  33% { transform: rotateX(120deg) rotateY(120deg) rotateZ(120deg); }
  50% { transform: rotateX(180deg) rotateY(180deg) rotateZ(180deg); }
  66% { transform: rotateX(240deg) rotateY(240deg) rotateZ(240deg); }
  83% { transform: rotateX(300deg) rotateY(300deg) rotateZ(300deg); }
  100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
}

.dice-face-mini {
  position: absolute;
  width: 45px;
  height: 45px;
  background: linear-gradient(145deg, #ff9800, #ffc107, #ff8f00);
  border: 2px solid #ff6f00;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 4px 15px rgba(255, 152, 0, 0.4),
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
}

.dice-face-mini .dots {
  position: relative;
  width: 30px;
  height: 30px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 2px;
}

.dice-face-mini .dot {
  width: 6px;
  height: 6px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.dice-face-mini .dot.center { grid-area: 2 / 2; }
.dice-face-mini .dot.top-left { grid-area: 1 / 1; }
.dice-face-mini .dot.top-right { grid-area: 1 / 3; }
.dice-face-mini .dot.center-left { grid-area: 2 / 1; }
.dice-face-mini .dot.center-right { grid-area: 2 / 3; }
.dice-face-mini .dot.bottom-left { grid-area: 3 / 1; }
.dice-face-mini .dot.bottom-right { grid-area: 3 / 3; }

.dice-face-mini.front { transform: translateZ(22px); }
.dice-face-mini.back { transform: rotateY(180deg) translateZ(22px); }
.dice-face-mini.right { transform: rotateY(90deg) translateZ(22px); }
.dice-face-mini.left { transform: rotateY(-90deg) translateZ(22px); }
.dice-face-mini.top { transform: rotateX(90deg) translateZ(22px); }
.dice-face-mini.bottom { transform: rotateX(-90deg) translateZ(22px); }

.dice-sparkles {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
}

.dice-icon-enhanced.rolling .dice-sparkles .sparkle-mini {
  animation: sparkleFloat 1s ease-out infinite;
}

.sparkle-mini {
  position: absolute;
  font-size: 0.8rem;
  opacity: 0;
}

@keyframes sparkleFloat {
  0% { opacity: 0; transform: scale(0) rotate(0deg); }
  50% { opacity: 1; transform: scale(1) rotate(180deg); }
  100% { opacity: 0; transform: scale(0.5) rotate(360deg); }
}

.dice-results-mini {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.roll-history-mini {
  display: flex;
  gap: 0.2rem;
}

.roll-item-mini {
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.9), rgba(255, 152, 0, 0.7));
  border: 2px solid rgba(255, 193, 7, 0.9);
  border-radius: 0.5rem;
  padding: 0.3rem 0.6rem;
  font-size: 0.9rem;
  font-weight: 900;
  color: #ff6f00;
  min-width: 30px;
  text-align: center;
  box-shadow: 
    0 3px 8px rgba(245, 124, 0, 0.5),
    inset 0 2px 4px rgba(255, 255, 255, 0.4);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  animation: rollItemPulse 2s infinite ease-in-out;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.roll-item-mini::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  transition: left 0.5s ease;
}

.roll-item-mini:hover::before {
  left: 100%;
}

@keyframes rollItemPulse {
  0%, 100% { 
    transform: scale(1);
    box-shadow: 
      0 3px 8px rgba(245, 124, 0, 0.5),
      inset 0 2px 4px rgba(255, 255, 255, 0.4);
  }
  50% { 
    transform: scale(1.05);
    box-shadow: 
      0 5px 15px rgba(245, 124, 0, 0.8),
      inset 0 3px 6px rgba(255, 255, 255, 0.6);
  }
}

.total-days-mini {
  font-size: 0.9rem;
  font-weight: 900;
  color: #d84315;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 243, 224, 0.9));
  border-radius: 0.5rem;
  padding: 0.3rem 0.6rem;
  box-shadow: 
    0 3px 8px rgba(239, 108, 0, 0.5),
    inset 0 2px 4px rgba(255, 255, 255, 0.6);
  border: 2px solid rgba(239, 108, 0, 0.4);
  animation: totalDaysMegaGlow 1.8s infinite ease-in-out;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  position: relative;
}

.total-days-mini::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #ff9800, #ffc107, #ff8f00, #ff9800);
  background-size: 400% 400%;
  border-radius: 0.5rem;
  z-index: -1;
  animation: totalDaysBorder 3s infinite ease-in-out;
  filter: blur(1px);
}

@keyframes totalDaysMegaGlow {
  0%, 100% { 
    box-shadow: 
      0 3px 8px rgba(239, 108, 0, 0.5),
      inset 0 2px 4px rgba(255, 255, 255, 0.6);
    transform: scale(1);
  }
  50% { 
    box-shadow: 
      0 5px 15px rgba(239, 108, 0, 0.8),
      inset 0 3px 6px rgba(255, 255, 255, 0.8);
    transform: scale(1.05);
  }
}

@keyframes totalDaysBorder {
  0%, 100% { 
    background-position: 0% 50%;
  }
  50% { 
    background-position: 100% 50%;
  }
}

/* NIFTY Comparison Panel */
.nifty-comparison-panel {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(147, 197, 253, 0.05));
  border: 2px solid rgba(59, 130, 246, 0.2);
  border-radius: 1rem;
  padding: 1rem;
  backdrop-filter: blur(15px);
}

.comparison-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgba(59, 130, 246, 0.2);
}

.comparison-icon {
  font-size: 1.2rem;
  filter: drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3));
}

.comparison-title {
  font-size: 0.9rem;
  font-weight: 800;
  color: #1e40af;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.comparison-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
}

.comparison-stat {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 0.6rem;
  padding: 0.6rem;
  border: 1px solid rgba(59, 130, 246, 0.15);
  transition: all 0.3s ease;
}

.comparison-stat:hover {
  transform: translateY(-1px);
  box-shadow: 0 0.2rem 0.6rem rgba(59, 130, 246, 0.2);
}

.comparison-stat.highlight {
  border-color: rgba(59, 130, 246, 0.3);
  background: rgba(59, 130, 246, 0.1);
}

.stat-label {
  font-size: 0.6rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 0.2rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.stat-value {
  font-size: 0.8rem;
  font-weight: 900;
  color: #1e293b;
}

/* Right Pane */
.right-pane {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

/* Performance Toolbar */
.performance-toolbar {
  display: flex;
  gap: 0.8rem;
  background: linear-gradient(135deg, 
    rgba(240, 248, 255, 0.95) 0%, 
    rgba(219, 234, 254, 0.9) 50%, 
    rgba(191, 219, 254, 0.85) 100%
  );
  border-radius: 1rem;
  padding: 0.8rem;
  box-shadow: 
    0 0.3rem 1rem rgba(59, 130, 246, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(59, 130, 246, 0.2);
  backdrop-filter: blur(15px);
  overflow-x: auto;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;
}

@media (max-width: 768px) {
  .performance-toolbar {
    flex-wrap: wrap;
    gap: 0.6rem;
  }
}

/* Three Panel Layout in Right Pane - Enhanced Colors */
.three-panel-layout-right {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.5rem;
  min-height: 160px;
  max-height: 180px;
}

/* Keep 3 columns for all desktop sizes */
@media (min-width: 1201px) {
  .three-panel-layout-right {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0.4rem;
  }
}

/* For medium screens, reduce gap but keep 3 columns */
@media (min-width: 1201px) and (max-width: 1400px) {
  .three-panel-layout-right {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0.3rem;
  }
}

/* Only stack vertically on mobile/tablet */
@media (max-width: 1200px) {
  .three-panel-layout-right {
    grid-template-columns: 1fr;
    gap: 0.4rem;
    min-height: auto;
    max-height: none;
  }
}

/* Enhanced Portfolio Panel Styles with Better Colors */
.portfolio-panel {
  border-radius: 1rem;
  padding: 0.8rem;
  box-shadow: 
    0 0.4rem 1.2rem rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(20px);
  border: 2px solid;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  min-height: 150px;
  display: flex;
  flex-direction: column;
}

/* Enhanced background patterns for each panel */
.portfolio-bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0.1;
}

.start-pattern {
  background: 
    radial-gradient(circle at 20% 20%, rgba(255, 193, 7, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 152, 0, 0.2) 0%, transparent 50%),
    linear-gradient(45deg, transparent 40%, rgba(255, 235, 59, 0.1) 50%, transparent 60%);
}

.current-pattern {
  background: 
    radial-gradient(circle at 30% 70%, rgba(33, 150, 243, 0.25) 0%, transparent 50%),
    radial-gradient(circle at 70% 30%, rgba(25, 118, 210, 0.2) 0%, transparent 50%),
    linear-gradient(135deg, transparent 40%, rgba(100, 181, 246, 0.1) 50%, transparent 60%);
}

.final-pattern {
  background: 
    radial-gradient(circle at 25% 25%, rgba(76, 175, 80, 0.25) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(129, 199, 132, 0.2) 0%, transparent 50%),
    linear-gradient(225deg, transparent 40%, rgba(165, 214, 167, 0.1) 50%, transparent 60%);
}

/* Adjust panel size for right pane */
.three-panel-layout-right .portfolio-panel {
  min-height: 140px;
  padding: 0.6rem;
}

@media (max-width: 1400px) {
  .three-panel-layout-right .portfolio-panel {
    min-height: 120px;
    padding: 0.5rem;
  }
}

.portfolio-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 40%),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.08) 0%, transparent 40%);
  pointer-events: none;
  z-index: 2;
}

.portfolio-panel:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 
    0 0.8rem 2rem rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

/* Lighter, more harmonious colors matching the blue background */
.start-portfolio {
  background: linear-gradient(135deg, 
    rgba(255, 248, 225, 0.95) 0%, 
    rgba(255, 236, 179, 0.9) 50%, 
    rgba(255, 224, 130, 0.85) 100%
  );
  border-color: rgba(255, 193, 7, 0.4);
  color: #333;
  box-shadow: 
    0 0.4rem 1.2rem rgba(255, 193, 7, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.current-snapshot {
  background: linear-gradient(135deg, 
    rgba(240, 248, 255, 0.95) 0%, 
    rgba(219, 234, 254, 0.9) 50%, 
    rgba(191, 219, 254, 0.85) 100%
  );
  border-color: rgba(59, 130, 246, 0.4);
  color: #1e40af;
  box-shadow: 
    0 0.4rem 1.2rem rgba(59, 130, 246, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.final-portfolio {
  background: linear-gradient(135deg, 
    rgba(240, 253, 244, 0.95) 0%, 
    rgba(220, 252, 231, 0.9) 50%, 
    rgba(187, 247, 208, 0.85) 100%
  );
  border-color: rgba(34, 197, 94, 0.4);
  color: #166534;
  box-shadow: 
    0 0.4rem 1.2rem rgba(34, 197, 94, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.panel-header {
  text-align: center;
  margin-bottom: 0.8rem;
  padding-bottom: 0.6rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.4);
  position: relative;
  z-index: 3;
  flex-shrink: 0;
}

/* Adjust header for right pane */
.three-panel-layout-right .panel-header {
  margin-bottom: 0.5rem;
  padding-bottom: 0.4rem;
}

.panel-title {
  font-size: 0.9rem;
  font-weight: 900;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

/* Better text colors for each panel */
.start-portfolio .panel-title {
  color: #b45309;
}

.current-snapshot .panel-title {
  color: #1e40af;
}

.final-portfolio .panel-title {
  color: #166534;
}

/* Adjust title size for right pane */
.three-panel-layout-right .panel-title {
  font-size: 0.7rem;
  letter-spacing: 1px;
}

.panel-date, .panel-subtitle {
  font-size: 0.6rem;
  margin-top: 0.3rem;
  opacity: 0.8;
  font-weight: 600;
}

/* Adjust subtitle for right pane */
.three-panel-layout-right .panel-date,
.three-panel-layout-right .panel-subtitle {
  font-size: 0.5rem;
  margin-top: 0.2rem;
}

.panel-content {
  font-size: 0.65rem;
  line-height: 1.3;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 3;
}

/* Performance Metric Card Styles */
.performance-metric-card {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.6rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 0.8rem;
  box-shadow: 0 0.1rem 0.4rem rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border-left: 3px solid;
  min-width: 0;
  flex: 1;
  max-width: 200px;
  position: relative;
  overflow: hidden;
}

.performance-metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255, 255, 255, 0.4), 
    transparent
  );
  transition: left 0.5s ease;
}

.performance-metric-card:hover::before {
  left: 100%;
}

.performance-metric-card:hover {
  transform: translateY(-1px) scale(1.02);
  box-shadow: 0 0.3rem 0.8rem rgba(0, 0, 0, 0.12);
}

.portfolio-metric {
  border-left-color: #4CAF50;
}

.nifty-metric {
  border-left-color: #2196F3;
}

.vs-metric {
  border-left-color: #9C27B0;
}

.value-metric {
  border-left-color: #FF9800;
}

.journey-progress {
  border-left-color: #607D8B;
}

.metric-icon {
  font-size: 1.2rem;
  filter: drop-shadow(0 0 3px rgba(25, 118, 210, 0.3));
}

.metric-content {
  flex: 1;
}

.metric-label {
  font-size: 0.6rem;
  font-weight: 600;
  color: #666;
  margin-bottom: 0.1rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.metric-value {
  font-size: 0.9rem;
  font-weight: 900;
  margin-bottom: 0.2rem;
}

.metric-value.positive {
  color: #2e7d32;
}

.metric-value.negative {
  color: #c62828;
}

.metric-value.neutral {
  color: #1976d2;
}

.metric-value.portfolio-color {
  color: #4CAF50;
}

.metric-subtext {
  font-size: 0.55rem;
  color: #888;
  font-weight: 500;
}

.metric-visual {
  width: 100%;
  margin-top: 0.2rem;
}

.progress-bar {
  width: 100%;
  height: 3px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 1.5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 1.5px;
  transition: width 0.5s ease;
}

.portfolio-fill {
  background: linear-gradient(90deg, #4CAF50, #66BB6A);
}

.nifty-fill {
  background: linear-gradient(90deg, #2196F3, #42A5F5);
}

.vs-positive-fill {
  background: linear-gradient(90deg, #4CAF50, #66BB6A);
}

.vs-negative-fill {
  background: linear-gradient(90deg, #F44336, #EF5350);
}

.progress-circle {
  position: relative;
  width: 40px;
  height: 40px;
  margin: 0 auto;
}

.progress-circle svg {
  transform: rotate(-90deg);
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.7rem;
  font-weight: 700;
  color: #1976d2;
}

/* No Data Message */
.no-data-message {
  text-align: center;
  padding: 1.5rem 1rem;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 0.8rem;
  border: 2px dashed rgba(0, 0, 0, 0.2);
  color: rgba(0, 0, 0, 0.6);
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.no-data-icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  opacity: 0.6;
}

.no-data-text {
  font-size: 0.7rem;
  font-weight: 600;
  opacity: 0.8;
  font-style: italic;
}

/* Panel Content - Compact */
.stock-holdings, .current-holdings-list, .final-holdings-list {
  margin-bottom: 0.4rem;
  flex: 1;
  overflow-y: auto;
  max-height: 120px;
}

.stock-line, .holding-line, .final-stock-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.2rem;
  font-weight: 600;
  font-size: 0.55rem;
  padding: 0.15rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  line-height: 1.2;
}

.holding-line-compact {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.15rem;
  font-weight: 600;
  font-size: 0.5rem;
  padding: 0.1rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  line-height: 1.2;
}

.stock-symbol, .holding-symbol, .holding-symbol-compact {
  font-weight: 900;
  color: rgba(0, 0, 0, 0.8);
  font-size: 0.6rem;
  flex: 1;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 60px;
}

.stock-price, .holding-quantity, .stock-quantity, .holding-quantity-compact {
  font-weight: 700;
  color: rgba(0, 0, 0, 0.7);
  font-size: 0.5rem;
  text-align: center;
  min-width: 25px;
  white-space: nowrap;
}

.stock-value, .holding-value, .holding-value-compact {
  font-weight: 900;
  color: rgba(0, 0, 0, 0.9);
  font-size: 0.55rem;
  text-align: right;
  min-width: 45px;
  white-space: nowrap;
}

/* Pagination Controls - Compact */
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.3rem;
  margin: 0.3rem 0;
  padding: 0.2rem;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 0.3rem;
}

.page-btn {
  width: 18px;
  height: 18px;
  border: none;
  background: rgba(0, 0, 0, 0.2);
  color: rgba(0, 0, 0, 0.8);
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.6rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.3);
  transform: scale(1.1);
}

.page-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-indicator {
  font-size: 0.55rem;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.8);
  opacity: 0.9;
  white-space: nowrap;
}

.total-line, .performance-indicator, .final-total-line {
  text-align: center;
  padding: 0.3rem;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 0.3rem;
  font-weight: 900;
  font-size: 0.65rem;
  margin-top: auto;
  flex-shrink: 0;
}

.perf-text.positive, .final-perf.positive {
  color: #15803d;
}

.perf-text.negative, .final-perf.negative {
  color: #dc2626;
}

.journey-progress {
  text-align: center;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem 0.5rem;
}

.progress-text {
  font-size: 0.7rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
}

.progress-stats {
  margin-bottom: 0.6rem;
  font-size: 0.55rem;
  opacity: 0.9;
}

.end-journey-btn {
  background: rgba(0, 0, 0, 0.2);
  color: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.3);
  padding: 0.3rem 0.6rem;
  border-radius: 0.3rem;
  font-weight: 700;
  font-size: 0.55rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.end-journey-btn:hover {
  background: rgba(0, 0, 0, 0.3);
  transform: translateY(-1px);
}

/* Combined Setup + Dice Phase */
.combined-setup-phase {
  max-width: min(900px, 95vw);
  margin: 0 auto;
  padding: 0.4rem;
  min-height: calc(100vh - 2rem);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.combined-header {
  text-align: center;
  margin-bottom: 0.8rem;
  flex-shrink: 0;
  padding: 0.4rem 0;
}

.setup-icon {
  font-size: 1.4rem;
  margin-bottom: 0.4rem;
  animation: iconFloat 2s infinite ease-in-out;
  filter: drop-shadow(0 0 10px rgba(25, 118, 210, 0.5));
}

.setup-title {
  font-size: 1.4rem;
  font-weight: 900;
  color: #0d47a1;
  margin-bottom: 0.4rem;
  text-shadow: 0 2px 4px rgba(25, 118, 210, 0.3);
  line-height: 1.2;
}

.setup-subtitle {
  font-size: 0.75rem;
  color: #1565c0;
  font-weight: 600;
  line-height: 1.3;
}

.combined-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.8rem;
  align-items: start;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* Desktop layout - Updated for better space utilization */
@media (min-width: 900px) {
  .combined-content {
    grid-template-columns: 1fr;
    max-width: 1200px;
    margin: 0 auto;
  }
}

/* Enhanced Integrated Setup Layout */
.integrated-setup-layout {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 1.2rem;
  padding: 1.5rem;
  box-shadow: 0 0.8rem 2rem rgba(25, 118, 210, 0.2);
  border: 2px solid rgba(25, 118, 210, 0.3);
  backdrop-filter: blur(15px);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Top Form Grid */
.setup-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .setup-form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

/* Middle Section */
.middle-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  align-items: start;
}

@media (max-width: 768px) {
  .middle-section {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.stocks-section, .products-section {
  background: rgba(227, 242, 253, 0.3);
  border-radius: 1rem;
  padding: 1rem;
  border: 1px solid rgba(25, 118, 210, 0.2);
}

/* Compact Product Selector */
.product-selector-compact {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.product-card-compact {
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(25, 118, 210, 0.3);
  border-radius: 0.8rem;
  padding: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.product-card-compact:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(25, 118, 210, 0.3);
}

.product-card-compact.active {
  border-color: #1976d2;
  background: rgba(227, 242, 253, 0.9);
  box-shadow: 0 0.3rem 0.8rem rgba(25, 118, 210, 0.2);
}

.product-icon-compact {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.product-info {
  flex: 1;
}

.product-name-compact {
  font-size: 0.9rem;
  font-weight: 800;
  color: #0d47a1;
  margin-bottom: 0.3rem;
}

/* Compact Stocks Selector */
.stocks-selector-compact {
  padding: 0.8rem;
  background: rgba(227, 242, 253, 0.3);
  border-radius: 0.8rem;
  border: 1px solid rgba(25, 118, 210, 0.2);
}

/* Enhanced Dice Gaming Section */
.dice-gaming-section {
  background: linear-gradient(135deg, 
    rgba(25, 118, 210, 0.08) 0%, 
    rgba(33, 150, 243, 0.05) 50%, 
    rgba(25, 118, 210, 0.08) 100%
  );
  border-radius: 1.2rem;
  padding: 1.5rem;
  border: 2px solid rgba(25, 118, 210, 0.2);
  box-shadow: 
    0 0.8rem 2rem rgba(25, 118, 210, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.dice-header-enhanced {
  text-align: center;
  margin-bottom: 1.5rem;
}

.dice-title-main {
  font-size: 1.4rem;
  font-weight: 900;
  color: #0d47a1;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(25, 118, 210, 0.3);
}

.dice-subtitle {
  font-size: 0.9rem;
  color: #1565c0;
  margin-bottom: 1rem;
  font-weight: 600;
}

.dice-progress-bar {
  max-width: 300px;
  margin: 0 auto;
}

.progress-label {
  font-size: 0.8rem;
  color: #1565c0;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.progress-track {
  width: 100%;
  height: 8px;
  background: rgba(25, 118, 210, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill-dice {
  height: 100%;
  background: linear-gradient(90deg, #1976d2, #42a5f5);
  border-radius: 4px;
  transition: width 0.5s ease;
  box-shadow: 0 0 8px rgba(25, 118, 210, 0.4);
}

/* Main Dice Area Layout */
.dice-main-area {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;
}

@media (max-width: 768px) {
  .dice-main-area {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

/* Enhanced Dice Arena */
.dice-arena-enhanced {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.dice-container-main {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  perspective: 1000px;
  position: relative;
  padding: 2rem;
  background: radial-gradient(circle, rgba(25, 118, 210, 0.15), rgba(33, 150, 243, 0.08), transparent);
  border-radius: 1.2rem;
  border: 2px solid rgba(25, 118, 210, 0.3);
  box-shadow: 
    0 0 40px rgba(25, 118, 210, 0.4),
    inset 0 2px 8px rgba(255, 255, 255, 0.2);
  animation: diceContainerPulse 3s infinite ease-in-out;
  transition: all 0.3s ease;
  min-height: 140px;
}

.dice-container-main.rolling {
  background: radial-gradient(circle, rgba(255, 152, 0, 0.25), rgba(255, 193, 7, 0.15), transparent);
  border-color: rgba(255, 152, 0, 0.5);
  box-shadow: 
    0 0 60px rgba(255, 152, 0, 0.6),
    inset 0 4px 12px rgba(255, 255, 255, 0.3);
  animation: diceContainerRolling 0.3s infinite ease-in-out;
}

.dice-cube-enhanced {
  position: relative;
  width: 60px;
  height: 60px;
  transform-style: preserve-3d;
  transition: transform 0.4s ease;
  filter: drop-shadow(0 0 20px rgba(25, 118, 210, 0.6));
  animation: diceFloatIdle 3s infinite ease-in-out;
}

.dice-cube-enhanced.rolling {
  animation: rollDiceVisible 0.2s infinite linear;
}

.dice-face-enhanced {
  position: absolute;
  width: 60px;
  height: 60px;
  background: linear-gradient(145deg, #1976d2, #42a5f5, #1976d2);
  border: 3px solid #fff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 6px 20px rgba(25, 118, 210, 0.4),
    inset 0 3px 6px rgba(255, 255, 255, 0.3);
}

.dice-face-enhanced .dots {
  position: relative;
  width: 40px;
  height: 40px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 3px;
}

.dice-face-enhanced .dot {
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.dice-face-enhanced .dot.center { grid-area: 2 / 2; }
.dice-face-enhanced .dot.top-left { grid-area: 1 / 1; }
.dice-face-enhanced .dot.top-right { grid-area: 1 / 3; }
.dice-face-enhanced .dot.center-left { grid-area: 2 / 1; }
.dice-face-enhanced .dot.center-right { grid-area: 2 / 3; }
.dice-face-enhanced .dot.bottom-left { grid-area: 3 / 1; }
.dice-face-enhanced .dot.bottom-right { grid-area: 3 / 3; }

.dice-face-enhanced.front { transform: translateZ(30px); }
.dice-face-enhanced.back { transform: rotateY(180deg) translateZ(30px); }
.dice-face-enhanced.right { transform: rotateY(90deg) translateZ(30px); }
.dice-face-enhanced.left { transform: rotateY(-90deg) translateZ(30px); }
.dice-face-enhanced.top { transform: rotateX(90deg) translateZ(30px); }
.dice-face-enhanced.bottom { transform: rotateX(-90deg) translateZ(30px); }

.sparkle-effects-main {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
}

.sparkle-effects-main.active .sparkle-main {
  animation: sparkleFloat 1.2s ease-out infinite;
}

.sparkle-main {
  position: absolute;
  font-size: 1rem;
  opacity: 0;
}

/* Enhanced Roll Button */
.roll-btn-enhanced {
  background: linear-gradient(135deg, #1976d2, #42a5f5);
  color: white;
  border: none;
  border-radius: 1rem;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 900;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 
    0 0.4rem 1.2rem rgba(25, 118, 210, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.roll-btn-enhanced:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 
    0 0.8rem 2rem rgba(25, 118, 210, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  background: linear-gradient(135deg, #1565c0, #1976d2);
}

.roll-btn-enhanced:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.roll-btn-enhanced.rolling {
  background: linear-gradient(135deg, #ff9800, #ffc107);
  animation: rollButtonShake 0.3s infinite ease-in-out;
}

.roll-icon-main {
  font-size: 1.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.roll-text-main {
  font-size: 0.9rem;
}

/* Results Area */
.dice-results-area {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.results-display-enhanced {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 1rem;
  padding: 1.2rem;
  box-shadow: 0 0.4rem 1rem rgba(25, 118, 210, 0.15);
  border: 2px solid rgba(25, 118, 210, 0.2);
}

.results-header h4 {
  color: #0d47a1;
  font-size: 1.1rem;
  font-weight: 900;
  margin: 0 0 1rem 0;
  text-align: center;
}

.results-grid-enhanced {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.result-item-enhanced {
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.1), rgba(33, 150, 243, 0.05));
  border: 2px solid rgba(25, 118, 210, 0.3);
  border-radius: 0.8rem;
  padding: 0.8rem;
  text-align: center;
  min-width: 80px;
  transition: all 0.3s ease;
}

.result-item-enhanced:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.4rem 0.8rem rgba(25, 118, 210, 0.2);
}

.result-number {
  font-size: 1.5rem;
  font-weight: 900;
  color: #1976d2;
  margin-bottom: 0.3rem;
}

.result-label {
  font-size: 0.7rem;
  color: #1565c0;
  font-weight: 600;
  text-transform: uppercase;
}

.total-summary {
  text-align: center;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.1), rgba(33, 150, 243, 0.05));
  border-radius: 0.8rem;
  border: 2px solid rgba(25, 118, 210, 0.3);
}

.total-label {
  font-size: 0.8rem;
  color: #1565c0;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.total-value-enhanced {
  font-size: 2rem;
  font-weight: 900;
  color: #0d47a1;
  text-shadow: 0 2px 4px rgba(25, 118, 210, 0.3);
}

/* Instructions */
.dice-instructions {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 0.4rem 1rem rgba(25, 118, 210, 0.15);
  border: 2px solid rgba(25, 118, 210, 0.2);
}

.instruction-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.dice-instructions h4 {
  color: #0d47a1;
  font-size: 1.2rem;
  font-weight: 900;
  margin: 0 0 0.8rem 0;
}

.dice-instructions p {
  color: #1565c0;
  font-size: 0.9rem;
  margin-bottom: 1.2rem;
  line-height: 1.4;
}

.dice-info {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  padding: 0.5rem;
  background: rgba(227, 242, 253, 0.5);
  border-radius: 0.5rem;
  font-size: 0.8rem;
  color: #1565c0;
  font-weight: 600;
}

.info-icon {
  font-size: 1rem;
}

/* Journey Preview */
.journey-preview {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 1rem;
  padding: 1.2rem;
  box-shadow: 0 0.4rem 1rem rgba(25, 118, 210, 0.15);
  border: 2px solid rgba(25, 118, 210, 0.2);
}

.preview-header h4 {
  color: #0d47a1;
  font-size: 1.1rem;
  font-weight: 900;
  margin: 0 0 1rem 0;
  text-align: center;
}

.preview-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
}

.preview-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem;
  background: rgba(227, 242, 253, 0.5);
  border-radius: 0.8rem;
  border: 1px solid rgba(25, 118, 210, 0.2);
}

.preview-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.preview-content {
  flex: 1;
}

.preview-label {
  font-size: 0.7rem;
  color: #1565c0;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 0.2rem;
}

.preview-value {
  font-size: 0.9rem;
  color: #0d47a1;
  font-weight: 900;
}

/* Error Display */
.error-display {
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.1), rgba(255, 87, 51, 0.05));
  border: 2px solid rgba(244, 67, 54, 0.3);
  border-radius: 1rem;
  padding: 1.2rem;
  text-align: center;
  box-shadow: 0 0.4rem 1rem rgba(244, 67, 54, 0.15);
}

.error-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.8rem;
}

.error-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 2px 4px rgba(244, 67, 54, 0.3));
}

.error-header h4 {
  color: #c62828;
  font-size: 1.1rem;
  font-weight: 900;
  margin: 0;
}

.error-message {
  color: #d32f2f;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  font-weight: 600;
  line-height: 1.4;
}

.retry-btn {
  background: linear-gradient(135deg, #f44336, #ef5350);
  color: white;
  border: none;
  border-radius: 0.8rem;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 auto;
  box-shadow: 0 0.3rem 0.8rem rgba(244, 67, 54, 0.3);
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1.2rem rgba(244, 67, 54, 0.4);
  background: linear-gradient(135deg, #e53935, #f44336);
}

/* Form Section Updates */
.form-section {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.8rem;
}

.section-icon {
  font-size: 0.9rem;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(25, 118, 210, 0.1);
  border-radius: 50%;
  border: 1px solid rgba(25, 118, 210, 0.3);
}

.section-header h3 {
  color: #0d47a1;
  font-size: 1rem;
  font-weight: 800;
  margin: 0;
}

/* Form elements - updated */
.date-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.date-input-group label {
  font-weight: 700;
  color: #1565c0;
  font-size: 0.8rem;
}

.date-input {
  padding: 0.6rem;
  border: 2px solid rgba(25, 118, 210, 0.3);
  border-radius: 0.6rem;
  font-size: 0.8rem;
  background: rgba(255, 255, 255, 0.9);
  color: #0d47a1;
  transition: all 0.3s ease;
}

.date-input:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.date-hint {
  font-size: 0.7rem;
  color: #1565c0;
  font-style: italic;
}

.stocks-slider {
  margin-bottom: 0.8rem;
  text-align: center;
}

.slider {
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(25, 118, 210, 0.2);
  border-radius: 2px;
  outline: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: linear-gradient(135deg, #1976d2, #42a5f5);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(25, 118, 210, 0.3);
}

.slider-value {
  font-size: 1.2rem;
  font-weight: 900;
  color: #0d47a1;
  margin-top: 0.5rem;
}

.stocks-presets {
  display: flex;
  gap: 0.4rem;
  justify-content: center;
  flex-wrap: wrap;
}

.preset-btn {
  padding: 0.3rem 0.6rem;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(25, 118, 210, 0.3);
  border-radius: 0.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #1565c0;
  font-size: 0.7rem;
}

.preset-btn:hover {
  background: rgba(227, 242, 253, 0.9);
}

.preset-btn.active {
  background: linear-gradient(135deg, #1976d2, #42a5f5);
  color: white;
  border-color: transparent;
}

.risk-stars {
  display: flex;
  justify-content: center;
  gap: 1px;
}

.star {
  font-size: 0.5rem;
  opacity: 0.3;
}

.star.filled {
  opacity: 1;
}

.amount-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.amount-input {
  padding: 0.6rem;
  border: 2px solid rgba(25, 118, 210, 0.3);
  border-radius: 0.6rem;
  font-size: 0.9rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.9);
  color: #0d47a1;
  text-align: center;
  transition: all 0.3s ease;
}

.amount-input:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.amount-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  justify-content: center;
}

.amount-btn {
  padding: 0.4rem 0.8rem;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(25, 118, 210, 0.3);
  border-radius: 0.6rem;
  font-weight: 700;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #1565c0;
}

.amount-btn:hover {
  background: rgba(227, 242, 253, 0.9);
  transform: translateY(-1px);
}

.amount-btn.active {
  background: linear-gradient(45deg, #1976d2, #42a5f5);
  color: white;
  border-color: transparent;
  box-shadow: 0 0.2rem 0.6rem rgba(25, 118, 210, 0.3);
}

.setup-incomplete-message {
  background: rgba(108, 117, 125, 0.3);
  color: #6c757d;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-weight: 600;
  font-size: 0.7rem;
  text-align: center;
}

/* Continue with the rest of the CSS classes... */
@keyframes iconFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

/* Gaming Timeline Navigation */
.gaming-timeline-navigation {
  background: linear-gradient(145deg, 
    rgba(15, 23, 42, 0.95) 0%, 
    rgba(30, 41, 59, 0.9) 50%, 
    rgba(51, 65, 85, 0.85) 100%
  );
  border-radius: 0.8rem;
  padding: 1rem;
  box-shadow: 
    0 10px 25px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(148, 163, 184, 0.1);
  border: 1px solid rgba(148, 163, 184, 0.2);
  backdrop-filter: blur(20px);
  margin-bottom: 0.8rem;
  position: relative;
  margin-top: 2rem;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
  position: relative;
  z-index: 2;
  flex-wrap: wrap;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .timeline-header {
    flex-direction: column;
    text-align: center;
    gap: 0.8rem;
  }
}

.timeline-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #f1f5f9;
}

.timeline-icon {
  font-size: 1.2rem;
  filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.5));
  animation: gameIconFloat 2s infinite ease-in-out;
}

@keyframes gameIconFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-2px) rotate(3deg); }
}

.timeline-text {
  font-size: 0.9rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  background: linear-gradient(45deg, #f1f5f9, #cbd5e1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.timeline-status {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #e2e8f0;
}

.status-text {
  font-size: 0.7rem;
  font-weight: 600;
}

.status-bar {
  width: 100px;
  height: 6px;
  background: rgba(148, 163, 184, 0.2);
  border-radius: 3px;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.1);
}

.status-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #34d399, #6ee7b7);
  border-radius: 3px;
  transition: width 0.5s ease;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
}

.gaming-timeline-container {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.8rem;
  position: relative;
  z-index: 2;
}

@media (max-width: 600px) {
  .gaming-timeline-container {
    gap: 0.5rem;
  }
}

.timeline-nav-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(145deg, rgba(71, 85, 105, 0.8), rgba(51, 65, 85, 0.6));
  backdrop-filter: blur(10px);
  color: #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 4px 15px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(148, 163, 184, 0.2);
  border: 1px solid rgba(148, 163, 184, 0.2);
}

@media (max-width: 600px) {
  .timeline-nav-btn {
    width: 35px;
    height: 35px;
  }
}

.timeline-nav-btn:hover:not(:disabled) {
  transform: translateY(-1px) scale(1.05);
  box-shadow: 
    0 6px 20px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(148, 163, 184, 0.3);
  background: linear-gradient(145deg, rgba(71, 85, 105, 0.9), rgba(51, 65, 85, 0.7));
}

.timeline-nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  transform: none;
}

.nav-icon {
  font-size: 0.9rem;
  font-weight: 900;
}

.timeline-track {
  flex: 1;
  position: relative;
  height: 50px;
  display: flex;
  align-items: center;
}

.track-background {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(148, 163, 184, 0.2);
  border-radius: 2px;
  transform: translateY(-50%);
  border: 1px solid rgba(148, 163, 184, 0.1);
}

.track-progress {
  position: absolute;
  top: 50%;
  left: 0;
  height: 6px;
  background: linear-gradient(90deg, 
    #10b981 0%, 
    #34d399 25%, 
    #3b82f6 50%, 
    #6366f1 75%, 
    #8b5cf6 100%
  );
  border-radius: 3px;
  transform: translateY(-50%);
  transition: width 0.5s ease;
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.5);
  animation: progressGlow 2s infinite alternate;
}

@keyframes progressGlow {
  0% { box-shadow: 0 0 12px rgba(16, 185, 129, 0.5); }
  100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.7); }
}

.timeline-nodes {
  position: relative;
  width: 100%;
  height: 100%;
}

.timeline-node {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 3;
}

.timeline-node:hover {
  transform: translate(-50%, -50%) scale(1.1);
}

.node-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50px;
  height: 50px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
}

@media (max-width: 600px) {
  .node-ring {
    width: 44px;
    height: 44px;
  }
}

.node-core {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(224, 224, 224, 0.8));
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
}

@media (max-width: 600px) {
  .node-core {
    width: 38px;
    height: 38px;
  }
}

.node-day {
  font-size: 0.65rem;
  font-weight: 900;
  color: #0d47a1;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  text-align: center;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 40px;
}

@media (max-width: 600px) {
  .node-day {
    font-size: 0.55rem;
    max-width: 34px;
  }
}

.timeline-node.completed .node-core {
  background: linear-gradient(145deg, #10b981, #34d399);
  border-color: #10b981;
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.5);
}

.timeline-node.completed .node-day {
  color: white;
}

.timeline-node.completed .node-ring {
  border-color: #10b981;
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.4);
}

.timeline-node.active .node-core {
  background: linear-gradient(145deg, #3b82f6, #60a5fa);
  border-color: #3b82f6;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.7);
  transform: translate(-50%, -50%) scale(1.1);
}

.timeline-node.active .node-day {
  color: white;
  font-size: 0.7rem;
}

.timeline-node.active .node-ring {
  border-color: #3b82f6;
  border-width: 3px;
  box-shadow: 0 0 16px rgba(59, 130, 246, 0.6);
  animation: activeRingPulse 1.5s infinite ease-in-out;
}

@keyframes activeRingPulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.1); }
}

.timeline-node.future .node-core {
  background: linear-gradient(145deg, rgba(71, 85, 105, 0.6), rgba(51, 65, 85, 0.4));
  border-color: #64748b;
}

.timeline-node.future .node-day {
  color: #94a3b8;
}

.timeline-node.future .node-ring {
  border-color: rgba(148, 163, 184, 0.3);
}

.node-effects {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.pulse-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  border: 2px solid rgba(25, 118, 210, 0.6);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: pulseRing 2s infinite ease-out;
}

@keyframes pulseRing {
  0% {
    width: 32px;
    height: 32px;
    opacity: 1;
  }
  100% {
    width: 80px;
    height: 80px;
    opacity: 0;
  }
}

.energy-particles {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: radial-gradient(circle, #42a5f5, #1976d2);
  border-radius: 50%;
  animation: particleFloat 2s infinite ease-in-out;
}

@keyframes particleFloat {
  0%, 100% {
    transform: rotate(0deg) translateX(0px) scale(1);
    opacity: 1;
  }
  50% {
    transform: rotate(180deg) translateX(30px) scale(0.5);
    opacity: 0.5;
  }
}

/* Enhanced Event Indicators for Timeline */
.event-indicators {
  position: absolute;
  top: -8px;
  right: -8px;
  display: flex;
  gap: 2px;
  z-index: 5;
}

.event-indicator {
  position: relative;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.event-indicator.buy {
  background: linear-gradient(135deg, #4CAF50, #66BB6A);
}

.event-indicator.sell {
  background: linear-gradient(135deg, #F44336, #EF5350);
}

.event-indicator.dividend {
  background: linear-gradient(135deg, #FF9800, #FFB74D);
}

.event-indicator .event-icon {
  font-size: 0.5rem;
  filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.5));
  animation: eventIconBounce 1s infinite ease-in-out;
  z-index: 2;
}

@keyframes eventIconBounce {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.1) rotate(5deg); }
}

.event-indicator .event-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: eventIndicatorGlow 1.5s infinite ease-in-out;
}

.buy .event-glow {
  background: radial-gradient(circle, rgba(76, 175, 80, 0.8), transparent);
}

.sell .event-glow {
  background: radial-gradient(circle, rgba(244, 67, 54, 0.8), transparent);
}

.dividend .event-glow {
  background: radial-gradient(circle, rgba(255, 152, 0, 0.8), transparent);
}

@keyframes eventIndicatorGlow {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
  50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.4; }
}

.event-count-badge {
  position: absolute;
  top: -12px;
  right: -12px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  font-size: 0.5rem;
  font-weight: 700;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  z-index: 6;
}

/* Journey Phase Layout - Updated Layout */
.journey-phase {
  max-width: 100%;
  margin: 0 10px;
  flex: 1;
}

.journey-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  height: 100%;
}

/* Main Content Panel - Now for timeline and below */
.main-content-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-height: 0;
  width: 100%;
}

/* Day Events Section - Reduced size */
.day-events-section {
  background: linear-gradient(145deg, 
    rgba(255, 255, 255, 0.98) 0%, 
    rgba(240, 248, 255, 0.95) 50%, 
    rgba(227, 242, 253, 0.92) 100%
  );
  border-radius: 0.8rem;
  padding: 0.6rem;
  box-shadow: 
    0 0.4rem 1rem rgba(25, 118, 210, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(25, 118, 210, 0.2);
  backdrop-filter: blur(20px);
  margin-bottom: 0.6rem;
  position: relative;
  overflow: hidden;
  max-height: 180px;
}

.day-events-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.6rem;
  padding-bottom: 0.4rem;
  border-bottom: 2px solid rgba(25, 118, 210, 0.2);
  position: relative;
  z-index: 2;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .day-events-header {
    flex-direction: column;
    text-align: center;
    gap: 0.3rem;
  }
}

.events-icon {
  font-size: 1.2rem;
  filter: drop-shadow(0 2px 4px rgba(25, 118, 210, 0.3));
}

.events-title {
  font-size: 1rem;
  font-weight: 900;
  color: #0d47a1;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  text-shadow: 0 2px 4px rgba(13, 71, 161, 0.2);
}

.current-day-info {
  font-size: 0.7rem;
  color: #1565c0;
  font-weight: 600;
  background: rgba(227, 242, 253, 0.6);
  padding: 0.3rem 0.6rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(25, 118, 210, 0.2);
  margin-left: auto;
}

.events-container {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  position: relative;
  z-index: 2;
  max-height: 100px;
  overflow-y: auto;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.event-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 0.5rem;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-left: 3px solid;
  box-shadow: 0 0.2rem 0.5rem rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.event-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 0.3rem 0.8rem rgba(0, 0, 0, 0.15);
}

.event-card.buy {
  border-left-color: #4CAF50;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.05), rgba(255, 255, 255, 0.95));
}

.event-card.sell {
  border-left-color: #F44336;
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.05), rgba(255, 255, 255, 0.95));
}

.event-card.dividend {
  border-left-color: #FF9800;
  background: linear-gradient(135deg, rgba(255, 152, 0, 0.05), rgba(255, 255, 255, 0.95));
}

.event-icon-badge {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  box-shadow: 0 0.2rem 0.4rem rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.buy .event-icon-badge {
  background: linear-gradient(135deg, #4CAF50, #66BB6A);
}

.sell .event-icon-badge {
  background: linear-gradient(135deg, #F44336, #EF5350);
}

.dividend .event-icon-badge {
  background: linear-gradient(135deg, #FF9800, #FFB74D);
}

.event-details {
  flex: 1;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.2rem;
}

.event-type {
  font-size: 0.6rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #37474f;
}

.event-stock {
  font-size: 0.65rem;
  font-weight: 900;
  color: #0d47a1;
  background: rgba(227, 242, 253, 0.6);
  padding: 0.1rem 0.3rem;
  border-radius: 0.2rem;
}

.event-info {
  display: flex;
  gap: 0.5rem;
  font-size: 0.55rem;
  color: #546e7a;
  flex-wrap: wrap;
}

.event-quantity, .event-price, .event-amount {
  font-weight: 600;
}

.event-total {
  font-size: 0.6rem;
  font-weight: 900;
  padding: 0.2rem 0.4rem;
  border-radius: 0.3rem;
  color: white;
  text-align: center;
  min-width: 60px;
  flex-shrink: 0;
}

.buy-total {
  background: linear-gradient(135deg, #4CAF50, #66BB6A);
}

.sell-total {
  background: linear-gradient(135deg, #F44336, #EF5350);
}

.dividend-total {
  background: linear-gradient(135deg, #FF9800, #FFB74D);
}

.no-events-message {
  text-align: center;
  padding: 2rem;
  background: rgba(248, 250, 252, 0.6);
  border: 2px dashed rgba(148, 163, 184, 0.3);
  border-radius: 0.8rem;
  color: #64748b;
}

.no-events-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  opacity: 0.6;
}

.no-events-text {
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
}

.no-events-subtext {
  font-size: 0.7rem;
  opacity: 0.8;
  font-style: italic;
}

/* Enhanced Performance Chart Section */
.performance-chart-section {
  background: linear-gradient(145deg, 
    rgba(255, 255, 255, 0.98) 0%, 
    rgba(240, 248, 255, 0.95) 50%, 
    rgba(227, 242, 253, 0.92) 100%
  );
  border-radius: 1.2rem;
  padding: 1rem;
  box-shadow: 
    0 0.8rem 2rem rgba(25, 118, 210, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(25, 118, 210, 0.2);
  backdrop-filter: blur(20px);
  margin-bottom: 0.8rem;
  position: relative;
  overflow: hidden;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  position: relative;
  z-index: 2;
  flex-wrap: wrap;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .chart-header {
    flex-direction: column;
    text-align: center;
  }
}

.chart-title {
  font-size: 1rem;
  font-weight: 900;
  color: #0d47a1;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  text-shadow: 0 2px 4px rgba(13, 71, 161, 0.2);
}

.chart-legend {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.6rem;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 0.6rem;
  border: 1px solid rgba(25, 118, 210, 0.2);
  transition: all 0.3s ease;
}

.legend-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 0.3rem 0.8rem rgba(25, 118, 210, 0.2);
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
  animation: dotPulse 2s infinite ease-in-out;
}

@keyframes dotPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.portfolio-dot {
  background: linear-gradient(45deg, #4CAF50, #66BB6A);
  box-shadow: 0 0 12px rgba(76, 175, 80, 0.5);
}

.nifty-dot {
  background: linear-gradient(45deg, #2196F3, #42A5F5);
  box-shadow: 0 0 12px rgba(33, 150, 243, 0.5);
}

.legend-text {
  font-size: 0.7rem;
  font-weight: 700;
  color: #1565c0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Performance Metrics Grid */
.performance-metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(180px, 100vw), 1fr));
  gap: 0.8rem;
  margin-bottom: 1rem;
  position: relative;
  z-index: 2;
}

@media (max-width: 768px) {
  .performance-metrics-grid {
    grid-template-columns: 1fr;
  }
}

.metric-card {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.9) 0%, 
    rgba(248, 250, 252, 0.8) 100%
  );
  border-radius: 0.8rem;
  padding: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 
    0 0.4rem 1rem rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.metric-card:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 
    0 0.8rem 2rem rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.metric-card.returns {
  color: #4CAF50;
}

.metric-card.outperformance {
  color: #9C27B0;
}

.metric-card.value {
  color: #FF9800;
}

.metric-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  animation: iconBreathe 3s infinite ease-in-out;
}

@keyframes iconBreathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.metric-info {
  flex: 1;
}

.metric-label {
  font-size: 0.6rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 0.2rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-value {
  font-size: 0.9rem;
  font-weight: 900;
  line-height: 1;
}

.metric-trend {
  display: flex;
  align-items: center;
  justify-content: center;
}

.trend-arrow {
  font-size: 1.2rem;
  font-weight: 900;
  animation: arrowBounce 1.5s infinite ease-in-out;
}

@keyframes arrowBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

.trend-arrow.up {
  color: #4CAF50;
}

.trend-arrow.down {
  color: #F44336;
}

.metric-visual {
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-ring {
  width: 40px;
  height: 40px;
  animation: ringRotate 3s infinite linear;
}

@keyframes ringRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Enhanced Chart Container */
.enhanced-chart-container {
  position: relative;
  width: 100%;
  height: 140px;
  background: linear-gradient(135deg, 
    rgba(248, 250, 252, 0.9) 0%, 
    rgba(241, 245, 249, 0.8) 100%
  );
  border-radius: 0.8rem;
  border: 2px solid rgba(148, 163, 184, 0.2);
  overflow: hidden;
  margin-bottom: 1rem;
  box-shadow: 
    inset 0 2px 8px rgba(0, 0, 0, 0.05),
    0 0.4rem 1rem rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .enhanced-chart-container {
    height: 120px;
  }
}

.chart-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.4;
}

.grid-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.grid-line {
  position: absolute;
  background: linear-gradient(135deg, 
    rgba(148, 163, 184, 0.3), 
    rgba(203, 213, 225, 0.2)
  );
}

.grid-line.horizontal {
  left: 0;
  right: 0;
  height: 1px;
}

.grid-line.vertical {
  top: 0;
  bottom: 0;
  width: 1px;
}

.performance-canvas {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
}

.chart-overlay {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.5rem;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.95), 
    rgba(248, 250, 252, 0.9)
  );
  backdrop-filter: blur(10px);
  border-radius: 0.6rem;
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 0.3rem 0.8rem rgba(0, 0, 0, 0.1);
  z-index: 3;
}

@media (max-width: 768px) {
  .chart-overlay {
    position: relative;
    margin-top: 0.5rem;
    top: auto;
    right: auto;
  }
}

.data-points {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

@media (max-width: 768px) {
  .data-points {
    flex-direction: row;
    justify-content: space-around;
  }
}

.data-point {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.point-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pointPulse 2s infinite ease-in-out;
}

@keyframes pointPulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.2); opacity: 1; }
}

.portfolio-point .point-indicator {
  background: linear-gradient(45deg, #4CAF50, #66BB6A);
  box-shadow: 0 0 8px rgba(76, 175, 80, 0.6);
}

.nifty-point .point-indicator {
  background: linear-gradient(45deg, #2196F3, #42A5F5);
  box-shadow: 0 0 8px rgba(33, 150, 243, 0.6);
}

.point-value {
  font-size: 0.7rem;
  font-weight: 700;
  color: #475569;
}

/* Chart Statistics */
.chart-statistics {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0.8rem;
  background: linear-gradient(135deg, 
    rgba(241, 245, 249, 0.8), 
    rgba(226, 232, 240, 0.6)
  );
  border-radius: 0.6rem;
  border: 1px solid rgba(148, 163, 184, 0.2);
  position: relative;
  z-index: 2;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.6rem;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 0.4rem;
  border: 1px solid rgba(148, 163, 184, 0.1);
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0.2rem 0.6rem rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 0.8rem;
  opacity: 0.8;
}

.stat-text {
  font-size: 0.6rem;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

/* Journey Actions - Compact */
.journey-actions-wrapper {
  position: relative;
  width: 100%;
  padding: 1rem 0;
}

.journey-actions {
  display: flex;
  justify-content: center;
  gap: 0.8rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .journey-actions {
    flex-direction: column;
    align-items: center;
  }
}

.action-btn {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 0.8rem;
  font-weight: 900;
  font-size: 0.65rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

.action-btn.primary {
  background: linear-gradient(135deg, #1976d2, #42a5f5);
  color: white;
  box-shadow: 0 0.2rem 0.6rem rgba(25, 118, 210, 0.3);
}

.action-btn.secondary {
  background: linear-gradient(135deg, #607D8B, #90A4AE);
  color: white;
  box-shadow: 0 0.2rem 0.6rem rgba(96, 125, 139, 0.3);
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 0.3rem 0.8rem rgba(0, 0, 0, 0.2);
}

.btn-icon {
  font-size: 0.65rem;
}

.btn-text {
  font-size: 0.55rem;
}

/* End Journey Button - Bottom Right Corner */
.end-journey-wrapper {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 100;
}

.end-journey-btn-corner {
  background: linear-gradient(135deg, #F44336, #EF5350);
  color: white;
  border: none;
  border-radius: 1rem;
  padding: 0.8rem 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 
    0 0.4rem 1.2rem rgba(244, 67, 54, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 900;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.end-journey-btn-corner:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 
    0 0.6rem 1.8rem rgba(244, 67, 54, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  background: linear-gradient(135deg, #E53935, #F44336);
}

.end-journey-btn-corner .btn-icon {
  font-size: 1rem;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
}

.end-journey-btn-corner .btn-text {
  font-size: 0.7rem;
}

@media (max-width: 768px) {
  .end-journey-wrapper {
    bottom: 1rem;
    right: 1rem;
  }
  
  .end-journey-btn-corner {
    padding: 0.6rem 1rem;
    font-size: 0.7rem;
  }
  
  .end-journey-btn-corner .btn-text {
    font-size: 0.65rem;
  }
}

/* Enhanced Compact Day Tooltip Styles - Redesigned */
.day-tooltip {
  position: fixed;
  z-index: 1000;
  background: linear-gradient(145deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.96));
  color: white;
  border-radius: 0.8rem;
  padding: 0.8rem;
  min-width: min(240px, 85vw);
  max-width: min(280px, 90vw);
  max-height: min(70vh, 70dvh);
  overflow-y: auto;
  box-shadow: 
    0 1rem 2rem rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 0 0 1px rgba(59, 130, 246, 0.3);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(59, 130, 246, 0.25);
  animation: tooltipFadeIn 0.25s ease-out;
  font-size: 0.75rem;
}

@keyframes tooltipFadeIn {
  0% { opacity: 0; transform: scale(0.9) translateY(10px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

.tooltip-header {
  text-align: center;
  margin-bottom: 0.6rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(59, 130, 246, 0.3);
  position: relative;
}

.tooltip-day {
  font-size: 0.9rem;
  font-weight: 800;
  margin-bottom: 0.2rem;
  background: linear-gradient(45deg, #3b82f6, #10b981);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: none;
}

.tooltip-date {
  font-size: 0.65rem;
  opacity: 0.8;
  font-weight: 500;
  color: #cbd5e1;
}

.tooltip-content {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

/* Compact Portfolio Section */
.tooltip-section-compact {
  background: rgba(59, 130, 246, 0.08);
  border-radius: 0.5rem;
  padding: 0.6rem;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.section-title-compact {
  font-size: 0.65rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
  color: #60a5fa;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  border-bottom: 1px solid rgba(96, 165, 250, 0.15);
  padding-bottom: 0.2rem;
}

/* Ultra-compact stats grid */
.stats-grid-compact {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.3rem;
}

@media (max-width: 320px) {
  .stats-grid-compact {
    grid-template-columns: 1fr;
    gap: 0.2rem;
  }
}

.stat-compact {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.3rem 0.4rem;
  background: rgba(59, 130, 246, 0.08);
  border-radius: 0.3rem;
  border: 1px solid rgba(59, 130, 246, 0.15);
  min-height: 24px;
}

.stat-label-compact {
  font-size: 0.55rem;
  font-weight: 600;
  color: #a5b4fc;
  text-transform: uppercase;
  letter-spacing: 0.2px;
  line-height: 1;
}

.stat-value-compact {
  font-size: 0.6rem;
  font-weight: 800;
  line-height: 1;
  text-align: right;
}

.stat-value-compact.positive {
  color: #34d399;
}

.stat-value-compact.negative {
  color: #f87171;
}

.stat-value-compact.neutral {
  color: #60a5fa;
}

/* Compact Holdings Section */
.tooltip-holdings-compact {
  background: rgba(16, 185, 129, 0.08);
  border-radius: 0.5rem;
  padding: 0.6rem;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.holdings-list-compact {
  max-height: 100px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding-right: 0.2rem;
}

@media (max-width: 320px) {
  .holdings-list-compact {
    max-height: 80px;
  }
}

.holding-row-compact {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 0.4rem;
  align-items: center;
  font-size: 0.6rem;
  padding: 0.25rem 0.3rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.2s ease;
  border-radius: 0.2rem;
  min-height: 20px;
}

.holding-row-compact:hover {
  background: rgba(16, 185, 129, 0.1);
  border-bottom-color: rgba(255, 255, 255, 0.15);
}

.holding-row-compact:last-child {
  border-bottom: none;
}

.holding-symbol-tooltip {
  font-weight: 800;
  color: #d1fae5;
  font-size: 0.6rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 60px;
}

.holding-qty-tooltip {
  font-weight: 600;
  color: #a7f3d0;
  text-align: center;
  font-size: 0.55rem;
  min-width: 25px;
}

.holding-value-tooltip {
  font-weight: 700;
  color: white;
  text-align: right;
  font-size: 0.55rem;
  min-width: 40px;
}

/* Compact Trades Section */
.tooltip-trades-compact {
  background: rgba(255, 193, 7, 0.08);
  border-radius: 0.5rem;
  padding: 0.6rem;
  border: 1px solid rgba(255, 193, 7, 0.2);
}

.trades-list-compact {
  max-height: 80px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding-right: 0.2rem;
}

.trade-row-compact {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.3rem;
  align-items: center;
  padding: 0.25rem 0.3rem;
  border-radius: 0.3rem;
  font-weight: 600;
  transition: all 0.2s ease;
  border-left: 2px solid;
  font-size: 0.55rem;
  min-height: 20px;
}

.trade-row-compact.buy {
  background: rgba(34, 197, 94, 0.12);
  border-left-color: #22c55e;
}

.trade-row-compact.sell {
  background: rgba(239, 68, 68, 0.12);
  border-left-color: #ef4444;
}

.trade-row-compact.dividend {
  background: rgba(255, 193, 7, 0.12);
  border-left-color: #ffc107;
}

.trade-icon-compact {
  font-size: 0.7rem;
  line-height: 1;
}

.trade-details-compact {
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.55rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.trade-qty-compact {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  text-align: right;
  font-size: 0.5rem;
  min-width: 25px;
}

.more-events-indicator {
  font-size: 0.55rem;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  padding: 0.2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.2rem;
  margin-top: 0.2rem;
  font-style: italic;
}

/* Close button - smaller and more refined */
.tooltip-close-btn {
  position: absolute;
  top: 0.4rem;
  right: 0.4rem;
  background: rgba(239, 68, 68, 0.8);
  border: none;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.tooltip-close-btn:hover {
  background: rgba(239, 68, 68, 1);
  transform: scale(1.1);
}

.close-icon {
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  line-height: 1;
}

/* Enhanced scrollbar for tooltip */
.tooltip-content ::-webkit-scrollbar {
  width: 3px;
}

.tooltip-content ::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.tooltip-content ::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.tooltip-content ::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Remaining animations and utility classes */
@keyframes diceContainerPulse {
  0%, 100% { 
    transform: scale(1);
    box-shadow: 
      0 0 40px rgba(25, 118, 210, 0.4),
      inset 0 2px 8px rgba(255, 255, 255, 0.2);
  }
  50% { 
    transform: scale(1.02);
    box-shadow: 
      0 0 60px rgba(25, 118, 210, 0.6),
      inset 0 4px 12px rgba(255, 255, 255, 0.3);
  }
}

@keyframes diceContainerRolling {
  0%, 100% { 
    transform: scale(1) rotate(0deg);
  }
  25% { 
    transform: scale(1.02) rotate(1deg);
  }
  75% { 
    transform: scale(1.02) rotate(-1deg);
  }
}

@keyframes diceFloatIdle {
  0%, 100% { 
    transform: translateY(0) rotateX(0deg) rotateY(0deg);
  }
  33% { 
    transform: translateY(-5px) rotateX(5deg) rotateY(5deg);
  }
  66% { 
    transform: translateY(-2px) rotateX(-3deg) rotateY(-3deg);
  }
}

@keyframes rollDiceVisible {
  0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1); }
  16% { transform: rotateX(60deg) rotateY(60deg) rotateZ(60deg) scale(1.1); }
  33% { transform: rotateX(120deg) rotateY(120deg) rotateZ(120deg) scale(0.9); }
  50% { transform: rotateX(180deg) rotateY(180deg) rotateZ(180deg) scale(1.1); }
  66% { transform: rotateX(240deg) rotateY(240deg) rotateZ(240deg) scale(0.9); }
  83% { transform: rotateX(300deg) rotateY(300deg) rotateZ(300deg) scale(1.1); }
  100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg) scale(1); }
}

@keyframes rollButtonShake {
  0%, 100% { 
    transform: translateY(0) rotate(0deg);
  }
  25% { 
    transform: translateY(-2px) rotate(1deg);
  }
  75% { 
    transform: translateY(-2px) rotate(-1deg);
  }
}

@keyframes sparkleFloat {
  0% { opacity: 0; transform: scale(0) rotate(0deg); }
  50% { opacity: 1; transform: scale(1) rotate(180deg); }
  100% { opacity: 0; transform: scale(0.5) rotate(360deg); }
}

/* Utility Classes */
.positive {
  color: #2e7d32;
}

.negative {
  color: #c62828;
}

.portfolio-text {
  color: #FF9800;
}

.journey-progress-value {
  margin-top: 1rem;
}

.summary-icon {
  font-size: 1rem;
}

.summary-title {
  font-size: 0.8rem;
  font-weight: 900;
  color: #0d47a1;
  margin: 0;
}

.detail-icon {
  font-size: 0.9rem;
}

.detail-content {
  flex: 1;
  min-width: 0;
}

.detail-label {
  font-size: 0.55rem;
  color: #1565c0;
  font-weight: 600;
  margin-bottom: 0.1rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.detail-value {
  font-size: 0.65rem;
  font-weight: 900;
  color: #0d47a1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Scrollbar Styles */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(25, 118, 210, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(25, 118, 210, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(25, 118, 210, 0.5);
}

/* Animation performance optimization */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>