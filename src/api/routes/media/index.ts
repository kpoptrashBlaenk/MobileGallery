import express, { Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import multer from 'multer'
import { getAllMedias } from './media'

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
  const { albums, location, people, season, albumsIsAnd, personIsAnd, offset }: any = req.body // TODO: Type

  try {
    // Get medias from database
    const medias = await getAllMedias(offset, albumsIsAnd, personIsAnd, albums, location, people, season)

    const base64Medias = Promise.all(
      medias.rows.map(async (media) => {
        return {
          ...media,
          media: `${req.protocol}://${req.get('host')}/uploads/${path.basename(media.path)}`,
        }
      })
    )

    res.status(200).json(await base64Medias)
    return
  } catch (error) {
    console.error(error)
    res.status(500).json('Error getting medias.')
    return
  }
})

export default router
