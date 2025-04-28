import QR from '@/components/authentication/QR.vue'
import ExtraPage from '@/views/ExtraPage.vue'
import VerificationPage from '@/views/VerificationPage.vue'
import { createRouter, createWebHistory } from '@ionic/vue-router'
import { RouteRecordRaw } from 'vue-router'
import TabsPage from '../views/TabsPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1',
      },
      {
        path: 'tab1',
        component: () => import('@/views/Tab1Page.vue'),
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2Page.vue'),
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3Page.vue'),
      },
    ],
  },
  { path: '/verification', name: 'verification', component: VerificationPage },
  {
    path: '/extra',
    name: 'extra',
    component: ExtraPage,
    children: [{ path: '/qr', name: 'qr', component: QR }],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
