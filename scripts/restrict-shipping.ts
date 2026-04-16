import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function cleanup() {
  console.log('Restricting database to strictly Wells Fargo and G4S...')
  const deleted = await prisma.shippingZone.deleteMany({
    where: { 
      NOT: {
        provider: { in: ['G4S', 'Wells Fargo'] }
      }
    }
  })
  console.log(`Deleted ${deleted.count} entries not matching constraints.`)
  process.exit(0)
}
cleanup()
