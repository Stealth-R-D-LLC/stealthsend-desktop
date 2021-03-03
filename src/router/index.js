import AddAccount from '@/views/add-account.vue'
import Dashboard from '@/views/dashboard.vue'
import Settings from '@/views/settings.vue'
import UIKit from '@/views/uikit.vue'
import Welcome from '@/views/welcome.vue'
import { createRouter, createWebHistory } from 'vue-router'
import db from '../db'

// dump whole db
// db.remove({}, { multi: true }, function () {
//   console.log('db dumped');
// });

const routes = [
  {
    path: '/',
    // redirect: 'dashboard',
    pathMatch: 'full',
    beforeEnter:(to, from, next) => {
      db.find({}, (err, docs) => {
        console.log('docs', err, docs);
        if (!docs || docs.length === 0) {
          console.log('aj na welcome');
          next('/welcome')
        } else {
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
    component: UIKit,
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
  },
  {
    path: '/add-account',
    name: 'AddAccount',
    component: AddAccount,
  },
  {
    path: '/welcome',
    name: 'Welcome',
    meta: {
      layout: 'new-user'
    },
    component: Welcome,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
