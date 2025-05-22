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

/**
 * Create an array with seasons
 */
export function createSeasons(): string[] {
  const seasons = ['Spring', 'Summer', 'Fall', 'Winter']
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth()

  const startYear = 2000
  const seasonIndex = Math.floor(currentMonth / 3) // Current season [0-3] = [Spring-Winter]

  const seasonArray: string[] = []

  // Loop from current year to start year
  for (let year = currentYear; year >= startYear; year--) {
    const startSeason = year === currentYear ? seasonIndex : 3 // If current year then current season, if not then winter

    for (let i = startSeason; i >= 0; i--) {
      const seasonYear = i === 3 ? `${year}/${year + 1}` : `${year}`

      seasonArray.push(`${seasons[i]} ${seasonYear}`)
    }
  }

  return seasonArray
}
