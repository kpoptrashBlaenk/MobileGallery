import { Router } from 'express'
import loginRoute from '../controllers/authentication/login'

// Routers
const router = Router()

router.get('/auth/login', loginRoute) // Auto Login

export default router
