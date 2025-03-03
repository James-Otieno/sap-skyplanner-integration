import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '@/views/Dashboard.vue';

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/inventory',
    name: 'InventorySync',
    component: () => import('@/views/InventorySync.vue')
  },
  {
    path: '/errors',
    name: 'ErrorManagement',
    component: () => import('@/views/ErrorManagement.vue')
  },
  {
    path: '/audit',
    name: 'AuditTrail',
    component: () => import('@/views/AuditTrail.vue')
  },
  {
    path: '/config',
    name: 'Configuration',
    component: () => import('@/views/Configuration.vue')
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;