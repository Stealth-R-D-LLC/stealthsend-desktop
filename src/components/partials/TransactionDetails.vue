<template>
  <div class="transaction-details">
    <div class="top">
      <h6>Transaction Details</h6>
      <div class="icons">
        <StTooltip v-if="!tx?.isFailed" class="tooltip" tooltip="Edit Label">
          <SvgIcon name="icon-edit" @click="openEditMode" />
        </StTooltip>
        <template
          v-if="
            tx &&
            wallet &&
            wallet.accounts.find((acc) => acc.label === tx.account).isImported
          "
        >
          <template
            v-if="
              wallet && wallet.accounts.find((acc) => acc.label === tx.account)
            "
          >
            <StTooltip class="tooltip" tooltip="Resend Transaction">
              <SvgIcon name="icon-redo-transaction" @click="redoTransaction" />
            </StTooltip>
          </template>
        </template>

        <template v-else>
          <StTooltip
            class="tooltip"
            tooltip="Resend Transaction"
            v-if="tx?.amount < 0 || tx?.isFailed"
          >
            <SvgIcon name="icon-redo-transaction" @click="redoTransaction" />
          </StTooltip>
        </template>

        <SvgIcon name="icon-close-primary" @click="close" />
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
        <p
          class="amount"
          v-if="
            tx.vout &&
            tx.vout[0] &&
            tx.vout[0].scriptPubKey &&
            tx.vout[0].scriptPubKey.type === 'nonstandard'
          "
        >
          <SvgIcon name="icon-transactions-received" />
          {{
            formatAmount(
              tx.vout &&
                tx.vout[tx.vout.length - 1] &&
                tx.vout[tx.vout.length - 1].value,
              false,
              6,
              6
            )
          }}
          XST
        </p>
        <p v-else class="amount">
          <template
            v-if="
              wallet &&
              wallet.accounts.find((acc) => acc.label === tx.account).isImported
            "
          >
            <template v-if="tx?.isFailed">
              <SvgIcon name="icon-transactions-failed" />
              -{{ formatAmount(tx.amount, false, 6, 6) }} XST
            </template>
            <template v-else-if="tx.isPending">
              <SvgIcon name="icon-transactions-pending" />
              -{{ formatAmount(tx.amount, false, 6, 6) }} XST
            </template>
            <template
              v-else-if="
                wallet &&
                wallet.accounts.find((acc) => acc.label === tx.account)
                  .address === tx?.vout[tx.position]?.scriptPubKey?.addresses[0]
              "
            >
              <SvgIcon name="icon-transactions-received" />
              {{ formatAmount(tx.amount, false, 6, 6) }} XST
            </template>
            <template v-else>
              <SvgIcon name="icon-transactions-sent" />
              <template v-if="!loadingFee">
                -{{ formatAmount(Math.abs(tx.amount + fees), false, 6, 6) }} XST
              </template>
              <SvgIcon
                v-else
                name="icon-loader-address"
                class="address-loader"
              />
            </template>
          </template>
          <template v-else>
            <SvgIcon name="icon-transactions-failed" v-if="tx?.isFailed" />
            <SvgIcon
              name="icon-transactions-pending"
              v-else-if="tx.isPending"
            />

            <SvgIcon
              name="icon-transactions-received"
              v-else-if="tx.amount > 0"
            />

            <SvgIcon name="icon-transactions-sent" v-else-if="tx.amount <= 0" />
            <template v-if="tx.isPending">-</template>
            {{ formatAmount(tx.amount, false, 6, 6) }} XST
          </template>
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
        <p v-if="tx?.isFailed">
          {{ tx?.txinfo?.destinations[0] }}
          <StTooltip
            :tooltip="
              copyPending ? 'Copied to Clipboard!' : 'Copy to Clipboard'
            "
          >
            <StClipboard
              :content="tx?.txinfo?.destinations[0]"
              @click="handleCopy"
            >
              <SvgIcon name="icon-clipboard" />
            </StClipboard>
          </StTooltip>
        </p>
        <template v-else>
          <p
            v-if="
              tx.vout &&
              tx.vout[0] &&
              tx.vout[0].scriptPubKey &&
              tx.vout[0].scriptPubKey.type === 'nonstandard'
            "
            class="item-link pointer"
          >
            <span
              @click="
                openAddressExplorer(
                  tx?.vout[tx.vout.length - 1]?.scriptPubKey?.addresses[0]
                )
              "
            >
              {{ tx?.vout[tx.vout.length - 1]?.scriptPubKey?.addresses[0] }}
            </span>
            <StTooltip
              :tooltip="
                copyPending ? 'Copied to Clipboard!' : 'Copy to Clipboard'
              "
            >
              <StClipboard
                :content="
                  tx?.vout[tx.vout.length - 1]?.scriptPubKey?.addresses[0]
                "
                @click="handleCopy"
              >
                <SvgIcon name="icon-clipboard" />
              </StClipboard>
            </StTooltip>
          </p>
          <template v-else>
            <p
              v-if="
                tx &&
                tx.vout &&
                tx.vout.length &&
                tx.vout[tx.position] &&
                tx.vout[tx.position].scriptPubKey &&
                tx.vout[tx.position].scriptPubKey.addresses &&
                tx.vout[tx.position].scriptPubKey.addresses[0]
              "
              class="item-link pointer has-clipboard"
            >
              <span
                @click="
                  openAddressExplorer(
                    tx?.vout[tx.position]?.scriptPubKey?.addresses[0]
                  )
                "
              >
                {{ tx?.vout[tx.position]?.scriptPubKey?.addresses[0] }}
              </span>
              <StTooltip
                :tooltip="
                  copyPending ? 'Copied to Clipboard!' : 'Copy to Clipboard'
                "
              >
                <StClipboard
                  :content="tx?.vout[tx.position]?.scriptPubKey?.addresses[0]"
                  @click="handleCopy"
                >
                  <SvgIcon name="icon-clipboard" />
                </StClipboard>
              </StTooltip>
            </p>
            <p v-else>-</p>
          </template>
        </template>
      </div>
      <div class="item">
        <p class="bold">Transaction ID</p>
        <p class="item-link pointer has-clipboard txid">
          <span>
            <span @click="openBlockExplorer(tx.txid)">
              {{ tx.txid }}
            </span>
            <StTooltip
              v-if="tx?.txid !== '-'"
              :tooltip="
                copyPending ? 'Copied to Clipboard!' : 'Copy to Clipboard'
              "
            >
              <StClipboard :content="tx.txid" @click="handleCopy">
                <SvgIcon name="icon-clipboard" />
              </StClipboard>
            </StTooltip>
          </span>
        </p>
      </div>
      <div class="item item--grid">
        <div>
          <p class="bold">Confirmations</p>
          <p>{{ tx.confirmations ? tx.confirmations : 0 }}</p>
        </div>
        <div>
          <p class="bold">Network Fee</p>
          <p v-if="tx?.isFailed">{{ formatAmount(0, false, 6, 6) }} XST</p>
          <template v-else-if="!tx?.isFailed">
            <p v-if="!loadingFee">
              <template
                v-if="
                  tx.vout &&
                  tx.vout[0] &&
                  tx.vout[0].scriptPubKey &&
                  tx.vout[0].scriptPubKey.type === 'nonstandard'
                "
              >
                {{ formatAmount(fees, false, 6, 6) }} XST
              </template>
              <template v-else>
                {{ formatAmount(fees, false, 6, 6).replace('-', '') }} XST
              </template>
            </p>
            <SvgIcon v-else name="icon-loader-address" class="address-loader" />
          </template>
        </div>
      </div>
      <div class="item">
        <p class="bold">Date</p>
        <p>{{ formatBlocktime(tx.blocktime, 'd MMM, y, h:mm:ss a') }}</p>
      </div>
      <p
        v-if="!tx?.isFailed"
        class="more-info bold"
        @click="openBlockExplorer(tx.txid)"
      >
        View on StealthMonitor.org
      </p>
    </div>
    <template v-else>
      <StSkeletonLoader type="tx-details" />
    </template>
  </div>
</template>

<script setup>
import { useMainStore } from '@/store';
import { ref, watch, computed } from 'vue';
import useHelpers from '@/composables/useHelpers';
import CryptoService from '@/services/crypto';
import { useValidation, ValidationError } from 'vue3-form-validation';
import SvgIcon from '../partials/SvgIcon.vue';
import StSkeletonLoader from '@/components/loader/StSkeletonLoader.vue';

const mainStore = useMainStore();
const { formatBlocktime, formatAmount } = useHelpers();

const tx = ref(null);
const editMode = ref(false);
const label = ref('');
const txDetails = ref(null);
const loadingFee = ref(true);

const { form, validateFields } = useValidation({
  label: {
    $value: label,
    $rules: [
      {
        rule: () => {
          return label.value.length > 50 && 'Label too long';
        },
      },
    ],
  },
});

watch(
  () => mainStore.offCanvasData,
  async () => {
    if (mainStore.offCanvasData && mainStore.offCanvasData.txid === '-') {
      // handle failed tx
      // loadingFee.value = false;
      // return;
    }
    if (mainStore.offCanvasData && mainStore.offCanvasData.txid) {
      await getTx(mainStore.offCanvasData.txid);
      await mainStore.getTxFee(mainStore.offCanvasData.txid).then((res) => {
        txDetails.value = res;
        loadingFee.value = false;
      });
      if (mainStore?.offCanvasData?.isEditMode) {
        openEditMode();
      }
    }
  },
  { deep: true }
);

const txWithLabels = computed(() => {
  return mainStore.txWithLabels;
});

const totalOutput = computed(() => {
  if (!txDetails.value) {
    return 0;
  }

  return txDetails.value.vout.reduce((total, item) => {
    return total + item.value;
  }, 0);
});

const totalInput = computed(() => {
  if (!txDetails.value) {
    return 0;
  }

  return txDetails.value.vin.reduce((total, item) => {
    return total + (item.output || {}).value || 0;
  }, 0);
});

const fees = computed(() => {
  return totalInput.value - totalOutput.value;
});

const wallet = computed(() => {
  return mainStore.wallet;
});

function close() {
  mainStore.TOGGLE_DRAWER(false);
  setTimeout(() => {
    mainStore.SET_ADDRESS_ACTIVE_TAB('address-book');
    mainStore.SET_OFF_CANVAS_DATA(null);
    mainStore.SET_CURRENT_CANVAS('');
    tx.value = null;
    loadingFee.value = true;
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
    process.env.VUE_APP_NETWORK === 'mainnet' ? '?chain=main' : '?chain=test';
  setTimeout(() => {
    window
      .open('https://stealthmonitor.org/transactions/' + txid + chain, '_blank')
      .focus();
  }, 1);
}

function openAddressExplorer(address) {
  const chain =
    process.env.VUE_APP_NETWORK === 'mainnet' ? '?chain=main' : '?chain=test';
  setTimeout(() => {
    window
      .open('https://stealthmonitor.org/address/' + address + chain, '_blank')
      .focus();
  }, 1);
}

let copyPending = ref(false);
function handleCopy() {
  copyPending.value = true;
  setTimeout(() => {
    copyPending.value = false;
  }, 1000);
}

async function getTx(txid) {
  if (!txid || txid === '-') {
    tx.value = {
      ...mainStore.offCanvasData,
      position: 0,
    };
    return;
  }
  const res = await mainStore.rpc('gettransaction', [txid]);
  let position = 0;
  let outputAddresses =
    mainStore.offCanvasData.outputs?.map((output) => output.address) || [];
  if (mainStore.account_balance_change < 0) {
    position =
      mainStore.offCanvasData.txinfo.destinations?.findIndex(
        (dest) => outputAddresses?.indexOf(dest?.addresses[0]) === -1
      ) || 0;
  } else {
    position = 0;
    // position =
    //   mainStore.offCanvasData.txinfo.destinations?.findIndex(
    //     (dest) =>
    //       dest.amount === mainStore.offCanvasData.account_balance_change
    //   ) || 0;
  }
  if (position === -1) {
    position = 0;
  }
  if (typeof mainStore.offCanvasData.vout === 'number') {
    position = mainStore.offCanvasData.vout;
  }
  tx.value = {
    ...mainStore.offCanvasData,
    ...res,
    position,
  };
}

function redoTransaction() {
  let isFeeless = false;
  if (tx?.value.isFailed) {
    isFeeless = !!tx?.value?.isFeeless
    mainStore.SET_SEND_ADDRESS(tx?.value?.txinfo.destinations[0]);
    mainStore.SET_REDO_ACCOUNT(tx?.value?.account);
    mainStore.SET_REDO_AMOUNT(tx?.value?.amount);
    mainStore.SET_REDO_LABEL('');
    mainStore.SET_MODAL_VISIBILITY('send', true);
    mainStore.SET_FEELESS(isFeeless);
  } else {
    isFeeless = !!tx?.value?.vout?.filter((output) => {
      return output.scriptPubKey.type === 'feework';
    }).length;
    mainStore.SET_SEND_ADDRESS(tx?.value?.vout[0]?.scriptPubKey?.addresses[0]);
    mainStore.SET_REDO_ACCOUNT(tx?.value?.account);
    mainStore.SET_REDO_AMOUNT(tx?.value?.vout[0].value);
    mainStore.SET_REDO_LABEL(txWithLabels.value[tx.value.txid]);
    mainStore.SET_MODAL_VISIBILITY('send', true);
    mainStore.SET_FEELESS(isFeeless);
  }
  close();
}
</script>

<style scoped>
.top .icons {
  display: flex;
  align-items: center;
}
.top .icons :deep svg {
  cursor: pointer;
}
.top .icons > :deep svg,
.top .icons .tooltip + .tooltip {
  margin-left: 24px;
}
.item {
  font-family: var(--secondary-font);
  border-bottom: 1px solid var(--grey100);
  padding: 16px 0;
  font-size: 12px;
}
.item--grid {
  display: grid;
  grid-template-columns: 6fr 6fr;
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
.item p :deep svg {
  margin-right: 12px;
}

.address-loader {
  animation: rotating 2s linear infinite;
}
.address-loader :deep circle {
  stroke: var(--marine500);
}
@-webkit-keyframes rotating /* Safari and Chrome */ {
  from {
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes rotating {
  from {
    -ms-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -ms-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
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

.has-clipboard {
  display: flex;
  align-items: center;
  margin-top: 8px;
}

.has-clipboard .st-clipboard {
  width: 8px;
  height: 8px;
}
.has-clipboard:not(.txid) svg {
  height: 19px;
  width: 15px;
  margin-left: 12px;
  display: flex;
}
.has-clipboard.txid .tooltip {
  display: inline-block;
  top: 5px;
  margin-left: 8px;
  height: 19px;
  width: 15px;
}
.has-clipboard.txid svg {
  height: 19px;
  width: 15px;
}
</style>
