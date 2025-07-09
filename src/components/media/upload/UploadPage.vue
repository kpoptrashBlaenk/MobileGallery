<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle class="ml-2">Upload Media</IonTitle>
        <IonProgressBar v-if="loadingStore.loading" type="indeterminate"></IonProgressBar>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <!-- Preview -->
      <PreviewComponent ref="previewRef" />

      <!-- Tag Buttons -->
      <div class="mt-3 flex items-center justify-center">
        <div class="grid grid-cols-2 gap-1">
          <IonButton v-for="(modalOption, index) in modalOptions" :key="index" :id="`open-${modalOption.tagContext}-modal`">
            {{ modalOption.tagContext }}
          </IonButton>
        </div>
      </div>

      <!-- Modals -->
      <TagModalComponent
        v-for="(modalOption, index) in modalOptions"
        :key="index"
        :tag-context="modalOption.tagContext"
        :api-tag-context="modalOption.apiTagContext"
        v-model:selected="modalOption.selected"
        :multiple="modalOption.multiple"
        :static="modalOption.static"
        :static-fetch="modalOption.fetch"
      />

      <!-- Upload Button -->
      <div class="mt-5 flex justify-center">
        <IonButton :disabled="loadingStore.loading" @click="upload()">Upload</IonButton>
      </div>

      <!-- Toast -->
      <ToastComponent ref="toastRef" />
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
/* Import */
import TagModalComponent from '@/components/partials/TagModalComponent.vue'
import ToastComponent from '@/components/partials/ToastComponent.vue'
import { useLoadingStore } from '@/stores/loadingStore'
import { useMediaStore } from '@/stores/mediaStore'
import { ModalOptions, PostConfigs, PreviewComponentRef, ToastComponentRef } from '@/types'
import { apiRequestPostForm } from '@/utils/apiRequest'
import { createSeasons } from '@/utils/functions'
import { IonButton, IonContent, IonHeader, IonPage, IonProgressBar, IonTitle, IonToolbar } from '@ionic/vue'
import { ref } from 'vue'
import PreviewComponent from './PreviewComponent.vue'

/* Const */
const loadingStore = useLoadingStore()
const selected = {
  people: ref<string[]>([]),
  location: ref<string>(''),
  season: ref<string>(''),
  albums: ref<string[]>([]),
}
const mediaStore = useMediaStore()

/* Ref */
const toastRef = ref<ToastComponentRef>()
const previewRef = ref<PreviewComponentRef>()
const modalOptions = ref<ModalOptions[]>([
  {
    tagContext: 'people',
    apiTagContext: 'person',
    selected: selected.people,
    multiple: true,
    static: false,
  },
  {
    tagContext: 'location',
    apiTagContext: 'location',
    selected: selected.location,
    multiple: false,
    static: false,
  },
  {
    tagContext: 'season',
    apiTagContext: 'season',
    selected: selected.season,
    multiple: false,
    static: true,
    fetch: createSeasons,
  },
  {
    tagContext: 'albums',
    apiTagContext: 'album',
    selected: selected.albums,
    multiple: true,
    static: false,
  },
])

/* API Calls */
async function upload(): Promise<void> {
  const mediaFiles = previewRef.value!.getMedia()

  const postConfigs: PostConfigs = {
    url: 'auth/media/upload',

    onSuccess: (result: string) => {
      toastRef.value?.openToast(result, 'success')
      mediaStore.startNeedToFetch()
      reset()
    },

    onFail: (error: Error) => {
      toastRef.value?.openToast(error.message, 'error')
    },

    body: () => {
      // Create form data because file can't be sent as json
      const formData = new FormData()
      for (const mediaFile of mediaFiles) {
        formData.append('medias', mediaFile.blob!)
      }
      formData.append(
        'tags',
        JSON.stringify({
          people: selected.people.value,
          location: selected.location.value,
          season: selected.season.value,
          albums: selected.albums.value,
        }),
      )

      return formData
    },

    checks: () => {
      // Check file
      if (!mediaFiles || mediaFiles.length === 0) throw new Error('Please select a media.')

      // Check location
      if (!selected.location.value || selected.location.value.length === 0) throw new Error('Please select a location.')

      // Check season
      if (!selected.season.value || selected.season.value.length === 0) throw new Error('Please select a season.')
    },
  }

  loadingStore.start()

  await apiRequestPostForm(postConfigs)

  loadingStore.stop()
}

function reset(): void {
  previewRef.value?.emptyMedia()
  selected.people.value = []
  selected.location.value = ''
  selected.season.value = ''
  selected.albums.value = []
}
</script>

<style lang="css">
:root {
  --swiper-pagination-top: 205px;
}
</style>
