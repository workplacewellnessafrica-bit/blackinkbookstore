export function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="container mx-auto max-w-6xl px-4 py-8 flex flex-col md:flex-row items-center justify-between text-sm text-muted">
        <p>© {new Date().getFullYear()} Blackink Bookstore. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-text transition-colors">Instagram</a>
          <a href="#" className="hover:text-text transition-colors">Twitter</a>
        </div>
      </div>
    </footer>
  )
}
