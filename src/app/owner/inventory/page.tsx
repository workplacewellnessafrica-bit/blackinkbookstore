import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { deleteBook, updateStock } from '@/app/actions/inventory'

export const revalidate = 0

export default async function InventoryPage() {
  const books = await prisma.book.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text">Book Inventory</h1>
        <Button>Add New Book</Button>
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
                  <td className="px-6 py-4 font-medium text-text">{book.title}</td>
                  <td className="px-6 py-4 text-muted">{book.author}</td>
                  <td className="px-6 py-4 font-mono">KES {book.price.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <form action={async () => {
                      'use server'
                      await updateStock(book.id, book.stock + 1)
                    }} className="inline">
                      <button className="px-2 text-xl hover:text-accent font-mono">+</button>
                    </form>
                    <span className="font-mono mx-2">{book.stock}</span>
                    <form action={async () => {
                      'use server'
                      await updateStock(book.id, Math.max(0, book.stock - 1))
                    }} className="inline">
                      <button className="px-2 text-xl hover:text-accent font-mono">-</button>
                    </form>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button className="text-accent hover:underline font-medium">Edit</button>
                    <form action={async () => {
                      'use server'
                      await deleteBook(book.id)
                    }} className="inline">
                      <button className="text-error hover:underline font-medium">Delete</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
