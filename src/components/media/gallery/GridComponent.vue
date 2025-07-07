<template>
  <!-- Viewer Layer -->
  <Transition name="fade">
    <ViewerComponent v-if="viewer.show" :mediaIndex="mediaIndex" :viewer="viewer" />
  </Transition>

  <!-- Gallery Grid -->
  <div id="galleryGrid" class="grid grid-cols-3 place-items-center gap-2 p-5">
    <div v-for="(media, index) in mediaStore.medias" :key="index" :index = index class="aspect-square w-full">
      <IonImg
        :src="media.media"
        class="h-full w-full cursor-pointer border-1 border-gray-300 object-cover"
        @click="openViewer($event, index)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
/* Import */
import { useMediaStore } from '@/stores/mediaStore'
import { Viewer } from '@/types'
import { IonImg } from '@ionic/vue'
import { ref } from 'vue'
import ViewerComponent from './ViewerComponent.vue'

/* Const */
const mediaStore = useMediaStore()

/* Ref */
const mediaIndex = ref<number>(0)
const viewer = ref<Viewer>({
  animating: false,
  show: false,
})

/* DOM Manipulation */
function openViewer(event: CustomEvent, index: number): void {
  // Open viewer
  viewer.value.show = true
  viewer.value.animating = true
  mediaIndex.value = index

  // Copy image (not ion image because custom elements are different)
  const ionImageElement = event.target as HTMLIonImgElement
  const imageElement = ionImageElement.shadowRoot?.querySelector('img') as HTMLImageElement
  const cloneImage = imageElement.cloneNode(true) as HTMLImageElement

  // Set classes
  cloneImage.classList.remove('object-cover')
  cloneImage.classList.add('max-w-full', 'max-h-full', 'object-contain', 'block', 'mx-auto', 'my-auto', 'absolute')

  // Append clone
  const page = document.querySelector('.ion-page') as HTMLDivElement
  page.append(cloneImage)

  // Get original position and size
  const originalRect = imageElement.getBoundingClientRect()

  // Place clone on top of original image
  cloneImage.style.top = `${originalRect.y}px`
  cloneImage.style.left = `${originalRect.x}px`
  cloneImage.style.height = `${originalRect.height}px`
  cloneImage.style.width = `${originalRect.width}px`
  cloneImage.style.transition = 'all 300ms ease-in-out'

  // Calculate new position and size
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  const naturalAspectRatio = imageElement.naturalWidth / imageElement.naturalHeight

  let finalWidth = viewportWidth
  let finalHeight = finalWidth / naturalAspectRatio

  if (finalHeight > viewportHeight) {
    finalHeight = viewportHeight
    finalWidth = finalHeight * naturalAspectRatio
  }

  const finalLeft = (viewportWidth - finalWidth) / 2
  const finalTop = (viewportHeight - finalHeight) / 2

  // Animate
  requestAnimationFrame(() => {
    cloneImage.style.top = `${finalTop}px`
    cloneImage.style.left = `${finalLeft}px`
    cloneImage.style.width = `${finalWidth}px`
    cloneImage.style.height = `${finalHeight}px`
  })

  // Animation callback
  cloneImage.addEventListener(
    'transitionend',
    () => {
      // Remove
      viewer.value.animating = false
      setTimeout(() => cloneImage.remove(), 100) // Delay so swiper has time to initialize
    },
    { once: true },
  )
}
</script>
