import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { AddToCartButton } from '@/components/storefront/AddToCartButton'

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const book = await prisma.book.findUnique({
    where: { id }
  })
  
  if (!book) return notFound()

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <div className="flex flex-col md:flex-row gap-12">
        <div className="w-full md:w-1/2 aspect-[2/3] relative rounded-md overflow-hidden bg-border/20">
          {book.coverImage ? (
             <Image
              src={book.coverImage}
              alt={book.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
             />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted">No Cover Available</div>
          )}
        </div>
        
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-text mb-2 tracking-tight">{book.title}</h1>
          <p className="text-xl text-muted mb-6">{book.author}</p>
          
          <div className="font-mono text-2xl font-bold text-text mb-8">
            KES {book.price.toLocaleString()}
          </div>
          
          <p className="text-muted leading-relaxed mb-8">
            {book.description || "No description available."}
          </p>

          <div className="flex flex-col gap-4">
             <AddToCartButton book={book} />
             <p className="text-sm text-muted">
               {book.stock > 0 ? `${book.stock} units available` : 'Currently unavailable.'}
             </p>
          </div>
        </div>
      </div>
    </div>
  )
}
