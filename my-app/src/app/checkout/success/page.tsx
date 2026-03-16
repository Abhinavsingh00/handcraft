// Checkout success page for Pawfectly Handmade

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check, Package, ShoppingBag } from 'lucide-react'

export default function CheckoutSuccessPage() {
  // In production, this would come from the order data
  const orderId = 'ORD-123456' // Static for demo
  const customerName = 'John Doe'

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-16">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-12 h-12 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Order Confirmed!
          </h1>

          <p className="font-body text-lg text-foreground/70 mb-8">
            Thank you, {customerName}! We&apos;ve received your order and will begin processing it right away.
          </p>

          {/* Order Details Card */}
          <div className="bg-card rounded-lg p-6 shadow-sm mb-8 border border-border">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Package className="w-5 h-5 text-primary" />
              <span className="font-display text-lg font-semibold text-foreground">
                Order #{orderId}
              </span>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground mb-4">
              <p>A confirmation email has been sent to your email address.</p>
              <p>You can track your order status in your email or by contacting our support team.</p>
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-xs text-muted-foreground">
                Estimated delivery: 3-5 business days
              </p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-muted/30 rounded-lg p-6 mb-8">
            <h2 className="font-display text-lg font-semibold text-foreground mb-3">
              What&apos;s Next?
            </h2>
            <ul className="text-left space-y-2 text-sm text-foreground/80 max-w-md mx-auto">
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Check your email for order confirmation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">→</span>
                <span>We&apos;ll prepare your items with care</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">→</span>
                <span>You&apos;ll receive a shipping notification when it ships</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">→</span>
                <span>Estimated delivery in 3-5 business days</span>
              </li>
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="flex-1 sm:flex-initial">
              <Link href="/shop">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Continue Shopping
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="flex-1 sm:flex-initial">
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>

          {/* Trust Message */}
          <p className="text-sm text-muted-foreground mt-8">
            Questions? Email us at{' '}
            <a href="mailto:support@pawfectlyhandmade.com" className="text-primary hover:underline">
              support@pawfectlyhandmade.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
