<template>
<div class="journey-view">
  <!-- Full-Screen Loading Overlay -->
  <div v-if="isFullScreenLoading" class="full-screen-loading-overlay">
    <!-- Blurred Background -->
    <div class="loading-background-blur"></div>
    
    <!-- Centered Loading Content -->
    <div class="loading-content-container">
      <!-- Loading Spinner -->
      <div class="loading-spinner-container">
        <div class="loading-spinner-enhanced">
          <div class="spinner-ring-enhanced"></div>
          <div class="spinner-ring-enhanced"></div>
          <div class="spinner-ring-enhanced"></div>
        </div>
      </div>
      
      <!-- Loading Message -->
      <div class="loading-message-container">
        <h3 class="loading-title-enhanced">{{ loadingMessage || 'Processing...' }}</h3>
        <p class="loading-subtitle-enhanced">Please wait while we process your request</p>
      </div>
      
      <!-- Loading Progress Dots -->
      <div class="loading-progress-dots-enhanced">
        <span class="dot-enhanced"></span>
        <span class="dot-enhanced"></span>
        <span class="dot-enhanced"></span>
        <span class="dot-enhanced"></span>
      </div>
      
      <!-- Vivekam Branding -->
      <div class="loading-footer-enhanced">
        <div class="loading-vivekam-logo">
          <span class="loading-logo-icon">📈</span>
          <span class="loading-logo-text">Vivekam</span>
        </div>
        <p class="loading-footer-text">SEBI Registered Investment Advisory</p>
      </div>
    </div>
  </div>

  <!-- Vivekam Quotes Dialog for Five Year Term -->
<div v-if="showVivekamDialog" class="vivekam-dialog-overlay">
  <div class="vivekam-dialog-background"></div>
  <div class="vivekam-dialog-container">
    <!-- Close button (only enabled after API completes) -->
    <button 
      v-if="canCloseDialog"
      class="dialog-close-btn"
      @click="closeVivekamDialog"
      :class="{ 'enabled': canCloseDialog }"
    >
      <span class="close-icon">✕</span>
    </button>

    <!-- Vivekam Logo/Header -->
    <div class="dialog-header">
      <div class="vivekam-logo">
        <div class="logo-icon">📈</div>
        <h2 class="vivekam-title">Vivekam</h2>
      </div>
      <p class="vivekam-subtitle">SEBI Registered Investment Advisory</p>
    </div>

    <!-- Quote Display -->
    <div class="quote-container">
        <!-- Update quote display to use dynamic quotes -->
        <div class="quote-content" :key="currentQuoteIndex">
          <div class="quote-icon">💡</div>
          <blockquote class="main-quote">
            "{{ getCurrentQuotes()[currentQuoteIndex].text }}"
          </blockquote>
          <p class="quote-subtitle">{{ getCurrentQuotes()[currentQuoteIndex].subtitle }}</p>
        </div>

        <!-- Update quote indicators -->
        <div class="quote-indicators">
          <div 
            v-for="(quote, index) in getCurrentQuotes()" 
            :key="index"
            class="quote-dot"
            :class="{ 'active': index === currentQuoteIndex }"
          ></div>
        </div>
    </div>

    <div class="processing-status">
      <div class="processing-spinner">
        <div class="spinner-vivekam"></div>
      </div>
      <div class="status-text">
        <span v-if="!apiCompleted && rollingType === 'F'">Processing your Five Year Investment Journey...</span>
        <span v-else-if="!apiCompleted && rollingType === 'E'">Finalizing your Investment Journey...</span>
        <span v-else-if="rollingType === 'F'" class="completion-text">✅ Five Year Journey Ready! Quotes will finish in a moment...</span>
        <span v-else-if="rollingType === 'E'" class="completion-text">✅ Journey Finalized! Quotes will finish in a moment...</span>
        <span v-else class="completion-text">✅ Journey Ready! Quotes will finish in a moment...</span>
      </div>
    </div>

    <!-- Vivekam Info Footer -->
    <div class="dialog-footer">
      <p class="footer-text">Trusted by investors since 2010 • Data-driven • Rule-based</p>
    </div>
  </div>
</div>

<!-- Exit Confirmation Dialog -->
<div v-if="showExitDialog" class="exit-dialog-overlay">
  <div class="exit-dialog-background"></div>
  <div class="exit-dialog-container">
    <!-- Exit Icon -->
    <div class="exit-dialog-header">
      <div class="exit-icon">🚪</div>
      <h2 class="exit-title">Exit Investment Journey?</h2>
      <p class="exit-subtitle">Are you sure you want to leave?</p>
    </div>

    <!-- Exit Message -->
    <div class="exit-message-container">
      <div class="exit-warning-icon">⚠️</div>
      <div class="exit-message">
        <p class="exit-main-text">Your current journey progress will be lost.</p>
        <p class="exit-sub-text">You can always start a new journey anytime!</p>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="exit-actions">
      <button class="exit-btn cancel-btn" @click="cancelExit">
        <span class="btn-icon">↩️</span>
        <span class="btn-text">Stay & Continue</span>
      </button>
      <button class="exit-btn confirm-btn" @click="confirmExit">
        <span class="btn-icon">👋</span>
        <span class="btn-text">Yes, Exit Journey</span>
      </button>
    </div>

    <!-- Footer -->
    <div class="exit-dialog-footer">
      <p class="footer-note">Thank you for using Vivekam Investment Journey!</p>
    </div>
  </div>
</div>

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
      
      <!-- Left Side: Performance Metrics Toolbar + Three Portfolio Tiles + Timeline + Chart -->
      <div class="right-pane">
        <!-- Performance Toolbar -->
        <div class="performance-toolbar">
          <!-- Capital Gains -->
          <div class="performance-metric-card capital-gains-metric">
            <div class="metric-icon">💰</div>
            <div class="metric-content">
              <div class="metric-label">Capital Gains</div>
              <div :class="['metric-value', (currentDay?.CapitalGains || 0) >= 0 ? 'positive' : 'negative']">
                ₹{{ formatAmount(currentDay?.CapitalGains || 0) }}
              </div>
              <div class="metric-visual">
                <div class="progress-bar">
                  <div 
                    :class="['progress-fill', (currentDay?.CapitalGains || 0) >= 0 ? 'capital-gains-positive-fill' : 'capital-gains-negative-fill']" 
                    :style="{ width: Math.min(Math.abs((currentDay?.CapitalGains || 0) / 1000) * 100, 100) + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Dividends -->
          <div class="performance-metric-card dividend-metric">
            <div class="metric-icon">💵</div>
            <div class="metric-content">
              <div class="metric-label">Dividends</div>
              <div class="metric-value positive">
                ₹{{ formatAmount(currentDay?.DividendReceived || 0) }}
              </div>
              <div class="metric-visual">
                <div class="progress-bar">
                  <div 
                    class="progress-fill dividend-fill" 
                    :style="{ width: Math.min(Math.abs((currentDay?.DividendReceived || 0) / 500) * 100, 100) + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Index Return -->
          <div class="performance-metric-card index-return-metric">
            <div class="metric-icon">📊</div>
            <div class="metric-content">
              <div class="metric-label">Index Return</div>
              <div :class="['metric-value', (currentDay?.IndexReturn || 0) >= 0 ? 'positive' : 'negative']">
                {{ (currentDay?.IndexReturn || 0) >= 0 ? '+' : '' }}{{ (currentDay?.IndexReturn || 0).toFixed(2) }}
              </div>
              <div class="metric-visual">
                <div class="progress-bar">
                  <div 
                    :class="['progress-fill', (currentDay?.IndexReturn || 0) >= 0 ? 'index-positive-fill' : 'index-negative-fill']" 
                    :style="{ width: Math.abs((currentDay?.IndexReturn || 0))}"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Portfolio Return -->
          <div class="performance-metric-card portfolio-return-metric">
            <div class="metric-icon">📈</div>
            <div class="metric-content">
              <div class="metric-label">Portfolio Return</div>
              <div :class="['metric-value', (currentDay?.PortfolioReturn || 0) >= 0 ? 'positive' : 'negative']">
                {{ (currentDay?.PortfolioReturn || 0) >= 0 ? '+' : '' }}{{ (currentDay?.PortfolioReturn || 0).toFixed(2) }}
              </div>
              <div class="metric-visual">
                <div class="progress-bar">
                  <div 
                    :class="['progress-fill', (currentDay?.PortfolioReturn || 0) >= 0 ? 'portfolio-positive-fill' : 'portfolio-negative-fill']" 
                    :style="{ width: Math.abs((currentDay?.PortfolioReturn || 0)) }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Three Portfolio Tiles - Enhanced with unitone colors -->
        <div class="three-panel-layout-right">
          
          <!-- Start/Previous Portfolio -->
          <div class="portfolio-panel start-portfolio">
            <div class="portfolio-bg-pattern start-pattern"></div>
            <div class="panel-header-combined">
              <div class="combined-title-row">
                <h3 class="panel-title-main">{{ formatDateShort(startDisplayDate) }} HOLDINGS</h3>
                        <span class="count-badge stocks-count">
                  <span class="count-icon">📊</span>
                      <span class="count-text">{{ startDisplayStocks.length }}</span>
                  </span>
                <span class="panel-badge">{{ isManualSelection ? 'PREVIOUS' : 'START' }}</span>
              </div>
            </div>
            <div class="panel-content">
              <div v-if="startDisplayStocks.length > 0" class="stock-holdings">
                <!-- Column Headers -->
                <div class="holdings-header">
                  <span class="header-symbol">STOCK</span>
                  <span class="header-quantity">QTY</span>
                  <span class="header-value">VALUE</span>
                </div>
                
                <div 
                  v-for="(stock, index) in paginatedStartStocks" 
                  :key="stock.symbol"
                  class="stock-line"
                >
                  <span class="stock-symbol">{{ stock.symbol }}</span>
                  <span class="stock-quantity">{{ stock.quantity}}</span>
                  <span class="stock-value">₹{{ formatAmount(stock.value) }}</span>
                </div>
              </div>

              <div v-else class="no-data-message">
                <div class="no-data-icon">📊</div>
                <div class="no-data-text">No portfolio data</div>
              </div>
              
              <div class="pagination-controls" v-if="startDisplayStocks.length > 4">
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
              
              <div v-if="startDisplayStocks.length > 0" class="total-line">
                <div class="portfolio-summary">
                  <div class="summary-item total-portfolio">
                    <span class="summary-label">Total</span>
                    <span class="summary-amount">₹{{ formatAmount(startDisplayValue) }}</span>
                  </div>
                  <div class="summary-item cash-component">
                    <span class="summary-label">Cash</span>
                    <span class="summary-amount cash-amount">₹{{ formatAmount(startDisplayCash) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Enhanced Current Day Events with Compact Single Row -->
          <div class="portfolio-panel current-snapshot">
            <div class="portfolio-bg-pattern current-pattern"></div>
            <div class="panel-header-combined">
              <div class="combined-title-row">
                <h3 class="panel-title-main">{{ formatDateShort(eventsDisplayDay?.date) }} EVENTS</h3>
                        <span class="count-badge events-count">
                <span class="count-icon">💱</span>
                <span class="count-text">{{ eventsDisplayDay?.events?.length || 0 }}</span>
              </span>               
                <span class="panel-badge">{{ isManualSelection ? 'SELECTED' : (showFinalResults ? 'FINAL' : 'CURRENT') }}</span>
              </div>
            </div>
            <div class="panel-content">
              <div v-if="eventsDisplayDay?.events?.length > 0" class="current-events-list">
                <div 
                  v-for="(event, index) in paginatedCurrentEvents" 
                  :key="index"
                  :class="['event-line-enhanced', event.type.toLowerCase()]"
                >
                  <!-- Event Info Row -->
                  <div class="event-info-row">
                    <span class="event-icon-compact">
                      {{ event.type === 'BUY' ? '📈' : event.type === 'SELL' ? '📉' : '💰' }}
                    </span>
                    <span class="event-type-compact">{{ event.type }}</span>
                    <span class="event-stock-compact">{{ event.stock || 'N/A' }}</span>
                    <span class="event-quantity-compact">{{ event.quantity || (event.amount ? '₹' + formatAmount(parseFloat(event.amount)) : 'N/A') }}</span>
                  </div>
                  
                  <!-- Price Data Row -->
                  <!-- Price Data Row -->
                  <div class="price-data-row">
                    <span class="price-item-compact high">H:₹{{ event.dayHigh || 'N/A' }}</span>
                    <span class="price-item-compact low">L:₹{{ event.dayLow || 'N/A' }}</span>
                    <span class="price-item-compact buy">T:₹{{ event.price || 'N/A' }}</span>
                  </div>
                </div>
              </div>

              <div v-else class="no-data-message">
                <div class="no-data-icon">📭</div>
                <div class="no-data-text">No trading activity</div>
              </div>
              
              <div class="pagination-controls" v-if="(eventsDisplayDay?.events || []).length > 3">
                <button 
                  class="page-btn" 
                  @click="prevEventsPage" 
                  :disabled="eventsPage === 0"
                >‹</button>
                <span class="page-indicator">{{ eventsPage + 1 }}/{{ Math.ceil((eventsDisplayDay?.events || []).length / 3) }}</span>
                <button 
                  class="page-btn" 
                  @click="nextEventsPage" 
                  :disabled="eventsPage >= Math.ceil((eventsDisplayDay?.events || []).length / 3) - 1"
                >›</button>
              </div>
              
              <div v-if="eventsDisplayDay?.events?.length > 0" class="events-summary">
                <span class="events-count">{{ eventsDisplayDay.events.length }} Events</span>
              </div>
            </div>
          </div>

          <!-- Final/Selected Portfolio -->
          <div class="portfolio-panel final-portfolio">
            <div class="portfolio-bg-pattern final-pattern"></div>
            <div class="panel-header-combined">
              <div class="combined-title-row">
                <h3 class="panel-title-main">{{ formatDateShort(finalDisplayDate) }} HOLDINGS</h3>
                        <span class="count-badge stocks-count">
                  <span class="count-icon">📈</span>
                  <span class="count-text">{{ finalDisplayStocks.length }}</span>
                </span>
                <span class="panel-badge">{{ isManualSelection ? 'SELECTED' : (showFinalResults ? 'FINAL' : 'CURRENT') }}</span>
              </div>
            </div>
            <div class="panel-content">
              <div v-if="finalDisplayStocks.length > 0" class="final-results">
                <!-- Column Headers -->
                <div class="holdings-header">
                  <span class="header-symbol">STOCK</span>
                  <span class="header-quantity">QTY</span>
                  <span class="header-value">VALUE</span>
                </div>
                
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
                
                <div class="pagination-controls" v-if="finalDisplayStocks.length > 4">
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
                  <div class="portfolio-summary">
                    <div class="summary-item total-portfolio">
                      <span class="summary-label">Total</span>
                      <span class="summary-amount">₹{{ formatAmount(finalDisplayValue) }}</span>
                    </div>

                    <div class="summary-item cash-component">
                      <span class="summary-label">Cash</span>
                      <span class="summary-amount cash-amount">₹{{ formatAmount(finalDisplayCash) }}</span>
                    </div>
                  </div>
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

        <!-- Stock Animation Layer -->
      <div class="stock-animation-layer" v-if="activeAnimations.length > 0">
        <div 
          v-for="animation in activeAnimations" 
          :key="animation.id"
          :class="['animated-stock-card', animation.type, animation.direction]"
          :style="animation.style"
        >
          <div class="stock-card-content">
            <div class="stock-symbol-anim">{{ animation.stock }}</div>
            <div class="stock-action-icon">{{ animation.icon }}</div>
            <div class="stock-quantity-anim">{{ animation.quantity }}</div>
            <div class="stock-price-anim">₹{{ formatAmount(animation.price) }}</div>
          </div>
          <div class="stock-card-glow"></div>
          <div class="stock-card-trail"></div>
        </div>
      </div>

        <!-- Gaming-Style Timeline Navigation - Beautiful gradient background -->
        <div class="gaming-timeline-navigation">
          <div class="timeline-header">
            <div class="timeline-title">
              <span class="timeline-icon">🎮</span>
              <span class="timeline-text">INVESTMENT QUEST</span>
            </div>
            <div class="timeline-status">
              <span v-if="isJourneyCompleting" class="status-text completion-status">
                🏁 Finalizing Journey... {{ Math.round(journeyProgress) }}%
              </span>
              <span v-else-if="showFinalResults" class="status-text completion-status">
                ✅ Journey Complete - {{ Math.round(journeyProgress) }}%
              </span>
              <span v-else class="status-text">
                Day {{ (currentDay?.day || 1) }} of {{ totalDays }} - {{ Math.round(journeyProgress) }}%
              </span>
              <div class="status-bar">
                <div 
                  class="status-fill" 
                  :class="{ 
                    'completion-fill': isJourneyCompleting,
                    'complete-fill': showFinalResults 
                  }"
                  :style="{ 
                    width: Math.min(Math.max(journeyProgress, 0), 100) + '%',
                    transition: 'width 0.15s linear'
                  }"
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

            <!-- Timeline Track with Pagination -->
            <div class="timeline-track">
              <div class="track-background"></div>
              <div 
                class="track-progress" 
                :style="{ 
                  width: Math.min(journeyProgress, 100) + '%',
                  transition: selectedDayIndex !== null ? 'width 0.1s linear' : 'width 0.2s linear'
                }"
              ></div>
                          
              <!-- Enhanced Timeline Nodes with Pagination -->
              <div class="timeline-nodes">
                <div 
                  v-for="(node, index) in paginatedUnifiedNodes" 
                  :key="'unified-' + node.type + '-' + node.date + '-' + timelineStartIndex"
                  :class="[
                    'timeline-node', 
                    node.type + '-node',
                    node.type === 'event' ? 'event-node' : '',
                    getNodeClass(node.day)
                  ]"
                  @click="handleDayClick(node.day, $event)"
                  @mouseenter="showDayTooltip($event, node.day)"
                  @mouseleave="hideDayTooltip"
                  :style="{ left: getUnifiedNodePosition(node, index) + '%' }"
                >
                  <div :class="['node-ring', node.type + '-ring']"></div>
                  <div :class="['node-core', node.type + '-core']">
                    <div class="node-date-multiline">
                      <span class="date-day-month">{{ formatTimelineDate(node.date).dayMonth }}</span>
                      <span class="date-year">{{ formatTimelineDate(node.date).year }}</span>
                    </div>
                  </div>
                  
                  <!-- Event Indicators (show for any node with events) -->
                  <div v-if="node.hasEvents" class="event-indicators">
                    <div 
                      v-for="(event, eventIndex) in node.events.slice(0, 3)" 
                      :key="eventIndex"
                      :class="['event-indicator', event.type.toLowerCase()]"
                    >
                      <div class="event-icon">
                        {{ event.type === 'BUY' ? '📈' : event.type === 'SELL' ? '📉' : '💰' }}
                      </div>
                      <div class="event-glow"></div>
                    </div>
                    <div v-if="node.events.length > 3" class="event-count-badge">
                      +{{ node.events.length - 3 }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Navigation -->
            <button 
              class="timeline-nav-control next-btn"
              @click="nextTimelineEvents"
              :disabled="!timelineNavInfo.hasNext"
              title="Next 20 Events"
            >
              <span class="nav-control-icon">⏩</span>
            </button>
            
            <button 
              class="timeline-nav-control last-btn"
              @click="goToLatestEvents"
              :disabled="!timelineNavInfo.hasNext"
              title="Latest Events"
            >
              <span class="nav-control-icon">⏭️</span>
            </button>
          </div>
        </div>

        <!-- Performance Chart Section -->
        <div class="performance-chart-section">
          <div class="chart-header-enhanced">
            <div class="chart-title-section">
              <h3 class="chart-title">📊 PERFORMANCE ANALYTICS</h3>
            </div>
            
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
          
          <!-- Enhanced Interactive Chart Container -->
          <div class="enhanced-chart-container">
            <div class="chart-background">
              <div class="grid-lines">
                <div v-for="i in 5" :key="i" class="grid-line horizontal" :style="{ top: (i * 20) + '%' }"></div>
                <div v-for="i in 10" :key="i" class="grid-line vertical" :style="{ left: (i * 10) + '%' }"></div>
              </div>
            </div>
            
            <canvas 
              ref="performanceChart" 
              class="performance-canvas"
              @mousemove="handleChartMouseMove"
              @mouseleave="hideChartTooltip"
            ></canvas>
            
            <!-- Chart Tooltip -->
<!-- Chart Tooltip -->
<div 
  v-if="chartTooltip.visible" 
  class="chart-tooltip"
  :style="{ left: chartTooltip.x + 'px', top: chartTooltip.y + 'px' }"
>
  <div class="tooltip-header-chart">
    <div class="tooltip-date-chart">{{ formatDateShort(chartTooltip.data?.date) }}</div>
    <div class="tooltip-day-chart">Day {{ chartTooltip.data?.day }}</div>
  </div>
  <div class="tooltip-content-chart">
    <div class="tooltip-row">
      <div class="tooltip-label">Portfolio Value</div>
      <div class="tooltip-value">₹{{ formatAmount(chartTooltip.data?.PortfolioValue || chartTooltip.data?.PortfolioValue || 0) }}</div>
    </div>
    <div class="tooltip-row">
      <div class="tooltip-label">Index Value</div>
      <div class="tooltip-value">{{ formatAmount(chartTooltip.data?.IndexValue || chartTooltip.data?.IndexPrice || 0) }}</div>
    </div>
    </div>
    </div>
    </div>
    </div>

      </div>
      
      <!-- Right Side: Enhanced Configuration with Dice Rolling (moved from left) -->
      <div class="left-pane">
        <!-- Enhanced Configuration Panel -->
        <div class="config-summary-panel">
          <div class="config-summary-header">
            <div class="summary-icon">⚙️</div>
            <h3 class="summary-title">Configuration</h3>
          </div>
          
          <!-- Configuration Details Grid -->
          <div class="config-details-grid">
            <div class="config-detail-item">
              <div class="detail-icon">📅</div>
              <div class="detail-content">
                <div class="detail-label">Start Date</div>
                <div class="detail-value">{{ formatDateShort(journeySetup.startDate) }}</div>
              </div>
            </div>
            
            <div class="config-detail-item">
              <div class="detail-icon">📦</div>
              <div class="detail-content">
                <div class="detail-label">Strategy</div>
                <div class="detail-value">{{ selectedProductName.split(' ')[0] }}</div>
              </div>
            </div>
            
            <div class="config-detail-item">
              <div class="detail-icon">💰</div>
              <div class="detail-content">
                <div class="detail-label">Investment</div>
                <div class="detail-value">₹{{ formatAmount(journeySetup.amount) }}</div>
              </div>
            </div>
            
            <div class="config-detail-item">
              <div class="detail-icon">📊</div>
              <div class="detail-content">
                <div class="detail-label">Portfolio Size</div>
                <div class="detail-value">{{ journeySetup.numberOfStocks }} stocks</div>
              </div>
            </div>
          </div>

          <!-- Dice Rolling Section -->
          <div class="dice-rolling-section">
            <span class="dice-section-header">
              <h4 class="dice-section-title"><span class="dice-icon">🎲</span>Extend Journey</h4>
              <p class="dice-section-subtitle">Roll dice to add more days</p>
            </span>
            <div class="dice-control-area">
              <div class="dice-display">
                <div 
                  class="dice-icon-enhanced" 
                  :class="{ 'rolling': isRolling }"
                  @click="rollDiceFromJourney"
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

                <!-- Roll Button -->
                <button 
                  class="roll-dice-btn"
                  @click="rollDiceFromJourney"
                  :disabled="isRolling"
                  :class="{ 'rolling': isRolling }"
                >
                  <span class="roll-btn-icon">🎲</span>
                  <span class="roll-btn-text">{{ isRolling ? 'ROLLING...' : 'ROLL' }}</span>
                </button>
              </div>

              <div class="dice-results-display">
                <div class="dice-results-header">
                  <span class="results-label">Recent Rolls</span>
                  <span class="total-rolls">{{ diceRollCount }} total</span>
                </div>
                
                <div class="roll-history">
                  <div 
                    v-for="(result, index) in visibleDiceRolls" 
                    :key="index"
                    class="roll-item"
                    :class="{ 'latest': index === visibleDiceRolls.length - 1 && diceRolls.length > 0 }"
                  >
                    {{ result }}
                  </div>
                  <div v-if="diceRolls.length === 0" class="no-rolls">
                    No rolls yet
                  </div>
                </div>
                
                <div class="total-days-display">
                  <span class="total-label">Current Journey:</span>
                  <span class="total-value">{{ totalDays }} days</span>
                </div>

                <!-- Add clarification text -->
                <div class="dice-info-text">
                  <span class="info-icon">ℹ️</span>
                  <span class="info-text">Journey uses latest roll: {{ diceRolls.length > 0 ? diceRolls[diceRolls.length - 1] : 0 }} × 5 days</span>
                </div>
              </div>

              <div class="journey-control-buttons">
                <div class="control-buttons-header">
                  <h5 class="control-title">Journey Options</h5>
                  <p class="control-subtitle">
                    {{ diceRollCount < 3 ? 'Available after 3 dice rolls' : 
                      !hasFiveYearTermCompleted ? 'Start with Five Year Term' : 'Choose your next action' }}
                  </p>
                </div>
          
                <div class="control-buttons-grid">
                  <button 
                    class="journey-control-btn five-year-btn"
                    @click="handleFiveYearTerm"
                    :disabled="diceRollCount < 3 || isRolling || isJourneyDataLoading"
                    :class="{ 
                      'enabled': diceRollCount >= 3 && !isJourneyDataLoading,
                      'loading': isJourneyDataLoading && rollingType === 'F'
                    }"
                  >
                    <span class="control-btn-icon">{{ isJourneyDataLoading && rollingType === 'F' ? '⏳' : '📅' }}</span>
                    <span class="control-btn-text">
                      {{ isJourneyDataLoading && rollingType === 'F' ? 'Processing...' : 'Five Year Term' }}
                    </span>
                    <span class="control-btn-subtitle">
                      {{ isJourneyDataLoading && rollingType === 'F' ? 'Please wait' : 'Long-term journey' }}
                    </span>
                  </button>
                  
                  <button 
                    class="journey-control-btn end-journey-btn-dice"
                    @click="handleEndJourney"
                    :disabled="diceRollCount < 3 || isRolling || isJourneyDataLoading || !hasFiveYearTermCompleted"
                    :class="{ 
                      'enabled': diceRollCount >= 3 && hasFiveYearTermCompleted && !isJourneyDataLoading,
                      'loading': isJourneyDataLoading && rollingType === 'E'
                    }"
                  >
                    <span class="control-btn-icon">{{ isJourneyDataLoading && rollingType === 'E' ? '⏳' : '🏁' }}</span>
                    <span class="control-btn-text">
                      {{ isJourneyDataLoading && rollingType === 'E' ? 'Ending...' : 'End Journey' }}
                    </span>
                    <span class="control-btn-subtitle">
                      {{ isJourneyDataLoading && rollingType === 'E' ? 'Please wait' : 
                        hasFiveYearTermCompleted ? 'Complete now' : 'Complete 5-year first' }}
                    </span>
                  </button>
                </div>

                <div v-if="diceRollCount < 3" class="unlock-message">
                  <span class="unlock-icon">🔒</span>
                  <span class="unlock-text">{{ 3 - diceRollCount }} more rolls to unlock options</span>
                </div>
                
                <div v-if="journeyError" class="error-message">
                  <span class="error-icon">⚠️</span>
                  <span class="error-text">{{ journeyError }}</span>
                </div>
              </div>
            </div>          
          </div>
        </div>

        <!-- Journey Actions Panel -->
        <div class="journey-actions-left-pane">
          <div class="actions-header">
            <h4 class="actions-title">Journey Controls</h4>
          </div>
          
          <div class="journey-actions-buttons">
            <button class="action-btn-left primary" @click="startNewJourney">
              <span class="btn-icon">🔄</span>
              <span class="btn-text">NEW JOURNEY</span>
            </button>
            <button class="action-btn-left secondary" @click="exitJourney">
              <span class="btn-icon">🏠</span>
              <span class="btn-text">EXIT GAME</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Combined Setup + Dice Phase - New Two Pane Layout -->
    <div v-if="currentPhase !== 'journey'" class="combined-setup-phase">
      <div class="combined-header">
        <div class="setup-icon">🎮</div>
        <h1 class="setup-title">Start Your Investment Journey</h1>
        <div class="setup-subtitle">Configure your adventure and roll the dice</div>
      </div>

      <div class="combined-content">
        <!-- Two Pane Layout for Setup -->
        <div class="two-pane-setup-layout">
          
          <!-- Left Pane: Configuration -->
          <div class="configuration-pane">
            <div class="config-pane-header">
              <div class="config-header-icon">⚙️</div>
              <h2 class="config-header-title">Configuration Setup</h2>
              <p class="config-header-subtitle">Set up your investment parameters</p>
            </div>

            <div class="config-form-sections">
              <!-- Journey Date Section -->
              <div class="config-form-section">
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
                    :min="minDate"
                    :max="maxDate"
                  />
                  <div class="date-hint">Select any date before {{ formatDate(maxDate) }}</div>
                </div>
              </div>

              <!-- Investment Amount Section -->
              <div class="config-form-section">
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

              <!-- Number of Stocks Section -->
              <div class="config-form-section">
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

              <!-- Investment Product Section -->
              <div class="config-form-section">
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
          </div>

          <!-- Right Pane: Dice Section -->
          <div class="dice-pane">
            <div class="dice-pane-header">
              <div class="dice-header-icon">🎲</div>
              <h2 class="dice-header-title">Roll for Journey Length</h2>
              <p class="dice-header-subtitle">Determine your investment timeline</p>
              <div v-if="currentPhase === 'dice'" class="dice-progress-bar">
                <div class="progress-label">Rolls: {{ diceRolls.length }} / {{ minRolls }}</div>
                <div class="progress-track">
                  <div class="progress-fill-dice" :style="{ width: (diceRolls.length / minRolls) * 100 + '%' }"></div>
                </div>
              </div>
            </div>

            <div class="dice-main-content">
              <!-- Dice Arena -->
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

                <!-- Roll Button -->
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
                    :disabled="isRolling"
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

              <!-- Results & Info Section -->
              <div class="dice-results-info">
                <div v-if="diceRolls.length > 0" class="results-display-enhanced">
                  <div class="results-header">
                    <h4>🎯 Roll Results</h4>
                  </div>
                  <div class="results-grid-enhanced">
                    <div 
                      v-for="(result, index) in visibleDiceRolls" 
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
                      <span>Unlimited rolls allowed</span>
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

          <!-- Journey Actions with End Journey Button -->

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
            <span class="stat-value-compact">{{ dayTooltip.day?.smartVestData?.IndexValue || dayTooltip.day?.portfolio?.indexValue?.toFixed(4) || 'N/A' }}</span>
          </div>
          <div class="stat-compact">
            <span class="stat-label-compact">Portfolio NAV</span>
            <span :class="['stat-value-compact', (dayTooltip.day?.smartVestData?.PortfolioNav || 1) >= 1 ? 'positive' : 'negative']">
              {{ (dayTooltip.day?.smartVestData?.PortfolioNav).toFixed(4) }}
            </span>
          </div>
          <div class="stat-compact">
            <span class="stat-label-compact">Index NAV</span>
            <span class="stat-value-compact neutral">{{ (dayTooltip.day?.smartVestData?.IndexNav).toFixed(4) }}</span>
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
      
      <!-- Trading Activity (if any) -->
      <div v-if="dayTooltip.day?.events?.length > 0" class="tooltip-trades-compact">
        <div class="section-title-compact">💱 Day Events ({{ dayTooltip.day.events.length }})</div>
           <div v-if="dayTooltip.day?.events?.length > 0" class="trades-list-compact">
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
          <div v-else class="no-events-message">
              <div class="no-events-icon">📭</div>
              <div class="no-events-text">No trading activity</div>
          </div>
    </div>
  </div>

</div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';;
const API_ENDPOINTS = {
  SMARTVEST_DATA: 'api/mobile/Getsmartvestdata'
};

const activeAnimations = ref([])
const animationCounter = ref(0)
const isAnimating = ref(false)

const animationConfig = {
  duration: 2000,
  buyColor: '#22c55e',
  sellColor: '#ef4444', 
  dividendColor: '#fbbf24',
}

// Add these new reactive variables
const showVivekamDialog = ref(false)
const currentQuoteIndex = ref(0)
const isQuoteCycling = ref(false)
const canCloseDialog = ref(false)
const quoteInterval = ref(null)
const apiCompleted = ref(false)
const showExitDialog = ref(false);

// Vivekam inspirational quotes
const fiveYearQuotes = ref([
  {
    text: "Investment is a science, not an art",
    subtitle: "Data-driven decisions lead to consistent results"
  },
  {
    text: "Long-term thinking yields extraordinary results",
    subtitle: "Five years of disciplined investing builds wealth"
  },
  {
    text: "87% of undervalued growth stocks appreciate by more than 10% in three months",
    subtitle: "Imagine the potential over five years"
  },
  {
    text: "Patience and discipline are the investor's best friends",
    subtitle: "Five-year journeys reveal the power of compounding"
  }
]);

const endJourneyQuotes = ref([
  {
    text: "Every journey teaches valuable lessons",
    subtitle: "Your investment experience is now complete"
  },
  {
    text: "Congratulations on completing your investment journey",
    subtitle: "Data-driven decisions have guided your path"
  },
  {
    text: "Success comes to those who stay disciplined",
    subtitle: "You've experienced the Vivekam way of investing"
  },
  {
    text: "The end of one journey is the beginning of another",
    subtitle: "Continue building wealth with proven strategies"
  }
]);

const startVivekamQuotes = () => {
  showVivekamDialog.value = true
  isQuoteCycling.value = true
  canCloseDialog.value = false
  apiCompleted.value = false
  currentQuoteIndex.value = 0
  
  // Choose quotes based on action type
  const quotesToUse = rollingType.value === 'F' ? fiveYearQuotes.value : 
                     rollingType.value === 'E' ? endJourneyQuotes.value : 
                     fiveYearQuotes.value;
  
  // Start quote cycling every 4 seconds
  quoteInterval.value = setInterval(() => {
    currentQuoteIndex.value = (currentQuoteIndex.value + 1) % quotesToUse.length
  }, 4000)
  
  console.log('🎭 Started Vivekam quotes cycling for', rollingType.value)
}

// Phase management
const currentPhase = ref('setup'); // 'setup', 'dice', 'journey'

// Chart reference and tooltip state
const performanceChart = ref(null);
let chartInstance = null;
let chartDataPoints = [];
const chartPadding = ref({ top: 20, right: 20, bottom: 40, left: 50 });
const diceRollCount = ref(1);

const rollingType = ref('S'); // Default to 'S' for normal rolling

// Timeline pagination state
const timelineEventPage = ref(0);
const eventsPerPage = ref(10);

// Chart tooltip state
const chartTooltip = ref({
  visible: false,
  x: 0,
  y: 0,
  data: null
});

// Timeline state
const timelineStartIndex = ref(0);

// Pagination state for stocks and events
const startStockPage = ref(0);
const eventsPage = ref(0);
const finalStockPage = ref(0);

// Selection state for timeline interaction
const selectedDayIndex = ref(null);
const isInitialEventsLocked = ref(false); // NEW: Flag to lock initial events display

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
  numberOfStocks: 10,
  rollingType: 'S' // Default to S
});

const minDate = computed(() => {
  return '2010-01-01';
});

// Make sure you also have the updated maxDate
const maxDate = computed(() => {
  const today = new Date();
  const fiveYearsAgo = new Date(today);
  fiveYearsAgo.setFullYear(today.getFullYear() - 5);
  return fiveYearsAgo.toISOString().split('T')[0];
});
// Timeline navigation info - using existing timelineStartIndex
const timelineNavInfo = computed(() => {
  const totalEvents = eventDaysOnly.value.length;
  const totalPages = Math.ceil(totalEvents / eventsPerPage.value);
  const currentPage = Math.floor(timelineStartIndex.value / eventsPerPage.value) + 1;
  
  return {
    totalEvents,
    totalPages,
    currentPage,
    hasNext: timelineStartIndex.value + eventsPerPage.value < totalEvents,
    hasPrev: timelineStartIndex.value > 0,
    showingStart: timelineStartIndex.value + 1,
    showingEnd: Math.min(timelineStartIndex.value + eventsPerPage.value, totalEvents)
  };
});

// Add this computed property after your existing computed properties
const chartAxisConfig = computed(() => {
  const currentRollingType = rollingType.value;
  const currentJourneyLength = journeyDays.value.length;
  
  // More explicit long-term detection
  const isLongTerm = (
    currentRollingType === 'F' || 
    currentRollingType === 'E' || 
    currentJourneyLength > 1000 // Changed from 250 to 1000 to be more specific
  );
  
  return {
    isLongTerm,
    labelType: isLongTerm ? 'years' : 'months',
    maxLabels: isLongTerm ? 6 : 8,
    labelInterval: isLongTerm 
      ? Math.max(1, Math.ceil(currentJourneyLength / 365 / 6)) * 365
      : Math.max(1, Math.ceil(currentJourneyLength / 30 / 8)) * 30
  };
});


const startDisplayCash = computed(() => {
  // PRIORITY 1: Manual selection - show previous day's cash
  if (selectedDayIndex.value !== null && selectedDayIndex.value > 0) {
    const prevDay = journeyDays.value[selectedDayIndex.value - 1];
    return prevDay?.portfolio?.cash || prevDay?.Cash || 0;
  }
  // PRIORITY 2: Final results - return 0
  if (showFinalResults.value && selectedDayIndex.value ) {
    return journeyDays.value[selectedDayIndex.value].Cash;
  }
  // PRIORITY 3: Default - return 0
  return journeyDays.value[0]?.Cash;
});

const handleFiveYearTerm = async () => {
  if (diceRollCount.value < 3 || isRolling.value || isJourneyDataLoading.value || isFullScreenLoading.value) return;
  
  console.log('🎯 Five Year Term button clicked - showing Vivekam quotes');
  
  // Show Vivekam quotes dialog instead of loading spinner
  startVivekamQuotes();
  
  // Set rolling type
  rollingType.value = 'F';
  autoProgressEnabled.value = false;
  
  try {
    await executeJourneyAction('Five Year Term');
    
    // API completed - enable close button
    enableDialogClose();
    
    // Force chart re-render
    await nextTick();
    console.log('🔄 Force re-rendering chart for 5-year data');
    
    if (performanceChart.value && journeyDays.value.length > 0) {
      initializeChart();
    }
    
    hasFiveYearTermCompleted.value = true;
    console.log('✅ Five Year Term completed');
    
  } catch (error) {
    console.error('Five Year Term failed:', error);
    rollingType.value = 'S';
    autoProgressEnabled.value = true;
    
    // Close dialog on error
    closeVivekamDialog();
    alert('Failed to process Five Year Term. Please try again.');
  }
};


// Paginated timeline events - using existing timelineStartIndex
// In the paginatedTimelineEvents computed property
const paginatedTimelineEvents = computed(() => {
  const events = eventDaysOnly.value;
  const startIndex = timelineStartIndex.value;
  const endIndex = startIndex + eventsPerPage.value;
  
  // Filter out start/end dates to prevent duplicates
  const filteredEvents = events.filter(day => {
    const dayDate = day.date;
    return dayDate !== apiStartDate.value && dayDate !== apiEndDate.value;
  });
  
  return filteredEvents.slice(startIndex, endIndex);
});

const unifiedTimelineNodes = computed(() => {
  if (journeyDays.value.length === 0) return [];
  
  const nodes = [];
  
  // Add start node
  const startDay = journeyDays.value[0];
  nodes.push({
    type: 'start',
    date: apiStartDate.value,
    day: startDay,
    events: startDay.events || [],
    hasEvents: (startDay.events || []).length > 0
  });
  
  // Add event nodes (excluding start/end dates)
  eventDaysOnly.value.forEach(day => {
    if (day.date !== apiStartDate.value && day.date !== apiEndDate.value) {
      nodes.push({
        type: 'event',
        date: day.date,
        day: day,
        events: day.events || [],
        hasEvents: true
      });
    }
  });
  
  // Add end node (only if different from start)
  if (journeyDays.value.length > 1) {
    const endDay = journeyDays.value[journeyDays.value.length - 1];
    if (endDay.date !== apiStartDate.value) {
      nodes.push({
        type: 'end',
        date: apiEndDate.value,
        day: endDay,
        events: endDay.events || [],
        hasEvents: (endDay.events || []).length > 0
      });
    }
  }
  
  return nodes;
});

const getUnifiedNodePosition = (node, index) => {
  if (node.type === 'start') return 0;
  if (node.type === 'end') return 100;
  
  // For event nodes, calculate position among visible events
  const eventNodes = paginatedUnifiedNodes.value.filter(n => n.type === 'event');
  const eventIndex = eventNodes.findIndex(n => n.date === node.date);
  
  if (eventNodes.length === 0) return 50;
  if (eventNodes.length === 1) return 50;
  
  // Distribute evenly between 15% and 85%
  const availableSpace = 70; // 85% - 15%
  const startPosition = 15;
  const spacing = availableSpace / (eventNodes.length + 1);
  
  return startPosition + (spacing * (eventIndex + 1));
};

const paginatedUnifiedNodes = computed(() => {
  const allNodes = unifiedTimelineNodes.value;
  const eventNodes = allNodes.filter(node => node.type === 'event');
  
  const startIndex = timelineStartIndex.value;
  const endIndex = startIndex + eventsPerPage.value;
  const paginatedEvents = eventNodes.slice(startIndex, endIndex);
  
  // Always include start and end nodes
  const result = [];
  
  // Add start node
  const startNode = allNodes.find(node => node.type === 'start');
  if (startNode) result.push(startNode);
  
  // Add paginated event nodes
  result.push(...paginatedEvents);
  
  // Add end node
  const endNode = allNodes.find(node => node.type === 'end');
  if (endNode) result.push(endNode);
  
  return result;
});

const getPaginatedEventNodePosition = (day, index) => {
  const totalVisible = paginatedTimelineEvents.value.length;
  if (totalVisible === 0) return 50;
  if (totalVisible === 1) return 50;
  
  // Increased spacing with 10 max events
  const availableSpace = 80; // 90% - 10% = 80% (more space)
  const startPosition = 10; // Start closer to left
  
  if (totalVisible === 1) {
    return 50;
  }
  
  // Better spacing calculation for max 10 events
  const spacing = availableSpace / (totalVisible + 1);
  return startPosition + (spacing * (index + 1));
};

const nextTimelineEvents = () => {
  const maxStart = Math.max(0, eventDaysOnly.value.length - eventsPerPage.value);
  if (timelineStartIndex.value < maxStart) {
    timelineStartIndex.value = Math.min(
      timelineStartIndex.value + eventsPerPage.value,
      maxStart
    );
  }
};

const prevTimelineEvents = () => {
  if (timelineStartIndex.value > 0) {
    timelineStartIndex.value = Math.max(
      0,
      timelineStartIndex.value - eventsPerPage.value
    );
  }
};

const goToLatestEvents = () => {
  const maxStart = Math.max(0, eventDaysOnly.value.length - eventsPerPage.value);
  timelineStartIndex.value = maxStart;
};

const goToFirstEvents = () => {
  timelineStartIndex.value = 0;
};

const handleEndJourney = async () => {
  if (diceRollCount.value < 3 || isRolling.value || isJourneyDataLoading.value || !hasFiveYearTermCompleted.value || isFullScreenLoading.value) return;
  
  console.log('🏁 End Journey button clicked - showing Vivekam quotes');
  
  // Show Vivekam quotes dialog instead of loading spinner
  startVivekamQuotes();
  
  // Set rolling type
  rollingType.value = 'E';
  autoProgressEnabled.value = false;
  
  try {
    await executeJourneyAction('End Journey');
    
    // API completed - enable close button
    enableDialogClose();
    
    // Force chart re-render
    await nextTick();
    console.log('🔄 Force re-rendering chart for end journey');
    
    if (performanceChart.value && journeyDays.value.length > 0) {
      initializeChart();
    }
    
    console.log('✅ End Journey completed');
    
  } catch (error) {
    console.error('End Journey failed:', error);
    rollingType.value = 'S';
    autoProgressEnabled.value = true;
    
    // Close dialog on error
    closeVivekamDialog();
    alert('Failed to end journey. Please try again.');
  }
};


// Execute journey action with rolling type
const executeJourneyAction = async (actionType) => {
  console.log(`🎯 Executing ${actionType} with rollingType: ${rollingType.value}`);
  
  // Stop current auto-progression
  stopAutoProgression();
  
  // Show loading state
  isJourneyDataLoading.value = true;
  journeyError.value = null;
  
  try {
    // Generate journey data with specific rolling type
    await generateJourneyData();
    
    // Wait for next tick to ensure data is updated
    await nextTick();
    
    console.log(`✅ ${actionType} data received, journey days:`, journeyDays.value.length);
    
    // Handle the response based on action type
    if (rollingType.value === 'E') {
      // For End Journey, show final results after data is loaded
      console.log('🏁 Processing End Journey - showing final results');
      handleInstantCompletion();
      
    } else if (rollingType.value === 'F') {
      // For Five Year Term, complete instantly - no auto-progression
      console.log('📅 Processing Five Year Term - completing instantly');
      handleInstantCompletion();
    }
    
  } catch (error) {
    console.error(`❌ Error executing ${actionType}:`, error);
    isJourneyDataLoading.value = false;
    journeyError.value = error.message || `Failed to execute ${actionType}`;
    alert(`Failed to execute ${actionType}. Please try again.`);
  }
};

// New method for instant completion
const handleInstantCompletion = () => {
  if (journeyDays.value.length === 0) {
    console.error('No journey data available for completion');
    isJourneyDataLoading.value = false;
    return;
  }
  
  // Set to final day immediately
  currentDayIndex.value = journeyDays.value.length - 1;
  selectedDayIndex.value = null;
  
  // Initialize timeline to show relevant events
  initializeTimelinePosition();
  
  // Update loading state
  isJourneyDataLoading.value = false;
  
  // Initialize chart with final data
  nextTick(() => {
    initializeChart();
    
    setTimeout(() => {
      endJourney();
    }, 500);
  });
  
  console.log('⚡ Journey completed instantly to final day:', journeyDays.value.length);
};

// Add this new computed property for better subtitle logic
const isManualSelection = computed(() => {
  return selectedDayIndex.value !== null && !isInitialEventsLocked.value;
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

// Computed property for visible dice rolls (last 10)
const visibleDiceRolls = computed(() => {
  return diceRolls.value.slice(-10);
});

// Journey data with portfolio ID tracking
const journeyDays = ref([]);
const currentDayIndex = ref(0);
const isJourneyDataLoading = ref(false);
const journeyError = ref(null);
const showFinalResults = ref(false);
const autoProgressEnabled = ref(true);
const progressInterval = ref(null);
const currentPortfolioId = ref("0"); // Track portfolio ID for subsequent API calls
const isJourneyCompleting = ref(false); // NEW: Track when journey is completing
const hasFiveYearTermCompleted = ref(false);
// Add full-screen loading state
const isFullScreenLoading = ref(false);
const loadingMessage = ref('');

const fetchSmartVestData = async (payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SMARTVEST_DATA}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'eyJndWVzdCI6dHJ1ZSwiZXhwIFvkmSmtVest2317'
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

// Enhanced API data mapping to utilize more fields
const mapApiDataToJourney = (apiData) => {
  const { DailyPortfolioDetails, SmartVestGraphData } = apiData;
  
  return DailyPortfolioDetails.map((dayData, index) => {
const date = dayData.TransactionDate.split('T')[0];
    const graphData = SmartVestGraphData[index];
    
    // Enhanced holdings mapping with individual stock performance
    const holdings = dayData.Holdings.map(holding => ({
      symbol: holding.Symbol || 'N/A',
      quantity: holding.Quantity,
      currentPrice: holding.CurrentPrice,
      avgPrice: holding.BuyPrice,
      value: holding.Quantity * holding.CurrentPrice,
      // NEW: Individual stock performance
      dayGainLoss: (holding.CurrentPrice - holding.BuyPrice) * holding.Quantity,
      dayGainLossPercent: ((holding.CurrentPrice - holding.BuyPrice) / holding.BuyPrice) * 100,
      allocation: ((holding.Quantity * holding.CurrentPrice) / dayData.PortfolioValue) * 100
    }));

    // Enhanced transactions with price range data
    const events = (dayData.Transactions || []).map(transaction => ({
      type: transaction.OrderType.toUpperCase(),
      stock: transaction.Symbol,
      quantity: transaction.Quantity,
      price: transaction.Price.toFixed(2),
      amount: (transaction.Quantity * transaction.Price).toFixed(2),
      // NEW: Utilize High/Low data for market context
      dayHigh: transaction.High,
      dayLow: transaction.Low,
      priceRange: transaction.High - transaction.Low,
      // Calculate if trade was near high/low
      tradePosition: ((transaction.Price - transaction.Low) / (transaction.High - transaction.Low)) * 100,
      // Add current price from holdings
      currentPrice: holdings.find(h => h.symbol === transaction.Symbol)?.currentPrice || transaction.Price
    }));

    // Calculate portfolio metrics
    const portfolioValue = dayData.PortfolioValue;
    const indexValue = graphData ? graphData.IndexValue : dayData.IndexPrice;
    const portfolioNav = graphData ? graphData.PortfolioNav : 1;
    const indexNav = graphData ? graphData.IndexNav : 1;
    console.log("indexNAvGraphdata", indexNav);
    
    // Calculate percentage changes based on NAV
    const portfolioPercentChange = ((portfolioNav - 1));
    const indexPercentChange = ((indexNav - 1));

    return {
      date: date,
      day: index + 1,
      
      // NEW: Add API fields directly at root level for toolbar access
      CapitalGains: dayData.CapitalGains,
      DividendReceived: dayData.DividendReceived,
      IndexReturn: dayData.IndexReturn,
      PortfolioReturn: dayData.PortfolioReturn,
      PortfolioValue: dayData.PortfolioValue,
      IndexPrice: dayData.IndexPrice,
      PortfolioId: dayData.PortfolioId,
      Cash: dayData.Cash,
      
      events: events,
      portfolio: {
        cash: dayData.Cash,
        totalValue: portfolioValue,
        pnl: dayData.CapitalGains,
        percentChange: portfolioPercentChange,
        niftyChange: indexPercentChange,
        indexValue: indexValue,
        holdings: holdings.sort((a, b) => b.value - a.value),
        
        // NEW: Additional portfolio insights
        portfolioId: dayData.PortfolioId,
        totalDividends: dayData.DividendReceived,
        capitalGains: dayData.CapitalGains,
        
        // NEW: Trading activity summary
        dayTradingVolume: events.reduce((sum, event) => sum + parseFloat(event.amount), 0),
        buyTransactions: events.filter(e => e.type === 'BUY').length,
        sellTransactions: events.filter(e => e.type === 'SELL').length,
        
        // NEW: Market volatility for the day
        marketVolatility: events.length > 0 ? 
          events.reduce((sum, event) => sum + event.priceRange, 0) / events.length : 0
      },
      metrics: {
        portfolioIRR: portfolioPercentChange * (365 / (index + 1)),
        niftyIRR: indexPercentChange * (365 / (index + 1)),
        dividends: dayData.DividendReceived,
        capitalGains: dayData.CapitalGains,
        sharpeRatio: portfolioPercentChange / Math.max(0.1, Math.sqrt(index + 1)),
        
        // NEW: API-provided returns for comparison
        apiPortfolioReturn: dayData.PortfolioReturn,
        apiIndexReturn: dayData.IndexReturn,
        
        // NEW: Performance attribution
        stockSelection: portfolioPercentChange - indexPercentChange,
        timing: events.length > 0 ? 
          events.reduce((sum, event) => sum + (100 - event.tradePosition), 0) / events.length : 50
      },
      smartVestData: graphData,
      
      // NEW: Market context data
      marketData: {
        indexPrice: dayData.IndexPrice,
        indexReturn: dayData.IndexReturn,
        portfolioReturn: dayData.PortfolioReturn,
        
        // NEW: Trading insights
        tradingIntensity: events.length,
        avgTradeSize: events.length > 0 ? 
          events.reduce((sum, event) => sum + parseFloat(event.amount), 0) / events.length : 0,
        
        // NEW: Trade efficiency analysis
        tradeEfficiency: events.length > 0 ? 
          events.reduce((sum, event) => sum + event.tradePosition, 0) / events.length : 50
      }
    };
  });
};

// Computed properties for tile display logic
const startDisplayTitle = computed(() => {
  // PRIORITY 1: Manual selection - show previous day number
  if (selectedDayIndex.value !== null && selectedDayIndex.value > 0) {
    return `DAY ${selectedDayIndex.value}`;
  }
  // PRIORITY 2 & 3: Final results or default - show START
  return 'START';
});

const startDisplayDate = computed(() => {
  // PRIORITY 1: Manual selection - show previous day's date
  if (selectedDayIndex.value !== null && selectedDayIndex.value > 0) {
    const prevDay = journeyDays.value[selectedDayIndex.value - 1];
    return prevDay?.date || journeySetup.value.startDate;
  }
  // PRIORITY 2: Final results - show start date
  if (showFinalResults.value) {
    return journeyDays.value[0].date || journeySetup.value.startDate;
  }
  // PRIORITY 3: Default - show start date
  return journeyDays.value[0].date ?? journeySetup.value.startDate;
});

const startDisplayStocks = computed(() => {
  if (showFinalResults.value) {
    // Show initial starting stocks
    if (journeyDays.value.length > 0 && journeyDays.value[0].portfolio?.holdings) {
      return journeyDays.value[0].portfolio.holdings.map(holding => ({
        symbol: holding.symbol,
        price: holding.avgPrice || holding.currentPrice,
        quantity: holding.quantity,
        value: holding.value
      }));
    }
    return [];
  }
  if (selectedDayIndex.value !== null && selectedDayIndex.value > 0) {
    // Show previous day's portfolio (one day before selected)
    const prevDay = journeyDays.value[selectedDayIndex.value - 1];
    return prevDay?.portfolio?.holdings || [];
  }
  // Show initial starting stocks
  if (journeyDays.value.length > 0 && journeyDays.value[0].portfolio?.holdings) {
    return journeyDays.value[0].portfolio.holdings.map(holding => ({
      symbol: holding.symbol,
      price: holding.avgPrice || holding.currentPrice,
      quantity: holding.quantity
    }));
  }
  return [];
});

const startDisplayValue = computed(() => {
  // PRIORITY 1: Manual selection - show previous day's value
  if (selectedDayIndex.value !== null && selectedDayIndex.value > 0) {
    const prevDay = journeyDays.value[selectedDayIndex.value - 1];
    return prevDay?.portfolio?.totalValue || prevDay?.smartVestData?.PortfolioValue || journeySetup.value.amount;
  }
  // PRIORITY 2: Final results - show initial amount
  if (showFinalResults.value) {
    return journeyDays.value[0]?.PortfolioValue ?? journeySetup.value.amount;
  }
  // PRIORITY 3: Default - show initial amount
  return journeySetup.value.amount;
});

// Fixed eventsDisplayDay computed property
const eventsDisplayDay = computed(() => {
  // PRIORITY 1: If user has manually selected a day, ALWAYS show that day's events
  if (selectedDayIndex.value !== null && journeyDays.value[selectedDayIndex.value]) {
    console.log('📅 Showing events for manually selected day:', selectedDayIndex.value + 1);
    return journeyDays.value[selectedDayIndex.value];
  }
  
  // PRIORITY 2: If initial events are locked (first load), show the locked day
  if (isInitialEventsLocked.value && journeyDays.value.length > 0) {
    // Find first day with events
    const firstDayWithEvents = journeyDays.value.find(day => day.events && day.events.length > 0);
    if (firstDayWithEvents) {
      console.log('🔒 Showing locked initial events for day:', firstDayWithEvents.day);
      return firstDayWithEvents;
    }
    // Fallback to first day if no events found
    console.log('🔒 No events found, showing first day');
    return journeyDays.value[0];
  }
  
  // PRIORITY 3: During final results AND no manual selection, show last day's events
  if (showFinalResults.value && journeyDays.value.length > 0 && selectedDayIndex.value === null) {
    console.log('🏁 Showing final results - last day events');
    return journeyDays.value[journeyDays.value.length - 1];
  }
  
  // PRIORITY 4: Default - show current day (during auto-progression)
  console.log('⏱️ Showing current day events:', currentDay.value?.day || 1);
  return currentDay.value;
});

// Fixed eventsDisplayTitle to match the same logic
const eventsDisplayTitle = computed(() => {
  // Use the same day that eventsDisplayDay returns
  const displayDay = eventsDisplayDay.value;
  if (!displayDay) return 'NO EVENTS';
  
  const dayEvents = displayDay.events?.length || 0;
  const dayNum = displayDay.day || 1;
  
  return dayEvents > 0 ? `DAY ${dayNum} EVENTS` : `DAY ${dayNum} - NO EVENTS`;
});

// Main animation trigger
const triggerStockAnimations = async (events) => {
  if (isAnimating.value) return;
  
  isAnimating.value = true;
  activeAnimations.value = [];
  
  console.log('🎬 Starting animations for', events.length, 'events');
  
  const buyEvents = events.filter(e => e.type === 'BUY');
  const sellEvents = events.filter(e => e.type === 'SELL');
  const dividendEvents = events.filter(e => e.type === 'DIVIDEND');
  
  // Animate in sequence
  await animateEventGroup(sellEvents, 'sell', 0);
  await animateEventGroup(buyEvents, 'buy', 300);
  await animateEventGroup(dividendEvents, 'dividend', 600);
  
  setTimeout(() => {
    activeAnimations.value = [];
    isAnimating.value = false;
  }, animationConfig.duration + 800);
};

const animateEventGroup = async (events, type, delay) => {
  if (events.length === 0) return;
  
  return new Promise((resolve) => {
    setTimeout(() => {
      events.forEach((event, index) => {
        setTimeout(() => {
          createStockAnimation(event, type, index);
        }, index * 250); // Increased from 150 to 250ms for slower staggering
      });
      setTimeout(resolve, events.length * 250);
    }, delay);
  });
};

const createStockAnimation = (event, type, index) => {
  const animationId = `anim-${animationCounter.value++}`;
  const panelPositions = getPanelPositions();
  
  const animation = {
    id: animationId,
    type: type,
    direction: type === 'buy' ? 'entering' : type === 'sell' ? 'exiting' : 'bouncing',
    stock: event.stock || 'STOCK',
    quantity: event.quantity || 0,
    price: event.price || 0,
    icon: type === 'buy' ? '📈' : type === 'sell' ? '📉' : '💰',
    style: getInitialAnimationStyle(type, index, panelPositions)
  };
  
  activeAnimations.value.push(animation);
  
  nextTick(() => {
    setTimeout(() => {
      updateAnimationStyle(animationId, type, panelPositions);
    }, 50);
  });
  
setTimeout(() => {
  const animIndex = activeAnimations.value.findIndex(a => a.id === animationId);
  if (animIndex > -1) {
    // If it's a sell animation, highlight the cash
    if (type === 'sell') {
      highlightCashOnSell();
    }
    activeAnimations.value.splice(animIndex, 1);
  }
}, animationConfig.duration);
};

const getPanelPositions = () => {
  const startPanel = document.querySelector('.start-portfolio');
  const currentPanel = document.querySelector('.current-snapshot');
  const finalPanel = document.querySelector('.final-portfolio');
  
  // Find cash component in final panel
  const finalCashElement = document.querySelector('.final-portfolio .cash-component') || 
                           document.querySelector('.final-portfolio .summary-item.cash-component') ||
                           document.querySelector('.final-portfolio .cash-amount');
  
  const getPosition = (element) => {
    if (!element) return { x: 0, y: 0 };
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  };
  
  const getFinalPanelPosition = () => {
    if (!finalPanel) return { x: 0, y: 0 };
    const rect = finalPanel.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.bottom - 60 // Position near bottom where cash is typically displayed
    };
  };
  
  return {
    start: getPosition(startPanel),
    current: getPosition(currentPanel),
    final: getPosition(finalPanel),
    finalCash: finalCashElement ? getPosition(finalCashElement) : getFinalPanelPosition(),
    viewport: { width: window.innerWidth, height: window.innerHeight }
  };
};

const getInitialAnimationStyle = (type, index, panelPositions) => {
  const staggerOffset = index * 60;
  let startX, startY, color;
  
  switch (type) {
    case 'buy':
      startX = -200;
      startY = panelPositions.final.y + (Math.random() - 0.5) * 100;
      color = animationConfig.buyColor;
      break;
    case 'sell':
      startX = panelPositions.start.x;
      startY = panelPositions.start.y + (Math.random() - 0.5) * 100;
      color = animationConfig.sellColor;
      break;
    case 'dividend':
      startX = panelPositions.current.x;
      startY = panelPositions.current.y;
      color = animationConfig.dividendColor;
      break;
    default:
      startX = panelPositions.current.x;
      startY = panelPositions.current.y;
      color = '#64748b';
  }
  
  return {
    position: 'fixed',
    left: startX + 'px',
    top: startY + staggerOffset + 'px',
    transform: 'translate(-50%, -50%) scale(0)',
    zIndex: 1000 + index,
    '--animation-color': color,
    '--animation-duration': animationConfig.duration + 'ms',
    pointerEvents: 'none'
  };
};

const updateAnimationStyle = (animationId, type, panelPositions) => {
  const animation = activeAnimations.value.find(a => a.id === animationId);
  if (!animation) return;
  
  let endX, endY, transform;
  
  switch (type) {
    case 'buy':
      endX = panelPositions.final.x;
      endY = panelPositions.final.y;
      transform = 'translate(-50%, -50%) scale(1)';
      break;
    case 'sell':
      // Animate to cash position in final panel
      endX = panelPositions.finalCash.x;
      endY = panelPositions.finalCash.y;
      transform = 'translate(-50%, -50%) scale(0.8)'; // Slightly smaller but still visible
      break;
    case 'dividend':
      endX = panelPositions.current.x + (Math.random() - 0.5) * 100;
      endY = panelPositions.current.y - 50;
      transform = 'translate(-50%, -50%) scale(1.2)';
      break;
    default:
      endX = panelPositions.current.x;
      endY = panelPositions.current.y;
      transform = 'translate(-50%, -50%) scale(1)';
  }
  
  animation.style = {
    ...animation.style,
    left: endX + 'px',
    top: endY + 'px',
    transform: transform,
    // Slower transition for better visibility
    transition: `all ${animationConfig.duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`
  };
};

const handleDayClick = async (day, event) => {
  console.log('🎯 User clicked on day:', day.day);
  
  event.stopPropagation();
  event.preventDefault();
  
  const currentTimelineStart = timelineStartIndex.value;
  
  selectedDayIndex.value = day.day - 1;
  currentDayIndex.value = day.day - 1;
  showFinalResults.value = false;
  isInitialEventsLocked.value = false;
  
  // Reset pagination
  eventsPage.value = 0;
  startStockPage.value = 0;
  finalStockPage.value = 0;
  timelineStartIndex.value = currentTimelineStart;
  
  if (autoProgressEnabled.value) {
    stopAutoProgression();
    autoProgressEnabled.value = false;
  }
  
  dayTooltip.value.visible = false;
  dayTooltip.value.isPinned = false;
  
  // 🎬 TRIGGER ANIMATIONS
  if (day.events && day.events.length > 0) {
    await triggerStockAnimations(day.events);
  }
};

const closeDayTooltip = () => {
  console.log('❌ Closing day tooltip');
  dayTooltip.value.visible = false;
  dayTooltip.value.isPinned = false;
};

const finalDisplayTitle = computed(() => {
  if (showFinalResults.value) {
    return 'FINAL';
  }
  if (selectedDayIndex.value !== null) {
    return `DAY ${selectedDayIndex.value + 1}`;
  }
  return `DAY ${currentDay.value?.day || 1}`;
});

const finalDisplayDate = computed(() => {
  // PRIORITY 1: Manual selection overrides everything
  if (selectedDayIndex.value !== null) {
    const selectedDay = journeyDays.value[selectedDayIndex.value];
    return selectedDay?.date || currentDay.value?.date;
  }
  // PRIORITY 2: Final results (only when no manual selection)
  if (showFinalResults.value && journeyDays.value.length > 0) {
    const finalDay = journeyDays.value[journeyDays.value.length - 1];
    return finalDay?.date || getFinalDate();
  }
  // PRIORITY 3: Current day
  return currentDay.value?.date || new Date().toISOString().split('T')[0];
});

// Final portfolio cash and components
const finalDisplayValue = computed(() => {
  // PRIORITY 1: Manual selection overrides everything
  if (selectedDayIndex.value !== null) {
    const selectedDay = journeyDays.value[selectedDayIndex.value];
    return selectedDay?.portfolio?.totalValue || selectedDay?.smartVestData?.PortfolioValue || 0;
  }
  // PRIORITY 2: Final results (only when no manual selection)
  if (showFinalResults.value && journeyDays.value.length > 0) {
    const finalDay = journeyDays.value[journeyDays.value.length - 1];
    return finalDay?.portfolio?.totalValue || finalDay?.smartVestData?.PortfolioValue || 0;
  }
  // PRIORITY 3: Current day
  return currentDay.value?.portfolio?.totalValue || currentDay.value?.smartVestData?.PortfolioValue || 0;
});

const finalDisplayCash = computed(() => {
  // PRIORITY 1: Manual selection overrides everything
  if (selectedDayIndex.value !== null) {
    const selectedDay = journeyDays.value[selectedDayIndex.value];
    return selectedDay?.portfolio?.cash || selectedDay?.Cash || 0;
  }
  // PRIORITY 2: Final results (only when no manual selection)
  if (showFinalResults.value && journeyDays.value.length > 0) {
    const finalDay = journeyDays.value[journeyDays.value.length - 1];
    return finalDay?.portfolio?.cash || finalDay?.Cash || 0;
  }
  // PRIORITY 3: Current day
  return currentDay.value?.portfolio?.cash || currentDay.value?.Cash || 0;
});

const finalDisplayStocks = computed(() => {
  // PRIORITY 1: Manual selection overrides everything
  if (selectedDayIndex.value !== null) {
    const selectedDay = journeyDays.value[selectedDayIndex.value];
    return selectedDay?.portfolio?.holdings || [];
  }
  // PRIORITY 2: Final results (only when no manual selection)
  if (showFinalResults.value && journeyDays.value.length > 0) {
    const finalDay = journeyDays.value[journeyDays.value.length - 1];
    return finalDay?.portfolio?.holdings || [];
  }
  // PRIORITY 3: Current day
  return currentDay.value?.portfolio?.holdings || [];
});

const finalDisplayPerformance = computed(() => {
  // PRIORITY 1: Manual selection overrides everything
  if (selectedDayIndex.value !== null) {
    const selectedDay = journeyDays.value[selectedDayIndex.value];
    return selectedDay?.portfolio?.percentChange || 0;
  }
  // PRIORITY 2: Final results (only when no manual selection)
  if (showFinalResults.value && journeyDays.value.length > 0) {
    const finalDay = journeyDays.value[journeyDays.value.length - 1];
    return finalDay?.portfolio?.percentChange || 0;
  }
  // PRIORITY 3: Current day
  return currentDay.value?.portfolio?.percentChange || 0;
});

// Computed properties
const isSetupComplete = computed(() => {
  const complete = journeySetup.value.startDate && 
         journeySetup.value.selectedProduct && 
         journeySetup.value.amount >= 10000 &&
         journeySetup.value.numberOfStocks >= 5 &&
         journeySetup.value.rollingType;
  
  if (complete && currentPhase.value === 'setup') {
    currentPhase.value = 'dice';
  }
  
  return complete;
});

const totalDays = computed(() => {
  if (diceRolls.value.length === 0) return 5; // Base 5 days if no rolls
  
  // Use only the latest dice roll value × 5, not the sum
  const latestRoll = diceRolls.value[diceRolls.value.length - 1];
  return latestRoll * 5;
});

const selectedProductName = computed(() => {
  const product = availableProducts.value.find(p => p.id === journeySetup.value.selectedProduct);
  return product ? product.name : '';
});

const currentDay = computed(() => {
  return journeyDays.value[currentDayIndex.value];
});

const journeyProgress = computed(() => {
  if (journeyDays.value.length === 0) return 0;
  
  // Use selectedDayIndex if manually selected, otherwise use currentDayIndex
  const activeIndex = selectedDayIndex.value !== null ? selectedDayIndex.value : currentDayIndex.value;
  const progress = ((activeIndex + 1) / journeyDays.value.length) * 100;
  
  // Ensure progress never goes backwards unless intentionally selected
  return Math.min(Math.max(progress, 0), 100);
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
const totalStartPages = computed(() => Math.ceil(startDisplayStocks.value.length / 4));
const totalFinalPages = computed(() => Math.ceil(finalDisplayStocks.value.length / 4));

const paginatedStartStocks = computed(() => {
  const start = startStockPage.value * 4;
  console.log("START STOCKS", startDisplayStocks.value);
  return startDisplayStocks.value.slice(start, start + 4);
});

const paginatedCurrentEvents = computed(() => {
  const events = eventsDisplayDay.value?.events || [];
  const start = eventsPage.value * 3;
  const result = events.slice(start, start + 3);
  
  console.log('📊 Events pagination:', {
    selectedDayIndex: selectedDayIndex.value,
    dayWithEvents: eventsDisplayDay.value?.day,
    totalEvents: events.length,
    currentPage: eventsPage.value,
    showingEvents: result.length,
    events: result
  });
  
  return result;
});

const paginatedFinalHoldings = computed(() => {
  const holdings = finalDisplayStocks.value;
  const start = finalStockPage.value * 4;
  return holdings.slice(start, start + 4);
});

// Filter days that have events
// Filter days that have events
const eventDaysOnly = computed(() => {
  return journeyDays.value.filter(day => day.events && day.events.length > 0);
});

// Calculate evenly distributed positions for event nodes to prevent overlap
const getEventNodePosition = (index, totalEventNodes) => {
  if (totalEventNodes === 0) return 50;
  if (totalEventNodes === 1) return 50;
  
  // Distribute evenly between 15% and 85% to leave space for start/end nodes
  const availableSpace = 70; // 85% - 15% = 70%
  const startPosition = 15;
  
  if (totalEventNodes === 1) {
    return 50; // Center single event
  }
  
  const spacing = availableSpace / (totalEventNodes + 1);
  return startPosition + (spacing * (index + 1));
};

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
  // Convert to number and round to nearest integer
  const numAmount = Math.round(Number(amount) || 0);
  
  // Return formatted number with commas for thousands
  return numAmount.toLocaleString('en-IN');
};

const formatCurrency = (value) => {
  return Math.abs(value).toLocaleString('en-IN');
};

const formatXAxisLabel = (date, labelType) => {
  if (!date) return ''
  
  const dateObj = new Date(date)
  
  if (labelType === 'years') {
    // For long-term: Just show year like "2024"
    return dateObj.getFullYear().toString()
  } else {
    // For short-term: Just show month like "Jan"
    return dateObj.toLocaleDateString('en-GB', {
      month: 'short'
    })
  }
}

const getXAxisLabels = () => {
  if (journeyDays.value.length === 0) return [];
  
  const isDefinitelyLongTerm = (
    rollingType.value === 'F' || 
    rollingType.value === 'E' || 
    journeyDays.value.length > 1000
  );
  
  const forcedLabelType = isDefinitelyLongTerm ? 'years' : 'months';
  
  console.log('🏷️ getXAxisLabels:');
  console.log('- rollingType:', rollingType.value);
  console.log('- journeyDays.length:', journeyDays.value.length);
  console.log('- labelType:', forcedLabelType);
  
  const labels = [];
  
  if (forcedLabelType === 'years') {
    // For years: Generate labels based on actual year changes
    const startDate = new Date(journeyDays.value[0].date);
    const endDate = new Date(journeyDays.value[journeyDays.value.length - 1].date);
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    
    console.log('📅 Year range:', startYear, 'to', endYear);
    
    // Always add start date
    labels.push({
      index: 0,
      date: journeyDays.value[0].date,
      label: formatXAxisLabel(journeyDays.value[0].date, forcedLabelType)
    });
    
    // Add labels for each year in between
    for (let year = startYear + 1; year <= endYear; year++) {
      // Find the first day in this year
      const yearStart = `${year}-01-01`;
      let closestIndex = 0;
      let closestDistance = Infinity;
      
      journeyDays.value.forEach((day, index) => {
        const dayDate = new Date(day.date);
        const targetDate = new Date(yearStart);
        const distance = Math.abs(dayDate.getTime() - targetDate.getTime());
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });
      
      // Only add if it's not too close to start or end
      if (closestIndex > 30 && closestIndex < journeyDays.value.length - 30) {
        labels.push({
          index: closestIndex,
          date: journeyDays.value[closestIndex].date,
          label: formatXAxisLabel(journeyDays.value[closestIndex].date, forcedLabelType)
        });
      }
    }
    
    // Always add end date if it's a different year
    const lastIndex = journeyDays.value.length - 1;
    if (endYear > startYear && labels[labels.length - 1].index !== lastIndex) {
      labels.push({
        index: lastIndex,
        date: journeyDays.value[lastIndex].date,
        label: formatXAxisLabel(journeyDays.value[lastIndex].date, forcedLabelType)
      });
    }
    
  } else {
    // For months: Use the existing logic but improved
    const config = chartAxisConfig.value;
    
    // Always include start date
    labels.push({
      index: 0,
      date: journeyDays.value[0].date,
      label: formatXAxisLabel(journeyDays.value[0].date, forcedLabelType)
    });
    
    // Calculate better interval for months
    const totalDays = journeyDays.value.length;
    const monthInterval = Math.max(30, Math.floor(totalDays / 6)); // Show roughly 6 labels
    
    // Add intermediate labels
    for (let i = monthInterval; i < journeyDays.value.length - monthInterval; i += monthInterval) {
      if (labels.length >= 7) break; // Max 8 labels total
      
      labels.push({
        index: i,
        date: journeyDays.value[i].date,
        label: formatXAxisLabel(journeyDays.value[i].date, forcedLabelType)
      });
    }
    
    // Always include end date if not already included
    const lastIndex = journeyDays.value.length - 1;
    if (labels[labels.length - 1].index !== lastIndex) {
      labels.push({
        index: lastIndex,
        date: journeyDays.value[lastIndex].date,
        label: formatXAxisLabel(journeyDays.value[lastIndex].date, forcedLabelType)
      });
    }
  }
  
  console.log('🏷️ Final labels generated:', labels.map(l => `${l.label} (index: ${l.index})`));
  return labels;
};

const highlightCashOnSell = () => {
  const cashElements = document.querySelectorAll('.final-portfolio .cash-amount, .final-portfolio .summary-amount.cash-amount');
  
  cashElements.forEach(element => {
    element.classList.add('highlight');
    
    // Remove highlight class after animation
    setTimeout(() => {
      element.classList.remove('highlight');
    }, 1000);
  });
};

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric' // Always show year
  });
};

const formatDateShort = (date) => {
  if (!date) return '';
  const dateObj = new Date(date);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleDateString('en-GB', { month: 'short' });
  const year = dateObj.getFullYear();
  
  // Add ordinal suffix (st, nd, rd, th)
  const getOrdinalSuffix = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };
  
  return `${getOrdinalSuffix(day)} ${month} ${year}`;
};

const formatTimelineDate = (date) => {
  if (!date) return '';
   
  // Handle date string to prevent timezone conversion
  let dateObj;
  
  if (typeof date === 'string') {
    // Split the date string and create date in local timezone
    const dateParts = date.split('-');
    if (dateParts.length === 3) {
      // Create date in local timezone (year, month-1, day)
      dateObj = new Date(
        parseInt(dateParts[0]), 
        parseInt(dateParts[1]) - 1, 
        parseInt(dateParts[2])
      );
    } else {
      // Fallback for other string formats
      dateObj = new Date(date);
    }
  } else {
    // Already a Date object
    dateObj = new Date(date);
  }  
 
  const result = {
    dayMonth: dateObj.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short'
    }),
    year: dateObj.getFullYear().toString()
  };
  
  return result;
};

const formatDayShort = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-GB', {
    month: 'short',
    day: 'numeric'
  });
};

const getFinalDate = () => {
  if (!journeySetup.value.startDate) return new Date().toISOString().split('T')[0];
  const startDate = new Date(journeySetup.value.startDate);
  startDate.setDate(startDate.getDate() + totalDays.value - 1);
  return startDate.toISOString().split('T')[0];
};

const apiStartDate = computed(() => {
  if (journeyDays.value.length === 0) {
    console.log('No journey data, using setup date:', journeySetup.value.startDate);
    return journeySetup.value.startDate;
  }
  
  // Extract all transaction dates and find the minimum (earliest)
  const allDates = journeyDays.value.map(day => {
    // TransactionDate format: "2019-12-02T00:00:00"
    // Convert to just date part: "2019-12-02"
    return day.date;
  }).filter(date => date); // Remove any null/undefined dates
  
  if (allDates.length === 0) {
    console.log('No valid dates found, using setup date');
    return journeySetup.value.startDate;
  }
  
  // Find the minimum date (earliest)
  const startDate = allDates.reduce((earliest, current) => {
    return current < earliest ? current : earliest;
  });  
 
  return startDate;
});

const apiEndDate = computed(() => {
  if (journeyDays.value.length === 0) {
    console.log('No journey data, using calculated end date');
    return getFinalDate();
  }
  
  // Extract all transaction dates and find the maximum (latest)
  const allDates = journeyDays.value.map(day => {
    // TransactionDate format: "2019-12-02T00:00:00"
    // Convert to just date part: "2019-12-02"
    return day.date;
  }).filter(date => date); // Remove any null/undefined dates
  
  if (allDates.length === 0) {
    console.log('No valid dates found, using calculated end date');
    return getFinalDate();
  }
  
  // Find the maximum date (latest)
  const endDate = allDates.reduce((latest, current) => {
    return current > latest ? current : latest;
  });  
 
  return endDate;
});

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
  
  if (dayTooltip.value.isPinned) return; // Don't show hover tooltip if one is pinned
  
  const rect = event.currentTarget.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Consistent tooltip sizing
  const tooltipWidth = Math.min(350, viewportWidth * 0.9);
  
  // Fixed height approach for consistency
  const minHeight = 280; // Minimum height
  const maxHeight = Math.min(450, viewportHeight * 0.75); // Maximum height
  
  // Use consistent height - not dynamic based on content
  const tooltipHeight = Math.max(minHeight, Math.min(maxHeight, 380));
  
  let x = rect.left + rect.width / 2 - tooltipWidth / 2;
  let y = rect.top - tooltipHeight - 15;
  
  // Ensure tooltip stays within viewport horizontally
  if (x < 10) {
    x = 10;
  } else if (x + tooltipWidth > viewportWidth - 10) {
    x = viewportWidth - tooltipWidth - 10;
  }
  
  // Consistent vertical positioning
  if (y < 10) {
    // Not enough space above, show below
    y = rect.bottom + 15;
    
    // If doesn't fit below, center it in viewport
    if (y + tooltipHeight > viewportHeight - 10) {
      y = Math.max(10, (viewportHeight - tooltipHeight) / 2);
    }
  }
  
  // Final check - ensure tooltip is fully visible
  if (y + tooltipHeight > viewportHeight - 10) {
    y = viewportHeight - tooltipHeight - 10;
  }
  
  if (y < 10) {
    y = 10;
  }
  
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
  if (!dayTooltip.value.isPinned) {
    dayTooltip.value.visible = false;
  }
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

const prevEventsPage = () => {
  if (eventsPage.value > 0) {
    eventsPage.value--;
  }
};

const nextEventsPage = () => {
  const totalPages = Math.ceil((eventsDisplayDay.value?.events || []).length / 3);
  if (eventsPage.value < totalPages - 1) {
    eventsPage.value++;
  }
};

const initializeTimelinePosition = () => {
  if (eventDaysOnly.value.length > eventsPerPage.value) {
    // For large datasets (like 5-year), start with latest events
    goToLatestEvents();
  } else {
    // For smaller datasets, start from beginning
    timelineStartIndex.value = 0;
  }
};

const stopVivekamQuotes = () => {
  if (quoteInterval.value) {
    clearInterval(quoteInterval.value)
    quoteInterval.value = null
  }
  isQuoteCycling.value = false
  console.log('🎭 Stopped Vivekam quotes cycling')
}

const enableDialogClose = () => {
  apiCompleted.value = true
  canCloseDialog.value = true
  console.log('✅ API completed - enabling dialog close')
  
  // Auto-close after current quote cycle finishes (wait for one more cycle)
  setTimeout(() => {
    if (showVivekamDialog.value && apiCompleted.value) {
      closeVivekamDialog()
    }
  }, 4500) // Wait for current quote + a bit more
}

const closeVivekamDialog = () => {
  console.log('🎭 Closing Vivekam dialog')
  stopVivekamQuotes()
  showVivekamDialog.value = false
  canCloseDialog.value = false
  apiCompleted.value = false
}

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
  if (isRolling.value || isFullScreenLoading.value) return;
  
  // Show full-screen loading
  isFullScreenLoading.value = true;
  loadingMessage.value = 'Rolling Dice & Starting Journey...';  

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
  }, 50);
  
  setTimeout(() => {
    clearInterval(rollInterval);
    
    const finalValues = activeDice.value.map(() => Math.floor(Math.random() * 6) + 1);
    const total = finalValues.reduce((sum, val) => sum + val, 0);
    
    activeDice.value.forEach((dice, index) => {
      dice.value = finalValues[index];
      dice.isRolling = false;
    });
    
    diceRolls.value.push(total);
    isRolling.value = false;
    
    // Hide loading after dice animation
    setTimeout(() => {
      isFullScreenLoading.value = false;
      loadingMessage.value = '';
      
      if (diceRolls.value.length === 1) {
        startInvestmentJourney();
      }
    }, 500);
  }, 1000);
};

const rollDiceFromJourney = async () => {
  if (isRolling.value || isFullScreenLoading.value) return;
  
  // Show full-screen loading
  isFullScreenLoading.value = true;
  loadingMessage.value = 'Rolling Dice & Extending Journey...';

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
    diceRollCount.value++;
    isRolling.value = false;
    
    // Update loading message
    loadingMessage.value = 'Generating Extended Journey Data...';
    
    // Store current progress
    const currentProgress = currentDayIndex.value;
    
    try {
      // Set rolling type to 'S' for normal dice rolling
      rollingType.value = 'S';
      
      // Regenerate journey data with extended days
      await generateJourneyData();
      
      // Restore current progress or continue from where we left off
      currentDayIndex.value = Math.min(currentProgress, journeyDays.value.length - 1);
      
      nextTick(() => {
        initializeChart();
        
        // Hide loading
        isFullScreenLoading.value = false;
        loadingMessage.value = '';
        
        // Restart auto-progression if it was enabled
        if (autoProgressEnabled.value && currentDayIndex.value < journeyDays.value.length - 1) {
          setTimeout(() => {
            startAutoProgression();
          }, 1000);
        }
      });
    } catch (error) {
      console.error('Error extending journey:', error);
      isFullScreenLoading.value = false;
      loadingMessage.value = '';
      alert('Failed to extend journey. Please try again.');
    }
  }, 1000);
};

const startInvestmentJourney = async () => {
  isJourneyDataLoading.value = true;
  journeyError.value = null;
  isJourneyCompleting.value = false;
  
  try {
    await generateJourneyData();
    
    if (journeyDays.value.length === 0) {
      throw new Error('No data received from API');
    }
    
    if (journeyDays.value.length > 0 && journeyDays.value[0].portfolio?.portfolioId) {
      currentPortfolioId.value = journeyDays.value[0].portfolio.portfolioId.toString();
      console.log('Portfolio ID set to:', currentPortfolioId.value);
    }
    
    // CRITICAL: Start with the first day and show progress immediately
    currentDayIndex.value = 0;
    selectedDayIndex.value = null;
    
    // Lock events to show first day with events initially
    isInitialEventsLocked.value = true;
    
    const firstDayWithEvents = journeyDays.value.find(day => day.events && day.events.length > 0);
    console.log('🎯 Initially locking events display to:', firstDayWithEvents ? `Day ${firstDayWithEvents.day}` : 'Day 1 (no events)');
    
    currentPhase.value = 'journey';
    
    nextTick(() => {
      setTimeout(() => {
        initializeChart();
        isJourneyDataLoading.value = false;
        
        // CRITICAL: Start auto-progression immediately, no delay
        console.log('🚀 Starting auto-progression immediately');
        autoProgressEnabled.value = true;
        startAutoProgression();
      },100)
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
      // Ensure smooth progression without pauses
      currentDayIndex.value++;
      
      // Force progress bar update
      nextTick(() => {
        // Trigger reactivity for progress calculation
        const progress = ((currentDayIndex.value + 1) / journeyDays.value.length) * 100;
        console.log('📊 Progress updated to:', progress.toFixed(1) + '%');
      });
    } else {
      console.log('🎯 Auto-progression reached end, entering completion phase...');
      stopAutoProgression();
      isJourneyCompleting.value = true;
      
      setTimeout(() => {
        endJourney();
      }, 1500);
    }
  },100)//Faster interval for smoother progression
};

const stopAutoProgression = () => {
  if (progressInterval.value) {
    clearInterval(progressInterval.value);
    progressInterval.value = null;
  }
};
const generateJourneyData = async () => {
  try {
    // Calculate days based on rolling type
    let daysToProcess;
    
    if (rollingType.value === 'F') {
      daysToProcess = '1250'; // 5 years of trading days
    } else if (rollingType.value === 'E') {
      daysToProcess = Math.max(totalDays.value, 30).toString();
    } else {
      // For normal dice rolling, use only the latest dice value
      const latestDiceValue = diceRolls.value.length > 0 ? 
        diceRolls.value[diceRolls.value.length - 1] : 5; // Default to 5 if no rolls
      daysToProcess = (latestDiceValue * 5).toString(); // Latest dice × 5
    }
    
    // Prepare API payload
    const payload = {
      portfolioId: currentPortfolioId.value,
      Product: journeySetup.value.selectedProduct,
      investment: journeySetup.value.amount.toString(),
      DaysToProceed: daysToProcess,
      numberOfStocks: journeySetup.value.numberOfStocks.toString(),
      Startdate: journeySetup.value.startDate,
      investmentType: journeySetup.value.investmentType,
      rollingType: rollingType.value
    };

    console.log('🚀 API Payload (using latest dice value):', {
      ...payload,
      latestDiceValue: diceRolls.value[diceRolls.value.length - 1],
      totalDiceRolls: diceRolls.value.length
    });

    // Fetch data from API
    const apiData = await fetchSmartVestData(payload);
    
    if (!apiData || !apiData.DailyPortfolioDetails) {
      throw new Error('Invalid API response - missing portfolio data');
    }
    
    // Map API data to journey structure
    const newJourneyData = mapApiDataToJourney(apiData);
    
    if (newJourneyData.length === 0) {
      throw new Error('No journey data received from API');
    }
    
    // Update journey data
    journeyDays.value = newJourneyData;
    
    // Update portfolio ID if provided
    if (newJourneyData.length > 0 && newJourneyData[0].portfolio?.portfolioId) {
      currentPortfolioId.value = newJourneyData[0].portfolio.portfolioId.toString();
    }
    
    console.log('✅ Journey Data Successfully Loaded:', {
      totalDays: journeyDays.value.length,
      rollingType: rollingType.value,
      portfolioId: currentPortfolioId.value
    });
    
  } catch (error) {
    console.error('❌ Error generating journey data:', error);
    throw error;
  }
};

const handleChartMouseMove = (event) => {
  console.log('🖱️ Mouse move detected on chart');
  
  if (!chartDataPoints || chartDataPoints.length === 0) {
    console.log('❌ No chart data points available');
    return;
  }
  
 
  const rect = performanceChart.value.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  
 
  // Use the reactive padding values
  const padding = chartPadding.value;
  
  // Check if mouse is within chart bounds
  const chartArea = {
    left: padding.left,
    right: rect.width - padding.right,
    top: padding.top,
    bottom: rect.height - padding.bottom
  };
  
 
  if (mouseX < chartArea.left || mouseX > chartArea.right ||
      mouseY < chartArea.top || mouseY > chartArea.bottom) {
    chartTooltip.value.visible = false;
    return;
  }
  
  
  // Calculate which data point is closest to mouse X position
  const relativeX = mouseX - padding.left;
  const chartWidth = chartArea.right - chartArea.left;
  const percentage = relativeX / chartWidth;
  const dataIndex = Math.round(percentage * (chartDataPoints.length - 1));
  const clampedIndex = Math.max(0, Math.min(dataIndex, chartDataPoints.length - 1));
  
  
  const closestPoint = chartDataPoints[clampedIndex];
  
  if (closestPoint && closestPoint.data) {
    console.log('✅ Valid data point found, showing tooltip', closestPoint.data);
    
    // Tooltip positioning
    let tooltipX = mouseX + 15;
    let tooltipY = mouseY - 50;
    
    // Keep tooltip within bounds
    const tooltipWidth = 200;
    const tooltipHeight = 150;
    
    if (tooltipX + tooltipWidth > rect.width - 10) {
      tooltipX = mouseX - tooltipWidth - 15;
    }
    
    if (tooltipY < 10) {
      tooltipY = mouseY + 15;
    }
    
    if (tooltipY + tooltipHeight > rect.height - 10) {
      tooltipY = rect.height - tooltipHeight - 10;
    }
    
    chartTooltip.value = {
      visible: true,
      x: tooltipX,
      y: tooltipY,
      data: closestPoint.data
    };

    console.log('ToolTipData', chartTooltip.value);
    
  } else {
    chartTooltip.value.visible = false;
  }
};

// Add this computed property or method
const getCurrentQuotes = () => {
  if (rollingType.value === 'F') {
    return fiveYearQuotes.value;
  } else if (rollingType.value === 'E') {
    return endJourneyQuotes.value;
  } else {
    return fiveYearQuotes.value;
  }
};

const initializeChart = () => {
  const ctx = performanceChart.value?.getContext('2d');
  if (!ctx || !journeyDays.value.length) return;
  
  const canvas = performanceChart.value;
  const width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
  const height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
  canvas.style.width = 100 + '%';
  canvas.style.height = canvas.offsetHeight + 'px';
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  
  // Use SmartVestGraphData for chart - NAV values
  const smartVestData = journeyDays.value.filter(day => day.smartVestData);
  
  if (smartVestData.length === 0) {
    console.warn('No SmartVestGraphData available for chart');
    return;
  }
  
  // Extract NAV data from SmartVestGraphData
  const portfolioNavData = smartVestData.map(day => (day.smartVestData.PortfolioNav - 1) * 100);
  const indexNavData = smartVestData.map(day => (day.smartVestData.IndexNav - 1) * 100);
 
  // Initialize chartDataPoints array
  chartDataPoints = smartVestData.map((day, index) => ({
    index,
    data: day,
    x: 0,
    y: 0,
    indexY: 0
  }));
  
  ctx.clearRect(0, 0, width, height);
  
  const chartWidth = canvas.offsetWidth;
  const chartHeight = canvas.offsetHeight;
  const padding = chartPadding.value;
  const graphWidth = chartWidth - padding.left - padding.right;
  const graphHeight = chartHeight - padding.top - padding.bottom;
  
  const allData = [...portfolioNavData, ...indexNavData];
  const maxValue = Math.max(...allData, 2);
  const minValue = Math.min(...allData, -2);
  const range = maxValue - minValue;
  
  // Draw horizontal grid lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 0.5;
  
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (i * graphHeight / 4);
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(chartWidth - padding.right, y);
    ctx.stroke();
  }
  
  // Generate X-axis labels
  const xAxisLabels = getXAxisLabels();
  
  // Draw vertical grid lines
  xAxisLabels.forEach(labelData => {
    const x = padding.left + (labelData.index * graphWidth / Math.max(1, smartVestData.length - 1));
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(x, padding.top);
    ctx.lineTo(x, chartHeight - padding.bottom);
    ctx.stroke();
  });
  
  // Draw zero line
  if (minValue < 0 && maxValue > 0) {
    const zeroY = padding.top + ((maxValue - 0) / range * graphHeight);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding.left, zeroY);
    ctx.lineTo(chartWidth - padding.right, zeroY);
    ctx.stroke();
  }  
 
  // Draw X-axis labels
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.font = chartAxisConfig.value.isLongTerm ? '12px Arial' : '11px Arial';
  ctx.fontWeight = 'bold'; 
    
  xAxisLabels.forEach(labelData => {
    const x = padding.left + (labelData.index * graphWidth / Math.max(1, smartVestData.length - 1));
    const y = chartHeight - padding.bottom + 8;
    
    // Draw tick mark
    ctx.strokeStyle = 'rgba(13, 71, 161, 0.6)'; // Blue tick marks
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, chartHeight - padding.bottom);
    ctx.lineTo(x, chartHeight - padding.bottom + 6);
    ctx.stroke();
    
    // Draw label with better visibility
    ctx.fillStyle = '#0d47a1'; // Dark blue color
    ctx.strokeStyle = '#ffffff'; // White outline for better contrast
    ctx.lineWidth = 3;
    ctx.strokeText(labelData.label, x, y); // Draw outline first
    ctx.fillText(labelData.label, x, y); // Then fill text
  });
    
  // Reset context properties
  ctx.textAlign = 'start';
  ctx.textBaseline = 'alphabetic';
  
  // Function to check if lines are too close and calculate offsets
  const calculateLineOffsets = (portfolioData, indexData) => {
    let portfolioOffset = 0;
    let indexOffset = 0;
    
    // Calculate average difference between the lines
    const differences = portfolioData.map((val, index) => 
      Math.abs(val - (indexData[index] || 0))
    );
    const avgDifference = differences.reduce((sum, diff) => sum + diff, 0) / differences.length;
    
    // If average difference is very small (lines are close), add offsets
    const threshold = range * 0.02; // 2% of the range
    
    if (avgDifference < threshold) {
      const offsetAmount = Math.max(3, graphHeight * 0.008); // Minimum 3px offset
      portfolioOffset = -offsetAmount; // Move portfolio line up
      indexOffset = offsetAmount;      // Move index line down
      
      console.log('📊 Lines are close, applying offsets:', {
        avgDifference,
        threshold,
        portfolioOffset,
        indexOffset
      });
    }
    
    return { portfolioOffset, indexOffset };
  };
  
  // Enhanced line drawing function with offset support
  const drawCleanLine = (data, color, shadowColor, lineWidth = 3, yOffset = 0) => {
    if (data.length === 0) return;
    const padding = chartPadding.value; 
    
    // Draw shadow
    ctx.strokeStyle = shadowColor;
    ctx.lineWidth = lineWidth + 2;
    ctx.beginPath();
    data.forEach((value, index) => {
      const x = padding.left + (index * graphWidth / Math.max(1, data.length - 1));
      const y = padding.top + ((maxValue - value) / range * graphHeight) + yOffset + 1;
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
      const y = padding.top + ((maxValue - value) / range * graphHeight) + yOffset;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    
    // Add gradient fill
    ctx.save();
    ctx.globalAlpha = 0.1;
    const gradient = ctx.createLinearGradient(0, padding.top, 0, chartHeight - padding.bottom);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    data.forEach((value, index) => {
      const x = padding.left + (index * graphWidth / Math.max(1, data.length - 1));
      const y = padding.top + ((maxValue - value) / range * graphHeight) + yOffset;
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
    
    // Store coordinates for mouse interaction
    data.forEach((value, index) => {
      if (chartDataPoints[index]) {
        const x = padding.left + (index * graphWidth / Math.max(1, data.length - 1));
        const y = padding.top + ((maxValue - value) / range * graphHeight) + yOffset;
        
        // Store coordinates based on line type
        chartDataPoints[index].x = x;
        
        if (color === '#66BB6A') {
          // Portfolio line
          chartDataPoints[index].y = y;
        } else if (color === '#42A5F5') {
          // Index line  
          chartDataPoints[index].indexY = y;
        }
      }
    });
  };

  // Calculate offsets to prevent line overlap
  const { portfolioOffset, indexOffset } = calculateLineOffsets(portfolioNavData, indexNavData);

  // Draw lines with offsets to prevent overlap
  drawCleanLine(indexNavData, '#42A5F5', 'rgba(66, 165, 245, 0.3)', 2, indexOffset);
  drawCleanLine(portfolioNavData, '#66BB6A', 'rgba(102, 187, 106, 0.3)', 3, portfolioOffset);

  // Debug logging
  console.log('Chart initialized with data points:', chartDataPoints.length);
  console.log('Sample data point:', chartDataPoints[0]);
  console.log('Chart axis config:', chartAxisConfig.value);
  console.log('X-axis labels:', xAxisLabels);
};

const hideChartTooltip = () => {
  chartTooltip.value.visible = false;
};

const goToDay = (index) => {
  console.log('🎯 Navigating to day:', index + 1);
  
  // Store current timeline position
  const currentTimelineStart = timelineStartIndex.value;
  
  currentDayIndex.value = index;
  selectedDayIndex.value = index;
  
  // Reset pagination
  eventsPage.value = 0;
  startStockPage.value = 0;
  finalStockPage.value = 0;
  
  // Maintain timeline position for manual clicks
  timelineStartIndex.value = currentTimelineStart;
  
  // Stop auto-progression when user manually navigates
  if (autoProgressEnabled.value) {
    stopAutoProgression();
    autoProgressEnabled.value = false;
    console.log('🛑 Auto-progression stopped due to manual navigation');
  }
};


const startNewJourney = () => {
  stopAutoProgression();
  
  // Add loading state for smooth transition
  isFullScreenLoading.value = true;
  loadingMessage.value = 'Starting New Journey...';
  
  console.log('🔄 Starting new investment journey...');
  
  // Navigate to new journey page and reload
  setTimeout(() => {
    const currentUrl = window.location.href;
    
    // Ensure we're navigating to the journey page
    let newJourneyUrl;
    if (currentUrl.includes('/journey')) {
      // Already on journey page, just reload
      newJourneyUrl = currentUrl;
    } else {
      // Add /journey to current URL
      newJourneyUrl = currentUrl.endsWith('/') ? 
        currentUrl + 'journey' : 
        currentUrl + '/journey';
    }
    
    // Navigate to journey page and reload
    window.location.href = newJourneyUrl;
    
    // Force reload after navigation
    setTimeout(() => {
      window.location.reload();
    }, 100);
    
  }, 1000); // Brief delay to show loading message
};

const retryJourney = () => {
  journeyError.value = null;
  if (diceRolls.value.length > 0) {
    startInvestmentJourney();
  }
};

const endJourney = () => {
  console.log('🏁 Ending journey - ensuring smooth transition...');
  stopAutoProgression();
  isJourneyCompleting.value = false; // Clear completion state
  showFinalResults.value = true;
  selectedDayIndex.value = null; // Reset selection to show final results
  
  // Reset pagination
  eventsPage.value = 0;
  startStockPage.value = 0;
  finalStockPage.value = 0;
  
  nextTick(() => {
    initializeChart();
    console.log('✅ Final results now displayed');
  });
};

const exitJourney = () => {
  // Show confirmation dialog instead of directly exiting
  showExitDialog.value = true;
};

const cancelExit = () => {
  showExitDialog.value = false;
  console.log('Exit cancelled - continuing journey');
};

const confirmExit = () => {
  stopAutoProgression();
  showExitDialog.value = false;
  
  console.log('🏠 Navigating to home page...');
  
  // Navigate to home page (root of current domain)
  window.location.href = window.location.origin;
};

watch(currentDayIndex, () => {
  if (currentPhase.value === 'journey' && !isJourneyDataLoading.value) {
    nextTick(() => {
      initializeChart();
    });
  }
});

watch(selectedDayIndex, () => {
  // Reset pagination when selection changes
  eventsPage.value = 0;
  startStockPage.value = 0;
  finalStockPage.value = 0;
});

watch(showFinalResults, () => {
  if (showFinalResults.value) {
    finalStockPage.value = 0;
    startStockPage.value = 0;
    eventsPage.value = 0;
  }
});

onMounted(() => {
  const defaultDate = new Date('2010-01-01');
  journeySetup.value.startDate = defaultDate.toISOString().split('T')[0];
});

onUnmounted(() => {
  stopAutoProgression();
});

// Add this in your setup or mounted section
watch(rollingType, (newType, oldType) => {
  console.log('👀 rollingType changed from', oldType, 'to', newType);
  if (performanceChart.value && journeyDays.value.length > 0) {
    console.log('🔄 Re-initializing chart due to rollingType change');
    nextTick(() => {
      initializeChart();
    });
  }
}, { immediate: false });
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

/* Main Container */
.journey-view {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 30%, #bae6fd 60%, #7dd3fc 100%);
  position: relative;
  overflow-x: scroll;
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
  background: radial-gradient(circle, rgba(59, 130, 246, 0.08), rgba(147, 197, 253, 0.03));
  position: absolute;
  border-radius: 50%;
  animation: floatShape infinite ease-in-out;
}

@keyframes floatShape {
  0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
  50% { transform: translateY(-15px) rotate(180deg) scale(1.05); }
}

.grid-pattern {
  background-image: 
    linear-gradient(rgba(59, 130, 246, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 130, 246, 0.04) 1px, transparent 1px);  position: absolute;
  width: 100%;
  height: 100%;
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
  display: flex;
  flex-direction: column;
}

/* Top Layout Row - Journey Phase Layout */
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

/* Around line ~2000+ - New portfolio summary styles */
.portfolio-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  background: rgb(9 42 167 / 54%);
  padding: 0.3rem;
  border-radius: 0.3rem;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
  flex: 1;
}

.cash-amount {
  color: #4ade80;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3), 0 0 8px rgba(74, 222, 128, 0.4);
}

/* Left Pane */
.left-pane {
  flex: 0 0 325px;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

@media (max-width: 1200px) {
  .left-pane {
    flex: 1;
  }
}

.config-summary-panel {
  background: linear-gradient(135deg, rgb(166 196 231 / 98%) 0%, rgba(248, 250, 252, 0.95) 100%);
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 0.4rem 1.2rem rgba(96, 165, 250, 0.15);
  border: 2px solid rgba(147, 197, 253, 0.4);
  backdrop-filter: blur(15px);
}

.config-summary-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.2rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgba(25, 118, 210, 0.2);
}

.summary-icon {
  font-size: 1.2rem;
  filter: drop-shadow(0 2px 4px rgba(25, 118, 210, 0.3));
}

.summary-title {
  font-size: 0.9rem;
  font-weight: 800;
  color: #1e40af;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin: 0;
}

.config-details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
  align-items: start;
  margin-bottom: 0.5rem;
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

/* Dice Rolling Section */
.dice-rolling-section {
  background: linear-gradient(135deg, rgb(10 140 225 / 97%) 0%, rgba(219, 234, 254, 0.6) 100%);
  border: 2px solid rgba(147, 197, 253, 0.5);
  border-radius: 0.8rem;
  padding: 0.6rem;
  backdrop-filter: blur(10px);
}

.dice-section-header {
  text-align: center;
  margin-bottom: 0.6rem; /* Reduced from 1rem */
  padding-bottom: 0.3rem; /* Reduced from 0.5rem */
  border-bottom: 2px solid rgba(255, 193, 7, 0.3);
}

.dice-section-icon {
  font-size: 1.5rem;
  margin-bottom: 0.3rem;
  filter: drop-shadow(0 2px 4px rgba(255, 193, 7, 0.4));
}

.dice-section-title {
  font-size: 0.8rem; /* Reduced from 0.9rem */
  font-weight: 800;
  color: #b45309;
  margin: 0 0 0.1rem 0; /* Reduced margin */
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.dice-section-subtitle {
  font-size: 0.65rem;
  color: #92400e;
  margin: 0;
  font-weight: 600;
}

.dice-control-area {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dice-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 0.8rem;
  border: 1px solid rgba(255, 193, 7, 0.3);
  height: 16vh;
}

.roll-dice-btn {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  color: white;
  border: none;
  border-radius: 0.6rem;
  padding: 0.4rem 0.8rem;
  font-weight: 700;
  font-size: 0.65rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 0.2rem 0.6rem rgba(245, 158, 11, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.roll-dice-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 0.3rem 0.8rem rgba(245, 158, 11, 0.4);
  background: linear-gradient(135deg, #f97316, #fb923c);
}

.roll-dice-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.roll-dice-btn.rolling {
  background: linear-gradient(135deg, #ef4444, #f87171);
  animation: rollButtonShake 0.3s infinite ease-in-out;
}

.roll-btn-icon {
  font-size: 0.8rem;
}

.roll-btn-text {
  font-size: 0.6rem;
}

.dice-results-display {
  background: rgba(255, 255, 255, 0.4);
  border-radius: 0.8rem;
  padding: 0.8rem;
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.dice-results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.6rem;
  padding-bottom: 0.3rem;
  border-bottom: 1px solid rgba(255, 193, 7, 0.3);
}

.results-label {
  font-size: 0.65rem;
  font-weight: 700;
  color: #b45309;
  text-transform: uppercase;
}

.total-rolls {
  font-size: 0.6rem;
  color: #92400e;
  font-weight: 600;
}

.roll-history {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  min-height: 40px;
  align-items: center;
  justify-content: center;
}

.roll-item {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.9), rgba(251, 191, 36, 0.7));
  border: 2px solid rgba(245, 158, 11, 0.8);
  border-radius: 0.4rem;
  padding: 0.3rem 0.5rem;
  font-size: 0.7rem;
  font-weight: 900;
  color: #92400e;
  min-width: 28px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(245, 158, 11, 0.4);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.roll-item.latest {
  border-color: #ef4444;
  background: linear-gradient(135deg, #ef4444, #f87171);
  color: white;
  animation: latestRollGlow 1s ease-out;
}

@keyframes latestRollGlow {
  0% { 
    transform: scale(1);
    box-shadow: 0 2px 6px rgba(239, 68, 68, 0.4);
  }
  50% { 
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.6);
  }
  100% { 
    transform: scale(1);
    box-shadow: 0 2px 6px rgba(239, 68, 68, 0.4);
  }
}

.no-rolls {
  font-size: 0.65rem;
  color: #92400e;
  font-style: italic;
  opacity: 0.7;
  text-align: center;
  padding: 0.5rem;
}

.total-days-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 193, 7, 0.4);
}

.total-label {
  font-size: 0.65rem;
  font-weight: 600;
  color: #92400e;
}

.total-value {
  font-size: 0.8rem;
  font-weight: 900;
  color: #b45309;
  text-shadow: 0 1px 2px rgba(180, 83, 9, 0.3);
}

.dice-face-mini.front { transform: translateZ(22px); }
.dice-face-mini.back { transform: rotateY(180deg) translateZ(22px); }
.dice-face-mini.right { transform: rotateY(90deg) translateZ(22px); }
.dice-face-mini.left { transform: rotateY(-90deg) translateZ(22px); }
.dice-face-mini.top { transform: rotateX(90deg) translateZ(22px); }
.dice-face-mini.bottom { transform: rotateX(-90deg) translateZ(22px); }

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

.dice-face-mini {
  position: absolute;
  width: 45px;
  height: 45px;
  background: linear-gradient(145deg, #fefefe, #f8f8f8, #f0f0f0);
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 4px 15px rgba(0, 0, 0, 0.2),
    inset 0 2px 4px rgba(255, 255, 255, 0.8),
    inset 0 -1px 2px rgba(0, 0, 0, 0.1);
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
  background: #1a1a1a;
  border-radius: 50%;
  box-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.4),
    inset 0 0.5px 1px rgba(255, 255, 255, 0.2);
}

.dice-face-mini .dot.center { grid-area: 2 / 2; }
.dice-face-mini .dot.top-left { grid-area: 1 / 1; }
.dice-face-mini .dot.top-right { grid-area: 1 / 3; }
.dice-face-mini .dot.center-left { grid-area: 2 / 1; }
.dice-face-mini .dot.center-right { grid-area: 2 / 3; }
.dice-face-mini .dot.bottom-left { grid-area: 3 / 1; }
.dice-face-mini .dot.bottom-right { grid-area: 3 / 3; }

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

/* Right Pane */
.right-pane {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

@media (max-width: 768px) {
  .performance-toolbar {
    flex-wrap: wrap;
    gap: 0.6rem;
    grid-template-columns: repeat(2, 1fr);
  }
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

@media (max-width: 768px) {
  .performance-metric-card {
    min-width: 0;
    max-width: none;
  }
  
  .performance-metric-card .metric-value {
    font-size: 0.8rem;
    max-width: 80px;
  }
  
  .performance-metric-card .metric-label {
    font-size: 0.55rem;
  }
}

.capital-gains-metric {
  border-left-color: #FF9800;
}

.dividend-metric {
  border-left-color: #4CAF50;
}

.index-return-metric {
  border-left-color: #2196F3;
}

.portfolio-return-metric {
  border-left-color: #9C27B0;
}

.journey-progress {
  border-left-color: #607D8B;
}

.metric-icon {
  font-size: 1.2rem;
  filter: drop-shadow(0 0 3px rgba(25, 118, 210, 0.3));
  flex-shrink: 0;
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
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

.capital-gains-positive-fill {
  background: linear-gradient(90deg, #FF9800, #FFB74D);
}

.capital-gains-negative-fill {
  background: linear-gradient(90deg, #F44336, #EF5350);
}

.dividend-fill {
  background: linear-gradient(90deg, #4CAF50, #66BB6A);
}

.index-positive-fill {
  background: linear-gradient(90deg, #2196F3, #42A5F5);
}

.index-negative-fill {
  background: linear-gradient(90deg, #F44336, #EF5350);
}

.portfolio-positive-fill {
  background: linear-gradient(90deg, #9C27B0, #BA68C8);
}

.portfolio-negative-fill {
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

.start-portfolio .holdings-header,
.current-snapshot .holdings-header,
.final-portfolio .holdings-header {
  color: #1e3a8a !important;
  background: rgba(255, 255, 255, 0.9) !important;
  text-shadow: none !important;
  border: 1px solid rgba(30, 58, 138, 0.3) !important;
  font-weight: 900 !important;
}

/* Holdings Header Styles */
.holdings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0;
  margin-bottom: 0.3rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.4);
  font-weight: 800;
  font-size: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.3rem;
  backdrop-filter: blur(5px);
}

@media (max-width: 1400px) {
  .holdings-header {
    font-size: 0.45rem;
    padding: 0.2rem 0;
  }
}

@media (max-width: 768px) {
  .holdings-header {
    font-size: 0.4rem;
    letter-spacing: 0.3px;
  }
}

.header-symbol {
  flex: 1;
  text-align: left;
  padding-left: 0.2rem;
}

.header-quantity {
  flex: 0 0 50px;
  text-align: center;
}

@media (max-width: 1400px) {
  .header-quantity {
    flex: 0 0 45px;
  }
}

@media (max-width: 768px) {
  .header-quantity {
    flex: 0 0 35px;
  }
}

.header-value {
  flex: 0 0 60px;
  text-align: right;
  padding-right: 0.2rem;
}

@media (max-width: 1400px) {
  .header-value {
    flex: 0 0 55px;
  }
}

@media (max-width: 768px) {
  .header-value {
    flex: 0 0 45px;
  }
}

@media (min-width: 1201px) and (max-width: 1400px) {
  .three-panel-layout-right {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0.3rem;
  }
}

@media (max-width: 1200px) {
  .three-panel-layout-right {
    grid-template-columns: 1fr;
    gap: 0.4rem;
    min-height: auto;
    max-height: none;
  }
}

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
    radial-gradient(circle at 20% 20%, rgba(165, 180, 252, 0.4) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.3) 0%, transparent 50%),
    linear-gradient(45deg, transparent 40%, rgba(129, 140, 248, 0.2) 50%, transparent 60%);
}

.current-pattern {
  background: 
    radial-gradient(circle at 30% 70%, rgba(196, 181, 253, 0.4) 0%, transparent 50%),
    radial-gradient(circle at 70% 30%, rgba(167, 139, 250, 0.3) 0%, transparent 50%),
    linear-gradient(135deg, transparent 40%, rgba(139, 92, 246, 0.2) 50%, transparent 60%);
}

.final-pattern {
  background: 
    radial-gradient(circle at 25% 25%, rgba(252, 211, 77, 0.4) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(251, 191, 36, 0.3) 0%, transparent 50%),
    linear-gradient(225deg, transparent 40%, rgba(245, 158, 11, 0.2) 50%, transparent 60%);
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

/* Enhanced text colors for better visibility */
.start-portfolio {
                                                                                                                                                background: linear-gradient(145deg, rgb(12 142 228 / 98%) 0%, rgba(219, 234, 254, 0.95) 20%, rgb(131 163 202 / 92%) 50%, rgba(147, 197, 253, 0.9) 100%);
  border-color: rgba(147, 197, 253, 0.6);
  color: #1e40af;
  box-shadow: 
    0 0.4rem 1.2rem rgba(79, 70, 229, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.current-snapshot {
  background: linear-gradient(141deg, rgb(113 140 230 / 98%) 0%, rgba(224, 231, 255, 0.95) 20%, rgb(169 180 224 / 92%) 50%, rgba(165, 180, 252, 0.9) 100%);  border-color: rgba(165, 180, 252, 0.6);
  color: #1e40af;
  box-shadow: 
    0 0.4rem 1.2rem rgba(88, 28, 135, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.final-portfolio {
  background: linear-gradient(1deg, #2e89d2 0%, #5a9ef6 20%, rgb(237 240 242 / 38%) 50%, #1976d2 100%);
  border-color: rgba(165, 180, 252, 0.6);
  color: #1e40af;
  box-shadow: 
    0 0.4rem 1.2rem rgba(245, 158, 11, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

/* Brighter text colors for all panel content */
.panel-title {
  font-size: 0.9rem;
  font-weight: 900;
  margin: 0;
  letter-spacing: 1.5px;
  color: #ffffff !important;
  text-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.8),
    0 0 10px rgba(0, 0, 0, 0.6),
    1px 1px 0 rgba(0, 0, 0, 1);
  background: rgba(0, 0, 0, 0.3);
  padding: 0.2rem 0.4rem;
  border-radius: 0.3rem;
  backdrop-filter: blur(5px);
}

.panel-date, .panel-subtitle {
  font-size: 0.6rem;
  margin-top: 0.3rem;
  color: #ffffff !important;
  font-weight: 800;
  text-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.8),
    0 0 8px rgba(0, 0, 0, 0.6);
  background: rgba(0, 0, 0, 0.25);
  padding: 0.1rem 0.3rem;
  border-radius: 0.2rem;
  display: inline-block;
}

/* Brighter stock text */
.stock-symbol {
  font-weight: 900;
  color: #ffffff;
  font-size: 0.6rem;
  flex: 1;
  text-align: left;
  padding-left: 0.2rem;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

.stock-price, .stock-quantity {
  font-weight: 800;
  color: rgba(255, 255, 255, 0.95);
  font-size: 0.5rem;
  text-align: center;
  flex: 0 0 50px;
  white-space: nowrap;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

.stock-value {
  font-weight: 900;
  color: #ffffff;
  font-size: 0.55rem;
  text-align: right;
  flex: 0 0 60px;
  padding-right: 0.2rem;
  white-space: nowrap;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

.event-type-compact, .event-stock-compact {
  font-weight: 900;
  color: #ffffff !important;
  font-size: 0.65rem;
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 60px;
  text-shadow: 
    0 1px 4px rgba(0, 0, 0, 0.8),
    0 0 8px rgba(0, 0, 0, 0.6);
  line-height: 1.1;
}

/* Brighter summary text */
.events-summary, .total-line, .final-total-line {
  text-align: center;
  padding: 0.3rem;
  border-radius: 0.3rem;
  font-weight: 900;
  font-size: 0.65rem;
  margin-top: auto;
  flex-shrink: 0;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.4);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

.three-panel-layout-right .panel-header {
  margin-bottom: 0.5rem;
  padding-bottom: 0.4rem;
}

.three-panel-layout-right .panel-title {
  font-size: 0.7rem;
  letter-spacing: 1px;
}

.three-panel-layout-right .panel-date,
.three-panel-layout-right .panel-subtitle {
  font-size: 0.5rem;
  margin-top: 0.2rem;
}

.no-data-message {
  text-align: center;
  padding: 1.5rem 1rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 0.8rem;
  border: 2px dashed rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.8);
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

.stock-holdings, .final-holdings-list {
  margin-bottom: 0.4rem;
  flex: 1;
  overflow-y: auto;
  max-height: 138px;
}

.current-events-list {
  flex: 1;
  overflow-y: auto;
  max-height: 192px;
  min-height: 140px;
}

.stock-line, .final-stock-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.2rem;
  font-weight: 600;
  font-size: 0.55rem;
  padding: 0.2rem 0.4rem;
  border-bottom: 1px solid rgba(30, 58, 138, 0.2);
  line-height: 1.2;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 0.2rem;
  margin-bottom: 0.3rem;
  border: 1px solid rgba(30, 58, 138, 0.2);
}

@media (max-width: 1400px) {
  .stock-symbol {
    font-size: 0.55rem;
  }
}

@media (max-width: 768px) {
  .stock-symbol {
    font-size: 0.5rem;
  }
}

@media (max-width: 1400px) {
  .stock-price, .stock-quantity {
    flex: 0 0 45px;
    font-size: 0.45rem;
  }
}

@media (max-width: 768px) {
  .stock-price, .stock-quantity {
    flex: 0 0 35px;
    font-size: 0.4rem;
  }
}

@media (max-width: 1400px) {
  .stock-value {
    flex: 0 0 55px;
    font-size: 0.5rem;
  }
}

@media (max-width: 768px) {
  .stock-value {
    flex: 0 0 45px;
    font-size: 0.45rem;
  }
}

.event-line-enhanced {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  margin-bottom: 0.3rem;
  font-weight: 600;
  font-size: 0.55rem;
  padding: 0.4rem;
  border-radius: 0.4rem;
  border-left: 3px solid;
  background: #063783 !important;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  min-height: 60px;
  justify-content: space-between;
}

.event-line-enhanced:hover {
  background: rgba(0, 0, 0, 0.4);
  transform: translateY(-1px);
  border-color: rgba(255, 255, 255, 0.3);
}

.event-line-enhanced.buy {
  border-left-color: #22c55e;
  background: rgba(0, 0, 0, 0.4);
  border-top-color: rgba(34, 197, 94, 0.3);
  border-right-color: rgba(34, 197, 94, 0.3);
  border-bottom-color: rgba(34, 197, 94, 0.3);
}

.event-line-enhanced.sell {
  border-left-color: #ef4444;
  background: rgba(0, 0, 0, 0.4);
  border-top-color: rgba(239, 68, 68, 0.3);
  border-right-color: rgba(239, 68, 68, 0.3);
  border-bottom-color: rgba(239, 68, 68, 0.3);
}

.event-line-enhanced.dividend {
  border-left-color: #ffc107;
  background: rgba(0, 0, 0, 0.4);
  border-top-color: rgba(255, 193, 7, 0.3);
  border-right-color: rgba(255, 193, 7, 0.3);
  border-bottom-color: rgba(255, 193, 7, 0.3);
}

.event-info-row {
  display: grid;
  grid-template-columns: auto 1.2fr 1fr auto;
  gap: 0.4rem;
  align-items: center;
  margin-bottom: 0.1rem;
}

.event-icon-compact {
  font-size: 0.7rem;
  line-height: 1;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
}


.event-line-enhanced.buy .event-icon-compact {
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.7)) drop-shadow(0 0 6px rgba(74, 222, 128, 0.6));
  color: #4ade80;
}

.event-line-enhanced.sell .event-icon-compact {
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.7)) drop-shadow(0 0 6px rgba(248, 113, 113, 0.6));
  color: #f87171;
}

.event-line-enhanced.dividend .event-icon-compact {
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.7)) drop-shadow(0 0 6px rgba(251, 191, 36, 0.6));
  color: #fbbf24;
}

.event-line-enhanced.buy .event-quantity-compact {
  color: #86efac;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8), 0 0 6px rgba(134, 239, 172, 0.3);
}

.event-line-enhanced.sell .event-quantity-compact {
  color: #fca5a5;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8), 0 0 6px rgba(252, 165, 165, 0.3);
}

.event-line-enhanced.dividend .event-quantity-compact {
  color: #fde047;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8), 0 0 6px rgba(253, 224, 71, 0.3);
}

.price-data-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.3rem;
  align-items: center;
  margin-top: 0.2rem;
}

@media (max-width: 768px) {
  .price-data-row {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0.15rem;
  }
  
  .price-item-compact {
    font-size: 0.35rem;
    padding: 0.05rem;
  }
}

.price-item-compact {
  font-size: 0.6rem;
  font-weight: 800;
  text-align: center;
  padding: 0.2rem 0.1rem;
  border-radius: 0.3rem;
  background: rgba(255, 255, 255, 0.2);
  white-space: nowrap;
  line-height: 1.2;
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.events-count {
  color: #3f11ed
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.3rem;
  margin: 0.1rem 0;
  padding: 0.15rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 0.3rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
}

.page-btn {
  width: 18px;
  height: 18px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.6rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.page-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  color: #ffffff;
  transform: scale(1.1);
}

.page-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.start-portfolio .page-indicator,
.current-snapshot .page-indicator,
.final-portfolio .page-indicator {
  color: #1e3a8a !important;
  background: rgba(255, 255, 255, 0.95) !important;
  text-shadow: none !important;
  border: 1px solid rgba(30, 58, 138, 0.5) !important;
  font-weight: 900 !important;
}

.total-line, .performance-indicator, .final-total-line {
  text-align: center;
  padding: 0.3rem;
  border-radius: 0.3rem;
  font-weight: 900;
  font-size: 0.65rem;
  margin-top: auto;
  flex-shrink: 0;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.total-amount {
  color: #ffffff !important;
  text-shadow: 
    0 1px 4px rgba(0, 0, 0, 0.8),
    0 0 8px rgba(255, 255, 255, 0.5);
}

.perf-text.positive, .final-perf.positive {
  color: #4ade80;
}

.perf-text.negative, .final-perf.negative {
  color: #f87171;
}

.final-perf.positive {
  color: #00ff00 !important;
  text-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.8), 
    0 0 12px rgba(0, 255, 0, 0.6);
}

.final-perf.negative {
  color: #ff4444 !important;
  text-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.8), 
    0 0 12px rgba(255, 68, 68, 0.6);
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
  color: #ffffff;
}

.progress-stats {
  margin-bottom: 0.6rem;
  font-size: 0.55rem;
  opacity: 0.9;
  color: rgba(255, 255, 255, 0.8);
}

.end-journey-btn {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.3);
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
  background: rgba(255, 255, 255, 0.3);
  color: #ffffff;
  transform: translateY(-1px);
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
  color: #ffffff;
}

.timeline-icon {
  font-size: 1.2rem;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
  animation: gameIconFloat 2s infinite ease-in-out;
  color: #ffffff;
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
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.timeline-status {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #ffffff;
}

.status-text {
  font-size: 0.7rem;
  font-weight: 600;
  color: #ffffff;
}

.completion-status {
  color: #4ade80;
  font-weight: 700;
}

.status-bar {
  width: 100px;
  height: 8px;
  background: linear-gradient(90deg,
    rgba(255, 255, 255, 0.3) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.3) 100%
  );
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.1),
    0 1px 2px rgba(255, 255, 255, 0.1);
  position: relative;
}

.status-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 2px,
    rgba(255, 255, 255, 0.1) 2px,
    rgba(255, 255, 255, 0.1) 4px
  );
  border-radius: 4px;
}

.status-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #34d399, #6ee7b7);
  border-radius: 4px;
  /* FASTER transition */
  transition: width 0.05s linear;
  box-shadow: 
    0 0 8px rgba(16, 185, 129, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  position: relative;
  z-index: 2;
}

.completion-fill {
  background: linear-gradient(90deg, #ff9800, #ff5722, #f44336);
  animation: completionGlow 1s infinite alternate;
}

.complete-fill {
  background: linear-gradient(90deg, #4caf50, #8bc34a, #cddc39);
  box-shadow: 0 0 12px rgba(76, 175, 80, 0.5);
}

@keyframes completionGlow {
  0% { 
    box-shadow: 0 0 8px rgba(255, 152, 0, 0.5);
  }
  100% { 
    box-shadow: 0 0 20px rgba(255, 152, 0, 0.8);
  }
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
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
  backdrop-filter: blur(10px);
  color: #4c1d95;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 4px 15px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.5);
  font-weight: 900;
  z-index: 15;
  position: relative;
  flex-shrink: 0;
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
    0 6px 20px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  background: linear-gradient(145deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.8));
}

.timeline-nav-btn::before {
  content: '';
  position: absolute;
  width: 20px;
  height: 8px;
  background: linear-gradient(90deg,rgb(59, 224, 169), #63e0b3);
  border-radius: 2px;
  top: 50%;
  transform: translateY(-50%);
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
  z-index: 20;
  opacity: 0.8;
  margin-right: 1rem;
}

.timeline-nav-btn.prev-btn::before {
  right: -20px;
}

.timeline-nav-btn.next-btn::before {
  left: -20px;
}

.timeline-nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.nav-icon {
  font-size: 0.9rem;
  font-weight: 900;
}

.track-background {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, 
    rgba(255, 255, 255, 0.3) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.3) 100%
  );
  border-radius: 3px;
  transform: translateY(-50%);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.1),
    0 1px 2px rgba(0, 0, 0, 0.05);
  z-index:1;
}

.track-progress {
  position: absolute;
  top: 50%;
  left: 0;
  height: 8px;
  background: linear-gradient(90deg, 
    #10b981 0%, 
    #34d399 25%, 
    #4ade80 50%, 
    #6ee7b7 75%, 
    #86efac 100%
  );
  border-radius: 4px;
  transform: translateY(-50%);
  /* FASTER and SMOOTHER transition */
  transition: width 0.05s linear;
  box-shadow: 
    0 0 12px rgba(16, 185, 129, 0.5),
    0 2px 4px rgba(0, 0, 0, 0.2);
  animation: progressGlow 1s infinite alternate;
  z-index: 2;
}

@keyframes progressGlow {
  0% { 
    box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
  }
  100% { 
    box-shadow: 0 0 12px rgba(16, 185, 129, 0.6);
  }
}

.timeline-nodes {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 4;
}

/* SPECIFIC END NODE OVERRIDE - Add this after existing timeline styles */
.timeline-node.end-node .node-core {
  background: linear-gradient(145deg, #7c3aed, #a855f7) !important;
  border-color: #7c3aed !important;
  box-shadow: 0 0 25px rgba(124, 58, 237, 0.7) !important;
}

.timeline-node.end-node .date-day-month,
.timeline-node.end-node .date-year {
  color: white !important;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6) !important;
}

.timeline-node.active .node-day {
  color: white;
  font-size: 0.7rem;
  font-weight: 900;
}

.timeline-node.completed .node-core {
  background: linear-gradient(145deg, #2563eb, #60a5fa);
  border-color: #2563eb;
  box-shadow: 0 0 15px rgba(37, 99, 235, 0.6);
}

.timeline-node {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%) !important;
  cursor: pointer;
  transition: box-shadow 0.3s ease, filter 0.3s ease;
  z-index: 4;
  will-change: box-shadow, filter;
}

.timeline-node:hover:not(.active) {
  filter: brightness(1.1) drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
  z-index: 6;
  transform: translate(-50%, -50%) !important;
}

.timeline-node.active {
  transform: translate(-50%, -50%) !important;
  z-index: 5;
}

.node-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50px;
  height: 50px;
  border: 2px solid rgba(255, 255, 255, 0.4);
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
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
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

.timeline-node.completed .node-day {
  color: white;
  font-weight: 900;
}

.timeline-node.future .node-core {
background: linear-gradient(114deg, rgb(226 11 11 / 70%), rgba(255, 255, 255, 0.5));
  border-color: rgba(255, 255, 255, 0.6);
}

.timeline-node.future .node-day {
  color: white;
  font-weight: 700;
}

.timeline-node.future .node-ring {
  border-color: rgba(255, 255, 255, 0.4);
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
  background: linear-gradient(135deg, #10b981, #34d399);
}

.event-indicator.sell {
  background: linear-gradient(135deg, #ef4444, #f87171);
}

.event-indicator.dividend {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
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
  background: radial-gradient(circle, rgba(16, 185, 129, 0.8), transparent);
}

.sell .event-glow {
  background: radial-gradient(circle, rgba(239, 68, 68, 0.8), transparent);
}

.dividend .event-glow {
  background: radial-gradient(circle, rgba(245, 158, 11, 0.8), transparent);
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

.combined-setup-phase {
  max-width: min(100vw, 95vw);
  margin: 0 auto;
  padding: 0.2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.combined-header {
  text-align: center;
  margin-bottom: 0.8rem;
  flex-shrink: 0;
  padding: 0.2rem 0;
}

.cash-amount {
  color: #00ff00 !important;
  text-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.8), 
    0 0 10px rgba(0, 255, 0, 0.6);
}

.setup-icon {
  font-size: 1.4rem;
  margin-bottom: 0.4rem;
  animation: iconFloat 2s infinite ease-in-out;
  filter: drop-shadow(0 0 10px rgba(25, 118, 210, 0.5));
}

@keyframes iconFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
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

.two-pane-setup-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  min-height: 500px;
}

@media (max-width: 900px) {
  .two-pane-setup-layout {
    grid-template-columns: 1fr;
    gap: 1rem;
    min-height: auto;
  }
}

.configuration-pane {
  background: linear-gradient(145deg, 
    rgba(240, 249, 255, 0.95) 0%, 
    rgba(219, 234, 254, 0.9) 30%, 
    rgba(191, 219, 254, 0.85) 70%,
    rgba(147, 197, 253, 0.8) 100%
  );
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 
    0 0.5rem 1.5rem rgba(96, 165, 250, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(147, 197, 253, 0.3);
  backdrop-filter: blur(20px);
}

.config-header-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.5));
  animation: iconFloat 2s infinite ease-in-out;
}

.config-header-title {
  font-size: 1.2rem;
  font-weight: 900;
  color: #1e40af;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 4px rgba(30, 64, 175, 0.2);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.config-header-subtitle {
  font-size: 0.8rem;
  color: #3730a3;
  margin: 0;
  font-weight: 600;
}

.config-form-sections {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
  z-index: 2;
}

.config-form-section {
  background: rgba(255, 255, 255, 0.4);
  border-radius: 1rem;
  padding: 1rem;
  border: 1px solid rgba(79, 70, 229, 0.2);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.config-form-section:hover {
  transform: translateY(-1px);
  box-shadow: 0 0.3rem 0.8rem rgba(79, 70, 229, 0.15);
  background: rgba(255, 255, 255, 0.5);
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
  background: rgba(79, 70, 229, 0.2);
  border-radius: 50%;
  border: 1px solid rgba(79, 70, 229, 0.3);
  filter: drop-shadow(0 0 5px rgba(79, 70, 229, 0.3));
}

.section-header h3 {
  color: #1e40af;
  font-size: 0.9rem;
  font-weight: 800;
  margin: 0;
  text-shadow: 0 1px 2px rgba(30, 64, 175, 0.2);
}

.date-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.date-input-group label {
  font-weight: 700;
  color: #3730a3;
  font-size: 0.7rem;
}

.date-input {
  padding: 0.4rem;
  border: 2px solid rgba(79, 70, 229, 0.3);
  border-radius: 0.5rem;
  font-size: 0.7rem;
  background: rgba(255, 255, 255, 0.8);
  color: #1e40af;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  height: 32px;
}

.date-input:focus {
  outline: none;
  border-color: rgba(79, 70, 229, 0.6);
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
  background: rgba(255, 255, 255, 0.9);
}

.date-hint {
  font-size: 0.6rem;
  color: #6366f1;
  font-style: italic;
}

.amount-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.amount-input {
  padding: 0.4rem;
  border: 2px solid rgba(79, 70, 229, 0.3);
  border-radius: 0.5rem;
  font-size: 0.7rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.8);
  color: #1e40af;
  text-align: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  height: 32px;
}

.amount-input:focus {
  outline: none;
  border-color: rgba(79, 70, 229, 0.6);
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
  background: rgba(255, 255, 255, 0.9);
}

.amount-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  justify-content: center;
}

.amount-btn {
  padding: 0.3rem 0.6rem;
  background: rgba(255, 255, 255, 0.6);
  border: 2px solid rgba(79, 70, 229, 0.3);
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 0.6rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #3730a3;
  backdrop-filter: blur(5px);
  height: 28px;
}

.amount-btn:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-1px);
}

.amount-btn.active {
  background: rgba(79, 70, 229, 0.2);
  color: #1e40af;
  border-color: rgba(79, 70, 229, 0.5);
  box-shadow: 0 0 10px rgba(79, 70, 229, 0.3);
}

.stocks-selector-compact {
  padding: 0.6rem;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 0.6rem;
  border: 1px solid rgba(79, 70, 229, 0.2);
  backdrop-filter: blur(5px);
}

.stocks-slider {
  margin-bottom: 0.8rem;
  text-align: center;
}

.slider {
  width: 100%;
  height: 3px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(79, 70, 229, 0.3);
  border-radius: 2px;
  outline: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(79, 70, 229, 0.3);
}

.slider-value {
  font-size: 1rem;
  font-weight: 900;
  color: #1e40af;
  margin-top: 0.4rem;
  text-shadow: 0 1px 2px rgba(30, 64, 175, 0.2);
}

.stocks-presets {
  display: flex;
  gap: 0.4rem;
  justify-content: center;
  flex-wrap: wrap;
}

.preset-btn {
  padding: 0.2rem 0.5rem;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(79, 70, 229, 0.3);
  border-radius: 0.3rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #3730a3;
  font-size: 0.6rem;
  backdrop-filter: blur(5px);
  height: 24px;
}

.preset-btn:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-1px);
}

.preset-btn.active {
  background: rgba(79, 70, 229, 0.2);
  color: #1e40af;
  border-color: rgba(79, 70, 229, 0.5);
  box-shadow: 0 0 10px rgba(79, 70, 229, 0.3);
}

.product-selector-compact {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.product-card-compact {
  background: rgba(255, 255, 255, 0.6);
  border: 2px solid rgba(79, 70, 229, 0.3);
  border-radius: 0.6rem;
  padding: 0.6rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  backdrop-filter: blur(5px);
}

.product-card-compact:hover {
  transform: translateY(-1px);
  box-shadow: 0 0.3rem 0.8rem rgba(79, 70, 229, 0.2);
  background: rgba(255, 255, 255, 0.8);
}

.product-card-compact.active {
  border-color: rgba(79, 70, 229, 0.6);
  background: rgba(79, 70, 229, 0.15);
  box-shadow: 0 0 15px rgba(79, 70, 229, 0.3);
}

.product-icon-compact {
  font-size: 1.5rem;
  flex-shrink: 0;
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.3));
}

.product-info {
  flex: 1;
}

.product-name-compact {
  font-size: 0.9rem;
  font-weight: 800;
  color: #1e40af;
  margin-bottom: 0.3rem;
  text-shadow: 0 2px 4px rgba(30, 64, 175, 0.2);
}

.risk-stars {
  display: flex;
  justify-content: flex-start;
  gap: 1px;
}

.star {
  font-size: 0.5rem;
  opacity: 0.3;
}

.star.filled {
  opacity: 1;
}

/* Dice Pane */
.dice-pane {
  background: linear-gradient(145deg, 
    rgba(240, 249, 255, 0.95) 0%, 
    rgba(219, 234, 254, 0.9) 30%, 
    rgba(191, 219, 254, 0.85) 70%,
    rgba(147, 197, 253, 0.8) 100%
  );
  border-radius: 1.5rem;
  padding: 1.5rem;
  box-shadow: 
    0 0.5rem 1.5rem rgba(96, 165, 250, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(147, 197, 253, 0.3);
  backdrop-filter: blur(20px);
}

.dice-pane::before {
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
  z-index: 1;
}

.dice-pane-header {
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  z-index: 2;
}

.dice-header-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.5));
  animation: iconFloat 2s infinite ease-in-out;
}

.dice-header-title {
  font-size: 1.2rem;
  font-weight: 900;
  color: #b45309;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 4px rgba(180, 83, 9, 0.2);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.dice-header-subtitle {
  font-size: 0.8rem;
  color: #92400e;
  margin: 0 0 1rem 0;
  font-weight: 600;
}

.dice-progress-bar {
  max-width: 300px;
  margin: 0 auto;
}

.progress-label {
  font-size: 0.7rem;
  color: #92400e;
  margin-bottom: 0.4rem;
  font-weight: 600;
}

.progress-track {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.progress-fill-dice {
  height: 100%;
  background: linear-gradient(90deg, #f97316, #fb923c);
  border-radius: 4px;
  transition: width 0.5s ease;
  box-shadow: 0 0 8px rgba(249, 115, 22, 0.4);
}

.dice-main-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;
  z-index: 2;
}

.dice-arena-enhanced {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.dice-container-main {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.6rem;
  perspective: 1000px;
  position: relative;
  padding: 1.5rem;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1), transparent);
  border-radius: 1rem;
  border: 2px solid rgba(245, 158, 11, 0.3);
  box-shadow: 
    0 0 30px rgba(245, 158, 11, 0.3),
    inset 0 2px 6px rgba(255, 255, 255, 0.2);
  animation: diceContainerPulse 3s infinite ease-in-out;
  transition: all 0.3s ease;
  min-height: 120px;
}

.dice-container-main.rolling {
  background: radial-gradient(circle, rgba(255, 152, 0, 0.4), rgba(255, 193, 7, 0.25), transparent);
  border-color: rgba(255, 152, 0, 0.5);
  box-shadow: 
    0 0 60px rgba(255, 152, 0, 0.6),
    inset 0 4px 12px rgba(255, 255, 255, 0.3);
  animation: diceContainerRolling 0.3s infinite ease-in-out;
}

@keyframes diceContainerPulse {
  0%, 100% { 
    transform: scale(1);
    box-shadow: 
      0 0 40px rgba(148, 163, 184, 0.4),
      inset 0 2px 8px rgba(255, 255, 255, 0.2);
  }
  50% { 
    transform: scale(1.02);
    box-shadow: 
      0 0 60px rgba(148, 163, 184, 0.6),
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

.dice-cube-enhanced {
  position: relative;
  width: 60px;
  height: 60px;
  transform-style: preserve-3d;
  transition: transform 0.4s ease;
  filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.6));
  animation: diceFloatIdle 3s infinite ease-in-out;
}

.dice-cube-enhanced.rolling {
  animation: rollDiceVisible 0.2s infinite linear;
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

.dice-face-enhanced {
  position: absolute;
  width: 60px;
  height: 60px;
  background: linear-gradient(145deg, #fefefe, #f8f8f8, #f0f0f0);
  border: 3px solid #e0e0e0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 6px 20px rgba(0, 0, 0, 0.25),
    inset 0 3px 6px rgba(255, 255, 255, 0.9),
    inset 0 -2px 4px rgba(0, 0, 0, 0.1);
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
  background: #1a1a1a;
  border-radius: 50%;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.4),
    inset 0 1px 2px rgba(255, 255, 255, 0.3);
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

.dice-roll-button {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
}

.setup-incomplete-message {
  background: rgba(255, 255, 255, 0.4);
  color: #92400e;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 0.8rem;
  font-weight: 600;
  font-size: 0.6rem;
  text-align: center;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.roll-btn-enhanced {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  color: white;
  border: none;
  border-radius: 1rem;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 900;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 
    0 0.4rem 1.2rem rgba(59, 130, 246, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.roll-btn-enhanced:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 
    0 0.8rem 2rem rgba(59, 130, 246, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  background: linear-gradient(135deg, #2563eb, #3b82f6);
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

.roll-icon-main {
  font-size: 1.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.roll-text-main {
  font-size: 0.9rem;
}

.dice-results-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.results-display-enhanced {
  background: rgba(255, 255, 255, 0.4);
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 0.3rem 0.8rem rgba(245, 158, 11, 0.15);
  border: 2px solid rgba(245, 158, 11, 0.2);
  backdrop-filter: blur(10px);
}

.results-header h4 {
  color: #b45309;
  font-size: 1rem;
  font-weight: 900;
  margin: 0 0 0.8rem 0;
  text-align: center;
  text-shadow: 0 1px 2px rgba(180, 83, 9, 0.2);
}

.results-grid-enhanced {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.result-item-enhanced {
  background: rgba(255, 255, 255, 0.6);
  border: 2px solid rgba(245, 158, 11, 0.3);
  border-radius: 0.6rem;
  padding: 0.6rem;
  text-align: center;
  min-width: 70px;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

.result-item-enhanced:hover {
  transform: translateY(-1px);
  box-shadow: 0 0.3rem 0.6rem rgba(245, 158, 11, 0.2);
}

.result-number {
  font-size: 1.2rem;
  font-weight: 900;
  color: #b45309;
  margin-bottom: 0.2rem;
  text-shadow: 0 1px 2px rgba(180, 83, 9, 0.2);
}

.result-label {
  font-size: 0.6rem;
  color: #92400e;
  font-weight: 600;
  text-transform: uppercase;
}

.total-summary {
  text-align: center;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 0.6rem;
  border: 2px solid rgba(245, 158, 11, 0.3);
  backdrop-filter: blur(5px);
}

.total-label {
  font-size: 0.7rem;
  color: #92400e;
  margin-bottom: 0.4rem;
  font-weight: 600;
}

.total-value-enhanced {
  font-size: 1.6rem;
  font-weight: 900;
  color: #b45309;
  text-shadow: 0 1px 2px rgba(180, 83, 9, 0.2);
}

.dice-instructions {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 0.4rem 1rem rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.instruction-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
}

.dice-instructions h4 {
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 900;
  margin: 0 0 0.8rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.dice-instructions p {
  color: rgba(255, 255, 255, 0.9);
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
  gap: 0.4rem;
  justify-content: center;
  padding: 0.4rem;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 0.4rem;
  font-size: 0.7rem;
  color: #92400e;
  font-weight: 600;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.info-icon {
  font-size: 1rem;
}

.error-display {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(244, 67, 54, 0.5);
  border-radius: 1rem;
  padding: 1.2rem;
  text-align: center;
  box-shadow: 0 0.4rem 1rem rgba(244, 67, 54, 0.15);
  backdrop-filter: blur(10px);
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
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 900;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.error-message {
  color: rgba(255, 255, 255, 0.9);
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

.btn-icon {
  font-size: 0.65rem;
}

.btn-text {
  font-size: 0.55rem;
}

/* Journey Phase */
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

.main-content-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-height: 0;
  width: 100%;
}

.performance-chart-section {
background: linear-gradient(145deg, #6dace9 0%, rgba(248, 250, 252, 0.95) 50%, rgb(87 153 219 / 92%) 100%);
  border: 2px solid rgba(147, 197, 253, 0.3);
  border-radius: 1.2rem;
  padding: 1rem;
  box-shadow: 
    0 0.8rem 2rem rgba(25, 118, 210, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  margin-bottom: 0.8rem;
  position: relative;
  overflow: hidden;
}

.chart-header-enhanced {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  position: relative;
  z-index: 2;
  flex-wrap: wrap;
  gap: 1rem;
}

@media (max-width: 768px) {
  .chart-header-enhanced {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.8rem;
  }
}

.chart-title-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .chart-title-section {
    align-items: center;
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
  margin-left: auto
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

.compact-metrics {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .compact-metrics {
    justify-content: center;
    gap: 1rem;
  }
}

.compact-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  padding: 0.5rem 0.8rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 0.6rem;
  border: 1px solid rgba(25, 118, 210, 0.2);
  transition: all 0.3s ease;
  min-width: 80px;
}

.compact-metric:hover {
  transform: translateY(-1px);
  box-shadow: 0 0.3rem 0.8rem rgba(25, 118, 210, 0.15);
}

.metric-label-compact {
  font-size: 0.6rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  text-align: center;
}

.metric-value-compact {
  font-size: 0.8rem;
  font-weight: 900;
  text-align: center;
  line-height: 1;
}

.metric-value-compact.positive {
  color: #2e7d32;
}

.metric-value-compact.negative {
  color: #c62828;
}

.metric-value-compact.portfolio-text {
  color: #FF9800;
}

.enhanced-chart-container {
  position: relative;
  width: 100%;
  height: 300px; /* Increase from 300px to 320px */
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
    height: 200px; /* Increase from 180px to 200px */
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
    rgba(96, 165, 250, 0.2), 
    rgba(147, 197, 253, 0.15)
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
  cursor: crosshair;
}

.performance-canvas:hover {
  cursor: crosshair;
}

.chart-tooltip {
  position: absolute;
  z-index: 1000;
  background: linear-gradient(145deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.96));
  color: white;
  border-radius: 0.6rem;
  padding: 0.8rem;
  min-width: 180px;
  box-shadow: 
    0 0.8rem 2rem rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 0 0 1px rgba(59, 130, 246, 0.3);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(59, 130, 246, 0.25);
  animation: tooltipFadeIn 0.2s ease-out;
  font-size: 0.7rem;
  pointer-events: none;
}

@keyframes tooltipFadeIn {
  0% { opacity: 0; transform: scale(0.9) translateY(10px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

.tooltip-header-chart {
  text-align: center;
  margin-bottom: 0.6rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid rgba(59, 130, 246, 0.3);
}

.tooltip-date-chart {
  font-size: 0.8rem;
  font-weight: 800;
  color: #60a5fa;
  margin-bottom: 0.1rem;
}

.tooltip-day-chart {
  font-size: 0.6rem;
  color: #cbd5e1;
  font-weight: 500;
}

.tooltip-content-chart {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.tooltip-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.2rem 0;
}

.tooltip-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.65rem;
  font-weight: 600;
  color: #e2e8f0;
}

.tooltip-label.portfolio-label {
  color: #4ade80;
}

.tooltip-label.index-label {
  color: #60a5fa;
}

.tooltip-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.tooltip-dot.portfolio-dot {
  background: #4ade80;
  box-shadow: 0 0 6px rgba(74, 222, 128, 0.5);
}

.tooltip-dot.index-dot {
  background: #60a5fa;
  box-shadow: 0 0 6px rgba(96, 165, 250, 0.5);
}

.tooltip-value {
  font-size: 0.7rem;
  font-weight: 800;
  color: white;
  text-align: right;
}

.tooltip-separator {
  height: 1px;
  background: rgba(59, 130, 246, 0.2);
  margin: 0.2rem 0;
}

.chart-statistics-compact {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
  padding: 0.6rem;
  background: linear-gradient(135deg, 
    rgba(241, 245, 249, 0.8), 
    rgba(226, 232, 240, 0.6)
  );
  border-radius: 0.6rem;
  border: 1px solid rgba(148, 163, 184, 0.2);
  position: relative;
  z-index: 2;
  flex-wrap: wrap;
}

.stat-text-compact {
  font-size: 0.65rem;
  font-weight: 600;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

.stat-separator {
  color: #94a3b8;
  font-weight: 400;
}

@media (max-width: 480px) {
  .chart-statistics-compact {
    flex-direction: column;
    gap: 0.4rem;
  }
  
  .stat-separator {
    display: none;
  }
}

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

.day-tooltip {
  position: fixed;
  z-index: 1000;
  background: linear-gradient(145deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.96));
  color: white;
  border-radius: 0.8rem;
  padding: 1rem;
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: 
    0 1rem 2rem rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 0 0 1px rgba(59, 130, 246, 0.3);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(59, 130, 246, 0.25);
  animation: tooltipFadeIn 0.25s ease-out;
  font-size: 0.75rem;
  /* Ensure consistent sizing */
  min-height: 280px;
  max-height: 450px;
  display: flex;
  flex-direction: column;
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

.stats-grid-compact {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.4rem;
}

@media (max-width: 420px) {
  .stats-grid-compact {
    grid-template-columns: 1fr 1fr;
    gap: 0.3rem;
  }
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

.tooltip-trades-compact {
  background: rgba(255, 193, 7, 0.08);
  border-radius: 0.5rem;
  padding: 0.6rem;
  border: 1px solid rgba(255, 193, 7, 0.2);
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; /* Allow shrinking */
}

.trades-list-compact {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding-right: 0.3rem;
  min-height: 120px; /* Minimum height for events area */
  /* Better scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.trades-list-compact::-webkit-scrollbar {
  width: 4px;
}

.trades-list-compact::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.trades-list-compact::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.trades-list-compact::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

@media (max-width: 600px) {
  .day-tooltip {
    /* On mobile, use more of the screen */
    max-width: 95vw !important;
    max-height: 85vh !important;
    margin: 10px;
    font-size: 0.7rem;
  }
  
  .trades-list-compact {
    max-height: 150px;
  }
  
  .tooltip-section-compact {
    padding: 0.4rem;
  }
}

.trade-row-compact {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.4rem;
  align-items: center;
  padding: 0.3rem 0.4rem;
  border-radius: 0.4rem;
  font-weight: 600;
  transition: all 0.2s ease;
  border-left: 2px solid;
  font-size: 0.6rem;
  min-height: 24px;
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

.dice-icon {
  margin-right: 0.1rem;
  font-size: medium;
}

/* Enhanced Timeline Node Styles */
.timeline-node.start-node,
.timeline-node.end-node {
  transform: translate(-50%, -50%) !important;
  z-index: 10;
}

.start-ring {
  border: 3px solid #1e40af;
  border-radius: 50%;
  width: 55px;
  height: 55px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: staticRingGlow 2s infinite ease-in-out;
  box-shadow: 0 0 20px rgba(30, 64, 175, 0.6);
}

.start-core {
  background: linear-gradient(145deg, #1e40af, #3b82f6);
  color: white;
  box-shadow: 0 0 25px rgba(30, 64, 175, 0.7);
}


@keyframes staticRingGlow {
  0%, 100% { 
    box-shadow: 0 0 15px rgba(30, 64, 175, 0.4);
  }
  50% { 
    box-shadow: 0 0 25px rgba(30, 64, 175, 0.8);
  }
}

.end-ring {
  border: 3px solid #7c3aed;
  border-radius: 50%;
  width: 55px;
  height: 55px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: endRingGlow 2s infinite ease-in-out;
}

.end-core {
  background: linear-gradient(145deg, #7c3aed, #a855f7);
  color: white;
  box-shadow: 0 0 25px rgba(124, 58, 237, 0.7);
}

@keyframes endRingGlow {
  0%, 100% { 
    box-shadow: 0 0 15px rgba(124, 58, 237, 0.4);
  }
  50% { 
    box-shadow: 0 0 25px rgba(124, 58, 237, 0.8);
  }
}

.start-core, .end-core {
  width: 49px;
  height: 49px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.8);
}

.event-node .node-ring {
  border: 2px solid rgba(59, 130, 246, 0.5);
}

.event-node.completed .node-core {
  background: linear-gradient(145deg, #2563eb, #60a5fa);
  box-shadow: 0 0 15px rgba(37, 99, 235, 0.6);
}

.event-node.completed .node-ring {
  border-color: #2563eb;
  box-shadow: 0 0 12px rgba(37, 99, 235, 0.5);
}

.event-node.active .node-core {
  background: linear-gradient(145deg, #1d4ed8, #3b82f6);
  box-shadow: 0 0 25px rgba(29, 78, 216, 0.8);
}

.event-node.active .node-ring {
  border-color: #1d4ed8;
  border-width: 3px;
  box-shadow: 0 0 20px rgba(29, 78, 216, 0.7);
  animation: activeRingPulse 1.5s infinite ease-in-out;
}

.event-node.future .node-core {
  background: linear-gradient(145deg, rgba(147, 197, 253, 0.8), rgba(191, 219, 254, 0.6));
  border-color: rgba(96, 165, 250, 0.6);
}

.event-node.future .node-ring {
  border-color: rgba(96, 165, 250, 0.4);
}

.node-label {
  font-size: 0.6rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.node-date-label {
  position: absolute;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.5rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  background: rgba(0, 0, 0, 0.3);
  padding: 0.2rem 0.4rem;
  border-radius: 0.3rem;
  white-space: nowrap;
}

.event-node .node-core {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
  position: absolute;
  top: 50%;
  left: 50%;
}

.event-node.active .node-ring {
  border-color: #f97316;
  border-width: 3px;
  box-shadow: 0 0 16px rgba(249, 115, 22, 0.6);
  animation: activeRingPulse 1.5s infinite ease-in-out;
}

.node-date-inside {
  font-size: 0.65rem;
  font-weight: 900;
  text-align: center;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 40px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  color: white;
}

.start-core .node-date-inside,
.end-core .node-date-inside {
  color: white;
  font-weight: 900;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
}

.event-node .node-date-inside {
  color: #0d47a1;
  font-weight: 900;
  text-shadow: 0 1px 2px rgba(13, 71, 161, 0.3);
}

.event-node.completed .node-date-inside {
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.event-node.active .node-date-inside {
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
}

/* Event Indicators */
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
  background: linear-gradient(135deg, #10b981, #34d399);
}

.event-indicator.sell {
  background: linear-gradient(135deg, #ef4444, #f87171);
}

.event-indicator.dividend {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
}

.event-indicator .event-icon {
  font-size: 0.5rem;
  filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.5));
  animation: eventIconBounce 1s infinite ease-in-out;
  z-index: 2;
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

@keyframes eventIconBounce {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.1) rotate(5deg); }
}

/* Journey Control Buttons */
.journey-control-buttons {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 0.6rem;
  padding: 0.6rem;
  border: 2px solid rgba(147, 197, 253, 0.4);
  backdrop-filter: blur(10px);
  margin-top: 0.3rem;
}

.control-buttons-header {
  text-align: center;
  margin-bottom: 0.5rem; /* Reduced from 0.8rem */
  padding-bottom: 0.3rem; /* Reduced from 0.5rem */
  border-bottom: 1px solid rgba(255, 193, 7, 0.3);
}

.control-title {
  font-size: 0.7rem; /* Reduced from 0.8rem */
  font-weight: 800;
  color: #b45309;
  margin: 0 0 0.1rem 0; /* Reduced margin */
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.control-subtitle {
  font-size: 0.55rem; /* Reduced from 0.6rem */
  color: #92400e;
  margin: 0;
  font-weight: 600;
  font-style: italic;
}

.control-buttons-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.4rem; /* Reduced from 0.6rem */
  margin-bottom: 0.5rem; /* Reduced from 0.8rem */
}

.journey-control-btn {
  background: rgba(255, 255, 255, 0.3);
  border: 2px solid rgba(180, 83, 9, 0.4);
  border-radius: 0.5rem; /* Reduced from 0.6rem */
  padding: 0.5rem 0.3rem; /* Reduced from 0.8rem 0.5rem */
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem; /* Reduced from 0.3rem */
  text-align: center;
  backdrop-filter: blur(5px);
  opacity: 0.5;
}

.journey-control-btn:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.journey-control-btn.enabled {
  opacity: 1;
  background: rgba(255, 255, 255, 0.6);
  border-color: rgba(180, 83, 9, 0.6);
}

.journey-control-btn.enabled:hover {
  transform: translateY(-1px);
  box-shadow: 0 0.3rem 0.8rem rgba(180, 83, 9, 0.3);
  background: rgba(255, 255, 255, 0.8);
}

.five-year-btn.enabled {
  border-color: rgba(34, 197, 94, 0.6);
}

.five-year-btn.enabled:hover {
  box-shadow: 0 0.3rem 0.8rem rgba(34, 197, 94, 0.3);
}

.end-journey-btn-dice.enabled {
  border-color: rgba(239, 68, 68, 0.6);
}

.end-journey-btn-dice.enabled:hover {
  box-shadow: 0 0.3rem 0.8rem rgba(239, 68, 68, 0.3);
}

.control-btn-icon {
  font-size: 1rem; /* Reduced from 1.2rem */
  filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.3));
}

.control-btn-text {
  font-size: 0.6rem; /* Reduced from 0.65rem */
  font-weight: 800;
  color: #92400e;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.control-btn-subtitle {
  font-size: 0.45rem; /* Reduced from 0.5rem */
  color: #a16207;
  font-weight: 600;
  font-style: italic;
}

.journey-control-btn.enabled .control-btn-text {
  color: #b45309;
}

.five-year-btn.enabled .control-btn-text {
  color: #16a34a;
}

.end-journey-btn-dice.enabled .control-btn-text {
  color: #dc2626;
}

.unlock-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem; /* Reduced from 0.4rem */
  padding: 0.4rem; /* Reduced from 0.6rem */
  background: rgba(255, 193, 7, 0.15);
  border-radius: 0.4rem; /* Reduced from 0.5rem */
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.unlock-text {
  font-size: 0.55rem; /* Reduced from 0.6rem */
  color: #92400e;
  font-weight: 600;
  font-style: italic;
}

.unlock-icon {
  font-size: 0.8rem;
  opacity: 0.7;
}

/* Loading states for buttons */
.journey-control-btn.loading {
  opacity: 0.8;
  background: rgba(255, 255, 255, 0.4);
  cursor: wait;
}

.journey-control-btn.loading .control-btn-icon {
  animation: loadingRotate 1s infinite linear;
}

@keyframes loadingRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error message styling */
.error-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.6rem;
  background: rgba(239, 68, 68, 0.15);
  border-radius: 0.5rem;
  border: 1px solid rgba(239, 68, 68, 0.3);
  margin-top: 0.5rem;
}

.error-icon {
  font-size: 0.8rem;
  color: #dc2626;
}

.error-text {
  font-size: 0.6rem;
  color: #dc2626;
  font-weight: 600;
}

/* Journey Actions in Left Pane */
.journey-actions-left-pane {
  background: linear-gradient(135deg, 
    rgba(240, 249, 255, 0.8) 0%, 
    rgba(219, 234, 254, 0.6) 100%
  );
  border-radius: 0.8rem;
  padding: 0.8rem;
  border: 2px solid rgba(147, 197, 253, 0.4);
  backdrop-filter: blur(10px);
}

.actions-header {
  text-align: center;
  margin-bottom: 0.8rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgba(25, 118, 210, 0.3);
}

.actions-title {
  font-size: 0.8rem;
  font-weight: 800;
  color: #1e40af;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  text-shadow: 0 1px 2px rgba(30, 64, 175, 0.2);
}

.journey-actions-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 0.8rem;
}

.action-btn-left {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: none;
  border-radius: 0.6rem;
  font-weight: 800;
  font-size: 0.65rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  box-shadow: 0 0.2rem 0.6rem rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.action-btn-left.primary {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  color: white;
  box-shadow: 0 0.2rem 0.6rem rgba(59, 130, 246, 0.3);
}

.action-btn-left.secondary {
  background: linear-gradient(135deg, #607D8B, #90A4AE);
  color: white;
  box-shadow: 0 0.2rem 0.6rem rgba(96, 125, 139, 0.4);
}

.action-btn-left:hover {
  transform: translateY(-1px);
  box-shadow: 0 0.4rem 0.8rem rgba(0, 0, 0, 0.3);
}

.action-btn-left.primary:hover {
  background: linear-gradient(135deg, #1565c0, #1976d2);
  box-shadow: 0 0.4rem 0.8rem rgba(25, 118, 210, 0.5);
}

.action-btn-left.secondary:hover {
  background: linear-gradient(135deg, #546e7a, #607d8b);
  box-shadow: 0 0.4rem 0.8rem rgba(96, 125, 139, 0.5);
}

.end-journey-section {
  border-top: 1px solid rgba(25, 118, 210, 0.2);
  padding-top: 0.8rem;
}

.end-journey-btn-left-pane {
  background: linear-gradient(135deg, #F44336, #EF5350);
  color: white;
  border: none;
  border-radius: 0.6rem;
  padding: 0.7rem 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 
    0 0.3rem 0.8rem rgba(244, 67, 54, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 900;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  width: 100%;
}

.end-journey-btn-left-pane:hover {
  transform: translateY(-1px);
  box-shadow: 
    0 0.5rem 1.2rem rgba(244, 67, 54, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  background: linear-gradient(135deg, #E53935, #F44336);
}

.action-btn-left .btn-icon,
.end-journey-btn-left-pane .btn-icon {
  font-size: 0.8rem;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
}

.action-btn-left .btn-text,
.end-journey-btn-left-pane .btn-text {
  font-size: 0.65rem;
  font-weight: 900;
}

/* Responsive adjustments for left pane buttons */
@media (max-width: 1200px) {
  .journey-actions-buttons {
    flex-direction: row;
    gap: 0.5rem;
  }
  
  .action-btn-left {
    flex: 1;
    font-size: 0.6rem;
  }
}

@media (max-width: 768px) {
  .journey-actions-buttons {
    flex-direction: column;
  }
  
  .action-btn-left {
    width: 100%;
  }
}

.timeline-nav-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  color: rgba(255, 255, 255, 0.9);
}

.nav-info-text {
  font-size: 0.7rem;
  font-weight: 600;
  color: #ffffff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.nav-page-info {
  font-size: 0.6rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.timeline-nav-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.timeline-nav-control {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 3px 10px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.5);
  font-weight: 900;
  position: relative;
  flex-shrink: 0;
}

.timeline-nav-control:hover:not(:disabled) {
  transform: translateY(-1px) scale(1.05);
  box-shadow: 
    0 5px 15px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  background: linear-gradient(145deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.8));
}

.timeline-nav-control:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.nav-control-icon {
  font-size: 0.8rem;
}

/* Responsive timeline navigation */
@media (max-width: 768px) {
  .timeline-navigation-controls {
    flex-direction: column;
    gap: 0.6rem;
    padding: 0.6rem;
  }
  
  .timeline-nav-info {
    text-align: center;
  }
  
  .timeline-nav-control {
    width: 32px;
    height: 32px;
  }
  
  .nav-control-icon {
    font-size: 0.7rem;
  }
}

/* Holdings Header Text */
.holdings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.3rem 0.5rem;
  margin-bottom: 0.3rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.4);
  font-weight: 900;
  font-size: 0.8rem; /* Changed from 0.5rem */
  color: #ffffff !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: rgba(0, 0, 0, 0.35) !important;
  border-radius: 0.4rem;
  backdrop-filter: blur(10px);
  text-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.8),
    0 0 8px rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.25);
}

/* Stock Text */
.stock-symbol {
  font-weight: 900;
  color: #ffffff !important;
  font-size: 0.8rem; /* Changed from 0.6rem */
  flex: 1;
  text-align: left;
  padding-left: 0.2rem;
  text-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.8),
    0 0 8px rgba(0, 0, 0, 0.5);
}

.stock-price, .stock-quantity {
  font-weight: 900;
  color: #ffffff !important;
  font-size: 0.8rem; /* Changed from 0.5rem */
  text-align: center;
  flex: 0 0 50px;
  white-space: nowrap;
  text-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.8),
    0 0 6px rgba(0, 0, 0, 0.5);
}

.stock-value {
  font-weight: 900;
  color: #fef08a !important;
  font-size: 0.8rem; /* Changed from 0.55rem */
  text-align: right;
  flex: 0 0 60px;
  padding-right: 0.2rem;
  white-space: nowrap;
  text-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.8),
    0 0 10px rgba(254, 240, 138, 0.6);
}

/* Event Text */
.event-type-compact, .event-stock-compact {
  font-weight: 900;
  color: #ffffff !important;
  font-size: 0.8rem; /* Changed from 0.5rem */
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 50px;
  text-shadow: 
    0 1px 4px rgba(0, 0, 0, 0.8),
    0 0 8px rgba(0, 0, 0, 0.6);
}

.event-quantity-compact {
  font-weight: 900;
  color: #fef08a !important;
  font-size: 0.8rem; /* Changed from 0.45rem */
  text-align: center;
  min-width: 25px;
  white-space: nowrap;
  text-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.8),
    0 0 8px rgba(254, 240, 138, 0.5);
}

.total-line, .final-total-line, .final-performance-line {
  text-align: center;
  padding: 0.25rem 0.4rem;
  border-radius: 0.4rem;
  font-weight: 900;
  font-size: 0.7rem;
  margin-top: 0.5rem;
  flex-shrink: 0;
  color: #ffffff !important;
  border: 2px solid rgba(255, 255, 255, 0.3);
  text-shadow: 
    0 1px 4px rgba(0, 0, 0, 0.8),
    0 0 10px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(12px);
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.summary-label {
  font-size: 0.8rem; /* Changed from 0.5rem */
  font-weight: 800;
  color: #ffffff !important;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  text-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.8),
    0 0 6px rgba(0, 0, 0, 0.6);
}

.summary-amount {
  font-size: 0.8rem; /* Changed from 0.65rem */
  font-weight: 900;
  text-shadow: 
    0 1px 4px rgba(0, 0, 0, 0.8),
    0 0 8px rgba(0, 0, 0, 0.6);
}

.final-perf {
  font-size: 0.8rem; /* Consistent with other text */
  font-weight: 900;
  text-shadow: 
    0 1px 4px rgba(0, 0, 0, 0.8),
    0 0 12px rgba(0, 0, 0, 0.6);
}

.page-indicator {
  font-size: 0.8rem; /* Changed from 0.55rem */
  font-weight: 900;
  color: #ffffff !important;
  opacity: 1;
  white-space: nowrap;
  text-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.8),
    0 0 8px rgba(255, 255, 255, 0.5);
  background: rgba(0, 0, 0, 0.25);
  padding: 0.1rem 0.4rem;
  border-radius: 0.3rem;
  backdrop-filter: blur(5px);
}

/* Increased Height for Three Tiles */
.three-panel-layout-right {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.5rem;
  min-height: 200px; /* Increased from 160px */
  max-height: 230px;
  margin-bottom: 1.5rem;
}

.portfolio-panel {
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 
    0 0.4rem 1.2rem rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(20px);
  border: 2px solid;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  min-height: 240px;
  max-height: 300px;
  display: flex;
  flex-direction: column;
}

.three-panel-layout-right .portfolio-panel {
  min-height: 180px; /* Increased from 140px */
  padding: 0.8rem; /* Increased from 0.6rem */
}

.panel-content {
  font-size: 0.8rem; /* Updated base font size */
  line-height: 1.4; /* Increased line height for better readability */
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 3;
}

/* Reduced Performance Toolbar Height */
.performance-toolbar {
  display: flex;
  gap: 0.6rem;
  background: linear-gradient(135deg, 
    rgba(219, 234, 254, 0.95) 0%, 
    rgba(191, 219, 254, 0.9) 30%,
    rgba(147, 197, 253, 0.85) 70%,
    rgba(96, 165, 250, 0.8) 100%
  );
  border-radius: 0.8rem; /* Reduced from 1rem */
  padding: 0.6rem; /* Reduced from 0.8rem */
  box-shadow: 
    0 0.3rem 1rem rgba(59, 130, 246, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(59, 130, 246, 0.2);
  backdrop-filter: blur(15px);
  overflow-x: auto;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;
  min-height: 80px; /* Reduced from default */
}

.performance-metric-card {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.5rem;
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid rgba(147, 197, 253, 0.3);
  border-radius: 0.6rem; /* Reduced from 0.8rem */
  box-shadow: 0 0.1rem 0.4rem rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border-left: 3px solid;
  min-width: 0;
  flex: 1;
  max-width: 285px;
  position: relative;
  overflow: hidden;
  height: 60px; /* Fixed height for consistency */
}

/* Reduced Investment Quest Height */
.gaming-timeline-navigation {
  background: linear-gradient(145deg, rgb(42 145 213 / 95%) 0%, rgb(68 126 203 / 90%) 25%, rgba(191, 219, 254, 0.85) 50%, rgba(147, 197, 253, 0.8) 75%, rgba(96, 165, 250, 0.75) 100%);
  border: 2px solid rgba(147, 197, 253, 0.4);
  border-radius: 0.8rem;
  padding: 0.8rem 0.6rem; /* Reduced from 1rem 0.8rem */
  box-shadow: 
    0 10px 25px rgba(79, 70, 229, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(20px);
  margin-bottom: 0;
  margin-top:3rem;
  position: relative;
  min-height: 120px; /* Reduced from default */
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 10;
  flex-wrap: wrap;
  gap: 0.4rem; /* Reduced from 0.5rem */
  padding-bottom: 0.3rem; /* Reduced from 0.4rem */
  margin-bottom: 0.5rem; /* Reduced from 0.6rem */
}

.gaming-timeline-container {
  display: flex;
  align-items: center;
  gap: 1.2rem; /* Reduced from 1.5rem */
  position: relative;
  z-index: 5;
}

.timeline-track {
  flex: 1;
  position: relative;
  height: 45px; /* Reduced from 50px */
  display: flex;
  align-items: center;
  margin: 0.2rem 0; /* Reduced from 0.3rem 0 */
}

.timeline-navigation-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.6rem; /* Reduced from 1rem */
  padding: 0.6rem 0.8rem; /* Reduced from 0.8rem 1rem */
  background: rgba(255, 255, 255, 0.15);
  border-radius: 0.6rem; /* Reduced from 0.8rem */
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  flex-wrap: wrap;
  gap: 0.6rem; /* Reduced from 0.8rem */
}

/* Color-coded BUY/SELL text in events */
.event-line-enhanced.buy .event-type-compact {
  color: #4ade80 !important; /* Green for BUY */
  text-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.8), 
    0 0 8px rgba(74, 222, 128, 0.4);
  background: rgba(74, 222, 128, 0.2);
  border-radius: 0.2rem;
  padding: 0.1rem 0.3rem;
  border: 1px solid rgba(74, 222, 128, 0.3);
}

.event-line-enhanced.sell .event-type-compact {
  color: #ef4444 !important; /* Red for SELL */
  text-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.8), 
    0 0 8px rgba(239, 68, 68, 0.4);
  background: rgba(239, 68, 68, 0.2);
  border-radius: 0.2rem;
  padding: 0.1rem 0.3rem;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.event-line-enhanced.dividend .event-type-compact {
  color: #fbbf24 !important; /* Keep yellow for dividends */
  text-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.8), 
    0 0 8px rgba(251, 191, 36, 0.4);
  background: rgba(251, 191, 36, 0.2);
  border-radius: 0.2rem;
  padding: 0.1rem 0.3rem;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.dice-info-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  padding: 0.3rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 0.3rem;
  margin-top: 0.3rem;
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.info-icon {
  font-size: 0.7rem;
  opacity: 0.8;
}

.info-text {
  font-size: 0.55rem;
  color: #92400e;
  font-weight: 600;
  font-style: italic;
}

/* New Combined Header Styles */
.panel-header-combined {
  margin-bottom: 0.4rem;
  padding-bottom: 0.4rem; /* Reduced from previous 0.6rem */
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
  position: relative;
  z-index: 3;
  flex-shrink: 0;
}

.combined-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.panel-title-main {
  font-size: 0.7rem; /* Slightly smaller to fit */
  font-weight: 900;
  margin: 0;
  letter-spacing: 1px;
  color: #ffffff !important;
  text-shadow: 
    0 2px 6px rgba(0, 0, 0, 0.7),
    0 0 12px rgba(0, 0, 0, 0.5),
    1px 1px 0 rgba(0, 0, 0, 0.8);
  background: rgba(0, 0, 0, 0.25);
  padding: 0.15rem 0.4rem;
  border-radius: 0.3rem;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  flex: 1;
  min-width: 0; /* Allow text to truncate if needed */
}

.panel-badge {
  font-size: 0.5rem;
  font-weight: 800;
  color: #ffffff !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: rgba(0, 0, 0, 0.4);
  padding: 0.2rem 0.4rem;
  border-radius: 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(5px);
  text-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.8),
    0 0 6px rgba(0, 0, 0, 0.6);
  white-space: nowrap;
  flex-shrink: 0;
}

/* Responsive adjustments */
@media (max-width: 1400px) {
  .panel-title-main {
    font-size: 0.65rem;
    letter-spacing: 0.8px;
  }
  
  .panel-badge {
    font-size: 0.45rem;
    padding: 0.15rem 0.3rem;
  }
}

@media (max-width: 768px) {
  .combined-title-row {
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
  }
  
  .panel-title-main {
    font-size: 0.6rem;
    text-align: center;
  }
  
  .panel-badge {
    font-size: 0.4rem;
  }
}

/* Multi-line date display in timeline nodes */
.node-date-multiline {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 1;
  width: 100%;
}

.date-day-month {
  font-size: 0.6rem;
  font-weight: 900;
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
  white-space: nowrap;
  margin-bottom: 1px;
}

.date-year {
  font-size: 0.5rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  white-space: nowrap;
}

/* Event node specific styling */
.event-node .date-day-month {
  color: #0d47a1;
  text-shadow: 0 1px 2px rgba(13, 71, 161, 0.3);
}

.event-node .date-year {
  color: #1565c0;
  text-shadow: 0 1px 2px rgba(21, 101, 192, 0.3);
}

.event-node.completed .date-day-month,
.event-node.completed .date-year {
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.event-node.active .date-day-month,
.event-node.active .date-year {
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
}

/* Remove old single-line date styling */
.node-date-inside {
  display: none; /* Hide old single-line dates */
}

/* Adjust node core size for better fit */
.node-core {
  width: 48px; /* Slightly larger for two-line text */
  height: 48px;
}

.start-core, .end-core {
  width: 52px; /* Larger for start/end nodes */
  height: 52px;
}

@media (max-width: 600px) {
  .node-core {
    width: 42px;
    height: 42px;
  }
  
  .start-core, .end-core {
    width: 46px;
    height: 46px;
  }
  
  .date-day-month {
    font-size: 0.45rem;
  }
  
  .date-year {
    font-size: 0.35rem;
  }
}

/* Full-Screen Loading Overlay */
.full-screen-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: overlayFadeIn 0.3s ease-out;
}

.loading-background-blur {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, 
    rgba(30, 64, 175, 0.8) 0%, 
    rgba(59, 130, 246, 0.7) 25%, 
    rgba(99, 102, 241, 0.6) 50%, 
    rgba(129, 140, 248, 0.7) 75%, 
    rgba(165, 180, 252, 0.8) 100%
  );
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

@keyframes overlayFadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.loading-content-container {
  position: relative;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%);
  border-radius: 1.5rem;
  padding: 2.5rem 2rem;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(255, 255, 255, 0.3);
  animation: loadingSlideIn 0.5s ease-out;
}

@keyframes loadingSlideIn {
  0% { 
    transform: scale(0.9) translateY(20px);
    opacity: 0;
  }
  100% { 
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

.loading-spinner-container {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
}

.loading-spinner-enhanced {
  position: relative;
  width: 80px;
  height: 80px;
}

.spinner-ring-enhanced {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-radius: 50%;
  animation: spinEnhanced 1.5s infinite linear;
}

.spinner-ring-enhanced:nth-child(1) {
  border-top-color: #3b82f6;
  border-width: 4px;
  animation-delay: 0s;
  filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.5));
}

.spinner-ring-enhanced:nth-child(2) {
  border-top-color: #6366f1;
  border-width: 3px;
  animation-delay: 0.3s;
  width: 75%;
  height: 75%;
  top: 12.5%;
  left: 12.5%;
  filter: drop-shadow(0 0 6px rgba(99, 102, 241, 0.4));
}

.spinner-ring-enhanced:nth-child(3) {
  border-top-color: #8b5cf6;
  border-width: 2px;
  animation-delay: 0.6s;
  width: 50%;
  height: 50%;
  top: 25%;
  left: 25%;
  filter: drop-shadow(0 0 4px rgba(139, 92, 246, 0.3));
}

@keyframes spinEnhanced {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-message-container {
  margin-bottom: 2rem;
}

.loading-title-enhanced {
  font-size: 1.4rem;
  font-weight: 900;
  color: #1e40af;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 4px rgba(30, 64, 175, 0.2);
  animation: textPulse 2s infinite ease-in-out;
}

.loading-subtitle-enhanced {
  font-size: 0.9rem;
  color: #64748b;
  margin: 0;
  font-weight: 600;
  opacity: 0.8;
}

@keyframes textPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.loading-progress-dots-enhanced {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.dot-enhanced {
  width: 12px;
  height: 12px;
  background: #3b82f6;
  border-radius: 50%;
  animation: dotBounceEnhanced 1.4s infinite ease-in-out both;
  box-shadow: 
    0 0 8px rgba(59, 130, 246, 0.5),
    0 2px 4px rgba(0, 0, 0, 0.2);
}

.dot-enhanced:nth-child(1) { animation-delay: -0.32s; }
.dot-enhanced:nth-child(2) { animation-delay: -0.16s; }
.dot-enhanced:nth-child(3) { animation-delay: 0s; }
.dot-enhanced:nth-child(4) { animation-delay: 0.16s; }

@keyframes dotBounceEnhanced {
  0%, 80%, 100% {
    transform: scale(0);
    background: #3b82f6;
  }
  40% {
    transform: scale(1);
    background: #6366f1;
  }
}

.loading-footer-enhanced {
  border-top: 1px solid rgba(148, 163, 184, 0.2);
  padding-top: 1.5rem;
}

.loading-vivekam-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.loading-logo-icon {
  font-size: 1.3rem;
  filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.4));
}

.loading-logo-text {
  font-size: 1.2rem;
  font-weight: 900;
  background: linear-gradient(45deg, #1e40af, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 4px rgba(30, 64, 175, 0.1);
}

.loading-footer-text {
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 600;
  margin: 0;
  opacity: 0.8;
}

@media (max-width: 600px) {
  .loading-content-container {
    padding: 2rem 1.5rem;
    margin: 1rem;
  }
  
  .loading-spinner-enhanced {
    width: 60px;
    height: 60px;
  }
  
  .loading-title-enhanced {
    font-size: 1.2rem;
  }
  
  .loading-subtitle-enhanced {
    font-size: 0.8rem;
  }
}

.loading-spinner {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
}

.spinner-ring:nth-child(1) {
  border-top-color: #ffffff;
  border-width: 4px;
  animation-delay: 0s;
  filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.8));
}

.spinner-ring:nth-child(2) {
  border-top-color: #e3f2fd;
  border-width: 3px;
  animation-delay: 0.3s;
  width: 80%;
  height: 80%;
  top: 10%;
  left: 10%;
  filter: drop-shadow(0 0 4px rgba(227, 242, 253, 0.6));
}

.spinner-ring:nth-child(3) {
  border-top-color: #42a5f5;
  border-width: 2px;
  animation-delay: 0.6s;
  width: 60%;
  height: 60%;
  top: 20%;
  left: 20%;
  filter: drop-shadow(0 0 4px rgba(66, 165, 245, 0.6));
}
.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid transparent;
  border-radius: 50%;
  animation: spinnerRotate 1.5s infinite linear;
}

@keyframes spinnerRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-title {
  font-size: 1.5rem;
  font-weight: 900;
  margin-bottom: 1rem;
  color: #ffffff;
  text-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.8),
    0 0 10px rgba(0, 0, 0, 0.6),
    1px 1px 0 rgba(0, 0, 0, 0.9);
  animation: textShimmer 2s infinite ease-in-out;
}

@keyframes textShimmer {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.loading-progress-dots .dot {
  width: 10px;
  height: 10px;
  background: #ffffff;
  border-radius: 50%;
  animation: dotBounce 1.4s infinite ease-in-out both;
  box-shadow: 
    0 0 8px rgba(255, 255, 255, 0.8),
    0 2px 4px rgba(0, 0, 0, 0.3);
}
.loading-progress-dots .dot:nth-child(1) { animation-delay: -0.32s; }
.loading-progress-dots .dot:nth-child(2) { animation-delay: -0.16s; }
.loading-progress-dots .dot:nth-child(3) { animation-delay: 0s; }
.loading-progress-dots .dot:nth-child(4) { animation-delay: 0.16s; }

@keyframes dotBounce {
  0%, 80%, 100% {
    transform: scale(0);
    background: #42a5f5;
  }
  40% {
    transform: scale(1);
    background: #bbdefb;
  }
}

.loading-subtitle {
  font-size: 1rem;
  color: #ffffff;
  margin-bottom: 2rem;
  font-weight: 600;
  text-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.8),
    0 0 8px rgba(0, 0, 0, 0.6);
}

.loading-progress-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

/* Disable pointer events on main content when loading */
.journey-view:has(.full-screen-loading-overlay) > *:not(.full-screen-loading-overlay) {
  pointer-events: none;
  user-select: none;
}

.timeline-nav-control next-btn {
margin-left: 0.6rem;
}

/* Header Badges Container */
.header-badges {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
}

/* Count Badge Styles */
.count-badge {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 0.8rem;
  padding: 0.2rem 0.4rem;
  font-size: 0.5rem;
  font-weight: 800;
  color: #ffffff !important;
  text-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.8),
    0 0 6px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  box-shadow: 
    0 2px 6px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  white-space: nowrap;
  transition: all 0.3s ease;
}

.count-badge:hover {
  transform: scale(1.05);
  border-color: rgba(255, 255, 255, 0.6);
  box-shadow: 
    0 3px 8px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

/* Different colors for different badge types */
.count-badge.stocks-count {
  border-color: rgba(76, 175, 80, 0.6);
  background: rgba(76, 175, 80, 0.2);
}

.count-badge.stocks-count:hover {
  border-color: rgba(76, 175, 80, 0.8);
  background: rgba(76, 175, 80, 0.3);
}

.count-badge.events-count {
  border-color: rgba(255, 193, 7, 0.6);
background: rgb(1 7 22 / 20%);
}

.count-badge.events-count:hover {
  border-color: rgba(255, 193, 7, 0.8);
  background: rgba(255, 193, 7, 0.3);
}

.count-icon {
  font-size: 0.6rem;
  filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.3));
}

.count-text {
  font-size: 0.75rem;
  font-weight: 900;
  min-width: 12px;
  text-align: center;
}

/* Update combined title row to accommodate badges */
.combined-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.panel-title-main {
  flex: 1;
  min-width: 0;
}

/* Responsive adjustments */
@media (max-width: 1400px) {
  .count-badge {
    font-size: 0.45rem;
    padding: 0.15rem 0.3rem;
  }
  
  .count-icon {
    font-size: 0.5rem;
  }
  
  .count-text {
    font-size: 0.5rem;
  }
}

@media (max-width: 768px) {
  .header-badges {
    gap: 0.2rem;
  }
  
  .count-badge {
    font-size: 0.4rem;
    padding: 0.1rem 0.25rem;
  }
  
  .count-icon {
    font-size: 0.45rem;
  }
  
  .count-text {
    font-size: 0.45rem;
  }
}

@media (max-width: 320px) {
  .combined-title-row {
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
  }
}

.count-text {
  transition: all 0.3s ease;
}

.count-badge.updating .count-text {
  animation: countPulse 0.5s ease-out;
}

@keyframes countPulse {
  0% { 
    transform: scale(1);
    color: #ffffff;
  }
  50% { 
    transform: scale(1.2);
    color: #4ade80;
  }
  100% { 
    transform: scale(1);
    color: #ffffff;
  }
}

/* Vivekam Dialog Styles */
.vivekam-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: dialogFadeIn 0.4s ease-out;
}

.vivekam-dialog-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.vivekam-dialog-container {
  position: relative;
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 50%, #e2e8f0 100%);
  border-radius: 1.5rem;
  padding: 2rem;
  width: 500px;
  height: 550px;
  max-width: 90vw;
  max-height: 90vh;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(59, 130, 246, 0.2);
  animation: dialogSlideIn 0.5s ease-out;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

@keyframes dialogFadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes dialogSlideIn {
  0% { 
    transform: scale(0.9) translateY(20px);
    opacity: 0;
  }
  100% { 
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

.dialog-close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 35px;
  height: 35px;
  background: rgba(239, 68, 68, 0.1);
  border: 2px solid rgba(239, 68, 68, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0.4;
  pointer-events: none;
}

.dialog-close-btn.enabled {
  opacity: 1;
  pointer-events: auto;
  background: rgba(239, 68, 68, 0.2);
}

.dialog-close-btn.enabled:hover {
  background: rgba(239, 68, 68, 0.3);
  transform: scale(1.1);
  border-color: rgba(239, 68, 68, 0.6);
}

.close-icon {
  color: #ef4444;
  font-size: 1rem;
  font-weight: 900;
}

.dialog-header {
  text-align: center;
  margin-bottom: 1.5rem;
  flex-shrink: 0;
}

.vivekam-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  margin-bottom: 0.5rem;
}

.logo-icon {
  font-size: 2rem;
  filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.5));
}

.vivekam-title {
  font-size: 2rem;
  font-weight: 900;
  background: linear-gradient(45deg, #1e40af, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  text-shadow: 0 2px 4px rgba(30, 64, 175, 0.2);
}

.vivekam-subtitle {
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0;
}

.quote-container {
  text-align: center;
  margin-bottom: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 200px;
  max-height: 250px;
  overflow: hidden;
}

.quote-content {
  animation: quoteSlideIn 0.6s ease-out;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 1rem 0;
}

@keyframes quoteSlideIn {
  0% { 
    opacity: 0; 
    transform: translateY(10px);
  }
  100% { 
    opacity: 1; 
    transform: translateY(0);
  }
}

.quote-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 10px rgba(255, 193, 7, 0.5));
}

.main-quote {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e40af;
  font-style: italic;
  line-height: 1.4;
  margin: 0 0 1rem 0;
  text-shadow: 0 1px 2px rgba(30, 64, 175, 0.1);
  min-height: 120px;
  display: flex;
  align-items: center;
  text-align: center;
}

.quote-subtitle {
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 500;
  line-height: 1.4;
  margin: 0;
  min-height: 50px;
  display: flex;
  align-items: center;
  text-align: center;
}

.quote-indicators {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.quote-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(148, 163, 184, 0.4);
  transition: all 0.3s ease;
}

.quote-dot.active {
  background: #3b82f6;
  transform: scale(1.2);
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
}

.processing-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: rgba(59, 130, 246, 0.05);
  border-radius: 0.8rem;
  border: 1px solid rgba(59, 130, 246, 0.1);
  flex-shrink: 0;
  min-height: 80px;
}

.processing-spinner {
  position: relative;
}

.spinner-vivekam {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(59, 130, 246, 0.2);
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spinVivekam 1s linear infinite;
}

@keyframes spinVivekam {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.status-text {
  text-align: center;
  font-size: 0.9rem;
  font-weight: 600;
  color: #475569;
}

.completion-text {
  color: #059669 !important;
  font-weight: 700;
}

.dialog-footer {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(148, 163, 184, 0.2);
  flex-shrink: 0;
  margin-top: auto;
}

.footer-text {
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 500;
  margin: 0;
}

@media (max-width: 600px) {
  .vivekam-dialog-container {
    width: 95vw;
    height: 500px;
    padding: 1.5rem;
    margin: 1rem;
  }
  
  .main-quote {
    font-size: 1rem;
    min-height: 100px;
  }
  
  .quote-subtitle {
    font-size: 0.8rem;
    min-height: 40px;
  }
  
  .vivekam-title {
    font-size: 1.6rem;
  }
  
  .quote-container {
    min-height: 180px;
    max-height: 200px;
  }
}

/* Stock Animation Layer - Add this to your existing <style scoped> section */

/* Stock Animation Layer */
.stock-animation-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 1000;
  overflow: hidden;
}

.animated-stock-card {
  position: absolute;
  width: 120px;
  height: 80px;
  background: linear-gradient(145deg, 
    rgba(255, 255, 255, 0.95) 0%, 
    rgba(248, 250, 252, 0.9) 100%
  );
  border-radius: 0.8rem;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.12),
    0 0 0 2px var(--animation-color, #64748b);
  backdrop-filter: blur(10px);
  transform-origin: center center;
  will-change: transform, left, top;
  animation: stockCardPulse 0.6s ease-out;
  overflow: hidden;
}

@keyframes stockCardPulse {
  0% { 
    transform: translate(-50%, -50%) scale(0) rotate(-5deg);
    opacity: 0;
  }
  50% { 
    transform: translate(-50%, -50%) scale(1.1) rotate(0deg);
    opacity: 1;
  }
  100% { 
    transform: translate(-50%, -50%) scale(1) rotate(0deg);
    opacity: 1;
  }
}

/* Animation direction specific styles */
.animated-stock-card.entering {
  border-color: #22c55e;
  box-shadow: 
    0 8px 32px rgba(34, 197, 94, 0.3),
    0 0 20px rgba(34, 197, 94, 0.4);
}

.animated-stock-card.exiting {
  border-color: #ef4444;
  box-shadow: 
    0 8px 32px rgba(239, 68, 68, 0.3),
    0 0 20px rgba(239, 68, 68, 0.4);
}

.animated-stock-card.bouncing {
  border-color: #fbbf24;
  box-shadow: 
    0 8px 32px rgba(251, 191, 36, 0.3),
    0 0 20px rgba(251, 191, 36, 0.4);
  animation: stockCardBounce 1.2s ease-in-out;
}

@keyframes stockCardBounce {
  0%, 100% { transform: translate(-50%, -50%) scale(1) translateY(0); }
  25% { transform: translate(-50%, -50%) scale(1.1) translateY(-20px); }
  50% { transform: translate(-50%, -50%) scale(1.05) translateY(-40px); }
  75% { transform: translate(-50%, -50%) scale(1.1) translateY(-20px); }
}

.stock-card-content {
  position: relative;
  z-index: 2;
  padding: 0.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
}

.stock-symbol-anim {
  font-size: 0.8rem;
  font-weight: 900;
  color: #1e40af;
  text-shadow: 0 1px 2px rgba(30, 64, 175, 0.2);
  line-height: 1;
}

.stock-action-icon {
  font-size: 1.2rem;
  line-height: 1;
  filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.3));
  animation: iconRotate 0.8s ease-in-out infinite alternate;
}

@keyframes iconRotate {
  0% { transform: rotate(-5deg) scale(1); }
  100% { transform: rotate(5deg) scale(1.1); }
}

.tooltip-trades-compact .no-events-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-height: 120px;
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
  text-align: center;
}

.no-events-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  opacity: 0.4;
}

.no-events-text {
  font-size: 0.8rem;
}

.stock-quantity-anim {
  font-size: 0.7rem;
  font-weight: 700;
  color: #64748b;
  line-height: 1;
}

.stock-price-anim {
  font-size: 0.6rem;
  font-weight: 800;
  color: var(--animation-color, #64748b);
  line-height: 1;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Visual effects */
.stock-card-glow {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, 
    var(--animation-color, #64748b), 
    transparent, 
    var(--animation-color, #64748b)
  );
  border-radius: 0.9rem;
  z-index: 1;
  animation: glowPulse 2s ease-in-out infinite;
  opacity: 0.6;
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.02); }
}

.stock-card-trail {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  background: var(--animation-color, #64748b);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
  opacity: 0.8;
}

.stock-card-trail::before,
.stock-card-trail::after {
  content: '';
  position: absolute;
  width: 3px;
  height: 3px;
  background: var(--animation-color, #64748b);
  border-radius: 50%;
  opacity: 0.6;
}

.stock-card-trail::before {
  top: -10px;
  left: -5px;
  animation: trailMove1 1s ease-out infinite;
}

.stock-card-trail::after {
  top: -20px;
  left: 5px;
  animation: trailMove2 1s ease-out infinite 0.2s;
}

@keyframes trailMove1 {
  0% { opacity: 0; transform: scale(0); }
  50% { opacity: 0.6; transform: scale(1); }
  100% { opacity: 0; transform: scale(0); }
}

@keyframes trailMove2 {
  0% { opacity: 0; transform: scale(0); }
  50% { opacity: 0.4; transform: scale(1); }
  100% { opacity: 0; transform: scale(0); }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .animated-stock-card {
    width: 100px;
    height: 70px;
  }
  
  .stock-symbol-anim {
    font-size: 0.7rem;
  }
  
  .stock-action-icon {
    font-size: 1rem;
  }
  
  .stock-quantity-anim,
  .stock-price-anim {
    font-size: 0.6rem;
  }
}

@media (max-width: 480px) {
  .animated-stock-card {
    width: 80px;
    height: 60px;
  }
  
  .stock-symbol-anim {
    font-size: 0.6rem;
  }
  
  .stock-action-icon {
    font-size: 0.9rem;
  }
  
  .stock-quantity-anim,
  .stock-price-anim {
    font-size: 0.5rem;
  }
}

/* Enhanced panel highlighting during animations */
.journey-view.animating .start-portfolio {
  animation: panelHighlight 1.2s ease-in-out;
}

.journey-view.animating .final-portfolio {
  animation: panelHighlight 1.2s ease-in-out 0.3s;
}

.journey-view.animating .current-snapshot {
  animation: panelHighlight 1.2s ease-in-out 0.6s;
}

@keyframes panelHighlight {
  0%, 100% { 
    transform: scale(1);
    box-shadow: 0 0.4rem 1.2rem rgba(0, 0, 0, 0.1);
  }
  50% { 
    transform: scale(1.02);
    box-shadow: 
      0 0.8rem 2rem rgba(0, 0, 0, 0.15),
      0 0 20px rgba(59, 130, 246, 0.3);
  }
}

/* TEXT COLOR OVERRIDES FOR LIGHT PANELS */
.start-portfolio .panel-title-main,
.current-snapshot .panel-title-main,
.final-portfolio .panel-title-main {
  color: #1e40af !important;
  text-shadow: 0 1px 3px rgba(30, 64, 175, 0.3) !important;
  background: rgba(255, 255, 255, 0.6) !important;
}

.start-portfolio .panel-badge,
.current-snapshot .panel-badge,
.final-portfolio .panel-badge {
  color: #1e40af !important;
  background: rgba(255, 255, 255, 0.7) !important;
  border: 1px solid rgba(59, 130, 246, 0.4) !important;
  text-shadow: none !important;
}

.start-portfolio .stock-symbol,
.current-snapshot .stock-symbol,
.final-portfolio .stock-symbol {
  color: #1e3a8a !important;
  font-weight: 900 !important;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8) !important;
}

.start-portfolio .stock-price,
.start-portfolio .stock-quantity,
.current-snapshot .stock-price,
.current-snapshot .stock-quantity,
.final-portfolio .stock-price,
.final-portfolio .stock-quantity {
  color: #1f2937 !important;
  font-weight: 800 !important;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8) !important;
}

.start-portfolio .stock-value,
.current-snapshot .stock-value,
.final-portfolio .stock-value {
  color: #1e3a8a !important;
  font-weight: 900 !important;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8) !important;
}

.gaming-timeline-navigation .timeline-text {
  color: #1e40af !important;
  text-shadow: 0 1px 3px rgba(30, 64, 175, 0.3) !important;
}

.gaming-timeline-navigation .status-text {
  color: #374151 !important;
}

/* RIGHT PANE TEXT COLOR OVERRIDES */
.config-summary-panel .summary-title,
.dice-rolling-section .dice-section-title,
.journey-actions-left-pane .actions-title {
  color: #1e40af !important;
}

.config-summary-panel .detail-label,
.dice-rolling-section .dice-section-subtitle {
  color: #374151 !important;
}

.config-summary-panel .detail-value {
  color: #0369a1 !important;
}

.dice-rolling-section .control-title {
  color: #1e40af !important;
}

.dice-rolling-section .control-subtitle {
  color: #374151 !important;
}

.configuration-pane .config-header-title,
.dice-pane .dice-header-title {
  color: #1e40af !important;
}

.configuration-pane .config-header-subtitle,
.dice-pane .dice-header-subtitle {
  color: #374151 !important;
}

.current-snapshot .price-item-compact.low {
  color: #dc2626 !important;
  background: rgba(254, 242, 242, 0.95) !important;
  font-weight: 900 !important;
}

.current-snapshot .price-item-compact.high {
  color: #059669 !important;
  background: rgba(236, 253, 245, 0.95) !important;
  font-weight: 900 !important;
}

.current-snapshot .price-item-compact.buy {
  color: #d97706 !important;
  background: rgba(255, 251, 235, 0.95) !important;
  font-weight: 900 !important;
}

.current-snapshot .price-item-compact.current {
  color: #1e3a8a !important;
  background: rgba(239, 246, 255, 0.95) !important;
  font-weight: 900 !important;
}

.timeline-node.start-node .date-day-month,
.timeline-node.start-node .date-year {
  color: #ffffff !important;
  text-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.8),
    0 0 8px rgba(5, 150, 105, 0.6) !important;
  font-weight: 900 !important;
}

.timeline-node.end-node .node-core {
  background: linear-gradient(145deg, #7c3aed, #a855f7, #c084fc) !important;
  border: 3px solid #ffffff !important;
  box-shadow: 
    0 0 35px rgba(124, 58, 237, 0.9),
    inset 0 2px 6px rgba(255, 255, 255, 0.3),
    0 0 0 3px rgba(124, 58, 237, 0.4) !important;
  position: relative;
}

.timeline-node.end-node .date-day-month,
.timeline-node.end-node .date-year {
  color: #ffffff !important;
  text-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.8),
    0 0 8px rgba(124, 58, 237, 0.6) !important;
  font-weight: 900 !important;
}

/* Enhanced glow effects for start and end nodes */
.timeline-node.start-node {
  filter: drop-shadow(0 0 15px rgba(5, 150, 105, 0.4));
}

.timeline-node.end-node {
  filter: drop-shadow(0 0 15px rgba(124, 58, 237, 0.4));
}

.timeline-node.start-node:hover {
  filter: drop-shadow(0 0 25px rgba(5, 150, 105, 0.7));
  transform: translate(-50%, -50%) scale(1.05) !important;
}

.timeline-node.end-node:hover {
  filter: drop-shadow(0 0 25px rgba(124, 58, 237, 0.7));
  transform: translate(-50%, -50%) scale(1.05) !important;
}

.timeline-node.start-node .node-core,
.timeline-node.end-node .node-core {
  width: 52px !important;
  height: 52px !important;
}

.timeline-node.start-node .node-ring,
.timeline-node.end-node .node-ring {
  width: 58px !important;
  height: 58px !important;
}

.timeline-node.event-node .node-core {
  background: linear-gradient(145deg, rgba(59, 130, 246, 0.8), rgba(147, 197, 253, 0.6)) !important;
  border: 2px solid rgba(59, 130, 246, 0.4) !important;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3) !important;
}

.timeline-node.event-node .node-ring {
  border: 2px solid rgba(59, 130, 246, 0.4) !important;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.3) !important;
}

.timeline-node.active .node-core {
  background: linear-gradient(145deg, #f59e0b, #fbbf24, #fcd34d) !important;
  border: 4px solid #ffffff !important;
  box-shadow: 
    0 0 30px rgba(245, 158, 11, 0.9),
    0 0 50px rgba(251, 191, 36, 0.6),
    inset 0 2px 6px rgba(255, 255, 255, 0.3) !important;
  transform: translate(-50%, -50%) scale(1.1) !important;
  z-index: 15 !important;
}

.timeline-node.active .node-ring {
  border: 4px solid #f59e0b !important;
  border-width: 4px !important;
  box-shadow: 
    0 0 25px rgba(245, 158, 11, 0.8),
    0 0 40px rgba(251, 191, 36, 0.6) !important;
  animation: activeRingPulse 1s infinite ease-in-out !important;
  z-index: 14 !important;
}

@keyframes activeRingPulse {
  0%, 100% { 
    transform: translate(-50%, -50%) scale(1);
    border-color: #f59e0b;
    box-shadow: 
      0 0 25px rgba(245, 158, 11, 0.8),
      0 0 40px rgba(251, 191, 36, 0.6);
  }
  50% { 
    transform: translate(-50%, -50%) scale(1.15);
    border-color: #fbbf24;
    box-shadow: 
      0 0 35px rgba(251, 191, 36, 1.0),
      0 0 60px rgba(252, 211, 77, 0.8);
  }
}

.timeline-node.active .date-day-month,
.timeline-node.active .date-year {
  text-shadow: 
    0 1px 2px rgba(255, 255, 255, 0.9),
    0 2px 4px rgba(255, 255, 255, 0.6),
    0 0 0 1px rgba(146, 64, 14, 0.8) !important;
  font-weight: 900 !important;
  padding: 2px 5px;
  border-radius: 4px;
}

.timeline-node.start-node .node-core {
  background: linear-gradient(145deg, #1e40af, #3b82f6, #60a5fa) !important;
  border: 3px solid #ffffff !important;
  box-shadow: 
    0 0 30px rgba(30, 64, 175, 0.8),
    inset 0 2px 6px rgba(255, 255, 255, 0.3),
    0 0 0 3px rgba(30, 64, 175, 0.4) !important;
}

.timeline-node.start-node .node-ring {
  border: 4px solid #1e40af !important;
  box-shadow: 
    0 0 25px rgba(30, 64, 175, 0.7),
    inset 0 0 10px rgba(30, 64, 175, 0.2) !important;
  animation: startRingPulse 2s infinite ease-in-out !important;
}

.timeline-node.end-node .node-core {
  background: linear-gradient(145deg, #1e40af, #3b82f6, #60a5fa) !important;
  border: 3px solid #ffffff !important;
  box-shadow: 
    0 0 35px rgba(30, 64, 175, 0.9),
    inset 0 2px 6px rgba(255, 255, 255, 0.3),
    0 0 0 3px rgba(30, 64, 175, 0.4) !important;
}

.timeline-node.end-node .node-ring {
  border: 4px solid #1e40af !important;
  box-shadow: 
    0 0 30px rgba(30, 64, 175, 0.8),
    inset 0 0 10px rgba(30, 64, 175, 0.2) !important;
  animation: endRingPulse 2s infinite ease-in-out !important;
}

@keyframes startRingPulse {
  0%, 100% { 
    transform: translate(-50%, -50%) scale(1);
    border-color: #1e40af;
    box-shadow: 0 0 25px rgba(30, 64, 175, 0.7);
  }
  50% { 
    transform: translate(-50%, -50%) scale(1.08);
    border-color: #3b82f6;
    box-shadow: 0 0 35px rgba(59, 130, 246, 0.9);
  }
}

@keyframes endRingPulse {
  0%, 100% { 
    transform: translate(-50%, -50%) scale(1);
    border-color: #1e40af;
    box-shadow: 0 0 30px rgba(30, 64, 175, 0.8);
  }
  50% { 
    transform: translate(-50%, -50%) scale(1.08);
    border-color: #3b82f6;
    box-shadow: 0 0 40px rgba(59, 130, 246, 1.0);
  }
}

/* Exit Confirmation Dialog */
.exit-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: dialogFadeIn 0.3s ease-out;
}

.exit-dialog-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.exit-dialog-container {
  position: relative;
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 50%, #e2e8f0 100%);
  border-radius: 1.5rem;
  padding: 2rem;
  max-width: 450px;
  width: 90%;
  box-shadow: 
    0 25px 75px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(239, 68, 68, 0.2);
  animation: exitDialogSlideIn 0.4s ease-out;
  text-align: center;
}

@keyframes exitDialogSlideIn {
  0% { 
    transform: scale(0.8) translateY(30px);
    opacity: 0;
  }
  100% { 
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

.exit-dialog-header {
  margin-bottom: 1.5rem;
}

.exit-icon {
  font-size: 3rem;
  margin-bottom: 0.8rem;
  filter: drop-shadow(0 0 15px rgba(239, 68, 68, 0.3));
  animation: exitIconPulse 2s infinite ease-in-out;
}

@keyframes exitIconPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.exit-title {
  font-size: 1.5rem;
  font-weight: 900;
  color: #dc2626;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 1px 2px rgba(220, 38, 38, 0.2);
}

.exit-subtitle {
  font-size: 0.9rem;
  color: #64748b;
  margin: 0;
  font-weight: 600;
}

.exit-message-container {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.2rem;
  background: rgba(254, 242, 242, 0.8);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 1rem;
  margin-bottom: 2rem;
}

.exit-warning-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-top: 0.2rem;
  filter: drop-shadow(0 0 5px rgba(245, 158, 11, 0.5));
}

.exit-message {
  text-align: left;
  flex: 1;
}

.exit-main-text {
  font-size: 0.9rem;
  font-weight: 700;
  color: #dc2626;
  margin: 0 0 0.3rem 0;
  line-height: 1.4;
}

.exit-sub-text {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0;
  font-weight: 500;
  line-height: 1.3;
}

.exit-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.exit-btn {
  flex: 1;
  padding: 0.8rem 1rem;
  border: none;
  border-radius: 0.8rem;
  font-weight: 800;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 0.3rem 0.8rem rgba(0, 0, 0, 0.2);
}

.cancel-btn {
  background: linear-gradient(135deg, #64748b, #94a3b8);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.cancel-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1.2rem rgba(100, 116, 139, 0.4);
  background: linear-gradient(135deg, #475569, #64748b);
}

.confirm-btn {
  background: linear-gradient(135deg, #dc2626, #ef4444);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.confirm-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1.2rem rgba(220, 38, 38, 0.5);
  background: linear-gradient(135deg, #b91c1c, #dc2626);
}

.exit-btn .btn-icon {
  font-size: 1rem;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
}

.exit-btn .btn-text {
  font-size: 0.75rem;
  font-weight: 900;
}

.exit-dialog-footer {
  border-top: 1px solid rgba(148, 163, 184, 0.2);
  padding-top: 1rem;
}

.footer-note {
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 500;
  margin: 0;
  font-style: italic;
}

/* Mobile Responsive */
@media (max-width: 600px) {
  .exit-dialog-container {
    padding: 1.5rem;
    margin: 1rem;
  }
  
  .exit-actions {
    flex-direction: column;
    gap: 0.8rem;
  }
  
  .exit-title {
    font-size: 1.3rem;
  }
  
  .exit-icon {
    font-size: 2.5rem;
  }
}

/* Disable interactions with background content */
.journey-view:has(.exit-dialog-overlay) > *:not(.exit-dialog-overlay) {
  pointer-events: none;
  user-select: none;
}

/* Cash highlight animation when sell animation reaches it */
.cash-amount.highlight {
  animation: cashHighlight 1s ease-out;
}

@keyframes cashHighlight {
  0% { 
    transform: scale(1);
    color: #4ade80;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8), 0 0 10px rgba(74, 222, 128, 0.6);
  }
  50% { 
    transform: scale(1.15);
    color: #22c55e;
    text-shadow: 
      0 1px 4px rgba(0, 0, 0, 0.8), 
      0 0 20px rgba(34, 197, 94, 0.8),
      0 0 30px rgba(74, 222, 128, 0.6);
  }
  100% { 
    transform: scale(1);
    color: #4ade80;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8), 0 0 10px rgba(74, 222, 128, 0.6);
  }
}

/* Enhanced sell animation trail effect */
.animated-stock-card.exiting .stock-card-trail::before,
.animated-stock-card.exiting .stock-card-trail::after {
  background: #ef4444;
  animation-duration: 1.5s; /* Longer trail for slower animation */
}
</style>