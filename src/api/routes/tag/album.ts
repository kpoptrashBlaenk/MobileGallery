import dbQuery from '@/utils/query'

// Get all from album table
export async function getAllAlbums() {
  const query = `SELECT id, name FROM album ORDER BY label`

  const params: any[] = []

  return await dbQuery(query, params)
}

// Find an album from album table using name
export async function findAlbumByName(name: string) {
  const query = `SELECT * FROM album WHERE name = $1`

  const params = [name]

  return await dbQuery(query, params)
}

// Get an album to album table
export async function addAlbum(name: string) {
  const query = `INSERT INTO album (name) VALUES($1)`

  const params = [name]

  return await dbQuery(query, params)
}
