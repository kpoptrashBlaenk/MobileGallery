import QR from '@/components/authentication/QR.vue'
import ExtraPage from '@/views/ExtraPage.vue'
import MainPage from '@/views/MainPage.vue'
import VerificationPage from '@/views/VerificationPage.vue'
import { createRouter, createWebHistory } from '@ionic/vue-router'
import { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  { path: '/verification', name: 'verification', component: VerificationPage },
  {
    path: '/main',
    name: 'main',
    component: MainPage,
    children: [],
  },
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
