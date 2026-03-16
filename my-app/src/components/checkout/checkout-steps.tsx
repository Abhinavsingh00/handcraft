// CheckoutSteps component for Pawfectly Handmade

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CheckoutStepsProps {
  currentStep: number
}

const steps = [
  { number: 1, name: 'Cart', href: '/cart' },
  { number: 2, name: 'Shipping', href: '/checkout' },
  { number: 3, name: 'Payment', href: '/checkout' },
  { number: 4, name: 'Review', href: '/checkout' },
]

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  return (
    <div className="flex items-center justify-center mb-12">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors',
                currentStep > step.number
                  ? 'bg-green-600 text-white'
                  : currentStep === step.number
                  ? 'bg-primary text-white'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {currentStep > step.number ? <Check className="w-5 h-5" /> : step.number}
            </div>
            <span
              className={cn(
                'text-sm mt-2',
                currentStep >= step.number ? 'text-foreground font-medium' : 'text-muted-foreground'
              )}
            >
              {step.name}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                'w-16 md:w-24 h-1 mx-2 transition-colors',
                currentStep > step.number ? 'bg-green-600' : 'bg-muted'
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}
