<template>
  <IonPage>
    <IonTabs>
      <IonRouterOutlet></IonRouterOutlet>

      <IonTabBar slot="bottom" class="border-t-1 border-gray-200">
        <IonTabButton tab="qr" href="/qr">
          <IonIcon :icon="qrCodeOutline"></IonIcon>
          <IonLabel>QR Code</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  </IonPage>
</template>

<script setup lang="ts">
import { IonIcon, IonLabel, IonPage, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, IonToolbar } from '@ionic/vue'
import { qrCodeOutline } from 'ionicons/icons'
</script>
