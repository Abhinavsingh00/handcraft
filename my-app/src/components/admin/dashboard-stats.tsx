'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Users, Package, CheckCircle, FileText } from 'lucide-react'
import type { DashboardStats } from '@/types/admin'

interface DashboardStatsProps {
  stats: DashboardStats
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      label: 'Active Products',
      value: stats.activeProducts,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Draft Products',
      value: stats.draftProducts,
      icon: FileText,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
