import dbQuery from '@/utils/query'

// Get all people from person table
export async function getAllPeople() {
  const query = `SELECT id, name FROM people ORDER BY label`

  const params: any[] = []

  return await dbQuery(query, params)
}

// Find a person from person table using name
export async function findPersonByName(name: string) {
  const query = `SELECT * FROM people WHERE name = $1`

  const params = [name]

  return await dbQuery(query, params)
}

// Find a person from person table using id
export async function findPersonById(id: number) {
  const query = `SELECT * FROM people WHERE id = $1`

  const params = [id]

  return await dbQuery(query, params)
}

// Get a person to person table
export async function addPerson(name: string) {
  const query = `INSERT INTO people (name) VALUES($1)`

  const params = [name]

  return await dbQuery(query, params)
}
