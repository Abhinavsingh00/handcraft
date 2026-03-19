// ProductCard component for Pawfectly Handmade

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ShoppingCart, Heart } from 'lucide-react'
import { Product } from '@/types'
import { cn } from '@/lib/utils'
import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'

interface ProductCardProps {
  product: Product
  priority?: boolean
}

export function ProductCard({ product, priority }: ProductCardProps) {
  const { addToCart } = useCart()
  const [isHovered, setIsHovered] = useState(false)
  const [added, setAdded] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const discount = product.bulkPricing && product.bulkPricing.length > 0
    ? `${product.bulkPricing[0].discount}% off ${product.bulkPricing[0].minQty}+`
    : null

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
        {/* Badge */}
        {product.badge && (
          <span className={cn(
            'absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full z-10',
            product.badge === 'new' && 'bg-green-500 text-white',
            product.badge === 'sale' && 'bg-red-500 text-white',
            product.badge === 'bestseller' && 'bg-orange-500 text-white'
          )}>
            {product.badge}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          className="absolute top-3 right-3 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-white"
          aria-label="Add to wishlist"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          <Heart className="w-4 h-4 text-foreground" />
        </button>

        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          {/* Placeholder for product image */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <span className="font-display text-4xl text-primary/40">
              {product.name.charAt(0)}
            </span>
          </div>
          <Image
            src={product.images[0] || '/images/placeholder.jpg'}
            alt={product.name}
            fill
            className={cn(
              'object-cover transition-transform duration-500',
              isHovered && 'scale-110'
            )}
            priority={priority}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-2xl font-bold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors font-display">
            {product.name}
          </h3>

          <div className="flex items-center gap-2 mb-2">
            <span className="font-body text-lg font-bold text-primary">
              ${product.price.toFixed(2)}
            </span>
            {product.comparePrice && (
              <span className="font-body text-sm text-muted-foreground line-through">
                ${product.comparePrice.toFixed(2)}
              </span>
            )}
          </div>

          {discount && (
            <p className="text-xs text-green-600 font-medium mb-3">
              Save {discount}
            </p>
          )}

          {/* Add to Cart Button */}
          <Button
            className="w-full transition-all duration-300 hover:bg-primary/90"
            onClick={handleAddToCart}
            disabled={added}
          >
            {added ? (
              <>Added!</>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </Link>
  )
}
