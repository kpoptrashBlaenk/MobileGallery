import { ChosenTags, IdBody, MediaEditBody, MediaFilterBody } from '@/types'
import { getAlbumsIds, getLocationId, getPeopleIds } from '@/utils/tagIds'
import express, { Request, Response } from 'express'
import fs from 'fs'
import multer from 'multer'
import path from 'path'
import { findAlbumByName } from '../tag/album'
import { findLocationByName } from '../tag/location'
import { findPersonByName } from '../tag/person'
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
} from './media'

const router = express.Router()

// Save locally
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = './uploads'
      if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true })
      cb(null, uploadPath)
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`)
    },
  }),
  limits: { fileSize: 1000 * 1024 * 1024 },
})

// Get Medias
router.post('/get', async (req: Request, res: Response) => {
  const { albums, location, people, season, albumsIsAnd, personIsAnd, offset }: MediaFilterBody = req.body

  try {
    // Get medias from database
    const albumIds = await getAlbumsIds(albums)
    const locationId = await getLocationId(location)
    const peopleIds = await getPeopleIds(people)
    const medias = await getAllMedias(offset, albumsIsAnd, personIsAnd, albumIds, locationId, peopleIds, season)

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
})

// Upload Media
router.post('/upload', upload.array('medias'), async (req: Request, res: Response) => {
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
      const filePath = path.join('./uploads', media.filename)

      // Upload media to database
      const uploadedMedia = await uploadMedia(filePath, media.mimetype, season, await getLocationId(location))

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
})

// Edit Media
router.post('/edit', async (req: Request, res: Response) => {
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

    res.status(200).json('Media updated successfully!')
    return
  } catch (error) {
    console.error(error)
    res.status(500).json('Error updating media.')
    return
  }
})

// Delete Media
router.post('/delete', async (req: Request, res: Response) => {
  const { id }: IdBody = req.body

  // Check media
  if (!id) {
    res.status(422).json('No media selected.')
    return
  }

  try {
    // Check if media exists
    const existingMedia = await findMediaById(id)
    if (!existingMedia) {
      res.status(404).json(`Media ${id} not found.`)
      return
    }

    // Delete locally
    fs.unlink('./uploads', (error) => {
      if (error) throw new Error(error.message)
    })

    // Delete from database
    await deleteMedia(id)

    res.status(200).json('Media deleted successfully')
  } catch (error) {
    console.error(error)
    res.status(500).json('Error deleting media')
  }
})

export default router
