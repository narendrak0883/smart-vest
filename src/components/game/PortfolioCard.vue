<template>
    <div class="portfolio-card" :class="cardType">
      <div class="card-header">
        <h3 class="card-title">{{ title }}</h3>
        <div v-if="dayInfo" class="day-info">{{ dayInfo }}</div>
      </div>
      
      <div class="stocks-container">
        <StockCard 
          v-for="stock in stocks" 
          :key="stock.id" 
          :stock="stock"
        />
      </div>
      
      <div class="portfolio-summary">
        <div class="summary-item">
          <span class="summary-label">Cash:</span>
          <span class="summary-value">₹{{ formatCurrency(cash) }}</span>
        </div>
        
        <div class="summary-item total">
          <span class="summary-label">Total Value:</span>
          <span class="summary-value">₹{{ formatCurrency(totalValue) }}</span>
        </div>
        
        <div v-if="showPerformance" class="summary-item performance">
          <span class="summary-label">Performance:</span>
          <span class="summary-value">
            <span class="performance-badge" :class="performanceClass">
              {{ performanceText }} vs NIFTY {{ niftyText }}
            </span>
          </span>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, computed } from 'vue';
  import type { PropType } from 'vue';
  import type { Stock } from '@/types';
  import StockCard from './StockCard.vue';
  
  export default defineComponent({
    name: 'PortfolioCard',
    
    components: {
      StockCard
    },
    
    props: {
      title: {
        type: String,
        required: true
      },
      dayInfo: {
        type: String,
        default: ''
      },
      stocks: {
        type: Array as PropType<Stock[]>,
        required: true
      },
      cash: {
        type: Number,
        required: true
      },
      totalValue: {
        type: Number,
        required: true
      },
      performance: {
        type: Number,
        default: 0
      },
      niftyPerformance: {
        type: Number,
        default: 0
      },
      cardType: {
        type: String as PropType<'start' | 'current' | 'final'>,
        default: 'current'
      },
      showPerformance: {
        type: Boolean,
        default: false
      }
    },
    
    setup(props) {
      const formatCurrency = (value: number): string => {
        return value.toLocaleString('en-IN');
      };
      
      const performanceText = computed((): string => {
        return `${props.performance >= 0 ? '+' : ''}${props.performance.toFixed(1)}%`;
      });
      
      const niftyText = computed((): string => {
        return `${props.niftyPerformance >= 0 ? '+' : ''}${props.niftyPerformance.toFixed(1)}%`;
      });
      
      const performanceClass = computed((): string => {
        return props.performance >= 0 ? 'positive' : 'negative';
      });
      
      return {
        formatCurrency,
        performanceText,
        niftyText,
        performanceClass
      };
    }
  });
  </script>
  
  <style scoped>
  .portfolio-card {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .portfolio-card.start {
    background-color: var(--accent);
    color: var(--light);
  }
  
  .portfolio-card.final {
    background-color: var(--secondary);
    color: var(--dark);
  }
  
  .card-header {
    padding: 15px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .start .card-header, .final .card-header {
    background-color: rgba(0, 0, 0, 0.1);
  }
  
  .card-title {
    font-size: 1.3rem;
    margin-bottom: 5px;
    text-align: center;
  }
  
  .day-info {
    font-size: 0.9rem;
    opacity: 0.8;
    text-align: center;
  }
  
  .stocks-container {
    padding: 15px;
    flex: 1;
    overflow-y: auto;
    max-height: 300px;
  }
  
  .portfolio-summary {
    padding: 15px 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    background-color: rgba(0, 0, 0, 0.1);
  }
  
  .summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
  }
  
  .summary-item.total {
    font-weight: bold;
    font-size: 1.1rem;
    margin-top: 10px;
  }
  
  .summary-item.performance {
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .summary-label {
    color: rgba(255, 255, 255, 0.8);
  }
  
  .final .summary-label {
    color: rgba(0, 0, 0, 0.7);
  }
  
  .performance-badge {
    padding: 5px 15px;
    border-radius: 15px;
    font-weight: bold;
    font-size: 0.9rem;
    text-align: center;
    display: inline-block;
    width: 100%;
  }
  
  .performance-badge.positive {
    background-color: rgba(0, 229, 183, 0.2);
    color: var(--secondary);
  }
  
  .performance-badge.negative {
    background-color: rgba(244, 67, 54, 0.2);
    color: var(--error);
  }
  
  .final .performance-badge.positive {
    background-color: rgba(255, 255, 255, 0.2);
    color: var(--dark);
  }
  </style>