import PreviewComponent from '@/components/media/upload/PreviewComponent.vue'
import ToastComponent from '@/components/partials/ToastComponent.vue'
import { PickedFile } from '@capawesome/capacitor-file-picker'
import { ToastTypes } from './viewTypes'

export interface PreviewComponentRef extends InstanceType<typeof PreviewComponent> {
  getMedia: () => PickedFile[]
  emptyMedia: () => void
}

export interface ToastComponentRef extends InstanceType<typeof ToastComponent> {
  openToast: (message: string, type: ToastTypes) => void
}
