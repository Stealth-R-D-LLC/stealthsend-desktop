<template>
  <div class="account-details-container">
    <h1>Account details</h1>
    <div class="account-details-container__top">
      <pre>
      {{ account }}
    </pre
      >
      <img :src="qrSrc" />
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
import VanillaQR from 'vanillaqr';
import Card from '@/components/elements/Card';
import TransactionList from '@/components/partials/TransactionList';
// import StCopyToClipboard from '@/components/kit/StClipboard.vue';
// import StTooltip from '@/components/kit/StTooltip.vue';
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
    const qrSrc = ref('');

    let copyPending = ref(false);
    function handleCopy() {
      copyPending.value = true;
      setTimeout(() => {
        copyPending.value = false;
      }, 2000);
    }

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
          transactions.value = transactions.value.concat(res);
        })
        .catch((err) => {
          return err;
        });

      var qr = new VanillaQR({
        url: account.value.address,
      });
      qrSrc.value = qr.toImage('png').src;
    }
    return {
      account,
      addressInfo,
      copyPending,
      handleCopy,
      qrSrc,
      openTransaction,
      transactions,
    };
  },
};
</script>

<style scoped>
.account-details-container {
  padding: 24px;
}
</style>
