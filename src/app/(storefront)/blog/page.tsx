import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 60

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="bg-white min-h-screen">
      <section className="container mx-auto max-w-7xl px-4 py-24 border-b border-black/5">
        <div className="max-w-3xl space-y-4">
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">Ink & Insights</h1>
          <p className="text-xs font-bold text-muted uppercase tracking-[0.4em]">The official blog of Black Ink Bookstores</p>
        </div>
      </section>

      <main className="container mx-auto max-w-7xl px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {posts.map((post) => (
            <article key={post.id} className="group space-y-6">
              <Link href={`/blog/${post.slug}`} className="block aspect-video relative overflow-hidden bg-black/5">
                {post.image ? (
                  <Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center font-black text-black/20 text-4xl uppercase tracking-tighter">
                    Black Ink
                  </div>
                )}
              </Link>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-black text-white px-2 py-0.5">Literature</span>
                  <span className="text-[9px] font-bold text-muted uppercase tracking-widest">{post.createdAt.toLocaleDateString()}</span>
                </div>
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-xl font-black uppercase tracking-tight group-hover:underline decoration-2 underline-offset-4 leading-tight">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-xs text-muted leading-relaxed line-clamp-3 uppercase tracking-wide">
                  {post.content.slice(0, 150)}...
                </p>
                <Link href={`/blog/${post.slug}`} className="inline-block text-[9px] font-black uppercase tracking-widest border-b-2 border-black pb-1">
                  Read Full Discourse →
                </Link>
              </div>
            </article>
          ))}
        </div>
        
        {posts.length === 0 && (
          <div className="py-40 text-center space-y-4">
            <p className="text-xs font-bold text-muted uppercase tracking-[0.5em]">The press is silent.</p>
            <p className="text-[10px] text-muted/60 uppercase">Check back soon for new insights.</p>
          </div>
        )}
      </main>
    </div>
  )
}
