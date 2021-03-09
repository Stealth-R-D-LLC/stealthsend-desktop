<template>
  <div class="st-card" @click="handleClick(account)">
    <a href="" class="archive" @click.prevent="archive(account)"></a>
    <div class="st-card__row">
      <span class="item title">{{ account.label }}</span>
      <!-- <span class="item type">{{ account.isArchived  }}</span> -->
    </div>
    <div class="st-card__row">
      <span class="item amount">{{ account.balance }} XST</span>
      <span class="item fiat">{{ amountInFiat }} EUR</span>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
const XST_USD = 2.5 // hardcoded obviously
export default {
  name: 'StCard',
  props: {
    account: {
      type: Object,
      required: true
    }
  },
  emits: ['archived', 'click'],
  setup(props, context) {
    const amountInFiat = computed(() => {
      return props.account.balance * XST_USD
    })

    const handleClick = (account) => {
      context.emit('click', account)
    }

    const archive = (account) => {
      context.emit('archived', account)
    }
    return { amountInFiat, archive, handleClick }
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
  position: relative;
}

.st-card:hover {
  transition: all 0.2s ease-out;
  /* box-shadow: 0px 4px 8px rgba(38, 38, 38, 0.2);
    top: -4px;
    border: 1px solid #cccccc; */
  background-color: var(--mint50);
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

.st-card .archive {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: pink;
  position: absolute;
  top: -8px;
  right: -8px;
  display: none;
}

.st-card:hover .archive {
  display: block;
}
</style>
