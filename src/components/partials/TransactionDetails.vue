<template>
  <div class="transaction-details">
    <div class="top">
      <span class="title">Transaction details</span>
      <div class="icons">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          @click="openEditMode"
        >
          <path
            d="M0 6.5h6M0 2.5h9"
            stroke="#4E00F6"
            stroke-width="2"
            stroke-linejoin="round"
          />
          <path
            clip-rule="evenodd"
            d="M18 4.5l-11 12-4 2-1-1 2-4 11-12 3 3z"
            stroke="#4E00F6"
            stroke-width="2"
          />
          <path d="M5 12.5l3 3M13 4.5l2 2" stroke="#4E00F6" stroke-width="2" />
        </svg>
        <svg
          width="19"
          height="15"
          viewBox="0 0 19 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 15V9a2 2 0 012-2h14" stroke="#4E00F6" stroke-width="2" />
          <path d="M11 13l6-6-6-6" stroke="#4E00F6" stroke-width="2" />
        </svg>
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          @click="close"
        >
          <path
            d="M3 3l12 12M3 15L15 3"
            stroke="#4E00F6"
            stroke-width="2"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
    <div class="body" v-if="tx">
      <div class="item" v-if="editMode">
        <StFormItem
          label="Label"
          label-right="Save"
          @rightLabelClick="saveLabel"
          notice="Edit transaction label for better personal accounting"
        >
          <StInput
            class="edit-label-input"
            v-model="label"
            placeholder=""
          ></StInput>
        </StFormItem>
      </div>
      <div class="item">
        <span> Amount </span>
        <p>
          <svg
            v-if="tx.amount > 0"
            width="24"
            height="24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="12" fill="#D6F8F0" />
            <path d="M7 14v3h10v-3" stroke="#07AC82" stroke-width="2" />
            <path
              d="M10 11l2 2 2-2"
              stroke="#07AC82"
              stroke-width="2"
              stroke-linecap="square"
            />
            <path d="M12 6v7" stroke="#07AC82" stroke-width="2" />
          </svg>
          <svg
            v-else-if="tx.amount < 0"
            width="24"
            height="24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="12" fill="#E5E4E8" />
            <path d="M7 13v3h10v-3" stroke="#8B8A8D" stroke-width="2" />
            <path
              d="M14 8l-2-2-2 2"
              stroke="#8B8A8D"
              stroke-width="2"
              stroke-linecap="square"
            />
            <path d="M12 6v7" stroke="#8B8A8D" stroke-width="2" />
          </svg>
          {{ formatAmount(tx.amount) }} XST
        </p>
      </div>
      <div class="item">
        <span>Account</span>
        <p>{{ tx.account }}</p>
      </div>
      <div class="item">
        <span>Label</span>
        <p>{{ txWithLabels[tx.txid] || '-' }}</p>
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
        <p>{{ formatBlocktime(tx.blocktime, 'd MMM, y, h:mm:ss a') }}</p>
      </div>
      <p class="more-info">
        <StLink :to="undefined" @click="openBlockExplorer(tx.txid)"
          >More Information</StLink
        >
      </p>
    </div>
  </div>
</template>

<script>
import { useMainStore } from '@/store';
import { ref, watch, computed } from 'vue';
import useHelpers from '@/composables/useHelpers';
import CryptoService from '@/services/crypto';

export default {
  name: 'StTransactionDetails',
  setup() {
    const mainStore = useMainStore();
    const { formatBlocktime, formatAmount } = useHelpers();

    const tx = ref(null);
    const editMode = ref(false);
    const label = ref('');

    watch(
    () => mainStore.offCanvasData,
      () => {
        if (mainStore.offCanvasData && mainStore.offCanvasData.txid)
          getTx(mainStore.offCanvasData.txid);
      },
{      deep: true
}    );

    const txWithLabels = computed(() => {
      return mainStore.txWithLabels;
    });


    function close() {
            mainStore.TOGGLE_DRAWER(false);
      setTimeout(() => {
        mainStore.SET_ADDRESS_ACTIVE_TAB('address-book');
        mainStore.SET_OFF_CANVAS_DATA(null);
        mainStore.SET_CURRENT_CANVAS('');
      }, 100);
      editMode.value = false;
    }

    function openEditMode() {
      editMode.value = true;
      label.value = txWithLabels.value[tx.value.txid];
      setTimeout(() => {
        document
          .querySelector('.transaction-details .edit-label-input input')
          .focus();
      }, 1);
    }

    function saveLabel() {
      CryptoService.storeTxAndLabel(tx.value.txid, label.value);
      editMode.value = false;
      CryptoService.getTxWithLabels();
      label.value = txWithLabels.value[tx.value.txid];
    }

    function openBlockExplorer(txid) {
      window
        .open(
          'https://stealthmonitor.org/transactions/' + txid + '?chain=test',
          '_blank'
        )
        .focus();
    }

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

      openBlockExplorer,
      openEditMode,
      editMode,
      txWithLabels,
      label,
      saveLabel,
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
  margin-top: 8px;
  display: flex;
}
.item p svg {
  margin-right: 12px;
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
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.top .icons svg {
  margin-left: 24px;
  cursor: pointer;
}
</style>
