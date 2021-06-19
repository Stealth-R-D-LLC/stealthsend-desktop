<template>
  <StModal
    :has-click-outside="false"
    :visible="isVisible"
    class="quick-receive-modal"
    @close="closeModal"
    @open="onOpen"
  >
    <template #header>Quick Receive XST</template>
    <template #body>
      <StFormItem
        class="receiving-address"
        label="Receiving Address"
        color="dark"
        :notice="`Funds will be received on Account: ${
          account && account.label ? account.label : ''
        }`"
      >
        <StInput
          class="address-input"
          v-model="depositAddress"
          placeholder="Loading..."
          disabled
        >
          <svg
            v-if="!depositAddress"
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
      return mainStore.modals.quickReceive;
    });

    function closeModal() {
      mainStore.SET_MODAL_VISIBILITY('quickReceive', false);
      // reset all variables
      account.value = null;
      accounts.value = [];
      depositAddress.value = '';
      qrSrc.value = '';
    }

    const accounts = ref([]);
    const account = ref(null);

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
        url: depositAddress.value,
        noBorder: false,
        colorDark: '#140435',
        colorLight: '#FAF9FC',
      });
      qrSrc.value = qr.toImage('png').src;
    }

    return {
      isVisible,
      closeModal,
      accounts,
      account,
      depositAddress,
      changeAccount,
      qrSrc,
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
  max-width: 145px;
}

.address-loader {
  animation: rotating 2s linear infinite;
}
.receiving-address :deep label {
  right: 0;
  text-align: center;
}
:deep .st-form-item__message--is-notice {
  width: 100%;
  text-align: center;
  margin-top: 8px;
}

.st-clipboard {
  font-family: var(--secondary-font);
  font-weight: bold;
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.12px;
  color: var(--grey50);
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
</style>

<style>
.quick-receive-modal .st-modal-container {
  width: 480px;
  height: 520px;
}
</style>