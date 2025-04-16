import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
// import Auth from './routes/authentication/index'
// import Media from './routes/media/index'
// import Tag from './routes/tag/index'

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
// app.use('/api/auth', Auth)
// app.use('/api/media', Media)
// app.use('/api/tag', Tag)
app.use('/uploads', express.static('./uploads'))

export default app
