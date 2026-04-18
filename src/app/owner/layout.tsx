import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function OwnerLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen flex bg-[#FAFAF9]">
      <aside className="w-64 border-r border-border bg-white flex flex-col flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-border text-text">
          <Link href="/" className="font-bold text-xl tracking-tighter text-text hover:opacity-80">BLACKINK BOOKSTORE.</Link>
          <span className="ml-2 text-xs font-semibold bg-black/5 px-2 py-1 rounded">CMS</span>
        </div>
        <nav className="flex-1 p-4 space-y-1 text-sm font-medium">
          <Link href="/owner" className="block px-4 py-2.5 rounded-md text-muted hover:bg-black/5 hover:text-text transition-colors">Analytics Scope</Link>
          <Link href="/owner/orders" className="block px-4 py-2.5 rounded-md text-muted hover:bg-black/5 hover:text-text transition-colors">Orders Log</Link>
          <Link href="/owner/inventory" className="block px-4 py-2.5 rounded-md text-muted hover:bg-black/5 hover:text-text transition-colors">Book Inventory</Link>
          <Link href="/owner/shipping" className="block px-4 py-2.5 rounded-md text-muted hover:bg-black/5 hover:text-text transition-colors">Shipping Matrix</Link>
          <Link href="/owner/content" className="block px-4 py-2.5 rounded-md text-muted hover:bg-black/5 hover:text-text transition-colors">Page Content</Link>
        </nav>
        <div className="p-6 border-t border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm">O</div>
            <div className="overflow-hidden">
               <p className="text-sm font-bold truncate">Owner Key</p>
               <p className="text-xs text-muted truncate">{session.user?.email}</p>
            </div>
          </div>
          <Link href="/api/auth/signout" className="block text-center text-sm font-semibold text-error border border-error/20 rounded py-2 hover:bg-error/5 transition-colors">Logout Instance</Link>
        </div>
      </aside>
      
      <main className="flex-1 overflow-auto">
        <div className="p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
