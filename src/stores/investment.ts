// src/stores/investment.ts
import { defineStore } from 'pinia';
import { 
  type InvestmentState,
  type JourneyDay
} from '../types/index';

export const useInvestmentStore = defineStore('investment', {
  state: (): InvestmentState => ({
    // Journey configuration
    startDate: {
      day: 12,
      month: 'AUGUST',
      year: 2016
    },
    selectedProduct: 'Product A',
    initialInvestment: 50000,
    selectedDays: 5,
    rollsRemaining: 2,
    destinationDate: 'SEP 23, 2016',
    journeyStarted: false,
    
    // Portfolio data
    startPortfolio: {
      cash: 0,
      stocks: [
        { id: 'A', name: 'Stock A', amount: 25000, price: 250, quantity: 100 },
        { id: 'B', name: 'Stock B', amount: 25000, price: 500, quantity: 50 },
        { id: 'C', name: 'Stock C', amount: 25000, price: 2500, quantity: 10 },
        { id: 'D', name: 'Stock D', amount: 25000, price: 500, quantity: 50 }
      ]
    },
    
    finalPortfolio: {
      cash: 1000,
      stocks: [
        { id: 'A', name: 'Stock A', amount: 27000, price: 270, quantity: 100 },
        { id: 'B', name: 'Stock B', amount: 27500, price: 550, quantity: 50 },
        { id: 'C', name: 'Stock C', amount: 27000, price: 2700, quantity: 10 },
        { id: 'E', name: 'Stock E', amount: 25500, price: 510, quantity: 50 }
      ]
    },
    
    // Daily journey data
    journeyDays: [
      {
        date: 'AUG 23',
        dayNum: 1,
        events: [],
        portfolio: {
          cash: 0,
          totalValue: 100000,
          percentChange: 0,
          niftyChange: 0
        }
      },
      {
        date: 'AUG 24',
        dayNum: 2,
        events: [],
        portfolio: {
          cash: 0,
          totalValue: 101500,
          percentChange: 1.5,
          niftyChange: 0.5
        }
      },
      {
        date: 'AUG 25',
        dayNum: 3,
        events: [
          {
            type: "SELL",
            stock: 'Stock D',
            quantity: 50,
            price: 500,
            total: 25000,
            botComment: 'Sold Stock D at fair value'
          }
        ],
        portfolio: {
          cash: 25000,
          totalValue: 102000,
          percentChange: 2.0,
          niftyChange: 0.8
        }
      },
      {
        date: 'AUG 26',
        dayNum: 4,
        events: [
          {
            type: "BUY",
            stock: 'Stock E',
            quantity: 50,
            price: 480,
            total: 24000,
            botComment: 'Bought Stock E at a good price'
          }
        ],
        portfolio: {
          cash: 1000,
          totalValue: 103500,
          percentChange: 3.5,
          niftyChange: 1.0
        }
      },
      {
        date: 'AUG 27',
        dayNum: 5,
        events: [],
        portfolio: {
          cash: 1000,
          totalValue: 104600,
          percentChange: 4.6,
          niftyChange: 1.5
        }
      }
    ],
    currentDayIndex: 0
  }),
  
  getters: {
    currentDay: (state): JourneyDay => {
      return state.journeyDays[state.currentDayIndex];
    },
    
    portfolioValue: (state): number => {
      return state.journeyDays[state.currentDayIndex].portfolio.totalValue;
    },
    
    portfolioGain: (state): number => {
      return state.journeyDays[state.currentDayIndex].portfolio.percentChange;
    },
    
    niftyGain: (state): number => {
      return state.journeyDays[state.currentDayIndex].portfolio.niftyChange;
    },
    
    versusNifty: (state): number => {
      const day = state.journeyDays[state.currentDayIndex];
      return day.portfolio.percentChange - day.portfolio.niftyChange;
    },
    
    totalStockValue: (state): number => {
      if (state.currentDayIndex === state.journeyDays.length - 1) {
        const stocks = state.finalPortfolio.stocks;
        return stocks.reduce((total, stock) => total + stock.amount, 0);
      } else if (state.currentDayIndex === 0) {
        const stocks = state.startPortfolio.stocks;
        return stocks.reduce((total, stock) => total + stock.amount, 0);
      } else {
        return state.journeyDays[state.currentDayIndex].portfolio.totalValue - 
               state.journeyDays[state.currentDayIndex].portfolio.cash;
      }
    },
    
    isFirstDay: (state): boolean => {
      return state.currentDayIndex === 0;
    },
    
    isLastDay: (state): boolean => {
      return state.currentDayIndex === state.journeyDays.length - 1;
    },
    
    currentDayEvents: (state): PortfolioEvent[] => {
      return state.journeyDays[state.currentDayIndex].events;
    },
    
    finalPerformance: (state): string => {
      const finalDay = state.journeyDays[state.journeyDays.length - 1];
      return `+${finalDay.portfolio.percentChange.toFixed(1)}%`;
    },
    
    niftyPerformance: (state): string => {
      const finalDay = state.journeyDays[state.journeyDays.length - 1];
      return `+${finalDay.portfolio.niftyChange.toFixed(1)}%`;
    }
  },
  
  actions: {
    startJourney() {
      this.journeyStarted = true;
      this.currentDayIndex = 0;
    },
    
    nextDay() {
      if (this.currentDayIndex < this.journeyDays.length - 1) {
        this.currentDayIndex++;
      }
    },
    
    previousDay() {
      if (this.currentDayIndex > 0) {
        this.currentDayIndex--;
      }
    },
    
    goToDay(dayIndex: number) {
      if (dayIndex >= 0 && dayIndex < this.journeyDays.length) {
        this.currentDayIndex = dayIndex;
      }
    },
    
    resetJourney() {
      this.journeyStarted = false;
      this.currentDayIndex = 0;
    },
    
    updateStartDate(day: number, month: string, year: number) {
      this.startDate = { day, month, year };
    },
    
    updateSelectedProduct(product: string) {
      this.selectedProduct = product;
    },
    
    updateInitialInvestment(amount: number) {
      this.initialInvestment = amount;
    },
    
    increaseSelectedDays() {
      if (this.rollsRemaining > 0 && this.selectedDays < 30) {
        this.selectedDays += 5;
        this.rollsRemaining -= 1;
      }
    },
    
    setupJourney() {
      // In a real application, this would call an API to generate the journey
      // For now, we use the predefined journey data
      this.startJourney();
    },
    
    startNewJourney() {
      // Reset and start a new journey
      this.resetJourney();
    }
  }
});