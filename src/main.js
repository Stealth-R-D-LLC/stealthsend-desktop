import StCard from '@/components/elements/Card.vue';
import { createPinia } from 'pinia';
import {
  StAmount,
  StButton,
  StCheckbox,
  StClipboard,
  StDropdown,
  StFormItem,
  StInput,
  StLink,
  StLoading,
  StModal,
  StPagination,
  StRadio,
  StStatus,
  StSwitch,
  StTable,
  StTag,
  StTooltip,
} from 'stealthsend-frontend-components';
import { createApp } from 'vue';
import VueMultiselect from 'vue-multiselect';
import App from './App.vue';
import directives from './directives/';
import './index.css';
import router from './router';
import * as Sentry from '@sentry/vue';

const app = createApp(App);
app.use(createPinia());

// global components
app.component('StAmount', StAmount);
app.component('StSwitch', StSwitch);
app.component('StButton', StButton);
app.component('StMultiselect', VueMultiselect);
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
app.component('StFormItem', StFormItem);
// end global components

// register all directives
directives(app);

Sentry.init({
  app,
  dsn: process.env.VUE_APP_SENTRY_DSN,
  // debug: true,
  maxBreadcrumbs: 120,
});
app.use(router);
app.mount('#app');
