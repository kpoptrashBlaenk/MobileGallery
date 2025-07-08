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
</template>

<script setup lang="ts">
/* Import */
import { Feedback } from '@/types'
import { isImage, isVideo, setFeedback, vueComputedEmit } from '@/utils/functions'
import { FilePicker, PickedFile } from '@capawesome/capacitor-file-picker'
import { IonButton, IonIcon, IonImg } from '@ionic/vue'
import { closeOutline } from 'ionicons/icons'
import { ref } from 'vue'

/* Props */
const props = defineProps<{
  feedback: Feedback
}>()

/* Expose */
defineExpose({
  getMedia,
  emptyMedia,
})

/* Emit */
const emit = defineEmits(['update:feedback'])
const feedback = vueComputedEmit(emit, props, 'feedback')
const mediaFiles = ref<PickedFile[]>([])

/* Ref */
const mediaUrls = ref<string[]>([])

/* DOM Manipulation */
async function openGallery(): Promise<void> {
  const files = await FilePicker.pickMedia()

  mediaFiles.value = files.files

  previewMedia()
}

function previewMedia(): void {
  // Remove error message
  setFeedback(feedback, null)

  // Get files
  const files = mediaFiles.value

  // Check file
  if (!files || files.length === 0) {
    setFeedback(feedback, 'Please select a media file', false)
    return
  }

  for (const file of Array.from(files)) {
    // FileList is not an array apparently
    // Check file type
    if (!(isImage(file.mimeType) || isVideo(file.mimeType))) {
      // Remove medias
      mediaFiles.value = []

      setFeedback(feedback, 'Please select valid media files.', false)
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
