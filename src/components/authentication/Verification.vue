<template>
  <IonPage>
    <IonContent>
      <!-- Title -->
      <div class="mt-10 text-4xl text-center font-bold">You are not authenticated!</div>
      <!-- Subtitle -->
      <div class="mt-15 text-2xl text-center">Please enter your key.</div>

      <!-- Input Grid -->
      <div class="grid grid-cols-6 gap-1 mx-4 mt-8">
        <input
          v-for="(otp, index) in otps"
          class="text-center h-15 text-3xl font-semibold border-1 rounded-xl border-gray-300 focus:border-blue-500 outline-none transition-all duration-150"
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

      <!-- Error Text -->
      <div
        v-if="feedback.message"
        class="h-4.5 mt-2 flex justify-center text-sm text-center"
        :class="{ 'text-red-600': !feedback.isValid }"
      >
        <IonIcon v-if="!feedback.isValid" class="h-full me-1" name="alert-circle-outline"></IonIcon>
        <div>{{ feedback.message }}</div>
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
/* Import */
import { Feedback, PostConfigs } from '@/types'
import { apiRequestPost } from '@/utils/apiRequest'
import { IonContent, IonIcon, IonPage } from '@ionic/vue'
import { onMounted, ref } from 'vue'

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
      feedback.value.message = null
      location.reload()
    },

    onFail: (error: Error) => {
      feedback.value.message = error.message
    },

    body: () => JSON.stringify({ token: otps.value.join('') }),
  }

  // Verify token
  await apiRequestPost(postConfigs)
}
</script>
