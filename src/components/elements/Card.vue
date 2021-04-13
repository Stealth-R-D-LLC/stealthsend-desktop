<template>
  <div
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
      <!-- <span class="itemu type">{{ account.isArchived  }}</span> -->
    </div>
    <div class="st-card__row">
      <span class="item amount">{{ account.utxo }} XST</span>
      <span class="item fiat">{{ amountInFiat }} EUR</span>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
<<<<<<< HEAD
const XST_USD = 0.17401; // hardcoded obviously
=======
const XST_USD = 0.226338; // hardcoded obviously
>>>>>>> develop
export default {
  name: 'StCard',
  props: {
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
  },
  emits: ['archived', 'unarchived', 'click'],
  setup(props, context) {
    const amountInFiat = computed(() => {
<<<<<<< HEAD
      return props.account.balance * XST_USD;
=======
      return +props.account.utxo * XST_USD;
>>>>>>> develop
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
    return { amountInFiat, archive, unarchive, handleClick };
  },
};
</script>

<style lang="postcss" scoped>
.st-card {
  padding: 12px 16px;
  min-width: 320px;
  height: 80px;
  background: white;
  border: 1px solid #eeeff9;
  display: inline-flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  box-shadow: 9px 10px 16px rgba(34, 3, 101, 0.1);
  margin: 10px;
  position: relative;
}

.st-card:hover {
  transition: all 0.2s ease-out;
  /* box-shadow: 0px 4px 8px rgba(38, 38, 38, 0.2);
    top: -4px;
    border: 1px solid #cccccc; */
  background-color: var(--mint50);
}

.st-card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.st-card .item.title {
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0.32px;
}
.st-card .item.type {
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0.32px;
}
.st-card .item.amount {
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.12px;
}

.st-card .archive,
.st-card .unarchive {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: pink;
  position: absolute;
  top: -8px;
  right: -8px;
  display: none;
}

.st-card:not(.st-card--is-archived):hover .archive {
  display: block;
}
.st-card:hover .unarchive {
  display: block;
}
</style>
