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
      <swiper-slide v-for="(media, index) in medias" :key="index" class="flex justify-center">
        <IonImg :src="media.media" class="my-auto w-full" />
      </swiper-slide>
    </swiper-container>

    <!-- Modals -->
    <IonModal ref="editModal">
      <EditPage :media="medias[getCurrentSlide()]" />
    </IonModal>

    <!-- TabBar -->
    <IonTabBar slot="bottom" class="absolute bottom-0 z-50 w-full gap-5 border-t-1 border-gray-200 bg-white">
      <IonButton fill="clear" shape="round" size="large" color="dark">
        <IonIcon :icon="syncOutline" slot="icon-only"></IonIcon>
      </IonButton>
      <IonButton fill="clear" shape="round" size="large" color="dark">
        <IonIcon :icon="informationCircleOutline" slot="icon-only"></IonIcon>
      </IonButton>
      <IonButton fill="clear" shape="round" size="large" color="dark" @click="openEditModal()">
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
import { IonButton, IonIcon, IonImg, IonModal, IonTabBar } from '@ionic/vue'
import { downloadOutline, informationCircleOutline, pencilOutline, syncOutline, trashOutline } from 'ionicons/icons'
import { SwiperContainer } from 'swiper/element'
import { Swiper } from 'swiper/types'
import { onMounted, onUnmounted, ref } from 'vue'
import EditPage from '../edit/EditPage.vue'

/* Props */
defineProps<{
  mediaIndex: number
  medias: DBMediaWithTagsAndPath[]
  viewer: Viewer
}>()

/* Expose */
defineExpose({
  getCurrentSlide,
})

/* Ref */
const editModal = ref<InstanceType<typeof IonModal>>()
const swiperContainer = ref<SwiperContainer>()
const swiper = ref<Swiper>()

/* Mounted Lifecycle Hook */
onMounted(() => {
  const ionTabBar = document.querySelectorAll('ion-tab-bar')
  ionTabBar[1]!.style.display = 'none'

  // Scroll into view when it's not in the grid anymore
  swiperContainer.value?.addEventListener('swiperslidechange', () => {
    const gridIonImageElement = document.querySelectorAll('.grid ion-img')[getCurrentSlide()] as HTMLIonImgElement
    gridIonImageElement.scrollIntoView()
  })

  // Set swiper
  swiper.value = swiperContainer.value?.swiper
})

/* Unmounted Lifecycle Hook */
onUnmounted(() => {
  const ionTabBar = document.querySelectorAll('ion-tab-bar')
  ionTabBar[1]!.style.display = 'block'
})

/* DOM Manipulation */
function openEditModal(): void {
  editModal.value?.$el.present()
}

/* Utility Functions */
function getCurrentSlide(): number {
  return swiper.value?.activeIndex as number
}
</script>
