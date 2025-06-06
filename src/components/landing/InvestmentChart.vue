<template>
    <div class="investment-chart">
      <svg :width="width" :height="height" class="chart-svg">
        <!-- X and Y Axes -->
        <line 
          class="axis x-axis" 
          :x1="padding" 
          :y1="height - padding" 
          :x2="width - padding" 
          :y2="height - padding"
        />
        <line 
          class="axis y-axis" 
          :x1="padding" 
          :y1="padding" 
          :x2="padding" 
          :y2="height - padding"
        />
        
        <!-- Portfolio Line -->
        <path
          class="line portfolio-line"
          :d="portfolioPath"
          fill="none"
          stroke="#0066cc"
          stroke-width="2"
        />
        
        <!-- NIFTY Line -->
        <path
          class="line nifty-line"
          :d="niftyPath"
          fill="none"
          stroke="#ff6600"
          stroke-width="2"
          stroke-dasharray="5,5"
        />
        
        <!-- Portfolio Data Points -->
        <circle
          v-for="(point, index) in portfolioPoints"
          :key="`portfolio-${index}`"
          :cx="point.x"
          :cy="point.y"
          r="4"
          class="data-point portfolio-point"
        />
        
        <!-- X-Axis Labels -->
        <text
          v-for="(label, index) in xAxisLabels"
          :key="`x-label-${index}`"
          :x="getXPosition(index)"
          :y="height - padding / 2"
          class="axis-label x-label"
        >
          {{ label }}
        </text>
      </svg>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue';
  
  interface DataPoint {
    x: number;
    y: number;
  }
  
  export default defineComponent({
    name: 'InvestmentChart',
    
    setup() {
      const chartContainer = ref<HTMLElement | null>(null);
      const width = ref(400);
      const height = ref(200);
      const padding = ref(30);
      
      // Sample data - replace with actual data in a real application
      const portfolioData = [10.0, 10.8, 11.9, 13.5, 15.2, 17.5];
      const niftyData = [10.0, 10.3, 10.9, 11.4, 12.0, 13.1];
      const xAxisLabels = ['Jan-17', 'Jan-18', 'Jan-19', 'Jan-20', 'Jan-21', 'Jan-22'];
      
      // Calculate max value for scaling
      const maxValue = computed(() => {
        return Math.max(...portfolioData, ...niftyData) * 1.1;
      });
      
      // Get X position for a point index
      const getXPosition = (index: number): number => {
        const availableWidth = width.value - 2 * padding.value;
        const step = availableWidth / (portfolioData.length - 1);
        return padding.value + index * step;
      };
      
      // Get Y position for a value
      const getYPosition = (value: number): number => {
        const availableHeight = height.value - 2 * padding.value;
        const minValue = 9.5; // Slightly below starting value for better visualization
        const valueRange = maxValue.value - minValue;
        return height.value - padding.value - ((value - minValue) / valueRange) * availableHeight;
      };
      
      // Calculate portfolio data points
      const portfolioPoints = computed((): DataPoint[] => {
        return portfolioData.map((value, index) => ({
          x: getXPosition(index),
          y: getYPosition(value)
        }));
      });
      
      // Calculate NIFTY data points
      const niftyPoints = computed((): DataPoint[] => {
        return niftyData.map((value, index) => ({
          x: getXPosition(index),
          y: getYPosition(value)
        }));
      });
      
      // Create SVG path for portfolio line
      const portfolioPath = computed((): string => {
        const points = portfolioPoints.value;
        if (points.length === 0) return '';
        
        let path = `M ${points[0].x},${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
          path += ` L ${points[i].x},${points[i].y}`;
        }
        return path;
      });
      
      // Create SVG path for NIFTY line
      const niftyPath = computed((): string => {
        const points = niftyPoints.value;
        if (points.length === 0) return '';
        
        let path = `M ${points[0].x},${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
          path += ` L ${points[i].x},${points[i].y}`;
        }
        return path;
      });
      
      // Resize handler for responsive chart
      const handleResize = () => {
        if (chartContainer.value) {
          width.value = chartContainer.value.clientWidth;
        }
      };
      
      onMounted(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
      });
      
      onUnmounted(() => {
        window.removeEventListener('resize', handleResize);
      });
      
      return {
        chartContainer,
        width,
        height,
        padding,
        xAxisLabels,
        getXPosition,
        getYPosition,
        portfolioPoints,
        niftyPoints,
        portfolioPath,
        niftyPath
      };
    }
  });
  </script>
  
  <style scoped>
  .investment-chart {
    width: 100%;
    height: 100%;
  }
  
  .chart-svg {
    width: 100%;
    height: 100%;
  }
  
  .axis {
    stroke: #ddd;
    stroke-width: 1;
  }
  
  .line {
    fill: none;
    stroke-width: 2;
  }
  
  .portfolio-line {
    stroke: #00E5B7;
  }
  
  .nifty-line {
    stroke: #FF7D00;
    stroke-dasharray: 5, 5;
  }
  
  .data-point {
    stroke-width: 1;
  }
  
  .portfolio-point {
    fill: #00E5B7;
    stroke: #00E5B7;
  }
  
  .axis-label {
    font-size: 10px;
    text-anchor: middle;
    fill: #666;
  }
  
  .x-label {
    dominant-baseline: hanging;
  }
  </style>