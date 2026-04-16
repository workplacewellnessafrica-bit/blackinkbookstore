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
  
  // Strictly enforce G4S or Wells Fargo
  if(name && (provider === 'G4S' || provider === 'Wells Fargo') && !isNaN(fee)) {
    try {
      await prisma.shippingZone.create({
        data: { name, provider, fee }
      })
      revalidatePath('/owner/shipping')
      revalidatePath('/checkout') 
    } catch(e) {
      console.log('Failed creating provider layer: ', e)
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
    orderBy: [{ name: 'asc' }, { provider: 'asc' }]
  })

  // Group by location for clear hierarchy in table header optionally, but a table is fine
  return (
    <div className="space-y-10 max-w-4xl">
      <h1 className="text-2xl font-bold text-text">Shipping Hierarchy</h1>

      <Card className="bg-black/5 border-none shadow-none">
        <CardContent className="p-6">
           <h2 className="font-semibold text-sm text-text mb-4 uppercase tracking-widest">Define Logistical Node</h2>
           <form action={addZone} className="flex flex-col md:flex-row gap-4 items-end">
             <div className="w-full md:w-1/3">
               <label className="text-xs font-semibold mb-1 block">City / Region</label>
               <Input name="name" required placeholder="e.g. Nairobi CBD" className="bg-white" />
             </div>
             <div className="w-full md:w-1/3">
               <label className="text-xs font-semibold mb-1 block">Carrier Provider</label>
               <select name="provider" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" required>
                 <option value="G4S">G4S</option>
                 <option value="Wells Fargo">Wells Fargo</option>
               </select>
             </div>
             <div className="w-full md:w-1/4">
               <label className="text-xs font-semibold mb-1 block">Calculated Fee (KES)</label>
               <Input name="fee" type="number" required placeholder="250" className="bg-white" />
             </div>
             <Button type="submit" className="whitespace-nowrap w-full md:w-auto">Add Node</Button>
           </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#FAFAF9] text-muted border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Calculated Region Node</th>
                <th className="px-6 py-4 font-semibold">Provider</th>
                <th className="px-6 py-4 font-semibold w-48 text-right">Mutable API Fee (KES)</th>
                <th className="px-6 py-4 font-semibold w-24 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {zones.map((zone) => (
                <tr key={zone.id} className="border-b border-border/50 hover:bg-black/5 transition-colors">
                  <td className="px-6 py-4 font-bold text-text">{zone.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold font-mono tracking-tight ${zone.provider === 'G4S' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
                      {zone.provider}
                    </span>
                  </td>
                  <td className="px-6 py-2">
                    <form action={updateFee} className="flex gap-2 justify-end">
                      <input type="hidden" name="id" value={zone.id} />
                      <Input name="fee" type="number" defaultValue={zone.fee} className="w-24 font-mono text-center h-8" />
                      <Button type="submit" variant="outline" size="sm" className="h-8">Overwrite</Button>
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
      
      <p className="text-xs text-muted w-full text-right mt-4 p-4 italic">Changes here map immediately to real-time public checkout calculations.</p>
    </div>
  )
}
