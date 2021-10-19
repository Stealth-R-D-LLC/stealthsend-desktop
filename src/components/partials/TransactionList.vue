<template>
  <div class="st-transaction-list">
    <div class="overflow">
      <Filters @change="orderTransactions" @sort="orderTransactions"></Filters>
      <StSkeletonLoader v-if="isLoading" type="transactions" />
      <template v-else>
        <template v-for="date in txDates" :key="date">
          <p class="tx-date bold">{{ date }}</p>

          <StTable
            :data="txs[date]"
            :has-header="hasTableHeader"
            :columns="[
              {
                key: 'status',
                title: 'Status',
                customCellClass:
                  $route.name === 'Dashboard' ? 'status' : 'status-text',
              },
              { key: 'blocktime', title: 'Time', customCellClass: 'blocktime' },
              { key: 'account', title: 'Account' },
              { key: 'recipient', title: 'Recipient' },
              { key: 'label', title: 'Label' },
              { key: 'amountFiat', title: 'USD Value' },
              { key: 'amount', title: 'XST' },
              { key: 'actions', title: '', customCellClass: 'items-center' },
            ]"
          >
            <template #status="{ item }">
              <div class="flex-center-vertical">
                <template v-if="item.amount > 0">
                  <SvgIcon name="icon-transactions-received" />
                  <template v-if="$route.name !== 'Dashboard'"
                    >Received</template
                  >
                </template>

                <template v-else-if="item.amount <= 0">
                  <SvgIcon name="icon-transactions-sent" />
                  <template v-if="$route.name !== 'Dashboard'">Sent</template>
                </template>
              </div>
            </template>
            <template #account="{ item }">
              <div :class="{ ellipsis: isExpanded === item.index }">
                {{ item.account }}
              </div>
            </template>
            <template #recipient="{ item }">
              <div
                class="move"
                :class="{ 'move-left': isExpanded === item.index }"
              >
                <span v-if="item.amount <= 0">
                  {{
                    item.txinfo.destinations[
                      item.txinfo.destinations.length - 1
                    ] &&
                    item.txinfo.destinations[
                      item.txinfo.destinations.length - 1
                    ].addresses
                      ? item.txinfo.destinations[
                          item.txinfo.destinations.length - 1
                        ].addresses[0]
                      : '-'
                  }}
                </span>
                <span v-else>
                  {{
                    item.txinfo.sources[item.txinfo.sources.length - 1] &&
                    item.txinfo.sources[item.txinfo.sources.length - 1]
                      .addresses
                      ? item.txinfo.sources[item.txinfo.sources.length - 1]
                          .addresses[0]
                      : '-'
                  }}
                </span>
              </div>
            </template>
            <template #blocktime="{ item }">
              {{ formatBlocktime(item.txinfo.blocktime) }}
            </template>
            <template #amount="{ item }">
              <div
                class="move amount-fixed"
                :class="{ 'move-left': isExpanded === item.index }"
              >
                {{ item.amount > 0 ? '+' : '-' }}
                {{
                  isHiddenAmounts
                    ? '••• XST'
                    : `${formatAmount(Math.abs(item.amount), false, 6, 6)} XST`
                }}
              </div>
            </template>
            <template #label="{ item }">
              <div
                class="move"
                :class="{ 'move-left': isExpanded === item.index }"
              >
                {{
                  findLabelForTx(item.txid)
                    ? findLabelForTx(item.txid)
                    : 'No label'
                }}
              </div>
            </template>
            <template #amountFiat="{ item }">
              <div
                class="move amount-fixed"
                :class="{ 'move-left': isExpanded === item.index }"
              >
                {{ item.amount > 0 ? '+' : '-' }}
                <template v-if="item.amount * XST_USD_RATE < 1">
                  {{
                    isHiddenAmounts
                      ? '$••• USD'
                      : `$${formatAmount(
                          Math.abs(item.amount * XST_USD_RATE),
                          false,
                          4,
                          4
                        )} USD`
                  }}
                </template>
                <template v-else>
                  {{
                    isHiddenAmounts
                      ? '$••• USD'
                      : `$${formatAmount(
                          Math.abs(item.amount * XST_USD_RATE),
                          false,
                          4,
                          4
                        )} USD`
                  }}
                </template>
              </div>
            </template>
            <template #actions="{ item }">
              <div class="icon-container">
                <StTooltip
                  v-if="isTxFeeless(item.txinfo)"
                  tooltip="Feeless transaction"
                >
                  <SvgIcon name="icon-feeles" />
                </StTooltip>

                <SvgIcon
                  name="icon-hamburger-menu-light"
                  v-if="isExpanded !== item.index"
                  class="icon"
                  @click="expandIcons(item.index)"
                />

                <SvgIcon
                  name="icon-close-primary"
                  v-else
                  class="icon"
                  @click="expandIcons(item.index)"
                />
              </div>
              <div
                class="expanded"
                :class="{ expanded__active: isExpanded === item.index }"
              >
                <div class="expanded__inner">
                  <StTooltip
                    v-if="isTxFeeless(item.txinfo)"
                    tooltip="Feeless transaction"
                  >
                    <SvgIcon name="icon-feeles" />
                  </StTooltip>

                  <SvgIcon
                    name="icon-transaction-details"
                    class="icon-expanded"
                    @click="openTransaction(item)"
                  />

                  <SvgIcon
                    name="icon-edit"
                    class="icon-expanded"
                    @click="openTransaction(item, true)"
                  />
                </div>
              </div>
            </template>
          </StTable>
        </template>
        <h6 class="no-results" v-if="txDates.length === 0">
          No transaction data
        </h6>
      </template>
    </div>
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
import SvgIcon from '../partials/SvgIcon.vue';
import StSkeletonLoader from '@/components/loader/StSkeletonLoader.vue';
/* import emitter from '@/services/emitter'; */

export default {
  name: 'StTransactionList',
  components: {
    Filters,
    SvgIcon,
    StSkeletonLoader,
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
    const isExpanded = ref('');

    const { formatBlocktime, fil, groupBy, formatAmount } = useHelpers();
    const txs = ref([]);

    const isLoading = computed(() => {
      return mainStore.globalLoading;
    });

    function expandIcons(txid) {
      if (isExpanded.value === txid) {
        isExpanded.value = '';
      } else {
        isExpanded.value = txid;
      }
    }

    function isTxFeeless(txinfo = undefined) {
      let found = false;
      if (!txinfo) return found;
      else if (txinfo.vout) {
        found = txinfo.vout.find((el) => el.scriptPubKey.type === 'feework');
      } else if (txinfo.destinations) {
        found = txinfo.destinations.find(
          (el) => el.amount === 0 && el.type === 'feework'
        );
      }

      return !!found;
    }

    function orderTransactions(
      filter = { label: '3d', value: 3 },
      filterDirection = { label: 'All', value: '' }
    ) {
      // sort transactions by blocktime
      const transactionsTmp = props.transactions
        .map((el, index) => {
          const obj = Object.assign({}, el);
          obj['index'] = index;
          obj['blocktimeDate'] = format(
            fromUnixTime(el.txinfo['blocktime']),
            'd MMM, Y'
          );
          return obj;
        })
        .sort((a, b) => (a.blocktime < b.blocktime ? 1 : -1));
      // filter transactions based on selected filter
      let filteredDirection = filterByDirection(
        filterDirection,
        transactionsTmp
      );
      let filtered = filterByPeriod(filter, filteredDirection);
      // group transactions by date
      txs.value = groupBy(filtered, 'blocktimeDate');
    }

    function filterByDirection(direction, transactions) {
      if (!direction || direction === { label: 'All', value: '' })
        return transactions;
      return fil((el) => {
        if (direction.value === '') {
          return el;
        } else if (direction.value === 'received') {
          return el.amount > 0;
        } else if (direction.value === 'sent') {
          return el.amount < 0;
        }
      }, transactions);
    }

    function filterByPeriod(filter, transactions) {
      if (!filter?.value || filter.value.length === 0) return transactions;
      return transactions.filter(
        (el) =>
          differenceInCalendarDays(new Date(), fromUnixTime(el.blocktime)) <
          filter.value
      );
    }

    function todayOrYesterday(date) {
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

    function openTransaction(trx, isEditMode = false) {
      trx['isEditMode'] = isEditMode;
      mainStore.SET_OFF_CANVAS_DATA(trx);
      mainStore.SET_CURRENT_CANVAS('transaction-details');
      mainStore.TOGGLE_DRAWER(true);
      isExpanded.value = '';
    }

    function findLabelForTx(tx) {
      return mainStore.txWithLabels[tx];
    }

    onMounted(async () => {
      orderTransactions();
      await CryptoService.getTxWithLabels();
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
      isLoading,
      filterByDirection,
      filterByPeriod,
      todayOrYesterday,
      XST_USD_RATE,
      txDates,
      orderTransactions,
      txs,
      findLabelForTx,
      isTxFeeless,
      isHiddenAmounts: computed(() => mainStore.isAmountsHidden),
    };
  },
};
</script>

<style scoped>
.st-transaction-list {
  padding: 16px 10px 0px 28px;
  background-color: #ffffff;
}
.overflow {
  padding: 15px 14px 0 0;
  overflow: auto;
  height: calc(100vh - 256px);
}
.overflow::-webkit-scrollbar {
  width: 4px;
}
.overflow:hover::-webkit-scrollbar-thumb {
  background: var(--grey100);
}
.overflow::-webkit-scrollbar-thumb {
  background: transparent;
}
.st-transaction-list .tx-date {
  font-family: var(--secondary-font);
  font-style: normal;
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.12px;
  color: var(--text);
  margin: 32px 0 14px;
}

.st-transaction-list .tx-date .relative {
  font-weight: 700;
}

.blocktime {
  width: 160px;
}
:deep .status {
  width: 24px;
}
:deep .status-text {
  width: 106px;
}

:deep .status-text svg {
  margin-right: 16px;
}

.blocktime span {
  margin-left: 16px;
}

.amount-fixed {
  width: 168px;
  display: inline-block;
  text-align: right;
}

:deep .table .table__row:hover {
  background-color: #ffffff !important;
}

:deep .items-center {
  position: relative;
  text-align: center;
  width: 28px;
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 63px;
  max-width: 63px;
}

.icon-container svg {
  min-width: 18px;
}

:deep .tooltip {
  display: flex;
  align-items: center;
  margin-right: 28px;
}

.icon {
  cursor: pointer;
  margin-right: 24px;
}
.icon:last-child {
  margin-right: 3px;
}
.icon-active {
  margin-right: 0 !important;
}
.icon-expanded {
  cursor: pointer;
  margin-right: 24px;
}
.icon-expanded:last-child {
  margin-right: 0;
}
.expanded {
  overflow: hidden;
  width: 0;
  position: absolute;
  top: calc(50% - 15px);
  right: 35px;
  background-color: #ffffff;
  transition: 0.3s;
}
.expanded__active {
  overflow: initial;
  width: 105px;
}
.expanded__inner {
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.filter + .filter {
  margin-left: 8px;
}
.filter {
  cursor: pointer;
  padding: 6px 12px;
  background: linear-gradient(
      153.02deg,
      rgba(250, 249, 252, 0.15) 0%,
      rgba(229, 228, 232, 0.15) 83.23%
    ),
    var(--grey50);
  border: 1px solid rgba(229, 228, 232, 0.15);
  border-radius: 6px;
  font-size: 10px;
  line-height: 16px;
  letter-spacing: 0.16px;
  color: var(--grey900);
  font-family: var(--seconday-font);
  transition: 0.3s;
}
.filter:hover {
  background: linear-gradient(
      153.43deg,
      rgba(184, 183, 187, 0.15) 0%,
      rgba(229, 228, 232, 0.15) 83.33%
    ),
    var(--grey100);
  border: 1px solid rgba(207, 205, 209, 0.25);
  color: var(--marine500);
}
.no-results {
  text-align: center;
}
.ellipsis {
  width: calc(100% - 58px);
}
.move {
  transition: 0.3s;
}
.dashboard-container .ellipsis {
  width: calc(100% - 85px);
}
.dashboard-container .move-left {
  transform: translateX(-95px);
}
.move-left {
  white-space: nowrap;
  transform: translateX(-58px);
}
:deep .table tr td:first-child {
  padding: 18px 10px 18px 0;
}
:deep .table tr td:last-child {
  padding: 18px 0 18px 10px;
}
.dashboard-container .table tr td:nth-child(5) .move-left {
  transform: translateX(-50px);
}
.dashboard-container .table tr td:nth-child(6) .move,
.dashboard-container .table tr td:nth-child(7) .move {
  white-space: nowrap;
}
:deep .blocktime {
  white-space: nowrap;
}

/* Align 'USD Value' column, or third column from the end [:nth-last-child(-n + 3)], to the right */
:deep .table thead th:nth-last-child(-n + 3) {
  text-align: right;
}

:deep .table tbody td:nth-last-child(-n + 3) {
  text-align: right;
}
</style>
