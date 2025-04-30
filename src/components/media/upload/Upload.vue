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
          <swiper-container speed="250" slidesPerView="1" initialSlide="0" pagination="true" class="s my-auto h-56">
            <swiper-slide v-for="(mediaUrl, index) in mediaUrls" :key="index" class="flex h-52 items-center justify-center">
              <img class="h-full" :src="mediaUrl" />
            </swiper-slide>
          </swiper-container>
        </div>

        <!-- Placeholder -->
        <div class="px-10" v-else>
          <img src="../../../../../public/placeholderImage.jpg" alt="Preview" class="preview-media" />
        </div>
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
/* Import */
import { Feedback } from '@/types'
import { isImage, isVideo, setFeedback } from '@/utils/functions'
import { IonButton, IonContent, IonHeader, IonPage, IonProgressBar, IonTitle, IonToolbar } from '@ionic/vue'
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
  readMedia()
}

function readMedia(): void {
  if (mediaFiles.value)
    for (const file of Array.from(mediaFiles.value)) {
      // Create preview with reader
      const reader = new FileReader()
      reader.onload = (event: ProgressEvent<FileReader>) => {
        mediaUrls.value.push(event.target?.result as string)
      }
      reader.readAsDataURL(file as File)
    }
}
</script>

<style lang="css">
:root {
  --swiper-pagination-top: 205px;
}
</style>
