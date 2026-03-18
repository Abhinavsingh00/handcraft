import Link from 'next/link'
import { RefreshCw, Smile, Heart, Clock, CheckCircle, AlertCircle } from 'lucide-react'

export default function ReturnsPage() {
  const steps = [
    {
      number: '01',
      title: 'Initiate Return',
      description: 'Contact us within 30 days of purchase with your order number and reason for return.',
    },
    {
      number: '02',
      title: 'Receive Approval',
      description: 'We\'ll review your request and send return instructions within 24 hours.',
    },
    {
      number: '03',
      title: 'Ship Item Back',
      description: 'Pack the item securely in original packaging if possible, and attach the provided shipping label.',
    },
    {
      number: '04',
      title: 'Receive Refund',
      description: 'Once we receive and inspect the item, we\'ll process your refund within 5-7 business days.',
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Hero background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/returns/returns-hero.svg"
            alt="Happy dog with returns"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background"></div>
        </div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 backdrop-blur-sm text-secondary rounded-full mb-6 animate-fade-in">
              <Heart className="w-4 h-4" />
              <span className="text-sm font-medium">Happiness Guarantee</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 animate-slide-up">
              Return <span className="text-secondary">Policy</span>
            </h1>
            <p className="font-body text-lg text-foreground/80 animate-fade-in">
              30-day happiness guarantee on all handmade products. Your pup's satisfaction is our priority!
            </p>
          </div>
        </div>

        {/* Wave divider */}
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" className="fill-muted/30"/>
        </svg>
      </section>

      {/* Happiness Guarantee Banner */}
      <section className="py-12 bg-gradient-to-r from-primary via-primary to-secondary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <Smile className="w-10 h-10" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Our 30-Day Happiness Guarantee
            </h2>
            <p className="text-xl text-white/90">
              We want your pup to absolutely love their new gear. If not, we'll make it right!
            </p>
          </div>
        </div>
      </section>

      {/* Return Process Timeline */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                How To <span className="text-secondary">Return</span> an Item
              </h2>
              <p className="text-foreground/70">Simple 4-step return process</p>
            </div>

            <div className="max-w-3xl mx-auto">
              {steps.map((step, index) => (
                <div key={index} className="relative flex gap-6 mb-8 last:mb-0">
                  {/* Connector line */}
                  {index < 3 && (
                    <div className="absolute left-[27px] top-16 w-0.5 h-full bg-border"></div>
                  )}

                  {/* Step number */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center shadow-lg">
                      <span className="font-display text-lg font-bold text-white">{step.number}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-border">
                    <h3 className="font-display text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-foreground/70">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Return Conditions */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Return <span className="text-secondary">Conditions</span>
              </h2>
              <p className="text-foreground/70">When is a return eligible?</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Eligible */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-green-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-500" strokeWidth={2} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-green-700">Eligible for Return</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    'Returned within 30 days of purchase',
                    'Item is unused and in original packaging',
                    'All tags are still attached',
                    'Proof of purchase provided (receipt or order number)',
                    'Custom orders with manufacturing defects',
                    'Wrong item shipped (our mistake)',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Not Eligible */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-red-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-500" strokeWidth={2} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-red-700">Not Eligible for Return</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    'Return initiated after 30-day period',
                    'Item shows signs of wear, damage, or use',
                    'Original packaging is missing or damaged',
                    'Custom orders without defects (unless defective)',
                    'Sale items (final sale)',
                    'Personalized items with no defects',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Refund Information */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-secondary/10 to-primary/10 rounded-2xl p-8 md:p-12 border-2 border-secondary/20">
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-6 text-center">
                Refund Information
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-secondary" />
                    Refund Timeline
                  </h3>
                  <p className="text-foreground/70 text-sm mb-4">
                    Once we receive and approve your return:
                  </p>
                  <ul className="space-y-2 text-sm text-foreground/70">
                    <li>• Refunds processed within 5-7 business days</li>
                    <li>• Credit to original payment method</li>
                    <li>• Email confirmation when refund is issued</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-secondary" />
                    Exchanges
                  </h3>
                  <p className="text-foreground/70 text-sm mb-4">
                    Need a different size or color? We offer free exchanges!
                  </p>
                  <ul className="space-y-2 text-sm text-foreground/70">
                    <li>• Contact us before sending the item back</li>
                    <li>• We'll send the replacement right away</li>
                    <li>• Prepaid return shipping label included</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 p-6 bg-white/50 rounded-xl">
                <h3 className="font-bold text-lg mb-2">Custom Orders</h3>
                <p className="text-foreground/70 text-sm">
                  Custom-made items (engraved collars, special sizes, etc.) can only be returned if there's a manufacturing defect. If you're unsure about sizing or customization, please contact us before placing your order!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Damaged or Wrong Items */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-border">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-red-500" strokeWidth={2} />
                </div>
                <div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
                    Damaged or Wrong Items?
                  </h2>
                  <p className="text-foreground/70">Don't worry! We'll fix it right away.</p>
                </div>
              </div>

              <div className="space-y-4 text-foreground/70">
                <p><strong>If you received a damaged or incorrect item:</strong></p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Contact us immediately with your order number and a photo of the issue</li>
                  <li>We'll send a replacement at no additional cost to you</li>
                  <li>You don't need to return the damaged item (unless requested)</li>
                  <li>We'll file a claim with the shipping carrier so you don't have to</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-gradient-to-br from-secondary/10 to-primary/10 rounded-2xl p-8 md:p-12 border-2 border-secondary/20">
              <RefreshCw className="w-16 h-16 mx-auto mb-4 text-secondary" strokeWidth={2} />
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
                Ready to Start a Return?
              </h2>
              <p className="text-foreground/70 mb-6">
                We're here to help make the process as smooth as possible for you and your pup.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground rounded-full font-semibold hover:opacity-90 transition-opacity shadow-lg"
              >
                Contact Us to Start Return
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="font-display text-xl font-bold mb-8">
              Related Pages:
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/shipping"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full font-medium shadow-sm hover:shadow-md transition-shadow border border-border"
              >
                Shipping Policy
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
