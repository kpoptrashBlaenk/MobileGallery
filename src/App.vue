<template>
  <ion-app>
    <ion-router-outlet :forceDestruct="true" />
  </ion-app>
</template>

<script setup lang="ts">
/* Import */
import { App } from '@capacitor/app'
import { IonApp, IonRouterOutlet, useBackButton } from '@ionic/vue'
import { onMounted } from 'vue'

/* Mounted Lifecycle Hook */
onMounted(() => {
  useBackButton(-1, () => {
    App.exitApp()
  })
})
</script>
