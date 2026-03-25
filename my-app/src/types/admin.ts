export interface Product {
  id: string
  title: string
  description: string | null
  price: number
  images: string[]
  category: string | null
  status: 'active' | 'draft' | 'archived'
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface ProductFormData {
  title: string
  description?: string
  price: number
  category?: string
  status: 'active' | 'draft' | 'archived'
  images: string[]
}

export interface DashboardStats {
  totalUsers: number
  totalProducts: number
  activeProducts: number
  draftProducts: number
}
