<template>
  <div class="st-card">
    <div class="st-card__row">
        <span class="item title"><slot name="title"></slot></span>
        <span class="item type"><slot name="type"></slot></span>
    </div>
    <div class="st-card__row">
        <span class="item amount"><slot name="amount-crypto"></slot></span>
        <span class="item amount"><slot name="amount-fiat"></slot></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StCard',
  setup() {
    return {}
  }
}
</script>

<style lang="postcss" scoped>
.st-card {
  padding: 12px 16px;
  min-width: 320px;
  height: 80px;
  background: white;
  border: 1px solid #EEEFF9;
  display: inline-flex;
  flex-direction: column;
  justify-content: space-between;
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
