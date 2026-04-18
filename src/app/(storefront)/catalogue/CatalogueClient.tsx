'use client'
import { useState, useMemo } from 'react'
import { BookCard } from '@/components/storefront/BookCard'

type Props = {
  books: any[]
  sections: Record<string, string[]>
}

export function CatalogueClient({ books, sections }: Props) {
  const [activeSection, setActiveSection] = useState<string>('all')
  const [activeGenre, setActiveGenre] = useState<string>('all')
  const [activeCondition, setActiveCondition] = useState<'all' | 'new' | 'thrift'>('all')

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      // 1. Section Filter
      if (activeSection !== 'all') {
        const genresInSection = sections[activeSection] || []
        if (!genresInSection.includes(book.genre || '')) return false
      }
      
      // 2. Genre Filter
      if (activeGenre !== 'all' && book.genre !== activeGenre) return false
      
      // 3. Condition Filter
      if (activeCondition === 'new' && book.isThrift) return false
      if (activeCondition === 'thrift' && !book.isThrift) return false
      
      return true
    })
  }, [books, activeSection, activeGenre, activeCondition, sections])

  return (
    <div className="space-y-12">


      {/* Filter Area */}
      <div className="space-y-10 group">
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Browse by Section</p>
          <div className="flex flex-wrap gap-2">
            <FilterTab 
              label="All Books" 
              active={activeSection === 'all'} 
              onClick={() => { setActiveSection('all'); setActiveGenre('all'); }} 
            />
            {Object.keys(sections).map(sec => (
              <FilterTab 
                key={sec} 
                label={sec} 
                active={activeSection === sec} 
                onClick={() => { setActiveSection(sec); setActiveGenre('all'); }} 
              />
            ))}
          </div>
        </div>

        {/* Sub-Genre Tabs (Animated Expand) */}
        {activeSection !== 'all' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Filter by Genre</p>
            <div className="flex flex-wrap gap-2">
              <FilterTab 
                label="All Genres" 
                active={activeGenre === 'all'} 
                onClick={() => setActiveGenre('all')} 
                small
              />
              {sections[activeSection].map(gen => (
                <FilterTab 
                  key={gen} 
                  label={gen} 
                  active={activeGenre === gen} 
                  onClick={() => setActiveGenre(gen)} 
                  small
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-6 pt-4">
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Condition:</span>
           <div className="flex gap-2">
              <ConditionBtn 
                label="All" 
                active={activeCondition === 'all'} 
                onClick={() => setActiveCondition('all')}
                variant="all"
              />
              <ConditionBtn 
                label="New" 
                active={activeCondition === 'new'} 
                onClick={() => setActiveCondition('new')}
                variant="new"
              />
              <ConditionBtn 
                label="Thrift" 
                active={activeCondition === 'thrift'} 
                onClick={() => setActiveCondition('thrift')}
                variant="thrift"
              />
           </div>
        </div>
      </div>

      {/* Results Rendering */}
      <div className="pt-12 border-t border-black/5">
        <div className="flex justify-between items-center mb-8">
           <span className="text-[10px] font-bold text-muted uppercase tracking-widest leading-none">
             Showing {filteredBooks.length} results
           </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="py-20 text-center space-y-4">
             <p className="text-sm font-black uppercase tracking-[0.2em] opacity-40">No matches found in the library.</p>
             <button onClick={() => { setActiveSection('all'); setActiveGenre('all'); setActiveCondition('all'); }} className="text-xs underline font-bold uppercase tracking-wider">Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  )
}

function FilterTab({ label, active, onClick, small = false }: { label: string, active: boolean, onClick: () => void, small?: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={`rounded-full px-6 py-2.5 text-xs font-bold font-sans uppercase tracking-widest transition-all duration-200 border
        ${active 
          ? 'bg-black text-white border-black scale-105' 
          : 'bg-white text-muted border-black/10 hover:border-black hover:text-black'}
        ${small ? 'px-4 py-1.5 text-[10px]' : ''}`}
    >
      {label}
    </button>
  )
}

function ConditionBtn({ label, active, onClick, variant }: { label: string, active: boolean, onClick: () => void, variant: 'all' | 'new' | 'thrift' }) {
  const styles = {
    all: active ? 'bg-black text-white' : 'hover:bg-black/5',
    new: active ? 'bg-[#1a5c2e] text-[#b2f5c8]' : 'hover:bg-[#1a5c2e]/10 text-[#1a5c2e]',
    thrift: active ? 'bg-[#7c3a00] text-[#ffd9a8]' : 'hover:bg-[#7c3a00]/10 text-[#7c3a00]'
  }

  return (
    <button 
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border border-transparent
        ${styles[variant]} ${active ? 'border-current' : ''}`}
    >
      {label}
    </button>
  )
}
