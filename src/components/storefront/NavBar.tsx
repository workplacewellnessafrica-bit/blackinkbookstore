'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart, Search, X, Menu } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { Input } from '@/components/ui/input'
import Image from 'next/image'

export function NavBar() {
  const [mounted, setMounted] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const items = useCartStore((state) => state.items)
  const count = items.reduce((acc, item) => acc + item.quantity, 0)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur shadow-sm">
      <div className="container mx-auto max-w-7xl px-4 h-20 flex items-center justify-between">
        
        {/* Left Side: Brand (Fixed on Left) */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 overflow-hidden rounded-full border border-black/5 bg-black/5 transition-transform group-hover:scale-110">
            <Image src="/logo.png" alt="Logo" fill className="object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-black text-lg leading-tight tracking-tighter text-black uppercase">
              Black Ink
            </span>
            <span className="font-sans text-[10px] font-bold tracking-[0.2em] text-muted uppercase leading-none -mt-0.5">
              Bookstores
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 ml-8">
          <Link href="/" className="text-xs font-bold uppercase tracking-widest text-muted hover:text-black transition-colors">
            Home
          </Link>
          <Link href="/catalogue" className="text-xs font-bold uppercase tracking-widest text-muted hover:text-black transition-colors">
            Catalogue
          </Link>
          <Link href="/blog" className="text-xs font-bold uppercase tracking-widest text-muted hover:text-black transition-colors">
            Blog
          </Link>
          <Link href="/about" className="text-xs font-bold uppercase tracking-widest text-muted hover:text-black transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-xs font-bold uppercase tracking-widest text-muted hover:text-black transition-colors">
            Contact Us
          </Link>
        </nav>

        {/* Right Side: Search + Cart + Mobile Toggle (Fixed on Right) */}
        <div className="flex items-center gap-1 sm:gap-6">
          <div className="relative">
            <button 
              onClick={() => setSearchOpen(!searchOpen)} 
              className="p-2 hover:bg-black/5 rounded-full transition-colors"
            >
              {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>
            
            <div className={`absolute top-full right-0 mt-4 w-[280px] sm:w-72 bg-white border border-border rounded-lg shadow-xl p-4 transition-all duration-200 origin-top-right
              ${searchOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
              <form action="/catalogue" method="GET" className="relative">
                <Input name="q" placeholder="Search the library..." className="pr-10 text-xs h-10 border-none bg-black/5 font-sans" />
                <button type="submit" className="absolute right-3 top-2.5 text-muted hover:text-black">
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          <Link href="/cart" className="relative p-2 hover:bg-black/5 rounded-full transition-colors group">
            <ShoppingCart className="w-5 h-5" />
            {mounted && count > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white scale-110">
                {count}
              </span>
            )}
          </Link>

          {/* Mobile Menu Trigger (Now on the Right) */}
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 lg:hidden hover:bg-black/5 rounded-full transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer (Slide from Right) */}
      <div className={`fixed inset-0 z-[60] bg-black/50 transition-opacity lg:hidden ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full">
            <div className="p-6 flex items-center justify-between border-b border-border">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="p-6 flex flex-col gap-6">
              <Link onClick={() => setMobileMenuOpen(false)} href="/" className="text-lg font-black uppercase tracking-tighter text-black">Home</Link>
              <Link onClick={() => setMobileMenuOpen(false)} href="/catalogue" className="text-lg font-black uppercase tracking-tighter text-black">Catalogue</Link>
              <Link onClick={() => setMobileMenuOpen(false)} href="/blog" className="text-lg font-black uppercase tracking-tighter text-black">Blog</Link>
              <Link onClick={() => setMobileMenuOpen(false)} href="/about" className="text-lg font-black uppercase tracking-tighter text-black">About</Link>
              <Link onClick={() => setMobileMenuOpen(false)} href="/contact" className="text-lg font-black uppercase tracking-tighter text-black">Contact Us</Link>
            </nav>

            <div className="mt-auto p-6 border-t border-border bg-black/5 text-center">
               <p className="text-[8px] font-black uppercase tracking-[0.4em] opacity-40">Black Ink Bookstores</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
