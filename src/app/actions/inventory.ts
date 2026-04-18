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
  revalidatePath('/catalogue')
}

export async function updateStock(id: string, newStock: number) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")
  await prisma.book.update({ where: { id }, data: { stock: newStock } })
  revalidatePath('/owner/inventory')
  revalidatePath('/catalogue')
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
  
  // Sanitize numeric inputs to avoid NaN
  const priceStr = formData.get('price') as string
  const price = parseFloat(priceStr) || 0
  
  const originalPriceStr = formData.get('originalPrice') as string
  const originalPrice = (originalPriceStr && !isNaN(parseFloat(originalPriceStr))) ? parseFloat(originalPriceStr) : null
  
  const stockStr = formData.get('stock') as string
  const stock = parseInt(stockStr) || 0
  
  const weightStr = formData.get('weight') as string
  const weight = (weightStr && !isNaN(parseFloat(weightStr))) ? parseFloat(weightStr) : 0.5
  
  // Handle unique fields: Empty strings should be null to avoid P2002 unique constraint errors
  const skuRaw = formData.get('sku') as string
  const sku = skuRaw?.trim() === "" ? null : skuRaw

  const isbnRaw = formData.get('isbn') as string
  const isbn = isbnRaw?.trim() === "" ? null : isbnRaw

  const format = formData.get('format') as string
  const isThrift = formData.get('isThrift') === 'on'
  
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
    originalPrice,
    weight,
    sku,
    format,
    isbn,
    isThrift,
    coverImage: coverImageUrl,
  }

  if (id) {
    await prisma.book.update({ where: { id }, data: bookData })
  } else {
    await prisma.book.create({ data: bookData })
  }

  revalidatePath('/owner/inventory')
  revalidatePath('/catalogue')
  if (id) revalidatePath(`/books/${id}`)
}
