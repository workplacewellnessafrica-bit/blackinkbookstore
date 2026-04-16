import { prisma } from '@/lib/prisma'
import { BookCard } from '@/components/storefront/BookCard'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export const revalidate = 60

export default async function HomePage() {
  const featuredBooks = await prisma.book.findMany({
    where: { featured: true },
    orderBy: { createdAt: 'desc' },
    take: 8
  })

  return (
    <div>
      <section className="relative py-40 sm:py-56 flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-black">
          <Image 
            src="/images/IMG-20260416-WA0060.jpg" 
            alt="Hero Background Image" 
            fill 
            className="object-cover opacity-50" 
            priority
          />
        </div>
        <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 px-10 py-8 rounded-2xl shadow-2xl transition-all hover:bg-white/15">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white max-w-4xl mb-4 drop-shadow-lg">
            BLACKINK BOOKSTORE.
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mb-8 font-medium drop-shadow-md">
            Discover a minimalist collection of essential literature.
          </p>
          <Link href="/books">
            <Button size="lg" className="rounded-full bg-white text-black hover:bg-white/90 shadow-xl font-bold px-8 py-6 transition-transform hover:scale-105 active:scale-95">Shop the Catalogue</Button>
          </Link>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-xl font-bold text-text uppercase tracking-widest">Featured Titles</h2>
          <Link href="/books" className="text-sm font-semibold text-muted hover:text-text transition-colors">
            View All →
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
           {featuredBooks.map((book) => (
             <BookCard key={book.id} book={book} />
           ))}
        </div>
      </section>
    </div>
  )
}
