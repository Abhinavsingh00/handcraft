// Mock product data for Pawfectly Handmade ecommerce
// This file will be replaced with Supabase data in Phase 2

import { Product } from '@/types'

const now = new Date()

export const mockProducts: Product[] = [
  // ==================== COLLARS & LEASHES ====================
  {
    id: '1',
    slug: 'handmade-leather-collar',
    name: 'Handmade Leather Collar',
    description: 'Premium leather collar with brass hardware, hand-stitched for durability. Each collar is crafted with care using high-quality vegetable-tanned leather that ages beautifully over time.',
    price: 29.99,
    category: 'collars-leashes',
    badge: 'bestseller',
    images: ['/images/products/collars/leather-collar-1.jpg', '/images/products/collars/leather-collar-2.jpg'],
    features: ['Genuine vegetable-tanned leather', 'Solid brass buckle', 'Hand-stitched construction', 'Available in 5 sizes'],
    stock: 50,
    bulkPricing: [
      { minQty: 2, discount: 10 },
      { minQty: 5, discount: 20 },
    ],
    metadata: { createdAt: now, updatedAt: now }
  },
  {
    id: '2',
    slug: 'braided-paracord-collar',
    name: 'Braided Paracord Collar',
    description: 'Strong and stylish paracord collar with quick-release buckle. Made from military-grade 550 paracord, this collar is both functional and fashionable.',
    price: 19.99,
    category: 'collars-leashes',
    badge: 'new',
    images: ['/images/products/collars/paracord-collar-1.jpg'],
    features: ['Military-grade 550 paracord', 'Quick-release buckle', 'Available in 12 colors', 'Breakaway safety option'],
    stock: 75,
    bulkPricing: [
      { minQty: 3, discount: 15 },
    ],
    metadata: { createdAt: now, updatedAt: now }
  },
  {
    id: '3',
    slug: 'vintage-rose-leash',
    name: 'Vintage Rose Leather Leash',
    description: 'Elegant 6-foot leather leash with comfortable handle. Perfect for leisurely walks with your furry friend.',
    price: 34.99,
    category: 'collars-leashes',
    images: ['/images/products/collars/leash-1.jpg'],
    features: ['6-foot length', 'Padded handle', 'Solid brass swivel clip', 'Matching collar available'],
    stock: 30,
    bulkPricing: [
      { minQty: 2, discount: 10 },
    ],
    metadata: { createdAt: now, updatedAt: now }
  },
  {
    id: '4',
    slug: 'personalized-tag-collar',
    name: 'Personalized ID Collar',
    description: 'Custom engraved collar with your pup\'s name and your phone number. Safety first!',
    price: 24.99,
    category: 'collars-leashes',
    badge: 'new',
    images: ['/images/products/collars/id-collar-1.jpg'],
    features: ['Custom engraved brass tag', 'Comfort rolled leather', 'Free engraving included', 'Available in 8 colors'],
    stock: 45,
    metadata: { createdAt: now, updatedAt: now }
  },
  {
    id: '5',
    slug: 'hiking-adventure-collar',
    name: 'Hiking Adventure Collar',
    description: 'Rugged collar designed for outdoor adventures. Features a built-in bottle opener and reflective threading for safety.',
    price: 39.99,
    category: 'collars-leashes',
    images: ['/images/products/collars/hiking-collar-1.jpg'],
    features: ['Integrated bottle opener', 'Reflective threading', 'Water-resistant coating', 'D-ring for leash attachment'],
    stock: 25,
    bulkPricing: [
      { minQty: 2, discount: 15 },
    ],
    metadata: { createdAt: now, updatedAt: now }
  },

  // ==================== TREATS & CHEWS ====================
  {
    id: '6',
    slug: 'peanut-butter-biscuits',
    name: 'Peanut Butter Biscuits',
    description: 'Homemade-style peanut butter dog biscuits made with all-natural ingredients. No preservatives, just love!',
    price: 12.99,
    category: 'treats-chews',
    badge: 'bestseller',
    images: ['/images/products/treats/peanut-biscuits-1.jpg'],
    features: ['All-natural ingredients', 'No preservatives', 'Made in small batches', 'Vet approved'],
    stock: 100,
    bulkPricing: [
      { minQty: 3, discount: 10 },
      { minQty: 6, discount: 20 },
    ],
    metadata: { createdAt: now, updatedAt: now }
  },
  {
    id: '7',
    slug: 'sweet-potato-chews',
    name: 'Sweet Potato Chews',
    description: 'Healthy sweet potato chews that are naturally sweet and packed with vitamins. A great alternative to rawhide!',
    price: 14.99,
    category: 'treats-chews',
    images: ['/images/products/treats/sweet-potato-1.jpg'],
    features: ['100% sweet potato', 'No additives', 'Easy to digest', 'Long-lasting chew'],
    stock: 80,
    bulkPricing: [
      { minQty: 4, discount: 15 },
    ],
    metadata: { createdAt: now, updatedAt: now }
  },
  {
    id: '8',
    slug: 'birthday-cake-bites',
    name: 'Birthday Cake Bites',
    description: 'Celebrate your pup\'s special day with these carob-frosted birthday cake bites. Perfect for parties!',
    price: 16.99,
    category: 'treats-chews',
    badge: 'new',
    images: ['/images/products/treats/birthday-bites-1.jpg'],
    features: ['Carob frosting (dog-safe)', 'Sprinkle decorations', 'Comes in gift box', 'Party hat included'],
    stock: 40,
    metadata: { createdAt: now, updatedAt: now }
  },
  {
    id: '9',
    slug: 'training-reward-sticks',
    name: 'Training Reward Sticks',
    description: 'Soft, chewy training sticks that break easily into small pieces. Perfect for training sessions!',
    price: 11.99,
    category: 'treats-chews',
    images: ['/images/products/treats/training-sticks-1.jpg'],
    features: ['Soft texture', 'Easy to break', 'High-value reward', 'Low calorie'],
    stock: 90,
    bulkPricing: [
      { minQty: 5, discount: 20 },
    ],
    metadata: { createdAt: now, updatedAt: now }
  },
  {
    id: '10',
    slug: 'beef-jerky-chews',
    name: 'Premium Beef Jerky Chews',
    description: 'Single-ingredient beef jerky made from free-range beef. No fillers, just pure meaty goodness!',
    price: 22.99,
    category: 'treats-chews',
    badge: 'bestseller',
    images: ['/images/products/treats/beef-jerky-1.jpg'],
    features: ['100% beef', 'No additives', 'Grain-free', 'Long-lasting'],
    stock: 60,
    bulkPricing: [
      { minQty: 3, discount: 12 },
      { minQty: 6, discount: 25 },
    ],
    metadata: { createdAt: now, updatedAt: now }
  },

  // ==================== BEDS & BLANKETS ====================
  {
    id: '11',
    slug: 'cozy-cave-bed',
    name: 'Cozy Cave Bed',
    description: 'Luxurious cave-style bed that provides a sense of security. The ultimate sleeping spot for anxious dogs.',
    price: 59.99,
    category: 'beds-blankets',
    badge: 'bestseller',
    images: ['/images/products/beds/cave-bed-1.jpg'],
    features: ['Soft faux fur lining', 'Machine washable', 'Available in 3 sizes', 'Calming design'],
    stock: 35,
    bulkPricing: [
      { minQty: 2, discount: 10 },
    ],
    metadata: { createdAt: now, updatedAt: now }
  },
  {
    id: '12',
    slug: 'orthopedic-memory-foam',
    name: 'Orthopedic Memory Foam Bed',
    description: 'Supportive memory foam bed for older dogs or those with joint issues. Your pup will wake up refreshed!',
    price: 79.99,
    comparePrice: 99.99,
    category: 'beds-blankets',
    badge: 'sale',
    images: ['/images/products/beds/memory-foam-1.jpg'],
    features: ['4-inch memory foam', 'Waterproof liner', 'Removable cover', 'Non-slip bottom'],
    stock: 25,
    metadata: { createdAt: now, updatedAt: now }
  },
  {
    id: '13',
    slug: 'knitted-dog-blanket',
    name: 'Hand-Knitted Dog Blanket',
    description: 'Beautiful hand-knitted blanket perfect for couch cuddles. Made with love and premium yarn.',
    price: 34.99,
    category: 'beds-blankets',
    images: ['/images/products/beds/knitted-blanket-1.jpg'],
    features: ['Hand-knitted', 'Machine washable', 'Available in 6 colors', 'Personalization available'],
    stock: 20,
    metadata: { createdAt: now, updatedAt: now }
  },
  {
    id: '14',
    slug: 'travel-dog-bed',
    name: 'Portable Travel Bed',
    description: 'Compact and lightweight travel bed that rolls up easily. Perfect for camping, road trips, or visits to grandma!',
    price: 29.99,
    category: 'beds-blankets',
    badge: 'new',
    images: ['/images/products/beds/travel-bed-1.jpg'],
    features: ['Rolls up for storage', 'Water-resistant bottom', 'Built-in pillow', 'Carrying strap included'],
    stock: 45,
    bulkPricing: [
      { minQty: 2, discount: 15 },
    ],
    metadata: { createdAt: now, updatedAt: now }
  },
  {
    id: '15',
    slug: 'elevated-dog-bed',
    name: 'Elevated Cooling Dog Bed',
    description: 'Raised cot-style bed that keeps your pup cool off the ground. Perfect for hot summer days!',
    price: 44.99,
    category: 'beds-blankets',
    images: ['/images/products/beds/elevated-bed-1.jpg'],
    features: ['Breathable mesh fabric', 'Powder-coated steel frame', 'Easy assembly', 'Indoor/outdoor use'],
    stock: 40,
    metadata: { createdAt: now, updatedAt: now }
  },

  // ==================== TOYS & ACCESSORIES ====================
  {
    id: '16',
    slug: 'rope-tug-toy',
    name: 'Handmade Rope Tug Toy',
    description: 'Sturdy cotton rope toy perfect for interactive tug-of-war games. Great for dental health too!',
    price: 14.99,
    category: 'toys-accessories',
    badge: 'bestseller',
    images: ['/images/products/toys/rope-toy-1.jpg'],
    features: ['Natural cotton rope', 'Hand-tied knots', 'Machine washable', 'Available in 3 sizes'],
    stock: 85,
    bulkPricing: [
      { minQty: 3, discount: 20 },
    ],
    metadata: { createdAt: now, updatedAt: now }
  },
  {
    id: '17',
    slug: 'squeaky-plush-toy',
    name: 'Squeaky Plush Toy',
    description: 'Adorable plush toy with hidden squeakers. Multiple textures for added entertainment!',
    price: 12.99,
    category: 'toys-accessories',
    badge: 'new',
    images: ['/images/products/toys/plush-toy-1.jpg'],
    features: ['Multiple squeakers', 'Crinkle paper inside', 'Reinforced seams', 'No stuffing mess'],
    stock: 70,
    bulkPricing: [
      { minQty: 4, discount: 15 },
    ],
    metadata: { createdAt: now, updatedAt: now }
  },
  {
    id: '18',
    slug: 'puzzle-feeder-toy',
    name: 'Puzzle Feeder Toy',
    description: 'Mental stimulation puzzle toy that dispenses treats. Keeps your pup smart and entertained!',
    price: 18.99,
    category: 'toys-accessories',
    images: ['/images/products/toys/puzzle-toy-1.jpg'],
    features: ['Adjustable difficulty', 'Dishwasher safe', 'Non-slip base', 'Works with any treat'],
    stock: 50,
    metadata: { createdAt: now, updatedAt: now }
  },
  {
    id: '19',
    slug: 'bandana-accessory',
    name: 'Handmade Bandana',
    description: 'Stylish bandana that slips onto your dog\'s collar. Because every pup deserves to look dapper!',
    price: 8.99,
    category: 'toys-accessories',
    images: ['/images/products/toys/bandana-1.jpg'],
    features: ['Slip-on design', 'Reversible', 'Available in 20+ patterns', 'Machine washable'],
    stock: 150,
    bulkPricing: [
      { minQty: 5, discount: 25 },
    ],
    metadata: { createdAt: now, updatedAt: now }
  },
  {
    id: '20',
    slug: 'bow-tie-collar-accessory',
    name: 'Handmade Bow Tie',
    description: 'Dapper bow tie that attaches to any collar. Perfect for special occasions or everyday style!',
    price: 9.99,
    category: 'toys-accessories',
    badge: 'new',
    images: ['/images/products/toys/bowtie-1.jpg'],
    features: ['Elastic strap fits any collar', 'Hand-sewn', 'Available in 15 patterns', 'Gift packaging available'],
    stock: 120,
    bulkPricing: [
      { minQty: 4, discount: 20 },
    ],
    metadata: { createdAt: now, updatedAt: now }
  },
  {
    id: '21',
    slug: 'car-seat-cover',
    name: 'Quilted Car Seat Cover',
    description: 'Beautiful quilted seat cover protects your car from fur and dirt. Waterproof backing ensures complete protection.',
    price: 49.99,
    category: 'toys-accessories',
    images: ['/images/products/toys/seat-cover-1.jpg'],
    features: ['Waterproof backing', 'Quilted cotton top', 'Non-slip bottom', 'Machine washable'],
    stock: 30,
    bulkPricing: [
      { minQty: 2, discount: 10 },
    ],
    metadata: { createdAt: now, updatedAt: now }
  },
  {
    id: '22',
    slug: 'feeding-station',
    name: 'Elevated Feeding Station',
    description: 'Handmade elevated feeding station that promotes healthy digestion. Includes two ceramic bowls.',
    price: 54.99,
    category: 'toys-accessories',
    badge: 'new',
    images: ['/images/products/toys/feeding-station-1.jpg'],
    features: ['Handcrafted wood', 'Two ceramic bowls', 'Available in 3 heights', 'Food-safe finish'],
    stock: 25,
    metadata: { createdAt: now, updatedAt: now }
  },
]

// Helper functions to query products
export function getProductBySlug(slug: string): Product | undefined {
  return mockProducts.find(p => p.slug === slug)
}

export function getProductById(id: string): Product | undefined {
  return mockProducts.find(p => p.id === id)
}

export function getProductsByCategory(category: string): Product[] {
  return mockProducts.filter(p => p.category === category)
}

export function getFeaturedProducts(): Product[] {
  return mockProducts.filter(p => p.badge === 'bestseller')
}

export function getNewProducts(): Product[] {
  return mockProducts.filter(p => p.badge === 'new')
}

export function getSaleProducts(): Product[] {
  return mockProducts.filter(p => p.badge === 'sale' || p.comparePrice)
}

export function getRandomProducts(count: number): Product[] {
  const shuffled = [...mockProducts].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}