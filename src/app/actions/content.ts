'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

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
