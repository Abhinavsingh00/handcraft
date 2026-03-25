import { AdminSidebar } from '@/components/admin/admin-sidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="lg:pl-64">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
