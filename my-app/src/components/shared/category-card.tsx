// CategoryCard component for Pawfectly Handmade

'use client'

import Image from 'next/image'
import Link from 'next/link'

interface CategoryCardProps {
  name: string
  slug: string
  image: string
  count: number
}

export function CategoryCard({ name, slug, image, count }: CategoryCardProps) {
  return (
    <Link
      href={`/shop?category=${slug}`}
      className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 block"
    >
      <div className="relative aspect-square md:aspect-[4/3]">
        {/* Placeholder gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30" />

        {/* Image with overlay */}
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="font-body text-sm text-white/90">
            {count} products
          </p>
        </div>
      </div>
    </Link>
  )
}
