import { DBTag } from '@/types'
import dbQuery from '@/utils/query'
import { QueryResult } from 'pg'

// Get all people from person table
export async function getAllPeople(): Promise<QueryResult<DBTag>> {
  const query = `SELECT * FROM person ORDER BY name`

  const params: any[] = []

  return await dbQuery(query, params)
}

// Find a person from person table using name
export async function findPersonByName(name: string): Promise<QueryResult<DBTag>> {
  const query = `SELECT * FROM person WHERE name = $1`

  const params = [name]

  return await dbQuery(query, params)
}

// Get a person to person table
export async function addPerson(name: string): Promise<void> {
  const query = `INSERT INTO person (name) VALUES($1)`

  const params = [name]

  await dbQuery(query, params)
  return
}
