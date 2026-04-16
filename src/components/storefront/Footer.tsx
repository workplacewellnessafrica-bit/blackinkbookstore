export function Footer() {
  return (
    <footer className="border-t border-black/10 py-16 bg-white">
      <div className="container mx-auto max-w-7xl px-4 flex flex-col md:flex-row items-start justify-between gap-12 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
        <div className="space-y-4">
          <p className="text-black font-black tracking-tighter text-sm uppercase">Black Ink Bookstores.</p>
          <p>© {new Date().getFullYear()} — All Cultural Rights Reserved.</p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-12 md:gap-24">
          <div className="space-y-4">
            <h4 className="text-black font-black">Exploration</h4>
            <div className="flex flex-col gap-2">
              <a href="/books" className="hover:text-black hover:translate-x-1 transition-all">Catalogue</a>
              <a href="/blog" className="hover:text-black hover:translate-x-1 transition-all">Blog</a>
              <a href="/about" className="hover:text-black hover:translate-x-1 transition-all">Curated About</a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-black font-black">Connection</h4>
            <div className="flex flex-col gap-2">
              <a href="#" className="hover:text-black hover:translate-x-1 transition-all">Instagram</a>
              <a href="#" className="hover:text-black hover:translate-x-1 transition-all">Twitter (X)</a>
              <a href="/contact" className="hover:text-black hover:translate-x-1 transition-all">Contact Us</a>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto max-w-7xl px-4 mt-16 pt-8 border-t border-black/5 text-center">
        <p className="text-[8px] tracking-[0.4em] opacity-40">Designed for those who read deeper.</p>
      </div>
    </footer>
  )
}
