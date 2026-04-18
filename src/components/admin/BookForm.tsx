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
      alert('Failed to save book. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl bg-white p-10 border border-black/5 shadow-sm">
      <input type="hidden" name="id" value={book?.id || ''} />
      <input type="hidden" name="existingCoverImage" value={book?.coverImage || ''} />

      <div className="space-y-6">
        <h2 className="text-xl font-black uppercase tracking-widest border-b border-black pb-4">Manuscript Data</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Title</label>
            <Input name="title" defaultValue={book?.title} required className="rounded-none border-black/10" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Author</label>
            <Input name="author" defaultValue={book?.author} required className="rounded-none border-black/10" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Category (Genre)</label>
            <select name="genre" defaultValue={book?.genre || 'General fiction'} className="flex h-10 w-full rounded-none border border-black/10 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black uppercase font-bold text-[10px] tracking-widest">
               <optgroup label="Fiction">
                  <option value="Romance">Romance</option>
                  <option value="Sci-fi">Sci-fi</option>
                  <option value="Mystery">Mystery</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="General fiction">General fiction</option>
                  <option value="Crime">Crime</option>
               </optgroup>
               <optgroup label="Non-Fiction">
                  <option value="Autobiography">Autobiography</option>
                  <option value="Philosophy">Philosophy</option>
                  <option value="Self-help">Self-help</option>
                  <option value="Political">Political</option>
                  <option value="Theology">Theology</option>
                  <option value="Business">Business</option>
               </optgroup>
               <optgroup label="Kids">
                  <option value="Toto Reader (0–3)">Toto Reader (0–3)</option>
                  <option value="Board books">Board books</option>
                  <option value="Junior (6–9)">Junior (6–9)</option>
                  <option value="YA (12+)">YA (12+)</option>
               </optgroup>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Format</label>
            <Input name="format" defaultValue={book?.format} placeholder="Hardcover / Paperback" className="rounded-none border-black/10" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Blurb (Editorial Description)</label>
          <textarea 
            name="description" 
            defaultValue={book?.description} 
            rows={4} 
            className="flex w-full rounded-none border border-black/10 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black uppercase text-[10px] font-bold tracking-wide"
            placeholder="The soul of the book..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Weight (KG)</label>
            <Input name="weight" type="number" step="0.01" defaultValue={book?.weight || 0.5} required className="rounded-none border-black/10" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Price (KES)</label>
            <Input name="price" type="number" defaultValue={book?.price} required className="rounded-none border-black/10" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Stock</label>
            <Input name="stock" type="number" defaultValue={book?.stock} required className="rounded-none border-black/10" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Original Price (Market)</label>
            <Input name="originalPrice" type="number" defaultValue={book?.originalPrice} placeholder="Optional" className="rounded-none border-black/10" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">SKU (Serial)</label>
            <Input name="sku" defaultValue={book?.sku} className="rounded-none border-black/10" />
          </div>
        </div>

        <div className="flex items-center gap-4 py-4 border-y border-black/5">
           <input type="checkbox" name="isThrift" id="isThrift" defaultChecked={book?.isThrift} className="w-4 h-4 accent-black" />
           <label htmlFor="isThrift" className="text-[10px] font-black uppercase tracking-widest cursor-pointer">This is a Thrift Edition</label>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Cover Image Upload</label>
          <div className="flex items-center gap-4">
            {book?.coverImage && (
              <img src={book.coverImage} className="w-16 h-24 object-cover border border-black/10" alt="Current cover" />
            )}
            <Input name="coverImage" type="file" accept="image/*" className="cursor-pointer rounded-none border-black/10" />
          </div>
        </div>
      </div>

      <div className="pt-6 flex gap-4">
        <Button type="submit" disabled={loading} className="flex-1 rounded-none bg-black text-white px-8 py-6 font-black uppercase tracking-widest text-[10px]">
          {loading ? 'Committing...' : (book ? 'Update Instance' : 'Publish to Library')}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} className="rounded-none border-black px-8 py-6 font-black uppercase tracking-widest text-[10px]">Cancel</Button>
      </div>
    </form>
  )
}
