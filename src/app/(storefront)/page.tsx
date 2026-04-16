import { prisma } from '@/lib/prisma'
import { BookCard } from '@/components/storefront/BookCard'
import Link from 'next/link'
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
      <section className="bg-background py-24 sm:py-32 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter text-text max-w-4xl mb-6">
          Curated reading for the modern mind.
        </h1>
        <p className="text-xl text-muted max-w-2xl mb-10">
          Discover a minimalist collection of essential literature.
        </p>
        <Link href="/books">
          <Button size="lg" className="rounded-full">Shop the Catalogue</Button>
        </Link>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-text">Featured Titles</h2>
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
