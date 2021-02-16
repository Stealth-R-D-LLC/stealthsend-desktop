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
    status: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const customClass = computed(() => {
      return {
        'st-status__dot--red': props.type === 'red',
        'st-status__dot--green': props.type === 'green',
        'st-status__dot--orange': props.type === 'orange',
        'st-status__dot--empty': props.type === 'empty',
      }
    })

    return { customClass }
  },
}
</script>

<style lang="postcss" scoped>
.st-status {
  display: flex;
  align-items: center;

  &__dot {
    border-radius: 50%;
    display: inline-block;
    height: 10px;
    width: 10px;

    &--red {
      background-color: var(--danger);
    }
    &--green {
      background-color: var(--success);
    }
    &--orange {
      background-color: var(--warning);
    }
    &--empty {
      border: 1px solid var(--success);
    }
  }
  &__label {
    color: var(--grey1000);
    font-size: 14px;
    letter-spacing: 0.16px;
    line-height: 20px;
    margin-left: 8px;
  }
}
</style>
