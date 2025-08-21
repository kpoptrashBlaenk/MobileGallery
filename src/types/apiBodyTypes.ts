import { AndTags, ChosenTags } from './tagTypes'

export type IdBody = {
  id: number
}

export type MediaEditBody = ChosenTags & IdBody

export type MediaFilterBody = ChosenTags & AndTags

export type NameBody = {
  name: string
}

export type TokenBody = {
  token: string
}
