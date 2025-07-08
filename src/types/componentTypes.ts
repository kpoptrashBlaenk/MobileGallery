import PreviewComponent from '@/components/media/upload/PreviewComponent.vue'
import { PickedFile } from '@capawesome/capacitor-file-picker'

export interface PreviewComponentRef extends InstanceType<typeof PreviewComponent> {
  getMedia: () => PickedFile[]
  emptyMedia: () => void
}
