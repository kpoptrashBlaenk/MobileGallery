import pool from '@/api/database/database.config'
import { QueryResult } from 'pg'

async function dbQuery(query: string, params: any[] = []): Promise<QueryResult> {
  try {
    const result = await pool.query(query, params)
    return result
  } catch (error) {
    console.error(error)
    throw new Error()
  }
}

export default dbQuery
