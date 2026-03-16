'use client'

import { useState } from 'react'
import { PawPrint, ChevronDown, Mail, Phone, Truck, Heart, Shield, Clock, RefreshCw } from 'lucide-react'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  icon: any
}

const faqData: FAQItem[] = [
  // Shipping & Delivery
  {
    id: 'shipping-1',
    question: 'How long does shipping take?',
    answer: 'Most orders ship within 1-2 business days and arrive in 3-5 business days. Expedited shipping is available at checkout for faster delivery.',
    category: 'shipping',
    icon: Truck,
  },
  {
    id: 'shipping-2',
    question: 'Do you offer free shipping?',
    answer: 'Yes! We offer free standard shipping on all orders over $50. For orders under $50, shipping is just $4.99.',
    category: 'shipping',
    icon: Truck,
  },
  {
    id: 'shipping-3',
    question: 'Do you ship internationally?',
    answer: 'Absolutely! We ship worldwide. International shipping rates are calculated at checkout based on your location. Delivery times vary by destination.',
    category: 'shipping',
    icon: Truck,
  },

  // Products & Quality
  {
    id: 'products-1',
    question: 'Are your products really handmade?',
    answer: 'Yes! Every single product is handcrafted with love in our Portland studio. We source premium materials and each item goes through quality control before shipping.',
    category: 'products',
    icon: Heart,
  },
  {
    id: 'products-2',
    question: 'What materials do you use?',
    answer: 'We use only the finest materials: vegetable-tanned leather, military-grade paracord, organic cotton, and eco-friendly fabrics. All materials are safe for your furry friends!',
    category: 'products',
    icon: Heart,
  },
  {
    id: 'products-3',
    question: 'Can I get a custom order?',
    answer: 'We love custom orders! Contact us with your ideas and we\'ll work together to create something special. Custom orders typically take 3-5 additional business days.',
    category: 'products',
    icon: Heart,
  },

  // Returns & Refunds
  {
    id: 'returns-1',
    question: 'What is your return policy?',
    answer: 'We offer a 30-day happiness guarantee. If your pup isn\'t thrilled with their new gear, return it unused for a full refund. No questions asked!',
    category: 'returns',
    icon: RefreshCw,
  },
  {
    id: 'returns-2',
    question: 'What if the product doesn\'t fit?',
    answer: 'No worries! We offer free exchanges for size issues. Just contact us within 30 days and we\'ll send you the right size, plus a prepaid return label.',
    category: 'returns',
    icon: RefreshCw,
  },
  {
    id: 'returns-3',
    question: 'My dog damaged the product. Can I get a replacement?',
    answer: 'While our products are durable, we understand that some dogs are extra enthusiastic! We offer replacement parts at a discounted price. Contact us with photos of the damage.',
    category: 'returns',
    icon: RefreshCw,
  },

  // Orders & Account
  {
    id: 'orders-1',
    question: 'How can I track my order?',
    answer: 'Once your order ships, you\'ll receive an email with tracking information. You can also track your order in your account dashboard or contact us anytime!',
    category: 'orders',
    icon: Package,
  },
  {
    id: 'orders-2',
    question: 'Can I modify or cancel my order?',
    answer: 'Orders can be modified or cancelled within 2 hours of placing them. After that, our crafters have already started working on your order! Contact us ASAP if you need changes.',
    category: 'orders',
    icon: Clock,
  },
  {
    id: 'orders-3',
    question: 'Do you offer bulk discounts?',
    answer: 'Yes! Many of our products have bulk pricing - the more you buy, the more you save. Discounts are automatically applied at checkout. Check individual product pages for details.',
    category: 'orders',
    icon: Shield,
  },

  // Product Care
  {
    id: 'care-1',
    question: 'How do I clean leather products?',
    answer: 'Wipe leather collars with a damp cloth and mild soap if needed. Condition with leather conditioner every few months to keep it soft and prevent cracking.',
    category: 'care',
    icon: Sparkles,
  },
  {
    id: 'care-2',
    question: 'Are the beds and blankets machine washable?',
    answer: 'Yes! All our beds and blankets are machine washable. Use cold water, gentle cycle, and tumble dry on low. Remove the foam insert from beds before washing.',
    category: 'care',
    icon: Sparkles,
  },
  {
    id: 'care-3',
    question: 'How do I clean the rope toys?',
    answer: 'Rope toys can be hand-washed with mild soap and warm water. Air dry completely. For deep cleaning, you can also soak in a vinegar solution and let dry in the sun.',
    category: 'care',
    icon: Sparkles,
  },
]

const categories = [
  { id: 'all', name: 'All Questions', icon: PawPrint },
  { id: 'shipping', name: 'Shipping', icon: Truck },
  { id: 'products', name: 'Products', icon: Heart },
  { id: 'returns', name: 'Returns', icon: RefreshCw },
  { id: 'orders', name: 'Orders', icon: Shield },
  { id: 'care', name: 'Product Care', icon: Sparkles },
]

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10"></div>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-1/4 w-48 h-48 text-primary transform -rotate-12">
            <PawPrint strokeWidth={1} fill="currentColor" />
          </div>
          <div className="absolute bottom-20 right-1/4 w-32 h-32 text-secondary transform rotate-12">
            <PawPrint strokeWidth={1} fill="currentColor" />
          </div>
        </div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full mb-6">
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Help & Support</span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">
              Frequently Asked <span className="text-primary">Questions</span>
            </h1>
            <p className="font-body text-xl text-foreground/70 max-w-2xl mx-auto">
              Everything you need to know about our handmade products. Can't find what you're looking for? Just ask!
            </p>

            {/* Search Bar */}
            <div className="mt-12 max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/40" />
                <input
                  type="text"
                  placeholder="Search for answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-muted focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-white shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-muted/20 sticky top-16 z-10 backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                      : 'bg-white text-foreground hover:bg-muted border border-border'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{category.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="font-display text-2xl font-bold mb-2">No results found</h3>
                <p className="text-foreground/60">Try adjusting your search or selecting a different category.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFAQs.map((faq, index) => {
                  const Icon = faq.icon
                  const isOpen = openItems.has(faq.id)

                  return (
                    <div
                      key={faq.id}
                      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-border overflow-hidden"
                      style={{ animation: `fadeSlideUp 0.4s ease-out ${index * 0.05}s both` }}
                    >
                      <button
                        onClick={() => toggleItem(faq.id)}
                        className="w-full flex items-start gap-4 p-6 text-left hover:bg-muted/30 transition-colors"
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                          isOpen ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                        }`}>
                          <Icon className="w-6 h-6" strokeWidth={2} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-display text-xl font-bold text-foreground mb-1">
                            {faq.question}
                          </h3>
                          <p className={`font-body text-foreground/70 overflow-hidden transition-all duration-300 ${
                            isOpen ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'
                          }`}>
                            {faq.answer}
                          </p>
                        </div>
                        <div className={`flex-shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}>
                          <ChevronDown className="w-6 h-6 text-foreground/40" />
                        </div>
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-8 md:p-12 border-2 border-primary/20">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Still have questions?
              </h2>
              <p className="font-body text-lg text-foreground/70 mb-8 max-w-xl mx-auto">
                We\'re here to help! Reach out to our friendly team and we\'ll get back to you within 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition-opacity shadow-lg"
                >
                  <Mail className="w-5 h-5" />
                  Contact Us
                </a>
                <a
                  href="tel:+15551234567"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-foreground rounded-full font-semibold border-2 border-border hover:border-primary transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  (555) 123-4567
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-3xl font-bold text-center mb-12">
              Quick <span className="text-primary">Links</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'Shipping Info', desc: 'Delivery times & policies', href: '/shipping' },
                { title: 'Returns', desc: '30-day happiness guarantee', href: '/returns' },
                { title: 'Size Guide', desc: 'Find the perfect fit', href: '/size-guide' },
              ].map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all border border-border hover:border-primary"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <ArrowRight className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-bold mb-2">{link.title}</h3>
                  <p className="text-sm text-foreground/60">{link.desc}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  )
}

// Import additional icons
import { Search, HelpCircle, Package, Sparkles, ArrowRight } from 'lucide-react'
