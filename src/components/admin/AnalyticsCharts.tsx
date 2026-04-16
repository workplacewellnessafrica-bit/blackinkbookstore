'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export function AnalyticsCharts({ data, topBooks }: { data: any[], topBooks: any[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Daily Revenue</CardTitle>
        </CardHeader>
        <CardContent className="h-80 w-full">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B6B6B' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B6B6B' }} width={60} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: '1px solid #E5E5E5' }} />
                <Line type="monotone" dataKey="revenue" stroke="#0A0A0A" strokeWidth={3} dot={{ r: 4, fill: "#0A0A0A" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
             <div className="h-full w-full flex items-center justify-center text-muted">No revenue data yet.</div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Catalog Showcase (Price Metric)</CardTitle>
        </CardHeader>
        <CardContent className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
             <BarChart data={topBooks} layout="vertical" margin={{ left: 0 }}>
               <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E5E5" />
               <XAxis type="number" axisLine={false} tickLine={false} />
               <YAxis dataKey="title" type="category" axisLine={false} tickLine={false} width={100} tick={{ fontSize: 10, fill: '#6B6B6B' }} />
               <Tooltip cursor={{ fill: '#FAFAF9' }} />
               <Bar dataKey="price" fill="#0A0A0A" radius={[0, 4, 4, 0]} barSize={24} />
             </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
