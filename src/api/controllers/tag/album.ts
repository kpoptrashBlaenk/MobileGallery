import { addAlbum, findAlbumByName, getAllAlbums } from '@/api/models/album'
import { NameBody } from '@/types'
import { Request, Response } from 'express'

export async function getAlbumRoute(req: Request, res: Response) {
  try {
    const albums = await getAllAlbums()

    res.status(200).json(albums.rows.map((album) => album.name))
    return
  } catch (error) {
    console.error(error)
    res.status(500).json('Error getting albums.')
    return
  }
}

export async function addAlbumRoute(req: Request, res: Response) {
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
}
