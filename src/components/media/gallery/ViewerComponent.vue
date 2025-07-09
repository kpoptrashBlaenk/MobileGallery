<template>
  <div
    class="fixed top-0 h-screen w-screen bg-white opacity-0 transition-opacity duration-1000"
    :class="{ 'opacity-100': viewer.show }"
  >
    <!-- Swiper -->
    <swiper-container
      ref="swiperContainer"
      :speed="250"
      :slides-per-view="1"
      class="h-full w-full"
      :initialSlide="mediaIndex"
      :class="{ 'opacity-0': viewer.animating }"
    >
      <swiper-slide
        v-for="(media, index) in mediaStore.medias"
        :key="index"
        :index="index"
        class="flex flex-col justify-center py-14"
      >
        <IonImg :src="media.media" class="w-full" :class="showInfo ? 'h-1/2 object-cover' : ''" />
        <InfoComponent v-if="showInfo" :media="media" />
      </swiper-slide>
    </swiper-container>

    <!-- Edit Modal -->
    <IonModal ref="editModal">
      <EditPage v-if="swiper" :media="media" />
    </IonModal>

    <!-- Delete Popover -->
    <IonPopover :is-open="showDeletePopover" @did-dismiss="showDeletePopover = false">
      <DeletePopoverComponent @close-delete-popover="showDeletePopover = false" @close-viewer="closeViewer()" :media="media" />
    </IonPopover>

    <!-- Toast Component -->
    <ToastComponent ref="toastRef" />

    <!-- TabBar -->
    <IonTabBar id="tabBar" slot="bottom" class="absolute bottom-0 z-50 w-full gap-5 border-t-1 border-gray-200 bg-white">
      <IonButton fill="clear" shape="round" size="large" color="dark">
        <IonIcon :icon="syncOutline" slot="icon-only"></IonIcon>
      </IonButton>
      <IonButton fill="clear" shape="round" size="large" color="dark" @click="showInfo = !showInfo">
        <IonIcon :icon="informationCircleOutline" slot="icon-only"></IonIcon>
      </IonButton>
      <IonButton fill="clear" shape="round" size="large" color="dark" @click="editModal?.$el.present()">
        <IonIcon :icon="pencilOutline" slot="icon-only"></IonIcon>
      </IonButton>
      <IonButton fill="clear" shape="round" size="large" color="dark" @click="downloadMedia()">
        <IonIcon :icon="downloadOutline" slot="icon-only"></IonIcon>
      </IonButton>
      <IonButton fill="clear" shape="round" size="large" color="dark" @click="showDeletePopover = true">
        <IonIcon :icon="trashOutline" slot="icon-only"></IonIcon>
      </IonButton>
    </IonTabBar>
  </div>
</template>

<script setup lang="ts">
/* Import */
import ToastComponent from '@/components/partials/ToastComponent.vue'
import { useMediaStore } from '@/stores/mediaStore'
import { DBMediaWithTagsAndPath, ToastComponentRef, Viewer } from '@/types'
import { formatMediaName, handleBackButton } from '@/utils/functions'
import { FileTransfer } from '@capacitor/file-transfer'
import { IonButton, IonIcon, IonImg, IonModal, IonPopover, IonTabBar } from '@ionic/vue'
import { downloadOutline, informationCircleOutline, pencilOutline, syncOutline, trashOutline } from 'ionicons/icons'
import { SwiperContainer } from 'swiper/element'
import { Swiper } from 'swiper/types'
import { onMounted, onUnmounted, ref } from 'vue'
import DeletePopoverComponent from '../delete/DeletePopoverComponent.vue'
import EditPage from '../edit/EditPage.vue'
import InfoComponent from '../info/InfoComponent.vue'

/* Props */
const props = defineProps<{
  mediaIndex: number
  viewer: Viewer
}>()

/* Const */
const mediaStore = useMediaStore()

/* Ref */
const media = ref<DBMediaWithTagsAndPath>(mediaStore.getMediaByIndex(props.mediaIndex))
const editModal = ref<InstanceType<typeof IonModal>>()
const showDeletePopover = ref<boolean>(false)
const swiperContainer = ref<SwiperContainer>()
const swiper = ref<Swiper>()
const toastRef = ref<ToastComponentRef>()
const showInfo = ref<boolean>(true)

/* Mounted Lifecycle Hook */
onMounted(() => {
  const ionTabBar = document.querySelectorAll('ion-tab-bar')
  ionTabBar[1]!.style.display = 'none'

  // Scroll into view when it's not in the grid anymore
  swiperContainer.value?.addEventListener('swiperslidechange', () => {
    const gridIonImageElement = document.querySelectorAll('.grid ion-img')[getActiveSlideIndex()] as HTMLIonImgElement
    gridIonImageElement.scrollIntoView()
  })

  // Set swiper
  swiper.value = swiperContainer.value?.swiper

  // Change media on slide change
  swiper.value?.on('slideChange', () => {
    media.value = mediaStore.getMediaByIndex(getActiveSlideIndex())
  })

  // Back Button
  handleBackButton(1, () => {
    if (props.viewer.show) closeViewer()
  })
})

/* Unmounted Lifecycle Hook */
onUnmounted(() => {
  const ionTabBar = document.querySelectorAll('ion-tab-bar')
  ionTabBar[1]!.style.display = 'block'
})

/* DOM Manipulation */
function closeViewer(): void {
  if (mediaStore.medias.length === 0) {
    props.viewer.show = false
    return
  }

  // Copy image (not ion image because custom elements are different)
  const currentSlide = getActiveSlideIndex() as number
  const ionImageElement = document.querySelectorAll('swiper-container ion-img')[currentSlide] as HTMLIonImgElement
  const imageElement = ionImageElement.shadowRoot?.querySelector('img') as HTMLImageElement
  const cloneImage = imageElement.cloneNode(true) as HTMLImageElement

  // Close viewer
  props.viewer.show = false
  props.viewer.animating = true

  // Set classes
  cloneImage.classList.add('block', 'absolute', 'object-cover')

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

  // Place clone on top of original image
  cloneImage.style.transition = 'all 300ms ease-in-out'

  // Get position and size of image in grid
  const gridIonImageElement = document.querySelectorAll('.grid ion-img')[currentSlide] as HTMLIonImgElement
  const rect = gridIonImageElement.getBoundingClientRect()

  // Animate
  requestAnimationFrame(() => {
    cloneImage.style.top = `${rect.top}px`
    cloneImage.style.left = `${rect.left}px`
    cloneImage.style.width = `${rect.width}px`
    cloneImage.style.height = `${rect.height}px`
  })

  // Animation callback
  cloneImage.addEventListener(
    'transitionend',
    () => {
      // Remove
      props.viewer.animating = false
      cloneImage.remove()

      // Trigger fetch if edited
      if (mediaStore.needToFetch) mediaStore.triggerFetch()
    },
    { once: true },
  )
}

/* Utility Functions */
function getActiveSlideIndex(): number {
  return swiper.value!.activeIndex
}

async function downloadMedia(): Promise<void> {
  const media = mediaStore.getMediaByIndex(getActiveSlideIndex())

  try {
    // Download file
    await FileTransfer.downloadFile({
      url: media.media,
      path: formatMediaName(media.name),
    })

    // Downloading toast
    toastRef.value?.openToast('Downloading...', 'info')
  } catch (error: any) {
    // Error toast
    toastRef.value?.openToast(error.message, 'error')
  }
}
</script>
