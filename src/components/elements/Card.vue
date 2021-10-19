<template>
  <div class="card" ref="card">
    <div class="card__inner" @click="$emit('click')">
      <div class="card-header">
        <h6 class="semi-bold">{{ account.label }}</h6>
        <div
          class="info-container"
          @click.stop="toggleAccountOptions(account.label)"
        >
          <SvgIcon name="icon-hamburger-menu-primary" class="info" />
        </div>
      </div>
      <div class="amount-container" v-if="steps && steps[type]">
        <h6 class="currency">
          <CountUp
            v-if="!isHiddenAmounts"
            :currency="'XST'"
            :value="steps[type].amountLeft"
          ></CountUp>
          <template v-else>'••• XST'</template>
        </h6>
        <p class="medium grey">
          ~
          {{ isHiddenAmounts ? '$••• USD' : steps[type].amountRight + ' USD' }}
          <SvgIcon
            name="icon-favorite"
            v-if="account.isFavourite"
            class="star"
          />
        </p>
      </div>
    </div>
    <transition name="fill">
      <div v-if="accountOptions === account.label" class="account-options">
        <SvgIcon name="icon-close" class="close" @click="accountOptions = ''" />
        <ul>
          <li>
            <a @click="toggleModal('send', account)">Send</a>
          </li>
          <li>
            <a @click="toggleModal('receive', account)">Receive</a>
          </li>
          <li>
            <a @click="openAccountDetails(account)">View Account</a>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useMainStore } from '@/store';
import { multiply } from 'mathjs';
import useHelpers from '@/composables/useHelpers';
import CryptoService from '@/services/crypto';
import router from '@/router';
// import emitter from '@/services/emitter';
import { onClickOutside } from '@vueuse/core';
import SvgIcon from '../partials/SvgIcon.vue';
import CountUp from '@/components/elements/StCountUp.vue';

export default {
  name: 'StCard',
  components: {
    SvgIcon,
    CountUp,
  },
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
    const accountOptions = ref('');
    const card = ref(null);

    const steps = computed(() => {
      if (!props.rates) return [];
      return [
        {
          asset: 'XST',
          amountLeft: formatAmount(props.account.utxo, false, 6, 6),
          amountRight: `$${formatAmount(
            multiply(props.account.utxo, CryptoService.constraints.XST_USD),
            false,
            4,
            4
          )}`,
          percentage: formatAmount(
            CryptoService.constraints.changePercent24Hr,
            false,
            2
          ),
        },
      ];
    });

    const handleClick = (account) => {
      context.emit('click', account);
    };
    function toggleAccountOptions(name) {
      if (accountOptions.value === name) {
        // close
        accountOptions.value = '';
      } else {
        // open
        accountOptions.value = name;
        if (name !== accountOptions.value) {
          accountOptions.value = '';
        }
      }
    }
    const openAccountDetails = (account) => {
      mainStore.SET_ACCOUNT_DETAILS(account);
      router.push('/account/details');
    };
    function toggleModal(modal, account) {
      accountOptions.value = '';
      mainStore.SET_ACCOUNT_DETAILS(account);
      openModal(modal);
    }
    function openModal(modal) {
      mainStore.SET_MODAL_VISIBILITY(modal, true);
    }

    onClickOutside(card, () => {
      accountOptions.value = '';
    });

    return {
      accountOptions,
      toggleAccountOptions,
      openAccountDetails,
      toggleModal,
      handleClick,
      steps,
      card,
      isHiddenAmounts: computed(() => mainStore.isAmountsHidden),
    };
  },
};
</script>

<style lang="postcss" scoped>
.fill-enter-active {
  animation: fill 0.7s;
}
.fill-leave-active {
  animation: fill 0.5s reverse;
}
@keyframes fill {
  0% {
    width: 0;
    height: 0;
    border-radius: 0 0 0 250px;
  }

  100% {
    width: calc(100% - 40px);
    height: calc(100% - 40px);
    border-radius: 0;
  }
}
.card + .card {
  margin-top: 10px;
}
.card:last-child {
  margin-bottom: 20px;
}
.card {
  position: relative;
  background: #fefefe;
  border: 1px solid var(--purple50);
  box-shadow: 0px 8px 24px -8px rgba(34, 3, 101, 0.1);
  border-radius: 2px;
}
.archived {
  margin-top: 64px;
}
.info-container {
  padding: 10px 12px;
  position: absolute;
  right: 8px;
  top: 10px;
}
.info path {
  transition: 0.3s;
}
.info:hover path {
  stroke: var(--marine200);
}
.info-grey path {
  transition: 0.3s;
}
.info-grey:hover path {
  stroke: var(--marine700);
}
.card__inner {
  padding: 16px 20px 24px;
  cursor: pointer;
}
.account-options {
  position: absolute;
  top: 0;
  width: calc(100% - 40px);
  right: 0;
  bottom: 0;
  padding: 12px 20px 26px;
  background-color: var(--marine800);
  border: 1px solid var(--marine700);
  border-radius: 2px;
  overflow: hidden;
}
.account-options > .close {
  position: absolute;
  right: 18px;
  top: 18px;
}
.account-options ul > li + li {
  margin-top: 12px;
}
.account-options ul > li > a {
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  color: var(--white);
  font-family: var(--secondary-font);
  font-size: 14px;
  line-height: 24px;
  transition: 0.3s;
}
.account-options ul > li > a:hover {
  color: var(--marine200);
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-header h6 {
  display: inline-block;
  width: 260px;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
}
.amount-container {
  margin-top: 18px;
}
.grey {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--grey500);
}
svg.info,
.account-options > svg {
  cursor: pointer;
}
.star {
  cursor: auto;
}
</style>
