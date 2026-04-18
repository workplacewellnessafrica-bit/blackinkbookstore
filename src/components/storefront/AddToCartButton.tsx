'use client'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cart'
import { useState } from 'react'

export function AddToCartButton({ book }: { book: any }) {
  const addItem = useCartStore((state) => state.addItem)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem({
      id: book.id,
      title: book.title,
      price: book.price,
      coverImage: book.coverImage,
      author: book.author,
      weight: book.weight,
      format: book.format,
      description: book.description,
      isThrift: book.isThrift
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <Button 
      size="lg" 
      onClick={handleAdd}
      disabled={book.stock <= 0}
      className={added ? 'bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto' : 'w-full sm:w-auto'}
    >
      {book.stock <= 0 ? 'Out of Stock' : added ? 'Added to Cart ✓' : 'Add to Cart'}
    </Button>
  )
}
