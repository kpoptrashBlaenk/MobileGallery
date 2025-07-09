import { findAlbumByName } from '@/api/models/album'
import { findLocationByName } from '@/api/models/location'
import {
  addMediaAlbumRelation,
  addMediaPersonRelation,
  deleteMedia,
  deleteMediaAlbumRelation,
  deleteMediaPersonRelation,
  findMediaById,
  getAllMedias,
  updateMedia,
  uploadMedia,
} from '@/api/models/media'
import { findPersonByName } from '@/api/models/person'
import { ChosenTags, IdBody, MediaEditBody, MediaFilterBody } from '@/types'
import { getAlbumsIds, getLocationId, getPeopleIds } from '@/utils/tagIds'
import { Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

export async function getMediaRoute(req: Request, res: Response) {
  const { albums, location, people, season, albumsIsAnd, peopleIsAnd }: MediaFilterBody = req.body

  try {
    // Get medias from database
    const albumIds = await getAlbumsIds(albums)
    const locationId = await getLocationId(location)
    const peopleIds = await getPeopleIds(people)
    const medias = await getAllMedias(albumsIsAnd, peopleIsAnd, albumIds, locationId, peopleIds, season)

    const base64Medias = Promise.all(
      medias.rows.map(async (media) => {
        return {
          ...media,
          media: `${req.protocol}://${req.get('host')}/uploads/${path.basename(media.path)}`,
        }
      }),
    )

    res.status(200).json(await base64Medias)
    return
  } catch (error) {
    console.error(error)
    res.status(500).json('Error getting medias.')
    return
  }
}

export async function uploadMediaRoute(req: Request, res: Response) {
  const medias = req.files as Express.Multer.File[]
  const { people, location, season, albums }: ChosenTags = JSON.parse(req.body.tags)

  // Check media
  if (!medias || medias.length === 0) {
    res.status(422).json('No medias selected.')
    return
  }

  // Check location
  if (!location || location.length === 0) {
    res.status(422).json('No location selected.')
    return
  }

  // Check season
  if (!season || season.length === 0) {
    res.status(422).json('No season selected.')
    return
  }

  try {
    // Check if people exist
    for (const person of people) {
      const existingPerson = await findPersonByName(person)
      if (!existingPerson) {
        res.status(404).json(`Person ${person} not found.`)
        return
      }
    }

    // Check if albums exist
    for (const album of albums) {
      const existingAlbum = await findAlbumByName(album)
      if (!existingAlbum) {
        res.status(404).json(`Album ${album} not found.`)
        return
      }
    }

    // Check if location exists
    const existingLocation = await findLocationByName(location)
    if (!existingLocation) {
      res.status(404).json(`Location ${location} not found.`)
      return
    }

    // For each media
    const promises = medias.map(async (media) => {
      // Use sharp to get metadata
      const metadata = await sharp(media.path).metadata()

      // Upload media to database
      const uploadedMedia = await uploadMedia(
        media.path,
        media.mimetype,
        media.filename,
        media.size,
        metadata.width,
        metadata.height,
        season,
        await getLocationId(location),
      )

      // Add media person relations
      const peopleIds = await getPeopleIds(people)
      const peoplePromises = await Promise.all(
        peopleIds.map((personId) => addMediaPersonRelation(uploadedMedia.rows[0].id, personId)),
      )

      await Promise.all(peoplePromises)

      // Add media album relations
      const albumsIds = await getAlbumsIds(albums)
      const albumPromises = albumsIds.map(async (album) => {
        await addMediaAlbumRelation(uploadedMedia.rows[0].id, album)
      })

      await Promise.all(albumPromises)
    })

    await Promise.all(promises)

    res.status(200).json('Medias uploaded successfully!')
    return
  } catch (error) {
    console.error(error)
    res.status(500).json('Error uploading medias.')
    return
  }
}

export async function editMediaRoute(req: Request, res: Response) {
  const { people, location, season, albums, id }: MediaEditBody = req.body

  // Check media
  if (!id) {
    res.status(422).json('No media selected.')
    return
  }

  // Check location
  if (!location) {
    res.status(422).json('No location selected.')
    return
  }

  // Check season
  if (!season || season.length === 0) {
    res.status(422).json('No season selected.')
    return
  }

  try {
    // Check if media exists
    const existingMedia = await findMediaById(id)
    if (!existingMedia) {
      res.status(404).json(`Media ${id} not found.`)
      return
    }

    // Check if people exist
    for (const person of people) {
      const existingPerson = await findPersonByName(person)
      if (!existingPerson) {
        res.status(404).json(`Person ${person} not found.`)
        return
      }
    }

    // Check if albums exist
    for (const album of albums) {
      const existingAlbum = await findAlbumByName(album)
      if (!existingAlbum) {
        res.status(404).json(`Album ${album} not found.`)
        return
      }
    }

    // Check if location exists
    const existingLocation = await findLocationByName(location)
    if (!existingLocation) {
      res.status(404).json(`Location ${location} not found.`)
      return
    }

    // Update Media
    await updateMedia(id, season, await getLocationId(location))

    // Delete all media people relations
    await deleteMediaPersonRelation(id)

    // Delete all media album relations
    await deleteMediaAlbumRelation(id)

    // Add media people relations
    const peopleIds = await getPeopleIds(people)
    const peoplePromises = peopleIds.map(async (person) => {
      await addMediaPersonRelation(id, person)
    })
    await Promise.all(peoplePromises)

    // Add media album relations
    const albumsIds = await getAlbumsIds(albums)
    const albumPromises = albumsIds.map(async (album) => {
      await addMediaAlbumRelation(id, album)
    })
    await Promise.all(albumPromises)

    res.status(200).json('Media edited successfully!')
    return
  } catch (error) {
    console.error(error)
    res.status(500).json('Error editing media.')
    return
  }
}

export async function deleteMediaRoute(req: Request, res: Response) {
  const { id }: IdBody = req.body

  // Check media
  if (!id) {
    res.status(422).json('No media selected.')
    return
  }

  try {
    // Check if media exists
    const existingMedia = await findMediaById(id)
    if (!existingMedia || existingMedia.rowCount === 0) {
      res.status(404).json(`Media ${id} not found.`)
      return
    }

    // Delete locally
    fs.unlink(existingMedia.rows[0].path, (error) => {
      if (error) throw new Error(error.message)
    })

    // Delete from database
    await deleteMedia(id)

    res.status(200).json('Media deleted successfully')
  } catch (error) {
    console.error(error)
    res.status(500).json('Error deleting media')
  }
}
