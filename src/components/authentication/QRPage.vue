<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle class="ml-2">QR Code</IonTitle>
        <IonProgressBar v-if="loadingStore.loading" type="indeterminate"></IonProgressBar>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <div class="mt-5 flex items-center justify-center p-5">
        <!-- Image -->
        <img v-if="qrCode" :src="qrCode" />
        <img v-else src="../../../public/placeholderImage.jpg" />
      </div>

      <div v-if="qrCode" class="text-center text-2xl">Scan to share!</div>

      <!-- Toast -->
      <ToastComponent ref="toastRef" />
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
/* Import */
import { useLoadingStore } from '@/stores/loadingStore'
import { GetConfigs, ToastComponentRef } from '@/types'
import { apiRequestGet } from '@/utils/apiRequest'
import { IonContent, IonHeader, IonPage, IonProgressBar, IonTitle, IonToolbar } from '@ionic/vue'
import { onMounted, ref } from 'vue'
import ToastComponent from '../partials/ToastComponent.vue'

/* Const */
const loadingStore = useLoadingStore()

/* Ref */
const qrCode = ref<string | null>(null)
const toastRef = ref<ToastComponentRef>()

/* Mounted Lifecycle Hook */
onMounted(() => {
  createQRCode()
})

/* API Calls */
async function createQRCode(): Promise<void> {
  const getConfigs: GetConfigs = {
    url: 'auth/auth/qr',

    onSuccess: (result: string) => {
      qrCode.value = result
    },

    onFail: (error: Error) => toastRef.value?.openToast(error.message, 'error'),
  }

  loadingStore.start()

  await apiRequestGet(getConfigs)

  loadingStore.stop()
}
</script>
