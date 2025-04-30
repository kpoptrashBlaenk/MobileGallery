import { DBTag } from '@/types'
import dbQuery from '@/utils/query'
import { QueryResult } from 'pg'

// Get all from location table
export async function getAllLocations(): Promise<QueryResult<DBTag>> {
  const query = `SELECT * FROM location ORDER BY name`

  const params: any[] = []

  return await dbQuery(query, params)
}

// Find a person from location table using name
export async function findLocationByName(name: string): Promise<QueryResult<DBTag>> {
  const query = `SELECT * FROM location WHERE name = $1`

  const params = [name]

  return await dbQuery(query, params)
}

// Find a person from location table using id
export async function findLocationById(id: number): Promise<QueryResult<DBTag>> {
  const query = `SELECT * FROM location WHERE id = $1`

  const params = [id]

  return await dbQuery(query, params)
}

// Get a person to location table
export async function addLocation(name: string): Promise<void> {
  const query = `INSERT INTO location (name) VALUES($1)`

  const params = [name]

  await dbQuery(query, params)
  return
}
