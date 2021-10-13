<template>
  <div v-if="steps && steps[step]" class="sidebar-header">
    <div class="sidebar-header__top">
      <div class="sidebar-header__top--logo">
        <SvgIcon name="icon-stealth-logo-mini" />
        <h4>Stealth <span>XST</span></h4>
      </div>
      <StTooltip
        class="tooltip"
        :tooltip="isHiddenAmounts ? 'Show Values' : 'Hide Values'"
      >
        <SvgIcon
          name="icon-eye-opened"
          v-if="isHiddenAmounts"
          @click="toggleHiddenAmounts"
        />

        <SvgIcon name="icon-eye-closed" v-else @click="toggleHiddenAmounts" />
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
import SvgIcon from '../partials/SvgIcon.vue';

export default {
  name: 'StCards',
  components: {
    SvgIcon,
  },
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
