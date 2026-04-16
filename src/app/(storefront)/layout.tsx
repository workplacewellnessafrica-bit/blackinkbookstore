import { NavBar } from '@/components/storefront/NavBar'
import { Footer } from '@/components/storefront/Footer'

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
