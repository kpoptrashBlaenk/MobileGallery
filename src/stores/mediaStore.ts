import { DBMediaWithTagsAndPath } from '@/types'
import { defineStore } from 'pinia'

export const useMediaStore = defineStore('medias', {
  state: () => ({
    medias: [] as DBMediaWithTagsAndPath[],
    needToFetch: false,
    fetchTrigger: 0,
  }),

  getters: {
    getMediaByIndex: (state) => {
      return (index: number) => state.medias[index]
    },
  },

  actions: {
    setMedias(value: DBMediaWithTagsAndPath[]) {
      this.medias = value
    },

    updateMedia(id: number, people: string[], location: string, season: string, albums: string[]) {
      const media = this.medias.find((media) => media.media_id === id)
      media!.people = people.map((person) => ({ id: 99, name: person }))
      media!.location_name = location
      media!.season = season
      media!.albums = albums.map((album) => ({ id: 99, name: album }))
    },

    deleteMedia(id: number) {
      this.medias = this.medias.filter((media) => media.media_id !== id)
    },

    startNeedToFetch() {
      this.needToFetch = true
    },

    stopNeedToFetch() {
      this.needToFetch = false
    },

    triggerFetch() {
      this.fetchTrigger++
    },
  },
})
