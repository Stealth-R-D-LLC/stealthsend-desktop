import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '/~/pages/dashboard.vue'
import Settings from '/~/pages/settings.vue'
import UIKit from '/~/pages/uikit.vue'

const routes = [
  {
    path: '/',
    redirect: 'Dashboard',
    pathMatch: 'full',
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
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
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
