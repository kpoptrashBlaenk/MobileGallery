<template>
  <IonModal ref="editModal">
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle class="ml-2">Edit Media</IonTitle>
          <IonProgressBar v-if="loading" type="indeterminate"></IonProgressBar>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <!-- Preview -->
        <IonImg :src="media.media" />

        <!-- Tag Buttons -->
        <div class="mt-3 flex items-center justify-center">
          <div class="grid grid-cols-2 gap-1">
            <IonButton v-for="(modalOption, index) in modalOptions" :key="index" :id="`open-${modalOption.tagContext}-modal`">{{
              modalOption.tagContext
            }}</IonButton>
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

        <!-- Save Button -->
        <div class="mt-5 flex justify-center">
          <IonButton :disabled="loading" @click="save()">Save</IonButton>
        </div>

        <!-- Feedback -->
        <FeedbackComponent :is-valid="feedback.isValid" :message="feedback.message" />
      </IonContent>
    </IonPage>
  </IonModal>
</template>

<script setup lang="ts">
/* Import */
import FeedbackComponent from '@/components/partials/FeedbackComponent.vue'
import TagModalComponent from '@/components/partials/TagModalComponent.vue'
import { DBMediaWithTagsAndPath, Feedback, ModalOptions, PostConfigs } from '@/types'
import { apiRequestPost } from '@/utils/apiRequest'
import { createSeasons, setFeedback } from '@/utils/functions'
import { IonButton, IonContent, IonHeader, IonImg, IonModal, IonPage, IonProgressBar, IonTitle, IonToolbar } from '@ionic/vue'
import { ref } from 'vue'

/* Props */
const props = defineProps<{
  media: DBMediaWithTagsAndPath
}>()

/* Expose */
defineExpose({openModal})

/* Const */
const selected = {
  people: ref<string[]>(props.media.people.map((person) => person.name)),
  location: ref<string>(props.media.location_name),
  season: ref<string>(props.media.season),
  albums: ref<string[]>(props.media.albums.map((album) => album.name)),
}

/* Ref */
const feedback = ref<Feedback>({ isValid: false, message: null })
const loading = ref<boolean>(false)
const editModal = ref<InstanceType<typeof IonModal>>()
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

/* DOM Manipulation */
function openModal(): void {
  editModal.value?.$el.present()
}

/* API Calls */
async function save(): Promise<void> {
  loading.value = true

  const postConfigs: PostConfigs = {
    url: 'auth/media/edit',

    onSuccess: (result: string) => {
      setFeedback(feedback, result, true)
    },

    onFail: (error: Error) => setFeedback(feedback, error.message, false),

    body: () =>
      JSON.stringify({
        people: selected.people.value,
        location: selected.location.value,
        season: selected.season.value,
        albums: selected.albums.value,
        id: props.media.media_id,
      }),

    checks: () => {
      // Check file
      if (!props.media) throw new Error('Please select a media.')

      // Check location
      if (!selected.location.value || selected.location.value.length === 0) throw new Error('Please select a location.')

      // Check season
      if (!selected.season.value || selected.season.value.length === 0) throw new Error('Please select a season.')
    },
  }

  await apiRequestPost(postConfigs)

  loading.value = false
}
</script>
