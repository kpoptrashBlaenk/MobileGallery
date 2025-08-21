import { Ref } from 'vue'

export interface ChosenTags {
  people: string[]
  location: string
  season: string
  albums: string[]
}

export interface AndTags {
  peopleIsAnd: boolean
  albumsIsAnd: boolean
}

export type TagContext = 'people' | 'location' | 'season' | 'albums'

export type ApiTagContext = 'person' | 'location' | 'season' | 'album'

export type IsAnd = {
  show: boolean
  ref: Ref<boolean> | boolean
}

export type ModalOptions = {
  tagContext: TagContext
  apiTagContext: ApiTagContext
  selected: Ref<string | string[]>
  multiple: boolean
  static: boolean
  fetch?: () => string[]
  isAnd?: IsAnd
}
