<template>
  <div v-if="steps && steps[step]" class="sidebar-header">
    <div class="sidebar-header__top">
      <div class="sidebar-header__top--logo">
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="40" height="40" rx="4" fill="#140435" />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M25.9303 18.5495L21.9398 10.6697L27.7729 14.7435L25.9303 18.5495ZM27.8136 25.2561L21.9469 29.3309L25.9608 21.4502L27.8136 25.2561ZM20.1119 30.0317L15.0021 20L20.1119 9.9692L25.2218 20L20.1119 30.0317ZM12.4108 25.2561L14.2636 21.4502L18.2775 29.3309L12.4108 25.2561ZM12.4108 14.7435L18.2775 10.6697L14.2636 18.5495L12.4108 14.7435ZM20.1126 7.69238L10.7692 14.3196L13.5722 20.0001L10.7692 25.6805L20.1126 32.3078L29.4559 25.6805L26.6529 20.0001L29.4559 14.3196L20.1126 7.69238Z"
            fill="white"
          />
        </svg>
        <h4>Stealth <span>XST</span></h4>
      </div>
      <StTooltip class="tooltip" :tooltip="isHiddenAmounts ? 'Show Values' : 'Hide Values'">
      <svg
        v-if="isHiddenAmounts"
        @click="toggleHiddenAmounts"
        width="22"
        height="12"
        viewBox="0 0 22 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M11 11C14.3137 11 17.3137 9.33333 20 6C17.3137 2.66667 14.3137 1 11 1C7.68629 1 4.68629 2.66667 2 6C4.68629 9.33333 7.68629 11 11 11Z"
          stroke="#4E00F6"
          stroke-width="2"
        />
        <circle
          r="1"
          transform="matrix(-1 0 0 1 11 6)"
          fill="#4E00F6"
          stroke="#4E00F6"
          stroke-width="2"
        />
      </svg>

      <svg
        v-else
        @click="toggleHiddenAmounts"
        width="22"
        height="16"
        viewBox="0 0 22 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11 3C7.68629 3 4.68629 4.66667 2 8C4.68629 11.3333 7.68629 13 11 13C14.3137 13 17.3137 11.3333 20 8C19.3945 7.24866 18.7731 6.58199 18.1357 6"
          stroke="#4E00F6"
          stroke-width="2"
        />
        <path d="M7 8L12 8" stroke="#4E00F6" stroke-width="2" />
        <path d="M19 1L5 15" stroke="#4E00F6" stroke-width="2" />
      </svg>
      </StTooltip>
    </div>
    <div class="sidebar-header__content">
      <h6>Total Balance</h6>
      <h4>{{ isHiddenAmounts ? '•••' : steps[step].amountTop }}</h4>
      <h6 class="amount-fiat">
        <span class="amount-fiat__inner"
          >~ {{ isHiddenAmounts ? '$•••' : steps[step].amountBottom }} USD</span
        >
        <StTag
          :color="Number(steps[step].percentage) > 0 ? 'success' : 'danger'"
        >
          {{
            Number(steps[step].percentage) > 0
              ? '+' + steps[step].percentage
              : steps[step].percentage
          }}%
        </StTag>
      </h6>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import CryptoService from '@/services/crypto';
import { useMainStore } from '@/store';
import useHelpers from '@/composables/useHelpers';
import { multiply } from 'mathjs';

export default {
  name: 'StCards',
  props: {
    amount: {
      type: Number,
      required: true,
      default: () => {
        return 0;
      },
    },
  },
  emits: ['change'],
  setup(props) {
    const mainStore = useMainStore();
    const { formatAmount } = useHelpers();

    const step = ref(0);
    const steps = computed(() => {
      return [
        {
          asset: 'XST',
          amountTop: `${formatAmount(props.amount, false, 6, 6)}`,
          amountBottom: `$${formatAmount(
            multiply(props.amount, CryptoService.constraints.XST_USD),
            false,
            4,
            4
          )}`,
          percentage: formatAmount(
            CryptoService.constraints.changePercent24Hr,
            false,
            2
          ),
        },
      ];
    });

    const isHiddenAmounts = computed(() => {
      return mainStore.isAmountsHidden;
    });

    function toggleHiddenAmounts() {
      mainStore.SET_AMOUNTS_HIDDEN(!isHiddenAmounts.value);
    }

    return {
      step,
      steps,
      toggleHiddenAmounts,
      isHiddenAmounts,
    };
  },
};
</script>

<style scoped>
.sidebar-header {
  padding-bottom: 16px;
  border-bottom: 1px solid var(--grey100);
}
.sidebar-header__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.sidebar-header__top svg {
  cursor: pointer;
}
.sidebar-header__top--logo {
  display: flex;
  align-items: center;
}
.sidebar-header__top--logo h4 {
  font-weight: 600;
  margin-left: 16px;
}
.sidebar-header__top--logo h4 span {
  font-weight: 400;
  color: var(--marine500);
}
.sidebar-header__content {
  margin-top: 16px;
}
.sidebar-header__content .amount-fiat {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}
.sidebar-header__content .amount-fiat__inner {
  margin-right: 18px;
  color: var(--grey500);
}
</style>
