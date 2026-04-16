import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { deleteBook, updateStock } from '@/app/actions/inventory'
import Link from 'next/link'

export const revalidate = 0

export default async function InventoryPage() {
  const books = await prisma.book.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text">Book Inventory</h1>
          <p className="text-sm text-muted mt-1">Manage titles, stock levels, and store descriptions.</p>
        </div>
        <Link href="/owner/inventory/new">
          <Button className="bg-black text-white px-6">Add New Book</Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#FAFAF9] text-muted border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold rounded-tl">Title (DB Index)</th>
                <th className="px-6 py-4 font-semibold">Author</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold">Stock</th>
                <th className="px-6 py-4 font-semibold rounded-tr text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} className="border-b border-border/50 hover:bg-black/5 transition-colors">
                  <td className="px-6 py-4 font-bold text-text">
                    <div className="flex items-center gap-3">
                      {book.coverImage && <img src={book.coverImage} className="w-8 h-12 object-cover rounded shadow-sm" alt="" />}
                      <span>{book.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted">{book.author}</td>
                  <td className="px-6 py-4 font-mono">KES {book.price.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <form action={async () => {
                         'use server'
                         await updateStock(book.id, book.stock + 1)
                       }} className="inline">
                         <button className="h-6 w-6 border border-border rounded flex items-center justify-center hover:bg-black/5 font-mono">+</button>
                       </form>
                       <span className="font-mono min-w-[20px] text-center">{book.stock}</span>
                       <form action={async () => {
                         'use server'
                         await updateStock(book.id, Math.max(0, book.stock - 1))
                       }} className="inline">
                         <button className="h-6 w-6 border border-border rounded flex items-center justify-center hover:bg-black/5 font-mono">-</button>
                       </form>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <Link href={`/owner/inventory/${book.id}/edit`} className="text-accent hover:underline font-bold text-xs uppercase tracking-widest">
                      Edit
                    </Link>
                    <form action={async () => {
                      'use server'
                      await deleteBook(book.id)
                    }} className="inline">
                      <button className="text-error hover:underline font-bold text-xs uppercase tracking-widest">Delete</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {books.length === 0 && <div className="p-12 text-center text-muted">Your book inventory is currently empty.</div>}
        </CardContent>
      </Card>
      
      <p className="text-[10px] text-muted p-2 italic">Changes made to book metadata propagate instantly to global storefront SEO and listings.</p>
    </div>
  )
}
