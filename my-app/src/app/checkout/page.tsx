// Checkout page for Pawfectly Handmade (Simplified for Phase 1)

'use client'

import { useCart } from '@/hooks/use-cart'
import { CheckoutSteps } from '@/components/checkout/checkout-steps'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function CheckoutPage() {
  const { items } = useCart()
  const router = useRouter()

  if (items.length === 0) {
    router.push('/cart')
    return null
  }

  const cartTotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

  const handleContinue = () => {
    router.push('/checkout/success')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-4xl font-bold text-foreground mb-8">
          Checkout
        </h1>

        <CheckoutSteps currentStep={2} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Simplified demo checkout */}
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="font-display text-xl font-semibold mb-4 text-foreground">
                Shipping Information
              </h2>
              <p className="text-muted-foreground mb-6">
                Enter your shipping details below. This is a demo checkout.
              </p>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block font-body text-sm font-medium text-foreground mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block font-body text-sm font-medium text-foreground mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block font-body text-sm font-medium text-foreground mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block font-body text-sm font-medium text-foreground mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="md:col-span-3">
                    <label htmlFor="city" className="block font-body text-sm font-medium text-foreground mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <label htmlFor="zip" className="block font-body text-sm font-medium text-foreground mb-1">
                      ZIP
                    </label>
                    <input
                      type="text"
                      id="zip"
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                      placeholder="10001"
                    />
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleContinue}
                >
                  Continue to Payment →
                </Button>
              </div>
            </div>

            {/* Demo Notice */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-6">
              <p className="text-sm text-foreground">
                <strong className="font-semibold">Demo Mode:</strong> This checkout is simplified for demonstration.
                In Phase 2, this will include full payment integration and order processing.
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-6 shadow-sm sticky top-20">
              <h2 className="font-display text-xl font-semibold mb-4 text-foreground">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-foreground">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="text-foreground">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-3">
                <div className="flex justify-between font-bold text-lg text-foreground">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
