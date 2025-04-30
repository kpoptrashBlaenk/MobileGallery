<template>
  <div v-if="message" class="flex h-4.5 justify-center text-center text-sm" :class="{ 'text-red-600': !isValid }">
    <IonIcon v-if="!isValid" class="me-1 h-full" :icon="alertCircleOutline"></IonIcon>
    <div>{{ message }}</div>
  </div>
</template>

<script setup lang="ts">
/* Import */
import { IonIcon } from '@ionic/vue'
import { alertCircleOutline } from 'ionicons/icons'

/* Props */
defineProps<{
  isValid: boolean
  message: string | null
}>()
</script>
