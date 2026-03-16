// CartSummary component for Pawfectly Handmade

'use client'

import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function CartSummary() {
  const { items, getCartSubtotal, getBulkDiscount, getCartTotal, isLoaded } = useCart()

  if (!isLoaded) {
    return (
      <div className="border border-border rounded-lg p-6 bg-card">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded" />
          <div className="h-4 bg-muted rounded w-2/3" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return null
  }

  const subtotal = getCartSubtotal()
  const discount = getBulkDiscount()
  const total = getCartTotal()
  const shipping = subtotal > 50 ? 0 : 5.99
  const finalTotal = total + shipping

  return (
    <div className="border border-border rounded-lg p-6 bg-card sticky top-20">
      <h2 className="font-display text-2xl font-semibold mb-4 text-foreground">
        Order Summary
      </h2>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="font-body text-foreground">Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
          <span className="font-body text-foreground">${subtotal.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span className="font-body">Bulk Discount</span>
            <span className="font-body">-${discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="font-body text-foreground">Shipping</span>
          <span className="font-body">
            {shipping === 0 ? (
              <span className="text-green-600">FREE</span>
            ) : (
              `$${shipping.toFixed(2)}`
            )}
          </span>
        </div>

        <div className="border-t border-border pt-3">
          <div className="flex justify-between font-bold text-lg text-foreground">
            <span>Total</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>
        </div>

        {shipping > 0 && (
          <div className="bg-primary/10 rounded-md p-3 mt-3">
            <p className="text-sm text-foreground">
              Add <span className="font-bold">${(50 - subtotal).toFixed(2)}</span> more for{' '}
              <span className="font-bold text-green-600">free shipping</span>!
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 space-y-3">
        <Button asChild className="w-full" size="lg">
          <Link href="/checkout">Proceed to Checkout</Link>
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>

      {/* Trust badges */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span>🔒 Secure Checkout</span>
          <span>🚚 Free Shipping $50+</span>
          <span>↩️ Easy Returns</span>
        </div>
      </div>
    </div>
  )
}
