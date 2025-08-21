<template>
  <IonToast
    ref="toast"
    :is-open="toastOpen"
    :message="toastMessage"
    :duration="2000"
    :icon="toastType === 'error' ? alertCircleOutline : undefined"
    :color="toastType === 'error' ? 'danger' : toastType === 'success' ? 'success' : 'light'"
    swipe-gesture="vertical"
    :translucent="true"
    position-anchor="tabBar"
    @did-dismiss="toastOpen = false"
  />
</template>

<script setup lang="ts">
/* Import */
import { ToastTypes } from '@/types'
import { IonToast } from '@ionic/vue'
import { alertCircleOutline } from 'ionicons/icons'
import { ref } from 'vue'

/* Expose */
defineExpose({ openToast })

/* Ref */
const toastOpen = ref<boolean>(false)
const toastType = ref<ToastTypes>('info')
const toastMessage = ref<string>('')
const toast = ref<InstanceType<typeof IonToast>>()

/* DOM Manipulation */
function openToast(message: string, type: ToastTypes): void {
  toastOpen.value = true
  toastMessage.value = message
  toastType.value = type

  // Set flex of toast content to unset
  const content = toast.value?.$el.shadowRoot?.querySelector('.toast-content')
  content.style.flex = 'unset'
  content.style.paddingInlineStart = '5px'
}
</script>
