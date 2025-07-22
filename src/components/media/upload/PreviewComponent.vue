<template>
  <!-- Upload Input -->
  <div class="mt-5 flex justify-center">
    <IonButton @click="openGallery()">Upload Media</IonButton>
  </div>

  <!-- Preview -->
  <div class="mt-5">
    <!-- Medias -->
    <div v-if="mediaFiles && mediaFiles.length !== 0">
      <!-- Swiper -->
      <swiper-container
        speed="250"
        slidesPerView="1"
        :pagination="mediaFiles.length <= 20"
        zoom="true"
        cssMode="false"
        class="my-auto h-56"
      >
        <swiper-slide v-for="(mediaUrl, index) in mediaUrls" :key="index" class="flex h-52 items-center justify-center">
          <div class="relative h-full object-contain">
            <!-- Media -->
            <IonImg class="h-full" :src="mediaUrl" />
            <!-- Remove Button -->
            <IonButton size="small" shape="round" color="danger" class="absolute end-0 top-0 m-1" @click="removeMedia(index)">
              <IonIcon slot="icon-only" :icon="closeOutline"></IonIcon>
            </IonButton>
          </div>
        </swiper-slide>
      </swiper-container>
    </div>

    <!-- Placeholder -->
    <div class="flex justify-center" v-else>
      <IonImg src="../../../../../public/placeholderImage.jpg" class="h-56" />
    </div>
  </div>

  <ToastComponent ref="toastRef" />
</template>

<script setup lang="ts">
/* Import */
import ToastComponent from '@/components/partials/ToastComponent.vue'
import { ToastComponentRef } from '@/types'
import { isImage, isVideo } from '@/utils/functions'
import { FilePicker, PickedFile } from '@capawesome/capacitor-file-picker'
import { IonButton, IonIcon, IonImg } from '@ionic/vue'
import { closeOutline } from 'ionicons/icons'
import { ref } from 'vue'

/* Expose */
defineExpose({
  getMedia,
  emptyMedia,
})

/* Ref */
const mediaFiles = ref<PickedFile[]>([])
const mediaUrls = ref<string[]>([])
const toastRef = ref<ToastComponentRef>()

/* DOM Manipulation */
async function openGallery(): Promise<void> {
  const files = await FilePicker.pickMedia()

  mediaFiles.value = files.files

  previewMedia()
}

function previewMedia(): void {
  // Get files
  const files = mediaFiles.value

  // Check file
  if (!files || files.length === 0) {
    return
  }

  for (const file of Array.from(files)) {
    // FileList is not an array apparently
    // Check file type
    if (!(isImage(file.mimeType) || isVideo(file.mimeType))) {
      // Remove medias
      mediaFiles.value = []

      toastRef.value?.openToast('Please select valid media files.', 'error')
      return
    }
  }

  // Read Media
  mediaUrls.value = mediaFiles.value.map((media) => URL.createObjectURL(media.blob!))
}

function removeMedia(index: number): void {
  // Remove media
  mediaFiles.value.splice(index, 1)
  mediaUrls.value.splice(index, 1)

  // Reset preview
  previewMedia()
}

function getMedia(): PickedFile[] {
  return mediaFiles.value
}

function emptyMedia(): void {
  mediaFiles.value = []
  mediaUrls.value = []
}
</script>
