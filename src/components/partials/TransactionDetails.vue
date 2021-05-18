<template>
  <div class="transaction-details">
    <div class="top">
      <span class="title">Transaction details</span>
      <span class="close-button" @click="close">
        <svg
          width="18"
          height="14"
          viewBox="0 0 18 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 1l12 12M3 13L15 1"
            stroke="#FAF9FC"
            stroke-width="2"
            stroke-linejoin="round"
          />
        </svg>
      </span>
    </div>
    <div class="body" v-if="tx">
      <div class="item">
        <span>Amount</span>
        <p>{{ tx.amount }}</p>
      </div>
      <div class="item">
        <span>Account</span>
        <p>{{ tx.account }}</p>
      </div>
      <div class="item">
        <span>Label</span>
        <p>{{ tx.label || '-' }}</p>
      </div>
      <div class="item">
        <span>Address</span>
        <p>
          <StLink>{{ tx.vout[0].scriptPubKey.addresses[0] }}</StLink>
        </p>
      </div>
      <div class="item">
        <span>Transaction ID</span>
        <p>
          <StLink>{{ tx.txid }}</StLink>
        </p>
      </div>
      <div class="item">
        <span>Confirmations</span>
        <p>{{ tx.confirmations }}</p>
      </div>
      <div class="item">
        <span>Date</span>
        <p>{{ tx.blocktime }}</p>
      </div>
      <p class="more-info"><StLink>More Information</StLink></p>
    </div>
  </div>
</template>

<script>
import { useMainStore } from '@/store';
import { ref, watch } from 'vue';
import useHelpers from '@/composables/useHelpers';

export default {
  name: 'StTransactionDetails',
  setup() {
    const mainStore = useMainStore();
    const { formatBlocktime, formatAmount } = useHelpers();

    function close() {
      mainStore.TOGGLE_DRAWER(false);
    }

    const tx = ref(null);

    watch(
      () => mainStore.offCanvasData,
      () => {
        if (mainStore.offCanvasData && mainStore.offCanvasData.txid)
          getTx(mainStore.offCanvasData.txid);
      }
    );

    async function getTx(txid) {
      const res = await mainStore.rpc('gettransaction', [txid]);
      tx.value = {
        ...res,
        ...mainStore.offCanvasData,
      };
    }

    return {
      close,
      tx,

      formatBlocktime,
      formatAmount,
    };
  },
};
</script>

<style scoped>
.title {
  font-family: var(--primary-font);
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.32px;
  color: var(--grey1000);
}
.item {
  font-family: var(--secondary-font);
  border-bottom: 1px solid var(--grey100);
  padding: 16px 0;
  font-size: 12px;
}
.item span {
  font-weight: 700;
  line-height: 24px;
  letter-spacing: 0.12px;
  color: var(--grey1000);
}
.item p {
  line-height: 24px;
  letter-spacing: 0.12px;
  color: var(--grey1000);
  word-break: break-all;
}
.item p .st-link {
  font-weight: 700;
}
.body {
  display: flex;
  flex-direction: column;
}
.more-info {
  align-self: center;
  font-family: var(--secondary-font);
  font-weight: bold;
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.12px;
  color: var(--marine500);
  padding: 16px 0;
}
</style>
