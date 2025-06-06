<template>
  <button 
    :class="['game-button', size, variant, { disabled }]" 
    :disabled="disabled"
    @click="handleClick"
  >
    <span v-if="icon" class="button-icon">{{ icon }}</span>
    <span class="button-text"><slot></slot></span>
  </button>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'green', 'outline'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  icon: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click']);

const handleClick = (event) => {
  if (!props.disabled) {
    emit('click', event);
  }
};
</script>

<style scoped>
.game-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  outline: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-transform: uppercase;
}

.game-button:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.game-button:active:not(.disabled) {
  transform: translateY(1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Variants */
.primary {
  background-color: var(--accent);
  color: var(--light);
}

.secondary {
  background-color: var(--secondary);
  color: var(--dark);
}

.green {
  background-color: #00c853;
  color: var(--light);
}

.outline {
  background-color: transparent;
  border: 2px solid var(--accent);
  color: var(--accent);
}

/* Sizes */
.small {
  padding: 8px 16px;
  font-size: 0.8rem;
}

.medium {
  padding: 12px 24px;
  font-size: 1rem;
}

.large {
  padding: 16px 32px;
  font-size: 1.2rem;
}

/* States */
.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
}

.button-icon {
  font-size: 1.2em;
}
</style>