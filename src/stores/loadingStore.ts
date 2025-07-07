import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    loading: false,
  }),

  actions: {
    start() {
      this.loading = true
    },

    stop() {
      this.loading = false
    },
  },
})
