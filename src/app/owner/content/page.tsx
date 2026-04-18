import { prisma } from '@/lib/prisma'
import { ContentEditor } from './ContentEditor'

export default async function ContentDashboard() {
  const sections = await prisma.siteContent.findMany({
    orderBy: { key: 'asc' }
  })

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter italic">Page Content Curator</h1>
          <p className="text-xs font-semibold text-muted uppercase tracking-widest mt-1">Manage static page sections & editorial copy</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-12">
        {sections.map(section => (
          <ContentEditor key={section.id} section={section} />
        ))}
      </div>
    </div>
  )
}
