import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const zones = await prisma.shippingZone.findMany({
      orderBy: { fee: 'asc' }
    })
    return NextResponse.json(zones)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch shipping zones' }, { status: 500 })
  }
}
