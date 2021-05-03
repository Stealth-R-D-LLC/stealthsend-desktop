<template>
  <div class="st-transaction-list">
    <Filters @change="orderTransactions"></Filters>
    <template v-for="date in txDates" :key="date">
      <p class="tx-date">
        <span
          v-if="
            ['TODAY', 'YESTERDAY'].includes(todayOrYesteday(date).toUpperCase())
          "
          class="relative"
        >
          {{ todayOrYesteday(date) }},
        </span>
        {{ date }}
      </p>
      <StTable
        :data="txs[date]"
        :has-header="false"
        :columns="[
          { key: 'blocktime', title: 'Time', customCellClass: 'blocktime' },
          { key: 'account', title: 'Account' },
          { key: 'amountFiat', title: 'Amount (USD)' },
          { key: 'amount', title: 'Amount' },
        ]"
        @rowClick="openTransaction"
      >
        <template #amount="{ item }">
          {{ item.amount > 0 ? '+' : '-' }}
          {{ formatAmount(Math.abs(item.amount)) }} XST
        </template>
        <template #amountFiat="{ item }">
          {{ item.amount > 0 ? '+' : '-' }}
          {{ formatAmount(Math.abs(item.amount * XST_USD_RATE), true) }} USD
        </template>
        <template #blocktime="{ item }">
          <div class="flex-center-vertical">
            <svg
              v-if="item.amount > 0"
              width="24"
              height="24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="12" fill="#D6F8F0" />
              <path d="M7 14v3h10v-3" stroke="#07AC82" stroke-width="2" />
              <path
                d="M10 11l2 2 2-2"
                stroke="#07AC82"
                stroke-width="2"
                stroke-linecap="square"
              />
              <path d="M12 6v7" stroke="#07AC82" stroke-width="2" />
            </svg>
            <svg
              v-else-if="item.amount < 0"
              width="24"
              height="24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="12" fill="#E5E4E8" />
              <path d="M7 13v3h10v-3" stroke="#8B8A8D" stroke-width="2" />
              <path
                d="M14 8l-2-2-2 2"
                stroke="#8B8A8D"
                stroke-width="2"
                stroke-linecap="square"
              />
              <path d="M12 6v7" stroke="#8B8A8D" stroke-width="2" />
            </svg>
            <span>
              {{ formatBlocktime(item.blocktime) }}
            </span>
          </div>
        </template>
      </StTable>
    </template>
  </div>
</template>

<script>
import Filters from '@/components/elements/StFilters';
import useHelpers from '@/composables/useHelpers';
import format from 'date-fns/format';
import isToday from 'date-fns/isToday';
import isYesterday from 'date-fns/isYesterday';
import fromUnixTime from 'date-fns/fromUnixTime';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { ref, computed, watch } from 'vue';
import router from '@/router';
import CryptoService from '@/services/crypto';

export default {
  name: 'StTransactionList',
  components: {
    Filters,
  },
  props: {
    transactions: {
      type: Array,
      required: true,
      default: () => {
        return [];
      },
    },
  },
  setup(props) {
    const { formatBlocktime, groupBy, formatAmount } = useHelpers();
    const txs = ref([]);

    function orderTransactions(filter) {
      // sort transactions by blocktime
      const transactionsTmp = props.transactions
        .map((el) => {
          const obj = Object.assign({}, el);
          obj['blocktimeDate'] = format(
            fromUnixTime(el['blocktime']),
            'd MMM, Y'
          );
          return obj;
        })
        .sort((a, b) => (a.blocktime < b.blocktime ? 1 : -1));
      // filter transactions based on selected filter
      let filtered = filterTransactions(filter, transactionsTmp);
      // group transactions by date
      txs.value = groupBy(filtered, 'blocktimeDate');
    }

    function filterTransactions(filter, transactions) {
      if (!filter || filter === Infinity) return transactions;
      return transactions.filter(
        (el) =>
          differenceInCalendarDays(new Date(), fromUnixTime(el.blocktime)) <
          filter.value
      );
    }

    function todayOrYesteday(date) {
      let relative = '';
      if (isToday(new Date(date))) relative = 'Today';
      if (isYesterday(new Date(date))) relative = 'Yesterday';
      return relative;
    }

    const XST_USD_RATE = computed(() => {
      return CryptoService.constraints.XST_USD || 1;
    });

    const txDates = computed(() => {
      if (txs.value.length === 0) return [];
      return Object.keys(txs.value);
    });

    function openTransaction(trx) {
      console.log('trx', trx);
      router.push(`/transaction/${trx.txid}`);
    }

    watch(() => props.transactions, () => {
        orderTransactions();
    });


    return {
      openTransaction,
      formatBlocktime,
      groupBy,
      formatAmount,
      filterTransactions,
      todayOrYesteday,
      XST_USD_RATE,
      txDates,
      orderTransactions,
      txs
    };
  },
};
</script>

<style scoped>
.st-transaction-list .tx-date {
  font-family: var(--secondary-font);
  font-style: normal;
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.12px;
  color: var(--text);
  margin: 22px 0;
}

.st-transaction-list .tx-date .relative {
  font-weight: bold;
}

.blocktime span {
  margin-left: 16px;
}

</style>
<style scoped>
.blocktime {
  width: 160px;
}
</style>
