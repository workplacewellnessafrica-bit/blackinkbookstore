'use client'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCartStore } from '@/store/cart'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerEmail: z.string().email("Invalid email"),
  customerPhone: z.string().optional(),
  shippingAddress: z.string().min(5, "Full address is required"),
  shippingRegion: z.string().min(1, "Please select a region"),
  paymentMethod: z.enum(['MPESA', 'STRIPE', 'PAYPAL'])
})

type CheckoutData = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const router = useRouter()
  const { items, cartTotal, clearCart } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [zones, setZones] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CheckoutData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: 'MPESA' }
  })

  // Live Shipping Tracker
  const selectedRegionName = watch('shippingRegion')
  const selectedZone = zones.find(z => z.name === selectedRegionName)
  const shippingFee = selectedZone ? selectedZone.fee : 0
  const total = cartTotal() + shippingFee

  useEffect(() => {
    setMounted(true)
    fetch('/api/shipping')
      .then(res => res.json())
      .then(data => setZones(data))
      .catch(e => console.error("Could not fetch zones: ", e))
  }, [])

  if (!mounted) return null
  if (items.length === 0) return <div className="p-20 text-center text-muted">Your cart is empty. Please add items.</div>

  const onSubmit = async (data: CheckoutData) => {
    setLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          items: items.map(item => ({ id: item.id, quantity: item.quantity }))
        })
      })
      const result = await response.json()
      
      if (response.ok && result.orderId) {
        clearCart()
        alert(`Order ${result.orderId} placed successfully! Sending receipt to ${data.customerEmail}.`)
        router.push(`/books`) 
      } else {
        alert(result.error || 'Failed to process checkout')
      }
    } catch (e) {
      alert('Network error during checkout')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-bold text-text mb-10 tracking-tight">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-1/2">
          <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <Input placeholder="Full Name" {...register('customerName')} />
                  {errors.customerName && <p className="text-error text-xs mt-1">{errors.customerName.message}</p>}
                </div>
                <div>
                  <Input placeholder="Email Address" type="email" {...register('customerEmail')} />
                  {errors.customerEmail && <p className="text-error text-xs mt-1">{errors.customerEmail.message}</p>}
                </div>
                <div>
                  <Input placeholder="Phone Number (Required for M-PESA)" type="tel" {...register('customerPhone')} />
                  {errors.customerPhone && <p className="text-error text-xs mt-1">{errors.customerPhone.message}</p>}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <h2 className="text-xl font-bold mb-4 mt-8">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <Input placeholder="Street Address, Building, Apartment" {...register('shippingAddress')} />
                  {errors.shippingAddress && <p className="text-error text-xs mt-1">{errors.shippingAddress.message}</p>}
                </div>
                <div>
                  <select 
                    {...register('shippingRegion')}
                    className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                  >
                    <option value="">Select Region</option>
                    {zones.map(zone => (
                      <option key={zone.id} value={zone.name}>{zone.name} (+ KES {zone.fee})</option>
                    ))}
                  </select>
                  {errors.shippingRegion && <p className="text-error text-xs mt-1">{errors.shippingRegion.message}</p>}
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <h2 className="text-xl font-bold mb-4 mt-8">Payment Method</h2>
              <div className="flex gap-4">
                <label className="flex items-center justify-center gap-2 cursor-pointer border border-border p-3 rounded-md w-1/3 hover:bg-black/5 transition-colors">
                  <input type="radio" value="MPESA" {...register('paymentMethod')} className="accent-text" />
                  <span className="text-sm font-semibold">M-PESA</span>
                </label>
                <label className="flex items-center justify-center gap-2 cursor-pointer border border-border p-3 rounded-md w-1/3 hover:bg-black/5 transition-colors">
                  <input type="radio" value="STRIPE" {...register('paymentMethod')} className="accent-text" />
                  <span className="text-sm font-semibold">Stripe</span>
                </label>
                <label className="flex items-center justify-center gap-2 cursor-pointer border border-border p-3 rounded-md w-1/3 hover:bg-black/5 transition-colors">
                  <input type="radio" value="PAYPAL" {...register('paymentMethod')} className="accent-text" />
                  <span className="text-sm font-semibold">PayPal</span>
                </label>
              </div>
            </div>
          </form>
        </div>
        
        <div className="w-full lg:w-1/2">
          <div className="bg-border/20 p-6 rounded-md sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">{item.quantity}x</span>
                    <span className="line-clamp-1 truncate max-w-[200px]">{item.title}</span>
                  </div>
                  <span className="font-mono">KES {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm text-muted">
                <span>Subtotal</span>
                <span className="font-mono">KES {cartTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-muted">
                <span>Shipping</span>
                <span className="font-mono text-text">{shippingFee > 0 ? `KES ${shippingFee.toLocaleString()}` : '--'}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 mt-2 border-t border-dashed border-border text-text">
                <span>Total</span>
                <span className="font-mono">KES {total.toLocaleString()}</span>
              </div>
            </div>

            <Button 
              type="submit" 
              form="checkout-form" 
              size="lg" 
              className="w-full mt-8 rounded-md"
              disabled={loading || items.length === 0}
            >
              {loading ? 'Processing...' : `Pay KES ${total.toLocaleString()}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
