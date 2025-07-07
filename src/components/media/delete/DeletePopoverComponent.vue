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
import { DBMediaWithTagsAndPath, PostConfigs } from '@/types'
import { IonButton, IonContent } from '@ionic/vue'

/* Props */
const props = defineProps<{
  media: DBMediaWithTagsAndPath
}>()

/* Emit */
const emit = defineEmits(['closeDeletePopover'])

/* Const */
const loadingStore = useLoadingStore()

/* API Calls */
async function deleteMedia(): Promise<void> {
  const postConfigs: PostConfigs = {
    url: 'auth/media/delete',

    onSuccess: () => {},

    onFail: (error: Error) => console.log(error.message),

    body: () => JSON.stringify({ id: props.media.media_id }),

    checks: () => {
      if (!props.media) throw new Error('Please select a media.')
    },
  }

  loadingStore.start()

  // await apiRequestPost(postConfigs)

  setTimeout(() => {
    emit('closeDeletePopover')
    loadingStore.stop()
  }, 5000)
}
</script>
