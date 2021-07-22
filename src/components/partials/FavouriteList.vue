<template>
  <div class="favourite-list">
    <div class="top">
      <span class="title">Favorite List</span>
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
    <p v-if="favouritedAccounts.length" class="paragraph">
      Arrange up to 10 favorite accounts
    </p>
    <p v-else class="paragraph">You don't have any favorite accounts</p>
    <StFormItem label="Choose an Account" :error-message="form.account.$errors">
      <template #labelRight v-if="favouritedAccounts.length < 10"><a @click="addToFavouriteList">Add</a></template>
      <StMultiselect
        v-model="account"
        :class="{ 'multiselect-filled': account }"
        :options="unfavouritedAccounts"
        track-by="address"
        value-prop="address"
        :object="true"
        placeholder="Select from dropdown"
      >
        <template #singleLabel>
          <div class="multiselect-single-label">
            <p class="account-label">
              {{ account && account.label }}
            </p>
            <p class="account-utxo">
              {{ account && formatAmount(account.utxo, true, 8, 2) }}
            </p>
          </div>
        </template>

        <template #option="{ option }">
          <div class="flex-space-between">
            <span class="option">
              {{ option.label }}
            </span>
            <span class="amount"
              >{{ formatAmount(option.utxo, true, 8, 2) }} XST</span
            >
          </div>
        </template>
      </StMultiselect>
    </StFormItem>
    <div id="favouriteList" class="accounts-list">
      <div
        class="account-grid"
        v-for="(acc, index) in favouritedAccounts"
        :key="acc.address"
        :data-id="JSON.stringify(acc)"
      >
        <p class="bold">{{ index + 1 }}.</p>
        <div>
          <p class="account-name medium bold">{{ acc.label }}</p>
          <p class="medium">
            {{ formatAmount(Math.abs(acc.utxo, true, 8)) }} XST
          </p>
          <p class="amount-fiat">
            ~
            <template v-if="Number(acc.utxo) * XST_USD_RATE < 1">
              {{ formatAmount(Math.abs(acc.utxo * XST_USD_RATE), true) }}
            </template>
            <template v-else>
              {{ formatAmount(Math.abs(acc.utxo * XST_USD_RATE), false) }}
            </template>
            USD
          </p>
        </div>
        <div class="account-icons">
          <svg
            @click="removeFromFavoriteList(acc)"
            width="21"
            height="20"
            viewBox="0 0 21 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5.5L10.4164 2.5L8.12461 7.43769L3 8.22949L6.7082 12.0729L5.83282 17.5L10.4164 14.9377L15 17.5"
              stroke="#A2A1A4"
              stroke-width="2"
            />
            <path d="M19 10.5H12.5" stroke="#A2A1A4" stroke-width="2" />
          </svg>
          <svg
            class="handle"
            width="10"
            height="15"
            viewBox="0 0 10 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="1.5" cy="1.5" r="1.5" fill="#A2A1A4" />
            <circle cx="7.5" cy="1.5" r="1.5" fill="#A2A1A4" />
            <circle cx="1.5" cy="7.5" r="1.5" fill="#A2A1A4" />
            <circle cx="7.5" cy="7.5" r="1.5" fill="#A2A1A4" />
            <circle cx="1.5" cy="13.5" r="1.5" fill="#A2A1A4" />
            <circle cx="7.5" cy="13.5" r="1.5" fill="#A2A1A4" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import CryptoService from '@/services/crypto';
import useHelpers from '@/composables/useHelpers';
import { useMainStore } from '@/store';
import emitter from '@/services/emitter';
import Sortable from 'sortablejs';
import { useValidation, ValidationError } from 'vue3-form-validation';

export default {
  name: 'FavouriteList',
  setup() {
    const mainStore = useMainStore();
    const account = ref(null);
    const accounts = ref([]);
    const { formatAmount } = useHelpers();
    const XST_USD_RATE = computed(() => {
      return CryptoService.constraints.XST_USD || 1;
    });
    const favouritedAccounts = ref([]);

    const { form, validateFields } = useValidation({
      account: {
        $value: account,
        $rules: [
          {
            rule: () => {
              return (
                favouritedAccounts.value.length >= 10 &&
                'You can only have 10 favorite accounts'
              );
            },
          },
        ],
      },
    });

    async function scanWallet() {
      console.log('fav list scan');
      const hdWallet = await CryptoService.scanWallet();
      accounts.value = hdWallet.accounts;
      favouritedAccounts.value = accounts.value
        .filter((el) => el.isFavourite)
        .sort((a, b) => a.favouritePosition - b.favouritePosition);
    }
    scanWallet();

    var sortable = null;

    function closeCanvas() {
      mainStore.TOGGLE_DRAWER(false);
      account.value = null;
      setTimeout(() => {
        mainStore.SET_OFF_CANVAS_DATA(null);
        mainStore.SET_CURRENT_CANVAS('transaction-details');
      }, 300);
    }

    watch(
      () => mainStore.currentOffCanvas,
      async () => {
        if (mainStore.currentOffCanvas === 'favourite-list') {
          scanWallet();
          if (!sortable) {
            var el = document.getElementById('favouriteList');
            sortable = Sortable.create(el, {
              animation: 150,
              easing: 'cubic-bezier(1, 0, 0, 1)',
              handle: '.handle',
              draggagle: '.account-grid',
              store: {
                set: async function (sortable) {
                  let newOrder = sortable.toArray().map((el) => JSON.parse(el));
                  for (let index in newOrder) {
                    const i = parseInt(index);
                    newOrder[i]['favouritePosition'] = i + 1;
                  }
                  for (let acc of newOrder) {
                    await CryptoService.changeAccountFavouritePosition(
                      acc,
                      acc.favouritePosition
                    );
                  }
                  scanWallet();
                },
              },
            });
          }
        }
      },
      { deep: true }
    );

    const unfavouritedAccounts = computed(() => {
      return accounts.value.filter((el) => !el.isFavourite && !el.isArchived);
    });

    async function addToFavouriteList() {
      try {
        await validateFields();
        if (!account.value) return;
        await CryptoService.favouriteAccount(account.value);
        const scannedAccounts = await CryptoService.scanWallet();
        accounts.value = scannedAccounts.accounts;
        account.value = null;
        emitter.emit('accounts:refresh');
      } catch (e) {
        if (e instanceof ValidationError) {
          console.log(e);
        }
      }
    }
    async function removeFromFavoriteList(account) {
      await CryptoService.unfavouriteAccount(account);
      const scannedAccounts = await CryptoService.scanWallet();
      accounts.value = scannedAccounts.accounts;
      emitter.emit('accounts:refresh');
    }

    emitter.on('accounts:refresh', () => {
      scanWallet();
    });

    return {
      // variables
      account,
      accounts,

      // functions
      closeCanvas,
      formatAmount,
      XST_USD_RATE,
      form,

      favouritedAccounts,
      unfavouritedAccounts,
      addToFavouriteList,
      removeFromFavoriteList,
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
/* .multiselect-single-label {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  position: absolute;
  top: -5px;
  color: var(--grey900);
} */
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
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-break: break-all;
  overflow: hidden;
  margin-right: 10px;
}
:deep .label-right a {
  cursor: pointer;
  transition: 0.3s;
}
:deep .label-right a:hover {
  color: var(--marine400);
}
:deep .multiselect-input > .multiselect-placeholder {
  color: var(--grey900);
}
.accounts-list {
  margin-top: 44px;
  overflow: auto;
  max-height: calc(100vh - 280px);
  width: calc(100% + 5px);
  padding-right: 18px;
}
.accounts-list::-webkit-scrollbar {
  width: 4px;
}
.accounts-list:hover::-webkit-scrollbar-thumb {
  background: var(--grey100);
}
.accounts-list::-webkit-scrollbar-thumb {
  background: transparent;
}
.account-grid {
  display: grid;
  grid-template-columns: auto 10fr auto;
  grid-gap: 0 18px;
  align-items: flex-start;
}
.account-grid + .account-grid {
  border-top: 1px solid var(--grey100);
  margin-top: 16px;
  padding-top: 32px;
}
.account-name {
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
  max-width: 237px;
}
.amount-fiat {
  color: var(--grey500);
}
.account-icons {
  display: flex;
  align-items: center;
}
.account-icons svg {
  cursor: pointer;
}
.account-icons .handle {
  cursor: move;
}
.account-icons svg + svg {
  margin-left: 26px;
}
.account-icons svg path,
.account-icons svg circle {
  transition: 0.3s;
}
.account-icons svg:hover path {
  stroke: var(--marine500);
}
.account-icons svg:hover circle {
  fill: var(--marine500);
}
.flex-space-between .option {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-break: break-all;
  margin-right: 10px;
}
.flex-space-between .amount {
  white-space: nowrap;
}
:deep .st-form-item .st-form-item__error {
  position: absolute;
  left: 0;
  right: 0;
  text-align: left;
}
</style>
