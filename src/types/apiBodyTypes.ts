import { ChosenTags, AndTags } from './tagTypes'

export type IdBody = {
  id: number
}

export type MediaEditBody = ChosenTags & IdBody

export interface MediaFilterBody extends ChosenTags, AndTags {
  offset: number
}

export type NameBody = {
  name: string
}

export type TokenBody = {
  token: string
}
