<template>
  <IonPage>
    <IonTabs>
      <IonRouterOutlet></IonRouterOutlet>

      <IonTabBar slot="bottom" class="border-t-1 border-gray-200">
        <IonTabButton tab="gallery" href="/gallery">
          <IonIcon :icon="imagesOutline"></IonIcon>
          <IonLabel>Gallery</IonLabel>
        </IonTabButton>
        <IonTabButton tab="upload" href="/upload">
          <IonIcon :icon="cloudUploadOutline"></IonIcon>
          <IonLabel>Upload</IonLabel>
        </IonTabButton>
        <IonTabButton tab="extra" href="/extra">
          <IonIcon :icon="ellipsisHorizontalOutline"></IonIcon>
          <IonLabel>More</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  </IonPage>
</template>

<script setup lang="ts">
import { IonIcon, IonLabel, IonPage, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/vue'
import { cloudUploadOutline, ellipsisHorizontalOutline, imagesOutline } from 'ionicons/icons'
</script>
