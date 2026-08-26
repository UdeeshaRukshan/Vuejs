import { ZodError } from 'zod'

export function notFound(req, res) {
  res.status(404).json({ message: `Route ${req.method} ${req.path} was not found.` })
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error)

  if (error instanceof ZodError) {
    return res.status(422).json({
      message: 'Please correct the invalid fields.',
      errors: error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    })
  }

  if (error.code === 'P2002') {
    return res.status(409).json({ message: 'A record with that value already exists.' })
  }

  console.error(error)
  res.status(error.status || 500).json({ message: error.message || 'An unexpected error occurred.' })
}
