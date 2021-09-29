<template>
  <StModal
    :has-click-outside="false"
    :show-back-button="currentStep < 4"
    :steps="3"
    :show-close-button="currentStep <= 4 || currentStep === 6"
    :current-step="currentStep"
    :visible="isVisible"
    class="send-modal"
    @close="cancelSend"
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
      <template v-if="currentStep === 4">Sending XST</template>
      <template v-if="currentStep === 5">Sending XST</template>
      <template v-if="currentStep === 6">Success</template>
      <template v-if="currentStep === 7">Warning</template>
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
          :filled="form.account.$value"
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
            :disabled="!form.account.$value"
            @select="getUnspentOutputs"
            @remove="preventRemove($event)"
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
      <template v-if="currentStep === 4">
        <div class="progress">
          <SvgIcon name="icon-loader-light" class="progress-animated" />
          <div class="overlay">{{ counter }}s</div>
        </div>
        <p class="progress-note">Your transactions is being prepared</p>
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
        <p class="progress-note">Transaction sent</p>
      </template>
      <template v-if="currentStep === 7">
        <div class="progress no-background">
          <SvgIcon name="icon-loader-fail-light" />
        </div>
        <p class="progress-note">Transaction failed</p>
      </template>
    </template>
    <template #footer class="flex-center-all">
      <template v-if="currentStep === 1">
        <StButton
          :disabled="!account || Object.keys(account).length === 0"
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
      <template v-if="currentStep === 4">
        <StButton type="type-d" @click="cancelSend">Cancel</StButton>
      </template>
      <div class="tx-failed-controls" v-if="currentStep === 7">
        <StButton @click="prepareSend" type="type-d">Try Again</StButton>
        <StButton class="cancel-btn" @click="closeModal" type="type-b"
          >Cancel</StButton
        >
      </div>
    </template>
  </StModal>
</template>

<script>
/* eslint-disable no-unreachable */
import { useMainStore } from '@/store';
import { computed, ref, watch, watchEffect } from 'vue';
import CryptoService from '@/services/crypto';
import useCoinControl from '@/composables/useCoinControl';
import useTransactionBuilder from '@/composables/useTransactionBuilder';
import useTransactionBuilderForImportedAccount from '@/composables/useTransactionBuilderForImportedAccount';
import useFeeEstimator from '@/composables/useFeeEstimator';
import useHelpers from '@/composables/useHelpers';
import { useValidation, ValidationError } from 'vue3-form-validation';
import { useRoute } from 'vue-router';
import { format, add, subtract } from 'mathjs';
import emitter from '@/services/emitter';
import { QrStream } from 'vue3-qr-reader';
import SvgIcon from '../partials/SvgIcon.vue';
import CircleProgress from '../partials/CircleProgress.vue';

const sumOf = (x = 0, y = 0) => {
  let sum = add(x, y);
  sum = format(sum, { precision: 14 });
  return Number(sum);
};
export default {
  name: 'StSendModal',
  components: {
    QrStream,
    SvgIcon,
    CircleProgress,
  },
  setup() {
    const mainStore = useMainStore();
    const { formatAmount } = useHelpers();

    const isVisible = computed(() => {
      return mainStore.modals.send;
    });
    const inputAmountState = ref('XST');
    const account = ref(null);
    const amount = ref(null);
    const amountUSD = ref(null);
    const depositAddress = ref('');
    const aproxFee = ref(0.01);
    const currentStep = ref(1);
    const counter = ref(5);
    const counterTimeout = ref(null);
    const sendTimeout = ref(null);
    const label = ref('');
    const isScaning = ref(false);
    const QRData = ref(null);
    const cameraAllowed = ref(false);
    const isCameraLoading = ref(false);
    const isFeeless = ref(false);

    const pickedAccount = computed(() => {
      return mainStore.accountDetails;
    });

    const minimumXSTForSend = computed(() => {
      return CryptoService.constraints.MINIMUM_XST_FOR_SEND;
    });

    watchEffect(() => {
      if (currentStep.value === 1) {
        if (mainStore.sendAddress) {
          // let redoAccount = accounts.value.find(
          //   (obj) => obj.label === mainStore.redoAccount
          // );
          // account.value = redoAccount;
          depositAddress.value = mainStore.sendAddress;
        }
      }
      if (currentStep.value === 2) {
        if (mainStore.redoAmount) {
          amount.value = mainStore.redoAmount;
          isFeeless.value = mainStore.isFeeless;
        } else {
          amount.value = null;
          setTimeout(() => (inputAmountState.value = 'USD'), 1);
          setTimeout(() => (inputAmountState.value = 'XST'), 1);
        }
      }
      if (currentStep.value === 4) {
        sendTimeout.value = setTimeout(() => send(), 4900);
      }
      if (currentStep.value === 5) {
        // setTimeout(() => send(), 4000)
        clearTimeout(counterTimeout.value);
        counter.value = 5;
      }
    });

    const route = useRoute();

    const currentRoute = computed(() => {
      return route.name;
    });

    const {
      form,
      errors,
      remove,
      add,
      // submitting,
      validateFields,
      resetFields,
    } = useValidation({
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
        findFee(0.01);
      }
    );

    watch(
      () => isVisible.value,
      () => {
        scanWallet();
        if (!isVisible.value) {
          closeModal();
        } else {
          mainStore.checkRpcStatus();
        }
      }
    );

    function closeModal() {
      mainStore.SET_MODAL_VISIBILITY('send', false);
      mainStore.SET_SEND_ADDRESS('');
      mainStore.SET_REDO_ACCOUNT('');
      mainStore.SET_FEELESS(false);
      mainStore.SET_REDO_AMOUNT(null);
      // reset all variables
      inputAmountState.value = 'XST';
      // account.value = null;
      accounts.value = [];
      // amount.value = null;
      currentStep.value = 1;
      depositAddress.value = '';
      label.value = '';
      clearTimeout(counterTimeout.value);
      counter.value = 5;
      remove(['amount']);
      resetFields();
      if (currentRoute.value !== 'AccountDetails') {
        // because we don't want to mess up the account details screen if the modal is opened there
        mainStore.SET_ACCOUNT_DETAILS(null);
      }
    }

    const accounts = ref([]);

    async function scanWallet() {
      if (pickedAccount.value) {
        // already picked from account details
        account.value = { ...pickedAccount.value };
      }
      const hdWallet = await CryptoService.scanWallet();
      accounts.value = hdWallet.accounts.filter((el) => !el.isArchived);

      if (mainStore.redoAccount) {
        // redo account has a priority
        account.value = accounts.value.find(
          (el) => el.label === mainStore.redoAccount
        );
      }
      // select first option so it doesn't remain empty
      if (!account.value) {
        account.value = hdWallet.accounts[0];
      }

      getUnspentOutputs(account.value);
      // // manually start finding address for preselected account
      // changeAccount(account.value)
    }

    // scanWallet();
    let unspentOutputs = [];

    async function getUnspentOutputs(acc) {
      if (!acc) return;
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
        unspentOutputs = res.filter((el) => el.isspent === 'false');
      }
    }

    function findFee(fee = 0.01) {
      if (isFeeless.value) {
        aproxFee.value = 0;
        return 0;
      }
      if (!amount.value || amount.value === 0) {
        return 0.01;
      }
      // steps:
      // 1. find unspentOutputs for selected account
      // 2. start with fee = 0.01
      // 3. target = sendForm.amount + fee
      let target = sumOf(amount.value, fee);
      // 4. bestOutputs = coinControl(target, unspentOutputs)
      let bestOutputs = coinSelection(target);
      // 5. newFee = feeEstimator(bestOutputs.length)
      let newFee = useFeeEstimator(bestOutputs.length);
      // 5. if fee !== newFee, goTo step 1
      if (newFee.fee > fee) {
        return findFee(newFee.fee);
      }
      aproxFee.value = newFee.fee;
      return aproxFee.value;
    }

    function coinSelection(targetAmount) {
      const { best } = useCoinControl(unspentOutputs, targetAmount);
      return best;
    }

    async function prepareSend() {
      try {
        await validateFields();
        changeStep(4);
        countdown();
      } catch (e) {
        if (e instanceof ValidationError) {
          console.log(e);
        }
      }
    }

    function countdown() {
      counter.value -= 1;
      counterTimeout.value = setTimeout(() => countdown(), 1000);
    }

    function cancelSend() {
      closeModal();
      clearTimeout(sendTimeout.value);
    }

    async function send() {
      try {
        changeStep(5);
        await validateFields();
        let target = sumOf(amount.value, aproxFee.value);
        const utxo = coinSelection(target);

        if (utxo.length === 0) {
          setTimeout(() => changeStep(7), 4000);
          return;
        }
        console.info('TRANSACTION BUILDER: candidates: ', unspentOutputs);
        console.info('TRANSACTION BUILDER: coin control: ', utxo);
        console.info('TRANSACTION BUILDER: entered amount: ', amount.value);
        console.info('TRANSACTION BUILDER: fee: ', aproxFee.value);
        console.info('TRANSACTION BUILDER: target amount: ', target);

        // return;

        let transactionResponse = '';
        if (account.value.wif && account.value.isImported) {
          // build transaction for imported account
          transactionResponse = await useTransactionBuilderForImportedAccount(
            utxo,
            {
              address: depositAddress.value.trim(),
              amount: target,
              account: account.value,
              isFeeless: isFeeless.value,
            }
          );
        } else {
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
            setTimeout(() => changeStep(7), 4000);
          }
        }
        if (transactionResponse.txid) {
          CryptoService.storeTxAndLabel(transactionResponse.txid, label.value);
          setTimeout(() => {
            changeStep(6);
            emitter.emit('transactions:refresh');
            emitter.emit('accounts:refresh');
          }, 4000);
        } else {
          setTimeout(() => changeStep(7), 4000);
        }
      } catch (e) {
        if (e instanceof ValidationError) {
          console.log(e);
        } else {
          setTimeout(() => changeStep(7), 4000);
        }
      }
    }

    let copyPending = ref(false);
    function handleCopy() {
      copyPending.value = true;
      setTimeout(() => {
        copyPending.value = false;
      }, 2000);
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
        add(['amount'], {
          $value: amount,
          $rules: [
            (amount) => {
              let fee = findFee();
              // subtract real fee from amount
              const maxAmount = format(subtract(account.value.utxo, fee), {
                precision: 8,
              });
              if (inputAmountState.value === 'XST') {
                if (!amount || Number(amount) < minimumXSTForSend.value) {
                  return (
                    'Minimum amount is ' + minimumXSTForSend.value + ' XST'
                  );
                }
                if (Number(amount) > maxAmount) {
                  return 'Insufficient funds on this account';
                }
              }
            },
          ],
        });
        changeStep(2);
        findFee();
      } catch (e) {
        if (e instanceof ValidationError) {
          console.log(e);
        }
      }
    }

    function changeStep(step) {
      currentStep.value = step;
      if (step === 1) {
        // if going back from step 2 to step 1
        // remove address from validation
        remove(['amount']);
      }
    }

    function loadMax(item) {
      // get amount from account
      // check if amount is less than miminim amount for send
      // if not, find real fee
      amount.value = 0;
      let fee = findFee();
      // console.log('fee: ', fee);
      // subtract real fee from amount
      const maxAmount = format(subtract(item.utxo, fee), { precision: 14 });
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

    return {
      preventRemove,
      loadMax,
      validateFirstStep,
      validateSecondStep,

      isVisible,
      closeModal,
      inputAmountState,

      accounts,
      account,
      amount,
      depositAddress,
      label,
      aproxFee,
      amountUSD,
      cameraAllowed,
      isCameraLoading,
      isFeeless,
      // changeAccount,

      currentStep,
      changeStep,

      handleCopy,
      copyPending,
      prepareSend,
      cancelSend,
      formatValue,
      startScanner,
      isScaning,

      send,
      getUnspentOutputs,
      formatAmount,
      counter,
      minimumXSTForSend,
      QRData,
      onDecode,
      changeAmount,

      form,
      errors,
    };
  },
};
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
  color: var(--white);
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
  fill: var(--white);
}
.no-camera h6 {
  color: var(--white);
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
