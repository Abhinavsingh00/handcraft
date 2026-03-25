import { getUsers } from '@/actions/admin'
import { UsersTable } from '@/components/admin/users-table'

export default async function AdminUsersPage() {
  const users = await getUsers()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-slate-600 mt-2">Manage user accounts and permissions</p>
      </div>

      <UsersTable users={users} />
    </div>
  )
}
