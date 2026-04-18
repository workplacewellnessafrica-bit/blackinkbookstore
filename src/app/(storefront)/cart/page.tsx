'use client'
import { useCartStore } from '@/store/cart'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, cartTotal } = useCartStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const totalWeight = items.reduce((acc, item) => acc + (item.weight || 0.5) * item.quantity, 0)

  if (items.length === 0) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-32 text-center space-y-8">
        <h1 className="text-5xl font-black uppercase tracking-tighter italic">The Bag is Empty</h1>
        <p className="text-xs font-bold text-muted uppercase tracking-[0.3em]">Your library awaits its first addition.</p>
        <Link href="/catalogue" className="inline-block">
          <Button variant="outline" className="rounded-none border-black px-12 py-6 font-black uppercase tracking-widest">Browse Catalogue</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-20 min-h-screen font-serif">
      <h1 className="text-4xl font-black uppercase tracking-tighter italic mb-12">Your Selections</h1>
      
      <div className="flex flex-col lg:flex-row gap-20">
        <div className="w-full lg:w-[60%] space-y-12">
          {items.map((item) => (
            <div key={item.id} className="flex gap-8 group">
              <div className="w-32 h-44 relative overflow-hidden bg-black/5 flex-shrink-0">
                {item.coverImage && (
                  <Image src={item.coverImage} alt={item.title} fill className="object-cover" sizes="128px" />
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between py-1">
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-lg font-black uppercase tracking-tight leading-none group-hover:underline">{item.title}</h3>
                    <p className="font-sans text-sm font-black whitespace-nowrap">KES {item.price.toLocaleString()}</p>
                  </div>
                  <p className="text-[10px] font-bold text-muted uppercase tracking-widest">{item.author} — {item.format || 'Standard Edition'}</p>
                  <p className="text-[10px] leading-relaxed text-muted line-clamp-2 uppercase tracking-wide opacity-80">
                    {item.description || "No description available."}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center border border-black/10">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-4 py-2 text-sm hover:bg-black/5 transition-colors">-</button>
                    <span className="px-4 text-[10px] font-black w-10 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-4 py-2 text-sm hover:bg-black/5 transition-colors">+</button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-[9px] font-black uppercase tracking-[0.2em] text-error hover:underline opacity-60 hover:opacity-100 transition-all">
                    Remove from Library
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="w-full lg:w-[40%]">
          <div className="bg-black text-white p-10 space-y-10 sticky top-32">
            <h2 className="text-xl font-black uppercase tracking-[0.2em] border-b border-white/10 pb-4">Order Summary</h2>
            
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">Subtotal</span>
                <span className="text-lg font-black tracking-tight">KES {cartTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                   <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">Total Weight</span>
                   <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Nearest KG: {Math.round(totalWeight)} KG</p>
                </div>
                <span className="text-xs font-black uppercase tracking-widest">{totalWeight.toFixed(2)} KG</span>
              </div>
            </div>

            <div className="bg-white/5 p-4 space-y-2">
               <p className="text-[10px] font-black uppercase tracking-widest">Logistics Note:</p>
               <p className="text-[9px] leading-relaxed text-white/60 uppercase tracking-wide">
                 Shipping is calculated based on region. Orders over 5 KG attract an additional 60 KES / KG surcharge (rounded to the nearest KG).
               </p>
            </div>

            <Link href="/checkout" className="block w-full">
              <Button className="w-full rounded-none bg-white text-black hover:bg-white/90 font-black uppercase tracking-[0.4em] py-8 text-xs border-none">
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
