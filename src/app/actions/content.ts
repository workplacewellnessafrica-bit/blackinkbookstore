'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/* BLOG ACTIONS */
export async function upsertPost(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  const id = formData.get('id') as string | null
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const published = formData.get('published') === 'true'
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const data = { title, content, published, slug }

  if (id) {
    await prisma.blogPost.update({ where: { id }, data })
  } else {
    await prisma.blogPost.create({ data })
  }

  revalidatePath('/owner/blog')
  revalidatePath('/blog')
}

export async function deletePost(id: string) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")
  await prisma.blogPost.delete({ where: { id } })
  revalidatePath('/owner/blog')
  revalidatePath('/blog')
}

/* REVIEW ACTIONS */
export async function submitReview(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const location = formData.get('location') as string
  const content = formData.get('content') as string
  const rating = parseInt(formData.get('rating') as string) || 5

  await prisma.review.create({
    data: { name, email, location, content, rating, isApproved: false }
  })
  // No revalidatePath needed for public side yet as it is not approved
}

export async function approveReview(id: string) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")
  await prisma.review.update({ where: { id }, data: { isApproved: true } })
  revalidatePath('/owner/reviews')
  revalidatePath('/')
}

export async function deleteReview(id: string) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")
  await prisma.review.delete({ where: { id } })
  revalidatePath('/owner/reviews')
  revalidatePath('/')
}
