'use client'

import { useState } from 'react'
import { promoteUserToAdmin } from '@/actions/admin-actions'

export default function MakeAdminPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    setMessage(null)

    const result = await promoteUserToAdmin(email)

    setLoading(false)

    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: result.message || 'User promoted to admin successfully!' })
      setEmail('')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Promote User to Admin</h1>
        <p className="text-slate-600 mb-6">
          Enter the email address of the user you want to promote to admin role.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {message && (
            <div className={`p-4 rounded-md ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Promote to Admin'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t">
          <p className="text-sm text-slate-500 mb-2">Steps to test admin dashboard:</p>
          <ol className="text-sm text-slate-600 space-y-1 list-decimal list-inside">
            <li>Go to <a href="/register" className="text-primary hover:underline">/register</a> and create a new account</li>
            <li>Come back to this page and enter your email</li>
            <li>Click "Promote to Admin"</li>
            <li>Go to <a href="/" className="text-primary hover:underline">home page</a> and login</li>
            <li>Click on your account and select "Admin Dashboard"</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
