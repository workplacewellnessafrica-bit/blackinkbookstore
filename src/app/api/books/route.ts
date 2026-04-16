import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const genre = searchParams.get('genre')
  const featured = searchParams.get('featured')
  const q = searchParams.get('q') // Search term mapping to F-10

  try {
    const books = await prisma.book.findMany({
      where: {
        ...(genre ? { genre } : {}),
        ...(featured === 'true' ? { featured: true } : {}),
        ...(q ? { 
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { author: { contains: q, mode: 'insensitive' } }
          ] 
        } : {})
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(books)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  return NextResponse.json({ error: 'Unauthorized. Use admin namespace.' }, { status: 401 })
}
