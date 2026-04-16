'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { upsertBook } from '@/app/actions/inventory'

export function BookForm({ book }: { book?: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      await upsertBook(formData)
      router.push('/owner/inventory')
      router.refresh()
    } catch (err) {
      alert('Failed to save book. Please check your credentials and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl bg-white p-8 rounded-lg border border-border">
      <input type="hidden" name="id" value={book?.id || ''} />
      <input type="hidden" name="existingCoverImage" value={book?.coverImage || ''} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold uppercase tracking-widest text-muted">Book Title</label>
          <Input name="title" defaultValue={book?.title} required placeholder="The Great Gatsby" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold uppercase tracking-widest text-muted">Author Name</label>
          <Input name="author" defaultValue={book?.author} required placeholder="F. Scott Fitzgerald" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold uppercase tracking-widest text-muted">Category (Genre)</label>
          <select name="genre" defaultValue={book?.genre || 'Classic Fiction'} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
            <option value="Classic Fiction">Classic Fiction</option>
            <option value="Romance">Romance</option>
            <option value="Mystery">Mystery</option>
            <option value="History">History</option>
            <option value="Wellness">Wellness</option>
            <option value="Business">Business</option>
            <option value="Art & Design">Art & Design</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold uppercase tracking-widest text-muted">ISBN (Optional)</label>
          <Input name="isbn" defaultValue={book?.isbn} placeholder="9780000000000" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold uppercase tracking-widest text-muted">Book Blurb / Description</label>
        <textarea 
          name="description" 
          defaultValue={book?.description} 
          rows={6} 
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder="Enter a compelling description for the book..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold uppercase tracking-widest text-muted">Market Price (KES)</label>
          <Input name="price" type="number" defaultValue={book?.price} required placeholder="1200" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold uppercase tracking-widest text-muted">Available Stock</label>
          <Input name="stock" type="number" defaultValue={book?.stock} required placeholder="10" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold uppercase tracking-widest text-muted">Cover Image Upload</label>
        <div className="flex items-center gap-4">
          {book?.coverImage && (
            <img src={book.coverImage} className="w-20 h-28 object-cover rounded border border-border" alt="Current cover" />
          )}
          <Input name="coverImage" type="file" accept="image/*" className="cursor-pointer" />
        </div>
        <p className="text-[10px] text-muted">Uploaded directly to secure cloud storage (Cloudinary).</p>
      </div>

      <div className="pt-4 flex gap-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Saving Changes...' : (book ? 'Update Book Instance' : 'Publish New Book')}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  )
}
