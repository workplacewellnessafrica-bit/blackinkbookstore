import { prisma } from '@/lib/prisma'
import { BookForm } from '@/components/admin/BookForm'
import { notFound } from 'next/navigation'

export default async function EditBookPage({ params }: { params: { id: string } }) {
  const book = await prisma.book.findUnique({
    where: { id: params.id }
  })

  if (!book) notFound()

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-text">Edit Book Registry</h1>
        <p className="text-sm text-muted">Updating metadata for: <span className="font-bold underline">{book.title}</span></p>
      </div>
      <BookForm book={book} />
    </div>
  )
}
