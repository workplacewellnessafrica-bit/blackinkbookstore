import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const revalidate = 0

async function addZone(formData: FormData) {
  'use server'
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  const name = formData.get('name') as string
  const provider = formData.get('provider') as string
  const fee = parseFloat(formData.get('fee') as string)
  
  if(name && provider && !isNaN(fee)) {
    try {
      await prisma.shippingZone.create({
        data: { name, provider, fee }
      })
      revalidatePath('/owner/shipping')
      revalidatePath('/checkout') 
    } catch(e) {
      console.log('Failed creating compound layer: ', e)
    }
  }
}

async function removeZone(formData: FormData) {
  'use server'
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  const id = formData.get('id') as string
  await prisma.shippingZone.delete({ where: { id } })
  revalidatePath('/owner/shipping')
  revalidatePath('/checkout')
}

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
  revalidatePath('/checkout') 
}

export default async function ShippingPage() {
  const zones = await prisma.shippingZone.findMany({
    orderBy: [{ name: 'asc' }, { fee: 'asc' }]
  })

  return (
    <div className="space-y-10 max-w-4xl">
      <h1 className="text-2xl font-bold text-text">Logistics & Shipping Networks</h1>

      <Card className="bg-black/5 border-none shadow-none">
        <CardContent className="p-6">
           <h2 className="font-semibold text-sm text-text mb-4">Establish New Route/Provider Mapping</h2>
           <form action={addZone} className="flex flex-col md:flex-row gap-4 items-end">
             <div className="w-full md:w-1/3">
               <label className="text-xs font-semibold mb-1 block">City / Region</label>
               <Input name="name" required placeholder="e.g. Mombasa" className="bg-white" />
             </div>
             <div className="w-full md:w-1/3">
               <label className="text-xs font-semibold mb-1 block">Fulfillment Carrier</label>
               <Input name="provider" required placeholder="e.g. G4S, Wells Fargo, 2NK" className="bg-white" />
             </div>
             <div className="w-full md:w-1/4">
               <label className="text-xs font-semibold mb-1 block">Rate (KES)</label>
               <Input name="fee" type="number" required placeholder="500" className="bg-white" />
             </div>
             <Button type="submit" className="whitespace-nowrap w-full md:w-auto">Add Route</Button>
           </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#FAFAF9] text-muted border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Location</th>
                <th className="px-6 py-4 font-semibold">Provider / Carrier</th>
                <th className="px-6 py-4 font-semibold w-48 text-right">Fee (KES)</th>
                <th className="px-6 py-4 font-semibold w-24 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {zones.map((zone) => (
                <tr key={zone.id} className="border-b border-border/50 hover:bg-black/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-text">{zone.name}</td>
                  <td className="px-6 py-4 text-muted"><span className="bg-border/50 text-text px-2 py-1 rounded text-xs font-bold font-mono tracking-tight">{zone.provider}</span></td>
                  <td className="px-6 py-2">
                    <form action={updateFee} className="flex gap-2 justify-end">
                      <input type="hidden" name="id" value={zone.id} />
                      <Input name="fee" type="number" defaultValue={zone.fee} className="w-24 font-mono text-center h-8" />
                      <Button type="submit" variant="outline" size="sm" className="h-8">Set</Button>
                    </form>
                  </td>
                  <td className="px-6 py-2 text-right">
                    <form action={removeZone}>
                      <input type="hidden" name="id" value={zone.id} />
                      <button type="submit" className="text-error text-xs font-semibold hover:underline">Delete</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {zones.length === 0 && <div className="p-8 text-center text-muted">No logistical routes mapped.</div>}
        </CardContent>
      </Card>
      
      <p className="text-xs text-muted w-full text-right mt-4 rounded">Mutations update Phase 4 live Checkout validations implicitly.</p>
    </div>
  )
}
