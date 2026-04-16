import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import { approveReview, deleteReview } from '@/app/actions/content'

export const revalidate = 0

export default async function ReviewsAdminPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text uppercase tracking-widest">Public Voice Moderation</h1>
          <p className="text-xs text-muted mt-1 uppercase tracking-wider">Approve or archive reader testimonials.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {reviews.map((review) => (
          <Card key={review.id} className={review.isApproved ? 'opacity-60 border-solid' : 'border-dashed border-accent hover:border-solid transition-all'}>
            <CardContent className="p-6 flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center font-bold text-xs uppercase">
                    {review.name.slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest">{review.name}</h3>
                    <p className="text-[9px] text-muted font-bold uppercase tracking-tight">{review.location} • {review.email}</p>
                  </div>
                </div>
                <p className="text-xs leading-relaxed italic border-l-2 border-black/10 pl-4 py-1">"{review.content}"</p>
                <div className="flex gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-[8px]">★</span>
                  ))}
                </div>
              </div>

              <div className="flex md:flex-col gap-2 justify-center">
                {!review.isApproved && (
                  <form action={async () => {
                    'use server'
                    await approveReview(review.id)
                  }}>
                    <button type="submit" className="w-full bg-black text-white px-6 py-2 text-[9px] font-black uppercase tracking-widest hover:bg-black/90 transition-colors">
                      Publish Testimony
                    </button>
                  </form>
                )}
                <form action={async () => {
                  'use server'
                  await deleteReview(review.id)
                }}>
                  <button type="submit" className="w-full border border-error text-error px-6 py-2 text-[9px] font-black uppercase tracking-widest hover:bg-error/5 transition-colors">
                    Archive
                  </button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
        {reviews.length === 0 && (
          <div className="p-20 text-center border-2 border-dashed border-border rounded-xl">
            <p className="text-xs text-muted uppercase tracking-[0.3em] font-bold">No public feedback submitted yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
