<template>
  <div class="favourite-list">
    <div class="top">
      <span class="title">Favourite list</span>
      <svg
        @click="closeCanvas"
        class="close"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 3L15 15"
          stroke="#4E00F6"
          stroke-width="2"
          stroke-linejoin="round"
        />
        <path
          d="M3 15L15 3"
          stroke="#4E00F6"
          stroke-width="2"
          stroke-linejoin="round"
        />
      </svg>
    </div>
    <p class="paragraph">Short list your Favourite Accounts in ordered list.</p>
    <label for="multiselect" class="multiselect-label">
      <span>Add Favourite to list</span>
      <a>Add</a>
    </label>
    <StMultiselect
      v-model="account"
      :class="{ 'multiselect-filled': account }"
      :options="accounts"
      track-by="_id"
      value-prop="address"
      label="Add favourite to list"
      placeholder="Select Account from the dropdown"
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
    <div class="accounts-list">
      <div
        class="account-grid"
        v-for="(accounsList, index) in 100"
        :key="index"
      >
        <p class="bold">{{ index + 1 }}.</p>
        <div>
          <p class="flex-paragraph">
            <span class="bold">Oh, yeah I have it all</span>
            <span><span class="bold">XST</span>/USD</span>
          </p>
          <p>3,874,266,900.00000000 ~ $27,119,868,300.00 USD</p>
        </div>
        <svg
          v-if="index + 1 > 1"
          class="order"
          width="12"
          height="16"
          viewBox="0 0 12 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6 16L6 2" stroke="#A2A1A4" stroke-width="2" />
          <path d="M11 7L6 2L1 7" stroke="#A2A1A4" stroke-width="2" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import CryptoService from '@/services/crypto';
import { useMainStore } from '@/store';
export default {
  name: 'FavouriteList',
  setup() {
    const mainStore = useMainStore();
    const account = ref(null);
    const accounts = ref([]);

    async function scanWallet() {
      const hdWallet = await CryptoService.scanWallet();
      accounts.value = hdWallet.accounts;
    }
    scanWallet();

    function closeCanvas() {
      mainStore.TOGGLE_DRAWER(false);
      setTimeout(() => {
        mainStore.SET_OFF_CANVAS_DATA(null);
        mainStore.SET_CURRENT_CANVAS('transaction-details');
      }, 300);
    }

    return {
      // variables
      account,
      accounts,

      // functions
      closeCanvas,
    };
  },
};
</script>

<style scoped>
.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}
.paragraph {
  margin-bottom: 32px;
}
.close {
  cursor: pointer;
}
.close path {
  cursor: pointer;
  transition: 0.3s;
}
.close:hover path {
  stroke: var(--marine200);
}
.multiselect-single-label {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  position: absolute;
  top: -5px;
  color: var(--grey900);
}
.multiselect-single-label .account-utxo {
  margin-top: 5px;
  font-size: 14px;
  line-height: 14px;
  letter-spacing: 0.12px;
}
.multiselect-single-label .account-label {
  font-size: 14px;
  line-height: 14px;
  letter-spacing: 0.12px;
}

.multiselect-label {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.12px;
}

.multiselect-label span {
  color: var(--marine400);
  font-weight: bold;
}
.multiselect-label a {
  cursor: pointer;
  color: var(--marine200);
  transition: 0.3s;
}
.multiselect-label a:hover {
  color: var(--marine400);
}
:deep .multiselect-input > .multiselect-placeholder {
  color: var(--grey900);
}
.accounts-list {
  margin-top: 18px;
  overflow: auto;
  max-height: calc(100vh - 231px);
  width: calc(100% + 5px);
  padding-right: 18px;
}
.accounts-list::-webkit-scrollbar {
  width: 4px;
}
.accounts-list::-webkit-scrollbar-thumb {
  background: var(--grey100);
}
.account-grid {
  display: grid;
  grid-template-columns: auto 10fr 15px;
  grid-gap: 0 12px;
}
.account-grid + .account-grid {
  border-top: 1px solid var(--grey100);
  margin-top: 16px;
  padding-top: 16px;
}
.flex-paragraph {
  display: flex;
  justify-content: space-between;
}
.order {
  cursor: pointer;
}
.order path {
  transition: 0.3s;
}
.order:hover path {
  stroke: var(--marine500);
}
</style>
