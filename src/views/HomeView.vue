<template>
    <div class="home-view">
      <AnimatedBackground :particle-count="10" />
      <div class="setup-container">
        <h2 class="setup-title">SET YOUR STARTING POINT</h2>
        
        <div class="date-selector">
          <div class="date-block">
            <div class="date-label">DAY</div>
            <div class="date-value">
              <button class="date-arrow left" @click="decrementDay">
                <span>&lt;</span>
              </button>
              <div class="date-number">{{ store.startDate.day }}</div>
              <button class="date-arrow right" @click="incrementDay">
                <span>&gt;</span>
              </button>
            </div>
          </div>
          
          <div class="date-block">
            <div class="date-label">MONTH</div>
            <div class="date-value">
              <button class="date-arrow left" @click="decrementMonth">
                <span>&lt;</span>
              </button>
              <div class="date-number">{{ store.startDate.month }}</div>
              <button class="date-arrow right" @click="incrementMonth">
                <span>&gt;</span>
              </button>
            </div>
          </div>
          
          <div class="date-block">
            <div class="date-label">YEAR</div>
            <div class="date-value">
              <button class="date-arrow left" @click="decrementYear">
                <span>&lt;</span>
              </button>
              <div class="date-number">{{ store.startDate.year }}</div>
              <button class="date-arrow right" @click="incrementYear">
                <span>&gt;</span>
              </button>
            </div>
          </div>
        </div>
        
        <div class="product-selector">
          <div class="product-name">{{ store.selectedProduct }}</div>
          <button class="product-arrow">
            <span>&gt;</span>
          </button>
        </div>
        
        <div class="investment-slider">
          <div class="investment-value">₹ {{ formatCurrency(store.initialInvestment) }}</div>
          <input 
            type="range" 
            min="10000" 
            max="100000" 
            step="10000" 
            v-model="sliderValue"
            @input="updateInvestment"
          />
        </div>
        
        <div class="time-travel-container">
          <h3 class="time-travel-title">TIME TRAVEL SELECTOR</h3>
          
          <div class="dice-container">
            <div class="dice">
              <div class="dice-face">
                <span class="dice-value">{{ store.selectedDays }}</span>
                <span class="dice-label">DAYS</span>
              </div>
            </div>
            
            <div class="dice-controls">
              <button 
                class="dice-btn" 
                @click="store.increaseSelectedDays()"
                :disabled="store.rollsRemaining <= 0"
              >
                +5
              </button>
            </div>
          </div>
          
          <div class="dice-info">
            <div class="selected-days">SELECTED DAYS: {{ store.selectedDays }}</div>
            <div class="rolls-remaining">ROLLS REMAINING: {{ store.rollsRemaining }}</div>
          </div>
          
          <div class="destination-date">
            <span class="calendar-icon">📅</span>
            <span class="date-label">DESTINATION DATE: {{ store.destinationDate }}</span>
          </div>
        </div>
        
        <button class="game-btn start-btn" @click="startJourney">
          START JOURNEY
        </button>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useInvestmentStore } from '@/stores/investment';
  import GameButton from '@/components/common/GameButton.vue';
  import AnimatedBackground from '@/components/common/AnimatedBackground.vue';
  
  export default defineComponent({
    name: 'HomeView',
    
    components: {
      GameButton,
      AnimatedBackground
    },
    setup() {
      const router = useRouter();
      const store = useInvestmentStore();
      
      const sliderValue = ref<string>(store.initialInvestment.toString());
      
      const months = [
        'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 
        'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
      ];
      
      const updateInvestment = () => {
        store.updateInitialInvestment(parseInt(sliderValue.value));
      };
      
      const incrementDay = () => {
        if (store.startDate.day < 31) {
          store.updateStartDate(
            store.startDate.day + 1,
            store.startDate.month,
            store.startDate.year
          );
        }
      };
      
      const decrementDay = () => {
        if (store.startDate.day > 1) {
          store.updateStartDate(
            store.startDate.day - 1,
            store.startDate.month,
            store.startDate.year
          );
        }
      };
      
      const incrementMonth = () => {
        const currentIndex = months.indexOf(store.startDate.month);
        if (currentIndex < months.length - 1) {
          store.updateStartDate(
            store.startDate.day,
            months[currentIndex + 1],
            store.startDate.year
          );
        }
      };
      
      const decrementMonth = () => {
        const currentIndex = months.indexOf(store.startDate.month);
        if (currentIndex > 0) {
          store.updateStartDate(
            store.startDate.day,
            months[currentIndex - 1],
            store.startDate.year
          );
        }
      };
      
      const incrementYear = () => {
        store.updateStartDate(
          store.startDate.day,
          store.startDate.month,
          store.startDate.year + 1
        );
      };
      
      const decrementYear = () => {
        store.updateStartDate(
          store.startDate.day,
          store.startDate.month,
          store.startDate.year - 1
        );
      };
      
      const startJourney = () => {
        store.setupJourney();
        router.push('/journey');
      };
      
      const formatCurrency = (value: number): string => {
        return value.toLocaleString('en-IN');
      };
      
      return {
        store,
        sliderValue,
        updateInvestment,
        incrementDay,
        decrementDay,
        incrementMonth,
        decrementMonth,
        incrementYear,
        decrementYear,
        startJourney,
        formatCurrency
      };
    }
  });
  </script>
  
  <style scoped>
  .home-view {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 80px);
    position: relative;
    animation: fadeIn 0.8s ease-out;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  .setup-container {
    max-width: 600px;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    gap: 25px;
    animation: slideUp 1s ease-out;
    position: relative;
    z-index: 1;
    backdrop-filter: blur(10px);
  }
  
  @keyframes slideUp {
    from {
      transform: translateY(50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .setup-title {
    color: var(--secondary);
    text-align: center;
    margin-bottom: 20px;
    font-size: 1.8rem;
  }
  
  .date-selector {
    display: flex;
    justify-content: space-between;
    gap: 15px;
  }
  
  .date-block {
    flex: 1;
    background-color: var(--accent);
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  
  .date-label {
    background-color: rgba(0, 0, 0, 0.1);
    padding: 8px;
    text-align: center;
    font-weight: bold;
  }
  
  .date-value {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
  }
  
  .date-number {
    font-size: 1.5rem;
    font-weight: bold;
    flex: 1;
    text-align: center;
  }
  
  .date-arrow {
    background: none;
    border: none;
    color: var(--light);
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0 10px;
  }
  
  .date-arrow:hover {
    color: var(--secondary);
  }
  
  .product-selector {
    background-color: var(--accent);
    border-radius: 30px;
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  
  .product-name {
    font-size: 1.2rem;
    font-weight: bold;
  }
  
  .product-arrow {
    background-color: rgba(0, 0, 0, 0.1);
    border: none;
    color: var(--light);
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  
  .investment-slider {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 15px;
    padding: 20px;
  }
  
  .investment-value {
    color: var(--secondary);
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 15px;
  }
  
  .time-travel-container {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 15px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .time-travel-title {
    color: var(--secondary);
    text-align: center;
    margin-bottom: 10px;
  }
  
  .dice-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin: 15px 0;
  }
  
  .dice-btn {
    background-color: var(--secondary);
    color: var(--dark);
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .dice-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .dice-info {
    display: flex;
    justify-content: space-between;
    color: var(--light);
    font-size: 0.9rem;
  }
  
  .destination-date {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 10px;
    color: var(--secondary);
    font-weight: bold;
  }
  
  .calendar-icon {
    font-size: 1.5rem;
  }
  
  .start-btn {
    margin-top: 20px;
    padding: 15px;
    font-size: 1.2rem;
    width: 100%;
  }
  </style>