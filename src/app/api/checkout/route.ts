import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { initiateSTKPush } from '@/lib/mpesa'
import { z } from 'zod'

const checkoutSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
  shippingAddress: z.string().min(5),
  shippingRegion: z.string(),
  shippingProvider: z.string(),
  items: z.array(z.object({
    id: z.string(),
    quantity: z.number().min(1)
  })).min(1),
  paymentMethod: z.enum(['MPESA', 'STRIPE', 'PAYPAL'])
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = checkoutSchema.parse(body)
    
    // 1. Fetch real prices and validate stock
    const dbBooks = await prisma.book.findMany({
      where: { id: { in: data.items.map(i => i.id) } }
    })
    
    let subtotal = 0
    let totalWeight = 0
    for (const item of data.items) {
      const book = dbBooks.find(b => b.id === item.id)
      if (!book) return NextResponse.json({ error: `Book ${item.id} not found` }, { status: 400 })
      if (book.stock < item.quantity) return NextResponse.json({ error: `Not enough stock for ${book.title}` }, { status: 400 })
      subtotal += book.price * item.quantity
      totalWeight += (book.weight || 0.5) * item.quantity
    }

    // 2. Calculate Shipping natively validating the exact location + provider combination securely
    const zone = await prisma.shippingZone.findUnique({
      where: { 
        name_provider: {
            name: data.shippingRegion,
            provider: data.shippingProvider
        }
      }
    })
    if (!zone) return NextResponse.json({ error: 'Invalid logistical route mapping.' }, { status: 400 })

    // Surcharge logic: +60 KES for every kg above 5kg (rounded to nearest kg)
    const roundedWeight = Math.round(totalWeight)
    const extraWeight = Math.max(0, roundedWeight - 5)
    const shippingFee = zone.fee + (extraWeight * 60)

    const total = subtotal + shippingFee

    // 3. Create Order natively via Transaction
    const order = await prisma.$transaction(async (tx) => {
      for (const item of data.items) {
        await tx.book.update({
          where: { id: item.id },
          data: { stock: { decrement: item.quantity } }
        })
      }

      return tx.order.create({
        data: {
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          shippingAddress: data.shippingAddress,
          shippingRegion: data.shippingRegion,
          shippingProvider: data.shippingProvider,
          shippingFee: shippingFee,
          subtotal,
          total,
          paymentMethod: data.paymentMethod,
          status: 'PENDING'
        }
      })
    })

    console.log(`[Resend Mock Task] Sending receipt to ${order.customerEmail}`);

    // Dispatch Daraja STK 
    if (order.paymentMethod === 'MPESA') {
      if (!data.customerPhone) {
        return NextResponse.json({ error: 'Phone number is strictly required for M-PESA checkout.' }, { status: 400 })
      }
      try {
        await initiateSTKPush(data.customerPhone, total, order.id)
      } catch (mpesaError: any) {
        console.error('STK Push Initializer Blocked:', mpesaError)
        return NextResponse.json({ error: 'Order created, but STK failed: ' + mpesaError.message }, { status: 400 })
      }
    }

    return NextResponse.json({ success: true, orderId: order.id })

  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 400 })
  }
}
