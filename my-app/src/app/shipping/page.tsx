import Link from 'next/link'
import { Truck, Package, Clock, Globe, Shield, CheckCircle } from 'lucide-react'

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Hero background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/shipping/shipping-hero.svg"
            alt="Shipping and delivery"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background"></div>
        </div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-sm text-primary rounded-full mb-6 animate-fade-in">
              <Truck className="w-4 h-4" />
              <span className="text-sm font-medium">Delivery Information</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 animate-slide-up">
              Shipping <span className="text-primary">Policy</span>
            </h1>
            <p className="font-body text-lg text-foreground/80 animate-fade-in">
              Everything you need to know about getting your handmade goodies to your door.
            </p>
          </div>
        </div>

        {/* Wave divider */}
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" className="fill-muted/30"/>
        </svg>
      </section>

      {/* Shipping Options */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Shipping <span className="text-primary">Options</span>
              </h2>
              <p className="text-foreground/70">Fast, reliable delivery for your furry friends</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: 'Standard Shipping',
                  icon: Truck,
                  price: '$4.99',
                  free: 'Free on orders $50+',
                  timeframe: '3-5 business days',
                  features: ['Tracking included', 'Insurance included', 'US addresses only'],
                  color: 'from-blue-50 to-cyan-50',
                  border: 'border-blue-200',
                  badge: 'Most Popular',
                },
                {
                  name: 'Expedited Shipping',
                  icon: Clock,
                  price: '$9.99',
                  free: null,
                  timeframe: '2-3 business days',
                  features: ['Priority processing', 'Tracking included', 'Insurance included'],
                  color: 'from-orange-50 to-amber-50',
                  border: 'border-orange-200',
                  badge: null,
                },
                {
                  name: 'International Shipping',
                  icon: Globe,
                  price: 'Calculated at checkout',
                  free: null,
                  timeframe: '7-14 business days',
                  features: ['Worldwide delivery', 'Customs handling included', 'Tracking included'],
                  color: 'from-purple-50 to-pink-50',
                  border: 'border-purple-200',
                  badge: null,
                },
              ].map((option, index) => {
                const Icon = option.icon
                return (
                  <div
                    key={index}
                    className={`relative bg-gradient-to-br ${option.color} rounded-2xl p-6 border-2 ${option.border} hover:shadow-lg transition-shadow`}
                  >
                    {option.badge && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                        {option.badge}
                      </div>
                    )}
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                        <Icon className="w-8 h-8 text-primary" strokeWidth={2} />
                      </div>
                    </div>
                    <h3 className="font-display text-2xl font-bold text-center mb-2">{option.name}</h3>
                    <p className="text-3xl font-bold text-center text-primary mb-2">{option.price}</p>
                    {option.free && (
                      <p className="text-sm text-center text-foreground/60 mb-4">{option.free}</p>
                    )}
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 rounded-full">
                        <Clock className="w-4 h-4 text-foreground" />
                        <span className="text-sm font-medium">{option.timeframe}</span>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {option.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Processing Times */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Order <span className="text-primary">Processing</span>
              </h2>
              <p className="text-foreground/70">How long before your order ships?</p>
            </div>

            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-border">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="font-display text-2xl font-bold text-primary">1-2</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Business Days</h3>
                  <p className="text-sm text-foreground/70">Most orders ship within 1-2 business days</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-secondary/10 rounded-full flex items-center justify-center">
                    <span className="font-display text-2xl font-bold text-secondary">3-5</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Custom Orders</h3>
                  <p className="text-sm text-foreground/70">Personalized items may take 3-5 additional days</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-50 rounded-full flex items-center justify-center">
                    <span className="font-display text-2xl font-bold text-green-600">Mon-Fri</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Processing Days</h3>
                  <p className="text-sm text-foreground/70">Orders ship Monday-Friday, excluding holidays</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* International Shipping */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 md:p-12 border-2 border-purple-200">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Globe className="w-6 h-6 text-purple-600" strokeWidth={2} />
                </div>
                <div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
                    International Shipping
                  </h2>
                  <p className="text-foreground/70">We ship worldwide! 🌍</p>
                </div>
              </div>

              <div className="space-y-4 text-foreground/70">
                <div>
                  <h4 className="font-bold mb-2">Shipping Rates:</h4>
                  <p className="text-sm">Calculated at checkout based on destination and package weight</p>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Delivery Times:</h4>
                  <p className="text-sm">Typically 7-14 business days, depending on destination</p>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Customs & Duties:</h4>
                  <p className="text-sm">International orders may be subject to customs fees and import duties. These are the responsibility of the recipient and are not included in the shipping price. Please check your local customs regulations before ordering.</p>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Restricted Items:</h4>
                  <p className="text-sm">Some countries have restrictions on importing pet products. Please verify local regulations before ordering.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Package Protection */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 md:p-12 border-2 border-green-200">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Shield className="w-6 h-6 text-green-600" strokeWidth={2} />
                </div>
                <div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
                    Package Protection
                  </h2>
                  <p className="text-foreground/70">Your order is safe with us</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm">Insurance Included</h4>
                      <p className="text-sm text-foreground/70">All shipments include insurance against loss or damage</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm">Tracking Numbers</h4>
                      <p className="text-sm text-foreground/70">Every order includes tracking for peace of mind</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm">Secure Packaging</h4>
                      <p className="text-sm text-foreground/70">Eco-friendly packaging that protects your products</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm">Signature Required</h4>
                      <p className="text-sm text-foreground/70">Orders over $100 require signature upon delivery</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm">Lost Package Support</h4>
                      <p className="text-sm text-foreground/70">We'll help locate or replace lost packages</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm">Damage Claims</h4>
                      <p className="text-sm text-foreground/70">Quick resolution for any shipping damage</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* APO/FPO */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-border">
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-6 text-center">
                APO/FPO & Military Addresses
              </h2>
              <div className="text-center max-w-2xl mx-auto">
                <p className="text-foreground/70 mb-6">
                  We proudly ship to APO/FPO and military addresses worldwide! Standard shipping rates and delivery times apply to these addresses.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">We support our troops! 🇺🇸</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Questions */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 border-2 border-primary/20">
              <Truck className="w-12 h-12 mx-auto mb-4 text-primary" strokeWidth={2} />
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
                Questions About Shipping?
              </h2>
              <p className="text-foreground/70 mb-6">
                Our team is happy to help with any shipping questions or concerns.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition-opacity shadow-lg"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="font-display text-xl font-bold mb-8">
              Also check out:
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/returns"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full font-medium shadow-sm hover:shadow-md transition-shadow border border-border"
              >
                Return Policy
              </Link>
              <Link
                href="/faq"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full font-medium shadow-sm hover:shadow-md transition-shadow border border-border"
              >
                FAQ
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full font-medium shadow-sm hover:shadow-md transition-shadow border border-border"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
      `}</style>
    </main>
  )
}
