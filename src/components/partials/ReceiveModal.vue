<template>
  <StModal
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
            v-model="account"
            :options="accounts"
            track-by="address"
            value-prop="address"
            label="label"
            :object="true"
            :can-deselect="false"
            placeholder="Select account"
            @select="changeAccount"
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
        <StFormItem color="dark" label="Amount">
          <StAmount
            v-if="inputAmountState === 'XST'"
            v-model="amount"
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
            <div @click="inputAmountState = 'USD'">
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
            v-model="amount"
            placeholder="Amount"
          >
            <div @click="inputAmountState = 'XST'">
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
          <StInput
            v-model="depositAddress"
            placeholder="Deposit address"
            disabled
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
      </template>
      <template v-if="currentStep === 2">
        <StFormItem label="Receiving Address" color="dark">
          <StInput
            class="address-input"
            v-model="depositAddress"
            placeholder="Deposit address"
            disabled
          ></StInput>
        </StFormItem>
        <StTooltip
          class="tooltip"
          :tooltip-text="copyPending ? 'Copied to clipboard!' : 'Click to copy'"
        >
          <StClipboard :content="depositAddress" @click="handleCopy"
            >Copy to Clipboard</StClipboard
          >
        </StTooltip>
        <img class="qr-img" :src="qrSrc" />
      </template>
      <template v-if="currentStep === 3">
        <StFormItem label="Email" color="dark">
          <StInput v-model="email" placeholder="Email"></StInput>
          <p class="email-desc">
            Using this option you will share receive details via default email
            client
          </p>
        </StFormItem>
      </template>
    </template>
    <template #footer class="flex-center-all">
      <template v-if="currentStep === 1">
        <StButton color="white" @click="changeStep(2)"
          >Generate QR Code</StButton
        >
      </template>
      <template v-if="currentStep === 2">
        <StButton color="white" @click="changeStep(3)"
          >Share via Email</StButton
        >
      </template>
      <template v-if="currentStep === 3">
        <StButton color="white" @click="closeModal">Send Email</StButton>
      </template>
    </template>
  </StModal>
</template>

<script>
import { useMainStore } from '@/store';
import { computed, ref } from 'vue';
import VanillaQR from 'vanillaqr';
import CryptoService from '@/services/crypto';

export default {
  name: 'StReceiveModal',
  setup() {
    const mainStore = useMainStore();

    const isVisible = computed(() => {
      return mainStore.modals.receive;
    });
    const inputAmountState = ref('XST');

    const currentStep = ref(1);

    function closeModal() {
      mainStore.SET_MODAL_VISIBILITY('receive', false);
      // reset all variables
      account.value = null;
      accounts.value = [];
      amount.value = null;
      currentStep.value = 1;
      depositAddress.value = '';
      qrSrc.value = '';
    }

    const accounts = ref([]);
    const account = ref(null);
    const amount = ref(null);

    async function scanWallet() {
      const hdWallet = await CryptoService.scanWallet();
      accounts.value = hdWallet.accounts;
      // select first account so that we can immediately start finding the first available address
      account.value = accounts.value[0];
    }

    async function onOpen() {
      // when the modal is opened, scan for the address and show it
      await scanWallet();
      changeAccount();
    }

    const depositAddress = ref('');
    const qrSrc = ref('');
    async function changeAccount(acc = accounts.value[0]) {
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
      var qr = new VanillaQR({
        url: depositAddress.value,
        noBorder: true,
        colorDark: '#140435',
        colorLight: '#FAF9FC',
        size: 260,
      });
      qrSrc.value = qr.toImage('png').src;
    }

    let copyPending = ref(false);
    function handleCopy() {
      copyPending.value = true;
      setTimeout(() => {
        copyPending.value = false;
      }, 2000);
    }

    function changeStep(step) {
      currentStep.value = step;
    }
    function goBack(step) {
      currentStep.value = step;
    }

    return {
      isVisible,
      closeModal,
      inputAmountState,

      accounts,
      account,
      amount,
      depositAddress,
      changeAccount,
      qrSrc,

      currentStep,
      changeStep,
      goBack,

      handleCopy,
      copyPending,

      onOpen,
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
:deep .address-input > .st-input__inner {
  text-align: center;
}
:deep .address-input > label {
  left: 0;
  right: 0;
  text-align: center;
}
.tooltip {
  margin-top: 40px;
  display: block;
  width: 100%;
  text-align: center;
}
.qr-img {
  margin: 46px auto 0;
  display: block;
  width: 100%;
  max-width: 120px;
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
  font-family: Noto Sans;
  font-size: 14px;
  line-height: 14px;
  letter-spacing: 0.12px;
}
.multiselect-single-label .account-label {
  font-family: Noto Sans;
  font-size: 14px;
  line-height: 14px;
  letter-spacing: 0.12px;
}
</style>

<style>
.receive-modal .st-modal__footer {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
