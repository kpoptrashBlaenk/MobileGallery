<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle class="ml-2">Upload Media</IonTitle>
        <IonProgressBar v-if="loading" type="indeterminate"></IonProgressBar>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <!-- Upload Input -->
      <div class="mt-5 flex justify-center">
        <IonButton @click="mediaInput?.click()">Upload Media</IonButton>
        <input ref="mediaInput" type="file" accept="image/*,video/*" multiple hidden @change="previewMedia()" />
      </div>

      <!-- Preview -->
      <div class="mt-5">
        <!-- Medias -->
        <div v-if="mediaFiles && mediaFiles.length !== 0">
          <!-- Swiper -->
          <swiper-container speed="250" slidesPerView="1" pagination="true" cssMode="false" class="s my-auto h-56">
            <swiper-slide v-for="(mediaUrl, index) in mediaUrls" :key="index" class="flex h-52 items-center justify-center">
              <div class="relative h-full object-contain">
                <!-- Media -->
                <img class="h-full" :src="mediaUrl" />
                <!-- Remove Button -->
                <IonButton size="small" shape="round" color="danger" class="absolute end-0 top-0 m-1" @click="removeMedia(index)">
                  <IonIcon slot="icon-only" :icon="closeOutline">X</IonIcon>
                </IonButton>
              </div>
            </swiper-slide>
          </swiper-container>
        </div>

        <!-- Placeholder -->
        <div class="flex justify-center" v-else>
          <img src="../../../../../public/placeholderImage.jpg" class="h-56" />
        </div>
      </div>

      <!-- Upload Button -->
      <div class="mt-10 flex justify-center">
        <IonButton :disabled="loading" @click="emptyMedia()">Upload</IonButton>
      </div>

      <!-- Feedback -->
      <div
        v-if="feedback.message"
        class="mt-2 flex h-4.5 justify-center text-center text-sm"
        :class="{ 'text-red-600': !feedback.isValid }"
      >
        <IonIcon v-if="!feedback.isValid" class="me-1 h-full" :icon="alertCircleOutline"></IonIcon>
        <div>{{ feedback.message }}</div>
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
/* Import */
import { Feedback } from '@/types'
import { isImage, isVideo, setFeedback } from '@/utils/functions'
import { IonButton, IonContent, IonHeader, IonIcon, IonPage, IonProgressBar, IonTitle, IonToolbar } from '@ionic/vue'
import { alertCircleOutline, closeOutline } from 'ionicons/icons'
import { ref } from 'vue'

/* Ref */
const feedback = ref<Feedback>({ isValid: false, message: null })
const loading = ref<boolean>(false)
const mediaFiles = ref<FileList | null>()
const mediaInput = ref<HTMLInputElement>()
const mediaUrls = ref<string[]>([])

/* DOM Manipulation */
function previewMedia(): void {
  // Remove error message
  setFeedback(feedback, null)

  // Get files
  const files = mediaInput.value?.files

  // Check file
  if (!files) {
    setFeedback(feedback, 'Please select a media file', false)
    return
  }

  for (const file of Array.from(files)) {
    // FileList is not an array apparently
    // Check file type
    if (!(isImage(file.type) || isVideo(file.type))) {
      // Remove medias
      mediaFiles.value = null

      setFeedback(feedback, 'Please select valid media files.', false)
      return
    }
  }

  // Return media files
  mediaFiles.value = files

  // Read Media
  readMedia()
}

function readMedia(): void {
  if (mediaFiles.value) {
    const urls: string[] = []

    Array.from(mediaFiles.value).forEach((file, index) => {
      // Create preview with reader
      const reader = new FileReader()
      reader.onload = (event: ProgressEvent<FileReader>) => {
        // urls[index] because reader is being created asynchronously and messes up the order
        urls[index] = event.target?.result as string
        if (urls.length === mediaFiles.value?.length) mediaUrls.value = urls
      }
      reader.readAsDataURL(file as File)
    })
  }
}

function removeMedia(index: number): void {
  // Create data transfer
  const dataTransfer = new DataTransfer()

  // Loop to select all files except the deleted one
  if (mediaInput.value?.files)
    Array.from(mediaInput.value.files).forEach((file) => {
      if (file.name !== mediaFiles.value?.[index].name) dataTransfer.items.add(file)
    })

  // Set new input
  mediaInput.value!.files = dataTransfer.files

  // Reset preview
  previewMedia()
}

function emptyMedia(): void {
  mediaInput.value!.value = ''
  mediaFiles.value = null
  mediaUrls.value = []
}
</script>

<style lang="css">
:root {
  --swiper-pagination-top: 205px;
}
</style>
