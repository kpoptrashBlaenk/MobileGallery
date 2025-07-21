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
  const animationDuration = 500
  const doubleClickThreshold = 500
  let lastTap = 0
  let startY = 0
  let animating = false

  const imageGesture = createGesture({
    el: imageRef.value as Node,
    gestureName: 'imageGesture',
    direction: 'y',
    threshold: 0,

    onStart: (detail) => {
      if (!animating) {
        // Double Tap
        const now = Date.now()
        if (Math.abs(now - lastTap) <= doubleClickThreshold) {
          imageRef.value.style.scale = slideStore.zoomed ? '1' : '2'
          slideStore.zoomed = !slideStore.zoomed
          slideStore.swiperEnabled = !slideStore.zoomed
          animating = true
          setTimeout(() => (animating = false), animationDuration)
        }
        lastTap = now

        // Save starting Y
        startY = detail.currentY
      }
    },

    onMove: (detail) => {
      if (!animating) {
        const deltaY = detail.currentY - startY
        const velocityY = detail.velocityY

        // Swipe up to show info
        if (deltaY < -50 && velocityY < -0.8 && !slideStore.showInfo) {
          slideStore.startShowInfo()
          animating = true
          setTimeout(() => (animating = false), animationDuration)
        }

        // Swipe down to hide info
        if (deltaY > 50 && velocityY > 0.8 && !slideStore.showInfo) {
          slideStore.stopShowInfo()
          animating = true
          setTimeout(() => (animating = false), animationDuration)
        }
      }
    },
  })

  imageGesture.enable(true)
})
</script>
