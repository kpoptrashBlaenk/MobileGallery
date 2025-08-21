import QRPage from '@/components/authentication/QRPage.vue'
import GalleryPage from '@/components/media/gallery/GalleryPage.vue'
import UploadPage from '@/components/media/upload/UploadPage.vue'
import AuthPage from '@/views/auth/AuthPage.vue'
import ExtraPage from '@/views/auth/ExtraPage.vue'
import MainPage from '@/views/auth/MainPage.vue'
import GuestPage from '@/views/guest/GuestPage.vue'
import VerificationPage from '@/views/guest/VerificationPage.vue'
import OtherPage from '@/views/other/OtherPage.vue'
import { createRouter, createWebHistory } from '@ionic/vue-router'
import { RouteRecordRaw } from 'vue-router'
import authOnly from './middleware/auth'
import guestOnly from './middleware/guest'

const routes: Array<RouteRecordRaw> = [
  // Auth
  {
    path: '/auth',
    name: 'auth',
    redirect: '/gallery',
    component: AuthPage,
    beforeEnter: authOnly,
    children: [
      // Main
      {
        path: '/main',
        name: 'main',
        redirect: '/gallery',
        component: MainPage,
        children: [
          //Gallery
          { path: '/gallery', name: 'gallery', component: GalleryPage },
          // Upload
          { path: '/upload', name: 'upload', component: UploadPage },
        ],
      },

      // Extra
      {
        path: '/extra',
        name: 'extra',
        redirect: '/qr',
        component: ExtraPage,
        children: [
          // QR
          { path: '/qr', name: 'qr', component: QRPage },
        ],
      },
    ],
  },

  // Guest
  {
    path: '/guest',
    name: 'guest',
    redirect: '/verification',
    component: GuestPage,
    beforeEnter: guestOnly,
    children: [
      // Verification
      { path: '/verification', name: 'verification', component: VerificationPage },
    ],
  },

  // Other
  {
    path: '/other',
    name: 'other',
    redirect: '/main',
    component: OtherPage,
    children: [],
  },

  // Default
  { path: '/', redirect: '/gallery' },
  { path: '/:pathMatch(.*)*', redirect: '/gallery' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
