<template>
  <div class="account-details-container">
    <div class="account-details-container__top">
      <p>xst balance: {{account.utxo}}</p>
      <p>usd value: {{usdAmount}}</p>
      <p>xst btc value: {{btcAmount}}</p>
    </div>
    <div class="account-details-container__body">
      <TransactionList :transactions="transactions"></TransactionList>
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
  },
  setup() {
    const mainStore = useMainStore();

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
        return Number(addressInfo.value.balance) * CryptoService.constraints.XST_USD || 0
      })
            const btcAmount = computed(() => {
        return Number(addressInfo.value.balance) * CryptoService.constraints.XST_BTC || 0
      })

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
          transactions.value = transactions.value.concat(res);
        })
        .catch((err) => {
          return err;
        });
      mainStore
        .rpc('getaddressoutputs', [account.value.address])
        .then((res) => {
          let mappedAmounts = res.map((el) => {
            return {
              ...el,
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
      btcAmount
    };
  },
};
</script>

<style scoped>
.account-details-container {
  padding: 24px;
}
</style>
