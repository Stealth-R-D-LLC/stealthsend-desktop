<template>
  <div class="account-details-container">
    <div class="account-details-container__top">
      <div class="left">
        <StLabel label="XST Balance" bold>{{ account.utxo }}</StLabel>
        <StLabel label="USD Value">${{ usdAmount }}</StLabel>
        <StLabel label="BTC Value">{{ btcAmount }}</StLabel>
        <StLabel label="24h %"><StTag> +280.88% </StTag> </StLabel>
        <StButton disabled>Send</StButton>
        <StButton disabled>Receive</StButton>
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
      :tooltip-text="copyPending ? 'Copied to clipboard!' : 'Click to copy'"
    >
    </StTooltip>
  </div>
</template>

<script>
import { useMainStore } from '@/store';
import { computed, ref } from 'vue';
import StLabel from '@/components/elements/StLabel';
// import VanillaQR from 'vanillaqr';
import Card from '@/components/elements/Card';
import TransactionList from '@/components/partials/TransactionList';
import CryptoService from '@/services/crypto';
import router from '@/router';

export default {
  name: 'StAccountDetails',
  components: {
    Card,
    TransactionList,
    StLabel,
  },
  setup() {
    const mainStore = useMainStore();
    mainStore.SET_HEADER_STYLE('grey');

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

    const usdAmount = computed(() => {
      return (
        Number(addressInfo.value.balance) * CryptoService.constraints.XST_USD ||
        0
      );
    });
    const btcAmount = computed(() => {
      return (
        Number(addressInfo.value.balance) * CryptoService.constraints.XST_BTC ||
        0
      );
    });

    if (account.value) {
      mainStore
        .rpc('getaddressinfo', [account.value.address])
        .then((res) => {
          addressInfo.value = res;
        })
        .catch((err) => {
          return err;
        });
      mainStore
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
      mainStore
        .rpc('getaddressoutputs', [account.value.address])
        .then((res) => {
          // output amounts should be shown as negatives in the transaction table
          let mappedAmounts = res.map((el) => {
            return {
              ...el,
              account: account.value.label,
              amount: el.amount * -1,
            };
          });
          transactions.value = transactions.value.concat(mappedAmounts);
        })
        .catch((err) => {
          return err;
        });

      // var qr = new VanillaQR({
      //   url: account.value.address,
      // });
      // qrSrc.value = qr.toImage('png').src;
    }
    return {
      account,
      addressInfo,
      copyPending,
      handleCopy,
      // qrSrc,
      openTransaction,
      transactions,
      usdAmount,
      btcAmount,
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
</style>
