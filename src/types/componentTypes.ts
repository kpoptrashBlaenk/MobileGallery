import PreviewComponent from '@/components/media/upload/PreviewComponent.vue'

export interface PreviewComponentRef extends InstanceType<typeof PreviewComponent> {
  emptyMedia: () => void
}
