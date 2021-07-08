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
        <StFormItem color="dark" label="Amount">
          <StAmount
            v-if="inputAmountState === 'XST'"
            v-model="amount"
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
            <div @click="changeCurrency('USD')">
              <svg
                width="19"
                height="16"
                viewBox="0 0 19 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
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
            </div>
          </StAmount>
          <StAmount
            v-else-if="inputAmountState === 'USD'"
            v-model="amountFiat"
            @update:formattedValue="fiatKeyup"
            placeholder="Amount"
          >
            <div @click="changeCurrency('XST')">
              <svg
                width="19"
                height="16"
                viewBox="0 0 19 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
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
            </div>
          </StAmount>
        </StFormItem>
        <StFormItem color="dark" label="Address">
          <StInput v-model="depositAddress" placeholder="Loading..." disabled>
            <StTooltip
              v-if="depositAddress"
              :tooltip="copyPending ? 'Copied to clipboard!' : 'Click to copy'"
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
            <svg
              v-else
              class="address-loader"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="9"
                cy="9"
                r="7"
                stroke="#E5E4E8"
                stroke-width="2"
                stroke-linejoin="round"
                stroke-dasharray="2 4"
              />
            </svg>
          </StInput>
        </StFormItem>
      </template>
      <template v-if="currentStep === 2">
        <StFormItem
          class="receiving-address"
          label="Receiving Address"
          color="dark"
        >
          <StInput
            class="address-input"
            v-model="depositAddress"
            placeholder="Deposit address"
            disabled
          ></StInput>
        </StFormItem>
        <StTooltip
          class="tooltip"
          :tooltip="copyPending ? 'Copied to clipboard!' : 'Click to copy'"
          position="bottom-right"
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
          :error-message="form.email.$errors"
        >
          <StInput v-model="form.email.$value" placeholder="Email"></StInput>
          <p class="email-desc">
            Using this option you will share receive details via default email
            client
          </p>
        </StFormItem>
      </template>
    </template>
    <template #footer class="flex-center-all">
      <template v-if="currentStep === 1">
        <StButton
          :disabled="!depositAddress"
          color="white"
          @click="changeStep(2)"
          >Generate QR Code</StButton
        >
      </template>
      <template v-if="currentStep === 2">
        <StButton color="white" @click="changeStep(3)"
          >Share via Email</StButton
        >
      </template>
      <template v-if="currentStep === 3">
        <StButton color="white" @click="sendEmail">Send Email</StButton>
      </template>
    </template>
  </StModal>
</template>

<script>
import { useMainStore } from '@/store';
import { computed, ref } from 'vue';
import VanillaQR from 'vanillaqr';
import CryptoService from '@/services/crypto';
import { useRoute } from 'vue-router';
import { useValidation, ValidationError } from 'vue3-form-validation';

export default {
  name: 'StReceiveModal',
  setup() {
    const mainStore = useMainStore();

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
      account.value = null;
      accounts.value = [];
      amount.value = 0;
      amountFiat.value = 0;
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
    const amount = ref(0);
    const amountFiat = ref(0);

    const {
      form,
      errors,
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
      const hdWallet = await CryptoService.scanWallet();
      accounts.value = hdWallet.accounts.filter((el) => !el.isArchived);
      if (pickedAccount.value) {
        // already picked from account details
        account.value = { ...pickedAccount.value };
      } else {
        // select first account so that we can immediately start finding the first available address
        account.value = hdWallet.accounts[0];
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
      const { account, change } = CryptoService.breakAccountPath(acc.path);
      const discoveredAddresses = await CryptoService.accountDiscovery(account);
      let nextFreeAddress = CryptoService.nextToUse(
        discoveredAddresses.freeAddresses
      );
      const next = CryptoService.breakAccountPath(nextFreeAddress);

      const child = CryptoService.getChildFromRoot(
        account,
        change,
        next.address
      );
      depositAddress.value = child.address;
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
      if (currency === 'XST') {
        amount.value = amountFiat.value / XST_USD.value;
        inputAmountState.value = 'XST';
      } else if (currency === 'USD') {
        amountFiat.value = amount.value * XST_USD.value;
        inputAmountState.value = 'USD';
      } else {
        console.error('Unhandled currency');
      }
    }

    async function sendEmail() {
      try {
        await validateFields();
        window.location.href = `mailto:${email.value}?body=${depositAddress.value}&subject=My XST address`;
        closeModal();
      } catch (e) {
        if (e instanceof ValidationError) {
          console.log('Email validation error: ', e);
        }
      }
    }

    function preventRemove(acc) {
      setTimeout(() => {
        account.value = acc;
      }, 10);
    }

    return {
      preventRemove,
      isVisible,
      closeModal,
      inputAmountState,

      accounts,
      account,
      amount,
      amountFiat,
      depositAddress,
      changeAccount,
      qrSrc,
      email,

      currentStep,
      changeStep,
      goBack,

      handleCopy,
      copyPending,

      onOpen,
      sendEmail,

      changeCurrency,
      fiatKeyup,

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
:deep .address-input > .st-input__inner {
  text-align: center;
}
:deep .address-input > label {
  left: 0;
  right: 0;
  text-align: center;
}
.tooltip {
  margin-top: 10px;
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
  margin: 46px auto 0;
  display: block;
  max-width: 145px;
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
  margin: 10px 0 0;
}
.receive-modal .st-form-item {
  margin: 10px 0 54px;
}
.receive-modal .st-form-item.receiving-address {
  margin: 0;
}
.receive-modal .st-input {
  margin-bottom: 20;
}
.receive-modal .st-modal__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: auto;
}
</style>
