import { findAlbumByName } from '@/api/routes/tag/album'
import { findLocationByName } from '@/api/routes/tag/location'
import { findPersonByName } from '@/api/routes/tag/person'

/**
 * Get an array of ids of albums
 *
 * @param albums Albums names as array
 */
export async function getAlbumsIds(albums: string[]): Promise<number[]> {
  return await Promise.all(albums.map(async (album) => await getAlbumId(album)))
}

/**
 * Get an array of ids of people
 *
 * @param people People names as array
 */
export async function getPeopleIds(people: string[]): Promise<number[]> {
  return await Promise.all(people.map(async (person) => await getPersonId(person)))
}

/**
 * Get the id of na album
 *
 * @param album Album name
 */
export async function getAlbumId(album: string): Promise<number> {
  return (await findAlbumByName(album)).rows[0].id
}

/**
 * Get the id of a person
 *
 * @param person Person name
 */
export async function getPersonId(person: string): Promise<number> {
  return (await findPersonByName(person)).rows[0].id
}

/**
 * Get the id of a location
 *
 * @param location Location name
 */
export async function getLocationId(location: string): Promise<number> {
  return (await findLocationByName(location)).rows[0].id
}
