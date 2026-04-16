'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

export function BookCard({ book }: { book: any }) {
  return (
    <Link href={`/books/${book.id}`} className="group block">
      <motion.div 
        className="relative aspect-[3/4] overflow-hidden rounded-sm bg-black/5"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {book.coverImage && (
          <Image
            src={book.coverImage}
            alt={book.title}
            fill
            sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </motion.div>
      
      <div className="mt-2 space-y-0.5">
        <h3 className="text-[10px] font-bold tracking-tight text-black uppercase truncate group-hover:underline">
          {book.title}
        </h3>
        <div className="flex justify-between items-center">
          <p className="text-[9px] font-medium text-muted uppercase tracking-wider truncate max-w-[70%]">
            {book.author}
          </p>
          <p className="text-[9px] font-black text-black">
             KES {book.price.toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  )
}
