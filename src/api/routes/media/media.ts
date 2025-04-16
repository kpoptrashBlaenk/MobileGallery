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
    season?: string,
  ) {
    let query = `SELECT
      i.id AS media_id,
      i.path,
      i.type,
      i.season,
      l.id AS location_id,
      l.name AS location_name,
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object('id', p.id, 'name', p.name)
        ) FILTER (WHERE p.id IS NOT NULL), '[]'
      ) AS people,
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object('id', a.id, 'name', a.name)
        ) FILTER (WHERE a.id IS NOT NULL), '[]'
      ) AS albums
      FROM media i
      JOIN location l ON i.location_id = l.id
      LEFT JOIN media_people_relation ipr ON i.id = ipr.media_id
      LEFT JOIN people p ON ipr.people_id = p.id
      LEFT JOIN media_album_relation iar ON i.id = iar.media_id
      LEFT JOIN album a ON iar.album_id = a.id
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
              return `EXISTS (
            SELECT 1 FROM media_album_relation iar
            WHERE iar.media_id = i.id
            AND iar.album_id = $${params.length - index}
          )`
            })
            .join(' AND '),
        )
        // If OR
      } else {
        params.push(albums)
  
        filters.push(`EXISTS (
          SELECT 1 FROM media_album_relation iar
          WHERE iar.media_id = i.id
          AND iar.album_id = ANY($${params.length})
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
              return `EXISTS (
            SELECT 1 FROM media_people_relation ipr
            WHERE ipr.media_id = i.id
            AND ipr.people_id = $${params.length - index}
          )`
            })
            .join(' AND '),
        )
        // If OR
      } else {
        params.push(people)
  
        filters.push(`EXISTS (
          SELECT 1 FROM media_people_relation ipr
          WHERE ipr.media_id = i.id
          AND ipr.people_id = ANY($${params.length})
          )`)
      }
    }
  
    // Location
    if (location) {
      params.push(location)
      filters.push(`i.location_id = $${params.length}`)
    }
  
    // Season
    if (season) {
      params.push(season)
      filters.push(`i.season = $${params.length}`)
    }
  
    // Where & And
    if (filters.length !== 0) {
      query += ' WHERE ' + filters.join(' AND ')
    }
  
    // Group By
    query += ' GROUP BY i.id, l.id'
  
    // Order By & Limit
    params.push(offset + MEDIA_BULK_LIMIT)
    query += ` ORDER BY i.uploaded_at DESC LIMIT $${params.length}`
  
    // Offset
    params.push(offset)
    query += ` OFFSET $${params.length}`
  
    return await dbQuery(query, params)
  }