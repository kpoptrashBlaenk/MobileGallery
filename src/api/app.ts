import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import authRouter from './router/authRoutes'
import guestRouter from './router/guestRoutes'
import router from './router/otherRoutes'

const app = express()

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  }),
)

app.use(express.json({ limit: '1000mb' })) // To use JSON
app.use(cookieParser())

// Routes
app.use('/api/auth', authRouter)
app.use('/api/guest', guestRouter)
app.use('/api', router)

app.use('/uploads', express.static('C:/Projects/uploads'))

export default app
