import { Feedback, FeedbackRef } from '@/types'

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
