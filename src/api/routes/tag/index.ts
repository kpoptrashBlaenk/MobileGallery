import { NameBody } from '@/types'
import express, { Request, Response } from 'express'
import { addAlbum, findAlbumByName, getAllAlbums } from './album'
import { addLocation, findLocationByName, getAllLocations } from './location'
import { addPerson, findPersonByName, getAllPeople } from './person'

const router = express.Router()

// Get all people
router.get('/person/get', async (req: Request, res: Response) => {
  try {
    const people = await getAllPeople()

    res.status(200).json(people.rows.map((person) => person.name))
    return
  } catch (error) {
    console.error(error)
    res.status(500).json('Error getting people.')
    return
  }
})

// Add a person
router.post('/person/add', async (req: Request, res: Response) => {
  const { name }: NameBody = req.body

  if (!name || name.length === 0) {
    res.status(422).json('No name provided.')
    return
  }

  try {
    const people = await findPersonByName(name)

    if (people.rowCount !== 0) {
      res.status(409).json('Person exists already.')
      return
    }

    await addPerson(name)

    res.status(200).json('Person added successfully.')
    return
  } catch (error) {
    console.error(error)
    res.status(500).json('Error adding person.')
    return
  }
})

// Get all albums
router.get('/album/get', async (req: Request, res: Response) => {
  try {
    const albums = await getAllAlbums()

    res.status(200).json(albums.rows.map((album) => album.name))
    return
  } catch (error) {
    console.error(error)
    res.status(500).json('Error getting albums.')
    return
  }
})

// Add an album
router.post('/album/add', async (req: Request, res: Response) => {
  const { name }: NameBody = req.body

  if (!name || name.length === 0) {
    res.status(422).json('No name provided.')
    return
  }

  try {
    const people = await findAlbumByName(name)

    if (people.rowCount !== 0) {
      res.status(409).json('Album exists already.')
      return
    }

    await addAlbum(name)

    res.status(200).json('Album added successfully.')
    return
  } catch (error) {
    console.error(error)
    res.status(500).json('Error adding album.')
    return
  }
})

// Get all location
router.get('/location/get', async (req: Request, res: Response) => {
  try {
    const locations = await getAllLocations()

    res.status(200).json(locations.rows.map((location) => location.name))
    return
  } catch (error) {
    console.error(error)
    res.status(500).json('Error getting location.')
    return
  }
})

// Add a location
router.post('/location/add', async (req: Request, res: Response) => {
  const { name }: NameBody = req.body

  if (!name || name.length === 0) {
    res.status(422).json('No name provided.')
    return
  }

  try {
    const location = await findLocationByName(name)

    if (location.rowCount !== 0) {
      res.status(409).json('Location exists already.')
      return
    }

    await addLocation(name)

    res.status(200).json('Location added successfully.')
    return
  } catch (error) {
    console.error(error)
    res.status(500).json('Error adding lcoation.')
    return
  }
})

export default router
