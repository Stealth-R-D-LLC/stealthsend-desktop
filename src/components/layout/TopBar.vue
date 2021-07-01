<template>
  <header
    class="layout__header"
    :class="{ 'layout__header--is-grey': headerStyle === 'grey' }"
  >
    <div class="header-left">
      <template v-if="checkVisibilityForRoute(['Dashboard'])">
        <div :class="{ nonclickable: !componentVisibility.txDashboard }">
          <StIcon
            :class="{ inactive: !componentVisibility.chart }"
            name="chart"
            @click="toggleComponentVisibility('chart')"
          ></StIcon>
        </div>
        <div :class="{ nonclickable: !componentVisibility.chart }">
          <StIcon
            :class="{ inactive: !componentVisibility.txDashboard }"
            name="tx-list"
            @click="toggleComponentVisibility('txDashboard')"
          ></StIcon>
        </div>
      </template>
      <template v-if="checkVisibilityForRoute(['AccountDetails'])">
        <StMultiselect
          v-model="account"
          :class="{ 'multiselect-filled': account }"
          :options="accounts"
          track-by="address"
          value-prop="address"
          label="label"
          :object="true"
          :can-deselect="false"
          placeholder="Select account"
          @select="accountChanged"
        >
          <template #singleLabel>
            <h6>
              {{ account && account.label }}
            </h6>
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
        <div class="icons-flex">
          <svg
            v-if="!isHiddenAmounts"
            @click="toggleHiddenAmounts"
            width="26"
            height="14"
            viewBox="0 0 26 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M13 13C17.0501 13 20.7168 11 24 7C20.7168 3 17.0501 1 13 1C8.94991 1 5.28325 3 2 7C5.28325 11 8.94991 13 13 13Z"
              stroke="#4E00F6"
              stroke-width="2"
            />
            <circle cx="13" cy="7" r="2" fill="#4E00F6" />
          </svg>
          <svg
            v-else
            @click="toggleHiddenAmounts"
            width="26"
            height="19"
            viewBox="0 0 26 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 3C8.94991 3 5.28325 5.03704 2 9.11111C5.28325 13.1852 8.94991 15.2222 13 15.2222C17.0501 15.2222 20.7168 13.1852 24 9.11111C23.2599 8.1928 22.5004 7.37799 21.7214 6.66667"
              stroke="#4E00F6"
              stroke-width="2"
            />
            <path d="M9 9L15.1111 9" stroke="#4E00F6" stroke-width="2" />
            <path
              d="M23.1113 1L6.00022 18.1111"
              stroke="#4E00F6"
              stroke-width="2"
            />
          </svg>
          <svg
            @click="isVisible = true"
            width="23"
            height="22"
            viewBox="0 0 23 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.6111 10.2529V12.2529"
              stroke="#4E00F6"
              stroke-width="2"
            />
            <path
              d="M9.61108 10.2529V13.2529"
              stroke="#4E00F6"
              stroke-width="2"
            />
            <path
              d="M16.6111 10.2529L8.61108 10.2529"
              stroke="#4E00F6"
              stroke-width="2"
            />
            <path
              d="M18.1111 12.7529C19.4918 12.7529 20.6111 11.6336 20.6111 10.2529C20.6111 8.87222 19.4918 7.75293 18.1111 7.75293C16.7304 7.75293 15.6111 8.87222 15.6111 10.2529C15.6111 11.6336 16.7304 12.7529 18.1111 12.7529Z"
              stroke="#4E00F6"
              stroke-width="2"
            />
            <path
              d="M16.6111 15.2532C14.2112 18.2532 11.6111 20.2532 11.6111 20.2532C11.6111 20.2532 9.11112 18.2532 6.61113 15.2532C4.11113 12.2532 3.61112 9.25314 3.61112 9.25314L11.6111 2.25315L15.6111 5.75315"
              stroke="#4E00F6"
              stroke-width="2"
            />
          </svg>
        </div>
      </template>
      <template v-if="checkVisibilityForRoute(['ArchivedAccounts'])">
        <svg
          width="22"
          height="16"
          viewBox="0 0 22 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11 3C7.68629 3 4.68629 4.66667 2 8C4.68629 11.3333 7.68629 13 11 13C14.3137 13 17.3137 11.3333 20 8C19.3945 7.24866 18.7731 6.58199 18.1357 6"
            stroke="#4E00F6"
            stroke-width="2"
          />
          <path d="M6 8L12 8" stroke="#4E00F6" stroke-width="2" />
          <path d="M19 1L5 15" stroke="#4E00F6" stroke-width="2" />
        </svg>
        <svg
          @click="toggleDrawer('favourite-list')"
          width="24"
          height="25"
          viewBox="0 0 24 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.6218 6.61132L12.8885 3.14551L9.83282 9.33709L3 10.33L7.94427 15.1494L6.77709 21.9546L12.8885 18.7417L19 21.9546"
            stroke="#4E00F6"
            stroke-width="2"
          />
          <path
            d="M22.4131 7.14551L18.4131 7.14551"
            stroke="#4E00F6"
            stroke-width="2"
          />
          <line
            x1="22.4131"
            y1="11.1455"
            x2="14.4131"
            y2="11.1455"
            stroke="#4E00F6"
            stroke-width="2"
          />
          <line
            x1="22.4131"
            y1="15.1455"
            x2="14.4131"
            y2="15.1455"
            stroke="#4E00F6"
            stroke-width="2"
          />
        </svg>
      </template>
    </div>
    <div class="header-right">
      <StIcon name="sync-status"></StIcon>
      <!-- <StIcon name="support"></StIcon> -->
      <!-- <StIcon
        name="notifications"
        @click="toggleDrawer('recent-notifications')"
      ></StIcon> -->
      <StIcon @click="openQuickDeposit" name="qr"></StIcon>
      <StIcon @click="goto('/settings')" name="settings"></StIcon>
    </div>
    <StModal
      light
      :visible="isVisible"
      @close="closeModal"
      class="account-modal"
    >
      <template #header>{{
        checkPassword ? 'Password Required' : 'Account Keys'
      }}</template>
      <template #body>
        <div v-if="!checkPassword" class="account-tabs">
          <a
            :class="{ active: activeStep === 'public-key' }"
            @click="changeStep('public-key')"
            >Public Key</a
          >
          <a
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
            <p class="bold">xpub</p>
            <p class="key">{{ publicKey }}</p>
            <div class="copy-key">
              <p>Copy xpub to clipboard or show QR code</p>
              <div>
                <StTooltip
                  :tooltip="
                    copyPending ? 'Copied to clipboard!' : 'Click to copy'
                  "
                  position="bottom-left"
                >
                  <StClipboard :content="publicKey" @click="handleCopy">
                    <svg
                      width="18"
                      height="22"
                      viewBox="0 0 18 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13 6H1V21H13V6Z"
                        stroke="#4E00F6"
                        stroke-width="2"
                      />
                      <line
                        x1="17"
                        y1="18"
                        x2="17"
                        stroke="#4E00F6"
                        stroke-width="2"
                      />
                      <path
                        d="M3 1L18 1"
                        stroke="#4E00F6"
                        stroke-width="2"
                      /></svg
                  ></StClipboard>
                </StTooltip>
                <StTooltip
                  tooltip="Click to show QR code"
                  position="bottom-left"
                >
                  <svg
                    @click="generatePublicQr"
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M9 9H1V1H9V9Z"
                      stroke="#4E00F6"
                      stroke-width="2"
                    />
                    <path
                      d="M13 0V4H17V1H21V6"
                      stroke="#4E00F6"
                      stroke-width="2"
                    />
                    <path
                      d="M9 22V19H5V21H1V17"
                      stroke="#4E00F6"
                      stroke-width="2"
                    />
                    <path
                      d="M13 22V18H17V21H21V18"
                      stroke="#4E00F6"
                      stroke-width="2"
                    />
                    <path d="M11 15H8V13H4" stroke="#4E00F6" stroke-width="2" />
                    <path d="M12 9H22" stroke="#4E00F6" stroke-width="2" />
                    <path
                      d="M17 11V14H21V11"
                      stroke="#4E00F6"
                      stroke-width="2"
                    />
                    <path d="M1 12V15" stroke="#4E00F6" stroke-width="2" />
                    <path d="M13 11V13" stroke="#4E00F6" stroke-width="2" />
                  </svg>
                </StTooltip>
              </div>
            </div>
            <p @click="openBlockExplorer" class="view-more bold">
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
                label="Password"
                :error-message="form.password.$errors"
              >
                <StInput
                  v-model="password"
                  placeholder="Please enter your password"
                  :type="showPassword ? 'text' : 'password'"
                ></StInput>
                <svg
                  v-if="!showPassword"
                  @click="showPassword = true"
                  width="44"
                  height="24"
                  viewBox="0 0 44 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clip-rule="evenodd"
                    d="M33 18c3.314 0 6.314-1.667 9-5-2.686-3.333-5.686-5-9-5s-6.314 1.667-9 5c2.686 3.333 5.686 5 9 5z"
                    stroke="#FAF9FC"
                    stroke-width="2"
                  />
                  <circle
                    r="1"
                    transform="matrix(-1 0 0 1 33 13)"
                    fill="#FAF9FC"
                    stroke="#FAF9FC"
                    stroke-width="2"
                  />
                </svg>
                <svg
                  v-else
                  @click="showPassword = false"
                  width="26"
                  height="19"
                  viewBox="0 0 26 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 3C8.94991 3 5.28325 5.03704 2 9.11111C5.28325 13.1852 8.94991 15.2222 13 15.2222C17.0501 15.2222 20.7168 13.1852 24 9.11111C23.2599 8.1928 22.5004 7.37799 21.7214 6.66667"
                    stroke="#FEFEFE"
                    stroke-width="2"
                  />
                  <path d="M9 9L15.1111 9" stroke="#4E00F6" stroke-width="2" />
                  <path
                    d="M23.1113 1L6.00022 18.1111"
                    stroke="#4E00F6"
                    stroke-width="2"
                  />
                </svg>
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
                      copyPending ? 'Copied to clipboard!' : 'Click to copy'
                    "
                    position="bottom-left"
                  >
                    <StClipboard :content="privateKey" @click="handleCopy">
                      <svg
                        width="18"
                        height="22"
                        viewBox="0 0 18 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13 6H1V21H13V6Z"
                          stroke="#4E00F6"
                          stroke-width="2"
                        />
                        <line
                          x1="17"
                          y1="18"
                          x2="17"
                          stroke="#4E00F6"
                          stroke-width="2"
                        />
                        <path
                          d="M3 1L18 1"
                          stroke="#4E00F6"
                          stroke-width="2"
                        /></svg
                    ></StClipboard>
                  </StTooltip>
                  <StTooltip
                    tooltip="Click to show QR code"
                    position="bottom-left"
                  >
                    <svg
                      @click="generatePrivateQr"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M9 9H1V1H9V9Z"
                        stroke="#4E00F6"
                        stroke-width="2"
                      />
                      <path
                        d="M13 0V4H17V1H21V6"
                        stroke="#4E00F6"
                        stroke-width="2"
                      />
                      <path
                        d="M9 22V19H5V21H1V17"
                        stroke="#4E00F6"
                        stroke-width="2"
                      />
                      <path
                        d="M13 22V18H17V21H21V18"
                        stroke="#4E00F6"
                        stroke-width="2"
                      />
                      <path
                        d="M11 15H8V13H4"
                        stroke="#4E00F6"
                        stroke-width="2"
                      />
                      <path d="M12 9H22" stroke="#4E00F6" stroke-width="2" />
                      <path
                        d="M17 11V14H21V11"
                        stroke="#4E00F6"
                        stroke-width="2"
                      />
                      <path d="M1 12V15" stroke="#4E00F6" stroke-width="2" />
                      <path d="M13 11V13" stroke="#4E00F6" stroke-width="2" />
                    </svg>
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
  </header>
</template>

<script>
import pkgjson from '../../../package.json';
import { useMainStore } from '@/store';
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import router from '@/router';
import CryptoService from '@/services/crypto';
import emitter from '@/services/emitter';
import VanillaQR from 'vanillaqr';
import { useValidation } from 'vue3-form-validation';

export default {
  setup() {
    const mainStore = useMainStore();
    let version = pkgjson.version;
    const route = useRoute();
    const account = ref(null);
    const accounts = ref([]);
    const isVisible = ref(false);
    const activeStep = ref('public-key');
    const publicKey = ref('');
    const privateKey = ref('');
    const publicQrCode = ref('');
    const privateQrCode = ref('');
    const checkPassword = ref(false);
    const showPassword = ref(false);
    const password = ref('');

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

    const componentVisibility = computed(() => {
      return mainStore.componentVisibility;
    });

    const isHiddenAmounts = computed(() => {
      return mainStore.isAmountsHidden;
    });

    onMounted(() => {
      if (!componentVisibility.value.chart) {
        toggleComponentVisibility('chart');
      }
      if (!componentVisibility.value.txDashboard) {
        toggleComponentVisibility('txDashboard');
      }
    });

    watch(
      () => isVisible.value,
      async () => {
        if (isVisible.value) {
          await scanWallet();
          getPublicKey();
        }
      }
    );

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
      if (!account.value) return;
      const path = CryptoService.breakAccountPath(account.value.path);
      const { xpub } = CryptoService.getKeysForAccount(
        path.account,
        path.change,
        path.address
      );
      publicKey.value = xpub;
    }

    function getPrivateKey() {
      const path = CryptoService.breakAccountPath(account.value.path);
      const { secretKey } = CryptoService.getKeysForAccount(
        path.account,
        path.change,
        path.address
      );
      privateKey.value = secretKey;
    }

    async function changeStep(step) {
      activeStep.value = step;
      publicQrCode.value = '';
      privateQrCode.value = '';
      if (step === 'private-key') {
        checkPassword.value = true;
      }
      privateKey.value = '';
      resetFields();
      await scanWallet();
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

    function accountChanged() {
      setTimeout(() => {
        emitter.emit('header:account-changed', account.value);
      }, 1);
    }

    let copyPending = ref(false);
    function handleCopy() {
      copyPending.value = true;
      setTimeout(() => {
        copyPending.value = false;
      }, 2000);
    }

    async function scanWallet() {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve) => {
        const hdWallet = await CryptoService.scanWallet();
        accounts.value = hdWallet.accounts;
        // select first option
        account.value = hdWallet.accounts[0];
        resolve();
      });
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
        process.env.VUE_APP_NETWORK === 'mainnet'
          ? '?chain=main'
          : '?chain=test';
      window
        .open(
          'https://stealthmonitor.org/xPub/' + publicKey.value + chain,
          '_blank'
        )
        .focus();
    }

    // manually trigger retrieving keys
    changeStep('public-key');

    return {
      version,
      toggleDrawer,
      currentRoute,
      componentVisibility,
      checkVisibilityForRoute,
      toggleComponentVisibility,
      goto,
      openQuickDeposit,
      headerStyle: computed(() => mainStore.headerStyle),
      isVisible,
      changeStep,
      activeStep,
      publicKey,
      privateKey,
      copyPending,
      handleCopy,
      publicQrCode,
      privateQrCode,
      checkPassword,
      showPassword,
      password,
      closeModal,
      generatePublicQr,
      openBlockExplorer,
      validatePassword,

      scanWallet,
      account,
      accounts,
      toggleHiddenAmounts,
      isHiddenAmounts,
      accountChanged,
      generatePrivateQr,

      form,
      validateFields,
      resetFields,
    };
  },
};
</script>

<style scoped>
.layout__header {
  border-bottom: 1px solid var(--grey100);
  display: flex;
  justify-content: space-between;
  align-items: center;
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
}

.header-left div + div,
.header-right svg + svg {
  margin-left: 24px;
}

.layout__header--is-grey {
  background: var(--background100);
  margin: 0;
  padding: 45px 24px 29px;
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
.icons-flex svg + svg {
  margin-left: 24px;
}
:deep .st-modal-container {
  width: 416px;
}
:deep .st-modal__body {
  margin: 30px 0 6px 0 !important;
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
  padding-right: 20px;
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
.copy-key {
  margin-top: 17px;
  margin-bottom: 51px;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  max-width: 160px;
  margin: 81px auto 88px;
}
.password-desc {
  margin-top: -23px;
}
.custom-form-item {
  margin: 163px 0 162px;
}
</style>
