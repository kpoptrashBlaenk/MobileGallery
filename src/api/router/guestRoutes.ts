import { Router } from 'express'
import verifyRoute from '../controllers/authentication/verify'
import guestOnly from './middleware/guest'

// Routers
const guestRouter = Router()

// Middlewares
guestRouter.use(guestOnly)

// Auth
guestRouter.post('/auth/verify', verifyRoute) // Verify OTP

export default guestRouter
