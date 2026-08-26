import 'dotenv/config'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import authRoutes from './routes/authRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import entryRoutes from './routes/entryRoutes.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required.')
}

const app = express()

const allowedOrigins = (
  process.env.CLIENT_URL || 'http://localhost:5173'
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

// Matches your Vercel preview deployment URLs.
const vercelPreviewPattern =
  /^https:\/\/vuejs-[a-z0-9-]+-udeeshas-projects\.vercel\.app$/

const corsOptions = {
  credentials: true,

  origin(origin, callback) {
    const allowed =
      !origin ||
      allowedOrigins.includes(origin) ||
      vercelPreviewPattern.test(origin)

    if (allowed) {
      return callback(null, true)
    }

    const error = new Error(
      `Origin ${origin} is not allowed to access the API.`,
    )

    error.status = 403
    callback(error)
  },
}

app.set('trust proxy', 1)

app.use(cors(corsOptions))
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/entries', entryRoutes)

app.use(notFound)
app.use(errorHandler)

export default app