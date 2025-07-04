<template>
  <IonContent class="ion-padding text-xl font-bold">
    <div class="px-1">Do you want to delete this media?</div>
    <div class="flex justify-around gap-10 pt-7">
      <div class="flex-1">
        <IonButton size="large" color="success" class="w-full font-bold">Yes</IonButton>
      </div>
      <div class="flex-1">
        <IonButton size="large" color="danger" class="w-full font-bold" @click="() => emit('closeDeletePopover')">No</IonButton>
      </div>
    </div>
  </IonContent>
</template>

<script setup lang="ts">
/* Import */
import { IonButton, IonContent } from '@ionic/vue'

/* Emit */
const emit = defineEmits(['closeDeletePopover'])
</script>
