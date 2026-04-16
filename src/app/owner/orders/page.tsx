import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const revalidate = 0

async function markShipped(orderId: string) {
  'use server'
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")
    
  await prisma.order.update({
    where: { id: orderId },
    data: { status: 'SHIPPED' }
  })
  revalidatePath('/owner/orders')
}

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6 max-w-5xl">
      <h1 className="text-2xl font-bold text-text">Order Management</h1>

      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6 flex flex-col md:flex-row justify-between gap-4 items-center">
              <div>
                <p className="text-xs text-muted mb-1 font-mono">Invoice ID: {order.id}</p>
                <h3 className="font-bold text-lg">{order.customerName}</h3>
                <p className="text-sm text-muted">{order.customerEmail} | {order.shippingRegion} / {order.shippingAddress}</p>
                <div className="mt-2 text-sm flex items-center">
                  <span className={`px-2 py-1 rounded text-xs font-bold mr-3 ${order.status === 'PENDING' ? 'bg-orange-100 text-orange-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    {order.status}
                  </span>
                  <span className="font-mono font-semibold">KES {order.total.toLocaleString()}</span>
                  <span className="text-xs text-muted ml-2">via {order.paymentMethod}</span>
                </div>
              </div>
              
              <div className="flex items-center min-w-[140px] justify-end">
                {order.status === 'PENDING' && (
                  <form action={markShipped.bind(null, order.id)}>
                    <button type="submit" className="px-4 py-2 bg-text text-background rounded text-sm hover:opacity-80 transition-opacity font-semibold">
                      Mark as Shipped &rarr;
                    </button>
                  </form>
                )}
                {order.status !== 'PENDING' && (
                   <span className="text-sm font-semibold text-muted">Processed</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {orders.length === 0 && <p className="text-muted text-center py-10">No orders placed yet.</p>}
      </div>
    </div>
  )
}
