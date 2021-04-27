<template>
  <div class="transaction-details-container">
    <pre>
    {{ tx }}
      </pre
    >
  </div>
</template>

<script>
import { useRoute } from 'vue-router';
import { ref } from 'vue';
import { useMainStore } from '@/store';

export default {
  setup() {
    const mainStore = useMainStore();

    const route = useRoute();
    const tx = ref({});

    const txid = route.params.id;
    getTx(txid);

    async function getTx(txid) {
      const res = await mainStore.rpc('gettransaction', [txid]);
      tx.value = res;
    }
    return { tx };
  },
};
</script>

<style lang="scss" scoped></style>
