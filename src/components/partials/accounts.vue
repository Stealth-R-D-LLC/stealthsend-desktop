<template>
  <div class="accounts-container__inner">
    <h4>Active Accounts</h4>
    <div class="accounts-container__inner--grid">
      <div
        v-for="(account, index) in activeAccounts"
        :key="account._id"
        class="card"
        :class="{ 'card-purple': account.utxo < 1 }"
      >
        <div class="card__inner">
          <div class="card-header">
            <h5>{{ account.label }}</h5>
            <svg
              :class="[account.utxo < 1 ? 'info-purple' : 'info']"
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              @click="toggleAccountOptions(`${account.label}_${index}`)"
            >
              <path
                d="M0 1H7"
                stroke="#310296"
                stroke-width="2"
                stroke-linejoin="round"
              />
              <path
                d="M0 5H10"
                stroke="#310296"
                stroke-width="2"
                stroke-linejoin="round"
              />
              <path
                d="M0 9H10"
                stroke="#310296"
                stroke-width="2"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div class="amount-container">
            <p class="currency">{{ account.utxo }} XST</p>
            <p class="grey">~ ${{ account.utxo }} USD</p>
          </div>
          <a v-if="account.utxo < 1" class="link-purple">Receive XST</a>
          <a v-else class="link">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 1.85039L9.88593 4.78659C10.0214 4.99742 10.231 5.14973 10.4734 5.21337L13.8486 6.09966L11.6389 8.80063C11.4803 8.99457 11.4002 9.24102 11.4145 9.49118L11.6147 12.9751L8.36304 11.7082C8.12956 11.6173 7.87044 11.6173 7.63696 11.7082L4.38535 12.9751L4.58545 9.49118C4.59982 9.24102 4.51975 8.99457 4.36108 8.80063L2.15137 6.09966L5.52665 5.21337C5.76901 5.14973 5.97865 4.99742 6.11407 4.78659L8 1.85039Z"
                stroke="#C3A9FB"
                stroke-width="2"
                stroke-linejoin="round"
              />
            </svg>
            Short listed
          </a>
        </div>
        <transition name="fill">
          <div
            v-if="accountOptions === `${account.label}_${index}`"
            class="account-options"
          >
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
                <a>Add to Favourites</a>
              </li>
              <li>
                <a>Archive Account</a>
              </li>
              <li>
                <a @click="openAccountDetails(account)">View Account</a>
              </li>
              <li>
                <a>Edit Account Name</a>
              </li>
            </ul>
          </div>
        </transition>
      </div>
    </div>
    <template v-if="archivedAccounts.length">
      <h4 class="archived">Archived Accounts</h4>
      <div class="accounts-container__inner--grid">
        <div
          v-for="(account, index) in archivedAccounts"
          :key="account._id"
          class="card"
        >
          <div class="card__inner">
            <div class="card-header">
              <h5>{{ account.label }}</h5>
              <svg
                class="info-grey"
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                @click="toggleAccountOptions(`${account.label}_${index}`)"
              >
                <path
                  d="M0 1H7"
                  stroke="#A2A1A4"
                  stroke-width="2"
                  stroke-linejoin="round"
                />
                <path
                  d="M0 5H10"
                  stroke="#A2A1A4"
                  stroke-width="2"
                  stroke-linejoin="round"
                />
                <path
                  d="M0 9H10"
                  stroke="#A2A1A4"
                  stroke-width="2"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div class="amount-container">
              <p class="currency">{{ account.utxo }} XST</p>
              <p class="grey">~ ${{ account.utxo }} USD</p>
            </div>
          </div>
          <transition name="fill">
            <div
              v-if="accountOptions === `${account.label}_${index}`"
              class="account-options"
            >
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
                  <a>Activate Acoount</a>
                </li>
                <li>
                  <a>Edit Account Name</a>
                </li>
              </ul>
            </div>
          </transition>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useMainStore } from '@/store';

import router from '@/router';
export default {
  name: 'StAccounts',
  props: {
    accounts: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  emits: ['click'],
  setup(props) {
    const mainStore = useMainStore();
    const accountOptions = ref('');
    const activeAccounts = computed(() => {
      return props.accounts.filter((obj) => obj.isArchived === false);
    });
    const archivedAccounts = computed(() => {
      return props.accounts.filter((obj) => obj.isArchived === true);
    });
    onMounted(() => {
      let array = props.accounts;
      array.push(
        {
          name: 'account',
          address: 'asdADasdasfaHDSdsFGREgd242323Jdsa',
          label: 'Second acc',
          isArchived: false,
          utxo: 1000,
          path: '1/0/1',
          pk: 'AdasdasfaGHSgkdsjoigjfgpmdfpogoirngfiourehgiubfusidbgbdsiu3253262opihoiu42b',
          assets: 'XST',
          _id: 'UmhkKjhlhoIH',
        },
        {
          name: 'account',
          address: 'asdADasdasfaHDSdsFGREgd242323Jdsa',
          label: 'Archived acc',
          isArchived: true,
          utxo: 1000,
          path: '1/0/1',
          pk: 'AdasdasfaGHSgkdsjoigjfgpmdfpogoirngfiourehgiubfusidbgbdsiu3253262opihoiu42b',
          assets: 'XST',
          _id: 'UmhkKjhlhoIH',
        }
      );
      console.log(props.accounts);
    });
    function toggleAccountOptions(name) {
      accountOptions.value = name;
    }
    const openAccountDetails = (account) => {
      mainStore.SET_ACCOUNT_DETAILS(account);
      router.push('/account/details');
    };
    return {
      // variables
      activeAccounts,
      archivedAccounts,
      accountOptions,

      // methods
      toggleAccountOptions,
      openAccountDetails,
    };
  },
};
</script>

<style scoped>
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
.accounts-container__inner--grid {
  margin-top: 28px;
  display: grid;
  grid-template-columns: repeat(4, 4fr);
  grid-gap: 28px 20px;
}
.card {
  position: relative;
  background: #fefefe;
  border: 1px solid var(--purple50);
  box-shadow: 0px 8px 24px -8px rgba(34, 3, 101, 0.1);
  border-radius: 2px;
}
.card-purple {
  background: var(--marine300) !important;
  border: 1px solid var(--marine400) !important;
}
.archived {
  margin-top: 64px;
}
.info-purple path {
  stroke: var(--marine700);
  transition: 0.3s;
}
.info-purple:hover path {
  stroke: var(--white);
}
.info path {
  stroke: var(--marine700);
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
.card-purple h5 {
  color: var(--grey50) !important;
}
.card-purple .grey {
  color: var(--grey50) !important;
}
.card-purple .currency {
  color: var(--grey50) !important;
}
.card__inner {
  padding: 16px 20px 24px;
}
.account-options {
  position: absolute;
  top: 0;
  width: calc(100% - 40px);
  right: 0;
  bottom: 0;
  padding: 16px 20px 24px;
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
.amount-container {
  margin-top: 22px;
  margin-bottom: 20px;
}
.currency {
  font-size: 14px;
  line-height: 24px;
}
.grey {
  color: var(--grey500);
}
.link-purple {
  display: block;
  width: fit-content;
  cursor: pointer;
  font-size: 12px;
  line-height: 24px;
  color: var(--marine700);
  transition: 0.3s;
}
.link-purple:hover {
  color: var(--white);
}
svg {
  cursor: pointer;
}
.link {
  display: flex;
  align-items: center;
  width: fit-content;
  cursor: pointer;
  font-size: 12px;
  line-height: 24px;
  color: var(--marine200);
  transition: 0.3s;
}
.link:hover {
  color: var(--marine700);
}
.link svg {
  margin-right: 8px;
}
</style>