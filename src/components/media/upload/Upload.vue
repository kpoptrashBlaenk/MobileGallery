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

      <!-- Tag Buttons -->
      <div class="mt-3 flex items-center justify-center">
        <div class="grid grid-cols-2 gap-1">
          <IonButton id="open-people-modal">People</IonButton>
          <IonButton id="open-location-modal">Location</IonButton>
          <IonButton id="open-season-modal">Season</IonButton>
          <IonButton id="open-albums-modal">Albums</IonButton>
        </div>
      </div>

      <!-- Upload Button -->
      <div class="mt-7.5 flex justify-center">
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

      <!-- People Modal -->
      <IonModal
        ref="peopleModal"
        trigger="open-people-modal"
        :initial-breakpoint="0.25"
        :breakpoints="[0, 0.25, 0.5, 0.75]"
        :expand-to-scroll="false"
      >
        <IonContent class="ion-padding">
          <!-- Searchbar -->
          <IonSearchbar
            v-model="peopleSearch"
            placeholder="Person"
            @click="peopleModal?.$el.setCurrentBreakpoint(0.75)"
          ></IonSearchbar>
          <!-- Feedback -->
          <div
            v-if="peopleFeedback.message"
            class="mt-2 flex h-4.5 justify-center text-center text-sm"
            :class="{ 'text-red-600': !peopleFeedback.isValid }"
          >
            <IonIcon v-if="!peopleFeedback.isValid" class="me-1 h-full" :icon="alertCircleOutline"></IonIcon>
            <div>{{ peopleFeedback.message }}</div>
          </div>
          <!-- Add -->
          <div v-else-if="peopleFiltered.length === 0" class="mt-3 flex flex-col items-center justify-center gap-2">
            <div>Person not found.</div>
            <IonButton>Add {{ peopleSearch }}</IonButton>
          </div>
          <!-- List -->
          <IonList v-else>
            <IonItem v-for="(person, index) in peopleFiltered" :key="index">
              <IonCheckbox
                @ionChange="handlePeopleSelected($event, person)"
                :checked="peopleSelected.includes(person)"
                label-placement="end"
                justify="start"
                >{{ person }}</IonCheckbox
              >
            </IonItem>
          </IonList>
        </IonContent>
      </IonModal>

      <!-- Location Modal -->
      <IonModal
        ref="locationsModal"
        trigger="open-location-modal"
        :initial-breakpoint="0.25"
        :breakpoints="[0, 0.25, 0.5, 0.75]"
        :expand-to-scroll="false"
      >
        <IonContent class="ion-padding">
          <!-- Searchbar -->
          <IonSearchbar
            v-model="locationsSearch"
            placeholder="Location"
            @click="locationsModal?.$el.setCurrentBreakpoint(0.75)"
          ></IonSearchbar>
          <!-- Feedback -->
          <div
            v-if="locationsFeedback.message"
            class="mt-2 flex h-4.5 justify-center text-center text-sm"
            :class="{ 'text-red-600': !locationsFeedback.isValid }"
          >
            <IonIcon v-if="!locationsFeedback.isValid" class="me-1 h-full" :icon="alertCircleOutline"></IonIcon>
            <div>{{ locationsFeedback.message }}</div>
          </div>
          <!-- Add -->
          <div v-else-if="locationsFiltered.length === 0" class="mt-3 flex flex-col items-center justify-center gap-2">
            <div>Location not found.</div>
            <IonButton>Add {{ locationsSearch }}</IonButton>
          </div>
          <!-- List -->
          <IonList v-else>
            <IonItem
              v-for="(location, index) in locationsFiltered"
              :key="index"
              :button="true"
              @click="handleLocationSelected(location)"
              >{{ location }}
            </IonItem>
          </IonList>
        </IonContent>
      </IonModal>

      <!-- Season Modal -->
      <IonModal
        ref="seasonsModal"
        trigger="open-season-modal"
        :initial-breakpoint="0.25"
        :breakpoints="[0, 0.25, 0.5, 0.75]"
        :expand-to-scroll="false"
      >
        <IonContent class="ion-padding">
          <!-- Searchbar -->
          <IonSearchbar
            v-model="seasonsSearch"
            placeholder="Season"
            @click="seasonsModal?.$el.setCurrentBreakpoint(0.75)"
          ></IonSearchbar>
          <!-- Add -->
          <div v-if="seasonsFiltered.length === 0" class="mt-3 flex flex-col items-center justify-center gap-2">
            <div>Season not found.</div>
          </div>
          <!-- List -->
          <IonList v-else>
            <IonItem v-for="(season, index) in seasonsFiltered" :key="index" :button="true" @click="handleSeasonSelected(season)"
              >{{ season }}
            </IonItem>
          </IonList>
        </IonContent>
      </IonModal>

      <!-- Albums Modal -->
      <IonModal
        ref="albumsModal"
        trigger="open-albums-modal"
        :initial-breakpoint="0.25"
        :breakpoints="[0, 0.25, 0.5, 0.75]"
        :expand-to-scroll="false"
      >
        <IonContent class="ion-padding">
          <!-- Searchbar -->
          <IonSearchbar
            v-model="albumsSearch"
            placeholder="Album"
            @click="albumsModal?.$el.setCurrentBreakpoint(0.75)"
          ></IonSearchbar>
          <!-- Feedback -->
          <div
            v-if="albumsFeedback.message"
            class="mt-2 flex h-4.5 justify-center text-center text-sm"
            :class="{ 'text-red-600': !albumsFeedback.isValid }"
          >
            <IonIcon v-if="!albumsFeedback.isValid" class="me-1 h-full" :icon="alertCircleOutline"></IonIcon>
            <div>{{ albumsFeedback.message }}</div>
          </div>
          <!-- Add -->
          <div v-else-if="albumsFiltered.length === 0" class="mt-3 flex flex-col items-center justify-center gap-2">
            <div>Album not found.</div>
            <IonButton>Add {{ albumsSearch }}</IonButton>
          </div>
          <!-- List -->
          <IonList v-else>
            <IonItem v-for="(album, index) in albumsFiltered" :key="index">
              <IonCheckbox
                @ionChange="handleAlbumsSelected($event, album)"
                :checked="albumsSelected.includes(album)"
                label-placement="end"
                justify="start"
                >{{ album }}</IonCheckbox
              >
            </IonItem>
          </IonList>
        </IonContent>
      </IonModal>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
/* Import */
import { Feedback, GetConfigs } from '@/types'
import { apiRequestGet } from '@/utils/apiRequest'
import { isImage, isVideo, setFeedback } from '@/utils/functions'
import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonModal,
  IonPage,
  IonProgressBar,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from '@ionic/vue'
import { alertCircleOutline, closeOutline } from 'ionicons/icons'
import { computed, onMounted, ref } from 'vue'

/* Ref */
const feedback = ref<Feedback>({ isValid: false, message: null })
const loading = ref<boolean>(false)
const mediaFiles = ref<FileList | null>()
const mediaInput = ref<HTMLInputElement>()
const mediaUrls = ref<string[]>([])
const allPeople = ref<string[]>([])
const peopleModal = ref<InstanceType<typeof IonModal>>()
const peopleSearch = ref<string>('')
const peopleSelected = ref<string[]>([])
const peopleFeedback = ref<Feedback>({ isValid: false, message: null })
const allLocations = ref<string[]>([])
const locationsModal = ref<InstanceType<typeof IonModal>>()
const locationsSearch = ref<string>('')
const locationSelected = ref<string>('')
const locationsFeedback = ref<Feedback>({ isValid: false, message: null })
const allSeasons = ref<string[]>([])
const seasonsModal = ref<InstanceType<typeof IonModal>>()
const seasonsSearch = ref<string>('')
const seasonSelected = ref<string>('')
const allAlbums = ref<string[]>([])
const albumsModal = ref<InstanceType<typeof IonModal>>()
const albumsSearch = ref<string>('')
const albumsSelected = ref<string[]>([])
const albumsFeedback = ref<Feedback>({ isValid: false, message: null })

/* Computed */
const peopleFiltered = computed(() =>
  allPeople.value.filter((name) => name.toLowerCase().includes(peopleSearch.value.toLowerCase())),
)
const locationsFiltered = computed(() =>
  allLocations.value.filter((name) => name.toLowerCase().includes(locationsSearch.value.toLowerCase())),
)
const seasonsFiltered = computed(() =>
  allSeasons.value.filter((name) => name.toLowerCase().includes(seasonsSearch.value.toLowerCase())),
)
const albumsFiltered = computed(() =>
  allAlbums.value.filter((name) => name.toLowerCase().includes(albumsSearch.value.toLowerCase())),
)

/* Mounted Lifecycle Hook */
onMounted(() => {
  fetchPeople()
  fetchLocations()
  fetchSeasons()
  fetchAlbums()
})

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

/* API Requests */
async function fetchPeople(): Promise<void> {
  const configs: GetConfigs = {
    url: 'tag/person/get',

    onSuccess: (result: string[]) => {
      allPeople.value = result
      setFeedback(peopleFeedback, null)
    },

    onFail: (error: Error) => setFeedback(peopleFeedback, error.message),
  }

  await apiRequestGet(configs)
}

async function fetchLocations(): Promise<void> {
  const configs: GetConfigs = {
    url: 'tag/location/get',

    onSuccess: (result: string[]) => {
      allLocations.value = result
      setFeedback(locationsFeedback, null)
    },

    onFail: (error: Error) => setFeedback(locationsFeedback, error.message),
  }

  await apiRequestGet(configs)
}

function fetchSeasons(): void {
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

  allSeasons.value = seasonArray
}

async function fetchAlbums(): Promise<void> {
  const configs: GetConfigs = {
    url: 'tag/album/get',

    onSuccess: (result: string[]) => {
      allAlbums.value = result
      setFeedback(albumsFeedback, null)
    },

    onFail: (error: Error) => setFeedback(albumsFeedback, error.message),
  }

  await apiRequestGet(configs)
}

/* Utility Functions */
function handlePeopleSelected(event: CustomEvent, value: string): void {
  // If checked: push value | if unchecked: splice value
  event.detail.checked ? peopleSelected.value.push(value) : peopleSelected.value.splice(peopleSelected.value.indexOf(value), 1)
}

function handleLocationSelected(value: string): void {
  locationSelected.value = value
}

function handleSeasonSelected(value: string): void {
  seasonSelected.value = value
}

function handleAlbumsSelected(event: CustomEvent, value: string): void {
  // If checked: push value | if unchecked: splice value
  event.detail.checked ? albumsSelected.value.push(value) : albumsSelected.value.splice(albumsSelected.value.indexOf(value), 1)
}
</script>

<style lang="css">
:root {
  --swiper-pagination-top: 205px;
}
</style>
