<template>
  <div class="transactions-container">
    <div class="controls">
      <StFormItem label="Search">
        <StInput
          label="Search"
          v-model="query"
          placeholder="You may enter an Account, Address, Amount or Label"
          ><svg
            width="18"
            height="19"
            viewBox="0 0 18 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.2222 14L17 18"
              stroke="#6B2AF7"
              stroke-width="2"
              stroke-linejoin="round"
            />
            <ellipse
              cx="8.50003"
              cy="9"
              rx="6.61111"
              ry="7"
              stroke="#4E00F6"
              stroke-width="2"
            />
          </svg>
        </StInput>
      </StFormItem>
      <StFormItem label="Range">
        <date-picker
          :class="{ 'mx-datepicker__filled': date.length }"
          placeholder="Filter list using date range"
          v-model="date"
          value-type="format"
          range
          @clear="
            (clear) => {
              date = [];
            }
          "
        ></date-picker>
        <svg
          class="calendar"
          width="18"
          height="16"
          viewBox="0 0 18 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11 2H7M3 3H1V15H17V3H15"
            stroke="#4E00F6"
            stroke-width="2"
          />
          <path d="M4 7H6" stroke="#4E00F6" stroke-width="2" />
          <path d="M5 4V0" stroke="#4E00F6" stroke-width="2" />
          <path d="M13 4V0" stroke="#4E00F6" stroke-width="2" />
          <path d="M4 11H6" stroke="#4E00F6" stroke-width="2" />
          <path d="M8 7L10 7" stroke="#4E00F6" stroke-width="2" />
          <path d="M12 7L14 7" stroke="#4E00F6" stroke-width="2" />
          <path d="M8 11H10" stroke="#4E00F6" stroke-width="2" />
          <path d="M12 11H14" stroke="#4E00F6" stroke-width="2" />
        </svg>
        <!-- <svg
          class="calendar"
          width="19"
          height="19"
          viewBox="0 0 19 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.625 2.40039H7.375M3.125 3.60039H1V18.0004H18V3.60039H15.875"
            stroke="#4E00F6"
            stroke-width="2"
          />
          <path d="M4.1875 8.40039H6.3125" stroke="#4E00F6" stroke-width="2" />
          <path d="M5.25 4.8V0" stroke="#4E00F6" stroke-width="2" />
          <path d="M13.75 4.8V0" stroke="#4E00F6" stroke-width="2" />
          <path d="M4.1875 13.2002H6.3125" stroke="#4E00F6" stroke-width="2" />
          <path d="M8.4375 8.40039H10.5625" stroke="#4E00F6" stroke-width="2" />
          <path
            d="M12.6875 8.40039H14.8125"
            stroke="#4E00F6"
            stroke-width="2"
          />
          <path d="M8.4375 13.2002H10.5625" stroke="#4E00F6" stroke-width="2" />
          <path
            d="M12.6875 13.2002H14.8125"
            stroke="#4E00F6"
            stroke-width="2"
          />
        </svg> -->
      </StFormItem>
    </div>
    <TransactionList
      :transactions="computedTransactions"
      has-table-header
    ></TransactionList>
  </div>
</template>

<script>
import TransactionList from '@/components/partials/TransactionList.vue';
import CryptoService from '@/services/crypto';
import { ref, computed, onMounted, watchEffect } from 'vue';
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import isWithinInterval from 'date-fns/isWithinInterval';
import isSameDay from 'date-fns/isSameDay';
import { useMainStore } from '@/store';
import { useRoute } from 'vue-router';
import StFormItem from '@/components/elements/StFormItem.vue';

export default {
  name: 'Transactions',
  components: {
    TransactionList,
    DatePicker,
    StFormItem,
  },
  beforeRouteLeave() {
    //const mainStore = useMainStore();
    //mainStore.SET_ACTIVE_TRANSACTION_ADDRESS('')
    // called when the route that renders this component is about to
    // be navigated away from.
    // has access to `this` component instance.
  },
  beforeRouteEnter(to, from, next) {
    const mainStore = useMainStore();

    next((vm) => {
      vm.query = mainStore.activeTransactionAddress;
    });
    // called before the route that renders this component is confirmed.
    // does NOT have access to `this` component instance,
    // because it has not been created yet when this guard is called!
  },
  setup() {
    const transactions = ref([]);
    let query = ref('');
    const date = ref([]);

    const route = useRoute();
    const mainStore = useMainStore();

    onMounted(() => {
      query.value = '';

      if (route.params.address) {
        query.value = route.params.address;
      }
    });

    watchEffect(() => {
      query.value = route.params.address;
    });

    function findLabelForTx(tx) {
      return mainStore.txWithLabels[tx];
    }

    async function scanWallet() {
      const hdWallet = await CryptoService.scanWallet();
      transactions.value = hdWallet.txs;
    }

    scanWallet();

    const computedTransactions = computed(() => {
      let filtered = [...transactions.value];
      if (filtered.length === 0) return [];

      if (query && query.value.length > 0) {
        filtered = filtered.filter((el) => {
          return (
            el.account === query.value ||
            String(el.amount) === query.value ||
            el.txid === query.value ||
            findLabelForTx(el.txid) === query.value ||
            el.outputs.some(el => el.address === query.value)
          );
        });
      }

      if (date.value[0] && date.value[1]) {
        if (date.value[0] === date.value[1]) {
          // both dates in range are the same
          filtered = filtered.filter((el) => {
            let target = new Date(el.blocktime * 1000);
            return isSameDay(target, new Date(date.value[0]));
          });
        } else {
          // isWithinInterval doesnt work if the range is on the same date
          filtered = filtered.filter((el) => {
            let target = new Date(el.blocktime * 1000);
            return isWithinInterval(new Date(target), {
              start: new Date(date.value[0]),
              end: new Date(date.value[1]),
            });
          });
        }
      }
      return filtered;
    });

    return {
      transactions,
      query,
      date,
      computedTransactions,
    };
  },
};
</script>

<style scoped>
.controls {
  margin: 0 24px;
  display: grid;
  grid-template-columns: 9fr 3fr;
  grid-gap: 0 47px;
}
.st-form-item {
  margin: 40px 0 10px;
}
.calendar {
  pointer-events: none;
  position: absolute;
  bottom: calc(50% - 10px);
  right: 0;
}
</style>
