export type DBCookies = {
  cookies: string
}

export interface DBMedia {
  id: number
  path: string
  type: string
  uploaded_at: string
  location_id: number
}

export interface DBMediaWithTags {
  media_id: number
  path: string
  type: string
  uploaded_at: string
  location_id: number
  location_name: string
  people: DBTag[]
  albums: DBTag[]
}

export interface DBTag {
  id: number
  name: string
}
