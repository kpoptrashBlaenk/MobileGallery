import { addLocation, findLocationByName, getAllLocations } from '@/api/models/location'
import { NameBody } from '@/types'
import { Request, Response } from 'express'

export async function getLocationRoute(req: Request, res: Response) {
  try {
    const locations = await getAllLocations()

    res.status(200).json(locations.rows.map((location) => location.name))
    return
  } catch (error) {
    console.error(error)
    res.status(500).json('Error getting location.')
    return
  }
}

export async function addLocationRoute(req: Request, res: Response) {
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
}
