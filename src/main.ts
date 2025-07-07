import { createApp } from 'vue'
import App from './App.vue'
import router from './router/routes'

import { IonicVue } from '@ionic/vue'

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css'
import '@ionic/vue/css/structure.css'
import '@ionic/vue/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/display.css'
import '@ionic/vue/css/flex-utils.css'
import '@ionic/vue/css/float-elements.css'
import '@ionic/vue/css/padding.css'
import '@ionic/vue/css/text-alignment.css'
import '@ionic/vue/css/text-transformation.css'

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* @import '@ionic/vue/css/palettes/dark.always.css'; */
/* @import '@ionic/vue/css/palettes/dark.class.css'; */
import '@ionic/vue/css/palettes/dark.system.css'

/* Theme variables */
import './theme/variables.css'

/* Custom CSS */
import './main.css'

/* Swiper */
import { register } from 'swiper/element/bundle'
register()

/* Pinia */
import { createPinia } from 'pinia'
const pinia = createPinia()

const app = createApp(App)
  .use(IonicVue, {
    experimentalCloseWatcher: true,
  })
  .use(router)
  .use(pinia)

router.isReady().then(() => {
  app.mount('#app')
})
