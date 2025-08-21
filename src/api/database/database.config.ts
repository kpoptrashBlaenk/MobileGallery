import dotenv from 'dotenv'
import pg from 'pg'

dotenv.config()

const { Pool } = pg

// Database Connection
const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT as string),
  ssl: process.env.MODE === 'PROD' ? { rejectUnauthorized: false } : false,
})

export default pool
