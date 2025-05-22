<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle class="ms-2">Gallery</IonTitle>
        <IonProgressBar v-if="loading" type="indeterminate"></IonProgressBar>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <!-- Filter Modal -->
      <div class="mx-1 mt-3 flex items-center justify-center">
        <div class="grid grid-cols-4 gap-1">
          <IonButton
            v-for="(modalOption, index) in modalOptions"
            :key="index"
            :id="`open-${modalOption.tagContext}-filter-modal`"
            size="small"
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
      <div v-if="initialized" class="grid grid-cols-3 place-items-center gap-2 p-5">
        <div v-for="media in medias" class="aspect-square w-full">
          <IonImg :src="media.media" class="h-full w-full cursor-pointer border-1 border-gray-300 object-cover" />
        </div>
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
/* Import */
import TagModalComponent from '@/components/partials/TagModalComponent.vue'
import { MEDIA_BULK_LIMIT } from '@/configs'
import { DBMediaWithTagsAndPath, ModalOptions, PostConfigs } from '@/types'
import { apiRequestPost } from '@/utils/apiRequest'
import { createSeasons } from '@/utils/functions'
import { IonButton, IonContent, IonHeader, IonImg, IonPage, IonProgressBar, IonTitle, IonToolbar } from '@ionic/vue'
import { onMounted, ref } from 'vue'

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

/* Ref */
const initialized = ref<boolean>(false)
const loadedMedias = ref<number>(0)
const loading = ref<boolean>(false)
const maxMediasReached = ref<boolean>(false)
const medias = ref<DBMediaWithTagsAndPath[]>([])
const modalOptions = ref<ModalOptions[]>([
  {
    tagContext: 'people',
    apiTagContext: 'person',
    selected: selected.people,
    multiple: true,
    static: false,
    isAnd: isAnd.people,
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
    isAnd: isAnd.albums,
  },
])

/* Mounted Lifecycle Hook */
onMounted(() => {
  initMedias()
})

/* API Calls */
async function getMedias(mediaAction: 'set' | 'push'): Promise<void> {
  loading.value = true

  const postConfigs: PostConfigs = {
    url: 'media/get',

    onSuccess: (result: DBMediaWithTagsAndPath[]) => {
      switch (mediaAction) {
        case 'set':
          medias.value = result
          break
        case 'push':
          result.forEach((res: DBMediaWithTagsAndPath) => {
            medias.value.push(res)
          })
          break
      }

      // If not 30 results, then no more requests
      if (result.length < MEDIA_BULK_LIMIT) maxMediasReached.value = true
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
        offset: loadedMedias.value,
      }),
  }

  await apiRequestPost(postConfigs)

  initialized.value = true
  loading.value = false
  loadedMedias.value += medias.value.length - loadedMedias.value
}

/* Utility Functions */
async function initMedias(): Promise<void> {
  initialized.value = false
  loadedMedias.value = 0
  await getMedias('set')
}
</script>
