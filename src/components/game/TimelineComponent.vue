<template>
  <div class="timeline-wrapper">
    <div class="timeline-container">
      <div class="timeline-line"></div>
      
      <div 
        v-for="(day, index) in days" 
        :key="index"
        :class="['timeline-node', { 
          active: index === currentDayIndex,
          'has-events': hasEvents(day)
        }]"
        @click="selectDay(index)"
      >
        <div class="node-content">{{ day.dayNum }}</div>
        <div class="timeline-date">{{ day.date }}</div>
        
        <div v-if="hasEvents(day)" class="event-indicator">
          <div 
            v-for="(event, eventIndex) in day.events" 
            :key="eventIndex"
            :class="['event-dot', event.type.toLowerCase()]"
            :title="event.type === 'BUY' ? 'Buy Event' : 'Sell Event'"
          ></div>
        </div>
      </div>
    </div>
    
    <div v-if="showControls" class="timeline-controls">
      <GameButton 
        variant="outline" 
        size="small" 
        icon="◀"
        :disabled="currentDayIndex === 0"
        @click="previousDay"
      >
        Previous
      </GameButton>
      
      <div class="day-indicator">
        Day {{ days[currentDayIndex].dayNum }}: {{ days[currentDayIndex].date }}
      </div>
      
      <GameButton 
        variant="outline" 
        size="small" 
        icon="▶"
        :disabled="currentDayIndex === days.length - 1"
        @click="nextDay"
      >
        Next
      </GameButton>
    </div>
  </div>
</template>

<script setup>
import GameButton from '@/components/common/GameButton.vue';

const props = defineProps({
  days: {
    type: Array,
    required: true,
    validator: (value) => Array.isArray(value) && value.length > 0
  },
  currentDayIndex: {
    type: Number,
    required: true
  },
  showControls: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['day-selected']);

const hasEvents = (day) => {
  return day.events && day.events.length > 0;
};

const selectDay = (index) => {
  emit('day-selected', index);
};

const previousDay = () => {
  if (props.currentDayIndex > 0) {
    emit('day-selected', props.currentDayIndex - 1);
  }
};

const nextDay = () => {
  if (props.currentDayIndex < props.days.length - 1) {
    emit('day-selected', props.currentDayIndex + 1);
  }
};
</script>

<style scoped>
.timeline-wrapper {
  width: 100%;
}

.timeline-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding: 30px 0;
  margin: 20px 0;
  width: 100%;
}

.timeline-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-50%);
  z-index: 0;
}

.timeline-node {
  position: relative;
  z-index: 1;
  cursor: pointer;
  transition: all 0.3s ease;
}

.node-content {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--accent);
  color: var(--light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.timeline-node:hover .node-content {
  transform: scale(1.1);
}

.timeline-node.active .node-content {
  background-color: var(--secondary);
  color: var(--dark);
  transform: scale(1.2);
}

.timeline-date {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.8rem;
  white-space: nowrap;
}

.event-indicator {
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 5px;
}

.event-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.event-dot.buy {
  background-color: var(--secondary);
}

.event-dot.sell {
  background-color: var(--accent);
}

.timeline-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.day-indicator {
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--secondary);
}

@media (max-width: 768px) {
  .timeline-node .node-content {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  .timeline-date {
    font-size: 0.7rem;
  }
  
  .day-indicator {
    font-size: 0.9rem;
  }
}
</style>