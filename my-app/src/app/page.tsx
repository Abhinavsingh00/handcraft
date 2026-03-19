// Home page for Pawfectly Handmade

import { HeroSection } from '@/components/shared/hero-section'
import { ProductGrid } from '@/components/product/product-grid'
import { CategoryCard } from '@/components/shared/category-card'
import { TestimonialCard } from '@/components/shared/testimonial-card'
import { getFeaturedProducts, getNewProducts } from '@/app/actions/products'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()
  const newProducts = await getNewProducts()

  const categories = [
    {
      name: 'Collars & Leashes',
      slug: 'collars-leashes',
      image: '/images/categories/collars.jpg',
      count: 5
    },
    {
      name: 'Treats & Chews',
      slug: 'treats-chews',
      image: '/images/categories/treats.jpg',
      count: 5
    },
    {
      name: 'Beds & Blankets',
      slug: 'beds-blankets',
      image: '/images/categories/beds.jpg',
      count: 5
    },
    {
      name: 'Toys & Accessories',
      slug: 'toys-accessories',
      image: '/images/categories/toys.jpg',
      count: 7
    },
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      image: '/images/testimonials/sarah.jpg',
      rating: 5,
      quote: 'The leather collar I bought is amazing quality! You can really feel the handmade difference. My dog looks so stylish!',
      verified: true,
    },
    {
      name: 'Mike Thompson',
      image: '/images/testimonials/mike.jpg',
      rating: 5,
      quote: 'My dog loves his new bed. The shipping was fast and the product exceeded my expectations. Definitely ordering more!',
      verified: true,
    },
    {
      name: 'Emily Chen',
      image: '/images/testimonials/emily.jpg',
      rating: 5,
      quote: 'Great selection of unique toys. The bulk pricing is fantastic for multiple dog households like ours!',
      verified: true,
    },
  ]

  return (
    <>
      <HeroSection />

      {/* Featured Products */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">
              Featured Products
            </h2>
            <p className="font-body text-lg text-foreground/70">
              Our most popular handmade items
            </p>
          </div>
          <ProductGrid products={featuredProducts} priority />
          <div className="text-center mt-8">
            <Button asChild size="lg">
              <Link href="/shop">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">
              Shop by Category
            </h2>
            <p className="font-body text-lg text-foreground/70">
              Find the perfect item for your pup
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.slug} {...category} />
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">
              Bestselling Products
            </h2>
            <p className="font-body text-lg text-foreground/70">
              Customer favorites
            </p>
          </div>
          <ProductGrid products={newProducts} />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">
              What Our Customers Say
            </h2>
            <p className="font-body text-lg text-foreground/70">
              Real reviews from real customers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-4xl font-bold mb-4">
            Join Our Pack
          </h2>
          <p className="font-body text-lg mb-8 opacity-90">
            Get updates on new products, exclusive offers, and dog care tips!
          </p>
          <form className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-3 rounded-md bg-white text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground"
              aria-label="Email address"
              suppressHydrationWarning
            />
            <Button
              type="submit"
              size="lg"
              className="bg-foreground text-background hover:bg-foreground/90"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </>
  )
}
