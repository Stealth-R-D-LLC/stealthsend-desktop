<template>
  <div class="st-card">
    <div class="st-card__row">
      <span class="item title"><slot name="title"></slot></span>
      <span class="item type"><slot name="type"></slot></span>
    </div>
    <div class="st-card__row">
      <span class="item amount">{{ amount }} XST</span>
      <span class="item fiat">{{ amountInFiat }} EUR</span>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
export default {
  name: 'StCard',
  props: {
    amount: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const amountInFiat = computed(() => {
      return props.amount * 2.5
    })
    return { amountInFiat }
  }
}
</script>

<style lang="postcss" scoped>
.st-card {
  padding: 12px 16px;
  min-width: 320px;
  height: 80px;
  background: white;
  border: 1px solid #eeeff9;
  display: inline-flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  box-shadow: 9px 10px 16px rgba(34, 3, 101, 0.1);
  margin: 10px;
}

.st-card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.st-card .item.title {
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0.32px;
}
.st-card .item.type {
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0.32px;
}
.st-card .item.amount {
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.12px;
}
</style>
