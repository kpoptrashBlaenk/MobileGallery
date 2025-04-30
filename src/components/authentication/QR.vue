<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle class="ml-2">QR Code</IonTitle>
        <IonProgressBar v-if="loading" type="indeterminate"></IonProgressBar>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <div class="mt-5 flex items-center justify-center p-5">
        <!-- Image -->
        <img v-if="qrCode" :src="qrCode" />
        <img v-else src="../../../public/placeholderImage.jpg" />
      </div>

      <div v-if="qrCode" class="text-center text-2xl">Scan to share!</div>

      <!-- Feedback -->
      <FeedbackComponent :is-valid="feedback.isValid" :message="feedback.message" />
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
/* Import */
import { Feedback, GetConfigs } from '@/types'
import { apiRequestGet } from '@/utils/apiRequest'
import { setFeedback } from '@/utils/functions'
import { IonContent, IonHeader, IonPage, IonProgressBar, IonTitle, IonToolbar } from '@ionic/vue'
import { onMounted, ref } from 'vue'
import FeedbackComponent from '../partials/FeedbackComponent.vue'

/* Ref */
const feedback = ref<Feedback>({ isValid: false, message: null })
const qrCode = ref<string | null>(null)
const loading = ref<boolean>(false)

/* Mounted Lifecycle Hook */
onMounted(() => {
  createQRCode()
})

/* API Calls */
async function createQRCode(): Promise<void> {
  const getConfigs: GetConfigs = {
    url: 'auth/qr',

    onSuccess: (result: string) => {
      qrCode.value = result
    },

    onFail: (error: Error) => setFeedback(feedback, error.message),
  }

  loading.value = true
  await apiRequestGet(getConfigs)
  loading.value = false
}
</script>
