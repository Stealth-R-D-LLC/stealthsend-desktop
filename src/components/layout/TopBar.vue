<template>
  <div :class="computedClass">
    <header class="layout__header" :class="`layout__header-${currentRoute}`">
      <div class="header-left">
        <template v-if="checkVisibilityForRoute(['Dashboard'])">
          <div :class="{ nonclickable: !componentVisibility.txDashboard }">
            <SvgIcon
              name="icon-chart"
              :class="{ inactive: !componentVisibility.chart }"
              @click="toggleComponentVisibility('chart')"
            />
          </div>

          <div :class="{ nonclickable: !componentVisibility.chart }">
            <SvgIcon
              name="icon-dashboard-transactions"
              :class="{ inactive: !componentVisibility.txDashboard }"
              @click="toggleComponentVisibility('txDashboard')"
            />
          </div>
        </template>

        <template v-if="checkVisibilityForRoute(['AccountDetails'])">
          <div
            v-if="account"
            class="account-switcher"
            @click="openAccountModal"
          >
            <h6>{{ account && account.label }}</h6>

            <SvgIcon name="icon-arrow-down" />
          </div>
          <div class="icons-flex">
            <StTooltip
              class="tooltip"
              :tooltip="isHiddenAmounts ? 'Show Values' : 'Hide Values'"
            >
              <SvgIcon
                name="icon-eye-opened"
                v-if="isHiddenAmounts"
                @click="toggleHiddenAmounts"
              />

              <SvgIcon
                name="icon-eye-closed"
                v-else
                @click="toggleHiddenAmounts"
              />
            </StTooltip>

            <StTooltip class="tooltip" tooltip="Account Key">
              <SvgIcon name="icon-account-keys" @click="isVisible = true" />
            </StTooltip>
          </div>
        </template>

        <template
          v-if="
            checkVisibilityForRoute(['Transactions']) ||
            checkVisibilityForRoute(['TransactionsQuery'])
          "
        >
          <div class="icons-flex" role="presentation">
            <StTooltip
              class="tooltip"
              :tooltip="isHiddenAmounts ? 'Show Values' : 'Hide Values'"
            >
              <SvgIcon
                name="icon-eye-opened"
                v-if="isHiddenAmounts"
                @click="toggleHiddenAmounts"
              />

              <SvgIcon
                name="icon-eye-closed"
                v-else
                @click="toggleHiddenAmounts"
              />
            </StTooltip>
          </div>
        </template>

        <template v-if="checkVisibilityForRoute(['ArchivedAccounts'])">
          <StTooltip
            class="tooltip"
            :tooltip="isHiddenAmounts ? 'Show Values' : 'Hide Values'"
          >
            <SvgIcon
              name="icon-eye-opened"
              v-if="isHiddenAmounts"
              @click="toggleHiddenAmounts"
            />

            <SvgIcon
              name="icon-eye-closed"
              v-else
              @click="toggleHiddenAmounts"
            />
          </StTooltip>

          <StTooltip class="tooltip" tooltip="Favorite List">
            <SvgIcon
              name="icon-favorite-list"
              @click="toggleDrawer('favourite-list')"
              class="favourite-list"
            />
          </StTooltip>
        </template>
      </div>

      <div class="header-right" :class="{ 'header-right--loading': isLoading }">
        <p class="rpc-status">{{ rpcStatus }}</p>

        <StTooltip class="tooltip" tooltip="Connected to Mainnet">
          <SvgIcon name="icon-rpc-mainnet" class="rpc-icon" />
        </StTooltip>

        <StTooltip class="tooltip" tooltip="Quick Receive">
          <SvgIcon name="icon-qr-code" @click="openQuickDeposit" />
        </StTooltip>

        <StTooltip class="tooltip tooltip-custom" tooltip="Settings">
          <SvgIcon name="icon-settings" @click="goto('/settings')" />
        </StTooltip>
      </div>

      <StModal
        light
        :visible="isVisible"
        @close="closeModal"
        class="account-modal"
      >
        <template #header>Account Key</template>
        <template #body>
          <div v-if="!checkPassword" class="account-tabs">
            <a
              v-if="account && !account.isImported && activeStep.length > 0"
              :class="{ active: activeStep === 'public-key' }"
              @click="changeStep('public-key')"
              >Public Key</a
            >
            <a
              v-if="account && account.isImported && activeStep.length > 0"
              :class="{ active: activeStep === 'private-key' }"
              @click="changeStep('private-key')"
              >Private Key</a
            >
          </div>
          <div v-if="activeStep === 'public-key'">
            <template v-if="!publicQrCode">
              <div class="desc">
                <p>
                  The Public Key provides access to transactions records and
                  balances, but does not allow sending of funds.
                </p>
              </div>
              <p class="bold" v-if="!account?.isImported">xpub</p>
              <p class="bold" v-else>Public Key</p>
              <p class="key" :class="{ 'key-right': !publicKey }">
                <template v-if="publicKey">{{ publicKey }}</template>
                <SvgIcon
                  v-else
                  name="icon-loader-address"
                  class="address-loader"
                />
              </p>
              <div class="copy-key">
                <p>
                  Copy
                  <span v-if="!account?.isImported">xpub</span>
                  <span v-else>public key</span> to clipboard or show QR code
                </p>
                <div :class="{ 'copy-key--loading': !publicKey }">
                  <StTooltip
                    :tooltip="
                      copyPending ? 'Copied to Clipboard!' : 'Copy to Clipboard'
                    "
                  >
                    <StClipboard :content="publicKey" @click="handleCopy">
                      <SvgIcon name="icon-clipboard" />
                    </StClipboard>
                  </StTooltip>

                  <StTooltip tooltip="Show QR Code">
                    <SvgIcon
                      name="icon-generate-qr-code"
                      @click="generatePublicQr"
                    />
                  </StTooltip>
                </div>
              </div>
              <p
                v-if="!account?.isImported && !account.wif"
                @click="openBlockExplorer"
                class="view-more bold"
              >
                View on StealthMonitor
              </p>
            </template>
            <template v-else>
              <img class="qr-code" :src="publicQrCode" />
              <p @click="publicQrCode = ''" class="view-more bold">
                Hide QR code
              </p>
            </template>
          </div>
          <div v-if="activeStep === 'private-key'">
            <template v-if="checkPassword">
              <p class="password-desc">
                Enter your password to authorize this action
              </p>
              <form class="form" @submit.prevent>
                <StFormItem
                  class="custom-form-item"
                  :filled="password"
                  label="Password"
                  :error-message="form.password.$errors"
                >
                  <StInput
                    v-model="password"
                    placeholder="Please enter your password"
                    :type="showPassword ? 'text' : 'password'"
                  >
                    <StTooltip
                      class="tooltip"
                      :tooltip="
                        !showPassword ? 'Show Password' : 'Hide Password'
                      "
                    >
                      <SvgIcon
                        name="icon-eye-opened"
                        v-if="!showPassword"
                        @click="showPassword = true"
                      />

                      <SvgIcon
                        name="icon-eye-closed"
                        v-else
                        @click="showPassword = false"
                      />
                    </StTooltip>
                  </StInput>
                </StFormItem>
                <StButton
                  v-show="Boolean(false)"
                  color="white"
                  @click="validatePassword"
                  >Continue</StButton
                >
              </form>
            </template>
            <template v-else>
              <template v-if="!privateQrCode">
                <div class="desc">
                  <p>
                    The Private Key provides control over current and future
                    balances of XST on this device.
                  </p>
                </div>
                <p class="bold">Private Key</p>
                <p class="key">{{ privateKey }}</p>
                <div class="copy-key copy-key__private">
                  <p>Copy privkey to clipboard or show QR code</p>
                  <div>
                    <StTooltip
                      :tooltip="
                        copyPending
                          ? 'Copied to Clipboard!'
                          : 'Copy to Clipboard'
                      "
                    >
                      <StClipboard :content="privateKey" @click="handleCopy">
                        <SvgIcon name="icon-clipboard" />
                      </StClipboard>
                    </StTooltip>
                    <StTooltip tooltip="Show QR code">
                      <SvgIcon
                        name="icon-generate-qr-code"
                        @click="generatePrivateQr"
                      />
                    </StTooltip>
                  </div>
                </div>
              </template>
              <template v-else>
                <img class="qr-code" :src="privateQrCode" />
                <p @click="privateQrCode = ''" class="view-more bold">
                  Hide QR code
                </p>
              </template>
            </template>
          </div>
        </template>
      </StModal>

      <StModal
        light
        :visible="accountVisible"
        @close="accountVisible = false"
        class="account-modal"
      >
        <template #header>Select Account</template>
        <template #body>
          <div class="account-overflow">
            <div
              class="account-card"
              v-for="acc in accounts"
              :key="acc.label"
              @click="selectAccount(acc.label)"
            >
              <div class="account-card__header">
                <h6>{{ acc.label }}</h6>
                <div
                  class="radio"
                  :class="{ 'radio-active': showArrow === acc.label }"
                />
              </div>
              <div class="account-card__content">
                <div class="account-card__content--amount">
                  <h6>{{ amountFormat(acc).amountLeft }} XST</h6>
                  <p>~ ${{ amountFormat(acc).amountRight }} USD</p>
                </div>
                <div
                  v-if="showArrow === acc.label"
                  class="account-card__content--icon"
                  @click="accountChanged(acc)"
                >
                  <StTooltip class="tooltip" tooltip="Apply">
                    <SvgIcon name="icon-arrow-right" class="icon-arrow-right" />
                  </StTooltip>
                </div>
              </div>
            </div>
          </div>
        </template>
      </StModal>
    </header>
  </div>
</template>

<script setup>
import { useMainStore } from '@/store';
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import router from '@/router';
import CryptoService from '@/services/crypto';
import useHelpers from '@/composables/useHelpers';
import MathService from '@/services/math';
import VanillaQR from 'vanillaqr';
import { useValidation } from 'vue3-form-validation';
import db from '../../db';
import SvgIcon from '../partials/SvgIcon.vue';
import emitter from '@/services/emitter';

const mainStore = useMainStore();
const { formatAmount } = useHelpers();
const route = useRoute();
const isVisible = ref(false);
const accountVisible = ref(false);
const rpcStatus = ref('');
const activeStep = ref('');
const publicKey = ref('');
const privateKey = ref('');
const publicQrCode = ref('');
const privateQrCode = ref('');
const checkPassword = ref(false);
const showPassword = ref(false);
const password = ref('');
const showArrow = ref('');

const {
  form,
  // errors,
  // add,
  // submitting,
  validateFields,
  resetFields,
} = useValidation({
  password: {
    $value: password,
    $rules: [
      async (password) => {
        if (!password) {
          return 'Password is required.';
        }
        let isValid = await CryptoService.validatePassword(password);
        if (!isValid) {
          return 'Incorrect password.';
        }
      },
    ],
  },
});

const currentRoute = computed(() => {
  return route.name;
});

const account = computed(() => {
  return mainStore.accountDetails;
});

const accounts = computed(() => {
  return mainStore.wallet.accounts;
});

const computedClass = computed(() => {
  let headerColor = '';
  if (route.path.split('/').includes('account')) {
    headerColor = 'grey';
  } else {
    headerColor = 'default';
  }
  return {
    'layout__header--is-grey': headerStyle.value != headerColor,
    'layout__header--settings': route.path.split('/').includes('settings'),
  };
});

const headerStyle = computed(() => mainStore.headerStyle);

const componentVisibility = computed(() => {
  return mainStore.componentVisibility;
});

const isHiddenAmounts = computed(() => {
  return mainStore.isAmountsHidden;
});

const isLoading = computed(() => {
  return mainStore.globalLoading;
});

onMounted(async () => {
  if (!componentVisibility.value.chart) {
    toggleComponentVisibility('chart');
  }
  if (!componentVisibility.value.txDashboard) {
    toggleComponentVisibility('txDashboard');
  }
  if (window.history.state.current && window.history.state.back === '/lock') {
    try {
      await mainStore.rpc('getinfo', []);
      rpcStatus.value = `Connected to ${
        process.env.VUE_APP_NETWORK[0].toUpperCase() +
        process.env.VUE_APP_NETWORK.substring(1)
      }`;
      setTimeout(() => (rpcStatus.value = ''), 5000);
    } catch (error) {
      rpcStatus.value = `Not connected to ${
        process.env.VUE_APP_NETWORK[0].toUpperCase() +
        process.env.VUE_APP_NETWORK.substring(1)
      }`;
      setTimeout(() => (rpcStatus.value = ''), 5000);
    }
  }
});

watch(
  () => isVisible.value,
  async () => {
    if (isVisible.value) {
      if (account.value.isImported) {
        // activeStep.value = 'private-key'
        // manually trigger retrieving keys
        changeStep('private-key', true);
      } else {
        // activeStep.value = 'public-key'
        changeStep('public-key', true);
        getPublicKey();
      }
      await CryptoService.scanWallet();
    }
  }
);

const pendingTransactions = computed(() => {
  return mainStore.pendingTransactions;
});

let pendingTransactionsInterval = null;

watch(pendingTransactions.value, async () => {
  console.log('PENDING TX WATCHER');
  let pendings = [];
  for (let ptx of mainStore?.pendingTransactions) {
    if (!ptx.isFailed) {
      pendings.push(JSON.parse(JSON.stringify(ptx))); // avoid proxy
    }
  }
  // in case pending transactions array is not empty
  // create an interval checker for that txid
  // it will check if the transaction has confirmations > 0 in order to move it from the peinding state
  pendingTransactionsInterval = setInterval(async () => {
    console.log('pendingTransactionsInterval: CREATE');
    if (mainStore?.pendingTransactions.length === 0) {
      // if the watcher is triggered when removing an item, we can kill the interval
      console.log('pendingTransactionsInterval: CLEAR');
      clearInterval(pendingTransactionsInterval);
      pendingTransactionsInterval = null;
    } else {
      const res = await mainStore.rpc('gettransaction', [pendings[0].txid]); // purposefully use only first tx to avoid unnecessary loops
      if (res?.confirmations > 0) {
        // tx is minned, we need to scan the whole wallet to avoid complications with transactions that go to the same account or the same wallet
        // and to avoid complications with manual calculating the new wallet and account balance
        await CryptoService.scanWallet();
        emitter.emit('transactions:refresh');
      }
    }
  }, 10000);
});

async function validatePassword() {
  if (await validateFields()) {
    // privateQrCode.value = '123'
    getPrivateKey();
    activeStep.value = 'private-key';
    checkPassword.value = false;
    password.value = '';
  }
}

function getPublicKey() {
  if (!mainStore.accountDetails) return;
  if (mainStore.accountDetails?.isImported && mainStore.accountDetails.wif) {
    publicKey.value = mainStore.accountDetails.publicKey;
  } else {
    const path = CryptoService.breakAccountPath(mainStore.accountDetails.path);
    const { xpub } = CryptoService.getKeysForAccount(
      path.account,
      path.change,
      path.address
    );
    publicKey.value = xpub;
  }
}

async function getPrivateKey() {
  if (mainStore.accountDetails?.isImported) {
    const wallet = await db.getItem('wallet');
    try {
      const secretKey = await CryptoService.AESDecrypt(
        mainStore.accountDetails.wif,
        wallet.password
      );
      privateKey.value = secretKey;
    } catch (e) {
      console.error(e);
      privateKey.value = '';
    }
  } else {
    const path = CryptoService.breakAccountPath(mainStore.accountDetails.path);
    const { secretKey } = CryptoService.getKeysForAccount(
      path.account,
      path.change,
      path.address
    );
    privateKey.value = secretKey;
  }
}

async function changeStep(step, isManual) {
  activeStep.value = step;
  publicQrCode.value = '';
  privateQrCode.value = '';
  if (step === 'private-key') {
    checkPassword.value = true;
  }
  privateKey.value = '';
  resetFields();
  if (!isManual) {
    await CryptoService.scanWallet();
  }
  getPublicKey();
}

function closeModal() {
  isVisible.value = false;
  activeStep.value = 'public-key';
  publicQrCode.value = '';
  checkPassword.value = false;
  privateQrCode.value = '';
  publicKey.value = '';
  privateKey.value = '';
}

function toggleDrawer(canvas) {
  mainStore.SET_CURRENT_CANVAS(canvas);
  mainStore.TOGGLE_DRAWER(true);
}

function toggleHiddenAmounts() {
  mainStore.SET_AMOUNTS_HIDDEN(!isHiddenAmounts.value);
}

function checkVisibilityForRoute(routes = []) {
  if (!currentRoute.value) return false;
  return routes.includes(currentRoute.value);
}

function toggleComponentVisibility(component) {
  mainStore.SET_COMPONENT_VISIBILITY(
    component,
    !componentVisibility.value[component]
  );
  if (component === 'txDashboard') {
    mainStore.REFRESH_CHART(true);
    setTimeout(() => mainStore.REFRESH_CHART(false), 1);
  }
}

function openQuickDeposit() {
  mainStore.SET_MODAL_VISIBILITY('quickReceive', true);
}

function goto(path) {
  router.push(path);
}

let copyPending = ref(false);
function handleCopy() {
  copyPending.value = true;
  setTimeout(() => {
    copyPending.value = false;
  }, 2000);
}

function generatePublicQr() {
  let qr = new VanillaQR({
    url: publicKey.value,
    noBorder: false,
    colorDark: '#140435',
    colorLight: '#FAF9FC',
  });
  publicQrCode.value = qr.toImage('png').src;
}

function generatePrivateQr() {
  let qr = new VanillaQR({
    url: privateKey.value,
    noBorder: false,
    colorDark: '#140435',
    colorLight: '#FAF9FC',
  });
  privateQrCode.value = qr.toImage('png').src;
}

function openBlockExplorer() {
  const chain =
    process.env.VUE_APP_NETWORK === 'mainnet' ? '?chain=main' : '?chain=test';
  window
    .open(
      'https://stealthmonitor.org/xPub/' + publicKey.value + chain,
      '_blank'
    )
    .focus();
}

function amountFormat(account) {
  return {
    asset: 'XST',
    amountLeft: `${formatAmount(account.utxo, false, 6, 6)}`,
    amountRight: `${formatAmount(
      MathService.multiply(account.utxo, CryptoService.constraints.XST_USD),
      false,
      4,
      4
    )}`,
    percentage: formatAmount(
      CryptoService.constraints.changePercent24Hr,
      false,
      2
    ),
  };
}

async function accountChanged(account) {
  mainStore.START_GLOBAL_LOADING();
  mainStore.SET_ACCOUNT_DETAILS(account);
  accountVisible.value = false;
  await CryptoService.scanWallet();
  mainStore.STOP_GLOBAL_LOADING();
}

function openAccountModal() {
  showArrow.value = mainStore.accountDetails.label;
  accountVisible.value = true;
}

function selectAccount(account) {
  showArrow.value = account;
}
</script>

<style scoped>
.layout__header {
  border-bottom: 1px solid var(--grey100);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.layout__header-Dashboard {
  padding: 44px 0 26px !important;
}
.layout__header-Transactions {
  padding: 48px 0 26px !important;
}
.layout__header-ArchivedAccounts {
  padding: 45px 0 26px !important;
}
.layout__header--settings {
  width: calc(100% - 392px);
  margin-left: auto;
}
.layout__header--settings .layout__header {
  padding: 45px 0 24px !important;
}
.layout__header--is-grey {
  background: var(--background100);
}
.layout__header--is-grey .layout__header {
  margin: 0 24px;
  padding: 41px 0 26px;
}
.header-left,
.header-right {
  width: 100%;
  display: flex;
  align-items: center;
}
:deep .multiselect {
  max-width: 170px;
}
.header-right {
  justify-content: flex-end;
  min-height: 24px;
}

.header-right--loading .tooltip :deep svg {
  pointer-events: none;
}

.header-right--loading .tooltip {
  cursor: not-allowed;
}

.header-left div + div,
.header-right .tooltip + .tooltip {
  margin-left: 24px;
}
.header-right .tooltip-custom:before {
  right: calc(50% + 10px);
}

/* .favourite-list {
  margin-left: 24px;
} */

.header-left .tooltip + .tooltip {
  margin-left: 24px;
}

.layout__header svg:hover {
  cursor: pointer;
}
:deep path {
  transition: 0.3s;
}
.nonclickable {
  position: relative;
}
.nonclickable::before {
  content: '';
  cursor: not-allowed;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
}
:deep .inactive path {
  stroke: var(--marine100);
}
:deep .multiselect__tags::after {
  display: none;
}
:deep .multiselect-filled .multiselect__tags::after {
  display: none;
}
:deep .multiselect__tags {
  border-bottom: none;
}
.icons-flex {
  display: flex;
  align-items: center;
}
.icons-flex svg + svg,
.icons-flex .tooltip + .tooltip {
  margin-left: 24px;
}
:deep .st-modal-container {
  width: 480px;
  height: 520px;
  box-sizing: border-box;
}
:deep .st-modal__body {
  margin: 12px 0 0 0 !important;
}
.account-modal__hide-header :deep .st-modal__header {
  display: none;
}
.account-modal__hide-header :deep .st-modal__body {
  margin-top: 0;
  text-align: center;
}
.account-modal__hide-header h5 {
  margin-bottom: 36px;
}
.account-tabs {
  margin-top: 36px;
  margin-bottom: 36px;
  display: flex;
  align-items: center;
}
.account-tabs a {
  position: relative;
  cursor: pointer;
  min-width: 160px;
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.32px;
  color: var(--grey900);
  padding-bottom: 12px;
  border-bottom: 3px solid var(--grey200);
  font-family: var(--secondary-font);
  transition: 0.3s;
}
.account-tabs a + a {
  margin-left: 24px;
}
.account-tabs a:hover {
  text-shadow: 0.5px 0 var(--grey900);
}
.account-tabs a:hover:after {
  width: 100%;
}
.account-tabs a:after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -3px;
  height: 3px;
  width: 0;
  background-color: var(--marine500);
  transition: 0.3s;
}
.account-tabs a.active {
  text-shadow: 0.5px 0 var(--grey900);
}
.account-tabs a.active:after {
  background-color: var(--marine500);
  width: 100%;
}
.desc {
  margin-bottom: 24px;
  padding: 16px;
  background-color: var(--background100);
  border-radius: 4px;
}
.key {
  word-break: break-all;
  margin-top: 8px;
  color: var(--marine500);
  padding-bottom: 16px;
  border-bottom: 1px solid var(--grey100);
}
.key-right {
  text-align: right;
}
.address-loader {
  animation: rotating 2s linear infinite;
}
.address-loader :deep circle {
  stroke: var(--marine500);
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
.copy-key {
  margin-top: 17px;
  margin-bottom: 49px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.copy-key--loading {
  pointer-events: none;
  opacity: 0.6;
}
.copy-key__private {
  margin-bottom: 81px;
}
.copy-key div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 64px;
}
.view-more {
  text-align: center;
  cursor: pointer;
  color: var(--marine500);
}
.qr-code {
  display: block;
  width: 100%;
  max-width: 220px;
  margin: 63px auto 46px;
  padding-left: 22px;
}
.custom-form-item {
  margin: 120px 0 0;
}
:deep .st-input input {
  background-position: 92% 49% !important;
}
.rpc-status {
  margin-right: 12px;
}
.rpc-icon {
  pointer-events: none;
}
.account-switcher {
  width: 170px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.account-switcher h6 {
  margin-right: 24px;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
}
.account-switcher svg {
  min-width: 8px;
}
.account-overflow {
  margin-top: 36px;
  overflow: auto;
  height: 392px;
  padding-right: 16px;
}
.account-overflow::-webkit-scrollbar {
  width: 4px;
}
.account-overflow:hover::-webkit-scrollbar-thumb {
  background: var(--grey100);
}
.account-overflow::-webkit-scrollbar-thumb {
  background: transparent;
}
.account-card {
  cursor: pointer;
  margin-bottom: 10px;
  box-sizing: border-box;
  padding: 15px 20px 19px;
  background-color: var(--background0);
  border: 1px solid var(--purple50);
  box-shadow: 0px 8px 24px -8px rgba(34, 3, 101, 0.1);
  border-radius: 2px;
}
.account-card .account-card__header {
  margin-bottom: 20px;
  display: grid;
  grid-gap: 0 24px;
  grid-template-columns: 11fr 20px;
  align-items: center;
}
.account-card .account-card__header h6 {
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
}
.account-card .account-card__content {
  display: grid;
  grid-gap: 0 24px;
  grid-template-columns: 11fr 18px;
}
.account-card .account-card__content .account-card__content--amount h6 {
  margin-bottom: 4px;
  font-family: var(--secondary-font);
}
.account-card .account-card__content .account-card__content--icon {
  display: flex;
  align-items: flex-end;
}
.account-card :deep .icon-arrow-right path {
  stroke: #4e00f6;
}
.radio {
  width: 20px;
  height: 20px;
  position: relative;
  background: linear-gradient(
      153.02deg,
      rgba(250, 249, 252, 0.25) 0%,
      rgba(229, 228, 232, 0.25) 83.23%
    ),
    var(--grey50);
  border: 1px solid rgba(229, 228, 232, 0.15);
  border-radius: 4px;
}
.radio-active::after {
  background-color: var(--grey50) !important;
}
.radio-active::before {
  opacity: 1 !important;
}
.radio::after {
  content: '';
  display: block;
  background-color: var(--grey200);
  width: 6px;
  height: 6px;
  position: absolute;
  top: 7px;
  left: 7px;
  border-radius: 2px;
  z-index: 2;
  transition: 0.3s;
}
.radio::before {
  content: '';
  display: block;
  width: 16px;
  height: 16px;
  background: linear-gradient(
      153.02deg,
      rgba(78, 0, 246, 0.15) 0%,
      rgba(63, 1, 198, 0.15) 83.23%
    ),
    #4e00f6;
  border: 1px solid rgba(63, 1, 198, 0.5);
  border-radius: 2px;
  position: absolute;
  top: 1px;
  left: 1px;
  z-index: 1;
  opacity: 0;
  transition: 0.3s;
}
</style>
