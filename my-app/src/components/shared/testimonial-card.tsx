// TestimonialCard component for Pawfectly Handmade

import Image from 'next/image'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TestimonialCardProps {
  name: string
  image: string
  rating: number
  quote: string
  verified?: boolean
}

export function TestimonialCard({ name, image, rating, quote, verified }: TestimonialCardProps) {
  return (
    <div className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-4 mb-4">
        {/* Avatar placeholder */}
        <div className="relative w-16 h-16 flex-shrink-0">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-primary font-display text-2xl font-bold">
            {name.charAt(0)}
          </div>
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover rounded-full"
            sizes="64px"
          />
        </div>
        <div className="flex-1">
          <h4 className="font-display text-lg font-semibold text-foreground">
            {name}
          </h4>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'w-4 h-4',
                  i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Quote */}
      <p className="font-body text-foreground/80 italic mb-4 leading-relaxed">
        &ldquo;{quote}&rdquo;
      </p>

      {/* Verified badge */}
      {verified && (
        <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Verified Purchase
        </div>
      )}
    </div>
  )
}
