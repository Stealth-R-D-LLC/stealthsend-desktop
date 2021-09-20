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
          :transactions="transactions"
        ></TransactionList>
      </div>
    </div>
  </div>
</template>

<script>
import { useMainStore } from '@/store';
import { computed, ref, onMounted } from 'vue';
import StLabel from '@/components/elements/StLabel';
import Chart from '@/views/dashboard/components/chart';
import TransactionList from '@/components/partials/TransactionList';
import CryptoService from '@/services/crypto';
import router from '@/router';
import { onBeforeRouteLeave } from 'vue-router';
import emitter from '@/services/emitter';
import useHelpers from '@/composables/useHelpers';
import SvgIcon from '../../components/partials/SvgIcon.vue';

export default {
  name: 'StAccountDetails',
  components: {
    Chart,
    TransactionList,
    StLabel,
    SvgIcon,
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

    const refreshChart = computed(() => {
      return mainStore.resetChart;
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
      if (component === 'txDashboard') {
        mainStore.REFRESH_CHART(true);
        setTimeout(() => mainStore.REFRESH_CHART(false), 1);
      }
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
      let allTransactions = [];
      if (account.value.isImported && account.value.wif) {
        await mainStore
          .rpc('getaddressinputs', [account.value.address])
          .then(async (inputs) => {
            let inputsTransactions = await Promise.all(
              inputs.map((tx) => mainStore.rpc('gettransaction', [tx.txid]))
            );
            for (let txIndex in inputsTransactions) {
              let indexOfDestination = inputsTransactions[
                txIndex
              ].vout.findIndex(
                (dest) =>
                  dest.scriptPubKey.addresses &&
                  dest.scriptPubKey.addresses[0] !== account.value.address
              );
              allTransactions.push({
                ...inputs[txIndex],
                account: account.value.label,
                amount: -inputs[txIndex].amount,
                txinfo: {
                  ...inputsTransactions[txIndex],
                },
                output:
                  indexOfDestination === -1
                    ? []
                    : [
                        inputsTransactions[txIndex].vout[indexOfDestination]
                          .scriptPubKey,
                      ],
              });
            }
          });
        await mainStore
          .rpc('getaddressoutputs', [account.value.address])
          .then(async (outputs) => {
            let outputTransactions = await Promise.all(
              outputs.map((tx) => mainStore.rpc('gettransaction', [tx.txid]))
            );
            for (let txIndex in outputTransactions) {
              allTransactions.push({
                ...outputs[txIndex],
                account: account.value.label,
                txinfo: {
                  ...outputTransactions[txIndex],
                },
                output: [
                  outputTransactions[txIndex].vout[outputs[txIndex].vout]
                    .scriptPubKey,
                ],
              });
            }
          });

        allTransactions = CryptoService.processImportedTxs(allTransactions);

      } else {
        await mainStore
          .rpc('gethdaccount', [account.value.xpub])
          .then((hdAccount) => {
            for (let tx of hdAccount) {
              let outputAddresses = tx.outputs.map((output) => output.address);
              let indexOfDestination;
              if (tx.account_balance_change < 0) {
                indexOfDestination = tx.txinfo.destinations.findIndex(
                  (dest) => outputAddresses.indexOf(dest.addresses[0]) === -1
                );
              } else {
                indexOfDestination = tx.txinfo.destinations.findIndex(
                  (dest) => dest.amount === tx.account_balance_change
                );
              }
              if (indexOfDestination === -1) {
                indexOfDestination = 0;
              }
              allTransactions.push({
                ...tx,
                output: [tx.txinfo.destinations[indexOfDestination]],
                amount: tx.account_balance_change,
                blocktime: tx.txinfo.blocktime,
                account: account.value.label,
              });
            }
          });
      }
      transactions.value = allTransactions;
    }

    if (account.value && Object.keys(account.value).length > 0) {
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
      refreshChart,
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
