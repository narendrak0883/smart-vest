<template>
    <div class="bot-container" :class="{ 'with-animation': animate }">
      <div class="bot-avatar">
        <div class="bot-face">🤖</div>
      </div>
      <div class="bot-message-container">
        <div class="bot-message">
          <div class="bot-name">SmartBot Advisor</div>
          <div class="bot-text">{{ message }}</div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'BotAdvisor',
    
    props: {
      message: {
        type: String,
        required: true
      },
      animate: {
        type: Boolean,
        default: true
      }
    }
  });
  </script>
  
  <style scoped>
  .bot-container {
    display: flex;
    gap: 15px;
    margin: 20px 0;
    opacity: 1;
  }
  
  .bot-container.with-animation {
    animation: fadeIn 0.5s ease-out;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .bot-avatar {
    width: 50px;
    height: 50px;
    background-color: #424242;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    flex-shrink: 0;
  }
  
  .bot-face {
    font-size: 1.5rem;
  }
  
  .bot-message-container {
    position: relative;
    flex-grow: 1;
  }
  
  .bot-message {
    background-color: var(--secondary);
    color: var(--dark);
    padding: 15px 20px;
    border-radius: 18px;
    border-bottom-left-radius: 0;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    position: relative;
  }
  
  .bot-message::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: -10px;
    width: 20px;
    height: 20px;
    background-color: var(--secondary);
    clip-path: polygon(100% 0, 0 100%, 100% 100%);
  }
  
  .bot-name {
    font-weight: bold;
    margin-bottom: 5px;
    font-size: 0.9rem;
    opacity: 0.7;
  }
  
  .bot-text {
    line-height: 1.5;
  }
  </style>