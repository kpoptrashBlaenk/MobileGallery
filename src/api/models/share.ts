import dbQuery from '@/utils/query'

// Add share token into share token table
export async function saveShareToken(mediaId: number, token: string): Promise<void> {
  const query = `INSERT INTO share_token (media_id, token) VALUES ($1, $2)`

  const params = [mediaId, token]

  await dbQuery(query, params)
  return
}

// Find share token in sahre token table
export async function findShareToken(token: string): Promise<any> {
  const query = `SELECT *
  FROM share_token AS st
  JOIN media AS m ON m.id = st.media_id
  WHERE st.token = $1
  `

  const params = [token]

  return await dbQuery(query, params)
}
