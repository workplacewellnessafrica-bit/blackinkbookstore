import { prisma } from '@/lib/prisma'
import { BookCard } from '@/components/storefront/BookCard'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ReviewSection } from '@/components/storefront/ReviewSection'

const HOME_CATEGORIES = [
  { name: 'Fiction', genres: ['Romance', 'Sci-fi', 'Mystery', 'Fantasy'] },
  { name: 'Non-Fiction', genres: ['Autobiographies', 'Self-help', 'Theology', 'Business'] },
  { name: 'Kids & Toto Readers', genres: ['Toto Readers (0-3)', 'Early Readers (4-6)', 'Junior Fiction (7-12)'] }
]

export const revalidate = 60

export default async function HomePage() {
  const allBooks = await prisma.book.findMany({
    orderBy: { createdAt: 'desc' }
  })

  const reviews = await prisma.review.findMany({
    where: { isApproved: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="bg-white">
      {/* Premium Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-black">
          <Image 
            src="/images/IMG-20260416-WA0060.jpg" 
            alt="Hero Background" 
            fill 
            className="object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000" 
            priority
          />
        </div>
        <div className="relative z-10 text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-7xl font-black tracking-tighter text-white uppercase italic">
              Cultivating Soul.
            </h1>
            <p className="text-sm sm:text-lg text-white/80 font-medium tracking-[0.3em] uppercase">
              Black Ink Bookstores
            </p>
          </div>
          <Link href="/books">
            <Button variant="outline" className="rounded-none border-white text-white hover:bg-white hover:text-black font-black uppercase tracking-widest px-10 py-6">
              Enter Catalogue
            </Button>
          </Link>
        </div>
      </section>

      {/* Categorized Dense Grids */}
      <main className="container mx-auto max-w-7xl px-4 py-20 space-y-32">
        {HOME_CATEGORIES.map((cat) => {
          const catBooks = allBooks.filter(b => cat.genres.includes(b.genre || '')).slice(0, 4)
          if (catBooks.length === 0) return null

          return (
            <section key={cat.name} className="space-y-8">
              <div className="flex items-end justify-between border-b border-black pb-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black uppercase tracking-tighter leading-none">{cat.name}</h2>
                  <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Selected Works</p>
                </div>
                <Link href={`/books?section=${cat.name}`} className="text-[10px] font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
                  View More →
                </Link>
              </div>
              
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4 sm:gap-8">
                {catBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </section>
          )
        })}
      </main>
      
      {/* Real Review Section */}
      <ReviewSection reviews={reviews} />
    </div>
  )
}
