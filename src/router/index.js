import ArchivedAccounts from '@/views/account/archived.vue';
import AccountDetails from '@/views/account/details.vue';
import AddressBook from '@/views/address-book.vue';
import Dashboard from '@/views/dashboard/dashboard.vue';
import Lock from '@/views/lock.vue';
import Settings from '@/views/settings/settings.vue';
import SettingsPassword from '@/views/settings/password.vue';
import SettingsRecoveryPhrase from '@/views/settings/recovery-phrase.vue';
import SettingsAutoLock from '@/views/settings/auto-lock.vue';
import SettingsFaq from '@/views/settings/faq.vue';
import SettingsMyTickets from '@/views/settings/my-tickets.vue';
import SettingsNewTicket from '@/views/settings/new-ticket.vue';
import SettingsReportABug from '@/views/settings/report-a-bug.vue';
import SettingsDesktopNotifications from '@/views/settings/desktop-notifications.vue';
import SettingsAppNotifications from '@/views/settings/app-notifications.vue';
import SettingsEmailNotifications from '@/views/settings/email-notifications.vue';
import SettingsGeneralInformation from '@/views/settings/general-information.vue';
import SettingsWebsite from '@/views/settings/website.vue';
import SettingsPrivacyPolicy from '@/views/settings/privacy-policy.vue';
import SettingsTermsOfUse from '@/views/settings/terms-of-use.vue';
import Transactions from '@/views/transactions.vue';
import UIKit from '@/views/uikit.vue';
import Welcome from '@/views/welcome.vue';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    // redirect: 'dashboard',
    pathMatch: 'full',
    // beforeEnter: (_to, _from, _next) => {
    // db.find({ name: 'wallet' }).then(docs => {
    //   console.log("DB", db)
    //   console.log("BEFORE if docs", docs)
    //   if (!docs || docs.length === 0) {
    //     console.log("EMTPY docs", docs)
    //     next('/welcome')
    //   } else {
    //     console.log("FULL docs", docs)
    //     next('/dashboard')
    //   }

    // })
    //}
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
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      layout: 'default',
    },
  },
  {
    path: '/uikit',
    name: 'UIKit',
    component: UIKit,
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
        path: 'faq',
        component: SettingsFaq,
      },
      {
        path: 'my-tickets',
        component: SettingsMyTickets,
      },
      {
        path: 'new-ticket',
        component: SettingsNewTicket,
      },
      {
        path: 'report-a-bug',
        component: SettingsReportABug,
      },
      {
        path: 'desktop-notifications',
        component: SettingsDesktopNotifications,
      },
      {
        path: 'app-notifications',
        component: SettingsAppNotifications,
      },
      {
        path: 'email-notifications',
        component: SettingsEmailNotifications,
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
    path: '/address-book',
    name: 'AddressBook',
    component: AddressBook,
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

router.beforeEach((to, from) => {
  console.log('ROUTER: ', to, from);
})

export default router;
