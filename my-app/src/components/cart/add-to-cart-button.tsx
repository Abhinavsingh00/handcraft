// AddToCartButton component for Pawfectly Handmade

'use client'

import { useState } from 'react'
import { Product } from '@/types'
import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { Check, Minus, Plus } from 'lucide-react'

interface AddToCartButtonProps {
  product: Product
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center border border-border rounded-lg">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="p-3 hover:bg-muted transition-colors disabled:opacity-50"
          aria-label="Decrease quantity"
          disabled={quantity <= 1}
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-12 text-center font-body text-foreground">
          {quantity}
        </span>
        <button
          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
          className="p-3 hover:bg-muted transition-colors disabled:opacity-50"
          aria-label="Increase quantity"
          disabled={quantity >= product.stock}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <Button
        size="lg"
        className="flex-1"
        disabled={product.stock === 0 || added}
        onClick={handleAddToCart}
      >
        {added ? (
          <>
            <Check className="w-5 h-5 mr-2" />
            Added!
          </>
        ) : product.stock === 0 ? (
          'Out of Stock'
        ) : (
          'Add to Cart'
        )}
      </Button>
    </div>
  )
}
