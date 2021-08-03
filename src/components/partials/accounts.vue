<template>
  <div class="accounts-container__inner">
    <h4 class="title">Active Accounts</h4>
    <div
      class="active-container"
      :class="{
        'active-container--no-archived': archivedAccounts.length === 0,
      }"
    >
      <div
        id="activeAccounts"
        class="accounts-container__inner--grid active-container__relative"
        :class="{ 'active-container__disabled': isDraggedInactive }"
      >
        <div
          v-for="(account, index) in activeAccounts"
          :key="account.address"
          class="card"
          :class="{ 'card-purple': account.utxo === 0 && index === 0 }"
        >
          <StModal
            v-if="accountOptions === `${account.label}_${index}`"
            :has-click-outside="false"
            light
            :visible="archiveAccountModal"
            @close="cancelArchiveActive"
            class="st-modal--container__archive-account"
          >
            <template #header>Archive Account</template>
            <template #body>
              <div class="archive-account">
                <div class="archive-account__content">
                  <div class="desc">
                    <p>
                      Archive an account if you don’t intend to use it for a
                      long time. Archived accounts are not monitored, and you
                      cannot work with them while they are archived.
                    </p>
                  </div>
                  <p>
                    The account "{{ account.label }}" will be archived and
                    available in your Archive. To activate archived accounts go
                    to your Archive, select an account and activate.
                  </p>
                </div>
              </div>
            </template>
            <template #footer>
              <div class="archive-account__actions">
                <div class="buttons">
                  <StButton type="type-b" @click="cancelArchiveActive"
                    >Cancel</StButton
                  >
                  <StButton @click="archiveAccount(account)">Archive</StButton>
                </div>
              </div>
            </template>
          </StModal>
          <div class="card__inner">
            <div class="card-header">
              <h5>{{ account.label }}</h5>
              <div class="action-icons">
                <svg
                  :class="[
                    account.utxo === 0 && index === 0 ? 'info-purple' : 'info',
                  ]"
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
                <svg
                  v-if="activeAccounts.length > 1"
                  @mousedown="isDraggedActive = true"
                  @mouseup="isDraggedActive = false"
                  class="handle"
                  width="10"
                  height="15"
                  viewBox="0 0 10 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="1.5" cy="1.5" r="1.5" fill="#A2A1A4" />
                  <circle cx="7.5" cy="1.5" r="1.5" fill="#A2A1A4" />
                  <circle cx="1.5" cy="7.5" r="1.5" fill="#A2A1A4" />
                  <circle cx="7.5" cy="7.5" r="1.5" fill="#A2A1A4" />
                  <circle cx="1.5" cy="13.5" r="1.5" fill="#A2A1A4" />
                  <circle cx="7.5" cy="13.5" r="1.5" fill="#A2A1A4" />
                </svg>
              </div>
            </div>
            <div class="amount-container">
              <p class="currency">
                {{
                  isHiddenAmounts
                    ? '•••'
                    : formatAmount(Math.abs(account.utxo), false, 6, 6)
                }}
                XST
              </p>
              <p class="grey">
                ~
                <template v-if="Number(account.utxo) * XST_USD_RATE < 1">
                  ${{
                    isHiddenAmounts
                      ? '•••'
                      : formatAmount(
                          Math.abs(account.utxo * XST_USD_RATE),
                          false,
                          4,
                          4
                        )
                  }}
                </template>
                <template v-else>
                  ${{
                    isHiddenAmounts
                      ? '•••'
                      : formatAmount(
                          Math.abs(account.utxo * XST_USD_RATE),
                          false,
                          4,
                          4
                        )
                  }}
                </template>
                USD
              </p>
            </div>
            <div class="card__footer">
              <a
                v-if="account.utxo === 0"
                @click="openReceiveModal(account)"
                :class="[
                  account.utxo === 0 && index === 0
                    ? 'link-purple'
                    : 'link-white',
                ]"
                >Receive XST</a
              >
              <a v-else-if="account.isFavourite" class="link">
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
                Favorite
              </a>
              <StTooltip class="tooltip" tooltip="Imported Account">
                <div v-if="account.isImported" class="imported" />
              </StTooltip>
            </div>
          </div>
          <transition name="fill">
            <div
              v-show="accountOptions === `${account.label}_${index}`"
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
                <li
                  v-if="
                    !account.isFavourite &&
                    accounts.filter((obj) => obj.isFavourite).length < 10 &&
                    account.utxo > 0
                  "
                >
                  <a @click="favouriteAccount(account)">Add to Favorites</a>
                </li>
                <li v-if="account.isFavourite">
                  <a @click="unfavouriteAccount(account)"
                    >Remove from Favorites</a
                  >
                </li>
                <li v-if="activeAccounts.length > 1">
                  <a @click="openArchiveAccountModal()">Archive Account</a>
                </li>
                <li>
                  <a @click="openAccountDetails(account)">View Account</a>
                </li>
                <li>
                  <a @click="openEditAccountNameModal(account)"
                    >Edit Account Name</a
                  >
                </li>
                <StModal
                  :has-click-outside="false"
                  light
                  :visible="editAccountNameModal"
                  @close="closeEditModal"
                >
                  <template #header> Account Wizard </template>
                  <template #body>
                    <StFormItem
                      :class="{
                        'st-form-item__error':
                          form.accountName.$value.length > 50,
                      }"
                      label="Account Name"
                      :filled="form.accountName.$value"
                      :error-message="form.accountName.$errors"
                    >
                      <StInput
                        v-model="form.accountName.$value"
                        placeholder="Enter Account Name"
                      ></StInput>
                      <template
                        v-if="form.accountName.$value.length > 50"
                        #description
                      >
                        <span class="error">Name too long</span>
                      </template>
                    </StFormItem>
                  </template>
                  <template #footer>
                    <StButton type="type-b" @click="closeEditModal"
                      >Cancel</StButton
                    >
                    <StButton @click="changeAccountName(account)"
                      >Save</StButton
                    >
                  </template>
                </StModal>
              </ul>
            </div>
          </transition>
        </div>
      </div>
    </div>
    <div
      class="archived-container"
      :class="{ 'archived-container__disabled': isDraggedActive }"
    >
      <h4>Archived Accounts</h4>
      <h6 v-if="!archivedAccounts.length" class="no-archived">
        No archived accounts
      </h6>
      <div
        id="archivedAccounts"
        class="accounts-container__inner--grid"
        :class="{
          'has-archived': archivedAccounts.length,
        }"
      >
        <div
          v-for="(account, index) in archivedAccounts"
          :key="account.address"
          class="card"
        >
          <StModal
            v-if="accountOptions === `${account.label}_${index}`"
            :has-click-outside="false"
            light
            :visible="activateAccountModal"
            @close="cancelArchiveActive"
            class="st-modal--container__activate-account"
          >
            <template #header>Activate Account</template>
            <template #body>
              <div class="activate-account">
                <div class="activate-account__content">
                  <p>
                    Activate and return "{{ account.label }}" to Active
                    Accounts.
                  </p>
                </div>
              </div>
            </template>
            <template #footer>
              <div class="activate-account__actions">
                <div class="buttons">
                  <StButton type="type-b" @click="cancelArchiveActive"
                    >Cancel</StButton
                  >
                  <StButton @click="activateAccount(account)"
                    >Activate</StButton
                  >
                </div>
              </div>
            </template>
          </StModal>
          <div class="card__inner">
            <div class="card-header">
              <h5>{{ account.label }}</h5>
              <div class="action-icons">
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
                <svg
                  @mousedown="isDraggedInactive = true"
                  @mouseup="isDraggedInactive = false"
                  class="handle"
                  width="10"
                  height="15"
                  viewBox="0 0 10 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="1.5" cy="1.5" r="1.5" fill="#A2A1A4" />
                  <circle cx="7.5" cy="1.5" r="1.5" fill="#A2A1A4" />
                  <circle cx="1.5" cy="7.5" r="1.5" fill="#A2A1A4" />
                  <circle cx="7.5" cy="7.5" r="1.5" fill="#A2A1A4" />
                  <circle cx="1.5" cy="13.5" r="1.5" fill="#A2A1A4" />
                  <circle cx="7.5" cy="13.5" r="1.5" fill="#A2A1A4" />
                </svg>
              </div>
            </div>
            <div class="amount-container">
              <p class="currency">
                {{
                  isHiddenAmounts
                    ? '•••'
                    : formatAmount(Math.abs(account.utxo), false, 6, 6)
                }}
                XST
              </p>
              <p class="grey">
                ~ ${{
                  isHiddenAmounts
                    ? '•••'
                    : formatAmount(
                        Math.abs(account.utxo * XST_USD_RATE),
                        false,
                        4,
                        4
                      )
                }}
                USD
              </p>
            </div>
            <StTooltip class="tooltip" tooltip="Imported Account">
              <div v-if="account.isImported" class="imported" />
            </StTooltip>
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
                  <a @click="openActivateAccountModal(account)"
                    >Activate Account</a
                  >
                </li>
                <li>
                  <a @click="openEditAccountNameModal(account)"
                    >Edit Account Name</a
                  >
                </li>
                <StModal
                  light
                  :visible="editAccountNameModal"
                  @close="closeEditModal"
                >
                  <template #header> Account Wizard </template>
                  <template #body>
                    <StFormItem
                      label="Account Name"
                      :class="{
                        'st-form-item__error':
                          form.accountName.$value.length > 50,
                      }"
                      :filled="form.accountName.$value"
                      :error-message="form.accountName.$errors"
                    >
                      <StInput
                        v-model="form.accountName.$value"
                        placeholder="Enter Account Name"
                      ></StInput>
                      <template
                        v-if="form.accountName.$value.length > 50"
                        #description
                      >
                        <span class="error">Name too long</span>
                      </template>
                    </StFormItem>
                  </template>
                  <template #footer>
                    <StButton type="type-b" @click="closeEditModal"
                      >Cancel</StButton
                    >
                    <StButton @click="changeAccountName(account)"
                      >Save</StButton
                    >
                  </template>
                </StModal>
              </ul>
            </div>
          </transition>
        </div>
      </div>
    </div>
    <div
      id="activeDropzone"
      class="active-overlay"
      :class="{ 'active-overlay__hidden': !isDraggedInactive }"
    >
      <h6>Drag and drop here to activate account</h6>
    </div>
    <div
      id="archivedDropzone"
      class="archived-overlay"
      :class="{ 'archived-overlay__hidden': !isDraggedActive }"
    >
      <h6>Drag and drop here to archive account</h6>
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue';
import { useMainStore } from '@/store';
import useHelpers from '@/composables/useHelpers';
import router from '@/router';
import CryptoService from '../../services/crypto';
import emitter from '@/services/emitter';
import { useValidation, ValidationError } from 'vue3-form-validation';
import Sortable from 'sortablejs';

export default {
  name: 'StAccounts',
  // props: {
  //   accounts: {
  //     type: Array,
  //     required: true,
  //     default: () => [],
  //   },
  // },
  emits: ['click'],
  setup() {
    const mainStore = useMainStore();
    const accountOptions = ref('');
    const accountName = ref('');
    const { formatAmount } = useHelpers();
    let editAccountNameModal = ref(false);
    let activateAccountModal = ref(false);
    let archiveAccountModal = ref(false);
    let accounts = ref([]);
    let isDraggedActive = ref(false);
    let isDraggedInactive = ref(false);

    const {
      form,
      errors, // submitting,
      validateFields,
      resetFields,
    } = useValidation({
      accountName: {
        $value: accountName,
        $rules: [
          (accountName) => {
            if (!accountName) {
              return 'Account name is required';
            }
            if (accountName.length > 50) {
              return 'Name too long';
            }
            if (accounts.value.some((el) => el.label === accountName)) {
              return 'Account name already exists';
            }
          },
        ],
      },
    });

    const activeAccounts = computed(() => {
      return accounts.value.filter((obj) => obj.isArchived === false);
    });

    const archivedAccounts = computed(() => {
      return accounts.value.filter((obj) => obj.isArchived === true);
    });

    const XST_USD_RATE = computed(() => {
      return CryptoService.constraints.XST_USD || 1;
    });

    const archivedAcc = ref(null);
    const activeAcc = ref(null);
    const activeAccOldIndex = ref(null);
    const archivedAccOldIndex = ref(null);
    let isDragged = ref(false);

    onMounted(() => {
      var elActive = document.getElementById('activeAccounts');
      var elArchived = document.getElementById('archivedAccounts');
      var elArchivedDropzone = document.getElementById('archivedDropzone');
      var elActiveDropzone = document.getElementById('activeDropzone');
      console.log('elActive: ', elActive);
      console.log('elArchived: ', elArchived);
      new Sortable(elActive, {
        group: {
          name: 'accounts',
        },
        draggagle: '.card',
        handle: '.handle',
        animation: 150,
        sort: false,
        onEnd: function (evt) {
          isDragged.value = true;
          activeAccOldIndex.value = evt.oldIndex;
          archivedAcc.value = activeAccounts.value[evt.oldIndex];
          if (evt.to === elArchivedDropzone) {
            toggleAccountOptions(
              `${activeAccounts.value[evt.oldIndex].label}_${evt.oldIndex}`
            );
            openArchiveAccountModal();
          }
          isDraggedActive.value = false;
        },
      });
      new Sortable(elArchived, {
        group: {
          name: 'accounts',
        },
        draggagle: '.card',
        handle: '.handle',
        animation: 150,
        sort: false,
        onEnd: function (evt) {
          archivedAccOldIndex.value = evt.oldIndex;
          activeAcc.value = archivedAccounts.value[evt.oldIndex];
          isDragged.value = true;
          if (evt.to === elActiveDropzone) {
            toggleAccountOptions(
              `${archivedAccounts.value[evt.oldIndex].label}_${evt.oldIndex}`
            );
            openActivateAccountModal();
          }
          isDraggedInactive.value = false;
        },
      });
      new Sortable(elArchivedDropzone, {
        group: {
          name: 'accounts',
        },
      });
      new Sortable(elActiveDropzone, {
        group: {
          name: 'accounts',
        },
      });
    });

    function cancelArchiveActive() {
      accountOptions.value = '';
      if (archiveAccountModal.value) {
        archiveAccountModal.value = false;
        if (isDragged.value) {
          activeAccounts.value.splice(activeAccOldIndex.value, 1);
          setTimeout(() => {
            activeAccounts.value.splice(
              activeAccOldIndex.value,
              0,
              archivedAcc.value
            );
            setTimeout(() => {
              isDraggedActive.value = true;
              setTimeout(() => {
                isDraggedActive.value = false;
              }, 1);
            }, 1);
          }, 50);
        }
      }
      if (activateAccountModal.value) {
        activateAccountModal.value = false;
        if (isDragged.value) {
          archivedAccounts.value.splice(archivedAccOldIndex.value, 1);
          setTimeout(() => {
            archivedAccounts.value.splice(
              archivedAccOldIndex.value,
              0,
              activeAcc.value
            );
            setTimeout(() => {
              isDraggedInactive.value = true;
              setTimeout(() => {
                isDraggedInactive.value = false;
              }, 1);
            }, 1);
          }, 50);
        }
      }
    }

    function openActivateAccountModal() {
      activateAccountModal.value = true;
    }

    function openArchiveAccountModal() {
      archiveAccountModal.value = true;
    }

    function toggleAccountOptions(name) {
      accountOptions.value = name;
    }

    function openReceiveModal(account) {
      mainStore.SET_MODAL_VISIBILITY('receive', true);
      mainStore.SET_ACCOUNT_DETAILS(account);
    }

    async function favouriteAccount(account) {
      if (account.utxo > 0) {
        await CryptoService.favouriteAccount(account);
        accountOptions.value = '';
        emitter.emit('accounts:refresh');
      } else {
        accountOptions.value = '';
      }
    }

    async function unfavouriteAccount(account) {
      await CryptoService.unfavouriteAccount(account);
      accountOptions.value = '';
      emitter.emit('accounts:refresh');
    }

    async function archiveAccount(account) {
      mainStore.START_GLOBAL_LOADING();
      if (isDragged.value) {
        archivedAccounts.value.push(archivedAcc.value);
      }
      archiveAccountModal.value = false;
      await CryptoService.archiveAccount(account);
      accountOptions.value = '';
      emitter.emit('accounts:refresh');
    }

    async function activateAccount(account) {
      mainStore.START_GLOBAL_LOADING();
      if (isDragged.value) {
        activeAccounts.value.push(activeAcc.value);
      }
      activateAccountModal.value = false;
      await CryptoService.activateAccount(account);
      accountOptions.value = '';
      emitter.emit('accounts:refresh');
    }

    async function changeAccountName(account) {
      try {
        await validateFields();
        await CryptoService.changeAccountName(account, accountName.value);
        editAccountNameModal.value = false;
        accountOptions.value = '';
      } catch (e) {
        if (e instanceof ValidationError) {
          console.log(e);
        }
      } finally {
        emitter.emit('accounts:refresh');
      }
    }

    function openEditAccountNameModal(account) {
      resetFields();
      accountName.value = account.label;
      editAccountNameModal.value = true;
    }

    const openAccountDetails = (account) => {
      mainStore.SET_ACCOUNT_DETAILS(account);

      router.push('/account/details');
    };

    async function scanWallet() {
      const hdWallet = await CryptoService.scanWallet();
      // accounts.value = hdWallet.accounts;
      let activeAccounts = hdWallet.accounts.filter(
        (obj) => obj.isArchived === false
      );

      // find first account with 0 balance
      let firstZeroAccount = null;
      for (let acc of activeAccounts) {
        if (acc.utxo === 0) {
          firstZeroAccount = acc;
          break;
        }
      }

      let tmpAccounts = [];
      if (firstZeroAccount) {
        tmpAccounts = [firstZeroAccount];
        for (let acc of hdWallet.accounts) {
          if (acc.address === firstZeroAccount.address) continue;
          tmpAccounts.push(acc);
        }
      } else {
        tmpAccounts = tmpAccounts.concat(hdWallet.accounts);
      }

      accounts.value = [...tmpAccounts];
      mainStore.STOP_GLOBAL_LOADING();
    }

    function closeEditModal() {
      accountOptions.value = '';
      editAccountNameModal.value = false;
      resetFields();
    }

    scanWallet();

    emitter.on('accounts:refresh', () => {
      scanWallet();
    });

    return {
      closeEditModal,
      // variables,
      accounts,
      activeAccounts,
      archivedAccounts,
      accountOptions,
      accountName,
      editAccountNameModal,
      archiveAccountModal,
      activateAccountModal,
      isDraggedActive,
      isDraggedInactive,

      // methods
      toggleAccountOptions,
      openAccountDetails,
      archiveAccount,
      activateAccount,
      changeAccountName,
      openEditAccountNameModal,
      openReceiveModal,
      favouriteAccount,
      unfavouriteAccount,
      openArchiveAccountModal,
      openActivateAccountModal,
      cancelArchiveActive,

      formatAmount,
      XST_USD_RATE,
      isHiddenAmounts: computed(() => mainStore.isAmountsHidden),

      form,
      errors,
      validateFields,
      resetFields,
    };
  },
};
</script>

<style scoped>
.accounts-container__inner h4,
.archived {
  font-family: var(--primary-font);
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 28px;
  letter-spacing: 0.32px;
  color: var(--grey1000);
}
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
.accounts-container__inner .title {
  background: #f4f3f6;
  padding: 24px 28px 88px;
  margin: 0 -28px 0;
}
.active-container {
  background-color: var(--background0);
  padding: 0 28px 16px;
  margin: 0 -28px;
}
.accounts-container__inner--grid {
  display: grid;
  grid-template-columns: repeat(4, 4fr);
  grid-gap: 28px 20px;
}
.active-container__relative {
  position: relative;
  top: -60px;
}
.card {
  position: relative;
  background: #fefefe;
  border: 1px solid var(--purple50);
  box-shadow: 0px 8px 24px -8px rgba(34, 3, 101, 0.1);
  border-radius: 2px;
}
.card:hover {
  z-index: 10;
}
.card-purple {
  background: var(--marine300) !important;
  border: 1px solid var(--marine400) !important;
}
.archived-container {
  margin: -45px -28px 0;
  padding: 24px 28px;
  background-color: var(--background50);
  box-sizing: border-box;
}
.archived-container__disabled,
.active-container__disabled {
  pointer-events: none;
}
.archived-container h4 {
  text-align: left;
  margin-bottom: 28px;
}
.archived-container .no-archived {
  text-align: center;
  margin-bottom: 28px;
  grid-column: span 4;
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
  padding: 18px 20px 24px;
}
.card__inner .card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  display: grid;
  grid-template-columns: 11fr auto;
  grid-gap: 0 10px;
  align-items: center;
}
.card-header h5 {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-break: break-all;
  font-family: var(--primary-font);
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.32px;
  color: var(--grey900);
}
.amount-container {
  margin: 24px 0;
}
.archive-account__actions,
.activate-account__actions {
  width: 100%;
}
.archive-account__actions .buttons,
.activate-account__actions .buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0;
}
.currency {
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.12px;
}
.archive-account .desc {
  margin-bottom: 24px;
  padding: 16px;
  background-color: var(--background100);
  border-radius: 4px;
}
.grey {
  color: var(--grey500);
  font-size: 14px;
}
.link-purple,
.link-white {
  cursor: pointer;
  display: block;
  width: fit-content;
  white-space: nowrap;
  font-size: 12px;
  line-height: 24px;
  color: var(--marine700);
  transition: 0.3s;
  letter-spacing: 0.12px;
}
.link-purple:hover {
  color: var(--white);
}
.link-white:hover {
  color: var(--marine200);
}
svg {
  cursor: pointer;
}
.link {
  display: flex;
  align-items: center;
  width: fit-content;
  font-size: 12px;
  line-height: 24px;
  color: var(--marine200);
  transition: 0.3s;
}
/* .link:hover {
  color: var(--marine700);
} */
.link svg {
  margin-right: 8px;
}
:deep .st-modal__footer {
  display: flex;
  justify-content: space-between;
}
:deep .st-modal__footer button {
  margin: 0;
}

.link {
  cursor: auto;
}
:deep .st-form-item .st-form-item__error,
.error {
  position: absolute;
  left: 0;
  right: 0;
  text-align: left;
}
.tooltip {
  position: absolute !important;
  right: 20px;
  bottom: 33px;
}
.imported {
  display: block;
  width: 6px;
  height: 6px;
  border-radius: 6px;
  background-color: var(--red400);
  /* position: absolute;
  right: 20px;
  bottom: 33px; */
}

:deep .st-modal--container__archive-account .st-modal__body {
  margin: 36px 0 65px 0;
}

:deep .st-modal--container__archive-account .st-modal-container,
:deep .st-modal--container__activate-account .st-modal-container {
  min-height: 520px;
  width: 480px;
  box-sizing: border-box;
}

:deep
  .st-modal--container__archive-account
  .st-modal-container
  .st-modal__footer,
:deep
  .st-modal--container__activate-account
  .st-modal-container
  .st-modal__footer {
  position: absolute;
  bottom: 32px;
  width: 416px;
}
.action-icons {
  display: flex;
  align-items: center;
}
.handle {
  cursor: move;
  margin-left: 24px;
}
.archived-overlay {
  border-top: 1px solid var(--marine400);
  background-color: rgba(221, 222, 242, 0.7);
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
}
.active-overlay {
  border-bottom: 1px solid var(--marine400);
  background-color: rgba(221, 222, 242, 0.7);
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
}
.archived-overlay__hidden,
.active-overlay__hidden {
  border: none;
  background-color: transparent;
  height: 0;
  overflow: hidden;
}
.archived-overlay__hidden h6,
.active-overlay__hidden h6 {
  display: none;
}
.archived-overlay h6,
.active-overlay h6 {
  position: absolute;
  z-index: 1;
}
.archived-overlay .card {
  background: transparent;
  border: none;
  box-shadow: none;
}
.archived-overlay .card__inner,
.active-overlay .card__inner {
  opacity: 0;
  height: 0;
  padding: 0;
  pointer-events: none;
}
.archived-overlay .account-options,
.active-overlay .account-options {
  opacity: 0;
}
</style>
