'use client'
import { useState } from 'react'
import { updateSiteContent } from '@/app/actions/content'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function ContentEditor({ section }: { section: any }) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      await updateSiteContent(formData)
      alert("Section updated successfully.")
    } catch (err) {
      alert("Failed to update section.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 border border-border shadow-sm space-y-6">
      <input type="hidden" name="id" value={section.id} />
      
      <div className="flex justify-between items-center border-b border-border pb-4">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">Key: {section.key}</span>
        <Button size="sm" type="submit" disabled={loading} className="bg-black text-white px-6 font-bold uppercase tracking-widest text-[10px]">
          {loading ? 'Saving...' : 'Update Section'}
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
           <label className="text-[10px] font-black uppercase tracking-widest">Display Title</label>
           <Input name="title" defaultValue={section.title} className="rounded-none border-black/10 font-serif text-lg italic" />
        </div>
        
        <div className="space-y-2">
           <label className="text-[10px] font-black uppercase tracking-widest">Editorial Content</label>
           <textarea 
             name="content" 
             defaultValue={section.content} 
             rows={8} 
             className="flex w-full rounded-none border border-black/10 bg-background px-3 py-2 text-xs font-bold tracking-wide uppercase leading-relaxed text-muted focus:outline-none focus:ring-1 focus:ring-black"
           />
        </div>
      </div>
    </form>
  )
}
