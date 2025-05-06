import { Ref } from 'vue'

export interface ChosenTags {
  people: number[]
  location: number
  season: string
  albums: number[]
}

export interface AndTags {
  personIsAnd: boolean
  albumsIsAnd: boolean
}

export type TagContext = 'people' | 'location' | 'season' | 'albums'

export type ApiTagContext = 'person' | 'location' | 'season' | 'album'

export type ModalOptions = {
  tagContext: TagContext
  apiTagContext: ApiTagContext
  selected: Ref<string | string[]>
  multiple: boolean
  static: boolean
  fetch?: () => string[]
}
