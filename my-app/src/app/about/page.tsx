'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Heart, Award, Leaf, Truck, PawPrint } from 'lucide-react'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section - Editorial Layout with Image */}
      <section className="relative overflow-hidden">
        {/* Hero background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/about/hero-dogs.jpg"
            alt="Happy dogs"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background"></div>
        </div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 backdrop-blur-sm text-secondary rounded-full mb-6 animate-fade-in">
              <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
              <span className="text-sm font-medium">Our Story</span>
            </div>

            {/* Main headline - staggered animation */}
            <h1 className="font-display text-6xl md:text-8xl font-bold leading-none mb-6">
              <span className="block animate-slide-up" style={{ animationDelay: '0.1s' }}>Crafted with</span>
              <span className="block text-primary animate-slide-up" style={{ animationDelay: '0.2s' }}>love, for</span>
              <span className="block animate-slide-up" style={{ animationDelay: '0.3s' }}>your best friend</span>
            </h1>

            <p className="font-body text-xl md:text-2xl text-foreground/80 max-w-2xl animate-fade-in" style={{ animationDelay: '0.4s' }}>
              Every stitch, every cut, every detail matters when it comes to your furry family member.
            </p>
          </div>
        </div>

        {/* Wave divider */}
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" className="fill-muted/30"/>
        </svg>
      </section>

      {/* Origin Story - Asymmetrical Layout */}
      <section className="py-20 bg-muted/20 relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            {/* Image column - offset */}
            <div className="md:col-span-5 md:col-start-2 relative">
              <div className="relative">
                {/* Main image container with decorative border */}
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <img
                    src="/images/about/handmade-craft.jpg"
                    alt="Handmade dog products"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-4 -right-4 bg-background rounded-2xl p-4 shadow-lg border-4 border-white transform -rotate-3">
                  <p className="font-display text-3xl font-bold text-primary">2019</p>
                  <p className="text-sm text-foreground/60">Founded</p>
                </div>
              </div>
            </div>

            {/* Content column */}
            <div className="md:col-span-5 space-y-6">
              <h2 className="font-display text-4xl md:text-5xl font-bold">
                One dog, <span className="text-primary">big dreams</span>
              </h2>
              <div className="space-y-4 text-foreground/70 text-lg">
                <p>
                  It started with <strong>Barnaby</strong>, a rescue with sensitive skin who couldn't wear store-bought collars. His owner, handcrafting accessories in her tiny apartment, created something special.
                </p>
                <p>
                  Friends noticed. Then friends of friends. Soon, a kitchen table hobby became a mission: <em>every dog deserves products made with real care</em>.
                </p>
              </div>

              {/* Quick facts */}
              <div className="grid grid-cols-3 gap-4 pt-6">
                <div className="text-center p-4 bg-background rounded-xl">
                  <p className="font-display text-3xl font-bold text-primary">5K+</p>
                  <p className="text-sm text-foreground/60">Happy Dogs</p>
                </div>
                <div className="text-center p-4 bg-background rounded-xl">
                  <p className="font-display text-3xl font-bold text-primary">100%</p>
                  <p className="text-sm text-foreground/60">Handmade</p>
                </div>
                <div className="text-center p-4 bg-background rounded-xl">
                  <p className="font-display text-3xl font-bold text-primary">50+</p>
                  <p className="text-sm text-foreground/60">Products</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid - Organic Shapes */}
      <section className="py-20 relative overflow-hidden">
        {/* Background decorative shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              What makes us <span className="text-primary">different</span>
            </h2>
            <p className="text-foreground/70 text-lg">
              We're not just another pet store. We're crafters who care deeply about every tail wag.
            </p>
          </div>

          {/* Values grid with staggered cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Heart,
                title: 'Made with Love',
                description: 'Every product is handcrafted with attention to detail that machines can\'t replicate.',
                delay: '0.1s',
                bg: 'from-pink-50 to-rose-50',
                border: 'border-pink-200',
                iconColor: 'text-pink-500',
              },
              {
                icon: Award,
                title: 'Premium Materials',
                description: 'We source only the finest materials that are safe, durable, and comfortable.',
                delay: '0.2s',
                bg: 'from-amber-50 to-yellow-50',
                border: 'border-amber-200',
                iconColor: 'text-amber-500',
              },
              {
                icon: Leaf,
                title: 'Eco-Friendly',
                description: 'Sustainable packaging and responsibly sourced materials whenever possible.',
                delay: '0.3s',
                bg: 'from-green-50 to-emerald-50',
                border: 'border-green-200',
                iconColor: 'text-green-500',
              },
              {
                icon: Truck,
                title: 'Fast Shipping',
                description: 'Quick processing and reliable delivery because excited pups shouldn\'t wait.',
                delay: '0.4s',
                bg: 'from-blue-50 to-cyan-50',
                border: 'border-blue-200',
                iconColor: 'text-blue-500',
              },
            ].map((value, index) => (
              <div
                key={index}
                className={`group relative bg-gradient-to-br ${value.bg} rounded-3xl p-6 border-2 ${value.border} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                style={{ animation: `fadeSlideUp 0.6s ease-out ${value.delay} both` }}
              >
                {/* Decorative paw print overlay */}
                <div className="absolute top-4 right-4 w-12 h-12 opacity-10 group-hover:opacity-20 transition-opacity">
                  <PawPrint fill="currentColor" className={value.iconColor} />
                </div>

                <div className={`w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <value.icon className={`w-7 h-7 ${value.iconColor}`} strokeWidth={2} />
                </div>
                <h3 className="font-display text-2xl font-bold mb-2 text-foreground">
                  {value.title}
                </h3>
                <p className="font-body text-foreground/70">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section - Timeline Style */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              How we <span className="text-primary">craft</span>
            </h2>
            <p className="text-foreground/70 text-lg">
              From sketch to snout, every product goes through our careful process.
            </p>
          </div>

          {/* Process timeline */}
          <div className="max-w-4xl mx-auto">
            {[
              {
                step: '01',
                title: 'Design',
                description: 'We sketch and prototype, always thinking about comfort, safety, and style.',
                color: 'bg-pink-500',
              },
              {
                step: '02',
                title: 'Source',
                description: 'Only the best materials make the cut. If it\'s not good enough for our dogs, it\'s not good enough.',
                color: 'bg-amber-500',
              },
              {
                step: '03',
                title: 'Craft',
                description: 'Each piece is cut, stitched, and finished by hand with careful attention to detail.',
                color: 'bg-green-500',
              },
              {
                step: '04',
                title: 'Test',
                description: 'Our furry testers put everything through its paces before it reaches you.',
                color: 'bg-blue-500',
              },
            ].map((item, index) => (
              <div key={index} className="relative flex gap-6 mb-8 last:mb-0 group">
                {/* Connector line */}
                {index < 3 && (
                  <div className="absolute left-[27px] top-16 w-0.5 h-full bg-border group-last:hidden"></div>
                )}

                {/* Step number */}
                <div className="relative z-10 flex-shrink-0">
                  <div className={`w-14 h-14 ${item.color} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <span className="font-display text-xl font-bold text-white">{item.step}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-background rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-display text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-foreground/70">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section - Polaroid Style */}
      <section className="py-20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-4 h-4 rounded-full bg-primary"></div>
          <div className="absolute top-20 right-1/4 w-3 h-3 rounded-full bg-secondary"></div>
          <div className="absolute bottom-1/4 right-20 w-5 h-5 rounded-full bg-primary"></div>
          <div className="absolute bottom-20 left-1/3 w-2 h-2 rounded-full bg-secondary"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Meet the <span className="text-primary">pack</span>
            </h2>
            <p className="text-foreground/70 text-lg">
              A small team with a big love for dogs.
            </p>
          </div>

          {/* Team grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Jessica Chen',
                role: 'Founder & Head Crafter',
                quote: 'Every product has a story, and it usually starts with "What if...?"',
                rotate: 'rotate-2',
                dog: 'Barnaby • Golden Retriever',
                image: '/images/team/founder.jpg',
              },
              {
                name: 'Marcus Williams',
                role: 'Master Artisan',
                quote: 'The details make the difference. Always.',
                rotate: '-rotate-1',
                dog: 'Luna • Husky Mix',
                image: '/images/team/artisan.jpg',
              },
              {
                name: 'Sarah Martinez',
                role: 'Customer Happiness',
                quote: 'Your pup\'s wag is our favorite metric.',
                rotate: 'rotate-1',
                dog: 'Max • French Bulldog',
                image: '/images/team/customer-service.jpg',
              },
            ].map((member, index) => (
              <div
                key={index}
                className={`relative group ${member.rotate} hover:rotate-0 transition-transform duration-300`}
              >
                {/* Polaroid card */}
                <div className="bg-white rounded-lg shadow-lg p-4 pb-8 transition-shadow duration-300 group-hover:shadow-xl">
                  {/* Photo area */}
                  <div className="aspect-square rounded-md mb-4 overflow-hidden bg-muted">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Info */}
                  <div className="text-center px-2">
                    <h3 className="font-display text-2xl font-bold text-foreground">
                      {member.name}
                    </h3>
                    <p className="text-sm text-primary font-medium mb-3">{member.role}</p>
                    <p className="text-sm text-foreground/60 italic mb-3">
                      "{member.quote}"
                    </p>
                    <div className="flex items-center justify-center gap-2 text-xs text-foreground/50">
                      <PawPrint className="w-3 h-3" />
                      <span>{member.dog}</span>
                    </div>
                  </div>
                </div>

                {/* Tape decoration - hidden */}
                {/* <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-24 h-8 bg-background/60 backdrop-blur-sm rotate-2 shadow-sm"></div> */}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary to-secondary relative overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-3xl mx-auto">
            <PawPrint className="w-16 h-16 mx-auto mb-6 text-white/20" fill="currentColor" />
            <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to treat your pup?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of happy dogs and their humans. Every purchase supports our mission to craft with care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 rounded-full shadow-xl"
              >
                <Link href="/shop">Shop Now</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 rounded-full"
              >
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

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
          opacity: 0;
        }

        .animate-fade-slide-up {
          animation: fadeSlideUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </main>
  )
}
