<template>
    <div class="animated-background">
      <div 
        v-for="n in particleCount" 
        :key="n" 
        class="particle" 
        :style="getParticleStyle(n)"
      ></div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, computed } from 'vue';
  
  export default defineComponent({
    name: 'AnimatedBackground',
    
    props: {
      particleCount: {
        type: Number,
        default: 15
      }
    },
    
    setup(props) {
      const getParticleStyle = (index: number) => {
        // Generate random positions and sizes
        const size = Math.floor(Math.random() * 20) + 10; // 10px to 30px
        const left = Math.floor(Math.random() * 100); // 0% to 100%
        const top = Math.floor(Math.random() * 100); // 0% to 100%
        const opacity = (Math.random() * 0.3) + 0.1; // 0.1 to 0.4
        
        // Alternate between accent and secondary colors
        const color = index % 2 === 0 ? 'var(--accent)' : 'var(--secondary)';
        
        // Generate random animation durations
        const duration = Math.floor(Math.random() * 20) + 20; // 20s to 40s
        const delay = Math.floor(Math.random() * 10); // 0s to 10s
        
        return {
          width: `${size}px`,
          height: `${size}px`,
          left: `${left}%`,
          top: `${top}%`,
          backgroundColor: color,
          opacity: opacity,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`
        };
      };
      
      return {
        getParticleStyle
      };
    }
  });
  </script>
  
  <style scoped>
  .animated-background {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    overflow: hidden;
  }
  
  .particle {
    position: absolute;
    border-radius: 50%;
    filter: blur(8px);
    animation: float 30s linear infinite;
  }
  
  @keyframes float {
    0% {
      transform: translateY(0) translateX(0) rotate(0deg);
    }
    25% {
      transform: translateY(-100px) translateX(100px) rotate(90deg);
    }
    50% {
      transform: translateY(100px) translateX(200px) rotate(180deg);
    }
    75% {
      transform: translateY(-50px) translateX(100px) rotate(270deg);
    }
    100% {
      transform: translateY(0) translateX(0) rotate(360deg);
    }
  }
  </style>