import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export default async function PromoteMePage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirectTo=/make-admin/promote-me')
  }

  // Use anon key to update (this will work if RLS policies allow)
  const { data, error } = await supabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', user.id)
    .select()

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
          <p className="text-slate-600 mb-4">{error.message}</p>
          <p className="text-sm text-slate-500">
            Your user ID: {user.id}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-green-600">Success!</h1>
        <p className="text-slate-600 mb-6">
          You have been promoted to admin role!
        </p>
        <div className="space-y-2 mb-6">
          <p className="text-sm"><strong>Email:</strong> {user.email}</p>
          <p className="text-sm"><strong>User ID:</strong> {user.id}</p>
          <p className="text-sm"><strong>Role:</strong> Admin</p>
        </div>
        <a
          href="/admin/dashboard"
          className="block w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 text-center"
        >
          Go to Admin Dashboard
        </a>
      </div>
    </div>
  )
}
