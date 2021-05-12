import StCard from '@/components/elements/Card.vue';
import Multiselect from '@vueform/multiselect';
import { createPinia } from 'pinia';
import {
  StAmount,
  StButton,
  StCheckbox,
  StClipboard,
  StDropdown,
  StInput,
  StLink,
  StLoading,
  StModal,
  StPagination,
  StRadio,
  StStatus,
  StTable,
  StTag,
  StIcon,
  StTooltip,
} from 'stealth-kit';
import { createApp } from 'vue';
import App from './App.vue';
import directives from './directives/';
import './index.css';
import router from './router';

const app = createApp(App);
app.use(createPinia());

// global components
app.component('StAmount', StAmount);
app.component('StButton', StButton);
app.component('StMultiselect', Multiselect);
app.component('StLink', StLink);
app.component('StCheckbox', StCheckbox);
app.component('StRadio', StRadio);
app.component('StInput', StInput);
app.component('StTable', StTable);
app.component('StModal', StModal);
app.component('StTooltip', StTooltip);
app.component('StClipboard', StClipboard);
app.component('StPagination', StPagination);
app.component('StStatus', StStatus);
app.component('StDropdown', StDropdown);
app.component('StLoading', StLoading);
app.component('StCard', StCard);
app.component('StTag', StTag);
app.component('StIcon', StIcon);
// end global components

// register all directives
directives(app);

app.use(router);
app.mount('#app');
