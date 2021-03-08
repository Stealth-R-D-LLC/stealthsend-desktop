<template>
  <div class="st-status">
    <span class="st-status__dot" :class="customClass"></span>
    <span class="st-status__label">
      <slot></slot>
    </span>
  </div>
</template>

<script>
import { computed } from 'vue'
export default {
  name: 'StStatus',
  props: {
    type: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const customClass = computed(() => {
      return {
        'st-status__dot--red': props.type === 'red',
        'st-status__dot--green': props.type === 'green',
        'st-status__dot--orange': props.type === 'orange',
        'st-status__dot--empty': props.type === 'empty'
      }
    })

    return { customClass }
  }
}
</script>

<style lang="postcss" scoped>
.st-status {
  display: flex;
  align-items: center;
}
.st-status__dot {
  border-radius: 50%;
  display: inline-block;
  height: 10px;
  width: 10px;
}
.st-status__dot--red {
  background-color: var(--danger);
}
.st-status__dot--green {
  background-color: var(--success);
}
.st-status__dot--orange {
  background-color: var(--warning);
}
.st-status__dot--empty {
  border: 1px solid var(--success);
}
.st-status__label {
  color: var(--grey1000);
  font-size: 14px;
  letter-spacing: 0.16px;
  line-height: 20px;
  margin-left: 8px;
}
</style>
