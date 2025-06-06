<template>
  <div class="app-container">
    <header class="app-header">
      <h1 class="app-title">SMARTVEST</h1>
    </header>
    <main class="app-content">
      <router-view v-slot="{ Component }">
        <transition name="page-transition" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App'
});
</script>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  background: var(--header-gradient);
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.app-title {
  margin: 0;
  font-size: 2rem;
  letter-spacing: 2px;
  color: var(--secondary);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.app-content {
  flex: 1;
  padding: 1rem;
}

/* Page Transitions */
.page-transition-enter-active,
.page-transition-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-transition-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-transition-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

@media (min-width: 768px) {
  .app-content {
    padding: 2rem;
  }
}
</style>