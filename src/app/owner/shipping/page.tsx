import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const revalidate = 0

async function updateFee(formData: FormData) {
  'use server'
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  const id = formData.get('id') as string
  const fee = parseFloat(formData.get('fee') as string)
  await prisma.shippingZone.update({
    where: { id },
    data: { fee }
  })
  revalidatePath('/owner/shipping')
  revalidatePath('/checkout') // bust checkout page cache
}

export default async function ShippingPage() {
  const zones = await prisma.shippingZone.findMany({
    orderBy: { fee: 'asc' }
  })

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-text">Shipping Hierarchy</h1>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#FAFAF9] text-muted border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Calculated Region Node</th>
                <th className="px-6 py-4 font-semibold w-64 text-right">Mutable API Fee (KES)</th>
              </tr>
            </thead>
            <tbody>
              {zones.map((zone) => (
                <tr key={zone.id} className="border-b border-border/50">
                  <td className="px-6 py-4 font-medium text-text">{zone.name}</td>
                  <td className="px-6 py-3">
                    <form action={updateFee} className="flex gap-2 justify-end">
                      <input type="hidden" name="id" value={zone.id} />
                      <Input name="fee" type="number" defaultValue={zone.fee} className="w-24 font-mono text-center h-8" />
                      <Button type="submit" variant="outline" size="sm" className="h-8">Overwrite</Button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      <p className="text-xs text-muted w-full text-right mt-4 rounded">Changes here map immediately to real-time public checkout calculations.</p>
    </div>
  )
}
