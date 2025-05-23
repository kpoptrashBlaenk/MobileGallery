<template>
  <div
    class="fixed top-0 h-screen w-screen bg-white opacity-0 transition-opacity duration-1000"
    :class="{ 'opacity-100': viewer.show }"
  >
    <!-- Swiper -->
    <swiper-container v-if="!viewer.animating" :speed="250" :slides-per-view="1" class="h-full w-full" :initialSlide="mediaIndex">
      <swiper-slide v-for="(media, index) in medias" :key="index" class="flex justify-center">
        <IonImg :src="media.media" class="h-full w-full object-contain" />
      </swiper-slide>
    </swiper-container>

    <IonTabBar slot="bottom" class="absolute bottom-0 z-50 w-full gap-5 border-t-1 border-gray-200 bg-white">
      <IonButton fill="clear" shape="round" size="large" color="dark">
        <IonIcon :icon="syncOutline" slot="icon-only"></IonIcon>
      </IonButton>
      <IonButton fill="clear" shape="round" size="large" color="dark">
        <IonIcon :icon="informationCircleOutline" slot="icon-only"></IonIcon>
      </IonButton>
      <IonButton fill="clear" shape="round" size="large" color="dark">
        <IonIcon :icon="pencilOutline" slot="icon-only"></IonIcon>
      </IonButton>
      <IonButton fill="clear" shape="round" size="large" color="dark">
        <IonIcon :icon="downloadOutline" slot="icon-only"></IonIcon>
      </IonButton>
      <IonButton fill="clear" shape="round" size="large" color="dark">
        <IonIcon :icon="trashOutline" slot="icon-only"></IonIcon>
      </IonButton>
    </IonTabBar>
  </div>
</template>

<script setup lang="ts">
/* Import */
import { DBMediaWithTagsAndPath, Viewer } from '@/types'
import { IonButton, IonIcon, IonImg, IonTabBar } from '@ionic/vue'
import { downloadOutline, informationCircleOutline, pencilOutline, syncOutline, trashOutline } from 'ionicons/icons'
import { onMounted, onUnmounted } from 'vue'

/* Props */
defineProps<{
  mediaIndex: number
  medias: DBMediaWithTagsAndPath[]
  viewer: Viewer
}>()

/* Mounted Lifecycle Hook */
onMounted(() => {
  const ionTabBar = document.querySelectorAll('ion-tab-bar')
  ionTabBar[1]!.style.display = 'none'
})

onUnmounted(() => {
  const ionTabBar = document.querySelectorAll('ion-tab-bar')
  ionTabBar[1]!.style.display = 'block'
})
</script>
