'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { uploadToCloudinary } from '@/lib/cloudinary'

/* --- SITE CONTENT ACTIONS (ABOUT PAGE ETC) --- */

export async function updateSiteContent(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  const id = formData.get('id') as string
  const content = formData.get('content') as string
  const title = formData.get('title') as string

  await prisma.siteContent.update({
    where: { id },
    data: { content, title }
  })

  revalidatePath('/about')
  revalidatePath('/owner/content')
}

/* --- BLOG ACTIONS --- */

export async function deletePost(id: string) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")
  await prisma.blogPost.delete({ where: { id } })
  revalidatePath('/owner/blog')
  revalidatePath('/blog')
}

export async function upsertPost(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  const id = formData.get('id') as string | null
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const slug = formData.get('slug') as string
  const published = formData.get('published') === 'on'
  
  const imageFile = formData.get('image') as File | null
  let imageUrl = formData.get('existingImage') as string | null

  if (imageFile && imageFile.size > 0) {
    const uploadResult: any = await uploadToCloudinary(imageFile)
    imageUrl = uploadResult.secure_url
  }

  const postData = {
    title,
    content,
    slug,
    published,
    image: imageUrl,
  }

  if (id) {
    await prisma.blogPost.update({ where: { id }, data: postData })
  } else {
    await prisma.blogPost.create({ data: postData })
  }

  revalidatePath('/owner/blog')
  revalidatePath('/blog')
  if (id) revalidatePath(`/blog/${slug}`)
}

/* --- REVIEW ACTIONS --- */

export async function submitReview(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const location = formData.get('location') as string
  const content = formData.get('content') as string
  const rating = parseInt(formData.get('rating') as string || '5')

  await prisma.review.create({
    data: { name, email, location, content, rating }
  })
  // No revalidate needed for public yet as it needs approval
}

export async function approveReview(id: string) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")
  
  await prisma.review.update({
    where: { id },
    data: { isApproved: true }
  })
  revalidatePath('/')
  revalidatePath('/owner/reviews')
}

export async function deleteReview(id: string) {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")
  
  await prisma.review.delete({ where: { id } })
  revalidatePath('/')
  revalidatePath('/owner/reviews')
}
