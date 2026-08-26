import { Router } from 'express'
import { z } from 'zod'
import { authenticate } from '../middleware/authenticate.js'
import { prisma } from '../utils/prisma.js'

const router = Router()
router.use(authenticate)

const entrySchema = z.object({
  title: z.string().trim().min(1).max(160),
  content: z.string().trim().min(1).max(20000),
  codeSnippet: z.string().max(20000).optional().nullable().transform((value) => value || null),
  learnedAt: z.iso.date(),
  categoryId: z.string().min(1),
})

function toDatabaseData(data) {
  return { ...data, learnedAt: new Date(`${data.learnedAt}T00:00:00.000Z`) }
}

async function categoryBelongsToUser(categoryId, userId) {
  return prisma.category.findFirst({ where: { id: categoryId, userId }, select: { id: true } })
}

router.get('/', async (req, res, next) => {
  try {
    const query = z.object({
      search: z.string().trim().optional(),
      categoryId: z.string().optional(),
      from: z.iso.date().optional(),
      to: z.iso.date().optional(),
    }).parse(req.query)

    const learnedAt = {}
    if (query.from) learnedAt.gte = new Date(`${query.from}T00:00:00.000Z`)
    if (query.to) learnedAt.lte = new Date(`${query.to}T00:00:00.000Z`)

    const entries = await prisma.learningEntry.findMany({
      where: {
        userId: req.user.id,
        ...(query.categoryId && { categoryId: query.categoryId }),
        ...(Object.keys(learnedAt).length && { learnedAt }),
        ...(query.search && {
          OR: [
            { title: { contains: query.search, mode: 'insensitive' } },
            { content: { contains: query.search, mode: 'insensitive' } },
            { codeSnippet: { contains: query.search, mode: 'insensitive' } },
          ],
        }),
      },
      include: { category: true },
      orderBy: [{ learnedAt: 'desc' }, { createdAt: 'desc' }],
    })

    res.json({ entries })
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const entry = await prisma.learningEntry.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: { category: true },
    })
    if (!entry) return res.status(404).json({ message: 'Learning entry not found.' })
    res.json({ entry })
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const data = entrySchema.parse(req.body)
    if (!(await categoryBelongsToUser(data.categoryId, req.user.id))) {
      return res.status(422).json({ message: 'Choose one of your categories.' })
    }

    const entry = await prisma.learningEntry.create({
      data: { ...toDatabaseData(data), userId: req.user.id },
      include: { category: true },
    })
    res.status(201).json({ entry })
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const data = entrySchema.parse(req.body)
    const current = await prisma.learningEntry.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      select: { id: true },
    })
    if (!current) return res.status(404).json({ message: 'Learning entry not found.' })
    if (!(await categoryBelongsToUser(data.categoryId, req.user.id))) {
      return res.status(422).json({ message: 'Choose one of your categories.' })
    }

    const entry = await prisma.learningEntry.update({
      where: { id: current.id },
      data: toDatabaseData(data),
      include: { category: true },
    })
    res.json({ entry })
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const result = await prisma.learningEntry.deleteMany({
      where: { id: req.params.id, userId: req.user.id },
    })
    if (!result.count) return res.status(404).json({ message: 'Learning entry not found.' })
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export default router
