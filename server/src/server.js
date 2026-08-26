import app from './app.js'
import { prisma } from './utils/prisma.js'

const port = Number(process.env.PORT) || 3000

const server = app.listen(port, () => {
  console.log(`Learning Tracker API listening on port ${port}`)
})

async function shutdown(signal) {
  console.log(`${signal} received. Shutting down.`)
  server.close(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
