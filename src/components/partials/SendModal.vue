<template>
  <StModal
    :show-back-button="currentStep < 4"
    :steps="3"
    :current-step="currentStep"
    :visible="isVisible"
    class="send-modal"
    @close="closeModal"
    @back="changeStep"
  >
    <template #header>
      <template v-if="currentStep < 4">Send XST</template>
      <template v-if="currentStep === 4">Sending XST</template>
      <template v-if="currentStep === 5">Success</template>
      <template v-if="currentStep === 6">Warning</template>
    </template>
    <template #body>
      <template v-if="currentStep === 1">
        <StFormItem
          color="dark"
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
            placeholder="Select account"
            @select="getUnspentOutputs"
          >
            <template #singleLabel>
              <div class="multiselect-single-label">
                <p class="account-label">
                  {{ account && account.label }}
                </p>
                <p class="account-utxo">
                  {{ account && account.utxo }}
                </p>
              </div>
            </template>

            <template #option="{ option }">
              <div class="flex-space-between">
                <span>
                  {{ option.label }}
                </span>
                <span> {{ option.utxo }} XST </span>
              </div>
            </template>
          </StMultiselect>
        </StFormItem>
        <div class="form-item">
          <StFormItem
            color="dark"
            :error-message="form.amount.$errors"
            label="Amount"
          >
            <a v-if="account" class="load-max" @click="greet(account.utxo)"
              >Load max</a
            >
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
                precision: 8,
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
            <p class="form-desc">Minimum: 0.05 XST</p>
          </StFormItem>
        </div>
      </template>
      <template v-if="currentStep === 2">
        <div class="form-item">
          <StFormItem
            color="dark"
            label="Receiving Address"
            :error-message="form.depositAddress.$errors"
          >
            <StInput
              v-model="depositAddress"
              placeholder="Deposit address"
              color="dark"
            >
              <StTooltip
                v-if="depositAddress"
                :tooltip="
                  copyPending ? 'Copied to clipboard!' : 'Click to copy'
                "
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
          <StFormItem label="Label" color="dark">
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
                dur="4s"
                repeatCount="indefinite"
              ></animate>
            </circle>
          </svg>
          <div class="overlay"></div>
        </div>
        <p class="progress-note">
          Your transactions has been assambled, <br />please be patient
        </p>
      </template>
      <template v-if="currentStep === 5">
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
        <StButton color="white" @click="validateFirstStep">Proceed</StButton>
      </template>
      <template v-if="currentStep === 2">
        <StButton @click="validateSecondStep" color="white">Proceed</StButton>
      </template>
      <template v-if="currentStep === 3">
        <StButton color="white" @click="send">Confirm payment</StButton>
      </template>
    </template>
  </StModal>
</template>

<script>
import { useMainStore } from '@/store';
import { computed, ref, watch } from 'vue';
import CryptoService from '@/services/crypto';
import useCoinControl from '@/composables/useCoinControl';
import useTransactionBuilder from '@/composables/useTransactionBuilder';
import useFeeEstimator from '@/composables/useFeeEstimator';
import useHelpers from '@/composables/useHelpers';
import { useValidation, ValidationError } from 'vue3-form-validation';
import { useRoute } from 'vue-router';

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

    const pickedAccount = computed(() => {
      return mainStore.accountDetails;
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
            if (!amount || Number(amount) <= 0) {
              return 'Amount has to be positive';
            } else if (account.value && account.value.utxo < Number(amount)) {
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
        }
      }
    );

    const currentStep = ref(1);

    function closeModal() {
      mainStore.SET_MODAL_VISIBILITY('send', false);
      // reset all variables
      // account.value = null;
      accounts.value = [];
      // amount.value = null;
      currentStep.value = 1;
      depositAddress.value = '';
      label.value = '';
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
      accounts.value = hdWallet.accounts.filter(el => !el.isArchived);

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

    async function getUnspentOutputs(account) {
      if (!account) return;
      const res = await mainStore.rpc('gethdaccount', [account.xpub]);

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
      //       const outputs = await mainStore.rpc('getaddressoutputs', [
      //   account.address,
      //   1,
      //   100,
      // ]);

      // purpose of this is to calculate fee for next step
      let outputsForTx = coinSelection();
      let { fee } = useFeeEstimator(outputsForTx.length);
      aproxFee.value = fee;

      // unspentOutputs = outputs.filter((el) => el.isspent === 'false');
      // console.log('unspent outputs: ', unspentOutputs);
    }

    function coinSelection() {
      const { best } = useCoinControl(unspentOutputs, amount.value);
      return best;
    }

    async function send() {
      try {
        changeStep(4);
        await validateFields();
        const utxo = coinSelection();

        if (utxo.length === 0) {
          changeStep(6);
          return;
        }

        let { txid } = await useTransactionBuilder(utxo, {
          address: depositAddress.value,
          amount: amount.value,
          account: account.value,
        });
        if (txid) {
          CryptoService.storeTxAndLabel(txid, label.value);
          changeStep(5);
        } else {
          changeStep(6);
        }
        // setTimeout(() => closeModal(), 2000);
      } catch (e) {
        if (e instanceof ValidationError) {
          console.log(e);
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
            (depositAddress) => !depositAddress && 'Address is required',
          ],
        });
        changeStep(2);
      } catch (e) {
        if (e instanceof ValidationError) {
          console.log(e);
        }
      }
    }

    function changeStep(step) {
      currentStep.value = step;
    }

    function greet(item) {
      form.amount.$value = item;
      //TODO: temporary solution
      setTimeout(() => (inputAmountState.value = 'USD'), 1);
      setTimeout(() => (inputAmountState.value = 'XST'), 1);
    }

    return {
      greet,
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

      send,
      getUnspentOutputs,
      formatAmount,

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
.tooltip {
  margin-top: 40px;
  display: block;
  width: 100%;
  text-align: center;
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
  position: absolute;
  top: -22px;
  right: 0;
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.12px;
  color: var(--grey100);
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
  margin-bottom: 36px;
}
.send-modal .st-modal__body {
  margin: 10px 0 0;
}
.send-modal .st-form-item {
  margin: 10px 0 54px;
}
.send-modal .st-modal__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: auto;
}
</style>
