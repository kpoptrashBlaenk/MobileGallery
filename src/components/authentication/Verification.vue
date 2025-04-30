<template>
  <IonPage>
    <IonContent>
      <!-- Title -->
      <div class="mt-10 text-center text-4xl font-bold">You are not authenticated!</div>
      <!-- Subtitle -->
      <div class="mt-15 text-center text-2xl">Please enter your key.</div>

      <!-- Input Grid -->
      <div class="mx-4 mt-8 grid grid-cols-6 gap-1">
        <input
          v-for="(otp, index) in otps"
          class="h-15 rounded-xl border-1 border-gray-300 text-center text-3xl font-semibold transition-all duration-150 outline-none focus:border-blue-500"
          placeholder="X"
          :key="index"
          v-model="otps[index]"
          type="number"
          maxlength="1"
          @input="handleInput(index)"
          @keydown="handleKeydown($event, index)"
          :autofocus="index === 0"
        />
      </div>

      <!-- Feedback -->
      <FeedbackComponent :is-valid="feedback.isValid" :message="feedback.message" />
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
/* Import */
import { Feedback, PostConfigs } from '@/types'
import { apiRequestPost } from '@/utils/apiRequest'
import { setFeedback } from '@/utils/functions'
import { IonContent, IonPage } from '@ionic/vue'
import { onMounted, ref } from 'vue'
import FeedbackComponent from '../partials/FeedbackComponent.vue'

/* Ref */
const otps = ref<string[]>(['', '', '', '', '', ''])
const inputs = ref<NodeListOf<HTMLInputElement>>()
const feedback = ref<Feedback>({ isValid: false, message: null })

/* Mounted Lifecycle Hook */
onMounted(() => {
  inputs.value = document.querySelectorAll('input')
})

/* DOM Manipulation */
function handleInput(index: number): void {
  // If input has value & not last, then focus next
  if (
    otps.value[index] !== undefined &&
    otps.value[index] !== null &&
    otps.value[index] !== '' &&
    index < otps.value.length - 1
  ) {
    const nextInput = inputs.value![index + 1]
    nextInput.focus()
    return
  }

  // Verify
  verify()
}

function handleKeydown(event: KeyboardEvent, index: number): void {
  // If backspace & not first, then focus previous
  if (event.key === 'Backspace' && !otps.value[index] && index > 0) {
    const previousInput = inputs.value![index - 1]
    previousInput.focus()
    return
  }
}

/* API Calls */
async function verify(): Promise<void> {
  const postConfigs: PostConfigs = {
    url: 'auth/verify',

    onSuccess: () => {
      setFeedback(feedback, null)
      location.reload()
    },

    onFail: (error: Error) => {
      setFeedback(feedback, error.message)
    },

    body: () => JSON.stringify({ token: otps.value.join('') }),
  }

  // Verify token
  await apiRequestPost(postConfigs)
}
</script>
