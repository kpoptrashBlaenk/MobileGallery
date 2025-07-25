import { Router } from 'express'
import loginRoute from '../controllers/authentication/login'
import { findMediaRoute } from '../controllers/media/media'

// Routers
const router = Router()

router.get('/auth/login', loginRoute) // Auto Login

router.get('/media/find/:token', findMediaRoute) // Find media by token

export default router
