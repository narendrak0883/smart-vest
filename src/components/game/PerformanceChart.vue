<template>
  <div ref="chartContainer" class="performance-chart">
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
        stroke="#00E5B7"
        stroke-width="3"
      />
      
      <!-- NIFTY Line -->
      <path
        class="line nifty-line"
        :d="niftyPath"
        fill="none"
        stroke="#FF7D00"
        stroke-width="3"
      />
      
      <!-- Portfolio Data Points -->
      <g v-for="(point, index) in portfolioPoints" :key="`portfolio-${index}`">
        <circle
          :cx="point.x"
          :cy="point.y"
          :r="index === currentDayIndex ? 6 : 4"
          class="data-point portfolio-point"
          :class="{ active: index === currentDayIndex }"
        />
        <text
          v-if="index === currentDayIndex"
          :x="point.x"
          :y="point.y - 15"
          class="data-label portfolio-label"
        >
          {{ days[index].portfolio.percentChange.toFixed(1) }}%
        </text>
      </g>
      
      <!-- NIFTY Data Points -->
      <g v-for="(point, index) in niftyPoints" :key="`nifty-${index}`">
        <circle
          :cx="point.x"
          :cy="point.y"
          :r="index === currentDayIndex ? 6 : 4"
          class="data-point nifty-point"
          :class="{ active: index === currentDayIndex }"
        />
        <text
          v-if="index === currentDayIndex"
          :x="point.x"
          :y="point.y + 25"
          class="data-label nifty-label"
        >
          {{ days[index].portfolio.niftyChange.toFixed(1) }}%
        </text>
      </g>
      
      <!-- X-Axis Labels -->
      <text
        v-for="(day, index) in days"
        :key="`day-${index}`"
        :x="getXPosition(index)"
        :y="height - padding / 2"
        class="axis-label x-label"
      >
        {{ day.date }}
      </text>
      
      <!-- Y-Axis Labels -->
      <g v-for="(value, index) in yAxisValues" :key="`y-${index}`">
        <line
          class="grid-line"
          :x1="padding"
          :y1="getYPosition(value)"
          :x2="width - padding"
          :y2="getYPosition(value)"
        />
        <text
          :x="padding / 2"
          :y="getYPosition(value)"
          class="axis-label y-label"
        >
          {{ value }}%
        </text>
      </g>
      
      <!-- Legend -->
      <g class="legend" transform="translate(60, 30)">
        <circle cx="0" cy="0" r="5" fill="#00E5B7" />
        <text x="15" y="5" class="legend-text">Your Portfolio</text>
        
        <circle cx="0" cy="25" r="5" fill="#FF7D00" />
        <text x="15" y="30" class="legend-text">NIFTY</text>
      </g>
    </svg>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  days: {
    type: Array,
    required: true,
    validator: (value) => Array.isArray(value) && value.length > 0
  },
  currentDayIndex: {
    type: Number,
    required: true
  }
});

const chartContainer = ref(null);
const width = ref(700);
const height = ref(350);
const padding = ref(50);

// Y-axis values (0%, 1%, 2%, etc.)
const yAxisValues = [0, 1, 2, 3, 4, 5];

// Calculate max value for scaling
const maxPortfolioValue = computed(() => {
  return Math.max(...props.days.map(day => day.portfolio.percentChange), 5);
});

const maxNiftyValue = computed(() => {
  return Math.max(...props.days.map(day => day.portfolio.niftyChange), 5);
});

const maxValue = computed(() => {
  return Math.max(maxPortfolioValue.value, maxNiftyValue.value, 5);
});

// Get X position for a day index
const getXPosition = (index) => {
  const availableWidth = width.value - 2 * padding.value;
  const step = availableWidth / (props.days.length - 1);
  return padding.value + index * step;
};

// Get Y position for a percentage value
const getYPosition = (value) => {
  const availableHeight = height.value - 2 * padding.value;
  const ratio = availableHeight / maxValue.value;
  return height.value - padding.value - value * ratio;
};

// Calculate portfolio data points
const portfolioPoints = computed(() => {
  return props.days.map((day, index) => ({
    x: getXPosition(index),
    y: getYPosition(day.portfolio.percentChange)
  }));
});

// Calculate NIFTY data points
const niftyPoints = computed(() => {
  return props.days.map((day, index) => ({
    x: getXPosition(index),
    y: getYPosition(day.portfolio.niftyChange)
  }));
});

// Create SVG path for portfolio line
const portfolioPath = computed(() => {
  const points = portfolioPoints.value;
  if (points.length === 0) return '';
  
  let path = `M ${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i].x},${points[i].y}`;
  }
  return path;
});

// Create SVG path for NIFTY line
const niftyPath = computed(() => {
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
    height.value = Math.min(chartContainer.value.clientWidth * 0.5, 350);
  }
};

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.performance-chart {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  padding: 15px;
  box-sizing: border-box;
}

.chart-svg {
  width: 100%;
  height: 100%;
}

.axis {
  stroke: rgba(255, 255, 255, 0.3);
  stroke-width: 2;
}

.grid-line {
  stroke: rgba(255, 255, 255, 0.1);
  stroke-width: 1;
  stroke-dasharray: 4;
}

.line {
  fill: none;
  stroke-width: 3;
}

.portfolio-line {
  stroke: #00E5B7;
}

.nifty-line {
  stroke: #FF7D00;
}

.data-point {
  stroke-width: 2;
  transition: r 0.3s ease;
}

.portfolio-point {
  fill: #00E5B7;
  stroke: #00E5B7;
}

.nifty-point {
  fill: #FF7D00;
  stroke: #FF7D00;
}

.data-point.active {
  fill: #FFFFFF;
}

.data-label {
  text-anchor: middle;
  font-size: 12px;
  font-weight: bold;
  fill: #FFFFFF;
}

.portfolio-label {
  fill: #00E5B7;
}

.nifty-label {
  fill: #FF7D00;
}

.axis-label {
  fill: rgba(255, 255, 255, 0.7);
  font-size: 12px;
}

.x-label {
  text-anchor: middle;
  dominant-baseline: hanging;
}

.y-label {
  text-anchor: end;
  dominant-baseline: middle;
}

.legend-text {
  fill: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  dominant-baseline: middle;
}
</style>