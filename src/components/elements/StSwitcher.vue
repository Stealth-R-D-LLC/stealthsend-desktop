<template>
  <div v-if="steps && steps[step]" class="st-switcher">
    <p class="st-switcher__asset">
      <span class="asset">{{ steps[step].asset }}</span>
      <svg
        v-if="isHiddenAmounts"
        width="22"
        height="16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        @click="toggleHiddenAmounts"
      >
        <path
          d="M11 3C7.686 3 4.686 4.667 2 8c2.686 3.333 5.686 5 9 5s6.314-1.667 9-5a17.964 17.964 0 00-1.864-2M6 8h6M19 1L5 15"
          stroke="#4E00F6"
          stroke-width="2"
        />
      </svg>
      <svg
        v-if="!isHiddenAmounts"
        width="20"
        height="8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        @click="toggleHiddenAmounts"
      >
        <path
          d="M8 1.5h4M1 1.5c3 3.333 6 5 9 5s6-1.667 9-5"
          stroke="#4E00F6"
          stroke-width="2"
        />
      </svg>
    </p>
    <div class="st-switcher__steps">
      <div
        v-for="(s, index) in steps"
        :key="index"
        class="step"
        :class="{ 'step--active': step === index }"
        @click="changeStep(index)"
      >
        <span></span>
      </div>
    </div>
    <p class="st-switcher__amount">
      {{ isHiddenAmounts ? '*****' : steps[step].amountTop }}
    </p>
    <div class="st-switcher__details">
      <span class="amount-fiat">{{
        isHiddenAmounts ? '*****' : steps[step].amountBottom
      }}</span>
      <StTag v-if="!isHiddenAmounts"> {{ steps[step].percentage }}% </StTag>
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
  name: 'StSwitcher',
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
  setup(props, ctx) {
    const mainStore = useMainStore();
    const { formatAmount } = useHelpers();

    const step = ref(0);
    const steps = computed(() => {
      return [
        {
          asset: 'XST',
          amountTop: `${formatAmount(props.amount, true, 2)}`,
          amountBottom: `$${formatAmount(
            multiply(props.amount, CryptoService.constraints.XST_USD),
            true,
            2
          )}`,
          percentage: formatAmount(
            CryptoService.constraints.changePercent24Hr,
            false,
            2
          ),
        },
        {
          asset: 'EUR',
          amountTop: `$${formatAmount(
            multiply(props.amount, CryptoService.constraints.XST_USD),
            true,
            2
          )}`,
          amountBottom: `${formatAmount(props.amount, true, 8)} XST`,
          percentage: formatAmount(
            CryptoService.constraints.changePercent24Hr,
            false,
            2
          ),
        },
        {
          asset: 'BTC',
          amountTop: formatAmount(
            multiply(props.amount, CryptoService.constraints.XST_BTC),
            true,
            8
          ),
          amountBottom: `${formatAmount(props.amount, true, 8)} XST`,
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

    function changeStep(i) {
      step.value = i;
      ctx.emit('change', i);
    }
    return {
      step,
      steps,
      changeStep,
      toggleHiddenAmounts,
      isHiddenAmounts,
    };
  },
};
</script>

<style scoped>
.st-switcher {
  border-bottom: 1px solid var(--grey100);
}

.st-switcher__asset {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 32px;
  line-height: 40px;
  letter-spacing: 0.56px;
  color: var(--text);
}
.st-switcher__asset svg {
  cursor: pointer;
}
.st-switcher__steps {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 220px;
}

.step {
  cursor: pointer;
  padding: 16px 0;
}

.step span {
  display: block;
  background-color: var(--grey100);
  height: 4px;
  width: 40px;
  transition: 0.3s;
}

.st-switcher__amount {
  font-size: 28px;
  line-height: 36px;
  letter-spacing: 0.56px;
  color: var(--text);
}

.st-switcher__details {
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
  font-family: var(--secondary-font);
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.12px;
  color: #1c1a1c;
}

.step--active span {
  background-color: var(--marine500);
  width: 100px;
}
</style>
