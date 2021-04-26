import StCard from '@/components/elements/Card.vue';
import Multiselect from '@vueform/multiselect';
import {
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

  StTag, StTooltip
} from 'stealth-kit';
import { createApp } from 'vue';
import App from './App.vue';
import directives from './directives/';
import './index.css';
import router from './router';

const app = createApp(App);

// global components
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
// end global components

// register all directives
directives(app);

app.use(router);
app.mount('#app');
