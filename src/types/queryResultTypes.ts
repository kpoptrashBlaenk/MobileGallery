export type DBCookies = {
  cookies: string
}

export interface DBMedia {
  id: number
  path: string
  type: string
  name: string
  size: number
  width: number
  height: number
  uploaded_at: string
  season: string
  location_id: number
}

export interface DBMediaWithTags {
  media_id: number
  path: string
  type: string
  name: string
  size: number
  width: number
  height: number
  uploaded_at: string
  season: string
  location_id: number
  location_name: string
  people: DBTag[]
  albums: DBTag[]
}

export interface DBMediaWithTagsAndPath extends DBMediaWithTags {
  media: string // url
}

export interface DBTag {
  id: number
  name: string
}
