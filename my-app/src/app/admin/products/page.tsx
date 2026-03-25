'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getProducts } from '@/actions/admin'
import { ProductsGrid } from '@/components/admin/products-grid'
import { ProductFormModal } from '@/components/admin/product-form-modal'
import { Button } from '@/components/ui/button'
import type { Product } from '@/types/admin'
import { Plus } from 'lucide-react'

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | undefined>()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setIsLoading(true)
    const data = await getProducts()
    setProducts(data)
    setIsLoading(false)
  }

  const handleCreate = () => {
    setEditingProduct(undefined)
    setIsModalOpen(true)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProduct(undefined)
  }

  const handleSuccess = () => {
    loadProducts()
    router.refresh()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading products...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-slate-600 mt-2">Manage your product inventory</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <ProductsGrid
        products={products}
        onEdit={handleEdit}
        onSuccess={handleSuccess}
      />

      <ProductFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        product={editingProduct}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
