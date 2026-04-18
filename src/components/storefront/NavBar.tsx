'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart, Search, ChevronDown, X, Menu } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { Input } from '@/components/ui/input'
import Image from 'next/image'

const CATALOGUE_BRANCHES = {
  Fiction: ['Romance', 'Sci-fi', 'Mystery', 'Fantasy'],
  'Non-Fiction': ['Autobiographies', 'Self-help', 'Theology', 'Business'],
  Kids: ['Toto Readers (0-3)', 'Early Readers (4-6)', 'Junior Fiction (7-12)']
}

export function NavBar() {
  const [mounted, setMounted] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  
  const items = useCartStore((state) => state.items)
  const count = items.reduce((acc, item) => acc + item.quantity, 0)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur shadow-sm">
      <div className="container mx-auto max-w-7xl px-4 h-20 flex items-center justify-between">
        
        {/* Left Side: Brand + Mobile Menu Trigger */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 lg:hidden hover:bg-black/5 rounded-full transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

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
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 ml-8">
          <Link href="/" className="text-xs font-bold uppercase tracking-widest text-muted hover:text-black transition-colors">
            Home
          </Link>
          
          <div 
            className="relative group py-4"
            onMouseEnter={() => setActiveMenu('catalogue')}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <button className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-muted group-hover:text-black transition-colors">
              Catalogue <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />
            </button>
            
            <div className={`absolute top-full -left-20 w-[600px] bg-white border border-border rounded-xl shadow-2xl p-8 grid grid-cols-3 gap-8 transition-all duration-300 origin-top overflow-hidden
              ${activeMenu === 'catalogue' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
              {Object.entries(CATALOGUE_BRANCHES).map(([branch, sub]) => (
                <div key={branch} className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-black border-b border-black/5 pb-2">
                    {branch}
                  </h3>
                  <div className="flex flex-col gap-2">
                    {sub.map(cat => (
                      <Link 
                        key={cat} 
                        href={`/books?genre=${cat}`} 
                        className="text-xs font-medium text-muted hover:text-black hover:translate-x-1 transition-all"
                      >
                        {cat}
                      </Link>
                    ))}
                    <Link href={`/books?section=${branch}`} className="text-[9px] font-bold uppercase underline mt-2 text-accent">
                      View All {branch}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

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

        {/* Right Side: Search + Cart */}
        <div className="flex items-center gap-2 sm:gap-6">
          <div className="relative">
            <button 
              onClick={() => setSearchOpen(!searchOpen)} 
              className="p-2 hover:bg-black/5 rounded-full transition-colors"
            >
              {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>
            
            <div className={`absolute top-full right-0 mt-4 w-[280px] sm:w-72 bg-white border border-border rounded-lg shadow-xl p-4 transition-all duration-200 origin-top-right
              ${searchOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
              <form action="/books" method="GET" className="relative">
                <Input name="q" placeholder="Theology, Romance..." className="pr-10 text-xs h-10 border-none bg-black/5" />
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
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div className={`fixed inset-0 z-[60] bg-black/50 transition-opacity lg:hidden ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`absolute top-0 left-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex flex-col h-full">
            <div className="p-6 flex items-center justify-between border-b border-border">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black">Navigation</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <nav className="flex flex-col gap-6">
                <Link onClick={() => setMobileMenuOpen(false)} href="/" className="text-lg font-black uppercase tracking-tighter text-black">Home</Link>
                
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Catalogue</span>
                  <div className="grid grid-cols-1 gap-4 pl-4 border-l border-border">
                    {Object.entries(CATALOGUE_BRANCHES).map(([branch, sub]) => (
                      <div key={branch} className="space-y-2">
                        <span className="text-[9px] font-black uppercase tracking-[0.1em] text-black underline decoration-black/10 underline-offset-4">{branch}</span>
                        <div className="flex flex-wrap gap-2">
                          {sub.map(cat => (
                            <Link 
                              key={cat}
                              onClick={() => setMobileMenuOpen(false)}
                              href={`/books?genre=${cat}`}
                              className="text-xs font-bold text-muted bg-black/5 px-2 py-1 rounded"
                            >
                              {cat}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Link onClick={() => setMobileMenuOpen(false)} href="/blog" className="text-lg font-black uppercase tracking-tighter text-black">Blog</Link>
                <Link onClick={() => setMobileMenuOpen(false)} href="/about" className="text-lg font-black uppercase tracking-tighter text-black">About</Link>
                <Link onClick={() => setMobileMenuOpen(false)} href="/contact" className="text-lg font-black uppercase tracking-tighter text-black">Contact Us</Link>
              </nav>
            </div>

            <div className="p-6 border-t border-border bg-black/5">
               <p className="text-[8px] font-black uppercase tracking-[0.4em] opacity-40 text-center">Black Ink Bookstores</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
