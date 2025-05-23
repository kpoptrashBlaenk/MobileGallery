<template>
  <IonPage ref="page">
    <IonHeader>
      <IonToolbar>
        <IonTitle class="ms-2">Gallery</IonTitle>
        <IonProgressBar v-if="loading" type="indeterminate"></IonProgressBar>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <!-- Filter Modal Buttons -->
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

      <!-- Viewer Layer -->
      <div v-if="viewer.show" class="fixed top-0 h-full w-full bg-white"></div>

      <!-- Gallery Grid -->
      <div v-if="initialized" class="grid grid-cols-3 place-items-center gap-2 p-5">
        <div v-for="(media, index) in medias" :key="index" class="aspect-square w-full">
          <IonImg
            :src="media.media"
            class="h-full w-full cursor-pointer border-1 border-gray-300 object-cover"
            @click="openViewer($event, index)"
          />
        </div>
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
/* Import */
import TagModalComponent from '@/components/partials/TagModalComponent.vue'
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
const loading = ref<boolean>(false)
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
const page = ref()
const viewer = ref({
  animating: false,
  show: false,
})

/* Mounted Lifecycle Hook */
onMounted(() => {
  initMedias()
})

/* DOM Manipulation */
function openViewer(event: CustomEvent, index: number): void {
  // Open viewer
  viewer.value.show = true

  // Copy image (not ion image because custom elements are different)
  const ionImageElement = event.target as HTMLIonImgElement
  const imageElement = ionImageElement.shadowRoot?.querySelector('img') as HTMLImageElement
  const cloneImage = imageElement.cloneNode(true) as HTMLImageElement

  // Set classes
  cloneImage.classList.remove('object-cover')
  cloneImage.classList.add('max-w-full', 'max-h-full', 'object-contain', 'block', 'mx-auto', 'my-auto', 'absolute')

  // Append clone
  page.value.$el.append(cloneImage)

  // Get original position and size
  const originalRect = imageElement.getBoundingClientRect()

  // Place clone on top of original image
  cloneImage.style.top = `${originalRect.y}px`
  cloneImage.style.left = `${originalRect.x}px`
  cloneImage.style.height = `${originalRect.height}px`
  cloneImage.style.width = `${originalRect.width}px`
  cloneImage.style.transition = 'all 300ms ease-in-out'

  // Calculate new position and size
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  const naturalAspectRatio = imageElement.naturalWidth / imageElement.naturalHeight

  let finalWidth = viewportWidth
  let finalHeight = finalWidth / naturalAspectRatio

  if (finalHeight > viewportHeight) {
    finalHeight = viewportHeight
    finalWidth = finalHeight * naturalAspectRatio
  }

  const finalLeft = (viewportWidth - finalWidth) / 2
  const finalTop = (viewportHeight - finalHeight) / 2

  // Animate
  requestAnimationFrame(() => {
    cloneImage.style.top = `${finalTop}px`
    cloneImage.style.left = `${finalLeft}px`
    cloneImage.style.width = `${finalWidth}px`
    cloneImage.style.height = `${finalHeight}px`
  })

  // Animation callback
  cloneImage.addEventListener(
    'transitionend',
    () => {
      viewer.value.animating = false
      cloneImage.remove()
    },
    { once: true },
  )
}

/* API Calls */
async function getMedias(): Promise<void> {
  loading.value = true

  const postConfigs: PostConfigs = {
    url: 'media/get',

    onSuccess: (result: DBMediaWithTagsAndPath[]) => {
      medias.value = result
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

  await apiRequestPost(postConfigs)

  initialized.value = true
  loading.value = false
}

/* Utility Functions */
function initMedias(): void {
  initialized.value = false
  getMedias()
}
</script>
