import { Router } from 'express'
import fs from 'fs'
import multer from 'multer'
import qrRoute from '../controllers/authentication/qr'
import { deleteMediaRoute, editMediaRoute, getMediaRoute, uploadMediaRoute } from '../controllers/media/media'
import { addAlbumRoute, getAlbumRoute } from '../controllers/tag/album'
import { addLocationRoute, getLocationRoute } from '../controllers/tag/location'
import { addPersonRoute, getPersonRoute } from '../controllers/tag/person'
import authOnly from './middleware/auth'

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

// Routers
const authRouter = Router()

// Middlewares
authRouter.use(authOnly)

// Auth
authRouter.get('/auth/qr', qrRoute) // Generate QR code

// Tag/Person
authRouter.get('/tag/person/get', getPersonRoute) // Get all people
authRouter.post('/tag/person/add', addPersonRoute) // Add a person

// Tag/Album
authRouter.get('/tag/album/get', getAlbumRoute) // Get all albums
authRouter.post('/tag/album/add', addAlbumRoute) // Add an album

// Tag/Location
authRouter.get('/tag/location/get', getLocationRoute) // Get all locations
authRouter.post('/tag/location/add', addLocationRoute) // Add an location

// Media
authRouter.post('/media/get', getMediaRoute) // Get all medias
authRouter.post('/media/upload', upload.array('medias'), uploadMediaRoute) // Upload a media
authRouter.post('/media/edit', editMediaRoute) // Edit a media
authRouter.post('/media/delete', deleteMediaRoute) // Delete a media

export default authRouter
