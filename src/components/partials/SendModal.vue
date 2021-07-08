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
            @select="getUnspentOutputs"
            @remove="preventRemove($event)"
          >
            <template #singleLabel>
              <div class="multiselect-single-label">
                <p class="account-label">
                  {{ account && account.label }}
                </p>
                <p class="account-utxo">
                  {{ account && formatAmount(account.utxo, true, 8, 2) }}
                </p>
              </div>
            </template>

            <template #option="{ option }">
              <div class="flex-space-between">
                <span>
                  {{ option.label }}
                </span>
                <span> {{ formatAmount(option.utxo, true, 8, 2) }} XST </span>
              </div>
            </template>
          </StMultiselect>
        </StFormItem>
        <div class="form-item">
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
              placeholder="Amount"
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
              <svg
                width="19"
                height="16"
                viewBox="0 0 19 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                @click="inputAmountState = 'USD'"
              >
                <path
                  d="M10.4445 11.5557L14.2222 14.2223L18 11.5557"
                  stroke="#E5E4E8"
                  stroke-width="2"
                />
                <path
                  d="M14.2222 14.2222L14.2222 1.77773"
                  stroke="#E5E4E8"
                  stroke-width="2"
                />
                <path
                  d="M4.77777 1.77783V14.2223"
                  stroke="#E5E4E8"
                  stroke-width="2"
                />
                <path
                  d="M1 4.4445L4.77778 1.77783L8.55555 4.4445"
                  stroke="#E5E4E8"
                  stroke-width="2"
                />
              </svg>
            </StAmount>
            <StAmount
              v-else-if="inputAmountState === 'USD'"
              v-model="form.amount.$value"
              color="dark"
              placeholder="Amount"
              :options="{
                locale: 'en',
                currency: 'USD',
                distractionFree: false,
                valueAsInteger: false,
                useGrouping: true,
                precision: 2,
                allowNegative: false,
              }"
            >
              <svg
                width="19"
                height="16"
                viewBox="0 0 19 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                @click="inputAmountState = 'XST'"
              >
                <path
                  d="M10.4445 11.5557L14.2222 14.2223L18 11.5557"
                  stroke="#E5E4E8"
                  stroke-width="2"
                />
                <path
                  d="M14.2222 14.2222L14.2222 1.77773"
                  stroke="#E5E4E8"
                  stroke-width="2"
                />
                <path
                  d="M4.77777 1.77783V14.2223"
                  stroke="#E5E4E8"
                  stroke-width="2"
                />
                <path
                  d="M1 4.4445L4.77778 1.77783L8.55555 4.4445"
                  stroke="#E5E4E8"
                  stroke-width="2"
                />
              </svg>
            </StAmount>
            <p class="form-desc">Minimum: {{ minimumXSTForSend }} XST</p>
          </StFormItem>
        </div>
      </template>
      <template v-if="currentStep === 2">
        <div class="form-item">
          <StFormItem
            color="dark"
            :filled="form.depositAddress.$value"
            label="Receiving Address"
            :error-message="form.depositAddress.$errors"
          >
            <StInput
              v-model="form.depositAddress.$value"
              placeholder="Deposit address"
              color="dark"
            >
              <StTooltip
                v-if="depositAddress"
                :tooltip="
                  copyPending ? 'Copied to clipboard!' : 'Click to copy'
                "
                position="bottom-right"
              >
                <StClipboard :content="depositAddress" @click="handleCopy">
                  <svg
                    width="15"
                    height="19"
                    viewBox="0 0 15 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 5.5H1V17.5H10V5.5Z"
                      stroke="#E5E4E8"
                      stroke-width="2"
                    />
                    <path
                      d="M14 14.5L14 0.500013"
                      stroke="#E5E4E8"
                      stroke-width="2"
                    />
                    <path d="M2 1.5L14 1.5" stroke="#E5E4E8" stroke-width="2" />
                  </svg>
                </StClipboard>
              </StTooltip>
            </StInput>
          </StFormItem>
        </div>
        <div class="form-item">
          <StFormItem label="Label" :filled="label" color="dark">
            <StInput
              v-model="label"
              placeholder="Add a label to your transaction"
            />
          </StFormItem>
        </div>
      </template>
      <template v-if="currentStep === 3">
        <div class="payment">
          <h5>Payment Details</h5>
          <div class="payment-grid">
            <p class="bold">Account:</p>
            <p>{{ account.label }}</p>
            <p class="bold">Amount:</p>
            <p>{{ amount }} XST</p>
            <p class="bold">Address</p>
            <p>{{ depositAddress }}</p>
            <p class="bold">Label:</p>
            <p>{{ label ? label : 'No label' }}</p>
            <p class="bold">Fee:</p>
            <p>{{ aproxFee ? formatAmount(aproxFee) : '0.02' }} XST</p>
          </div>
        </div>
      </template>
      <template v-if="currentStep === 4">
        <div class="progress">
          <svg
            class="progress-animated"
            version="1.1"
            id="circle"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 100 100"
            xml:space="preserve"
          >
            <circle
              fill="none"
              stroke="#E0D3FC"
              stroke-width="1"
              stroke-mitterlimit="0"
              cx="50"
              cy="50"
              r="48"
              stroke-dasharray="360"
              stroke-linecap="round"
              transform="rotate(-90 ) translate(-100 0)"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="360;0"
                dur="5s"
                repeatCount="indefinite"
              ></animate>
            </circle>
          </svg>
          <div class="overlay">{{ counter }}s</div>
        </div>
        <p class="progress-note">Your transactions is being prepared</p>
      </template>
      <template v-if="currentStep === 5">
        <div class="progress">
          <svg
            class="progress-animated"
            version="1.1"
            id="circle"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 100 100"
            xml:space="preserve"
          >
            <circle
              fill="none"
              stroke="#E0D3FC"
              stroke-width="1"
              stroke-mitterlimit="0"
              cx="50"
              cy="50"
              r="48"
              stroke-dasharray="360"
              stroke-linecap="round"
              transform="rotate(-90 ) translate(-100 0)"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="360;0"
                dur="3.8s"
                repeatCount="indefinite"
              ></animate>
            </circle>
          </svg>
          <div class="overlay"></div>
        </div>
        <p class="progress-note">
          Your transaction is being processed, <br />please be patient.
        </p>
      </template>
      <template v-if="currentStep === 6">
        <div class="progress no-background">
          <svg
            width="102"
            height="102"
            viewBox="0 0 102 102"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle opacity=".3" cx="51" cy="51" r="50" stroke="#E0D3FC" />
            <circle cx="51" cy="51" r="50" stroke="#E0D3FC" />
            <path
              d="M63.456 44.515l-16.97 16.97L38 53"
              stroke="#FAF9FC"
              stroke-width="2"
            />
          </svg>
        </div>
        <p class="progress-note">Transaction sent</p>
      </template>
      <template v-if="currentStep === 7">
        <div class="progress no-background">
          <svg
            width="102"
            height="102"
            viewBox="0 0 102 102"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle opacity=".3" cx="51" cy="51" r="50" stroke="#E0D3FC" />
            <circle cx="51" cy="51" r="50" stroke="#E0D3FC" />
            <path
              d="M60.97 44.03L44 61M44.03 44.03L61 61"
              stroke="#FAF9FC"
              stroke-width="2"
            />
          </svg>
        </div>
        <p class="progress-note">Transaction failed</p>
      </template>
    </template>
    <template #footer class="flex-center-all">
      <template v-if="currentStep === 1">
        <StButton type="type-d" @click="validateFirstStep">Proceed</StButton>
      </template>
      <template v-if="currentStep === 2">
        <StButton @click="validateSecondStep" type="type-d">Proceed</StButton>
      </template>
      <template v-if="currentStep === 3">
        <StButton type="type-d" @click="prepareSend">Confirm payment</StButton>
      </template>
      <template v-if="currentStep === 4">
        <StButton type="type-d" @click="cancelSend">Cancel</StButton>
      </template>
      <div class="tx-failed-controls" v-if="currentStep === 7">
        <StButton @click="prepareSend" type="type-d">Try Again</StButton>
        <StButton @click="closeModal" type="type-d">Cancel</StButton>
      </div>
    </template>
  </StModal>
</template>

<script>
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

const sumOf = (x = 0, y = 0) => {
  let sum = add(x, y);
  sum = format(sum, { precision: 8 });
  return Number(sum);
};
export default {
  name: 'StSendModal',
  setup() {
    const mainStore = useMainStore();
    const { formatAmount } = useHelpers();

    const isVisible = computed(() => {
      return mainStore.modals.send;
    });
    const inputAmountState = ref('XST');
    const account = ref(null);
    const amount = ref(0);
    const depositAddress = ref('');
    const aproxFee = ref(null);
    const currentStep = ref(1);
    const counter = ref(5);
    const counterTimeout = ref(null);
    const sendTimeout = ref(null);

    const pickedAccount = computed(() => {
      return mainStore.accountDetails;
    });

    const minimumXSTForSend = computed(() => {
      return CryptoService.constraints.MINIMUM_XST_FOR_SEND;
    });

    watchEffect(() => {
      if (currentStep.value === 2) {
        if (mainStore.sendAddress) {
          depositAddress.value = mainStore.sendAddress;
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
      add,
      remove,
      // submitting,
      validateFields,
      resetFields,
    } = useValidation({
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
      amount: {
        $value: amount,
        $rules: [
          (amount) => {
            let fee = findFee();
            // subtract real fee from amount
            const maxAmount = format(subtract(account.value.utxo, fee), {
              precision: 8,
            });
            if (!amount || Number(amount) < minimumXSTForSend.value) {
              return 'Minimum amount is ' + minimumXSTForSend.value + ' XST';
            }
            if (Number(amount) > maxAmount) {
              return 'Insufficient funds on this account';
            }
          },
        ],
      },
    });

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
      // reset all variables
      // account.value = null;
      accounts.value = [];
      // amount.value = null;
      currentStep.value = 1;
      depositAddress.value = '';
      label.value = '';
      clearTimeout(counterTimeout.value);
      counter.value = 5;
      remove(['depositAddress']);
      resetFields();
      if (currentRoute.value !== 'AccountDetails') {
        // because we don't want to mess up the account details screen if the modal is opened there
        mainStore.SET_ACCOUNT_DETAILS(null);
      }
    }

    const accounts = ref([]);
    const label = ref('');

    async function scanWallet() {
      if (pickedAccount.value) {
        // already picked from account details
        account.value = { ...pickedAccount.value };
      }
      const hdWallet = await CryptoService.scanWallet();
      accounts.value = hdWallet.accounts.filter((el) => !el.isArchived);

      // select first option
      if (!pickedAccount.value) {
        account.value = hdWallet.accounts[0];
      }
      getUnspentOutputs(account.value);
      // // manually start finding address for preselected account
      // changeAccount(account.value)
    }

    scanWallet();
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
        res = await mainStore.rpc('getaddressoutputs', [acc.address]);
        unspentOutputs = res.filter((el) => el.isspent === 'false');
      }
      //       const outputs = await mainStore.rpc('getaddressoutputs', [
      //   acc.address,
      //   1,
      //   100,
      // ]);
    }

    function findFee(fee = 0.01) {
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

        let transactionResponse = '';
        if (account.value.wif && account.value.isImported) {
          // build transaction for imported account
          transactionResponse = await useTransactionBuilderForImportedAccount(
            utxo,
            {
              address: depositAddress.value,
              amount: target,
              account: account.value,
            }
          );
        } else {
          // build transaction for native hd account
          try {
            transactionResponse = await useTransactionBuilder(utxo, {
              address: depositAddress.value,
              amount: target,
              account: account.value,
            });
          } catch (e) {
            console.log('Transaction builder error: ', e);
            changeStep(7);
          }
        }
        if (transactionResponse.txid) {
          CryptoService.storeTxAndLabel(transactionResponse.txid, label.value);
          setTimeout(() => changeStep(6), 4000);
        } else {
          setTimeout(() => changeStep(7), 4000);
        }
        // setTimeout(() => closeModal(), 2000);
      } catch (e) {
        if (e instanceof ValidationError) {
          console.log(e);
        } else {
          changeStep(7);
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
        add(['depositAddress'], {
          $value: depositAddress,
          $rules: [
            (depositAddress) =>
              (!depositAddress ||
                !CryptoService.isAddressValid(depositAddress)) &&
              'Please enter a valid XST address',
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
        remove(['depositAddress']);
      }
    }

    function loadMax(item) {
      // get amount from account
      // check if amount is less than miminim amount for send
      // if not, find real fee
      let fee = findFee();
      // subtract real fee from amount
      const maxAmount = format(subtract(item.utxo, fee), { precision: 8 });
      form.amount.$value = maxAmount;
      setTimeout(() => (inputAmountState.value = 'USD'), 1);
      setTimeout(() => (inputAmountState.value = 'XST'), 1);
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
      // changeAccount,

      currentStep,
      changeStep,

      handleCopy,
      copyPending,
      prepareSend,
      cancelSend,

      send,
      getUnspentOutputs,
      formatAmount,
      counter,
      minimumXSTForSend,

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
}
.load-max {
  cursor: pointer;
  transition: 0.3s;
}
.load-max:hover {
  color: var(--marine200);
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
  margin: 0 0 32px;
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
</style>
