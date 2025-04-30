import { DBTag } from '@/types'
import dbQuery from '@/utils/query'
import { QueryResult } from 'pg'

// Get all from album table
export async function getAllAlbums(): Promise<QueryResult<DBTag>> {
  const query = `SELECT * FROM album ORDER BY name`

  const params: any[] = []

  return await dbQuery(query, params)
}

// Find an album from album table using name
export async function findAlbumByName(name: string): Promise<QueryResult<DBTag>> {
  const query = `SELECT * FROM album WHERE name = $1`

  const params = [name]

  return await dbQuery(query, params)
}

// Find an album from album table using id
export async function findAlbumById(id: number): Promise<QueryResult<DBTag>> {
  const query = `SELECT * FROM album WHERE id = $1`

  const params = [id]

  return await dbQuery(query, params)
}

// Get an album to album table
export async function addAlbum(name: string): Promise<void> {
  const query = `INSERT INTO album (name) VALUES($1)`

  const params = [name]

  await dbQuery(query, params)
  return
}
