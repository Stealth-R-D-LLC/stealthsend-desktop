<template>
  <div class="account-details-container" v-if="account">
    <div class="account-details-container__top">
      <div class="left">
        <div>
          <StLabel label="XST Balance" bold>{{
            isHiddenAmounts ? '•••' : formatAmount(account.utxo, false, 6, 6)
          }}</StLabel>
          <StLabel label="USD Value"
            >${{
              isHiddenAmounts ? '•••' : formatAmount(usdAmount, false, 4, 4)
            }}</StLabel
          >
          <StLabel label="BTC Value">{{
            isHiddenAmounts ? '•••' : formatAmount(btcAmount, false, 8, 8)
          }}</StLabel>
          <StLabel label="24h %"
            ><StTag
              :color="Number(changePercent24Hr) > 0 ? 'success' : 'danger'"
            >
              {{
                Number(changePercent24Hr) > 0
                  ? '+' + changePercent24Hr
                  : changePercent24Hr
              }}%
            </StTag>
          </StLabel>
        </div>
        <div class="actions">
          <StButton type="type-c" @click="openModal('send')">Send</StButton>
          <StButton type="type-c" @click="openModal('receive')"
            >Receive</StButton
          >
        </div>
      </div>
    </div>
    <div class="account-details-container__body">
      <div class="account-details-container__body--overflow">
        <div class="icons">
          <div :class="{ nonclickable: !componentVisibility.txDashboard }">
            <svg
              :class="{ inactive: !componentVisibility.chart }"
              @click="toggleComponentVisibility('chart')"
              width="16"
              height="18"
              viewBox="0 0 16 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 18V7"
                stroke="#4E00F6"
                stroke-width="2"
                stroke-linejoin="round"
              />
              <path
                d="M6 18V9"
                stroke="#4E00F6"
                stroke-width="2"
                stroke-linejoin="round"
              />
              <path
                d="M10 18V0"
                stroke="#4E00F6"
                stroke-width="2"
                stroke-linejoin="round"
              />
              <path
                d="M14 18V4"
                stroke="#4E00F6"
                stroke-width="2"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div :class="{ nonclickable: !componentVisibility.chart }">
            <svg
              :class="{ inactive: !componentVisibility.txDashboard }"
              @click="toggleComponentVisibility('txDashboard')"
              width="18"
              height="12"
              viewBox="0 0 18 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 1H18"
                stroke="#4E00F6"
                stroke-width="2"
                stroke-linejoin="round"
              />
              <path
                d="M0 1H2"
                stroke="#4E00F6"
                stroke-width="2"
                stroke-linejoin="round"
              />
              <path
                d="M4 6H18"
                stroke="#4E00F6"
                stroke-width="2"
                stroke-linejoin="round"
              />
              <path
                d="M0 6H2"
                stroke="#4E00F6"
                stroke-width="2"
                stroke-linejoin="round"
              />
              <path
                d="M4 11H18"
                stroke="#4E00F6"
                stroke-width="2"
                stroke-linejoin="round"
              />
              <path
                d="M0 11H2"
                stroke="#4E00F6"
                stroke-width="2"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
        <Chart v-if="componentVisibility.chart"></Chart>
        <TransactionList
          v-if="componentVisibility.txDashboard"
          class="details-table"
          has-table-header
          :transactions="transactions"
        ></TransactionList>
      </div>
    </div>
    <Card
      class="list-item"
      :archiveable="false"
      :account="{
        label: account.label,
        utxo: account.utxo,
        isArchived: account.isArchived,
      }"
    ></Card>
    <StTooltip
      :tooltip="copyPending ? 'Copied to clipboard!' : 'Click to copy'"
    >
    </StTooltip>
  </div>
</template>

<script>
import { useMainStore } from '@/store';
import { computed, ref, onMounted } from 'vue';
import StLabel from '@/components/elements/StLabel';
import Card from '@/components/elements/Card';
import Chart from '@/views/dashboard/components/chart';
import TransactionList from '@/components/partials/TransactionList';
import CryptoService from '@/services/crypto';
import router from '@/router';
import { onBeforeRouteLeave } from 'vue-router';
import emitter from '@/services/emitter';
import useHelpers from '@/composables/useHelpers';

export default {
  name: 'StAccountDetails',
  components: {
    Card,
    Chart,
    TransactionList,
    StLabel,
  },
  setup() {
    const mainStore = useMainStore();
    const { formatAmount } = useHelpers();

    onBeforeRouteLeave(() => {
      mainStore.SET_ACCOUNT_DETAILS(null);
    });

    function openTransaction(trx) {
      router.push(`/transaction/${trx.txid}`);
    }

    const account = computed(() => {
      return mainStore.accountDetails;
    });

    const addressInfo = ref({});
    const transactions = ref([]);
    // const qrSrc = ref('');

    let copyPending = ref(false);
    function handleCopy() {
      copyPending.value = true;
      setTimeout(() => {
        copyPending.value = false;
      }, 2000);
    }

    onMounted(() => {
      if (!componentVisibility.value.chart) {
        toggleComponentVisibility('chart');
      }
      if (!componentVisibility.value.txDashboard) {
        toggleComponentVisibility('txDashboard');
      }
    });

    function openModal(modal) {
      mainStore.SET_MODAL_VISIBILITY(modal, true);
    }

    const componentVisibility = computed(() => {
      return mainStore.componentVisibility;
    });

    const usdAmount = computed(() => {
      return (
        Number(account.value.utxo) * CryptoService.constraints.XST_USD || 0
      );
    });
    const btcAmount = computed(() => {
      return (
        Number(account.value.utxo) * CryptoService.constraints.XST_BTC || 0
      );
    });
    const changePercent24Hr = computed(() => {
      return formatAmount(
        CryptoService.constraints.changePercent24Hr,
        false,
        2
      );
    });

    function toggleComponentVisibility(component) {
      mainStore.SET_COMPONENT_VISIBILITY(
        component,
        !componentVisibility.value[component]
      );
    }

    async function getData() {
      addressInfo.value = {};
      transactions.value = [];
      await mainStore
        .rpc('getaddressinfo', [account.value.address])
        .then((res) => {
          addressInfo.value = res;
        })
        .catch((err) => {
          return err;
        });
      await mainStore.rpc('gethdaccount', [account.value.xpub]).then((res) => {
        let mappedAmounts = res.map((el) => {
          return {
            ...el,
            account: account.value.label,
            blocktime: el.txinfo.blocktime,
            amount: el.account_balance_change,
          };
        });
        transactions.value = mappedAmounts;
      });
    }

    if (Object.keys(account.value).length > 0) {
      getData();
    }
    emitter.on('header:account-changed', (account) => {
      mainStore.SET_ACCOUNT_DETAILS(account);
      getData();
    });
    emitter.on('transactions:refresh', () => {
      setTimeout(() => {
        getData();
      }, 5000);
    });
    return {
      account,
      addressInfo,
      copyPending,
      handleCopy,
      openTransaction,
      transactions,
      usdAmount,
      btcAmount,
      openModal,
      formatAmount,
      changePercent24Hr,
      isHiddenAmounts: computed(() => mainStore.isAmountsHidden),
      componentVisibility,
      toggleComponentVisibility,
    };
  },
};
</script>

<style scoped>
.account-details-container {
  /* padding: 24px; */
  background: var(--background100);
}

.account-details-container__top {
  padding: 22px 28px 18px;
}
.account-details-container__body {
  padding: 24px 10px 0 24px;
  background: #ffffff;
}
.account-details-container__body--overflow {
  overflow: auto;
  height: calc(100vh - 227px);
  width: calc(100% - 14px);
  padding-right: 14px;
  overflow-x: hidden;
}
.account-details-container__body--overflow::-webkit-scrollbar {
  width: 4px;
}
.account-details-container__body--overflow:hover::-webkit-scrollbar-thumb {
  background: var(--grey100);
}
.account-details-container__body--overflow::-webkit-scrollbar-thumb {
  background: transparent;
}

.account-details-container__body :deep .apexcharts-tooltip,
.account-details-container__body
  :deep
  .apexcharts-tooltip.apexcharts-theme-light {
  left: initial !important;
  right: -15px;
  top: 5px !important;
}

.account-details-container__top .left {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.account-details-container__top .left > div {
  display: flex;
}
.account-details-container__top .left > div .st-label {
  margin-right: 24px;
}
.account-details-container__top .left > div .st-label--is-bold {
  margin-right: 56px;
}
.actions {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.actions button {
  margin: 0;
}
.actions button:last-child {
  margin-left: 24px;
}
.receive-btn {
  margin-left: 24px;
}
.icons {
  width: fit-content;
  display: flex;
  align-items: center;
  position: relative;
  top: 22px;
  z-index: 1;
}
.icons svg {
  cursor: pointer;
  margin-right: 24px;
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
.st-transaction-list {
  padding: 0;
}
.st-transaction-list :deep .overflow {
  padding: 0 0 20px 0;
  overflow: initial;
  height: auto;
}
:deep .st-dashboard-chart {
  margin-top: 24px;
}
.st-label:nth-child(1) {
  min-width: 186px;
}
.st-label:nth-child(2) {
  min-width: 149px;
}
.st-label:nth-child(3) {
  min-width: 140px;
}

.details-table :deep td:nth-child(2) {
  width: 85px;
}
.details-table :deep td:nth-child(3) {
  width: 140px;
}
.details-table :deep td:nth-child(3) div {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-break: break-all;
}
@media screen and (max-width: 1270px) {
  .details-table :deep td:nth-child(4),
  :deep th:nth-child(4) {
    display: none;
  }
}
.details-table :deep td:nth-child(4) {
  width: 300px;
}
.details-table :deep td:nth-child(5) {
  width: 230px;
}
.details-table :deep td:nth-child(5) div {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-break: break-all;
}
.details-table :deep td:nth-child(6) {
  width: 121px;
}
.details-table :deep td:nth-child(7) {
  width: 121px;
}
:deep .move-left {
  transform: translateX(-65px) !important;
}
:deep .button-normal {
  padding: 5px 10px;
  width: 120px;
}
</style>
