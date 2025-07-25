<template>
  <div
    ref="viewerRef"
    class="fixed top-0 h-screen w-screen bg-white opacity-0 transition-opacity duration-1000"
    :class="{ 'opacity-100': viewerStore.show }"
  >
    <IonHeader>
      <IonToolbar>
        <IonTitle class="ms-2">Gallery</IonTitle>
      </IonToolbar>
    </IonHeader>

    <!-- Swiper -->
    <swiper-container
      ref="swiperContainer"
      :zoom="true"
      :speed="250"
      :slides-per-view="1"
      class="h-full w-full pb-27.75"
      :initialSlide="mediaIndex"
      :class="{ 'opacity-0': viewerStore.animating }"
    >
      <swiper-slide v-for="(media, index) in mediaStore.medias" :key="index" :index="index" class="flex flex-col justify-center">
        <div
          class="swiper-zoom-container w-full transition-all duration-500 ease-in-out"
          :class="{
            'h-3/5': showInfo,
            'h-full': !showInfo,
          }"
        >
          <IonImg class="swiper-zoom-target h-full w-full" :src="media.media" />
        </div>

        <InfoComponent :show-info="showInfo" :media="media" />
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
    <IonTabBar id="tabBar" slot="bottom" class="absolute bottom-0 w-full gap-5 border-t-1 border-gray-200 bg-white">
      <IonButton fill="clear" shape="round" size="large" color="dark" @click="shareMedia()">
        <IonIcon :icon="shareSocialOutline" slot="icon-only"></IonIcon>
      </IonButton>
      <IonButton fill="clear" shape="round" size="large" color="dark" @click="!swiperZoomed() ? (showInfo = !showInfo) : false">
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
import { useViewerStore } from '@/stores/viewerStore'
import { DBMediaWithTagsAndPath, PostConfigs, ToastComponentRef } from '@/types'
import { apiRequestPost } from '@/utils/apiRequest'
import { formatMediaName, handleBackButton } from '@/utils/functions'
import { FileTransfer } from '@capacitor/file-transfer'
import {
  createGesture,
  GestureDetail,
  IonButton,
  IonHeader,
  IonIcon,
  IonImg,
  IonModal,
  IonPopover,
  IonTabBar,
  IonTitle,
  IonToolbar,
} from '@ionic/vue'
import { downloadOutline, informationCircleOutline, pencilOutline, shareSocialOutline, trashOutline } from 'ionicons/icons'
import { SwiperContainer } from 'swiper/element'
import { Swiper } from 'swiper/types'
import { onMounted, onUnmounted, ref } from 'vue'
import { calculateViewerSize } from '../../../utils/functions'
import DeletePopoverComponent from '../delete/DeletePopoverComponent.vue'
import EditPage from '../edit/EditPage.vue'
import InfoComponent from '../info/InfoComponent.vue'

/* Props */
const props = defineProps<{
  mediaIndex: number
}>()

/* Const */
const mediaStore = useMediaStore()
const viewerStore = useViewerStore()

/* Ref */
const media = ref<DBMediaWithTagsAndPath>(mediaStore.getMediaByIndex(props.mediaIndex))
const editModal = ref<InstanceType<typeof IonModal>>()
const showDeletePopover = ref<boolean>(false)
const swiperContainer = ref<SwiperContainer>()
const swiper = ref<Swiper>()
const toastRef = ref<ToastComponentRef>()
const viewerRef = ref<HTMLDivElement>()
const showInfo = ref<boolean>(false)

/* Mounted Lifecycle Hook */
onMounted(() => {
  const ionTabBar = document.querySelectorAll('ion-tab-bar')[1]
  ionTabBar.classList.add('opacity-0', 'pointer-events-none')

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

  // Enable/disable slide change when zoomed out/in
  swiper.value?.on('zoomChange', (event) => {
    swiperZoomed() ? (event.allowTouchMove = true) : (event.allowTouchMove = false)
  })

  // Info Gesture
  const infoGesture = createGesture({
    el: viewerRef.value as Node,
    gestureName: 'infoGesture',
    direction: 'y',
    threshold: 0,

    canStart: () => !swiperZoomed(),

    onMove: (detail: GestureDetail) => {
      // Swipe
      const deltaY = detail.currentY - detail.startY
      const velocityY = detail.velocityY

      // Swipe up to show info
      if (deltaY < -50 && velocityY < -0.8) {
        showInfo.value = true
        swiper.value?.zoom.disable()
      }

      // Swipe down to hide info
      if (deltaY > 50 && velocityY > 0.8) {
        showInfo.value = false
        swiper.value?.zoom.enable()
      }
    },
  })
  infoGesture.enable(true)

  // Back Button
  handleBackButton(1, () => {
    if (showInfo.value) {
      showInfo.value = false
      return
    }

    if (swiperZoomed()) {
      swiper.value?.zoom.out()
      return
    }

    if (viewerStore.show) closeViewer()
  })
})

/* Unmounted Lifecycle Hook */
onUnmounted(() => {
  const ionTabBar = document.querySelectorAll('ion-tab-bar')[1]
  ionTabBar.classList.remove('opacity-0', 'pointer-events-none')
})

/* DOM Manipulation */
function closeViewer(): void {
  if (mediaStore.medias.length === 0) {
    viewerStore.stopShow()
    return
  }

  // Copy image (not ion image because custom elements are different)
  const currentSlide = getActiveSlideIndex() as number
  const ionImageElement = document.querySelectorAll('swiper-container ion-img')[currentSlide] as HTMLIonImgElement
  const imageElement = ionImageElement.shadowRoot?.querySelector('img') as HTMLImageElement
  const cloneImage = imageElement.cloneNode(true) as HTMLImageElement

  // Close viewer
  viewerStore.stopShow()
  viewerStore.startAnimating()

  // Set classes
  cloneImage.classList.add('block', 'absolute', 'object-cover')

  // Append clone
  const page = document.querySelector('#galleryPage') as HTMLDivElement
  page.append(cloneImage)

  // Get original position and size
  const originalRect = calculateViewerSize(imageElement)

  // Place clone on top of original image
  cloneImage.style.top = `${originalRect.y}px`
  cloneImage.style.left = `${originalRect.x}px`
  cloneImage.style.width = `${originalRect.width}px`
  cloneImage.style.height = `${originalRect.height}px`
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
      viewerStore.stopAnimating()
      cloneImage.remove()

      // Trigger fetch if edited
      if (mediaStore.needToFetch) mediaStore.triggerFetch()
    },
    { once: true },
  )
}

/* API Calls */
async function shareMedia(): Promise<void> {
  const postConfigs: PostConfigs = {
    url: 'auth/auth/share',

    onSuccess: (result) => {
      // TODO Phone sharing
    },

    onFail: (error: Error) => {
      toastRef.value?.openToast(error.message, 'error')
    },

    body: () => JSON.stringify({ id: media.value.media_id }),
  }

  // Get share link
  await apiRequestPost(postConfigs)
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

function swiperZoomed(): boolean {
  return swiper.value!.zoom.scale > 1
}
</script>
