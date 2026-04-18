import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { AddToCartButton } from '@/components/storefront/AddToCartButton'

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const book = await prisma.book.findUnique({
    where: { id }
  })
  
  if (!book) return notFound()

  return (
    <div className="container mx-auto max-w-7xl px-4 py-20 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-20 items-start">
        
        {/* Large Cinematic Cover */}
        <div className="w-full lg:w-[45%] flex-shrink-0">
          <div className="relative aspect-[3/4] rounded-sm overflow-hidden bg-black/5 shadow-2xl">
            {book.coverImage ? (
               <Image
                src={book.coverImage}
                alt={book.title}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
                priority
               />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-black text-black/10 uppercase tracking-tighter text-4xl italic">Black Ink</div>
            )}
          </div>
        </div>
        
        {/* Deep Metadata & Purchase */}
        <div className="flex-1 space-y-12">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
               {book.isThrift && (
                 <span className="bg-[#7c3a00]/10 text-[#7c3a00] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-[#7c3a00]/20">
                   Thrift Edition
                 </span>
               )}
               <span className="text-[10px] font-bold text-muted uppercase tracking-[0.4em]">{book.genre}</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-tight italic">{book.title}</h1>
            <p className="text-xl font-medium text-muted uppercase tracking-widest">{book.author}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-black text-black">KES {book.price.toLocaleString()}</span>
              {book.originalPrice && (
                <span className="text-lg text-muted line-through opacity-50">KES {book.originalPrice.toLocaleString()}</span>
              )}
            </div>
            <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Base shipping applies based on weight</p>
          </div>

          <div className="prose prose-sm max-w-none">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 border-b border-black pb-2">The Blurb</h3>
            <p className="text-muted leading-relaxed uppercase tracking-wide text-[11px]">
              {book.description || "No editorial description provided."}
            </p>
          </div>

          {/* Technical Specifications Section */}
          <div className="bg-black text-white p-8 grid grid-cols-2 gap-8">
             <div className="space-y-1">
                <span className="text-[8px] font-bold text-white/40 uppercase tracking-[0.3em]">Format</span>
                <p className="text-xs font-black uppercase tracking-widest">{book.format || "Standard"}</p>
             </div>
             <div className="space-y-1">
                <span className="text-[8px] font-bold text-white/40 uppercase tracking-[0.3em]">Weight</span>
                <p className="text-xs font-black uppercase tracking-widest">{book.weight || "0.5"} KG</p>
             </div>
             <div className="space-y-1">
                <span className="text-[8px] font-bold text-white/40 uppercase tracking-[0.3em]">Serial (SKU)</span>
                <p className="text-xs font-black uppercase tracking-widest">{book.sku || "N/A"}</p>
             </div>
             <div className="space-y-1 text-right">
                <span className="text-[8px] font-bold text-white/40 uppercase tracking-[0.3em]">Availability</span>
                <p className="text-xs font-black uppercase tracking-widest">{book.stock > 0 ? "In Stock" : "Out of Print"}</p>
             </div>
          </div>

          <div className="pt-8">
             <AddToCartButton book={book} />
          </div>
        </div>
      </div>
    </div>
  )
}
