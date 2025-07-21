import { defineStore } from 'pinia'

export const useSlideStore = defineStore('slide', {
  state: () => ({
    swiperEnabled: true,
    zoomed: false,
    showInfo: false,
  }),

  actions: {
    // Swiper
    startEnableSwiper() {
      this.swiperEnabled = true
    },
    stopEnableSwiper() {
      this.swiperEnabled = false
    },

    // Info
    startShowInfo() {
      this.showInfo = true
    },
    stopShowInfo() {
      this.showInfo = false
    },

    // Zoom
    startZoom() {
      this.zoomed = true
      this.startEnableSwiper()
    },
    stopZoom() {
      this.zoomed = false
      this.stopEnableSwiper()
    },
  },
})
