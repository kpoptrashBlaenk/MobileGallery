<template>
  <swiper-slide :index="index" class="flex flex-col justify-center py-14">
    <div
      ref="imageRef"
      class="w-full"
      :class="{
        'h-3/5': slideStore.showInfo,
        'h-full': !slideStore.showInfo,
        'transition-all duration-500 ease-in-out': cssAnimation,
      }"
      :style="{ transform: `translate(${panX}px, ${panY}px)` }"
    >
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
const cssAnimation = ref<boolean>(true)
const panX = ref<number>(0)
const panY = ref<number>(0)

/* Mounted Lifecycle Hook */
onMounted(() => {
  const animationDuration = 500
  const doubleClickThreshold = 500
  let lastTap = 0
  let animating = false
  let startX = 0
  let startY = 0

  const imageGesture = createGesture({
    el: imageRef.value as Node,
    gestureName: 'imageGesture',
    direction: 'y',
    threshold: 0,

    canStart: () => !animating,

    onStart: () => {
      if (!slideStore.showInfo) {
        // Double Tap
        const now = Date.now()
        if (Math.abs(now - lastTap) <= doubleClickThreshold) {
          if (slideStore.zoomed) cssAnimation.value = true // Add css before zoom out
          imageRef.value.style.scale = slideStore.zoomed ? '1' : '2' // Zoom out/in
          slideStore.zoomed = !slideStore.zoomed
          slideStore.swiperEnabled = !slideStore.zoomed // Swiper enable/disable
          animating = true // Prevent gestures
          // Reset position
          panX.value = 0
          panY.value = 0
          setTimeout(() => {
            animating = false // Add gestures
            if (slideStore.zoomed) cssAnimation.value = false // Remove css after zoom in
          }, animationDuration)
        }
        lastTap = now

        startX = panX.value
        startY = panY.value
      }
    },

    onMove: (detail) => {
      if (!slideStore.zoomed) {
        // Swipe
        const deltaY = detail.currentY - detail.startY
        const velocityY = detail.velocityY

        // Swipe up to show info
        if (deltaY < -50 && velocityY < -0.8) {
          slideStore.startShowInfo()
          animating = true
          setTimeout(() => (animating = false), animationDuration)
        }

        // Swipe down to hide info
        if (deltaY > 50 && velocityY > 0.8) {
          slideStore.stopShowInfo()
          animating = true
          setTimeout(() => (animating = false), animationDuration)
        }
        return
      }

      // Pan
      panX.value = startX + detail.deltaX
      panY.value = startY + detail.deltaY
    },
  })

  imageGesture.enable(true)
})
</script>
