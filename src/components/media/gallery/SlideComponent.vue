<template>
  <swiper-slide :index="index" class="flex flex-col justify-center py-14">
    <div ref="imageRef" class="w-full transition-all duration-500 ease-in-out" :class="slideStore.showInfo ? 'h-3/5' : 'h-full'">
      <IonImg class="h-full" :src="media.media" />
    </div>

    <InfoComponent :show-info="slideStore.showInfo" :media="media" />
  </swiper-slide>
</template>

<script setup lang="ts">
/* Import */
import { useSlideStore } from '@/stores/slideStore'
import { DBMediaWithTagsAndPath } from '@/types'
import { createGesture, IonImg } from '@ionic/vue'
import { onMounted, ref } from 'vue'
import InfoComponent from '../info/InfoComponent.vue'

/* Props */
defineProps<{
  media: DBMediaWithTagsAndPath
  index: number
}>()

/* Const */
const slideStore = useSlideStore()

/* Ref */
const imageRef = ref()

/* Mounted Lifecycle Hook */
onMounted(() => {
  /* Zoom gesture */
  const doubleClickThreshold = 500
  let lastOnStart = 0 // For double click
  const zoomGesture = createGesture({
    el: imageRef.value as Node,
    gestureName: 'zoomGesture',
    threshold: 0,
    onStart: () => {
      const now = Date.now()

      if (Math.abs(now - lastOnStart) <= doubleClickThreshold) {
        imageRef.value.style.scale = slideStore.zoomed ? '1' : '2'
        slideStore.zoomed = !slideStore.zoomed
        slideStore.swiperEnabled = !slideStore.zoomed
        return
      }

      lastOnStart = now
    },
  })
  zoomGesture.enable(true)
})
</script>
