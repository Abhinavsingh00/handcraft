'use client'

import { useAuth } from '@/hooks/use-auth'
import Link from 'next/link'

export default function AccountPage() {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-64 mb-8" />
            <div className="grid md:grid-cols-2 gap-6">
              <div className="h-32 bg-muted rounded" />
              <div className="h-32 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold font-display mb-4">Please Sign In</h1>
          <p className="text-muted-foreground mb-6">You need to be signed in to view your account.</p>
          <Link
            href="/login"
            className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold font-display mb-2">
          Welcome{profile?.full_name ? `, ${profile.full_name}` : ''}!
        </h1>
        <p className="text-muted-foreground mb-8">{user.email}</p>

        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/account/orders" className="block group">
            <div className="bg-card p-6 rounded-lg border hover:border-primary transition-colors">
              <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">My Orders</h2>
              <p className="text-muted-foreground">View your order history and track shipments</p>
            </div>
          </Link>

          <Link href="/account/profile" className="block group">
            <div className="bg-card p-6 rounded-lg border hover:border-primary transition-colors">
              <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">My Profile</h2>
              <p className="text-muted-foreground">Manage your account settings and personal information</p>
            </div>
          </Link>

          <Link href="/account/addresses" className="block group">
            <div className="bg-card p-6 rounded-lg border hover:border-primary transition-colors">
              <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Addresses</h2>
              <p className="text-muted-foreground">Manage your shipping addresses</p>
            </div>
          </Link>

          <Link href="/account/wishlist" className="block group">
            <div className="bg-card p-6 rounded-lg border hover:border-primary transition-colors">
              <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">Wishlist</h2>
              <p className="text-muted-foreground">View your saved products</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
