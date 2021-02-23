import Dashboard from '@/views/dashboard.vue'
import Settings from '@/views/settings.vue'
import UIKit from '@/views/uikit.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: 'dashboard',
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
