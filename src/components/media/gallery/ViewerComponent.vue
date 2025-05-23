<template>
  <div
    class="fixed top-0 h-screen w-screen bg-white opacity-0 transition-opacity duration-1000"
    :class="{ 'opacity-100': viewer.show }"
  >
    <swiper-container v-if="!viewer.animating" :speed="250" :slides-per-view="1" class="h-full w-full" :initialSlide="mediaIndex">
      <swiper-slide v-for="(media, index) in medias" :key="index" class="flex justify-center">
        <IonImg :src="media.media" class="h-full w-full object-contain" />
      </swiper-slide>
    </swiper-container>
  </div>
</template>

<script setup lang="ts">
/* Import */
import { DBMediaWithTagsAndPath, Viewer } from '@/types'
import { IonImg } from '@ionic/vue'

/* Props */
defineProps<{
  mediaIndex: number
  medias: DBMediaWithTagsAndPath[]
  viewer: Viewer
}>()
</script>
