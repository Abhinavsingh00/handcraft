import { User } from '@supabase/supabase-js'

export interface Profile {
  id: string
  email: string | null
  role: 'customer' | 'admin'
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface AuthUser {
  user: User | null
  profile: Profile | null
  loading: boolean
}

export interface SignUpData {
  email: string
  password: string
  fullName: string
}

export interface SignInData {
  email: string
  password: string
}

export interface AuthError {
  message: string
  code?: string
}
