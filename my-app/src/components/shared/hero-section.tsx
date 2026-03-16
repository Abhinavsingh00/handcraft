// HeroSection component for Pawfectly Handmade homepage

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, PawPrint } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        {/* Hero image */}
        <img
          src="/images/home/hero-banner.jpg"
          alt="Happy dogs with handmade products"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 z-10" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-2xl">
          {/* Icon */}
          <div className="flex items-center gap-2 mb-6">
            <PawPrint className="w-8 h-8 text-primary" />
            <span className="font-body text-sm uppercase tracking-wider text-primary font-semibold">
              Handmade with Love
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            For Your Furry
            <span className="block text-primary">Best Friend</span>
          </h1>

          {/* Subtext */}
          <p className="font-body text-lg md:text-xl text-white/90 mb-8 max-w-lg">
            Discover premium handmade dog products. From cozy beds to stylish collars,
            everything is crafted with care using eco-friendly materials.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button
              asChild
              size="lg"
              className="text-lg bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/shop">
                Shop Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg bg-white/10 border-white text-white hover:bg-white/20"
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center gap-6 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌿</span>
              <span>Eco-Friendly Materials</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✋</span>
              <span>Handmade with Care</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚚</span>
              <span>Free Shipping $50+</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
