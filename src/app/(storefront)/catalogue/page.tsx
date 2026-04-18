import { prisma } from '@/lib/prisma'
import { CatalogueClient } from './CatalogueClient'

export const revalidate = 0

export default async function CataloguePage() {
  const books = await prisma.book.findMany({
    orderBy: { createdAt: 'desc' }
  })

  // Group by real sections for the UI logic
  const SECTIONS = {
    Fiction: ['Romance', 'Sci-fi', 'Mystery', 'Fantasy', 'General fiction', 'Crime'],
    'Non-Fiction': ['Autobiography', 'Philosophy', 'Self-help', 'Political', 'Theology', 'Business'],
    Kids: ['Toto Reader (0–3)', 'Board books', 'Junior (6–9)', 'YA (12+)']
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 min-h-screen font-serif">
      <header className="mb-12 space-y-2">
        <h1 className="text-4xl font-black uppercase tracking-tighter italic">Library Catalogue</h1>
        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.4em]">Black Ink Bookstores</p>
      </header>
      
      <CatalogueClient books={books} sections={SECTIONS} />
    </div>
  )
}
