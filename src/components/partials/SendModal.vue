<template>
  <StModal
    :has-click-outside="false"
    :show-back-button="currentStep < 4"
    :steps="3"
    :show-close-button="currentStep <= 3 || currentStep === 6"
    :current-step="currentStep"
    :visible="isVisible"
    class="send-modal"
    @close="closeModal"
    @back="changeStep"
    :class="{
      'no-step':
        currentStep === 4 ||
        currentStep === 5 ||
        currentStep === 6 ||
        currentStep === 7,
    }"
  >
    <template #header>
      <template v-if="currentStep < 4">Send XST</template>
      <template v-if="currentStep === 5">Sending XST</template>
      <template v-if="currentStep === 6">Pending</template>
    </template>
    <template #body>
      <StModal
        class="qr-modal"
        @close="isScaning = false"
        :has-click-outside="false"
        :visible="isScaning"
      >
        <template #header>QR Code Scanner</template>
        <template #body>
          <div class="no-camera" v-show="!cameraAllowed">
            <SvgIcon name="icon-no-camera" />
            <h6>There is no connected camera</h6>
          </div>
          <div v-show="isCameraLoading" class="loading-gif">
            <img src="../../../static/xstloaderwhite.gif" alt="white gif" />
            <img src="../../../static/xstloaderwhite.gif" alt="white gif" />
            <img src="../../../static/xstloaderwhite.gif" alt="white gif" />
          </div>
          <div v-show="!isCameraLoading">
            <div v-show="cameraAllowed" class="stream">
              <qr-stream @decode="onDecode" class="mb">
                <div class="frame" />
              </qr-stream>
            </div>
          </div>
        </template>
      </StModal>
      <template v-if="currentStep === 1">
        <StFormItem
          color="dark"
          :filled="form?.account?.$value?.address"
          :error-message="form.account.$errors"
          label="Account"
        >
          <StMultiselect
            class="dark"
            v-model="form.account.$value"
            :class="{ 'multiselect-filled': account }"
            :options="accounts"
            track-by="address"
            value-prop="address"
            label="label"
            :object="true"
            :can-deselect="false"
            :clear-on-select="false"
            placeholder="Select account"
            @select="getUnspentOutputs"
            @remove="preventRemove($event)"
          >
            <template #singleLabel>
              <div v-if="!isLoading">
                <div class="multiselect-single-label">
                  <p class="account-label">
                    {{
                      account &&
                      Object.keys(account).length > 0 &&
                      account?.label
                    }}
                  </p>
                  <p class="account-utxo">
                    {{
                      account &&
                      Object.keys(account).length > 0 &&
                      formatAmount(account.utxo, false, 6, 6)
                    }}
                  </p>
                </div>
              </div>
              <div v-else>
                <div class="multiselect-single-label">
                  <p class="account-label">Loading...</p>
                  <p class="account-utxo">0.000000</p>
                </div>
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
          :filled="form.depositAddress.$value"
          label="Address"
          :error-message="form.depositAddress.$errors"
        >
          <StInput
            v-model="form.depositAddress.$value"
            placeholder="Enter a valid XST address"
            color="dark"
          >
            <SvgIcon name="icon-qr-code" @click="startScanner" />
          </StInput>
          <template #description>Scan QR Code or paste from clipboard</template>
        </StFormItem>
      </template>
      <template v-if="currentStep === 2">
        <StFormItem
          label="Label"
          :class="{ 'st-form-item__error': form.label.$value.length > 50 }"
          :error-message="form.label.$errors"
          :filled="form.label.$value"
          color="dark"
        >
          <StInput
            v-model="form.label.$value"
            placeholder="Add a label to your transaction"
          />
          <template v-if="form.label.$value.length > 50" #description>
            <span class="error">Label too long</span>
          </template>
        </StFormItem>
        <StFormItem
          color="dark"
          size="lg"
          :filled="form.amount.$value"
          :error-message="form.amount.$errors"
          label="Amount"
        >
          <template #labelRight>
            <a v-if="account" class="load-max" @click="loadMax(account)"
              >Load max</a
            >
          </template>
          <StAmount
            v-if="inputAmountState === 'XST'"
            v-model="form.amount.$value"
            @input="changeAmount"
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
            <StTooltip class="tooltip" tooltip="Switch Currency">
              <SvgIcon
                name="icon-switch-currency"
                :class="{ 'switch-disabled': !form.amount.$value }"
                @click="formatValue('USD')"
              />
            </StTooltip>
          </StAmount>
          <StAmount
            v-else-if="inputAmountState === 'USD'"
            v-model="amountUSD"
            color="dark"
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
            <StTooltip class="tooltip" tooltip="Switch Currency">
              <SvgIcon
                name="icon-switch-currency"
                @click="formatValue('XST')"
              />
            </StTooltip>
          </StAmount>
          <template #description>
            Minimum: {{ minimumXSTForSend }} XST, Fee:
            {{
              isFeeless
                ? '0.00 XST'
                : `${formatAmount(aproxFee, true, 2, 2)} XST`
            }}
          </template>
        </StFormItem>
        <StSwitch v-model="isFeeless" theme="dark" type="thunder"
          >Feeless</StSwitch
        >
      </template>
      <template v-if="currentStep === 3">
        <div class="payment">
          <h5>Payment Details</h5>
          <div class="payment-grid">
            <p class="bold">Account:</p>
            <p>{{ account.label }}</p>
            <p class="bold">Amount:</p>
            <p>{{ formatAmount(amount, false, 6, 6) }} XST</p>
            <p class="bold">Address</p>
            <p>{{ depositAddress }}</p>
            <p class="bold">Label:</p>
            <p>{{ label ? label : 'No label' }}</p>
            <p class="bold">Fee:</p>
            <p v-if="!isFeeless">
              {{ aproxFee ? formatAmount(aproxFee, true, 2, 2) : '0.02' }} XST
            </p>
            <p v-if="isFeeless">0.00 XST</p>
          </div>
        </div>
      </template>
      <template v-if="currentStep === 5">
        <div class="progress">
          <CircleProgress></CircleProgress>
          <div class="overlay"></div>
        </div>
        <p class="progress-note">
          Your transaction is being processed, <br />please be patient.
        </p>
      </template>
      <template v-if="currentStep === 6">
        <div class="progress no-background">
          <SvgIcon name="icon-loader-success-light" />
        </div>
        <p class="progress-note">Transaction submitted</p>
      </template>
    </template>
    <template #footer class="flex-center-all">
      <template v-if="currentStep === 1">
        <StButton
          :disabled="!account || Object.keys(account).length === 0 || isLoading"
          type="type-d"
          @click="validateFirstStep"
          >Proceed</StButton
        >
      </template>
      <template v-if="currentStep === 2">
        <StButton @click="validateSecondStep" type="type-d">Proceed</StButton>
      </template>
      <template v-if="currentStep === 3">
        <StButton type="type-d" @click="prepareSend">Confirm Payment</StButton>
      </template>
      <template v-if="currentStep === 6">
        <StButton type="type-d" @click="closeModal">OK</StButton>
      </template>
    </template>
  </StModal>
</template>

<script setup>
import { useMainStore } from '@/store';
import { computed, ref, watch, watchEffect } from 'vue';
import CryptoService from '@/services/crypto';
import MathService from '@/services/math';
import useCoinControl from '@/composables/useCoinControl';
import useTransactionBuilder from '@/composables/useTransactionBuilder';
import useTransactionBuilderForImportedAccount from '@/composables/useTransactionBuilderForImportedAccount';
import useFeeEstimator from '@/composables/useFeeEstimator';
import useHelpers from '@/composables/useHelpers';
import { useValidation, ValidationError } from 'vue3-form-validation';
import { useRoute } from 'vue-router';
import emitter from '@/services/emitter';
import { QrStream } from 'vue3-qr-reader';
import SvgIcon from '../partials/SvgIcon.vue';
import CircleProgress from '../partials/CircleProgress.vue';
import getUnixTime from 'date-fns/getUnixTime';

const mainStore = useMainStore();
const { formatAmount, fil } = useHelpers();

const isVisible = computed(() => {
  return mainStore.modals.send;
});
const inputAmountState = ref('XST');
const account = ref({});
const amount = ref(null);
const amountUSD = ref(null);
const depositAddress = ref('');
const aproxFee = ref(0.01);
const currentStep = ref(1);
const counter = ref(5);
const counterTimeout = ref(null);
const label = ref('');
const isScaning = ref(false);
const QRData = ref(null);
const cameraAllowed = ref(false);
const isCameraLoading = ref(false);
const isFeeless = ref(true);

const pickedAccount = computed(() => {
  return mainStore.accountDetails;
});

const minimumXSTForSend = computed(() => {
  return CryptoService.constraints.MINIMUM_XST_FOR_SEND;
});

watchEffect(() => {
  if (currentStep.value === 1) {
    if (mainStore.sendAddress) {
      depositAddress.value = mainStore.sendAddress;
    }
  }
  if (currentStep.value === 4) {
    // sendTimeout.value = setTimeout(() => send(), 4900);
  }
  if (currentStep.value === 5) {
    clearTimeout(counterTimeout.value);
    counter.value = 5;
  }
});

const route = useRoute();

const currentRoute = computed(() => {
  return route.name;
});

const { form, remove, add, validateFields, resetFields } = useValidation({
  depositAddress: {
    $value: depositAddress,
    $rules: [
      (depositAddress) =>
        (!depositAddress ||
          !CryptoService.isAddressValid(depositAddress.trim())) &&
        'Please enter a valid XST address',
    ],
  },
  account: {
    $value: account,
    $rules: [
      (account) => {
        if (!account) {
          return 'Account is required';
        }
      },
    ],
  },
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
  () => isFeeless.value,
  () => {
    findFee();
  }
);

const isLoading = ref(false);
watch(
  () => isVisible.value,
  async () => {
    if (!isVisible.value) {
      closeModal();
    } else {
      isLoading.value = true;
      await CryptoService.scanWallet();
      await scanWallet();
      mainStore.checkRpcStatus();
      // if (mainStore.redoAmount && Object.keys(account.value).length > 0) {
      //   await getUnspentOutputs(account.value);
      // }
      isLoading.value = false;
    }
  }
);

function closeModal() {
  mainStore.SET_MODAL_VISIBILITY('send', false);
  mainStore.SET_SEND_ADDRESS('');
  mainStore.SET_REDO_ACCOUNT('');
  mainStore.SET_REDO_LABEL('');
  mainStore.SET_FEELESS(true);
  mainStore.SET_REDO_AMOUNT(null);

  // reset all variables
  inputAmountState.value = 'XST';
  accounts.value = [{}];
  currentStep.value = 1;
  depositAddress.value = '';
  label.value = '';
  amount.value = null;
  isFeeless.value = true;

  clearTimeout(counterTimeout.value);
  counter.value = 5;
  remove(['amount']);
  resetFields();

  if (currentRoute.value !== 'AccountDetails') {
    // because we don't want to mess up the account details screen if the modal is opened there
    mainStore.SET_ACCOUNT_DETAILS(null);
  }
}

const accounts = ref([{}]);
async function scanWallet() {
  accounts.value = fil(
    (el) => !el.isArchived && el.utxo >= minimumXSTForSend.value,
    mainStore.wallet.accounts
  );
  if (pickedAccount.value) {
    // already picked from account details
    account.value = { ...mainStore.accountDetails };
    // await getUnspentOutputs(account.value);
    // return;
  }
  if (mainStore.redoAccount) {
    // redo account has a priority
    account.value = accounts.value.find(
      (el) => el.label === mainStore.redoAccount
    );
  }
  // select first option so it doesn't remain empty
  if (!account.value || Object.keys(account.value).length === 0) {
    account.value = mainStore.wallet.accounts.filter(
      (el) => el.utxo >= minimumXSTForSend.value
    )[0];
  }

  await getUnspentOutputs(account.value);
}

let unspentOutputs = [];

async function getUnspentOutputs(acc) {
  console.log('GET UNSPENT OUTPUTS', acc);
  if (!acc || Object.keys(acc).length === 0) return;
  let res = [];
  if (acc.xpub) {
    res = await mainStore.rpc('gethdaccount', [acc.xpub]);

    // map only unspent outputs, put txid in each one of them and flatten the array
    unspentOutputs = res
      .map((el) => {
        let tmp = el.outputs.filter((el) => el.isspent === 'false');
        for (let o of tmp) {
          o['txid'] = el.txid;
        }
        return tmp;
      })
      .filter((el) => el.length > 0)
      .reduce((a, b) => a.concat(b), []);
  } else {
    res = await mainStore.rpc('getaddressoutputs', [acc.address, 1, 99999]);
    unspentOutputs = fil((el) => el.isspent === 'false', res);
  }
  account.value = accounts.value.find((el) => el.address === acc.address);
}

function findFee(fee = 0.01) {
  if (fee < aproxFee.value) fee = aproxFee.value;
  if (isFeeless.value) {
    aproxFee.value = 0;
    return;
  }
  if (!amount.value || amount.value === 0) {
    aproxFee.value = 0.01;
    return;
  }
  // steps:
  // 1. find unspentOutputs for selected account
  // 2. start with fee = 0.01
  // 3. target = sendForm.amount + fee
  let target = MathService.add(amount.value, aproxFee.value);
  // 4. bestOutputs = coinControl(target, unspentOutputs)
  let bestOutputs = coinSelection(target);
  // 5. newFee = feeEstimator(bestOutputs.length)
  let newFee = useFeeEstimator(bestOutputs.length);
  // 5. if fee !== newFee, goTo step 1
  if (newFee.fee > fee) {
    findFee(newFee.fee);
  } else {
    aproxFee.value = newFee.fee;
  }
}

function coinSelection(targetAmount) {
  const { best } = useCoinControl(unspentOutputs, targetAmount);
  return best;
}

async function prepareSend() {
  try {
    await validateFields();
    changeStep(4);
    //countdown();
    send();
  } catch (e) {
    if (e instanceof ValidationError) {
      console.log(e);
    }
  }
}

async function addFailedTx() {
  changeStep(6);
  mainStore.ADD_FAILED_TRANSACTION({
    account: account.value.label,
    account_balance_change: amount.value,
    amount: MathService.add(amount.value, aproxFee.value),
    blocktime: getUnixTime(new Date()),
    txinfo: {
      blocktime: getUnixTime(new Date()),
      destinations: [depositAddress.value],
    },
    txid: '-',
    isPending: true,
    isFailed: true,
    isFeeless: isFeeless.value,
  });

  await CryptoService.scanWallet();
  emitter.emit('transactions:refresh');
}

async function send() {
  try {
    changeStep(5);
    await validateFields();
    let target = MathService.add(amount.value, aproxFee.value);
    const utxo = coinSelection(target);

    if (utxo.length === 0) {
      setTimeout(() => addFailedTx(), 1);
      return;
    }
    console.info(
      'TRANSACTION BUILDER: candidates: ',
      JSON.stringify(unspentOutputs)
    );
    console.info('TRANSACTION BUILDER: entered amount: ', amount.value);
    console.info('TRANSACTION BUILDER: fee: ', aproxFee.value);
    console.info('TRANSACTION BUILDER: target amount: ', target);

    let transactionResponse = '';
    if (account?.value?.wif && account?.value?.isImported) {
      // build transaction for imported account
      try {
        transactionResponse = await useTransactionBuilderForImportedAccount(
          utxo,
          {
            address: depositAddress.value.trim(),
            amount: target,
            account: account.value,
            isFeeless: isFeeless.value,
          }
        );
      } catch (e) {
        console.log('Transaction builder error: ', e);
        setTimeout(() => addFailedTx(), 1);
      }
    } else {
      console.log(
        'TRANSACTION BUILDER: sending from HD account',
        account?.value?.xpub
      );
      // build transaction for native hd account
      try {
        transactionResponse = await useTransactionBuilder(utxo, {
          address: depositAddress.value.trim(),
          amount: target,
          account: account.value,
          isFeeless: isFeeless.value,
        });
      } catch (e) {
        console.log('Transaction builder error: ', e);
        setTimeout(() => addFailedTx(), 1);
      }
    }
    if (transactionResponse.txid) {
      mainStore.ADD_PENDING_TRANSACTION({
        account: account.value.label,
        account_balance_change: amount.value,
        amount: MathService.add(amount.value, aproxFee.value),
        txid: transactionResponse.txid,
        txinfo: {
          blocktime: getUnixTime(new Date()),
          destinations: [depositAddress.value],
        },
        blocktime: getUnixTime(new Date()),
        isPending: true,
        isFailed: false,
      });
      await CryptoService.storeTxAndLabel(
        transactionResponse.txid,
        label.value
      );
      // await CryptoService.scanWallet();
      emitter.emit('transactions:refresh');
      changeStep(6);
    }
  } catch (e) {
    if (e instanceof ValidationError) {
      console.log(e);
    } else {
      setTimeout(() => addFailedTx(), 1);
    }
  }
}

async function validateSecondStep() {
  try {
    await validateFields();
    changeStep(3);
  } catch (e) {
    if (e instanceof ValidationError) {
      console.log(e);
    }
  }
}

async function validateFirstStep() {
  try {
    await validateFields();
    if (mainStore.redoLabel) {
      label.value = mainStore.redoLabel;
    }
    if (mainStore.redoAmount > 0) {
      // setTimeout(() => {
      amount.value = mainStore?.redoAmount || 0;
      // }, 1);
      isFeeless.value = mainStore.isFeeless;
    } else {
      setTimeout(() => (inputAmountState.value = 'USD'), 1);
      setTimeout(() => (inputAmountState.value = 'XST'), 1);
    }
    add(['amount'], {
      $value: amount,
      $rules: [
        (amount) => {
          // findFee();
          let fee = aproxFee.value;
          // subtract real fee from amount
          const maxAmount = MathService.subtract(account.value.utxo, fee);
          if (inputAmountState.value === 'XST') {
            if (!amount || Number(amount) < minimumXSTForSend.value) {
              return 'Minimum amount is ' + minimumXSTForSend.value + ' XST';
            }
            if (Number(amount) > maxAmount) {
              return 'Insufficient funds on this account';
            }
          }
        },
      ],
    });
    changeStep(2);
  } catch (e) {
    if (e instanceof ValidationError) {
      console.log(e);
    }
  }
}

async function changeStep(step) {
  currentStep.value = step;
  if (step === 1) {
    isLoading.value = true;
    // if going back from step 2 to step 1
    // remove address from validation
    await CryptoService.scanWallet();
    await scanWallet();
    remove(['amount']);
    isLoading.value = false;
  }
}

function loadMax() {
  // get amount from account
  // check if amount is less than miminim amount for send
  // if not, find real fee
  amount.value = 0;
  let fee = 0;
  // console.log('getUnspentOutputs(account.value)', getUnspentOutputs(account.value));
  if (!isFeeless.value) {
    let feeObj = useFeeEstimator(unspentOutputs.length);
    fee = feeObj.fee;
  }
  aproxFee.value = fee;
  // subtract real fee from all utxos
  let sumUtxo = unspentOutputs
    .map((el) => el.amount)
    .reduce((a, b) => MathService.add(a, b), 0);
  const maxAmount = MathService.subtract(sumUtxo, fee);
  form.amount.$value = maxAmount;
  setTimeout(() => (inputAmountState.value = 'USD'), 1);
  setTimeout(() => (inputAmountState.value = 'XST'), 1);
}

function formatValue(value) {
  if (inputAmountState.value === 'XST') {
    amountUSD.value = Math.abs(
      form.amount.$value * CryptoService.constraints.XST_USD
    );
  }
  inputAmountState.value = value;
}

function startScanner() {
  navigator.mediaDevices.enumerateDevices().then((devices) => {
    let camera = devices.filter((obj) => obj.kind === 'videoinput');
    if (camera[0].kind === 'videoinput' && camera[0].label) {
      cameraAllowed.value = true;
      isCameraLoading.value = true;
      setTimeout(() => (isCameraLoading.value = false), 2000);
    } else {
      cameraAllowed.value = false;
    }
  });
  QRData.value = null;
  isScaning.value = true;
  form.depositAddress.$value = '';
}

function onDecode(data) {
  QRData.value = data.split('?');
  if (QRData.value) {
    isScaning.value = false;
    let address = QRData.value[0].replace(/[^a-z0-9]/gi, '');
    let amount =
      QRData.value.length > 1 ? QRData.value[1].replace('amount=', '') : 0;
    form.depositAddress.$value = address;
    if (QRData.value.length > 1) {
      validateFirstStep();
      setTimeout(() => {
        form.amount.$value = amount;
        setTimeout(() => (inputAmountState.value = 'USD'), 1);
        setTimeout(() => (inputAmountState.value = 'XST'), 1);
      }, 1);
    }
  }
}

function changeAmount() {
  findFee();
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
:deep .st-amount > .st-icon {
  cursor: pointer;
}
:deep .st-switch--thunder {
  /* margin-top: 8px; */
  cursor: pointer;
}
.switch > p {
  margin-left: 20px;
}
.payment > h5 {
  font-family: var(--secondary-font);
  font-size: 14px;
  line-height: 24px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.12px;
}
.payment-grid {
  margin-top: 28px;
  display: grid;
  grid-template-columns: auto 11fr;
  grid-gap: 16px 24px;
}
:deep .payment-input > label {
  left: 0;
  right: 0;
  text-align: center;
}
.multiselect-single-label {
  display: flex;
  flex-direction: column;
  color: #fff;
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
.load-max {
  cursor: pointer;
  transition: 0.3s;
}
.load-max:hover {
  color: var(--marine200);
}
.switch-disabled {
  pointer-events: none;
}
.progress-animated {
  position: relative;
  top: -2px;
  left: -2px;
  width: 104px;
  height: 104px;
}
.progress {
  margin: 38px auto 44px;
  position: relative;
  width: 100px;
  height: 100px;
  background: rgba(224, 211, 252, 0.3);
  border-radius: 100px;
}
.no-background {
  background: none;
}
.progress-note {
  font-family: var(--secondary-font);
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.12px;
  text-align: center;
}
.overlay {
  background-color: var(--marine900);
  border-radius: 100%;
  position: absolute;
  top: 1px;
  right: 1px;
  bottom: 1px;
  left: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  line-height: 28px;
  letter-spacing: 0.12px;
  font-family: var(--secondary-font);
}
:deep .multiselect--active .multiselect__tags {
  padding-top: 25px;
}
:deep .multiselect__content-wrapper {
  top: 4px;
  padding-top: 65px;
}
.tooltip svg {
  display: block;
}

.no-step :deep .st-modal__stepper {
  display: none;
}
.no-camera {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100% - 80px);
}
.no-camera :deep svg {
  display: block;
  margin: 0 auto 24px;
  width: 140px;
}
.no-camera :deep svg path {
  fill: #fff;
}
.no-camera h6 {
  color: #fff;
}
.loading-gif {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.loading-gif img {
  display: block;
  height: 28px;
  position: absolute;
}
</style>

<style>
.send-modal .st-modal-container {
  width: 480px;
  height: 520px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.send-modal .st-modal__header {
  margin-bottom: 44px;
}
.send-modal .st-modal__body {
  margin: 0;
}
.send-modal .st-form-item {
  margin: 0 0 16px;
}
.send-modal .st-modal__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: auto;
}
.tx-failed-controls {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.tx-failed-controls .st-button--secondary {
  color: var(--grey50);
}
.cancel-btn {
  margin-top: 12px;
  color: var(--grey50) !important;
}
:deep .st-form-item .st-form-item__error,
.error {
  position: absolute;
  left: 0;
  right: 0;
  text-align: left;
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
.qr-modal {
  backdrop-filter: blur(0px) !important;
  background-color: transparent !important;
}
.qr-modal .st-modal-wrapper .st-modal-container .st-modal__body {
  height: 100%;
}
.qr-stream-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
}
.frame {
  border: 2px solid var(--marine500);
  width: 200px;
  height: 200px;
}

.st-switch--dark {
  margin-top: 28px;
}
</style>
