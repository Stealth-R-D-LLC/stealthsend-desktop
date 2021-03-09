import AddAccount from '@/views/account/add.vue'
import ArchivedAccounts from '@/views/account/archived.vue'
import AccountDetails from '@/views/account/details.vue'
import Dashboard from '@/views/dashboard.vue'
import Settings from '@/views/settings.vue'
import UIKit from '@/views/uikit.vue'
import Welcome from '@/views/welcome.vue'
import { createRouter, createWebHistory } from 'vue-router'
import db from '../db'

// dump whole db
// db.remove({}, { multi: true })

async function bla() {
  let a = await db.find({}, { multi: true })
  console.log("cijela baza", a)
} 

bla()

const routes = [
  {
    path: '/',
    // redirect: 'dashboard',
    pathMatch: 'full',
    beforeEnter: (to, from, next) => {
      db.find({ name: 'wallet' }).then(docs => {
        console.log('docs', docs)
        if (!docs || docs.length === 0) {
          console.log('aj na welcome')
          next('/welcome')
        } else {
          console.log('aj na dash');
          next('/dashboard')
        }

      })
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      layout: 'default'
    }
  },
  {
    path: '/uikit',
    name: 'UIKit',
    component: UIKit
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  },
  {
    path: '/account/add',
    name: 'AddAccount',
    component: AddAccount
  },
  {
    path: '/account/details',
    name: 'AccountDetails',
    component: AccountDetails
  },
  {
    path: '/account/archived',
    name: 'ArchivedAccounts',
    component: ArchivedAccounts
  },
  {
    path: '/welcome',
    name: 'Welcome',
    meta: {
      layout: 'new-user'
    },
    component: Welcome
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
