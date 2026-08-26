import jwt from 'jsonwebtoken'
import { prisma } from '../utils/prisma.js'
import { readToken } from '../utils/auth.js'

export async function authenticate(req, res, next) {
  try {
    const token = readToken(req)

    if (!token) {
      return res.status(401).json({ message: 'Authentication required.' })
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, name: true, email: true },
    })

    if (!user) {
      return res.status(401).json({ message: 'The user for this session no longer exists.' })
    }

    req.user = user
    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Your session is invalid or has expired.' })
    }
    return next(error)
  }
}
