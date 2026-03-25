'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { createProduct, updateProduct } from '@/actions/admin'
import type { Product, ProductFormData } from '@/types/admin'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ProductFormModalProps {
  open: boolean
  onClose: () => void
  product?: Product
  onSuccess?: () => void
}

export function ProductFormModal({ open, onClose, product, onSuccess }: ProductFormModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<ProductFormData>>(
    product ? {
      title: product.title,
      description: product.description ?? undefined,
      price: product.price,
      category: product.category ?? undefined,
      status: product.status,
      images: product.images,
    } : {
      title: '',
      description: '',
      price: 0,
      category: '',
      status: 'active',
      images: [],
    }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const formDataObj = new FormData()
    formDataObj.append('title', formData.title || '')
    formDataObj.append('price', String(formData.price || 0))
    if (formData.description) formDataObj.append('description', formData.description)
    if (formData.category) formDataObj.append('category', formData.category)
    formDataObj.append('status', formData.status || 'active')
    formData.images?.forEach(img => formDataObj.append('images', img))

    const result = product
      ? await updateProduct(product.id, formDataObj)
      : await createProduct(formDataObj)

    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(product ? 'Product updated!' : 'Product created!')
      onClose()
      onSuccess?.()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Create Product'}</DialogTitle>
          <DialogDescription>
            {product ? 'Update product details below.' : 'Fill in the details to create a new product.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Product name"
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Product description"
              rows={4}
            />
          </div>

          {/* Price */}
          <div>
            <Label htmlFor="price">Price *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
              required
            />
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Electronics, Clothing"
            />
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value as 'active' | 'draft' | 'archived' })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Images URL */}
          <div>
            <Label htmlFor="images">Image URLs (one per line)</Label>
            <Textarea
              id="images"
              value={formData.images?.join('\n') || ''}
              onChange={(e) => setFormData({
                ...formData,
                images: e.target.value.split('\n').filter(url => url.trim())
              })}
              placeholder="https://example.com/image1.jpg"
              rows={3}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : product ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
