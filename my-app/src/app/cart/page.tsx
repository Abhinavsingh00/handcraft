// Cart page for Pawfectly Handmade

'use client'

import { useCart } from '@/hooks/use-cart'
import { CartItem } from '@/components/cart/cart-item'
import { CartSummary } from '@/components/cart/cart-summary'
import Link from 'next/link'
import { ShoppingBag, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CartPage() {
  const { items, isLoaded } = useCart()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-4xl font-bold text-foreground mb-8">
          Shopping Cart
        </h1>

        {!isLoaded ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-pulse text-muted-foreground">Loading cart...</div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-muted-foreground/50" />
              </div>
            </div>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
              Your cart is empty
            </h2>
            <p className="font-body text-muted-foreground mb-8 max-w-md mx-auto">
              Looks like you haven&apos;t added anything to your cart yet. Start shopping to fill it with
              handmade goodies for your pup!
            </p>
            <Button asChild size="lg">
              <Link href="/shop">
                <Package className="w-5 h-5 mr-2" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>
            <div className="lg:col-span-1">
              <CartSummary />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
