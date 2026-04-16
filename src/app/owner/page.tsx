import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AnalyticsCharts } from '@/components/admin/AnalyticsCharts'

export const revalidate = 0 

export default async function OwnerDashboard() {
  const orders = await prisma.order.findMany({
    where: { status: { not: 'CANCELLED' } },
    orderBy: { createdAt: 'asc' }
  })
  const booksCount = await prisma.book.count()
  
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
  
  const revenueByDate = orders.reduce((acc: any, order) => {
    const date = new Date(order.createdAt).toLocaleDateString();
    acc[date] = (acc[date] || 0) + order.total;
    return acc;
  }, {});
  
  const formattedRevenueMap = Object.keys(revenueByDate).map(key => ({
    date: key,
    revenue: revenueByDate[key]
  }))

  const topBooks = await prisma.book.findMany({
    orderBy: { createdAt: 'desc' }, 
    take: 5
  })
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold tracking-tight text-text">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle>Total Lifetime Revenue</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold font-mono">KES {totalRevenue.toLocaleString()}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Valid Orders Placed</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold font-mono">{orders.length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Total Catalog</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold font-mono">{booksCount} Titles</p></CardContent>
        </Card>
      </div>

      <AnalyticsCharts data={formattedRevenueMap} topBooks={topBooks} />
    </div>
  )
}
