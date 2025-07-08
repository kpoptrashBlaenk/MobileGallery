<template>
  <IonPage>
    <IonTabs>
      <IonRouterOutlet></IonRouterOutlet>

      <IonTabBar id="tabBar" slot="bottom" class="border-t-1 border-gray-200">
        <IonTabButton tab="qr" href="/qr">
          <IonIcon :icon="qrCodeOutline"></IonIcon>
          <IonLabel>QR Code</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  </IonPage>
</template>

<script setup lang="ts">
/* Import */
import { handleBackButton } from '@/utils/functions'
import { IonIcon, IonLabel, IonPage, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/vue'
import { qrCodeOutline } from 'ionicons/icons'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

/* Const */
const router = useRouter()

/* Mounted Lifecycle Hook */
onMounted(() => {
  handleBackButton(2, router.back)
})
</script>
