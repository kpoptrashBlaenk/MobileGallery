import { MEDIA_BULK_LIMIT } from '@/configs'
import dbQuery from '@/utils/query'

// Get all medias from media table
export async function getAllMedias(
  offset: number,
  albumsIsAnd: boolean,
  peopleIsAnd: boolean,
  albums?: number[],
  location?: number,
  people?: number[],
  season?: string
) {
  let query = `SELECT 
  m.id AS media_id,
  m.path,
  m.type,
  m.season,
  l.id AS location_id,
  l.name AS location_name,
  COALESCE(
    json_agg(
      jsonb_build_object('person_id', p.id, 'person_name', p.name)
    )
  ) AS people,
  COALESCE(
    json_agg(
      jsonb_build_object('album_id', a.id, 'album_name', a.name)
    )
  ) AS albums
  FROM media m
  JOIN location l ON m.location_id = l.id
  LEFT JOIN media_person_relation mpr ON m.id = mpr.media_id
  LEFT JOIN people p ON mpr.people_id = p.id
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
          .join(' AND ')
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
          .join(' AND ')
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
export async function findMediaById(id: number) {
  const query = `SELECT * FROM media WHERE id = $1`

  const params = [id]

  return await dbQuery(query, params)
}

// Add media into the media table
export async function uploadMedia(path: string, type: string, season: string, location_id: number) {
  const query = `INSERT INTO media (path, type, season, location_id) VALUES ($1, $2, $3, $4) RETURNING id`

  const params = [path, type, season, location_id]

  return await dbQuery(query, params)
}

// Add media and person into the media person relation
export async function addMediaPersonRelation(media_id: number, person_id: number) {
  const query = `INSERT INTO media_person_relation (media_id, person_id) VALUES ($1, $2)`

  const params = [media_id, person_id]

  return await dbQuery(query, params)
}

// Add media and album into the media album relation
export async function addMediaAlbumRelation(media_id: number, album_id: number) {
  const query = `INSERT INTO media_album_relation (media_id, album_id) VALUES ($1, $2)`

  const params = [media_id, album_id]

  return await dbQuery(query, params)
}

// Update media from media table
export async function updateMedia(media_id: number, season: string, location_id: number) {
  const query = `UPDATE media SET season = $2, location_id = $3 WHERE id = $1`

  const params = [media_id, season, location_id]

  return await dbQuery(query, params)
}

// Delete media from media table
export async function deleteMedia(media_id: number) {
  const query = `DELETE FROM media WHERE id = $1`

  const params = [media_id]

  return await dbQuery(query, params)
}

// Delete media and person from the media person relation
export async function deleteMediaPersonRelation(media_id: number) {
  const query = `DELETE FROM media_person_relation WHERE media_id = $1`

  const params = [media_id]

  return await dbQuery(query, params)
}

// Delete media and album from the media album relation
export async function deleteMediaAlbumRelation(media_id: number) {
  const query = `DELETE FROM media_album_relation WHERE media_id = $1`

  const params = [media_id]

  return await dbQuery(query, params)
}
