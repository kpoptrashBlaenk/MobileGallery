export interface GetConfigs {
  url: string
  onSuccess: (result?: any) => void
  onFail: (error?: any) => void
}

export interface PostConfigs extends GetConfigs {
  body: () => string | FormData
  checks?: () => void
}
