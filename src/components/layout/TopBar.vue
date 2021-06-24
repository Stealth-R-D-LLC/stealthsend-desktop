<template>
  <header
    class="layout__header"
    :class="{ 'layout__header--is-grey': headerStyle === 'grey' }"
  >
    <div class="header-left">
      <template v-if="checkVisibilityForRoute(['Dashboard'])">
        <StIcon
          :class="{ inactive: !componentVisibility.chart }"
          name="chart"
          @click="toggleComponentVisibility('chart')"
        ></StIcon>
        <StIcon
          :class="{ inactive: !componentVisibility.txDashboard }"
          name="tx-list"
          @click="toggleComponentVisibility('txDashboard')"
        ></StIcon>
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
            <div class="multiselect-single-label">
              <p class="account-label">
                {{ account && account.label }}
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
        <svg
          v-if="!isHiddenAmounts"
          @click="toggleHiddenAmounts"
          width="26"
          height="14"
          viewBox="0 0 26 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="hide-amounts"
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
          class="hide-amounts"
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
          width="20"
          height="22"
          viewBox="0 0 20 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="hide-amounts"
        >
          <path
            d="M10.611 10.253v2M7.611 10.253v3M14.611 10.253h-8M16.111 12.753a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
            stroke="#4E00F6"
            stroke-width="2"
          />
          <path
            d="M14.611 15.253c-2.4 3-5 5-5 5s-2.5-2-5-5-3-6-3-6l8-7 4 3.5"
            stroke="#4E00F6"
            stroke-width="2"
          />
        </svg>
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
  </header>
</template>

<script>
import pkgjson from '../../../package.json';
import { useMainStore } from '@/store';
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import router from '@/router';
import CryptoService from '@/services/crypto';
import emitter from '@/services/emitter';

export default {
  setup() {
    const mainStore = useMainStore();
    let version = pkgjson.version;
    const route = useRoute();
    const account = ref(null);
    const accounts = ref([]);

    const currentRoute = computed(() => {
      return route.name;
    });

    const componentVisibility = computed(() => {
      return mainStore.componentVisibility;
    });

    const isHiddenAmounts = computed(() => {
      return mainStore.isAmountsHidden;
    });

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

    async function scanWallet() {
      const hdWallet = await CryptoService.scanWallet();
      accounts.value = hdWallet.accounts;
      // select first option
      account.value = hdWallet.accounts[0];
      // // manually start finding address for preselected account
      // changeAccount(account.value)
    }
    scanWallet();

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

      scanWallet,
      account,
      accounts,
      toggleHiddenAmounts,
      isHiddenAmounts,
      accountChanged,
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
  display: flex;
  align-items: center;
}

.header-left svg + svg,
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

.hide-amounts {
  margin: 0 0 0 24px !important;
}
</style>
