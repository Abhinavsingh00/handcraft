// ProductGrid component for Pawfectly Handmade

import { Product } from '@/types'
import { ProductCard } from './product-card'

interface ProductGridProps {
  products: Product[]
  columns?: 2 | 3 | 4
  priority?: boolean
}

export function ProductGrid({ products, columns = 4, priority }: ProductGridProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }

  return (
    <div className={`grid grid-cols-2 md:${gridCols[columns]} gap-4 md:gap-6`}>
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={priority && index < 4}
        />
      ))}
    </div>
  )
}
