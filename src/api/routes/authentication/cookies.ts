import dbQuery from "@/utils/query"

// Add cookies into session table
export async function saveCookies(cookies: string) {
  const query = `INSERT INTO session (cookies) VALUES ($1)`

  const params = [cookies]

  return await dbQuery(query, params)
}

// Find cookies in session table using cookies
export async function findCookiesByCookies(cookies: string) {
  const query = `SELECT * FROM session WHERE cookies = $1`

  const params = [cookies]

  return await dbQuery(query, params)
}
