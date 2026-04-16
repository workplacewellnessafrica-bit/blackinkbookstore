'use client'
import { useState } from 'react'
import { submitReview } from '@/app/actions/content'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function ReviewSection({ reviews }: { reviews: any[] }) {
  const [submitted, setSubmitted] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    await submitReview(formData)
    setSubmitted(true)
  }

  return (
    <div className="section-divider py-32 bg-white">
      <div className="container mx-auto max-w-7xl px-4 grid grid-cols-1 lg:grid-cols-2 gap-20">
        
        {/* Left: Testimonials */}
        <div className="space-y-12">
          <div className="space-y-2">
            <h2 className="text-2xl font-black uppercase tracking-tighter">Public Voice</h2>
            <p className="text-[10px] font-bold text-muted uppercase tracking-[0.3em]">Curated Thoughts from our Readers</p>
          </div>
          
          <div className="grid grid-cols-1 gap-8">
            {reviews.filter(r => r.isApproved).map((review) => (
              <div key={review.id} className="space-y-4 border-l-2 border-black pl-8 py-2">
                <p className="text-sm font-medium leading-relaxed max-w-lg italic">
                  "{review.content}"
                </p>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-black">
                    {review.name}
                  </span>
                  <span className="text-[9px] font-bold text-muted uppercase tracking-tight">
                    {review.location}
                  </span>
                </div>
              </div>
            ))}
            {reviews.filter(r => r.isApproved).length === 0 && (
               <p className="text-xs text-muted uppercase italic tracking-widest">Awaiting the first approved voice...</p>
            )}
          </div>
        </div>

        {/* Right: Submission Form */}
        <div className="lg:border-l border-black/5 lg:pl-20">
          {submitted ? (
            <div className="h-full flex items-center justify-center text-center p-10 bg-black text-white space-y-4 flex-col">
               <h3 className="text-xl font-black uppercase tracking-widest">Thank You</h3>
               <p className="text-[10px] font-bold tracking-[0.2em] uppercase max-w-[200px]">Your testimony has been submitted for moderation.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-black">Add Your Voice</h3>
                <p className="text-[9px] text-muted font-bold uppercase tracking-widest">Share your experience with Black Ink Bookstores</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="name" required placeholder="FULL NAME" className="rounded-none border-black/10 focus:border-black uppercase text-[10px] font-bold tracking-widest" />
                <Input name="email" required type="email" placeholder="EMAIL ADDRESS" className="rounded-none border-black/10 focus:border-black uppercase text-[10px] font-bold tracking-widest" />
              </div>
              <Input name="location" required placeholder="LOCATION (e.g. NAIROBI)" className="rounded-none border-black/10 focus:border-black uppercase text-[10px] font-bold tracking-widest" />
              <textarea 
                name="content" 
                required 
                rows={4} 
                placeholder="YOUR TESTIMONY..." 
                className="w-full rounded-none border-black/10 focus:border-black p-4 uppercase text-[10px] font-bold tracking-widest outline-none border"
              />
              
              <Button type="submit" className="w-full rounded-none bg-black text-white hover:bg-black/90 font-black uppercase tracking-[0.3em] h-14 text-xs">
                Submit for Moderation
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
