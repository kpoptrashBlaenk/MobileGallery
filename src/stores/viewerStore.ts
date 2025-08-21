import { defineStore } from 'pinia'

export const useViewerStore = defineStore('viewer', {
  state: () => ({
    animating: false,
    show: false,
  }),

  actions: {
    startAnimating() {
      this.animating = true
    },

    stopAnimating() {
      this.animating = false
    },

    startShow() {
      this.show = true
    },

    stopShow() {
      this.show = false
    },
  },
})
