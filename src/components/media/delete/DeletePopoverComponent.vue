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
import { DBMediaWithTagsAndPath, PostConfigs } from '@/types'
import { apiRequestPost } from '@/utils/apiRequest'
import { vueComputedEmit } from '@/utils/functions'
import { IonButton, IonContent } from '@ionic/vue'

/* Props */
const props = defineProps<{
  loading: boolean
  media: DBMediaWithTagsAndPath
}>()

/* Emit */
const emit = defineEmits(['closeDeletePopover', 'update:loading'])
const loading = vueComputedEmit(emit, props, 'loading')

/* API Calls */
async function deleteMedia(): Promise<void> {
  const postConfigs: PostConfigs = {
    url: '/media/delete',

    body: () => JSON.stringify({ id: props.media.media_id }),

    onSuccess: () => {},

    onFail: (error: Error) => console.log(error.message),
  }

  loading.value = true

  await apiRequestPost(postConfigs)

  emit('closeDeletePopover')
  loading.value = false
}
</script>
