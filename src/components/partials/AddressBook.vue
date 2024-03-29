<template>
  <div class="address-book">
    <StModal
      light
      :visible="isScanning"
      @close="isScanning = false"
      class="scan-address__modal"
    >
      <template #header>Scan XST Address</template>
      <template #body>
        <div class="no-camera" v-show="!cameraAllowed">
          <SvgIcon name="icon-no-camera" />
          <h6>There is no connected camera</h6>
        </div>
        <div v-show="isCameraLoading" class="loading-gif">
          <img src="../../../static/xstloader.gif" alt="Test gif" />
        </div>
        <div v-show="!isCameraLoading">
          <div v-show="cameraAllowed" class="stream">
            <qr-stream @decode="onDecode" class="mb">
              <div class="frame" />
            </qr-stream>
          </div>
        </div>
      </template>
    </StModal>
    <div class="top">
      <h6 v-if="activeTab === 'address-book'">Address Book</h6>
      <h6 v-if="activeTab === 'contact-details'">Contact Details</h6>
      <h6 v-if="activeTab === 'add-contact'">Add Contact</h6>
      <h6 v-if="activeTab === 'edit-contact'">Edit Contact</h6>
      <div class="icons">
        <SvgIcon
          name="icon-add-contact"
          v-if="activeTab === 'address-book'"
          @click="changeTab('add-contact')"
        />

        <SvgIcon
          name="icon-arrow-left"
          v-if="activeTab === 'add-contact' || activeTab === 'contact-details'"
          @click="changeTab('address-book')"
        />

        <SvgIcon
          name="icon-arrow-left"
          v-if="activeTab === 'edit-contact'"
          @click="changeTab('contact-details')"
        />

        <SvgIcon name="icon-close-primary" @click="closeCanvas" />
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
        </template>
        <template v-else>
          <p>Address book is empty</p>
        </template>
      </div>
      <div v-if="addressList.length" class="alphabet">
        <SvgIcon name="icon-favorite-small" />
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
        <StFormItem label="Name" :filled="editContactForm.name" readonly>
          <StInput
            readonly
            v-model="editContactForm.name"
            placeholder="Please enter a contact name"
          />
        </StFormItem>
        <StFormItem
          label="Description"
          :filled="editContactForm.description"
          readonly
        >
          <StInput
            readonly
            v-model="editContactForm.description"
            placeholder="Please enter a description"
          />
        </StFormItem>
        <StFormItem label="Address" :filled="editContactForm.address" readonly>
          <StInput
            readonly
            v-model="editContactForm.address"
            placeholder="Please enter a valid XST address"
          />
        </StFormItem>
        <StCheckbox
          class="custom-checkbox"
          v-model="editContactForm.favorite"
          >{{
            editContactForm.favorite ? 'Favorite' : 'Add to Favorites'
          }}</StCheckbox
        >
        <p @click="viewTransactions" class="transactions">
          <SvgIcon name="icon-dashboard-transactions" />
          View Transactions
        </p>
      </div>
      <div class="add-contact__bottom">
        <p @click="editContact">
          <SvgIcon name="icon-edit" />
          Edit Contact
        </p>
        <StButton @click="openModal('send')">Send</StButton>
      </div>
    </div>

    <!-- EDIT CONTACT -->
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
          >
            <StTooltip tooltip="Scan Address">
              <SvgIcon name="icon-qr-code" @click="startScanner" />
            </StTooltip>
          </StInput>
        </StFormItem>
      </div>
      <div class="add-contact__bottom">
        <p @click="deleteContact">
          <SvgIcon name="icon-close-primary" />
          Delete Contact
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
              <SvgIcon name="icon-qr-code" @click="startScanner" />
            </StTooltip>
          </StInput>
          <template #description>
            Scan QR code or paste from clipboard
          </template>
        </StFormItem>
        <StCheckbox class="custom-checkbox" v-model="addContactForm.favorite"
          >Add to Favorites</StCheckbox
        >
      </div>
      <div class="add-contact__bottom">
        <p @click="changeTab('address-book')">
          <SvgIcon name="icon-close-primary" />
          Cancel
        </p>
        <StButton @click="addContact">Save</StButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import useHelpers from '@/composables/useHelpers';
import { useMainStore } from '@/store';
import CryptoService from '../../services/crypto';
import router from '@/router';
import { useValidation } from 'vue3-form-validation';
import { QrStream } from 'vue3-qr-reader';
import SvgIcon from '../partials/SvgIcon.vue';

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
const cameraAllowed = ref(false);
const isCameraLoading = ref(false);

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
          return addContactForm.value.address.length || 'Address is required';
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

watch(
  () => editContactForm.value.favorite,
  () => {
    confirmEdit();
  }
);

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

  const currentContact = addressBook.find((contact) => contact.id === item.id);

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
  changeTab('contact-details');
}

function formatDescriptionString(description, numOfCharacters = 35) {
  if (description.length > numOfCharacters) {
    return `${description.slice(0, numOfCharacters - 1)}...`;
  } else {
    return description;
  }
}

function startScanner() {
  navigator.mediaDevices.enumerateDevices().then((devices) => {
    let camera = devices.filter((obj) => obj.kind === 'videoinput');
    if (camera[0].kind === 'videoinput' && camera[0].label) {
      cameraAllowed.value = true;
      isCameraLoading.value = true;
      setTimeout(() => (isCameraLoading.value = false), 2000);
    } else {
      cameraAllowed.value = false;
    }
  });
  QRData.value = null;
  isScanning.value = true;
  if (activeTab.value === 'add-contact') {
    addContactForm.value.address = '';
  }
  if (activeTab.value === 'edit-contact') {
    editContactForm.value.address = '';
  }
}

function onDecode(data) {
  QRData.value = data;
  if (QRData.value) {
    isScanning.value = false;
    let address = QRData.value.replace(/[^a-z0-9]/gi, '');
    if (activeTab.value === 'add-contact') {
      addContactForm.value.address = address;
    }
    if (activeTab.value === 'edit-contact') {
      editContactForm.value.address = address;
    }
  }
}
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
:deep .custom-checkbox .st-checkbox__label {
  font-size: 12px;
  letter-spacing: 0.12px;
  line-height: 24px;
  font-family: var(--secondary-font);
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
.add-contact__bottom p :deep svg path {
  transition: 0.3s;
}
.add-contact__bottom p:hover :deep svg path {
  stroke: var(--marine200);
}
.contact-details :deep .label {
  margin-bottom: 0;
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
  height: 520px;
  box-sizing: border-box;
}
:deep .contact-details .st-input__inner {
  padding-top: 8px;
}
:deep .contact-details .st-input__inner[readonly] {
  padding-bottom: 12px;
}
:deep .contact-details .st-checkbox {
  margin-bottom: 16px;
}
.no-camera {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100% - 80px);
}
.no-camera svg {
  display: block;
  margin: 0 auto 24px;
  width: 140px;
}
.no-camera svg path {
  fill: var(--gray900);
}
.loading-gif {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.loading-gif img {
  display: block;
  height: 28px;
  position: absolute;
}
</style>
