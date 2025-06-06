<template>
  <div class="stock-card" :class="{ 'buy': type === 'BUY', 'sell': type === 'SELL' }">
    <div class="card-header">
      <div class="card-title">{{ type === 'BUY' ? 'Buy' : 'Sell' }} Transaction</div>
      <div class="card-badge">{{ date }}</div>
    </div>
    
    <div class="card-body">
      <div class="stock-name">{{ stockName }}</div>
      <div class="transaction-details">
        <div class="quantity">{{ quantity }} shares @ ₹{{ price }}</div>
        <div class="total">Total: ₹{{ formatCurrency(quantity * price) }}</div>
      </div>
    </div>
    
    <div v-if="botComment" class="bot-comment">
      <div class="bot-avatar">🤖</div>
      <div class="comment-text">{{ botComment }}</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['BUY', 'SELL'].includes(value)
  },
  stockName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  botComment: {
    type: String,
    default: ''
  }
});

const formatCurrency = (value) => {
  return value.toLocaleString('en-IN');
};
</script>

<style scoped>
.stock-card {
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.stock-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.stock-card.buy {
  background-color: rgba(0, 229, 183, 0.1);
  border-left: 4px solid var(--secondary);
}

.stock-card.sell {
  background-color: rgba(255, 125, 0, 0.1);
  border-left: 4px solid var(--accent);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background-color: rgba(0, 0, 0, 0.1);
}

.card-title {
  font-weight: bold;
  font-size: 1.1rem;
}

.buy .card-title {
  color: var(--secondary);
}

.sell .card-title {
  color: var(--accent);
}

.card-badge {
  background-color: rgba(0, 0, 0, 0.2);
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
}

.card-body {
  padding: 15px;
}

.stock-name {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.transaction-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.quantity {
  color: rgba(255, 255, 255, 0.8);
}

.total {
  font-weight: bold;
}

.buy .total {
  color: var(--secondary);
}

.sell .total {
  color: var(--accent);
}

.bot-comment {
  display: flex;
  gap: 12px;
  padding: 15px;
  background-color: rgba(0, 0, 0, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.bot-avatar {
  width: 40px;
  height: 40px;
  background-color: #424242;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.comment-text {
  flex: 1;
  padding: 10px 15px;
  background-color: rgba(0, 229, 183, 0.1);
  border-radius: 15px;
  border-bottom-left-radius: 0;
}
</style>