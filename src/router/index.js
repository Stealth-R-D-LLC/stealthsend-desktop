import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "/~/pages/dashboard.vue";
import Settings from "/~/pages/settings.vue";

const routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;