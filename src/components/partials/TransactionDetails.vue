<template>
  <div class="transaction-details">
    <div class="top">
      <h6>Transaction Details</h6>
      <div class="icons">
        <StTooltip class="tooltip" tooltip="Edit Label">
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
        </StTooltip>
        <StTooltip class="tooltip" tooltip="Resend Transaction">
          <svg
            v-if="tx && tx.amount < 0"
            @click="redoTransaction"
            width="19"
            height="15"
            viewBox="0 0 19 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1 15V9a2 2 0 012-2h14" stroke="#4E00F6" stroke-width="2" />
            <path d="M11 13l6-6-6-6" stroke="#4E00F6" stroke-width="2" />
          </svg>
        </StTooltip>
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
      <div v-if="editMode" class="item item--label">
        <StFormItem
          label="Label"
          :class="{
            'st-form-item__error':
              form.label.$value && form.label.$value.length > 50,
          }"
          :filled="form.label.$value"
          :error-message="form.label.$errors"
        >
          <template #labelRight>
            <span @click="saveLabel">Save</span>
          </template>
          <StInput
            class="edit-label-input"
            v-model="form.label.$value"
            placeholder="Please enter label text"
          ></StInput>
          <template #description>
            <span
              v-if="form.label.$value && form.label.$value.length > 50"
              class="error"
              >Label too long</span
            >
            <span v-else>Label your transaction</span>
          </template>
        </StFormItem>
      </div>
      <div class="item">
        <p class="bold">Amount</p>
        <p class="amount">
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
          {{ formatAmount(tx.amount, false, 6, 6) }} XST
        </p>
      </div>
      <div class="item">
        <p class="bold">Account</p>
        <p class="amount">{{ tx.account }}</p>
      </div>
      <div class="item">
        <p class="bold">Label</p>
        <p class="amount">{{ txWithLabels[tx.txid] || 'No label' }}</p>
      </div>
      <div class="item">
        <p class="bold">Receiving Address</p>
        <p
          v-if="tx && tx.vout && tx.vout.length && tx.vout[0]"
          class="item-link pointer"
          @click="openAddressExplorer(tx.vout[0].scriptPubKey.addresses[0])"
        >
          {{ tx.vout[0].scriptPubKey.addresses[0] }}
        </p>
        <p v-else>-</p>
      </div>
      <div class="item">
        <p class="bold">Transaction ID</p>
        <p class="item-link pointer" @click="openBlockExplorer(tx.txid)">
          {{ tx.txid }}
        </p>
      </div>
      <div class="item">
        <p>Confirmations</p>
        <p>{{ tx.confirmations }}</p>
      </div>
      <div class="item">
        <p>Date</p>
        <p>{{ formatBlocktime(tx.blocktime, 'd MMM, y, h:mm:ss a') }}</p>
      </div>
      <p class="more-info bold" @click="openBlockExplorer(tx.txid)">
        View on StealthMonitor.org
      </p>
    </div>
  </div>
</template>

<script>
import { useMainStore } from '@/store';
import { ref, watch, computed } from 'vue';
import useHelpers from '@/composables/useHelpers';
import CryptoService from '@/services/crypto';
import { useValidation, ValidationError } from 'vue3-form-validation';

export default {
  name: 'StTransactionDetails',
  setup() {
    const mainStore = useMainStore();
    const { formatBlocktime, formatAmount } = useHelpers();

    const tx = ref(null);
    const editMode = ref(false);
    const label = ref('');

    const { form, validateFields } = useValidation({
      label: {
        $value: label,
        $rules: [
          {
            rule: () => {
              console.log(label.value);
              return label.value.length > 50 && 'Label too long';
            },
          },
        ],
      },
    });

    watch(
      () => mainStore.offCanvasData,
      async () => {
        if (mainStore.offCanvasData && mainStore.offCanvasData.txid) {
          await getTx(mainStore.offCanvasData.txid);
          if (mainStore.offCanvasData.isEditMode) {
            openEditMode();
          }
        }
      },
      { deep: true }
    );

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

    async function saveLabel() {
      try {
        await validateFields();
        CryptoService.storeTxAndLabel(tx.value.txid, label.value);
        editMode.value = false;
        CryptoService.getTxWithLabels();
        label.value = txWithLabels.value[tx.value.txid];
      } catch (e) {
        if (e instanceof ValidationError) {
          console.log(e);
        }
      }
    }

    function openBlockExplorer(txid) {
      const chain =
        process.env.VUE_APP_NETWORK === 'mainnet'
          ? '?chain=main'
          : '?chain=test';
      window
        .open(
          'https://stealthmonitor.org/transactions/' + txid + chain,
          '_blank'
        )
        .focus();
    }

    function openAddressExplorer(address) {
      const chain =
        process.env.VUE_APP_NETWORK === 'mainnet'
          ? '?chain=main'
          : '?chain=test';
      window
        .open('https://stealthmonitor.org/address/' + address + chain, '_blank')
        .focus();
    }

    async function getTx(txid) {
      const res = await mainStore.rpc('gettransaction', [txid]);
      tx.value = {
        ...res,
        ...mainStore.offCanvasData,
      };
    }

    function redoTransaction() {
      mainStore.SET_SEND_ADDRESS(tx.value.vout[0].scriptPubKey.addresses[0]);
      mainStore.SET_REDO_AMOUNT(tx.value.vout[0].value);
      mainStore.SET_MODAL_VISIBILITY('send', true);
      close();
    }

    return {
      close,
      tx,

      formatBlocktime,
      formatAmount,
      form,

      openBlockExplorer,
      openAddressExplorer,
      openEditMode,
      editMode,
      txWithLabels,
      label,
      saveLabel,
      redoTransaction,
    };
  },
};
</script>

<style scoped>
.top .icons {
  display: flex;
  align-items: center;
}
.top .icons svg {
  cursor: pointer;
}
.top .icons > svg,
.top .icons .tooltip + .tooltip {
  margin-left: 24px;
}
.item {
  font-family: var(--secondary-font);
  border-bottom: 1px solid var(--grey100);
  padding: 16px 0;
  font-size: 12px;
}
.item--label {
  padding: 30px 0 24px;
  margin-bottom: 12px;
}
.item--label .st-form-item {
  margin-bottom: 0;
}
.item .amount {
  color: var(--grey1000);
  word-break: break-all;
  margin-top: 8px;
  display: flex;
  align-items: center;
}
.item .item-link {
  word-break: break-all;
  color: var(--marine500);
}
.item p svg {
  margin-right: 12px;
}
.body {
  display: flex;
  flex-direction: column;
  overflow: auto;
  width: 100%;
  height: calc(100vh - 64px);
  padding-right: 18px;
}
.body::-webkit-scrollbar {
  width: 4px;
}
.body:hover::-webkit-scrollbar-thumb {
  background: var(--grey100);
}
.body::-webkit-scrollbar-thumb {
  background: transparent;
}
.more-info {
  margin: 22px auto;
  width: fit-content;
  color: var(--marine500);
  cursor: pointer;
}
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.pointer {
  cursor: pointer;
}
:deep .label-right span {
  cursor: pointer;
}
</style>
