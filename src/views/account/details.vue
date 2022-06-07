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
          <StButton type="type-c" size="normal" @click="openModal('send')"
            >Send</StButton
          >
          <StButton type="type-c" size="normal" @click="openModal('receive')"
            >Receive</StButton
          >
        </div>
      </div>
    </div>
    <div class="account-details-container__body">
      <div class="account-details-container__body--overflow">
        <div class="icons">
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
        </div>
        <template v-if="!refreshChart">
          <Chart
            v-if="componentVisibility.chart"
            :class="{
              'full-height__details': !componentVisibility.txDashboard,
            }"
          ></Chart>
        </template>
        <TransactionList
          v-if="componentVisibility.txDashboard"
          class="details-table"
          has-table-header
          :transactions="
            transactions
              ? fil((el) => el.account === account.label, transactions)
              : []
          "
        ></TransactionList>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StAccountDetails',
};
</script>
<script setup>
import { useMainStore } from '@/store';
import { computed, onMounted, ref } from 'vue';
import StLabel from '@/components/elements/StLabel';
import Chart from '@/views/dashboard/components/chart';
import TransactionList from '@/components/partials/TransactionList';
import CryptoService from '@/services/crypto';
import { onBeforeRouteLeave } from 'vue-router';
import emitter from '@/services/emitter';
import useHelpers from '@/composables/useHelpers';
import SvgIcon from '../../components/partials/SvgIcon.vue';
import { useRoute } from 'vue-router';

const mainStore = useMainStore();
const { formatAmount } = useHelpers();
const route = useRoute();

onBeforeRouteLeave(() => {
  mainStore.SET_ACCOUNT_DETAILS(null);
});
const fil = (fn, a) => {
  const f = []; //final
  for (let i = 0; i < a.length; i++) {
    if (fn(a[i])) {
      f.push(a[i]);
    }
  }
  return f;
};
const account = computed(() => {
  return mainStore.accountDetails;
});

const isHiddenAmounts = computed(() => mainStore.isAmountsHidden);

const refreshChart = computed(() => {
  return mainStore.resetChart;
});

const wallet = computed(() => {
  return mainStore.wallet;
});

const transactions = ref([]);

onMounted(async () => {
  mainStore.START_GLOBAL_LOADING();
  if (!wallet.value) {
    await CryptoService.scanWallet();
  }
  transactions.value = mainStore.wallet.txs;
  if (!componentVisibility.value.chart) {
    toggleComponentVisibility('chart');
  }
  if (!componentVisibility.value.txDashboard) {
    toggleComponentVisibility('txDashboard');
  }
  mainStore.STOP_GLOBAL_LOADING();
});

function openModal(modal) {
  mainStore.SET_MODAL_VISIBILITY(modal, true);
}

const componentVisibility = computed(() => {
  return mainStore.componentVisibility;
});

const usdAmount = computed(() => {
  return Number(account.value.utxo) * CryptoService.constraints.XST_USD || 0;
});
const btcAmount = computed(() => {
  return Number(account.value.utxo) * CryptoService.constraints.XST_BTC || 0;
});
const changePercent24Hr = computed(() => {
  return formatAmount(CryptoService.constraints.changePercent24Hr) || 0;
});

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

emitter.on('transactions:refresh', async () => {
  if (route.name !== 'AccountDetails' || !account?.value?.address) return; // don't refresh if not on this screen
  transactions.value = CryptoService.refreshPendingTransactions(
    mainStore.wallet.txs
  );
  mainStore.SET_ACCOUNT_DETAILS(
    mainStore.wallet.accounts.find((el) => el.address === account.value.address)
  );
});
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
.details-table :deep td:nth-child(4) .move-left {
  transform: translateX(-40px) !important;
}
.details-table :deep td:nth-child(5) .move-left {
  transform: translateX(-70px) !important;
}
:deep .move-left {
  transform: translateX(-95px) !important;
}
:deep .button-normal {
  padding: 5px 10px;
  width: 120px;
}
</style>
