// Navbar component for Pawfectly Handmade

'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ShoppingBag, Menu, X, PawPrint, User, LogOut } from 'lucide-react'
import { useCart } from '@/hooks/use-cart'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'

export function Navbar() {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { items, isLoaded } = useCart()
  const { user, profile, signOut, loading } = useAuth()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => {
    setIsUserMenuOpen(false)
    await signOut()
    router.push('/login')
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <PawPrint className="w-6 h-6 text-primary transition-transform group-hover:scale-110" />
            <span className="font-display text-2xl font-bold text-foreground">
              Pawfectly Handmade
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body text-foreground hover:text-primary transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Cart, Auth & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Link
              href="/cart"
              className="relative p-2 hover:bg-muted rounded-full transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {isLoaded && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Auth Buttons - Desktop */}
            <div className="hidden md:block">
              {loading ? (
                <div className="w-8 h-8 bg-muted animate-pulse rounded-full" />
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1 pr-3 hover:bg-muted rounded-full transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">
                      {profile?.full_name || user.email?.split('@')[0]}
                    </span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-card border rounded-lg shadow-lg py-2">
                      <Link
                        href="/account"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-muted transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>My Account</span>
                      </Link>
                      {profile?.role === 'admin' && (
                        <Link
                          href="/admin/dashboard"
                          className="flex items-center gap-2 px-4 py-2 hover:bg-muted transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          <span>Dashboard</span>
                        </Link>
                      )}
                      <hr className="my-2" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 w-full px-4 py-2 hover:bg-muted transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/customer-login"
                    className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors"
                  >
                    My Account
                  </Link>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>

            <button
              className="md:hidden p-2 hover:bg-muted rounded-full transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t animate-in slide-in-from-top">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 font-body text-foreground hover:text-primary hover:bg-muted/50 px-2 rounded transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile Auth Buttons */}
            <hr className="my-4" />
            {loading ? (
              <div className="flex items-center gap-2 px-2">
                <div className="w-6 h-6 bg-muted animate-pulse rounded-full" />
                <div className="w-24 h-4 bg-muted animate-pulse rounded" />
              </div>
            ) : user ? (
              <>
                <Link
                  href="/account"
                  className="block py-2 px-2 hover:bg-muted/50 rounded transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Account
                </Link>
                {profile?.role === 'admin' && (
                  <Link
                    href="/admin/dashboard"
                    className="block py-2 px-2 hover:bg-muted/50 rounded transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleSignOut()
                    setIsMobileMenuOpen(false)
                  }}
                  className="block w-full text-left py-2 px-2 hover:bg-muted/50 rounded transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block py-2 px-2 hover:bg-muted/50 rounded transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
