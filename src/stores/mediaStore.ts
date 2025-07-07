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
