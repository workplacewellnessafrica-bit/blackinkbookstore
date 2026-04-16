import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function cleanup() {
  console.log('Cleaning up old Standard shipping zones...')
  const deleted = await prisma.shippingZone.deleteMany({
    where: { provider: 'Standard' }
  })
  console.log(`Deleted ${deleted.count} old zones.`)
  process.exit(0)
}
cleanup()
