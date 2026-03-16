// BulkPricingTable component for Pawfectly Handmade

import { Product } from '@/types'
import { cn } from '@/lib/utils'

interface BulkPricingTableProps {
  product: Product
  quantity?: number
}

export function BulkPricingTable({ product, quantity = 1 }: BulkPricingTableProps) {
  if (!product.bulkPricing || product.bulkPricing.length === 0) {
    return null
  }

  return (
    <div className="border border-border rounded-lg p-4 bg-card">
      <h4 className="font-display text-lg font-semibold mb-3 text-foreground">
        Bulk Pricing
      </h4>
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2 font-body text-sm text-muted-foreground">
              Quantity
            </th>
            <th className="text-right py-2 font-body text-sm text-muted-foreground">
              Price Each
            </th>
            <th className="text-right py-2 font-body text-sm text-muted-foreground">
              Discount
            </th>
          </tr>
        </thead>
        <tbody>
          {product.bulkPricing.map((tier, index) => {
            const tierPrice = product.price * (1 - tier.discount / 100)
            const isActive = quantity >= tier.minQty

            return (
              <tr
                key={index}
                className={cn(
                  'border-b border-border last:border-b-0 transition-colors',
                  isActive && 'bg-primary/10'
                )}
              >
                <td className="py-3 font-body text-sm text-foreground">
                  {tier.minQty}+ items
                </td>
                <td className="text-right py-3 font-body text-sm text-foreground">
                  ${tierPrice.toFixed(2)}
                </td>
                <td className="text-right py-3 font-body text-sm text-green-600 font-semibold">
                  {tier.discount}% off
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="text-xs text-muted-foreground mt-3">
        Discounts automatically applied at checkout
      </p>
    </div>
  )
}
