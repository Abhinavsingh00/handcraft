import { z } from 'zod'

export const ProductSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().optional(),
  price: z.coerce
    .number()
    .min(0, 'Price must be positive')
    .max(999999.99, 'Price too large'),
  category: z.string().optional(),
  status: z.enum(['active', 'draft', 'archived']).default('active'),
  images: z.array(z.string().url('Invalid image URL')).default([]),
})

export type ProductInput = z.infer<typeof ProductSchema>

export const UserRoleSchema = z.enum(['customer', 'admin'])

export type UserRole = z.infer<typeof UserRoleSchema>
