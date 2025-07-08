import { Ref } from 'vue'

export type Feedback = {
  isValid: boolean
  message: string | null
}

export type FeedbackRef = Ref<
  {
    isValid: boolean
    message: string | null
  },
  | Feedback
  | {
      isValid: boolean
      message: string | null
    }
>

export type Viewer = {
  animating: boolean
  show: boolean
}

export type ToastTypes = 'error' | 'success' | 'info'
