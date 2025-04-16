import dbQuery from "@/utils/query"

// Get all from location table
export async function getAllLocations() {
    const query = `SELECT id, name FROM location ORDER BY label`
  
    const params: any[] = []
  
    return await dbQuery(query, params)
  }
  
  // Find a person from location table using name
  export async function findLocationByName(name: string) {
    const query = `SELECT * FROM location WHERE name = $1`
  
    const params = [name]
  
    return await dbQuery(query, params)
  }
  
  // Get a person to location table
  export async function addLocation(name: string) {
    const query = `INSERT INTO location (name) VALUES($1)`
  
    const params = [name]
  
    return await dbQuery(query, params)
  }