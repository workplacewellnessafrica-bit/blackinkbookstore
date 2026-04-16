'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

export function BookCard({ book }: { book: any }) {
  return (
    <Link href={`/books/${book.id}`}>
      <motion.div 
        className="group relative w-full aspect-[2/3] overflow-hidden rounded-md bg-border/20 cursor-pointer"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {book.coverImage && (
          <Image
            src={book.coverImage}
            alt={book.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        
        {/* Overlay matches PRD F-09 */}
        <div className="absolute inset-0 bg-background/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-lg font-bold text-text mb-1 line-clamp-2">{book.title}</h3>
            <p className="text-sm text-muted mb-3">{book.author}</p>
            <p className="font-mono text-sm font-semibold text-text">
              KES {book.price.toLocaleString()}
            </p>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
