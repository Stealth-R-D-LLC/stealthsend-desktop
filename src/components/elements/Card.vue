<template>
  <div
    v-if="steps.length > 0"
    class="st-card"
    :class="{ 'st-card--is-archived': account.isArchived }"
    @click="handleClick(account)"
  >
    <a
      v-if="archiveable"
      href=""
      class="archive"
      @click.prevent="archive(account)"
    ></a>
    <a
      v-if="unarchiveable"
      href=""
      class="unarchive"
      @click.prevent="unarchive(account)"
    ></a>
    <div class="st-card__row">
      <span class="item title">{{ account.label }}</span>
      <span class="itemu type"><span class="bold">XST</span>/USD</span>
    </div>
    <div class="st-card__row">
      <span class="item amount">{{
        isHiddenAmounts ? '****' : steps[type].amountLeft
      }}</span>
      <span class="item fiat">{{
        isHiddenAmounts ? '****' : steps[type].amountRight
      }}</span>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useMainStore } from '@/store';
import { multiply } from 'mathjs';
import useHelpers from '@/composables/useHelpers';

export default {
  name: 'StCard',
  props: {
    type: {
      type: Number,
      required: false,
      default: () => {
        return 0;
      },
      validator: (value) => {
        return [0, 1, 2].includes(value);
      },
    },
    unarchiveable: {
      type: Boolean,
      required: false,
      default: true,
    },
    archiveable: {
      type: Boolean,
      required: false,
      default: true,
    },
    account: {
      type: Object,
      required: true,
    },
    rates: {
      type: Object,
      required: true,
    },
  },
  emits: ['archived', 'unarchived', 'click'],
  setup(props, context) {
    const mainStore = useMainStore();
    const { formatAmount } = useHelpers();

    const steps = computed(() => {
      if (!props.rates) return [];
      // TODO: hardcoded stuff
      return [
        {
          assetA: 'XST',
          assetB: 'USD',
          amountLeft: `${formatAmount(props.account.utxo, true, 8)} XST`,
          amountRight: `$${formatAmount(
            multiply(props.account.utxo, props.rates.XST_USD, true, 2)
          )}`,
          percentage: `+100`,
        },
        {
          assetA: 'USD',
          assetB: 'XST',
          amountLeft: `$${formatAmount(
            multiply(props.account.utxo, props.rates.XST_USD, true, 2)
          )}`,
          amountRight: `${formatAmount(props.account.utxo, true, 8)} XST`,
          percentage: `+90`,
        },
        {
          assetA: 'BTC',
          assetB: 'XST',
          amountLeft: formatAmount(
            multiply(props.account.utxo, props.rates.XST_BTC),
            true,
            8
          ),
          amountRight: `${formatAmount(props.account.utxo, true, 8)} XST`,
          percentage: `+22`,
        },
      ];
    });

    const handleClick = (account) => {
      context.emit('click', account);
    };

    const archive = (account) => {
      context.emit('archived', account);
    };
    const unarchive = (account) => {
      context.emit('unarchived', account);
    };
    return {
      archive,
      unarchive,
      handleClick,
      steps,
      isHiddenAmounts: computed(() => mainStore.isAmountsHidden),
    };
  },
};
</script>

<style lang="postcss" scoped>
.st-card {
  padding: 12px 16px;
  /* min-width: 320px; */
  width: 100%;
  height: 80px;
  background: white;
  border: 1px solid #eeeff9;
  display: inline-flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  box-shadow: 0px 8px 24px -8px rgba(34, 3, 101, 0.1);
  margin: 10px 0;
  position: relative;
  cursor: pointer;
}

.st-card:hover {
  transition: all 0.2s ease-out;
  background-color: var(--background50);
  box-shadow: 0px 8px 24px -4px rgba(34, 3, 101, 0.1);
}

.st-card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.st-card .item.title {
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: 0.32px;

  width: 50%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.st-card .item.type {
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: 0.32px;
}
.st-card .item.amount {
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.12px;
  font-family: var(--secondary-font);
}
.st-card .item.fiat {
  font-family: var(--secondary-font);
}

/* .st-card .archive,
.st-card .unarchive {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: pink;
  position: absolute;
  top: -8px;
  right: -8px;
  display: none;
} */

.st-card:not(.st-card--is-archived):hover .archive {
  display: block;
}
.st-card:hover .unarchive {
  display: block;
}
</style>
