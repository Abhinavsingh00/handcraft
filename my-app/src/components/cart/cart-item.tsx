// CartItem component for Pawfectly Handmade

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { CartItem as CartItemType } from '@/types'
import { useCart } from '@/hooks/use-cart'
import { getBulkPricingForProduct } from '@/lib/cart-utils'
import { Button } from '@/components/ui/button'

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart()
  const discount = getBulkPricingForProduct(item.product, item.quantity)
  const itemPrice = item.product.price * (1 - discount / 100)
  const itemTotal = itemPrice * item.quantity

  return (
    <div className="flex gap-4 p-4 border border-border rounded-lg bg-card">
      {/* Image */}
      <div className="relative w-24 h-24 flex-shrink-0">
        {/* Placeholder gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-md" />
        <Image
          src={item.product.images[0] || '/images/placeholder.jpg'}
          alt={item.product.name}
          fill
          className="object-cover rounded-md"
          sizes="96px"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <Link
              href={`/product/${item.product.slug}`}
              className="font-display text-lg font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
            >
              {item.product.name}
            </Link>
            <p className="font-body text-sm text-muted-foreground">
              ${itemPrice.toFixed(2)} each
            </p>
          </div>
          <button
            onClick={() => removeFromCart(item.product.id)}
            className="p-1 hover:bg-muted rounded transition-colors"
            aria-label="Remove item"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </button>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              className="w-8 h-8"
              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </Button>
            <span className="font-body text-sm w-8 text-center">
              {item.quantity}
            </span>
            <Button
              size="icon"
              variant="outline"
              className="w-8 h-8"
              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
              disabled={item.quantity >= item.product.stock}
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>

          <p className="font-body text-lg font-bold text-foreground">
            ${itemTotal.toFixed(2)}
          </p>
        </div>

        {/* Stock warning */}
        {item.quantity >= item.product.stock && (
          <p className="text-xs text-orange-600 mt-2">
            Maximum stock reached
          </p>
        )}

        {/* Bulk discount notice */}
        {discount > 0 && (
          <p className="text-xs text-green-600 mt-2 font-medium">
            {discount}% bulk discount applied
          </p>
        )}
      </div>
    </div>
  )
}
