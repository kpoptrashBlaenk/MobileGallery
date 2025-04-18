import { DBTag } from '@/types'
import dbQuery from '@/utils/query'
import { QueryResult } from 'pg'

// Get all people from person table
export async function getAllPeople(): Promise<QueryResult<DBTag>> {
  const query = `SELECT id, name FROM people ORDER BY label`

  const params: any[] = []

  return await dbQuery(query, params)
}

// Find a person from person table using name
export async function findPersonByName(name: string): Promise<QueryResult<DBTag>> {
  const query = `SELECT * FROM people WHERE name = $1`

  const params = [name]

  return await dbQuery(query, params)
}

// Find a person from person table using id
export async function findPersonById(id: number): Promise<QueryResult<DBTag>> {
  const query = `SELECT * FROM people WHERE id = $1`

  const params = [id]

  return await dbQuery(query, params)
}

// Get a person to person table
export async function addPerson(name: string): Promise<void> {
  const query = `INSERT INTO people (name) VALUES($1)`

  const params = [name]

  await dbQuery(query, params)
  return
}
