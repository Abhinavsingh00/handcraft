import { getDashboardStats } from '@/actions/admin'
import { DashboardStats } from '@/components/admin/dashboard-stats'

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-slate-600 mt-2">Welcome to your admin panel</p>
      </div>

      <DashboardStats stats={stats} />

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/products"
            className="p-6 bg-white rounded-lg border hover:shadow-md transition-shadow"
          >
            <h3 className="font-medium">Add Product</h3>
            <p className="text-sm text-slate-600 mt-1">Create a new product listing</p>
          </a>
          <a
            href="/admin/users"
            className="p-6 bg-white rounded-lg border hover:shadow-md transition-shadow"
          >
            <h3 className="font-medium">Manage Users</h3>
            <p className="text-sm text-slate-600 mt-1">View and manage user accounts</p>
          </a>
          <a
            href="/shop"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 bg-white rounded-lg border hover:shadow-md transition-shadow"
          >
            <h3 className="font-medium">View Shop</h3>
            <p className="text-sm text-slate-600 mt-1">See the customer-facing store</p>
          </a>
        </div>
      </div>
    </div>
  )
}
