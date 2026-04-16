'use client'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useEffect, useState } from 'react'

export function NavBar() {
  const [mounted, setMounted] = useState(false)
  const items = useCartStore((state) => state.items)
  const count = items.reduce((acc, item) => acc + item.quantity, 0)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="container mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-sans font-bold text-2xl tracking-tighter text-text">
          BLACKINK.
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/books" className="text-sm font-medium text-muted hover:text-text transition-colors">
            Catalogue
          </Link>
          <Link href="/cart" className="relative text-text hover:opacity-80 transition-opacity">
            <ShoppingCart className="w-5 h-5" />
            {mounted && count > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-background text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {count}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  )
}
