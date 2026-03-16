'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Mail, MapPin, Phone, Send, PawPrint, Clock, Heart } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    alert('Thanks for reaching out! We\'ll get back to you soon. 🐾')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section with Image */}
      <section className="relative overflow-hidden">
        {/* Hero background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/contact/contact-hero.jpg"
            alt="Happy dogs contact"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background"></div>
        </div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-sm text-primary rounded-full mb-6 animate-fade-in">
              <Mail className="w-4 h-4" />
              <span className="text-sm font-medium">Get in Touch</span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
              Let's <span className="text-primary">chat</span> about pups!
            </h1>
            <p className="font-body text-xl text-foreground/90 max-w-2xl mx-auto animate-fade-in">
              Questions about our products? Want a custom order? Or just want to share adorable dog photos? We'd love to hear from you!
            </p>
          </div>
        </div>
      </section>

      {/* Main Content - Split Layout */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
            {/* Contact Info Card */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 space-y-6">
                {/* Main info card */}
                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-8 border-2 border-primary/20">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl font-bold">Contact Info</h3>
                      <p className="text-sm text-foreground/60">We'd love to hear from you</p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {/* Email */}
                    <div className="flex items-start gap-4 group">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-foreground/60">Email us at</p>
                        <a href="mailto:hello@pawfectlyhandmade.com" className="font-medium text-foreground hover:text-primary transition-colors">
                          hello@pawfectlyhandmade.com
                        </a>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-4 group">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-foreground/60">Call us at</p>
                        <a href="tel:+15551234567" className="font-medium text-foreground hover:text-primary transition-colors">
                          (555) 123-4567
                        </a>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-4 group">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-foreground/60">Based in</p>
                        <p className="font-medium text-foreground">Portland, Oregon</p>
                        <p className="text-sm text-foreground/60">We ship worldwide! 🌍</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business hours card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-muted">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-5 h-5 text-primary" />
                    <h4 className="font-display text-xl font-bold">Business Hours</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Monday - Friday</span>
                      <span className="font-medium">9am - 5pm PST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Saturday</span>
                      <span className="font-medium">10am - 2pm PST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Sunday</span>
                      <span className="font-medium">Closed (dog park day! 🐕)</span>
                    </div>
                  </div>
                </div>

                {/* Social card */}
                <div className="bg-gradient-to-r from-pink-50 to-orange-50 rounded-2xl p-6 border-2 border-pink-100">
                  <p className="font-display text-lg font-bold mb-3">Follow Our Adventures</p>
                  <p className="text-sm text-foreground/70 mb-4">
                    See behind-the-scenes, meet our team dogs, and get first access to new products!
                  </p>
                  <div className="flex gap-3">
                    {['Instagram', 'Facebook', 'TikTok'].map((social) => (
                      <button
                        key={social}
                        className="flex-1 py-2 px-3 bg-white rounded-xl text-sm font-medium hover:shadow-md transition-shadow border border-border hover:border-primary"
                      >
                        {social}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg border-2 border-muted relative overflow-hidden">
                {/* Decorative paw print */}
                <div className="absolute -top-4 -right-4 w-32 h-32 text-primary/5 transform rotate-12">
                  <PawPrint strokeWidth={1} fill="currentColor" />
                </div>

                <div className="relative">
                  <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">Drop us a line</h2>
                  <p className="text-foreground/60 mb-8">We usually respond within 24 hours</p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name & Email row */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Your Name <span className="text-primary">*</span>
                        </label>
                        <input
                          id="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border-2 border-muted focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                          placeholder="Jane Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email Address <span className="text-primary">*</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border-2 border-muted focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                          placeholder="jane@example.com"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        What's this about? <span className="text-primary">*</span>
                      </label>
                      <select
                        id="subject"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-muted focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-white"
                      >
                        <option value="">Select a topic...</option>
                        <option value="order">Question about an order</option>
                        <option value="product">Product inquiry</option>
                        <option value="custom">Custom order request</option>
                        <option value="wholesale">Wholesale inquiry</option>
                        <option value="feedback">Feedback or suggestion</option>
                        <option value="other">Just want to chat!</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Your Message <span className="text-primary">*</span>
                      </label>
                      <textarea
                        id="message"
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={6}
                        className="w-full px-4 py-3 rounded-xl border-2 border-muted focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none"
                        placeholder="Tell us what's on your mind... Don't forget to tell us about your pup! 🐕"
                      />
                      <p className="text-xs text-foreground/50">P.S. We LOVE seeing photos of your dogs!</p>
                    </div>

                    {/* Submit button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      size="lg"
                      className="w-full bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="w-5 h-5" />
                          Send Message
                        </span>
                      )}
                    </Button>

                    <p className="text-center text-xs text-foreground/50">
                      By submitting this form, you agree to our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Quick <span className="text-primary">Answers</span>
            </h2>
            <p className="text-foreground/70">
              Common questions we get asked. Check these out before reaching out!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                q: "How long does shipping take?",
                a: "Most orders ship within 1-2 business days and arrive in 3-5 days.",
                emoji: "📦",
              },
              {
                q: "Do you do custom orders?",
                a: "Absolutely! Contact us with your ideas and we'll make it happen.",
                emoji: "✨",
              },
              {
                q: "What if my dog doesn't like it?",
                a: "We offer happiness guarantees. If your pup isn't thrilled, we'll make it right.",
                emoji: "🐕",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border-2 border-muted hover:border-primary/30"
              >
                <div className="text-3xl mb-3">{faq.emoji}</div>
                <h3 className="font-display text-lg font-bold mb-2">{faq.q}</h3>
                <p className="text-sm text-foreground/70">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <a href="/faq">View All FAQs →</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Map/Image Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-video">
              {/* Portland image */}
              <img
                src="/images/contact/portland.jpg"
                alt="Portland, Oregon - Our Home"
                className="w-full h-full object-cover"
              />

              {/* Overlay content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <MapPin className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="font-display text-3xl md:text-4xl font-bold">Pawfectly Handmade HQ</p>
                    <p className="text-white/80 text-lg">Portland, Oregon</p>
                  </div>
                </div>
                <p className="text-white/70">Where the magic happens ✨</p>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-8 left-8 w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm"></div>
              <div className="absolute bottom-8 right-8 w-12 h-12 bg-white/20 rounded-full backdrop-blur-sm"></div>
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
