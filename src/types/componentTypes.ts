import ViewerComponent from '@/components/media/gallery/ViewerComponent.vue'
import PreviewComponent from '@/components/media/upload/PreviewComponent.vue'

export interface PreviewComponentRef extends InstanceType<typeof PreviewComponent> {
  emptyMedia: () => void
}

export interface ViewerComponentRef extends InstanceType<typeof ViewerComponent> {
  getCurrentSlide: () => number
}
