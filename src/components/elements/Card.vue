<template>
  <div class="card">
    <div class="card__inner" @click="$emit('click')">
      <div class="card-header">
        <h6 class="semi-bold">{{ account.label }}</h6>
        <svg
          class="info"
          @click.stop="toggleAccountOptions(account.label)"
          width="12"
          height="10"
          viewBox="0 0 12 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 1H8"
            stroke="#4E00F6"
            stroke-width="2"
            stroke-linejoin="round"
          />
          <path
            d="M0 5H12"
            stroke="#4E00F6"
            stroke-width="2"
            stroke-linejoin="round"
          />
          <path
            d="M0 9H12"
            stroke="#4E00F6"
            stroke-width="2"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <div class="amount-container">
        <h6 class="currency" v-if="steps">
          {{ isHiddenAmounts ? '••• XST' : steps[type].amountLeft }}
        </h6>
        <p class="medium grey" v-if="steps">
          ~
          {{ isHiddenAmounts ? '$••• USD' : steps[type].amountRight + ' USD' }}
          <svg
            v-if="account.isFavourite"
            class="star"
            width="16"
            height="14"
            viewBox="0 0 16 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 1.66667L10.2 4.6C10.3476 4.79683 10.5626 4.93233 10.8039 4.98058L14.248 5.66939L12.2 8.4C12.0702 8.5731 12 8.78363 12 9V12.523L8.37139 11.0715C8.13298 10.9762 7.86702 10.9762 7.62861 11.0715L4 12.523V9C4 8.78363 3.92982 8.5731 3.8 8.4L1.75205 5.66939L5.19612 4.98058C5.43738 4.93233 5.65238 4.79683 5.8 4.6L8 1.66667Z"
              stroke="#C3A9FB"
              stroke-width="2"
              stroke-linejoin="round"
            />
          </svg>
        </p>
      </div>
    </div>
    <transition name="fill">
      <div v-if="accountOptions === account.label" class="account-options">
        <svg
          class="close"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          @click="accountOptions = ''"
        >
          <path
            d="M3 3L15 15"
            stroke="#FAF9FC"
            stroke-width="2"
            stroke-linejoin="round"
          />
          <path
            d="M3 15L15 3"
            stroke="#FAF9FC"
            stroke-width="2"
            stroke-linejoin="round"
          />
        </svg>
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
import emitter from '@/services/emitter';

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
    const accountOptions = ref('');

    const steps = computed(() => {
      if (!props.rates) return [];
      return [
        {
          asset: 'XST',
          amountLeft: `${formatAmount(props.account.utxo, true, 2)} XST`,
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
        emitter.emit('dashboard:card-open', name);
      }
    }
    const openAccountDetails = (account) => {
      mainStore.SET_ACCOUNT_DETAILS(account);
      router.push('/account/details');
    };
    function toggleModal(modal, account) {
      mainStore.SET_ACCOUNT_DETAILS(account);
      openModal(modal);
    }
    function openModal(modal) {
      mainStore.SET_MODAL_VISIBILITY(modal, true);
    }

    emitter.on('dashboard:card-open', (name) => {
      // on open card details, close all other card details
      if (name !== accountOptions.value) {
        accountOptions.value = '';
      }
    });

    return {
      accountOptions,
      toggleAccountOptions,
      openAccountDetails,
      toggleModal,
      handleClick,
      steps,
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
</style>
