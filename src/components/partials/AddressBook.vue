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
      <div class="overflow-address">
        <div class="favorite-list">
          <div
            class="address-list__inner"
            v-for="(item, index) in favoriteList"
            :key="index"
          >
            <p v-if="index === 0" class="bold favorite">Favorites</p>
            <div
              class="address-list__inner--redirect"
              @click="changeTab('contact-details')"
            >
              <p>
                <span class="bold medium">{{ item.name }}</span
                >, {{ item.description }}
              </p>
              <p class="medium">{{ item.address }}</p>
            </div>
          </div>
        </div>
        <div v-for="(addressList, id) in orderByName" :key="id">
          <div
            class="address-list__inner"
            v-for="(item, index) in addressList"
            :key="item.address"
          >
            <p v-if="index === 0" class="bold letter">{{ id }}</p>
            <div
              class="address-list__inner--redirect"
              @click="changeTab('contact-details')"
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
        <a class="letter" v-for="item in alphabet" :key="item.id">{{
          item.letter
        }}</a>
      </div>
    </div>
    <div class="contact-details" v-if="activeTab === 'contact-details'">
      <div>
        <div class="input-container">
          <StInput
            disabled
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
        id: 'a',
        letter: 'A',
      },
      {
        id: 'b',
        letter: 'B',
      },
      {
        id: 'c',
        letter: 'C',
      },
      {
        id: 'd',
        letter: 'D',
      },
      {
        id: 'e',
        letter: 'E',
      },
      {
        id: 'f',
        letter: 'F',
      },
      {
        id: 'g',
        letter: 'G',
      },
      {
        id: 'h',
        letter: 'H',
      },
      {
        id: 'i',
        letter: 'I',
      },
      {
        id: 'j',
        letter: 'J',
      },
      {
        id: 'k',
        letter: 'K',
      },
      {
        id: 'l',
        letter: 'L',
      },
      {
        id: 'm',
        letter: 'M',
      },
      {
        id: 'n',
        letter: 'N',
      },
      {
        id: 'o',
        letter: 'O',
      },
      {
        id: 'p',
        letter: 'P',
      },
      {
        id: 'q',
        letter: 'Q',
      },
      {
        id: 'r',
        letter: 'R',
      },
      {
        id: 's',
        letter: 'S',
      },
      {
        id: 't',
        letter: 'T',
      },
      {
        id: 'u',
        letter: 'U',
      },
      {
        id: 'v',
        letter: 'V',
      },
      {
        id: 'w',
        letter: 'W',
      },
      {
        id: 'x',
        letter: 'X',
      },
      {
        id: 'y',
        letter: 'Y',
      },
      {
        id: 'z',
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
    const addContactForm = ref({
      name: '',
      description: '',
      address: '',
      favorite: false,
    });

    const activeTab = computed(() => {
      console.log(mainStore);
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
        mainStore.SET_CURRENT_CANVAS('transaction-details');
      }, 300);
    }
    function changeTab(tab) {
      mainStore.SET_ADDRESS_ACTIVE_TAB(tab);
      resetAddContact();
    }
    function addContact() {
      addressList.value.push(addContactForm.value);
      changeTab('address-book');
    }
    function resetAddContact() {
      addContactForm.value = {
        name: '',
        description: '',
        address: '',
        favorite: false,
      };
    }
    /* function toggleFavorite(item) {
            item.favorite = !item.favorite
        } */

    return {
      // Variables
      alphabet,
      activeTab,
      addContactForm,

      // Computed
      orderByName,
      favoriteList,

      // Methods
      closeCanvas,
      changeTab,
      addContact,
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
/* CONTACT DETAILS */

/* ADD CONTACT */
.add-contact,
.contact-details {
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
.input-container {
  margin-top: 48px;
}
</style>
