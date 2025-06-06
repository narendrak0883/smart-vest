<template>
    <div class="stock-item" :class="{ 'selected': selected }">
      <div class="stock-header">
        <div class="stock-id">{{ stock.id }}</div>
        <div class="stock-name">{{ stock.name }}</div>
      </div>
      
      <div class="stock-details">
        <div class="stock-quantity">
          <span class="detail-label">Quantity:</span>
          <span class="detail-value">{{ stock.quantity }}</span>
        </div>
        
        <div class="stock-price">
          <span class="detail-label">Price:</span>
          <span class="detail-value">₹{{ stock.price }}</span>
        </div>
        
        <div class="stock-amount">
          <span class="detail-label">Value:</span>
          <span class="detail-value">₹{{ formatCurrency(stock.amount) }}</span>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import type { PropType } from 'vue';
  import type { Stock } from '@/types';
  
  export default defineComponent({
    name: 'StockCard',
    
    props: {
      stock: {
        type: Object as PropType<Stock>,
        required: true
      },
      selected: {
        type: Boolean,
        default: false
      }
    },
    
    setup() {
      const formatCurrency = (value: number): string => {
        return value.toLocaleString('en-IN');
      };
      
      return {
        formatCurrency
      };
    }
  });
  </script>
  
  <style scoped>
  .stock-item {
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 10px;
    transition: all 0.3s ease;
    border: 2px solid transparent;
  }
  
  .stock-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
  
  .stock-item.selected {
    border-color: var(--secondary);
    box-shadow: 0 0 15px rgba(0, 229, 183, 0.3);
  }
  
  .stock-header {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    background-color: rgba(0, 0, 0, 0.2);
  }
  
  .stock-id {
    background-color: var(--accent);
    color: var(--light);
    width: 25px;
    height: 25px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-right: 10px;
    font-size: 0.9rem;
  }
  
  .stock-name {
    font-weight: bold;
    font-size: 1.1rem;
  }
  
  .stock-details {
    padding: 12px 15px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .stock-quantity, .stock-price, .stock-amount {
    flex: 1;
    min-width: 30%;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    padding: 8px 12px;
    display: flex;
    flex-direction: column;
  }
  
  .detail-label {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 3px;
  }
  
  .detail-value {
    font-weight: bold;
  }
  
  .stock-amount .detail-value {
    color: var(--secondary);
  }
  </style>