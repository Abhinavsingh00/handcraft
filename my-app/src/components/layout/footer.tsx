// Footer component for Pawfectly Handmade
'use client'

import Link from 'next/link'
import { PawPrint, Facebook, Instagram, Twitter, Mail } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { href: '/shop', label: 'Shop' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/faq', label: 'FAQ' },
  ]

  const customerService = [
    { href: '/shipping', label: 'Shipping' },
    { href: '/returns', label: 'Returns' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
  ]

  const socialLinks = [
    { href: '#', icon: Facebook, label: 'Facebook' },
    { href: '#', icon: Instagram, label: 'Instagram' },
    { href: '#', icon: Twitter, label: 'Twitter' },
  ]

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <PawPrint className="w-6 h-6" />
              <span className="font-display text-2xl font-bold">Pawfectly Handmade</span>
            </div>
            <p className="font-body text-sm opacity-90 mb-4">
              Handmade with love for your furry friends. Every item is crafted with care using premium materials.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm opacity-90 hover:opacity-100 transition-opacity"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-display text-xl font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              {customerService.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm opacity-90 hover:opacity-100 transition-opacity"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-display text-xl font-semibold mb-4">Join Our Pack</h3>
            <p className="font-body text-sm opacity-90 mb-4">
              Get updates on new products, exclusive offers, and dog care tips!
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 rounded-md bg-background text-foreground text-sm placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Email address"
                suppressHydrationWarning
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm opacity-90">
            © {currentYear} Pawfectly Handmade. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm opacity-90">
            <span>Made with</span>
            <span className="text-red-500">♥</span>
            <span>for dogs everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
