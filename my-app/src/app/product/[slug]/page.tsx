// Product detail page for Pawfectly Handmade

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getProductBySlug, getProductsByCategory } from '@/app/actions/products'
import { BulkPricingTable } from '@/components/product/bulk-pricing-table'
import { ProductGrid } from '@/components/product/product-grid'
import { AddToCartButton } from '@/components/cart/add-to-cart-button'
import { Star, Heart } from 'lucide-react'

interface ProductPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  return {
    title: `${product.name} | Pawfectly Handmade`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images,
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = (await getProductsByCategory(product.category))
    .filter(p => p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <nav className="container mx-auto px-4 py-4">
        <ol className="flex items-center gap-2 text-sm">
          <li>
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
          </li>
          <li className="text-muted-foreground">/</li>
          <li>
            <Link href="/shop" className="text-muted-foreground hover:text-foreground transition-colors">
              Shop
            </Link>
          </li>
          <li className="text-muted-foreground">/</li>
          <li className="font-medium text-foreground">{product.name}</li>
        </ol>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-square mb-4 bg-muted rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <span className="font-display text-6xl text-primary/40">
                  {product.name.charAt(0)}
                </span>
              </div>
              <Image
                src={product.images[0] || '/images/placeholder.jpg'}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(1, 5).map((image, index) => (
                  <div key={index} className="relative aspect-square bg-muted rounded-md overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                    <Image
                      src={image}
                      alt={`${product.name} view ${index + 2}`}
                      fill
                      className="object-cover"
                      sizes="100px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {product.badge && (
              <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full mb-4">
                {product.badge === 'new' && 'bg-green-100 text-green-700'}
                {product.badge === 'sale' && 'bg-red-100 text-red-700'}
                {product.badge === 'bestseller' && 'bg-orange-100 text-orange-700'}
              </span>
            )}

            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                (42 reviews)
              </span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <span className="font-display text-3xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
              {product.comparePrice && (
                <span className="font-body text-xl text-muted-foreground line-through">
                  ${product.comparePrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="font-body text-lg text-foreground/80 mb-8 leading-relaxed">
              {product.description}
            </p>

            <BulkPricingTable product={product} />

            <div className="flex items-center gap-4 mb-8">
              <AddToCartButton product={product} />
              <button
                className="p-3 border border-border rounded-lg hover:bg-muted transition-colors"
                aria-label="Add to wishlist"
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="font-display text-lg font-semibold mb-3 text-foreground">
                Features
              </h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-body text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="font-display text-3xl font-bold text-foreground mb-8">
              You Might Also Like
            </h2>
            <ProductGrid products={relatedProducts} />
          </section>
        )}
      </div>
    </div>
  )
}
