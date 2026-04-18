import { prisma } from '@/lib/prisma'
import Image from 'next/image'

export const revalidate = 0

export default async function AboutPage() {
  const contentList = await prisma.siteContent.findMany({
    where: { key: { startsWith: 'about-' } }
  })

  const contentMap = Object.fromEntries(contentList.map(c => [c.key, c]))

  return (
    <div className="min-h-screen bg-white font-serif">
      {/* Hero Section */}
      <section className="container mx-auto max-w-7xl px-4 py-24 text-center space-y-4">
         <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic">About Us</h1>
         <p className="text-[10px] font-bold text-muted uppercase tracking-[0.4em]">Black Ink Bookstores — Books, Community & Beyond</p>
      </section>

      {/* Our Story */}
      <section className="container mx-auto max-w-5xl px-4 py-20 border-t border-black/5">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
           <div className="flex-1 space-y-8">
              <h2 className="text-3xl font-black uppercase tracking-tighter italic border-b border-black pb-4 inline-block">
                {contentMap['about-story']?.title || 'Our Story'}
              </h2>
              <div className="prose prose-sm max-w-none text-muted leading-relaxed uppercase tracking-wide text-[11px] whitespace-pre-wrap">
                {contentMap['about-story']?.content}
              </div>
           </div>
           <div className="w-full lg:w-[40%] aspect-square relative grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
              <Image src="/logo.png" alt="Black Ink Owl" fill className="object-contain p-12" />
           </div>
        </div>
      </section>

      {/* Our Belief */}
      <section className="bg-black text-white py-32">
        <div className="container mx-auto max-w-4xl px-4 text-center space-y-12">
           <h2 className="text-4xl font-black uppercase tracking-tighter italic">
             {contentMap['about-belief']?.title || 'Our Belief'}
           </h2>
           <p className="text-white/60 text-xs leading-loose uppercase tracking-[0.1em] max-w-2xl mx-auto">
             {contentMap['about-belief']?.content}
           </p>
           <div className="flex justify-center gap-12 pt-8 border-t border-white/10">
              <Principle label="Integrity" />
              <Principle label="Quality" />
              <Principle label="Community" />
           </div>
        </div>
      </section>

      {/* What We Offer / Meet Community */}
      <section className="container mx-auto max-w-7xl px-4 py-32 grid md:grid-cols-2 gap-20">
         <div className="space-y-8">
            <h2 className="text-2xl font-black uppercase tracking-tighter italic border-b border-black pb-2">
              {contentMap['about-offer']?.title || 'What We Offer'}
            </h2>
            <p className="text-[11px] text-muted leading-relaxed uppercase tracking-wider">
               {contentMap['about-offer']?.content}
            </p>
         </div>
         <div className="space-y-8">
            <h2 className="text-2xl font-black uppercase tracking-tighter italic border-b border-black pb-2">
              {contentMap['about-community']?.title || 'Meet our Community'}
            </h2>
            <p className="text-[11px] text-muted leading-relaxed uppercase tracking-wider">
               {contentMap['about-community']?.content}
            </p>
         </div>
      </section>

      {/* Footer Decoration */}
      <div className="py-20 flex justify-center opacity-10 grayscale">
         <Image src="/logo.png" alt="Decoration" width={100} height={100} />
      </div>
    </div>
  )
}

function Principle({ label }: { label: string }) {
  return (
    <div className="space-y-2">
       <div className="w-1.5 h-1.5 bg-white mx-auto rounded-full" />
       <span className="text-[10px] font-black uppercase tracking-[0.3em]">{label}</span>
    </div>
  )
}
