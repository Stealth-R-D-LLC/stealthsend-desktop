<template>
  <div class="account-details-container" v-if="account">
    <div class="account-details-container__top">
      <div class="left">
        <StLabel label="XST Balance" bold>{{
          isHiddenAmounts ? '•••' : formatAmount(account.utxo, false, 2)
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
          ><StTag :color="Number(changePercent24Hr) > 0 ? 'success' : 'danger'">
            {{
              Number(changePercent24Hr) > 0
                ? '+' + changePercent24Hr
                : changePercent24Hr
            }}%
          </StTag>
        </StLabel>
        <div class="actions">
          <StButton class="send-btn" @click="openModal('send')">Send</StButton>
          <StButton class="receive-btn" @click="openModal('receive')"
            >Receive</StButton
          >
        </div>
      </div>
    </div>
    <div class="account-details-container__body">
      <div class="account-details-container__body--overflow">
        <div class="icons">
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
        </div>
        <Chart v-if="componentVisibility.chart"></Chart>
        <TransactionList
          v-if="componentVisibility.txDashboard"
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

    mainStore.SET_HEADER_STYLE('grey');

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
  padding: 24px;
}
.account-details-container__body {
  padding: 24px 10px 24px 24px;
  background: #ffffff;
}
.account-details-container__body--overflow {
  overflow: auto;
  height: calc(100vh - 252px);
  width: calc(100% - 14px);
  padding-right: 14px;
}
.account-details-container__body--overflow::-webkit-scrollbar {
  width: 4px;
}
.account-details-container__body--overflow::-webkit-scrollbar-thumb {
  background: var(--grey100);
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
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(15ch, 1fr));
}
.send-btn,
.receive-btn {
  min-width: 120px !important;
  width: 120px !important;
  height: 36px;
  padding: 6px 0;
  font-family: var(--secondary-font);
  font-weight: bold;
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.12px;
  color: var(--grey50);
  border: 1px solid rgba(124, 126, 175, 0.5);
  background: linear-gradient(
      153.02deg,
      rgba(124, 126, 175, 0.15) 0%,
      rgba(124, 126, 175, 0.15) 83.23%
    ),
    var(--purple500);
  align-self: flex-end;
}
.send-btn:hover,
.receive-btn:hover {
  border: 1px solid rgba(124, 126, 175, 0.5);
  background: linear-gradient(
      153.02deg,
      rgba(124, 126, 175, 0.15) 0%,
      rgba(124, 126, 175, 0.15) 83.23%
    ),
    var(--purple500);
  cursor: pointer;
}
.actions {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
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
</style>
