<template>
  <StModal
    :has-click-outside="false"
    show-back-button
    :steps="3"
    :current-step="currentStep"
    :visible="isVisible"
    class="receive-modal"
    @close="closeModal"
    @back="goBack"
    @open="onOpen"
  >
    <template #header>Receive XST</template>
    <template #body>
      <template v-if="currentStep === 1">
        <StFormItem color="dark" label="Account">
          <StMultiselect
            :class="{ 'multiselect-filled': account }"
            :disabled="!depositAddress"
            v-model="account"
            :options="accounts"
            track-by="address"
            value-prop="address"
            label="label"
            :object="true"
            :can-deselect="false"
            placeholder="Select account"
            @select="changeAccount"
            @remove="preventRemove"
          >
            <template #singleLabel>
              <div class="multiselect-single-label">
                <p class="account-label">
                  {{ account && account.label }}
                </p>
                <p class="account-utxo">
                  {{ account && formatAmount(account.utxo, false, 6, 6) }}
                </p>
              </div>
            </template>

            <template #option="{ option }">
              <div class="flex-space-between">
                <span class="option">
                  {{ option.label }}
                </span>
                <span class="amount"
                  >{{ formatAmount(option.utxo, false, 6, 6) }} XST</span
                >
              </div>
            </template>
          </StMultiselect>
        </StFormItem>
        <StFormItem
          color="dark"
          :filled="amount || amountFiat"
          label="Amount"
          size="lg"
        >
          <StAmount
            v-if="inputAmountState === 'XST'"
            v-model="amount"
            placeholder="XST 0.000000"
            :options="{
              locale: 'en',
              currency: 'XST',
              distractionFree: true,
              valueAsInteger: false,
              useGrouping: true,
              precision: 6,
              allowNegative: false,
            }"
          >
            <StTooltip tooltip="Switch Currency">
              <div
                :class="{ 'switch-disabled': !amount }"
                @click="changeCurrency('USD')"
              >
                <SvgIcon name="icon-switch-currency" />
              </div>
            </StTooltip>
          </StAmount>
          <StAmount
            v-else-if="inputAmountState === 'USD'"
            v-model="amountFiat"
            @update:formattedValue="fiatKeyup"
            placeholder="$0.0000"
            :options="{
              locale: 'en',
              currency: 'USD',
              distractionFree: false,
              valueAsInteger: false,
              useGrouping: true,
              precision: 4,
              allowNegative: false,
            }"
          >
            <StTooltip tooltip="Switch Currency">
              <div @click="changeCurrency('XST')">
                <SvgIcon name="icon-switch-currency" />
              </div>
            </StTooltip>
          </StAmount>
        </StFormItem>
        <StFormItem
          color="dark"
          :filled="depositAddress"
          label="Address"
          readonly
        >
          <StInput v-model="depositAddress" placeholder="Loading..." readonly>
            <StTooltip
              v-if="depositAddress"
              :tooltip="
                copyPending ? 'Copied to Clipboard!' : 'Copy to Clipboard'
              "
            >
              <StClipboard :content="depositAddress" @click="handleCopy">
                <SvgIcon name="icon-clipboard-white" />
              </StClipboard>
            </StTooltip>
            <SvgIcon name="icon-loader-address" v-else class="address-loader" />
          </StInput>
        </StFormItem>
      </template>
      <template v-if="currentStep === 2">
        <StFormItem
          class="receiving-address"
          label="Receiving Address"
          position="center"
          color="dark"
          :filled="depositAddress"
          readonly
        >
          <StInput
            class="address-input"
            v-model="depositAddress"
            placeholder="Deposit address"
            readonly
          ></StInput>
        </StFormItem>
        <StTooltip
          class="tooltip"
          :tooltip="copyPending ? 'Copied to Clipboard!' : 'Copy to Clipboard'"
        >
          <StClipboard :content="depositAddress" @click="handleCopy"
            >Copy to Clipboard</StClipboard
          >
        </StTooltip>
        <img class="qr-img" :src="qrSrc" />
      </template>
      <template v-if="currentStep === 3">
        <StFormItem
          label="Email"
          color="dark"
          :filled="form.email.$value"
          :error-message="form.email.$errors"
        >
          <StInput
            v-model="form.email.$value"
            placeholder="Enter email address"
          ></StInput>
          <p class="email-desc">Share Payment Request</p>
        </StFormItem>
      </template>
    </template>
    <template #footer class="flex-center-all">
      <template v-if="currentStep === 1">
        <StButton
          :disabled="!depositAddress"
          type="type-d"
          @click="changeStep(2)"
          >Generate QR Code</StButton
        >
      </template>
      <template v-if="currentStep === 2">
        <StButton type="type-d" @click="changeStep(3)"
          >Share via Email</StButton
        >
      </template>
      <template v-if="currentStep === 3">
        <StButton type="type-d" @click="sendEmail">Send Email</StButton>
      </template>
    </template>
  </StModal>
</template>

<script setup>
import { useMainStore } from '@/store';
import { computed, ref } from 'vue';
import VanillaQR from 'vanillaqr';
import CryptoService from '@/services/crypto';
import { useRoute } from 'vue-router';
import useHelpers from '@/composables/useHelpers';
import { useValidation, ValidationError } from 'vue3-form-validation';
import DOMPurify from 'dompurify';
import SvgIcon from '../partials/SvgIcon.vue';

const mainStore = useMainStore();
const { formatAmount } = useHelpers();

const isVisible = computed(() => {
  return mainStore.modals.receive;
});
const XST_USD = computed(() => {
  return CryptoService.constraints.XST_USD;
});
const inputAmountState = ref('XST');

const currentStep = ref(1);

const pickedAccount = computed(() => {
  return mainStore.accountDetails;
});

const route = useRoute();

const currentRoute = computed(() => {
  return route.name;
});

function closeModal() {
  mainStore.SET_MODAL_VISIBILITY('receive', false);
  // reset all variables
  inputAmountState.value = 'XST';
  account.value = null;
  accounts.value = [];
  amount.value = null;
  amountFiat.value = null;
  currentStep.value = 1;
  depositAddress.value = '';
  qrSrc.value = '';
  email.value = '';
  resetFields();
  if (currentRoute.value !== 'AccountDetails') {
    // because we don't want to mess up the account details screen if the modal is opened there
    mainStore.SET_ACCOUNT_DETAILS(null);
  }
}

const accounts = ref([]);
const email = ref('');
const account = ref(null);
const amount = ref(null);
const amountFiat = ref(null);

const { form, validateFields, resetFields } = useValidation({
  account: {
    $value: account,
    $rules: [
      (account) => {
        if (!account) {
          return 'Account is required';
        }
        if (account.length > 50) {
          return 'Name too long';
        }
      },
    ],
  },
  email: {
    $value: email,
    $rules: [
      (email) => {
        const isEmailValid = /\S+@\S+\.\S+/.test(email);
        if (!email) {
          return 'Required';
        } else if (!isEmailValid) {
          return 'Enter a valid email address';
        }
      },
    ],
  },
});

async function scanWallet() {
  await CryptoService.scanWallet();
  accounts.value = mainStore.wallet.accounts.filter((el) => !el.isArchived);
  if (pickedAccount.value) {
    // already picked from account details
    account.value = { ...pickedAccount.value };
  } else {
    // select first account so that we can immediately start finding the first available address
    account.value = accounts.value[0];
  }
}

async function onOpen() {
  // when the modal is opened, scan for the address and show it
  await scanWallet();
  if (pickedAccount.value) {
    pickedAccount.value;
    changeAccount(pickedAccount.value);
    return;
  }
  changeAccount();
}

const depositAddress = ref('');
const qrSrc = ref('');
async function changeAccount(acc = accounts.value[0]) {
  depositAddress.value = '';
  if (acc.isImported && acc.wif) {
    depositAddress.value = acc.address;
  } else {
    const { account, change } = CryptoService.breakAccountPath(acc.path);
    const discoveredAddresses = await CryptoService.accountDiscovery(account);
    let nextFreeAddress = CryptoService.nextToUse(
      discoveredAddresses.freeAddresses
    );
    const next = CryptoService.breakAccountPath(nextFreeAddress);

    const child = CryptoService.getChildFromRoot(account, change, next.address);
    depositAddress.value = child.address;
  }
  generateQR();
}

let copyPending = ref(false);
function handleCopy() {
  copyPending.value = true;
  setTimeout(() => {
    copyPending.value = false;
  }, 2000);
}

function generateQR() {
  var qr = new VanillaQR({
    url:
      amount.value > 0
        ? `${depositAddress.value}?amount=${amount.value}`
        : depositAddress.value,
    noBorder: false,
    // borderSize: 20,
    colorDark: '#FAF9FC',
    colorLight: '#140435',
    // size: 140,
  });
  qrSrc.value = qr.toImage('png').src;
}

function changeStep(step) {
  currentStep.value = step;
  if (step === 2) {
    generateQR();
  }
}
function goBack(step) {
  currentStep.value = step;
}

function fiatKeyup() {
  amount.value = amountFiat.value * XST_USD.value;
}

function changeCurrency(currency) {
  if (currency === 'USD') {
    amountFiat.value = amount.value * XST_USD.value;
  }
  inputAmountState.value = currency;
  /* if (currency === 'XST') {
        amount.value = amountFiat.value / XST_USD.value;
        inputAmountState.value = 'XST';
      } else if (currency === 'USD') {
        amountFiat.value = amount.value * XST_USD.value;
        inputAmountState.value = 'USD';
      } else {
        console.error('Unhandled currency');
      }
      if (inputAmountState.value === 'XST') {
        if (amount.value < 0.05) {
          amount.value = 0.05;
        }
      } */
}

async function sendEmail() {
  try {
    await validateFields();
    if (amount.value > 0) {
      window.location.href = DOMPurify.sanitize(
        `mailto:${email.value}?body=Please send ${amount.value} XST to my following address: ${depositAddress.value}.&subject=My XST address`
      );
    } else {
      window.location.href = DOMPurify.sanitize(
        `mailto:${email.value}?body=${depositAddress.value}&subject=My XST address`
      );
    }
    closeModal();
  } catch (e) {
    if (e instanceof ValidationError) {
      console.log(e);
    }
  }
}

function preventRemove(acc) {
  setTimeout(() => {
    account.value = acc;
  }, 10);
}
</script>

<style scoped>
.form-item.account label {
  position: absolute;
  top: -46px;
}
:deep .address-input > .st-input__inner {
  text-align: center;
}
:deep .address-input > label {
  left: 0;
  right: 0;
  text-align: center;
}
.tooltip {
  display: block;
  width: 100%;
  text-align: center;
}
.tooltip svg {
  display: block;
}
.tooltip .st-clipboard {
  font-family: var(--secondary-font);
  font-size: 12px;
  line-height: 24px;
  font-weight: 700;
  letter-spacing: 0.12px;
  color: var(--grey50);
}
.qr-img {
  margin: 30px auto 0;
  display: block;
  max-width: 165px;
}
.email-desc {
  margin-top: 10px;
  color: var(--grey400);
}
:deep .st-amount > .st-icon {
  cursor: pointer;
}
.multiselect-single-label {
  display: flex;
  flex-direction: column;
  color: var(--white);
}
.multiselect-single-label .account-utxo {
  margin-top: 6px;
  font-family: var(--secondary-font);
  font-size: 14px;
  line-height: 14px;
  letter-spacing: 0.12px;
}
.multiselect-single-label .account-label {
  font-family: var(--secondary-font);
  font-size: 14px;
  line-height: 14px;
  letter-spacing: 0.12px;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-break: break-all;
  overflow: hidden;
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
.address-loader {
  animation: rotating 2s linear infinite;
}
.receiving-address :deep label {
  right: 0;
  text-align: center;
  line-height: 24px;
}
:deep .multiselect--active .multiselect__tags {
  padding-top: 25px;
}
:deep .multiselect__content-wrapper {
  top: 4px;
  padding-top: 65px;
}
.flex-space-between .option {
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-break: break-all;
  overflow: hidden;
  margin-right: 10px;
}
.flex-space-between .amount {
  white-space: nowrap;
}
.switch-disabled {
  pointer-events: none;
}
</style>
<style>
.receive-modal .st-modal-container {
  display: flex;
  flex-direction: column;
  width: 480px;
  height: 520px;
  box-sizing: border-box;
}
.receive-modal .st-modal__header {
  margin-bottom: 36px;
}
.receive-modal .st-modal__body {
  margin: 0;
}
.receive-modal .st-form-item.receiving-address {
  margin-bottom: 22px;
}
.receive-modal .st-input {
  margin-bottom: 0;
}
.receive-modal .st-modal__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: auto;
}
</style>
