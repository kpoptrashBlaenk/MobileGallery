import { MEDIA_BULK_LIMIT } from '@/configs'
import { DBMedia, DBMediaWithTags, IdBody } from '@/types'
import dbQuery from '@/utils/query'
import { QueryResult } from 'pg'

// Get all medias from media table
export async function getAllMedias(
  offset: number,
  albumsIsAnd: boolean,
  peopleIsAnd: boolean,
  albums?: number[],
  location?: number,
  people?: number[],
  season?: string,
): Promise<QueryResult<DBMediaWithTags>> {
  let query = `SELECT 
  m.id AS media_id,
  m.path,
  m.type,
  m.season,
  l.id AS location_id,
  l.name AS location_name,
  COALESCE(
    json_agg(
      jsonb_build_object('id', p.id, 'name', p.name)
    )
  ) AS people,
  COALESCE(
    json_agg(
      jsonb_build_object('id', a.id, 'name', a.name)
    )
  ) AS albums
  FROM media m
  JOIN location l ON m.location_id = l.id
  LEFT JOIN media_person_relation mpr ON m.id = mpr.media_id
  LEFT JOIN person p ON mpr.person_id = p.id
  LEFT JOIN media_album_relation mar ON m.id = mar.media_id
  LEFT JOIN album a ON mar.album_id = a.id
  `

  const params: any[] = []
  const filters: string[] = []

  // Albums
  if (albums && albums.length !== 0) {
    if (albumsIsAnd) {
      // If AND
      albums.forEach((album) => params.push(album))

      filters.push(
        albums
          .map((album, index) => {
            return `--sql EXISTS (
            SELECT 1 FROM media_album_relation mar
            WHERE mar.media_id = m.id
            AND mar.album_id = $${params.length - index}
          )`
          })
          .join(' AND '),
      )
      // If OR
    } else {
      params.push(albums)

      filters.push(`--sql EXISTS (
          SELECT 1 FROM media_album_relation mar
          WHERE mar.media_id = i.id
          AND mar.album_id = ANY($${params.length})
          )`)
    }
  }

  // People
  if (people && people.length !== 0) {
    if (peopleIsAnd) {
      // If AND
      people.forEach((person) => params.push(person))

      filters.push(
        people
          .map((person, index) => {
            return `--sql EXISTS (
            SELECT 1 FROM media_person_relation mpr
            WHERE mpr.media_id = i.id
            AND mpr.people_id = $${params.length - index}
          )`
          })
          .join(' AND '),
      )
      // If OR
    } else {
      params.push(people)

      filters.push(`--sql EXISTS (
          SELECT 1 FROM media_person_relation mpr
          WHERE mpr.media_id = i.id
          AND mpr.people_id = ANY($${params.length})
          )`)
    }
  }

  // Location
  if (location) {
    params.push(location)
    filters.push(`--sql m.location_id = $${params.length}`)
  }

  // Season
  if (season) {
    params.push(season)
    filters.push(`--sql m.season = $${params.length}`)
  }

  // Where & And
  if (filters.length !== 0) {
    query += ' WHERE ' + filters.join(' AND ')
  }

  // Group By
  query += `--sql GROUP BY m.id, l.id`

  // Order By & Limit
  params.push(offset + MEDIA_BULK_LIMIT)
  query += `--sql ORDER BY m.uploaded_at DESC LIMIT $${params.length}`

  // Offset
  params.push(offset)
  query += `--sql OFFSET $${params.length}`

  return await dbQuery(query, params)
}

// Find an media from media table
export async function findMediaById(id: number): Promise<QueryResult<DBMedia>> {
  const query = `SELECT * FROM media WHERE id = $1`

  const params = [id]

  return await dbQuery(query, params)
}

// Add media into the media table
export async function uploadMedia(path: string, type: string, season: string, location_id: number): Promise<QueryResult<IdBody>> {
  const query = `INSERT INTO media (path, type, season, location_id) VALUES ($1, $2, $3, $4) RETURNING id`

  const params = [path, type, season, location_id]

  return await dbQuery(query, params)
}

// Add media and person into the media person relation
export async function addMediaPersonRelation(media_id: number, person_id: number): Promise<void> {
  const query = `INSERT INTO media_person_relation (media_id, person_id) VALUES ($1, $2)`

  const params = [media_id, person_id]

  await dbQuery(query, params)
  return
}

// Add media and album into the media album relation
export async function addMediaAlbumRelation(media_id: number, album_id: number): Promise<void> {
  const query = `INSERT INTO media_album_relation (media_id, album_id) VALUES ($1, $2)`

  const params = [media_id, album_id]

  await dbQuery(query, params)
  return
}

// Update media from media table
export async function updateMedia(media_id: number, season: string, location_id: number): Promise<void> {
  const query = `UPDATE media SET season = $2, location_id = $3 WHERE id = $1`

  const params = [media_id, season, location_id]

  await dbQuery(query, params)
  return
}

// Delete media from media table
export async function deleteMedia(media_id: number): Promise<void> {
  const query = `DELETE FROM media WHERE id = $1`

  const params = [media_id]

  await dbQuery(query, params)
  return
}

// Delete media and person from the media person relation
export async function deleteMediaPersonRelation(media_id: number): Promise<void> {
  const query = `DELETE FROM media_person_relation WHERE media_id = $1`

  const params = [media_id]

  await dbQuery(query, params)
  return
}

// Delete media and album from the media album relation
export async function deleteMediaAlbumRelation(media_id: number): Promise<void> {
  const query = `DELETE FROM media_album_relation WHERE media_id = $1`

  const params = [media_id]

  await dbQuery(query, params)
  return
}
