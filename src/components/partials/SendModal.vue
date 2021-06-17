<template>
  <StModal
    show-back-button
    :steps="4"
    :current-step="currentStep"
    :visible="isVisible"
    class="send-modal"
    @close="closeModal"
    @back="goBack"
  >
    <template #header>Send XST</template>
    <template #body>
      <template v-if="currentStep === 1">
        <div class="form-item account">
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
                {{ option.label }} ({{ option.utxo }})
              </template>
            </StMultiselect>
          </StFormItem>
        </div>
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
                :tooltip-text="
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
            <p>{{ amount }}</p>
            <p class="bold">Address</p>
            <p>{{ depositAddress }}</p>
            <p class="bold">Label:</p>
            <p>{{ label ? label : 'No label' }}</p>
            <p class="bold">Fee:</p>
            <p>0.0 XST</p>
          </div>
        </div>
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

import { useValidation, ValidationError } from 'vue3-form-validation';

export default {
  name: 'StSendModal',
  setup() {
    const mainStore = useMainStore();

    const isVisible = computed(() => {
      return mainStore.modals.send;
    });
    const inputAmountState = ref('XST');
    const account = ref(null);
    const amount = ref(null);
    const depositAddress = ref('');

    const {
      form,
      errors,
      add,
      // remove,
      // submitting,
      validateFields,
      resetFields,
    } = useValidation({
      // depositAddress: {
      //   $value: depositAddress,
      //   $rules: [(depositAddress) => !depositAddress && 'Address is required'],
      // },
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
      // remove(['depositAddress']);
      resetFields();
    }

    const accounts = ref([]);
    const label = ref('');

    async function scanWallet() {
      const hdWallet = await CryptoService.scanWallet();
      accounts.value = hdWallet.accounts;
      // select first option
      account.value = hdWallet.accounts[0];
      getUnspentOutputs(account.value);
      // // manually start finding address for preselected account
      // changeAccount(account.value)
    }

    scanWallet();
    let unspentOutputs = [];

    async function getUnspentOutputs(account) {
      const outputs = await mainStore.rpc('getaddressoutputs', [
        account.address,
        1,
        100,
      ]);

      unspentOutputs = outputs.filter((el) => el.isspent === 'false');
    }

    function coinSelection() {
      const { best } = useCoinControl(unspentOutputs, amount.value);
      return best;
    }

    async function send() {
      try {
        await validateFields();
        const utxo = coinSelection();

        if (utxo.length === 0) {
          return;
        }

        let { txid } = await useTransactionBuilder(utxo, {
          address: depositAddress.value,
          amount: amount.value,
          account: account.value,
        });
        CryptoService.storeTxAndLabel(txid, label.value);
        // console.log('TXID: ', txid);
        closeModal();
      } catch (e) {
        if (e instanceof ValidationError) {
          console.log(e);
        }
      }
    }
    // async function changeAccount(acc) {
    //   const { account, change } = CryptoService.breakAccountPath(acc.path);
    //   const discoveredAddresses = await CryptoService.accountDiscovery(account);
    //   let nextFreeAddress = CryptoService.nextToUse(
    //     discoveredAddresses.freeAddresses
    //   );
    //   const next = CryptoService.breakAccountPath(nextFreeAddress);

    //   const child = CryptoService.getChildFromRoot(
    //     account,
    //     change,
    //     next.address
    //   );
    //   depositAddress.value = child.address;
    // }

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
    function goBack(step) {
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
      // changeAccount,

      currentStep,
      changeStep,
      goBack,

      handleCopy,
      copyPending,

      send,
      getUnspentOutputs,

      form,
      errors,
    };
  },
};
</script>

<style scoped>
.form-item {
  margin: 44px 0;
}

.form-item.account {
  position: relative;
  margin-top: 92px;
}

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
  font-size: 14px;
  line-height: 24px;
  color: var(--white);
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
</style>

<style>
.send-modal .st-modal__footer {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
