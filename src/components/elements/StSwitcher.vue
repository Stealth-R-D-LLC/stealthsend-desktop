<template>
  <div v-if="steps && steps[step]" class="st-switcher">
    <p class="st-switcher__asset">
      <span class="asset">{{ steps[step].asset }}</span>
      <svg
        v-if="!isHiddenAmounts"
        @click="toggleHiddenAmounts"
        width="26"
        height="14"
        viewBox="0 0 26 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M13 13C17.0501 13 20.7168 11 24 7C20.7168 3 17.0501 1 13 1C8.94991 1 5.28325 3 2 7C5.28325 11 8.94991 13 13 13Z"
          stroke="#4E00F6"
          stroke-width="2"
        />
        <circle cx="13" cy="7" r="2" fill="#4E00F6" />
      </svg>
      <svg
        v-else
        @click="toggleHiddenAmounts"
        width="26"
        height="19"
        viewBox="0 0 26 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13 3C8.94991 3 5.28325 5.03704 2 9.11111C5.28325 13.1852 8.94991 15.2222 13 15.2222C17.0501 15.2222 20.7168 13.1852 24 9.11111C23.2599 8.1928 22.5004 7.37799 21.7214 6.66667"
          stroke="#4E00F6"
          stroke-width="2"
        />
        <path d="M9 9L15.1111 9" stroke="#4E00F6" stroke-width="2" />
        <path
          d="M23.1113 1L6.00022 18.1111"
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
      <StTag :color="Number(steps[step].percentage) > 0 ? 'success' : 'danger'">
        {{
          Number(steps[step].percentage) > 0
            ? '+' + steps[step].percentage
            : steps[step].percentage
        }}%
      </StTag>
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
