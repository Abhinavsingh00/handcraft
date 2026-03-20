import { createClient as createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Creates a Supabase client for use in Server Components and Server Actions
 * Uses cookies for authentication (not used in Phase 2.1 but ready for future auth)
 * Note: Returns null if env vars are missing (Server Actions will fall back to mock)
 */
export async function createClient() {
  // Check if we're in a browser environment (shouldn't happen, but defensive)
  if (typeof window !== 'undefined') {
    return null
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    // Return null instead of throwing - Server Actions will fall back to mock data
    console.warn('Supabase credentials not found, falling back to mock data. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to use Supabase.')
    return null
  }

  try {
    const cookieStore = await cookies()

    return createServerClient(url, key, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    })
  } catch (error) {
    // If Supabase client creation fails, fall back to mock data
    console.warn('Failed to create Supabase client, falling back to mock data:', error)
    return null
  }
}