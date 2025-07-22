import { computed } from 'vue'

/**
 * Checks if the file is an image
 *
 * @param data Mimetype of the file
 */
export function isImage(data: string): boolean {
  return data.startsWith('data:image') || data.startsWith('image')
}

/**
 * Checks if the file is a video
 *
 * @param data Mimetype of the file
 */
export function isVideo(data: string): boolean {
  return data.startsWith('data:video') || data.startsWith('video')
}

/**
 * Removes the unique beginning of a medianame
 *
 * @param name Name of the media to format
 */
export function formatMediaName(name: string): string {
  return name.replace(/^\d+-/, '')
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

/**
 * Handle the hardware back button
 *
 * @param priority Priority of this handler
 * @param callback What to do when button is pressed
 */
export function handleBackButton(priority: number, callback: () => void): void {
  document.addEventListener('ionBackButton', (event) => {
    //@ts-ignore
    event.detail.register(priority, () => {
      callback()
    })
  })
}

/**
 * Calculate the size and position of a media in the viewr
 *
 * @param mediaElement The media element to measure final size and position
 */
export function calculateViewerSize(mediaElement: HTMLImageElement): { x: number; y: number; width: number; height: number } {
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  const naturalAspectRatio = mediaElement.naturalWidth / mediaElement.naturalHeight

  const contentRect = document.querySelector('ion-content')?.getBoundingClientRect() as DOMRect

  let finalWidth = viewportWidth
  let finalHeight = finalWidth / naturalAspectRatio

  if (finalHeight > contentRect.height) {
    finalHeight = contentRect.height
    finalWidth = finalHeight * naturalAspectRatio
  }

  const finalLeft = (viewportWidth - finalWidth) / 2
  const finalTop = (viewportHeight - finalHeight) / 2

  return { x: finalLeft, y: finalTop, width: finalWidth, height: finalHeight }
}
