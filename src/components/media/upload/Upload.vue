<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle class="ml-2">Upload Media</IonTitle>
        <IonProgressBar v-if="loading" type="indeterminate"></IonProgressBar>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <Preview ref="previewRef" :feedback="feedback" />

      <!-- Tag Buttons -->
      <div class="mt-3 flex items-center justify-center">
        <div class="grid grid-cols-2 gap-1">
          <IonButton v-for="(modalOption, index) in modalOptions" :key="index" :id="`open-${modalOption.tagContext}-modal`">{{
            modalOption.tagContext
          }}</IonButton>
        </div>
      </div>

      <!-- Upload Button -->
      <div class="mt-7.5 flex justify-center">
        <IonButton :disabled="loading" @click="upload()">Upload</IonButton>
      </div>

      <!-- Feedback -->
      <FeedbackComponent :is-valid="feedback.isValid" :message="feedback.message" />

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
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
/* Import */
import FeedbackComponent from '@/components/partials/FeedbackComponent.vue'
import TagModalComponent from '@/components/partials/TagModalComponent.vue'
import { Feedback, ModalOptions, PreviewComponentRef } from '@/types'
import { IonButton, IonContent, IonHeader, IonPage, IonProgressBar, IonTitle, IonToolbar } from '@ionic/vue'
import { ref } from 'vue'
import Preview from './PreviewComponent.vue'

/* Const */
const selected = {
  people: ref<string[]>([]),
  location: ref<string>(''),
  season: ref<string>(''),
  albums: ref<string[]>([]),
}

/* Ref */
const feedback = ref<Feedback>({ isValid: false, message: null })
const loading = ref<boolean>(false)
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
function createSeasons(): string[] {
  const seasons = ['Spring', 'Summer', 'Fall', 'Winter']
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth()

  const startYear = 2000
  const seasonIndex = Math.floor(currentMonth / 3) // Current season [0-3] = [Spring-Winter]

  const seasonArray: string[] = []

  // Loop from current year to start year
  for (let year = currentYear; year >= startYear; year--) {
    const startSeason = year === currentYear ? seasonIndex : 3 // If current year then current season, if not then winter

    for (let i = startSeason; i >= 0; i--) {
      const seasonYear = i === 3 ? `${year}/${year + 1}` : `${year}`

      seasonArray.push(`${seasons[i]} ${seasonYear}`)
    }
  }

  return seasonArray
}

async function upload(): Promise<void> {
  loading.value = true
  previewRef.value?.emptyMedia()
  loading.value = false
}
</script>

<style lang="css">
:root {
  --swiper-pagination-top: 205px;
}
</style>
