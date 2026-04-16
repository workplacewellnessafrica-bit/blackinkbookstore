import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function check() {
  const zones = await prisma.shippingZone.findMany()
  console.log('Current Shipping Zones in DB:')
  console.table(zones)
  process.exit(0)
}
check()
