import bcrypt from 'bcrypt'
import { Router } from 'express'
import { z } from 'zod'
import { authenticate } from '../middleware/authenticate.js'
import { clearAuthCookie, createToken, setAuthCookie } from '../utils/auth.js'
import { prisma } from '../utils/prisma.js'

const router = Router()

const credentialsSchema = z.object({
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: z.string().min(8, 'Password must contain at least 8 characters.'),
})

const registrationSchema = credentialsSchema.extend({
  name: z.string().trim().min(2).max(80),
})

const publicUser = (user) => ({ id: user.id, name: user.name, email: user.email })

router.post('/register', async (req, res, next) => {
  try {
    const data = registrationSchema.parse(req.body)
    const existing = await prisma.user.findUnique({ where: { email: data.email } })

    if (existing) {
      return res.status(409).json({ message: 'An account already exists for this email.' })
    }

    const passwordHash = await bcrypt.hash(data.password, 12)
    const defaultCategories = [
      ['Git', '#f05032'],
      ['Linux', '#6f42c1'],
      ['DevOps', '#0dcaf0'],
      ['Frontend', '#42b883'],
      ['Backend', '#198754'],
      ['Database', '#fd7e14'],
    ]

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        categories: {
          create: defaultCategories.map(([name, color]) => ({ name, color })),
        },
      },
    })

    setAuthCookie(res, createToken(user.id))
    res.status(201).json({ user: publicUser(user) })
  } catch (error) {
    next(error)
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const data = credentialsSchema.parse(req.body)
    const user = await prisma.user.findUnique({ where: { email: data.email } })
    const matches = user && (await bcrypt.compare(data.password, user.passwordHash))

    if (!matches) {
      return res.status(401).json({ message: 'Email or password is incorrect.' })
    }

    setAuthCookie(res, createToken(user.id))
    res.json({ user: publicUser(user) })
  } catch (error) {
    next(error)
  }
})

router.post('/logout', (req, res) => {
  clearAuthCookie(res)
  res.status(204).send()
})

router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user })
})

export default router
