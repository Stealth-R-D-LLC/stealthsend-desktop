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
        :has-header="hasTableHeader"
        :columns="[
          { key: 'blocktime', title: 'Time', customCellClass: 'blocktime' },
          { key: 'account', title: 'Account' },
          { key: 'label', title: 'Label' },
          { key: 'amountFiat', title: 'Amount (USD)' },
          { key: 'amount', title: 'Amount' },
          { key: 'actions', title: '', customCellClass: 'items-center' },
        ]"
      >
        <template #amount="{ item }">
          {{ item.amount > 0 ? '+' : '-' }}
          {{ formatAmount(Math.abs(item.amount)) }} XST
        </template>
        <template #label="{ item }">
          {{
            findLabelForTx(item.txid) ? findLabelForTx(item.txid) : 'No label'
          }}
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
        <template #actions="{ item }">
          <div class="icon-container">
            <svg class="icon" width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 5L6 0L0 7H3L2 12L8 5H5Z" fill="#4E00F6"/>
            </svg>
          <svg v-if="isExpanded !== item.txid" class="icon" @click="expandIcons(item.txid)" width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 1H8" stroke="#A2A1A4" stroke-width="2" stroke-linejoin="round"/>
            <path d="M0 5H12" stroke="#A2A1A4" stroke-width="2" stroke-linejoin="round"/>
            <path d="M0 9H12" stroke="#A2A1A4" stroke-width="2" stroke-linejoin="round"/>
          </svg>
          <svg @click="expandIcons(item.txid)" v-else class="icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3L15 15" stroke="#6B2AF7" stroke-width="2" stroke-linejoin="round"/>
            <path d="M3 15L15 3" stroke="#6B2AF7" stroke-width="2" stroke-linejoin="round"/>
          </svg>
          </div>
          <div class="expanded" :class="{'expanded__active': isExpanded === item.txid}">
            <svg class="icon" width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 5L6 0L0 7H3L2 12L8 5H5Z" fill="#4E00F6"/>
            </svg>
            <svg @click="openTransaction(item)" class="icon" width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 14L18 19" stroke="#6B2AF7" stroke-width="2" stroke-linejoin="round"/>
              <path d="M0 5H6" stroke="#6B2AF7" stroke-width="2" stroke-linejoin="round"/>
              <path d="M0 9H9" stroke="#6B2AF7" stroke-width="2" stroke-linejoin="round"/>
              <path d="M0 13H9" stroke="#6B2AF7" stroke-width="2" stroke-linejoin="round"/>
              <path d="M5 16.4185C5.92643 16.7935 6.9391 17 8 17C12.4183 17 16 13.4183 16 9C16 4.58172 12.4183 1 8 1C6.9391 1 5.92643 1.20651 5 1.58152" stroke="#6B2AF7" stroke-width="2"/>
            </svg>
            <svg class="icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 6.5H6" stroke="#6B2AF7" stroke-width="2" stroke-linejoin="round"/>
              <path d="M0 2.5H9" stroke="#6B2AF7" stroke-width="2" stroke-linejoin="round"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M18 4.5L7 16.5L3 18.5L2 17.5L4 13.5L15 1.5L18 4.5Z" stroke="#6B2AF7" stroke-width="2"/>
              <path d="M5 12.5L8 15.5" stroke="#6B2AF7" stroke-width="2"/>
              <path d="M13 4.5L15 6.5" stroke="#6B2AF7" stroke-width="2"/>
            </svg>
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
import { ref, computed, watch, onMounted } from 'vue';
import CryptoService from '@/services/crypto';
import { useMainStore } from '@/store';

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
    hasTableHeader: {
      type: Boolean,
      required: false,
      default: () => {
        return false;
      },
    },
  },
  setup(props) {
    const mainStore = useMainStore();
    const isExpanded = ref('')

    CryptoService.getTxWithLabels();
    const { formatBlocktime, groupBy, formatAmount } = useHelpers();
    const txs = ref([]);

    function expandIcons(txid) {
      if(isExpanded.value === txid) {
        isExpanded.value = ''
      } else {
        isExpanded.value = txid
      }
    }

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
      mainStore.SET_OFF_CANVAS_DATA(trx);
      mainStore.TOGGLE_DRAWER(true);
    }

    function findLabelForTx(tx) {
      return CryptoService.txWithLabels[tx];
    }

    onMounted(() => {
      orderTransactions({ label: 'All', value: Infinity });
    });

    watch(
      () => props.transactions,
      () => {
        orderTransactions();
      }
    );

    return {
      isExpanded,
      expandIcons,
      openTransaction,
      formatBlocktime,
      groupBy,
      formatAmount,
      filterTransactions,
      todayOrYesteday,
      XST_USD_RATE,
      txDates,
      orderTransactions,
      txs,
      findLabelForTx,
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
  font-weight: 700;
}

.blocktime {
  width: 160px;
}

.blocktime span {
  margin-left: 16px;
}

:deep .table .table__row:hover {
  background-color: #ffffff !important;
}

:deep .items-center {
  position: relative;
  text-align: center;
  width: 100px;
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  cursor: pointer;
  margin-right: 24px;
}
.icon:last-child {
  margin-right: 0;
}
.expanded {
  overflow: hidden;
  width: 0;
  position: absolute;
  display: flex;
  align-items: center;
  top: calc(50% - 15px);
  right: 50px;
  background-color: #ffffff;
  padding: 5px;
  transition: 0.3s;
}
.expanded__active {
  width: 105px;
}
</style>
