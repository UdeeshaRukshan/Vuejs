import { Router } from 'express'
import { z } from 'zod'
import { authenticate } from '../middleware/authenticate.js'
import { prisma } from '../utils/prisma.js'

const router = Router()

router.use(authenticate)

const categorySchema = z.object({
  name: z.string().trim().min(1).max(50),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Choose a valid hex colour.'),
})

router.get('/', async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: { userId: req.user.id },
      include: { _count: { select: { entries: true } } },
      orderBy: { name: 'asc' },
    })
    res.json({ categories })
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const data = categorySchema.parse(req.body)
    const category = await prisma.category.create({
      data: { ...data, userId: req.user.id },
      include: { _count: { select: { entries: true } } },
    })
    res.status(201).json({ category })
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const data = categorySchema.parse(req.body)
    const result = await prisma.category.updateMany({
      where: { id: req.params.id, userId: req.user.id },
      data,
    })

    if (!result.count) return res.status(404).json({ message: 'Category not found.' })

    const category = await prisma.category.findUnique({
      where: { id: req.params.id },
      include: { _count: { select: { entries: true } } },
    })
    res.json({ category })
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const category = await prisma.category.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: { _count: { select: { entries: true } } },
    })

    if (!category) return res.status(404).json({ message: 'Category not found.' })
    if (category._count.entries > 0) {
      return res.status(409).json({ message: 'Move or delete this category’s entries first.' })
    }

    await prisma.category.delete({ where: { id: category.id } })
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export default router
