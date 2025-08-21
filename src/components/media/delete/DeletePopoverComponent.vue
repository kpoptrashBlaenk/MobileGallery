<template>
  <IonContent class="ion-padding text-xl font-bold">
    <div class="px-1">Do you want to delete this media?</div>
    <div class="flex justify-around gap-10 pt-7">
      <div class="flex-1">
        <IonButton size="large" color="success" class="w-full font-bold" @click="deleteMedia()">Yes</IonButton>
      </div>
      <div class="flex-1">
        <IonButton size="large" color="danger" class="w-full font-bold" @click="emit('closeDeletePopover')">No</IonButton>
      </div>
    </div>
  </IonContent>
</template>

<script setup lang="ts">
/* Import */
import { useLoadingStore } from '@/stores/loadingStore'
import { useMediaStore } from '@/stores/mediaStore'
import { DBMediaWithTagsAndPath, PostConfigs } from '@/types'
import { apiRequestPost } from '@/utils/apiRequest'
import { IonButton, IonContent } from '@ionic/vue'
import { nextTick } from 'vue'

/* Props */
const props = defineProps<{
  media: DBMediaWithTagsAndPath
}>()

/* Emit */
const emit = defineEmits(['closeDeletePopover', 'closeViewer'])

/* Const */
const loadingStore = useLoadingStore()
const mediaStore = useMediaStore()

/* API Calls */
async function deleteMedia(): Promise<void> {
  const postConfigs: PostConfigs = {
    url: 'auth/media/delete',

    onSuccess: () => {
      mediaStore.deleteMedia(props.media.media_id)
    },

    onFail: (error: Error) => console.log(error.message),

    body: () => JSON.stringify({ id: props.media.media_id }),

    checks: () => {
      if (!props.media) throw new Error('Please select a media.')
    },
  }

  loadingStore.start()

  await apiRequestPost(postConfigs)

  loadingStore.stop()
  emit('closeDeletePopover')
  // Popover needs to be closed before viewer
  nextTick(() => {
    if (mediaStore.medias.length === 0) emit('closeViewer')
  })
}
</script>
