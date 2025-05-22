<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle class="ml-2">Gallery</IonTitle>
        <IonProgressBar v-if="loading" type="indeterminate"></IonProgressBar>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <div class="grid grid-cols-3 place-items-center gap-2 p-5">
        <div
          v-for="i in [
            1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          ]"
          class="h-full w-full"
        >
          <IonImg src="../../../../public/favicon.png" class="border-1 border-gray-300" />
        </div>
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
/* Import */
import { IonContent, IonHeader, IonImg, IonPage, IonProgressBar, IonTitle, IonToolbar } from '@ionic/vue'
import { ref } from 'vue'

/* Ref */
const loading = ref<boolean>(false)
</script>
