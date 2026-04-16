'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { uploadToCloudinary } from '@/lib/cloudinary'

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

export async function upsertBook(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  const id = formData.get('id') as string | null
  const title = formData.get('title') as string
  const author = formData.get('author') as string
  const genre = formData.get('genre') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const stock = parseInt(formData.get('stock') as string)
  const isbn = formData.get('isbn') as string
  
  const imageFile = formData.get('coverImage') as File | null

  let coverImageUrl = formData.get('existingCoverImage') as string | null

  if (imageFile && imageFile.size > 0) {
    const uploadResult: any = await uploadToCloudinary(imageFile)
    coverImageUrl = uploadResult.secure_url
  }

  const bookData = {
    title,
    author,
    genre,
    description,
    price,
    stock,
    isbn,
    coverImage: coverImageUrl,
  }

  if (id) {
    await prisma.book.update({ where: { id }, data: bookData })
  } else {
    await prisma.book.create({ data: bookData })
  }

  revalidatePath('/owner/inventory')
  revalidatePath('/books')
  if (id) revalidatePath(`/books/${id}`)
}
