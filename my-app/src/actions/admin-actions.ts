'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Promote a user to admin role
 * This is a temporary action for testing purposes
 * In production, this should be protected with proper authentication
 */
export async function promoteUserToAdmin(email: string) {
  if (!supabaseUrl || !supabaseServiceKey) {
    return { error: 'Supabase credentials not configured' }
  }

  // Create admin client with service role key
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  try {
    // First, try to find user in auth.users using admin API
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()

    if (listError) {
      console.error('Error listing users:', listError)
      // Fallback: try to find in profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, role')
        .eq('email', email)
        .single()

      if (profileError || !profile) {
        return { error: 'User not found with email: ' + email + '. Make sure you have registered first.' }
      }

      // Update user's profile to admin role
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', profile.id)

      if (updateError) {
        return { error: 'Failed to update user role: ' + updateError.message }
      }

      revalidatePath('/admin')
      revalidatePath('/admin/dashboard')

      return { success: true, message: `User ${email} has been promoted to admin` }
    }

    // Find user by email
    const user = users?.find((u: any) => u.email === email)

    if (!user) {
      return { error: 'User not found with email: ' + email + '. Make sure you have registered first.' }
    }

    // Check if profile exists
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from('profiles')
      .select('id, email, role')
      .eq('id', user.id)
      .single()

    if (profileCheckError && profileCheckError.code !== 'PGRST116') {
      // Profile doesn't exist, create it first
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name,
          role: 'admin'
        })

      if (insertError) {
        return { error: 'Failed to create profile: ' + insertError.message }
      }
    } else {
      // Profile exists, update role
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', user.id)

      if (updateError) {
        return { error: 'Failed to update user role: ' + updateError.message }
      }
    }

    revalidatePath('/admin')
    revalidatePath('/admin/dashboard')

    return { success: true, message: `User ${email} has been promoted to admin` }
  } catch (error: any) {
    console.error('Error promoting user:', error)
    return { error: 'An error occurred: ' + (error.message || 'Unknown error') }
  }
}

/**
 * Get current user profile
 */
export async function getCurrentProfile() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: 'Not authenticated' }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError) {
    return { error: 'Failed to fetch profile' }
  }

  return { profile }
}
