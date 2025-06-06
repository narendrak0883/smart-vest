<template>
    <div class="performance-metrics">
      <div 
        v-for="(metric, index) in metrics" 
        :key="index" 
        class="metric-card"
        :class="{ 'up': metric.trend === 'up', 'down': metric.trend === 'down' }"
      >
        <div class="metric-icon">
          <span v-if="metric.trend === 'up'">↗</span>
          <span v-else-if="metric.trend === 'down'">↘</span>
          <span v-else>●</span>
        </div>
        <div class="metric-content">
          <div class="metric-value">{{ metric.value }}</div>
          <div class="metric-label">{{ metric.label }}</div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import type { PropType } from 'vue';
  
  interface Metric {
    value: string;
    label: string;
    trend?: 'up' | 'down' | 'neutral';
  }
  
  export default defineComponent({
    name: 'PerformanceMetrics',
    
    props: {
      metrics: {
        type: Array as PropType<Metric[]>,
        required: true
      }
    }
  });
  </script>
  
  <style scoped>
  .performance-metrics {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 20px;
  }
  
  .metric-card {
    flex: 1;
    min-width: 150px;
    background-color: #f8f9fa;
    border-radius: 10px;
    padding: 15px;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    border-left: 4px solid #ccc;
  }
  
  .metric-card.up {
    border-left-color: #00E5B7;
  }
  
  .metric-card.down {
    border-left-color: #FF7D00;
  }
  
  .metric-icon {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #f1f1f1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
    font-size: 1.2rem;
  }
  
  .up .metric-icon {
    background-color: rgba(0, 229, 183, 0.1);
    color: #00E5B7;
  }
  
  .down .metric-icon {
    background-color: rgba(255, 125, 0, 0.1);
    color: #FF7D00;
  }
  
  .metric-content {
    flex: 1;
  }
  
  .metric-value {
    font-weight: bold;
    font-size: 1.2rem;
    margin-bottom: 5px;
    color: #231651;
  }
  
  .metric-label {
    font-size: 0.8rem;
    color: #666;
  }
  
  @media (max-width: 768px) {
    .metric-card {
      min-width: 120px;
    }
  }
  </style>