import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  try {
    const book = await prisma.book.findUnique({
      where: { id }
    })
    
    if (!book) return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    
    return NextResponse.json(book)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch book' }, { status: 500 })
  }
}
