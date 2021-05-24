<template>
  <div class="address-book">
    <div class="top">
      <span v-if="activeTab === 'address-book'" class="title"
        >Address book</span
      >
      <span v-if="activeTab === 'contact-details'" class="title"
        >Contact details</span
      >
      <span v-if="activeTab === 'add-contact'" class="title">Add contact</span>
      <span v-if="activeTab === 'edit-contact'" class="title"
        >Edit contact</span
      >
      <div class="icons">
        <svg
          v-if="activeTab === 'address-book'"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          @click="changeTab('add-contact')"
        >
          <path d="M12 13H18M15 10V16" stroke="#4E00F6" stroke-width="2" />
          <circle cx="8" cy="5" r="4" stroke="#4E00F6" stroke-width="2" />
          <path
            d="M11 9.59532C10.2091 9.22076 9.29818 9 8.3125 9C5.0625 9 9.9375 9 6.6875 9C3.4375 9 1 11.4 1 13.8C1 16.2 1 17 1 17H11"
            stroke="#4E00F6"
            stroke-width="2"
          />
        </svg>
        <svg
          v-if="activeTab === 'add-contact' || activeTab === 'contact-details'"
          width="19"
          height="14"
          viewBox="0 0 19 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          @click="changeTab('address-book')"
        >
          <path d="M2 7H19" stroke="#4E00F6" stroke-width="2" />
          <path d="M8 13L2 7L8 1" stroke="#4E00F6" stroke-width="2" />
        </svg>
        <svg
          v-if="activeTab === 'edit-contact'"
          width="19"
          height="14"
          viewBox="0 0 19 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          @click="changeTab('contact-details')"
        >
          <path d="M2 7H19" stroke="#4E00F6" stroke-width="2" />
          <path d="M8 13L2 7L8 1" stroke="#4E00F6" stroke-width="2" />
        </svg>
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          @click="closeCanvas"
        >
          <path
            d="M3 3l12 12M3 15L15 3"
            stroke="#4E00F6"
            stroke-width="2"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
    <!-- ADDRESS BOOK -->
    <div v-if="activeTab === 'address-book'" class="address-list">
      <div class="overflow-address" id="addressBook">
        <div class="favorite-list">
          <div
            class="address-list__inner"
            v-for="(item, index) in favoriteList"
            :key="index"
          >
            <p v-if="index === 0" class="bold favorite">Favorites</p>
            <div
              class="address-list__inner--redirect"
              @click="prePopulateForm(item)"
            >
              <p>
                <span class="bold medium">{{ item.name }}</span
                >, {{ item.description }}
              </p>
              <p class="medium">{{ item.address }}</p>
            </div>
          </div>
        </div>
        <div :id="id" v-for="(addressList, id) in orderByName" :key="id">
          <div
            class="address-list__inner"
            v-for="(item, index) in addressList"
            :key="item.address"
          >
            <p v-if="index === 0" class="bold letter">{{ id }}</p>
            <div
              class="address-list__inner--redirect"
              @click="prePopulateForm(item)"
            >
              <p>
                <span class="bold medium">{{ item.name }}</span
                >, {{ item.description }}
              </p>
              <p class="medium">{{ item.address }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="alphabet">
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 1.32668L7.49737 3.51153C7.5949 3.65383 7.73849 3.75816 7.90396 3.80693L10.4446 4.55586L8.82939 6.65511C8.72419 6.79183 8.66934 6.96064 8.67409 7.13308L8.74691 9.7808L6.25129 8.89335C6.08875 8.83555 5.91125 8.83555 5.74871 8.89335L3.25309 9.7808L3.32591 7.13308C3.33066 6.96064 3.27581 6.79183 3.17061 6.65511L1.55541 4.55586L4.09604 3.80693C4.26151 3.75816 4.4051 3.65383 4.50263 3.51153L6 1.32668Z"
            stroke="#4E00F6"
            stroke-width="1.5"
            stroke-linejoin="round"
          />
        </svg>
        <a
          class="letter"
          :class="{ 'letter-active': isActive === item.id }"
          v-for="item in alphabet"
          :key="item.id"
          @click="scrollToElement(item.id)"
          >{{ item.letter }}</a
        >
      </div>
    </div>
    <!-- CONTACT DETAILS -->
    <div class="contact-details" v-if="activeTab === 'contact-details'">
      <div>
        <div class="input-container">
          <StInput
            readonly
            v-model="addContactForm.name"
            label="Name"
            placeholder="Please enter a contact name"
          />
        </div>
        <div class="input-container">
          <StInput
            readonly
            v-model="addContactForm.description"
            label="Description"
            placeholder="Please enter a description"
          />
        </div>
        <div class="input-container">
          <StInput
            readonly
            v-model="addContactForm.address"
            label="Address"
            placeholder="Please enter a valid XST address"
          />
        </div>
        <StCheckbox
          class="custom-checkbox disabled-checkbox"
          v-model="addContactForm.favorite"
          >Favorite list</StCheckbox
        >
        <p class="transactions">
          <svg
            width="18"
            height="12"
            viewBox="0 0 18 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 1H18"
              stroke="#4E00F6"
              stroke-width="2"
              stroke-linejoin="round"
            />
            <path
              d="M0 1H2"
              stroke="#4E00F6"
              stroke-width="2"
              stroke-linejoin="round"
            />
            <path
              d="M4 6H18"
              stroke="#4E00F6"
              stroke-width="2"
              stroke-linejoin="round"
            />
            <path
              d="M0 6H2"
              stroke="#4E00F6"
              stroke-width="2"
              stroke-linejoin="round"
            />
            <path
              d="M4 11H18"
              stroke="#4E00F6"
              stroke-width="2"
              stroke-linejoin="round"
            />
            <path
              d="M0 11H2"
              stroke="#4E00F6"
              stroke-width="2"
              stroke-linejoin="round"
            />
          </svg>
          View transactions
        </p>
      </div>
      <div class="add-contact__bottom">
        <p @click="editContact">
          <svg
            width="20"
            height="21"
            viewBox="0 0 20 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 7H6"
              stroke="#4E00F6"
              stroke-width="2"
              stroke-linejoin="round"
            />
            <path
              d="M0 3H9"
              stroke="#4E00F6"
              stroke-width="2"
              stroke-linejoin="round"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M18 5L7 17L3 19L2 18L4 14L15 2L18 5Z"
              stroke="#4E00F6"
              stroke-width="2"
            />
            <path d="M5 13L8 16" stroke="#4E00F6" stroke-width="2" />
            <path d="M13 5L15 7" stroke="#4E00F6" stroke-width="2" />
          </svg>

          Edit contact
        </p>
        <StButton>Send</StButton>
      </div>
    </div>
    <div class="edit-contact" v-if="activeTab === 'edit-contact'">
      <div>
        <div class="input-container">
          <StInput
            v-model="editContactForm.name"
            label="Name"
            placeholder="Please enter a contact name"
          />
        </div>
        <div class="input-container">
          <StInput
            v-model="editContactForm.description"
            label="Description"
            placeholder="Please enter a description"
          />
        </div>
        <div class="input-container">
          <StInput
            v-model="editContactForm.address"
            label="Address"
            placeholder="Please enter a valid XST address"
          />
        </div>
        <StCheckbox class="custom-checkbox" v-model="editContactForm.favorite"
          >Favorite list</StCheckbox
        >
      </div>
      <div class="add-contact__bottom">
        <p>
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 3L15 15"
              stroke="#4E00F6"
              stroke-width="2"
              stroke-linejoin="round"
            />
            <path
              d="M3 15L15 3"
              stroke="#4E00F6"
              stroke-width="2"
              stroke-linejoin="round"
            />
          </svg>
          Delete conact
        </p>
        <StButton @click="confirmEdit">Save</StButton>
      </div>
    </div>
    <!-- ADD CONTACT -->
    <div class="add-contact" v-if="activeTab === 'add-contact'">
      <div>
        <div class="input-container">
          <StInput
            v-model="addContactForm.name"
            label="Name"
            placeholder="Please enter a contact name"
          />
        </div>
        <div class="input-container">
          <StInput
            v-model="addContactForm.description"
            label="Description"
            placeholder="Please enter a description"
          />
        </div>
        <div class="input-container">
          <StInput
            v-model="addContactForm.address"
            label="Address"
            placeholder="Please enter a valid XST address"
          />
        </div>
      </div>
      <div class="add-contact__bottom">
        <p @click="changeTab('address-book')">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 3L15 15"
              stroke="#4E00F6"
              stroke-width="2"
              stroke-linejoin="round"
            />
            <path
              d="M3 15L15 3"
              stroke="#4E00F6"
              stroke-width="2"
              stroke-linejoin="round"
            />
          </svg>
          Cancel
        </p>
        <StButton @click="addContact">Save</StButton>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import useHelpers from '@/composables/useHelpers';
import { useMainStore } from '@/store';
export default {
  name: 'AddressBook',
  setup() {
    const mainStore = useMainStore();
    const { groupBy } = useHelpers();
    const alphabet = ref([
      {
        id: 'A',
        letter: 'A',
      },
      {
        id: 'B',
        letter: 'B',
      },
      {
        id: 'C',
        letter: 'C',
      },
      {
        id: 'D',
        letter: 'D',
      },
      {
        id: 'E',
        letter: 'E',
      },
      {
        id: 'F',
        letter: 'F',
      },
      {
        id: 'G',
        letter: 'G',
      },
      {
        id: 'H',
        letter: 'H',
      },
      {
        id: 'I',
        letter: 'I',
      },
      {
        id: 'J',
        letter: 'J',
      },
      {
        id: 'K',
        letter: 'K',
      },
      {
        id: 'L',
        letter: 'L',
      },
      {
        id: 'M',
        letter: 'M',
      },
      {
        id: 'N',
        letter: 'N',
      },
      {
        id: 'O',
        letter: 'O',
      },
      {
        id: 'P',
        letter: 'P',
      },
      {
        id: 'Q',
        letter: 'Q',
      },
      {
        id: 'R',
        letter: 'R',
      },
      {
        id: 'S',
        letter: 'S',
      },
      {
        id: 'T',
        letter: 'T',
      },
      {
        id: 'U',
        letter: 'U',
      },
      {
        id: 'V',
        letter: 'V',
      },
      {
        id: 'W',
        letter: 'W',
      },
      {
        id: 'X',
        letter: 'X',
      },
      {
        id: 'Y',
        letter: 'Y',
      },
      {
        id: 'Z',
        letter: 'Z',
      },
      {
        id: '#',
        letter: '#',
      },
    ]);
    const addressList = ref([
      {
        name: 'Allen Lee',
        description: 'Remitance address',
        address: 'SM4AhY5SA4sYAxyYNtHLFtbGdaWyQK8frJ',
        favorite: false,
      },
      {
        name: 'Ivan Drago',
        description: 'Remitance address',
        address: 'SM4AhY5SA4sYAxyYNtHLFtbGdaWyQK8frJ',
        favorite: true,
      },
      {
        name: 'Alex Drago',
        description: 'Remitance address',
        address: 'SM4AhY5SA4sYAxyYNtHLFtbGdaWyQK8frJ',
        favorite: false,
      },
      {
        name: 'Cleo Hees',
        description: 'Remitance address',
        address: 'SM4AhY5SA4sYAxyYNtHLFtbGdaWyQK8frJ',
        favorite: false,
      },
      {
        name: 'John Doe',
        description: 'Remitance address',
        address: 'SM4AhY5SA4sYAxyYNtHLFtbGdaWyQK8frJ',
        favorite: false,
      },
      {
        name: 'Sascha Pahlke',
        description: 'Design God and Crypto Jedi',
        address: 'SM4AhY5SA4sYAxyYNtHLFtbGdaWyQK8frJ',
        favorite: false,
      },
      {
        name: 'Ivan Rimac',
        description: 'Some guy I work with',
        address: 'SM4AhY5SA4sYAxyYNtHLFtbGdaWyQK8frJ',
        favorite: false,
      },
      {
        name: 'John Smith',
        description: 'Remitance address',
        address: 'SM4AhY5SA4sYAxyYNtHLFtbGdaWyQK8frJ',
        favorite: false,
      },
      {
        name: 'Trench Mist',
        description: 'Remitance address',
        address: 'SM4AhY5SA4sYAxyYNtHLFtbGdaWyQK8frJ',
        favorite: false,
      },
    ]);
    const isActive = ref('');
    const addContactForm = ref({
      name: '',
      description: '',
      address: '',
      favorite: false,
    });
    const editContactForm = ref({
      name: '',
      description: '',
      address: '',
      favorite: false,
    });

    const activeTab = computed(() => {
      return mainStore.addressActiveTab;
    });

    const favoriteList = computed(() => {
      return addressList.value.filter((obj) => obj.favorite);
    });

    const orderByName = computed(() => {
      return groupBy(
        addressList.value.filter((obj) => !obj.favorite),
        (obj) => {
          return obj.name.charAt(0);
        }
      );
    });

    function closeCanvas() {
      mainStore.TOGGLE_DRAWER(false);
      setTimeout(() => {
        mainStore.SET_ADDRESS_ACTIVE_TAB('address-book');
        resetForm();
        mainStore.SET_CURRENT_CANVAS('transaction-details');
      }, 300);
    }

    function changeTab(tab) {
      mainStore.SET_ADDRESS_ACTIVE_TAB(tab);
      if (
        activeTab.value !== 'edit-contact' &&
        activeTab.value !== 'contact-details'
      ) {
        resetForm();
      }
    }

    function addContact() {
      addressList.value.push(addContactForm.value);
      changeTab('address-book');
    }

    function prePopulateForm(item) {
      changeTab('contact-details');
      addContactForm.value = {
        name: item.name,
        description: item.description,
        address: item.address,
        favorite: item.favorite,
      };
      editContactForm.value = item;
    }

    function scrollToElement(id) {
      var element = document.getElementById(id);
      if (element) {
        isActive.value = id;
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        });
      } else {
        isActive.value = '';
      }
    }

    function resetForm() {
      addContactForm.value = {
        name: '',
        description: '',
        address: '',
        favorite: false,
      };
    }

    function editContact() {
      changeTab('edit-contact');
    }

    function confirmEdit() {
      changeTab('address-book');
    }

    return {
      // Variables
      alphabet,
      activeTab,
      addContactForm,
      editContactForm,
      isActive,

      // Computed
      orderByName,
      favoriteList,

      // Methods
      closeCanvas,
      changeTab,
      addContact,
      prePopulateForm,
      editContact,
      confirmEdit,
      scrollToElement,
      /* toggleFavorite */
    };
  },
};
</script>

<style scoped>
.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}
.icons {
  display: flex;
  align-items: c;
}
.icons svg + svg {
  margin-left: 25px;
}
.icons svg {
  cursor: pointer;
  transition: 0.3s;
}
.icons svg path,
svg circle {
  transition: 0.3s;
}
.icons svg:hover path,
svg:hover circle {
  stroke: var(--marine200);
}
.address-list {
  display: grid;
  grid-template-columns: 11fr 13px;
  grid-gap: 0 10px;
}
.overflow-address {
  padding-right: 15px;
  height: calc(100vh - 86px);
  overflow: auto;
}
.overflow-address::-webkit-scrollbar {
  width: 4px;
}
.overflow-address::-webkit-scrollbar-thumb {
  background: var(--grey100);
}
.favorite-list .favorite {
  margin-bottom: 16px;
}
.address-book {
  height: 100%;
}
.address-list__inner {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--grey100);
}
.address-list__inner--redirect {
  cursor: pointer;
}
.address-list__inner .letter {
  margin-bottom: 16px;
}
.alphabet {
  text-align: center;
}
.alphabet .letter {
  cursor: pointer;
  display: block;
  font-weight: bold;
  font-size: 10px;
  line-height: 16px;
  color: var(--grey400);
  transition: 0.3s;
}
.alphabet .letter:hover {
  color: var(--marine500);
}
.letter-active {
  color: var(--marine500) !important;
}
/* CONTACT DETAILS */
.custom-checkbox.disabled-checkbox {
  pointer-events: none;
}
:deep .custom-checkbox.st-checkbox {
  margin-top: 24px;
  padding-left: 36px;
  font-size: 12px;
  line-height: 20px;
}
:deep .custom-checkbox .st-checkbox__checkmark {
  border-radius: 4px;
  width: 16px;
  height: 16px;
}
:deep .custom-checkbox .st-checkbox__checkmark .check {
  top: 2px;
  left: 6px;
  width: 3px;
  height: 7px;
}
.transactions {
  cursor: pointer;
  display: flex;
  align-items: center;
}
.transactions svg path {
  transition: 0.3s;
}
.transactions:hover svg path {
  stroke: var(--marine200);
}
.transactions svg {
  margin-right: 15px;
}

/* ADD CONTACT */
.add-contact,
.contact-details,
.edit-contact {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100% - 40px);
}
.add-contact__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.add-contact__bottom p {
  cursor: pointer;
  display: flex;
  align-items: center;
}
.add-contact__bottom p svg {
  margin-right: 23px;
}
.add-contact__bottom p svg path {
  transition: 0.3s;
}
.add-contact__bottom p:hover svg path {
  stroke: var(--marine200);
}
.input-container + .input-container {
  margin-top: 48px;
}
</style>
