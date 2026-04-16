'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function deleteBook(id: string) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")
  await prisma.book.delete({ where: { id } })
  revalidatePath('/owner/inventory')
  revalidatePath('/books')
}

export async function updateStock(id: string, newStock: number) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")
  await prisma.book.update({ where: { id }, data: { stock: newStock } })
  revalidatePath('/owner/inventory')
  revalidatePath(`/books/${id}`)
}
