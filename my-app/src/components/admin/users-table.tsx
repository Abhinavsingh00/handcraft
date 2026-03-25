'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { updateUserRole, deleteUser } from '@/actions/admin'
import type { Profile } from '@/types/auth'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Search, Trash2 } from 'lucide-react'

interface UsersTableProps {
  users: Profile[]
}

export function UsersTable({ users: initialUsers }: UsersTableProps) {
  const [users, setUsers] = useState(initialUsers)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin'
    const userName = users.find(u => u.id === userId)?.full_name || userId

    // Optimistic update
    setUsers(prev => prev.map(u =>
      u.id === userId ? { ...u, role: newRole as 'customer' | 'admin' } : u
    ))

    const result = await updateUserRole(userId, newRole)

    if (result.error) {
      // Rollback on error
      setUsers(initialUsers)
      toast.error(result.error)
    } else {
      toast.success(`Updated ${userName} to ${newRole}`)
    }
  }

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete ${userName}?`)) return

    const result = await deleteUser(userId)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(`Deleted ${userName}`)
      setUsers(prev => prev.filter(u => u.id !== userId))
    }
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.full_name || 'Unnamed'}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === 'admin' ? 'default' : 'secondary'}
                      className="cursor-pointer"
                      onClick={() => handleRoleToggle(user.id, user.role)}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(user.id, user.full_name || user.email || 'User')}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-slate-500">
        {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'}
      </p>
    </div>
  )
}
