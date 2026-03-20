import { useAuth } from '@/hooks/use-auth'
import { redirect } from 'next/navigation'

export default function AccountPage() {
  const { user, profile } = useAuth()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold font-display mb-8">
          Welcome{profile?.full_name ? `, ${profile.full_name}` : ''}!
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">My Orders</h2>
            <p className="text-muted-foreground">View your order history</p>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">My Profile</h2>
            <p className="text-muted-foreground">Manage your account settings</p>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Addresses</h2>
            <p className="text-muted-foreground">Manage shipping addresses</p>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Wishlist</h2>
            <p className="text-muted-foreground">View your saved products</p>
          </div>
        </div>
      </div>
    </div>
  )
}
