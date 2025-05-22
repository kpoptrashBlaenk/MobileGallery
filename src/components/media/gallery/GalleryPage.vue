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
            :id="`open-${modalOption.tagContext}-modal`"
            size="small"
            >{{ modalOption.tagContext }}</IonButton
          >
        </div>
      </div>
      
      <!-- Tag Modals -->
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

      <!-- Gallery Grid -->
      <div class="grid grid-cols-3 place-items-center gap-2 p-5">
        <div
          v-for="i in [
            1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          ]"
          class="h-full w-full"
        >
          <IonImg src="../../../../public/favicon.png" class="border-1 border-gray-300" />
        </div>
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
/* Import */
import TagModalComponent from '@/components/partials/TagModalComponent.vue'
import { ModalOptions } from '@/types'
import { createSeasons } from '@/utils/functions'
import { IonButton, IonContent, IonHeader, IonImg, IonPage, IonProgressBar, IonTitle, IonToolbar } from '@ionic/vue'
import { ref } from 'vue'

/* Const */
const selected = {
  people: ref<string[]>([]),
  location: ref<string>(''),
  season: ref<string>(''),
  albums: ref<string[]>([]),
}

/* Ref */
const loading = ref<boolean>(false)
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
</script>
