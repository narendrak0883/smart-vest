<template>
  <div 
    class="info-card" 
    :class="{ 
      'primary': type === 'primary', 
      'secondary': type === 'secondary',
      'accent': type === 'accent',
      'with-hover': withHover
    }"
  >
    <div v-if="title" class="card-title">{{ title }}</div>
    <div class="card-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'accent'].includes(value)
  },
  withHover: {
    type: Boolean,
    default: true
  }
});
</script>

<style scoped>
.info-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: white;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.with-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

.card-title {
  padding: 12px 15px;
  font-weight: 600;
  border-bottom: 1px solid #eee;
  background-color: rgba(0, 0, 0, 0.02);
}

.card-content {
  padding: 15px;
}

.primary {
  border-top: 4px solid #231651;
}

.primary .card-title {
  color: #231651;
}

.secondary {
  border-top: 4px solid #00E5B7;
}

.secondary .card-title {
  color: #00E5B7;
}

.accent {
  border-top: 4px solid #FF7D00;
}

.accent .card-title {
  color: #FF7D00;
}
</style>