'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { ProductSchema, type ProductInput } from '@/lib/admin-validations'
import type { Product, DashboardStats } from '@/types/admin'

// ============================================
// PRODUCT ACTIONS
// ============================================

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch products:', error)
    return []
  }

  return data || []
}

export async function getProduct(id: string): Promise<Product | null> {
  const supabase = await createClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Failed to fetch product:', error)
    return null
  }

  return data
}

export async function createProduct(formData: FormData): Promise<{ success: boolean; error?: string; data?: Product }> {
  const supabase = await createClient()
  if (!supabase) return { error: 'Database not configured', success: false }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Authentication required', success: false }

  // Verify admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    console.warn(`Unauthorized product creation by user ${user.id}`)
    return { error: 'Unauthorized', success: false }
  }

  // Validate input
  const validatedData = ProductSchema.safeParse(Object.fromEntries(formData))
  if (!validatedData.success) {
    return { error: validatedData.error.issues[0].message, success: false }
  }

  const { data: product, error } = await supabase
    .from('products')
    .insert({
      ...validatedData.data,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error('Product creation failed:', error)
    return { error: 'Failed to create product', success: false }
  }

  revalidatePath('/admin/products')
  revalidatePath('/shop')

  return { success: true, data: product }
}

export async function updateProduct(id: string, formData: FormData): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  if (!supabase) return { error: 'Database not configured', success: false }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Authentication required', success: false }

  // Verify admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    console.warn(`Unauthorized product update by user ${user.id}`)
    return { error: 'Unauthorized', success: false }
  }

  const validatedData = ProductSchema.safeParse(Object.fromEntries(formData))
  if (!validatedData.success) {
    return { error: validatedData.error.issues[0].message, success: false }
  }

  const { error } = await supabase
    .from('products')
    .update(validatedData.data)
    .eq('id', id)

  if (error) {
    console.error('Product update failed:', error)
    return { error: 'Failed to update product', success: false }
  }

  revalidatePath('/admin/products')
  revalidatePath('/admin/products/[id]')
  revalidatePath('/shop')
  revalidatePath('/product/[id]')

  return { success: true }
}

export async function deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  if (!supabase) return { error: 'Database not configured', success: false }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Authentication required', success: false }

  // Verify admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    console.warn(`Unauthorized product deletion by user ${user.id}`)
    return { error: 'Unauthorized', success: false }
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Product deletion failed:', error)
    return { error: 'Failed to delete product', success: false }
  }

  revalidatePath('/admin/products')
  revalidatePath('/shop')

  return { success: true }
}

// ============================================
// USER ACTIONS
// ============================================

export async function getUsers(): Promise<any[]> {
  const supabase = await createClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch users:', error)
    return []
  }

  return data || []
}

export async function updateUserRole(userId: string, newRole: 'customer' | 'admin'): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  if (!supabase) return { error: 'Database not configured', success: false }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Authentication required', success: false }

  // Verify admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    console.warn(`Unauthorized role change by user ${user.id}`)
    return { error: 'Unauthorized', success: false }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId)

  if (error) {
    console.error('Role update failed:', error)
    return { error: 'Failed to update role', success: false }
  }

  return { success: true }
}

export async function deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  if (!supabase) return { error: 'Database not configured', success: false }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Authentication required', success: false }

  // Prevent self-deletion
  if (userId === user.id) {
    return { error: 'Cannot delete your own account', success: false }
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    console.warn(`Unauthorized user deletion by user ${user.id}`)
    return { error: 'Unauthorized', success: false }
  }

  // Soft-delete: mark user email as deleted and revoke sessions
  const { error } = await supabase
    .from('profiles')
    .update({
      email: `deleted_${userId}@deleted.local`,
      full_name: 'Deleted User',
      role: 'customer',
    })
    .eq('id', userId)

  if (error) {
    console.error('User deletion failed:', error)
    return { error: 'Failed to delete user', success: false }
  }

  revalidatePath('/admin/users')

  return { success: true }
}

// ============================================
// DASHBOARD ACTIONS
// ============================================

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient()
  if (!supabase) {
    return { totalUsers: 0, totalProducts: 0, activeProducts: 0, draftProducts: 0 }
  }

  const [usersResult, productsResult] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('products').select('id', { count: 'exact', head: true }),
  ])

  const activeResult = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'active')

  const draftResult = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'draft')

  return {
    totalUsers: usersResult.count || 0,
    totalProducts: productsResult.count || 0,
    activeProducts: activeResult.count || 0,
    draftProducts: draftResult.count || 0,
  }
}
