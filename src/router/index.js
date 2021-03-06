const RpcError = () =>
  import('@/components/connection/NoStealthConnection.vue');
const ArchivedAccounts = () => import('@/views/account/archived.vue');
const AccountDetails = () => import('@/views/account/details.vue');
const Dashboard = () => import('@/views/dashboard/dashboard.vue');
const Lock = () => import('@/views/lock.vue');
const SettingsAutoLock = () => import('@/views/settings/auto-lock.vue');
const SettingsDeleteAppData = () =>
  import('@/views/settings/delete-app-data.vue');
const SettingsGeneralInformation = () =>
  import('@/views/settings/general-information.vue');
const SettingsPassword = () => import('@/views/settings/password.vue');
const SettingsPrivacyPolicy = () =>
  import('@/views/settings/privacy-policy.vue');
const SettingsRecoveryPhrase = () =>
  import('@/views/settings/recovery-phrase.vue');
const Settings = () => import('@/views/settings/settings.vue');
const SettingsTermsOfUse = () => import('@/views/settings/terms-of-use.vue');
const SettingsWebsite = () => import('@/views/settings/website.vue');
const Transactions = () => import('@/views/transactions.vue');
const Welcome = () => import('@/views/welcome.vue');
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    // redirect: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '/lock',
    name: 'Lock',
    component: Lock,
    meta: {
      layout: 'lock',
    },
  },
  {
    path: '/rpcerror',
    name: 'RpcError',
    component: RpcError,
    meta: {
      layout: 'lock',
    },
  },

  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      layout: 'default',
    },
  },
  {
    path: '/transactions/:address',
    name: 'TransactionsQuery',
    component: Transactions,
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: Transactions,
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: {
      layout: 'default',
    },
    children: [
      {
        path: 'password',
        component: SettingsPassword,
      },
      {
        path: 'recovery-phrase',
        component: SettingsRecoveryPhrase,
      },
      {
        path: 'auto-lock',
        component: SettingsAutoLock,
      },
      {
        path: 'delete-app-data',
        component: SettingsDeleteAppData,
      },
      {
        path: 'general-information',
        component: SettingsGeneralInformation,
      },
      {
        path: 'website',
        component: SettingsWebsite,
      },
      {
        path: 'privacy-policy',
        component: SettingsPrivacyPolicy,
      },
      {
        path: 'terms-of-use',
        component: SettingsTermsOfUse,
      },
    ],
  },
  {
    path: '/account/details',
    name: 'AccountDetails',
    component: AccountDetails,
    meta: {
      layout: 'single',
    },
  },
  {
    path: '/account/archived',
    name: 'ArchivedAccounts',
    component: ArchivedAccounts,
  },
  {
    path: '/welcome',
    name: 'Welcome',
    meta: {
      layout: 'new-user',
    },
    component: Welcome,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
