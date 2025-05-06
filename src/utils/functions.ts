import { Feedback, FeedbackRef } from '@/types'
import { computed } from 'vue'

/**
 * Checks if the file is an image
 *
 * @param data base64 of the file
 */
export function isImage(data: string): boolean {
  return data.startsWith('data:image') || data.startsWith('image')
}

/**
 * Checks if the file is a video
 *
 * @param data base64 of the file
 */
export function isVideo(data: string): boolean {
  return data.startsWith('data:video') || data.startsWith('video')
}

/**
 * Sets feedback ref values of type {@link Feedback}
 *
 * @param ref The feedback vue-ref
 * @param message The message to show or null to hide
 * @param isValid True for green and false for red
 */
export function setFeedback(ref: FeedbackRef, message: string | null, isValid?: boolean): void {
  if (isValid) ref.value.isValid = isValid
  ref.value.message = message
}

/**
 * Compute a value and emit on change. This is being used to v-model to the parent component.
 *
 * @param emit Emit handler
 * @param props Defined props
 * @param name name of the prop
 */
export function vueComputedEmit(emit: any, props: any, name: string) {
  return computed({
    get: () => props[name],
    set: (value) => emit(`update:${name}`, value),
  })
}
