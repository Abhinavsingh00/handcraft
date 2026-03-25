'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { deleteProduct } from '@/actions/admin'
import type { Product } from '@/types/admin'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Edit, Trash2 } from 'lucide-react'

interface ProductsGridProps {
  products: Product[]
  onEdit: (product: Product) => void
  onSuccess?: () => void
}

export function ProductsGrid({ products, onEdit, onSuccess }: ProductsGridProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft' | 'archived'>('all')

  const filteredProducts = products.filter(p =>
    statusFilter === 'all' || p.status === statusFilter
  )

  const handleDelete = async (productId: string, productTitle: string) => {
    if (!confirm(`Delete "${productTitle}"?`)) return

    const result = await deleteProduct(productId)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(`Deleted "${productTitle}"`)
      onSuccess?.()
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
      active: 'default',
      draft: 'secondary',
      archived: 'outline',
    }
    return <Badge variant={variants[status]}>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Filter by status:</label>
        <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-slate-500">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="line-clamp-1">{product.title}</CardTitle>
                {getStatusBadge(product.status)}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                {product.description || 'No description'}
              </p>
              <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
              {product.category && (
                <p className="text-sm text-slate-500 mt-1">{product.category}</p>
              )}
              {product.images.length > 0 && (
                <div className="mt-3">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-32 object-cover rounded"
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => onEdit(product)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDelete(product.id, product.title)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No products found. Create your first product to get started.
        </div>
      )}
    </div>
  )
}
