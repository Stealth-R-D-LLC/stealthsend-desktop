<template>
  <div class="address-book">
    <StModal
      light
      v-show="isScanning"
      :visible="activeTab === 'add-contact'"
      @close="isScanning = false"
      class="scan-address__modal"
    >
      <template #header>Scan Private Key</template>
      <template #body>
        <div class="stream">
          <qr-stream @decode="onDecode" class="mb">
            <div class="frame" />
          </qr-stream>
        </div>
      </template>
    </StModal>
    <div class="top">
      <h6 v-if="activeTab === 'address-book'">Address Book</h6>
      <h6 v-if="activeTab === 'contact-details'">Contact Details</h6>
      <h6 v-if="activeTab === 'add-contact'">Add Contact</h6>
      <h6 v-if="activeTab === 'edit-contact'">Edit contact</h6>
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
        <template v-if="addressList.length">
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
                <p class="address-list__description">
                  <span class="bold medium">{{
                    formatDescriptionString(item.name)
                  }}</span
                  ><span v-if="item.description"
                    >, {{ formatDescriptionString(item.description) }}</span
                  >
                </p>
                <p class="medium">
                  {{ formatDescriptionString(item.address) }}
                </p>
              </div>
            </div>
          </div>
          <div :id="id" v-for="(sublist, id) in orderByName" :key="id">
            <div
              class="address-list__inner"
              v-for="(item, index) in sublist"
              :key="item.address"
            >
              <p v-if="index === 0" class="bold letter">
                {{ id.toUpperCase() }}
              </p>
              <div
                class="address-list__inner--redirect"
                @click="prePopulateForm(item)"
              >
                <p class="address-list__description">
                  <span class="bold medium">{{
                    formatDescriptionString(item.name)
                  }}</span
                  >, {{ formatDescriptionString(item.description) }}
                </p>
                <p class="medium">
                  {{ formatDescriptionString(item.address) }}
                </p>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <p>Address book is empty</p>
        </template>
      </div>
      <div v-if="addressList.length" class="alphabet">
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
          :id="item.id"
          @click="scrollToElement(item.id)"
          >{{ item.letter }}</a
        >
      </div>
    </div>
    <!-- CONTACT DETAILS -->
    <div class="contact-details" v-if="activeTab === 'contact-details'">
      <div>
        <StFormItem label="Name" :filled="addContactForm.name" readonly>
          <StInput
            readonly
            v-model="addContactForm.name"
            placeholder="Please enter a contact name"
          />
        </StFormItem>
        <StFormItem
          label="Description"
          :filled="addContactForm.description"
          readonly
        >
          <StInput
            readonly
            v-model="addContactForm.description"
            placeholder="Please enter a description"
          />
        </StFormItem>
        <StFormItem label="Address" :filled="addContactForm.address" readonly>
          <StInput
            readonly
            v-model="addContactForm.address"
            placeholder="Please enter a valid XST address"
          />
        </StFormItem>
        <StCheckbox
          class="custom-checkbox disabled-checkbox"
          v-model="addContactForm.favorite"
          >Favorite list</StCheckbox
        >
        <p @click="viewTransactions" class="transactions">
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
        <StButton @click="openModal('send')">Send</StButton>
      </div>
    </div>
    <div class="edit-contact" v-if="activeTab === 'edit-contact'">
      <div>
        <StFormItem
          label="Name"
          :class="{ 'st-form-item__error': editContactForm.name.length > 50 }"
          :filled="editContactForm.name"
          :error-message="editForm.editName.$errors"
        >
          <StInput
            v-model="editContactForm.name"
            placeholder="Please enter a contact name"
          />
          <template v-if="editContactForm.name.length > 50" #description>
            <span class="error">Name too long</span>
          </template>
        </StFormItem>
        <StFormItem
          label="Description"
          :class="{
            'st-form-item__error': editContactForm.description.length > 50,
          }"
          :filled="editContactForm.description"
          :error-message="editForm.editDescription.$errors"
        >
          <StInput
            v-model="editContactForm.description"
            placeholder="Please enter a description"
          />
          <template v-if="editContactForm.description.length > 50" #description>
            <span class="error">Description too long</span>
          </template>
        </StFormItem>
        <StFormItem
          label="Address"
          :filled="editContactForm.address"
          :error-message="editForm.editAddress.$errors"
        >
          <StInput
            v-model="editContactForm.address"
            placeholder="Please enter a valid XST address"
          />
        </StFormItem>
        <StCheckbox class="custom-checkbox" v-model="editContactForm.favorite"
          >Favorite list</StCheckbox
        >
      </div>
      <div class="add-contact__bottom">
        <p @click="deleteContact">
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
          Delete contact
        </p>
        <StButton @click="confirmEdit">Save</StButton>
      </div>
    </div>
    <!-- ADD CONTACT -->
    <div class="add-contact" v-if="activeTab === 'add-contact'">
      <div>
        <StFormItem
          label="Name"
          :class="{ 'st-form-item__error': addContactForm.name.length > 50 }"
          :filled="addContactForm.name"
          :error-message="addForm.newName.$errors"
        >
          <StInput
            v-model="addContactForm.name"
            placeholder="Please enter a name"
          />
          <template v-if="addContactForm.name.length > 50" #description>
            <span class="error">Name too long</span>
          </template>
        </StFormItem>
        <StFormItem
          label="Description"
          :class="{
            'st-form-item__error': addContactForm.description.length > 50,
          }"
          :filled="addContactForm.description"
          :error-message="addForm.newDescription.$errors"
        >
          <StInput
            v-model="addContactForm.description"
            placeholder="Please enter a description"
          />
          <template v-if="addContactForm.description.length > 50" #description>
            <span class="error">Description too long</span>
          </template>
        </StFormItem>
        <StFormItem
          label="Address"
          :filled="addContactForm.address"
          :error-message="addForm.newAddress.$errors"
        >
          <StInput
            v-model="addContactForm.address"
            placeholder="Please enter a valid XST address"
          >
            <StTooltip tooltip="Scan Address">
              <svg
                @click="startScanner"
                width="18"
                height="18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clip-rule="evenodd"
                  d="M7 7H1V1h6v6z"
                  stroke="#E5E4E8"
                  stroke-width="2"
                />
                <path
                  d="M11 0v3h3V1h3v4M7 18v-2H4v1H1v-3M11 18v-2h3v1h3v-3M11 13H7v-2H4M10 7h8M14 9v2h3V9M1 10v2M11 9v1.636"
                  stroke="#E5E4E8"
                  stroke-width="2"
                />
              </svg>
            </StTooltip>
          </StInput>
          <template #description>
            Scan QR code or paste from clipboard
          </template>
        </StFormItem>
        <StCheckbox class="custom-checkbox" v-model="addContactForm.favorite"
          >Add to favorites</StCheckbox
        >
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
import { ref, computed, onMounted } from 'vue';
import useHelpers from '@/composables/useHelpers';
import { useMainStore } from '@/store';
import CryptoService from '../../services/crypto';
import router from '@/router';
import { useValidation } from 'vue3-form-validation';
import { QrStream } from 'vue3-qr-reader';

export default {
  name: 'AddressBook',
  components: {
    QrStream,
  },
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
    const isScanning = ref(false);
    const QRData = ref(null);
    let addressList = ref([]);
    const isActive = ref('A');
    let addContactForm = ref({
      name: '',
      description: '',
      address: '',
      favorite: false,
    });
    let editContactForm = ref({
      id: '',
      name: '',
      description: '',
      address: '',
      favorite: false,
    });

    const {
      form: addForm,
      validateFields: validateAddFields,
      resetFields: resetAddFields,
    } = useValidation({
      newName: {
        $value: addContactForm.value.name,
        $rules: [
          {
            rule: () => {
              return !addContactForm.value.name && 'Name required';
            },
          },
          {
            rule: () => {
              return addContactForm.value.name.length > 50 && 'Name too long';
            },
          },
        ],
      },
      newDescription: {
        $value: addContactForm.value.description,
        $rules: [
          {
            rule: () => {
              return (
                addContactForm.value.description.length > 50 &&
                'Description too long'
              );
            },
          },
        ],
      },
      newAddress: {
        $value: addContactForm.value.address,
        $rules: [
          {
            rule: () => {
              return (
                addContactForm.value.address.length || 'Address is required'
              );
            },
          },
          {
            rule: () => {
              return (
                CryptoService.isAddressValid(addContactForm.value.address) ||
                'Please enter a valid XST address'
              );
            },
          },
        ],
      },
    });

    const {
      form: editForm,
      validateFields: validateEditFields,
      resetFields: resetEditFields,
    } = useValidation({
      editName: {
        $value: editContactForm.value.name,
        $rules: [
          {
            rule: () => {
              return !editContactForm.value.name && 'Name required';
            },
          },
          {
            rule: () => {
              return editContactForm.value.name.length > 50 && 'Name too long';
            },
          },
        ],
      },
      editDescription: {
        $value: editContactForm.value.description,
        $rules: [
          {
            rule: () => {
              return (
                editContactForm.value.description.length > 50 &&
                'Description too long'
              );
            },
          },
        ],
      },
      editAddress: {
        $value: editContactForm.value.address,
        $rules: [
          {
            rule: () => {
              return !editContactForm.value.address && 'Address is required';
            },
          },
          {
            rule: () => {
              return (
                CryptoService.isAddressValid(editContactForm.value.address) ||
                'Please enter a valid XST address'
              );
            },
          },
        ],
      },
    });

    onMounted(async () => {
      await filterAlphabetically();
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
          return obj.name.charAt(0).toUpperCase();
        }
      );
    });
    async function filterAlphabetically() {
      const addresses = await CryptoService.getAddressBook();
      addressList.value = addresses.sort((a, b) =>
        a.name.toUpperCase() > b.name.toUpperCase()
          ? 1
          : b.name.toUpperCase() > a.name.toUpperCase()
          ? -1
          : 0
      );
    }

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
        resetAddFields();
        resetEditFields();
      }
    }

    async function addContact() {
      await validateAddFields();

      addressList.value = await CryptoService.addToAddressBook(
        addContactForm.value
      );
      await filterAlphabetically();
      changeTab('address-book');
    }

    async function deleteContact() {
      addressList.value = await CryptoService.deleteFromAddressBook(
        editContactForm.value
      );
      await filterAlphabetically();
      changeTab('address-book');
    }

    function viewTransactions() {
      resetForm();
      mainStore.TOGGLE_DRAWER(false);

      router.push(`/transactions/${editContactForm.value.address}`);

      changeTab('address-book');
    }

    async function prePopulateForm(item) {
      changeTab('contact-details');

      const addressBook = await CryptoService.getAddressBook();

      const currentContact = addressBook.find(
        (contact) => contact.id === item.id
      );

      addContactForm.value = {
        name: currentContact.name,
        description: currentContact.description,
        address: currentContact.address,
        favorite: currentContact.favorite,
      };
      editContactForm.value = currentContact;
    }

    function scrollToElement(id) {
      const element = document.getElementById(id);
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

    function openModal(modal) {
      mainStore.SET_MODAL_VISIBILITY(modal, true);
      mainStore.SET_SEND_ADDRESS(addContactForm.value.address);
      closeCanvas();
    }

    function editContact() {
      changeTab('edit-contact');
    }

    async function confirmEdit() {
      await validateEditFields();

      addressList.value = await CryptoService.updateAddressBook(
        editContactForm.value
      );
      changeTab('address-book');
    }

    function formatDescriptionString(description, numOfCharacters = 35) {
      if (description.length > numOfCharacters) {
        return `${description.slice(0, numOfCharacters - 1)}...`;
      } else {
        return description;
      }
    }

    function startScanner() {
      QRData.value = null;
      isScanning.value = true;
      addContactForm.value.address = '';
    }

    function onDecode(data) {
      QRData.value = data;
      if (QRData.value) {
        isScanning.value = false;
        let address = QRData.value.replace(/[^a-z0-9]/gi, '');
        addContactForm.value.address = address;
      }
    }

    return {
      // Variables
      alphabet,
      activeTab,
      addContactForm,
      editContactForm,
      isActive,
      addressList,
      addForm,
      editForm,
      isScanning,

      // Computed
      orderByName,
      favoriteList,

      // Methods
      closeCanvas,
      changeTab,
      addContact,
      deleteContact,
      prePopulateForm,
      editContact,
      formatDescriptionString,
      confirmEdit,
      scrollToElement,
      viewTransactions,
      openModal,
      startScanner,
      onDecode,
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
  align-items: center;
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
  position: relative;
  width: 105%;
}
.overflow-address {
  padding-right: 41px;
  height: calc(100vh - 86px);
  overflow: auto;
}
.overflow-address::-webkit-scrollbar {
  width: 4px;
}
.overflow-address:hover::-webkit-scrollbar-thumb {
  background: var(--grey100);
}
.overflow-address::-webkit-scrollbar-thumb {
  background: transparent;
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
  position: absolute;
  right: 15px;
  top: 0;
  height: 100%;
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
  width: fit-content;
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

.st-form-item {
  margin-bottom: 20px;
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
.add-contact__bottom button {
  margin: 0;
}
.add-contact__bottom p {
  cursor: pointer;
  display: flex;
  align-items: center;
}
.add-contact__bottom p svg {
  margin-right: 20px;
}
.add-contact__bottom p svg path {
  transition: 0.3s;
}
.add-contact__bottom p:hover svg path {
  stroke: var(--marine200);
}
/* .input-container + .input-container {
  margin-top: 48px;
} */
.st-button {
  padding: 5px 64px;
  min-width: 157px;
  font-family: var(--secondary-font);
}

:deep .st-form-item__readonly .label {
  color: var(--grey1000);
}

.address-list__description {
  font-size: 14px;
}
.scan-address__modal :deep .st-modal-container {
  width: 480px;
  box-sizing: border-box;
}
</style>
