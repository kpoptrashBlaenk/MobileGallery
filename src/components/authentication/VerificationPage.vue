<template>
  <IonPage>
    <IonContent>
      <!-- Title -->
      <div class="mt-10 text-center text-4xl font-bold">You are not authenticated!</div>
      <!-- Subtitle -->
      <div class="mt-15 text-center text-2xl">Please enter your key.</div>

      <!-- Input Grid -->
      <div class="mx-4 mt-8">
        <IonInputOtp
          :key="otpKey"
          :length="6"
          type="number"
          size="large"
          class="custom"
          @ionComplete="verify($event)"
        ></IonInputOtp>
      </div>

      <!-- Toast -->
      <ToastComponent ref="toastRef" />
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
/* Import */
import { PostConfigs, ToastComponentRef } from '@/types'
import { apiRequestPost } from '@/utils/apiRequest'
import { IonContent, IonInputOtp, IonPage } from '@ionic/vue'
import { ref } from 'vue'
import ToastComponent from '../partials/ToastComponent.vue'

/* Ref */
const toastRef = ref<ToastComponentRef>()
const otpKey = ref<number>(0)

/* API Calls */
async function verify(event: CustomEvent): Promise<void> {
  const postConfigs: PostConfigs = {
    url: 'guest/auth/verify',

    onSuccess: () => {
      location.reload()
    },

    onFail: (error: Error) => {
      otpKey.value++ // Reset OTP field
      toastRef.value?.openToast(error.message, 'error')
    },

    body: () => JSON.stringify({ token: event.detail.value }),
  }

  // Verify token
  await apiRequestPost(postConfigs)
}
</script>
