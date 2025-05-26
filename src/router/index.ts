import QRPage from '@/components/authentication/QRPage.vue'
import GalleryPage from '@/components/media/gallery/GalleryPage.vue'
import UploadPage from '@/components/media/upload/UploadPage.vue'
import ExtraPage from '@/views/ExtraPage.vue'
import MainPage from '@/views/MainPage.vue'
import VerificationPage from '@/views/VerificationPage.vue'
import { createRouter, createWebHistory } from '@ionic/vue-router'
import { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  // Default
  { path: '/', redirect: '/gallery' },

  // Main
  {
    path: '/main',
    name: 'main',
    redirect: '/gallery',
    component: MainPage,
    children: [
      { path: '/upload', name: 'upload', component: UploadPage },
      { path: '/gallery', name: 'gallery', component: GalleryPage },
    ],
  },

  // Extra
  {
    path: '/extra',
    name: 'extra',
    redirect: '/qr',
    component: ExtraPage,
    children: [{ path: '/qr', name: 'qr', component: QRPage }],
  },

  // Verification
  { path: '/verification', name: 'verification', component: VerificationPage },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
