import { DBMediaWithTagsAndPath } from '@/types'
import { defineStore } from 'pinia'

export const useMediaStore = defineStore('medias', {
  state: () => ({
    medias: [] as DBMediaWithTagsAndPath[],
  }),

  getters: {
    getMediaByIndex: (state) => {
      return (index: number) => state.medias[index]
    },
  },

  actions: {
    setMedias(value: typeof this.medias) {
      this.medias = value
    },

    deleteMedia(id: number) {
      this.medias = this.medias.filter((media) => media.media_id !== id)
    },
  },
})
