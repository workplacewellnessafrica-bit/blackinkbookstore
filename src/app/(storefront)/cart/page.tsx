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

  if (items.length === 0) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted mb-8">Looks like you haven't added any books yet.</p>
        <Link href="/books">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-bold text-text mb-10 tracking-tight">Your Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-2/3">
          {items.map((item) => (
            <div key={item.id} className="flex gap-6 py-6 border-b border-border">
              <div className="w-24 h-36 relative rounded overflow-hidden bg-border/20 flex-shrink-0">
                {item.coverImage && (
                  <Image src={item.coverImage} alt={item.title} fill className="object-cover" sizes="96px" />
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between py-2">
                <div>
                  <h3 className="text-lg font-bold line-clamp-1">{item.title}</h3>
                  <p className="text-muted text-sm mb-2">{item.author}</p>
                  <p className="font-mono text-sm font-semibold">KES {item.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded-md">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 text-lg hover:bg-black/5">-</button>
                    <span className="px-2 text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-lg hover:bg-black/5">+</button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-sm font-semibold text-error hover:underline md:ml-4">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="w-full lg:w-1/3">
          <div className="bg-border/20 p-6 rounded-md sticky top-24">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span className="text-muted">Subtotal</span>
              <span className="font-mono font-semibold text-text">KES {cartTotal().toLocaleString()}</span>
            </div>
            <p className="text-xs text-muted mb-6">Shipping is calculated at checkout.</p>
            <Link href="/checkout" className="block w-full">
              <Button size="lg" className="w-full">Proceed to Checkout</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
