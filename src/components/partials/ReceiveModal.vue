<template>
  <StModal
    show-back-button
    :steps="3"
    :current-step="currentStep"
    :visible="isVisible"
    class="receive-modal"
    @close="closeModal"
  >
    <template #header>Receive XST</template>
    <template #body>
      <template v-if="currentStep === 1">
        <div class="form-item account">
          <label for="multiselect">Account</label>
          <StMultiselect
          :class="{ 'multiselect-filled': account }"
            v-model="account"
            :options="accounts"
            track-by="_id"
            value-prop="address"
            label="label"
            :object="true"
            :can-deselect="false"
            placeholder="Select account"
            @change="changeAccount"
          >
            <template #singlelabel="{ value }">
              <div class="multiselect-single-label">
                <p class="account-label">
                  {{ value.label }}
                </p>
                <p class="account-utxo">
                  {{ value.utxo }}
                </p>
              </div>
            </template>

            <template #option="{ option }">
              {{ option.label }} ({{ option.utxo }})
            </template>
          </StMultiselect>
        </div>
        <div class="form-item">
          <StAmount
          v-if="inputAmountState === 'XST'"
            v-model="amount"
            label="Amount"
            color="dark"
            placeholder="Amount"
            :options="{
              locale: 'en',
          currency: 'XST',
          distractionFree: false,
          valueAsInteger: false,
          useGrouping: true,
          precision: 2,
          allowNegative: false
            }"
          >
            <svg
            @click="inputAmountState = 'USD'"
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
          </StAmount>
          <StAmount
          v-else-if="inputAmountState === 'USD'"
            v-model="amount"
            label="Amount"
            color="dark"
            placeholder="Amount"
          >
            <svg
            @click="inputAmountState = 'XST'"
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
          </StAmount>
        </div>
        <div class="form-item">
          <StInput
            v-model="depositAddress"
            placeholder="Deposit address"
            label="Address"
            color="dark"
            disabled
          >
            <StTooltip
            v-if="depositAddress"
              :tooltip-text="
                copyPending ? 'Copied to clipboard!' : 'Click to copy'
              "
            >
              <StClipboard
                :content="depositAddress"
                @click="handleCopy"
              >
              <svg width="15" height="19" viewBox="0 0 15 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10 5.5H1V17.5H10V5.5Z" stroke="#E5E4E8" stroke-width="2"/>
<path d="M14 14.5L14 0.500013" stroke="#E5E4E8" stroke-width="2"/>
<path d="M2 1.5L14 1.5" stroke="#E5E4E8" stroke-width="2"/>
</svg>
              </StClipboard>
            </StTooltip>
          </StInput>
        </div>
      </template>
      <template v-if="currentStep === 2">
        <StInput
          class="address-input"
          v-model="depositAddress"
          placeholder="Deposit address"
          label="Receiving Address"
          color="dark"
          disabled
        ></StInput>
        <StTooltip
        class="tooltip"
          :tooltip-text="copyPending ? 'Copied to clipboard!' : 'Click to copy'"
        >
          <StClipboard
            :content="depositAddress"
            @click="handleCopy"
          >Copy to Clipboard</StClipboard>
        </StTooltip>
        <img class="qr-img" :src="qrSrc" />
      </template>
      <template v-if="currentStep === 3">
        <StInput
          v-model="email"
          label="Email"
          color="dark"
          placeholder="Email"
        ></StInput>
        <p class="email-desc">
          Using this option you will share receive details via default email
          client
        </p>
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
import { computed, ref, watch } from 'vue';
import VanillaQR from 'vanillaqr';
import CryptoService from '@/services/crypto';

export default {
  name: 'StReceiveModal',
  setup() {
    const mainStore = useMainStore();

    const isVisible = computed(() => {
      return mainStore.modals.receive;
    });
    const inputAmountState = ref('XST')

    watch(
      () => isVisible.value,
      () => {
        scanWallet();
      }
    );

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
      console.log('majku bozju');
      const hdWallet = await CryptoService.scanWallet();
      accounts.value = hdWallet.accounts;

      // select first option
      // account.value = hdWallet.accounts[0]
      // // manually start finding address for preselected account
      // changeAccount(account.value)
      // console.log('scan?');
    }

    scanWallet();

    const depositAddress = ref('');
    const qrSrc = ref('');
    async function changeAccount(acc) {
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
      console.log('change step: ', step);
      currentStep.value = step;
    }

    //     onMounted(() => {
    //       console.log('mounted=======');
    //   scanWallet();
    // })

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

      handleCopy,
      copyPending,
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
::v-deep .address-input > .st-input__inner {
  text-align: center;
}
::v-deep .address-input > label {
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
::v-deep .st-amount > .st-icon {
  cursor: pointer;
}
.multiselect-single-label {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  position: absolute;
  top: -13px;
}
.multiselect-single-label .account-utxo {
  margin-top: 6px;
  font-family: Noto Sans;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 14px;
  /* identical to box height, or 200% */

  letter-spacing: 0.12px;
}
.multiselect-single-label .account-label {
  font-family: Noto Sans;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 14px;
  height: 48px;
  top: -14px;
  /* identical to box height, or 200% */

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
