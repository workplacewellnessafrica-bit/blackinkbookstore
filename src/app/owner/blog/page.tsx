import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { deletePost, upsertPost } from '@/app/actions/content'
import Link from 'next/link'

export const revalidate = 0

export default async function BlogAdminPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text uppercase tracking-widest">Blog Management</h1>
          <p className="text-xs text-muted mt-1 uppercase tracking-wider">Share the story behind the books.</p>
        </div>
        <form action={async () => {
          'use server'
          const formData = new FormData()
          formData.append('title', 'Draft Post ' + new Date().toLocaleDateString())
          formData.append('content', 'Start typing your story...')
          formData.append('published', 'false')
          await upsertPost(formData)
        }}>
          <Button type="submit" className="bg-black text-white px-6 uppercase text-[10px] font-black tracking-widest">Create New Post</Button>
        </form>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAFAF9] text-muted border-b border-border">
              <tr>
                <th className="px-6 py-4 font-black uppercase tracking-widest">Title</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest">Created</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-border/50 hover:bg-black/5 transition-colors">
                  <td className="px-6 py-4 font-bold text-black uppercase tracking-tight">{post.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${post.published ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted uppercase font-mono">{post.createdAt.toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right space-x-4">
                    {/* Placeholder for real edit modal/page */}
                    <button className="text-accent hover:underline font-black uppercase text-[9px]">Edit</button>
                    <form action={async () => {
                      'use server'
                      await deletePost(post.id)
                    }} className="inline">
                      <button type="submit" className="text-error hover:underline font-black uppercase text-[9px]">Delete</button>
                    </form>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr><td colSpan={4} className="p-12 text-center text-muted uppercase tracking-widest text-[10px]">No blog entries yet.</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
