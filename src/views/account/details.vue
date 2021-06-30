<template>
  <div class="account-details-container" v-if="account">
    <div class="account-details-container__top">
      <div class="left">
        <StLabel label="XST Balance" bold>{{
          isHiddenAmounts ? '•••' : formatAmount(account.utxo, false, 2)
        }}</StLabel>
        <StLabel label="USD Value"
          >${{
            isHiddenAmounts ? '•••' : formatAmount(usdAmount, false, 2)
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
      <TransactionList
        has-table-header
        :transactions="transactions"
      ></TransactionList>
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
import { computed, ref } from 'vue';
import StLabel from '@/components/elements/StLabel';
import Card from '@/components/elements/Card';
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

    function openModal(name) {
      mainStore.SET_MODAL_VISIBILITY(name, true);
    }

    const usdAmount = computed(() => {
      console.log(
        'CryptoService.constraints.XST_USD',
        CryptoService.constraints.XST_USD
      );
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
      await mainStore
        .rpc('getaddressinputs', [account.value.address])
        .then((res) => {
          let mappedAmounts = res.map((el) => {
            return {
              ...el,
              account: account.value.label,
            };
          });
          transactions.value = transactions.value.concat(mappedAmounts);
        })
        .catch((err) => {
          return err;
        });
      await mainStore
        .rpc('getaddressoutputs', [account.value.address])
        .then((res) => {
          let mappedAmounts = res.map((el) => {
            return {
              ...el,
              account: account.value.label,
              // output amounts should be shown as negatives in the transaction table
              amount: el.amount * -1,
            };
          });
          transactions.value = transactions.value.concat(mappedAmounts);
        })
        .catch((err) => {
          return err;
        });
    }

    if (account.value) {
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
  padding: 24px 24px 24px 24px;
}
.account-details-container__body {
  padding: 24px 24px 24px 24px;
  background: #ffffff;
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
</style>
