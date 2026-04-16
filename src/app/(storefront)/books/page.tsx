import { prisma } from '@/lib/prisma'
import { BookCard } from '@/components/storefront/BookCard'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function BooksPage(props: Props) {
  const searchParams = await props.searchParams
  const genre = typeof searchParams.genre === 'string' ? searchParams.genre : undefined

  const books = await prisma.book.findMany({
    where: {
      ...(genre ? { genre } : {})
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="container mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-bold text-text mb-8 tracking-tight">Catalogue</h1>
      
      {genre && <p className="mb-4 text-muted">Showing category: {genre}</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
      
      {books.length === 0 && (
        <div className="py-20 text-center text-muted">No books found in this category.</div>
      )}
    </div>
  )
}
