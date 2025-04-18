import { DBCookies } from '@/types'
import dbQuery from '@/utils/query'
import { QueryResult } from 'pg'

// Add cookies into session table
export async function saveCookies(cookies: string): Promise<void> {
  const query = `INSERT INTO session (cookies) VALUES ($1)`

  const params = [cookies]

  await dbQuery(query, params)
  return
}

// Find cookies in session table using cookies
export async function findCookiesByCookies(cookies: string): Promise<QueryResult<DBCookies>> {
  const query = `SELECT * FROM session WHERE cookies = $1`

  const params = [cookies]

  return await dbQuery(query, params)
}
