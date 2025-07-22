<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle class="ms-2">Gallery</IonTitle>
        <IonProgressBar v-if="loadingStore.loading" type="indeterminate"></IonProgressBar>
      </IonToolbar>
    </IonHeader>

    <IonContent :force-overscroll="false">
      <!-- Refresher -->
      <IonRefresher ref="refresherRef" slot="fixed" @ion-refresh="initMedias()">
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>

      <!-- Filter Modal Buttons -->
      <div class="mx-1 mt-3 flex items-center justify-center">
        <div class="grid grid-cols-4 gap-1">
          <IonButton
            v-for="(modalOption, index) in modalOptions"
            :key="index"
            :id="`open-${modalOption.tagContext}-filter-modal`"
            size="small"
            :fill="modalOption.selected.length === 0 ? 'outline' : 'solid'"
            >{{ modalOption.tagContext }}</IonButton
          >
        </div>
      </div>

      <!-- Tag Modals -->
      <TagModalComponent
        v-for="(modalOption, index) in modalOptions"
        :key="index"
        :tag-context="`${modalOption.tagContext}-filter`"
        :api-tag-context="modalOption.apiTagContext"
        v-model:selected="modalOption.selected"
        v-model:is-and="modalOption.isAnd"
        :multiple="modalOption.multiple"
        :static="modalOption.static"
        :static-fetch="modalOption.fetch"
        :modal-on-close="initMedias"
      />

      <!-- Gallery Grid -->
      <GridComponent v-if="initialized" />
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
/* Import */
import TagModalComponent from '@/components/partials/TagModalComponent.vue'
import { useLoadingStore } from '@/stores/loadingStore'
import { useMediaStore } from '@/stores/mediaStore'
import { DBMediaWithTagsAndPath, ModalOptions, PostConfigs } from '@/types'
import { apiRequestPost } from '@/utils/apiRequest'
import { createSeasons } from '@/utils/functions'
import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonProgressBar,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
} from '@ionic/vue'
import { onMounted, ref, watch } from 'vue'
import GridComponent from './GridComponent.vue'

/* Const */
const selected = {
  people: ref<string[]>([]),
  location: ref<string>(''),
  season: ref<string>(''),
  albums: ref<string[]>([]),
}
const isAnd = {
  people: ref<boolean>(false),
  albums: ref<boolean>(false),
}
const loadingStore = useLoadingStore()
const mediaStore = useMediaStore()

/* Ref */
const initialized = ref<boolean>(false)
const refresherRef = ref()
const modalOptions = ref<ModalOptions[]>([
  {
    tagContext: 'people',
    apiTagContext: 'person',
    selected: selected.people,
    multiple: true,
    static: false,
    isAnd: {
      show: true,
      ref: isAnd.people,
    },
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
    isAnd: {
      show: true,
      ref: isAnd.albums,
    },
  },
])

/* Watch */
watch(
  () => mediaStore.fetchTrigger,
  () => {
    initMedias()
    mediaStore.stopNeedToFetch()
  },
)

/* Mounted Lifecycle Hook */
onMounted(() => {
  initMedias()
})

/* API Calls */
async function getMedias(): Promise<void> {
  const postConfigs: PostConfigs = {
    url: 'auth/media/get',

    onSuccess: (result: DBMediaWithTagsAndPath[]) => {
      mediaStore.setMedias(result)
    },

    onFail: (error: Error) => console.error(error.message),

    body: () =>
      JSON.stringify({
        albums: selected.albums.value,
        location: selected.location.value,
        people: selected.people.value,
        season: selected.season.value,
        albumsIsAnd: isAnd.albums.value,
        peopleIsAnd: isAnd.people.value,
      }),
  }

  loadingStore.start()

  await apiRequestPost(postConfigs)

  initialized.value = true
  refresherRef.value?.$el.complete()
  loadingStore.stop()
}

/* Utility Functions */
function initMedias(): void {
  initialized.value = false
  getMedias()
}
</script>
