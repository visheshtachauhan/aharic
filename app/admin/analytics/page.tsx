'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { addDays, format, subDays } from 'date-fns';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Cell, Line } from 'recharts';
import { Download, TrendingUp, TrendingDown, DollarSign, Users, ShoppingBag, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { DateRange } from 'react-day-picker';

interface AnalyticsData {
  revenue: {
    total: number;
    growth: number;
    daily: { date: string; amount: number }[];
  };
  orders: {
    total: number;
    growth: number;
    daily: { date: string; count: number }[];
  };
  customers: {
    total: number;
    new: number;
    returning: number;
  };
  items: {
    topSelling: Array<{ name: string; quantity: number; revenue: number }>;
    lowStock: Array<{ name: string; quantity: number }>;
  };
  averageOrderValue: number;
  peakHours: Array<{ hour: string; orders: number }>;
}

export default function AnalyticsPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalyticsData = async () => {
    if (!date?.from || !date?.to) return;
    
    try {
      setLoading(true);
      const response = await fetch(
        `/api/analytics?from=${date.from.toISOString()}&to=${date.to.toISOString()}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      
      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      toast.error('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const downloadReport = async () => {
    if (!date?.from || !date?.to) return;
    
    try {
      const response = await fetch(
        `/api/analytics/export?from=${date.from.toISOString()}&to=${date.to.toISOString()}&format=csv`
      );
      
      if (!response.ok) {
        throw new Error('Failed to download report');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${format(date.from, 'yyyy-MM-dd')}-to-${format(date.to, 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Report downloaded successfully');
    } catch (err) {
      toast.error('Failed to download report');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#FF7300]"></div>
      </div>
    );
  }

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

  const formatDate = (dateStr: string) => format(new Date(dateStr), 'MMM dd');

  return (
    <div className="p-4 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <DatePickerWithRange
            value={date}
            onChange={setDate}
          />
          <Button onClick={downloadReport} size="sm" variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Card className="p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <h3 className="text-xl font-bold mt-1">{formatCurrency(data?.revenue?.total ?? 0)}</h3>
              <p className={`text-xs flex items-center gap-1 mt-1 ${(data?.revenue?.growth ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {(data?.revenue?.growth ?? 0) >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(data?.revenue?.growth ?? 0).toFixed(1)}%
              </p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <DollarSign className="w-4 h-4 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Orders</p>
              <h3 className="text-xl font-bold mt-1">{data?.orders?.total?.toLocaleString() ?? '0'}</h3>
              <p className={`text-xs flex items-center gap-1 mt-1 ${(data?.orders?.growth ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {(data?.orders?.growth ?? 0) >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(data?.orders?.growth ?? 0).toFixed(1)}%
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingBag className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Order</p>
              <h3 className="text-xl font-bold mt-1">{formatCurrency(data?.averageOrderValue ?? 0)}</h3>
              <p className="text-xs text-gray-500 mt-1">Per order</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">Customers</p>
              <h3 className="text-xl font-bold mt-1">{data?.customers?.total?.toLocaleString() ?? '0'}</h3>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                {data?.customers?.new ?? 0} new
              </p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-4 h-4 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold">Revenue Trend</h3>
            <div className="text-xs text-gray-500">
              Total: {formatCurrency(data?.revenue?.total ?? 0)}
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={data?.revenue?.daily?.map(d => ({ ...d, date: formatDate(d.date) })) ?? []}
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF7300" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#FF7300" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12, fill: '#666' }}
                  tickLine={false}
                  axisLine={{ stroke: '#eee' }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#666' }}
                  tickLine={false}
                  axisLine={{ stroke: '#eee' }}
                  tickFormatter={(value) => formatCurrency(value).split('.')[0]}
                  width={80}
                />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #eee',
                    borderRadius: '8px',
                    padding: '8px 12px'
                  }}
                  formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                  labelStyle={{ color: '#666', marginBottom: '4px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#FF7300" 
                  strokeWidth={2}
                  fill="url(#colorRevenue)"
                  dot={false}
                  activeDot={{ r: 6, fill: '#FF7300', strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold">Orders Trend</h3>
            <div className="text-xs text-gray-500">
              Total: {data?.orders?.total?.toLocaleString() ?? '0'} orders
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart 
                data={data?.orders?.daily?.map(d => ({ ...d, date: formatDate(d.date) })) ?? []}
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12, fill: '#666' }}
                  tickLine={false}
                  axisLine={{ stroke: '#eee' }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#666' }}
                  tickLine={false}
                  axisLine={{ stroke: '#eee' }}
                  width={50}
                />
                <Tooltip
                  cursor={{ fill: '#f5f5f5' }}
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #eee',
                    borderRadius: '8px',
                    padding: '8px 12px'
                  }}
                  formatter={(value: number) => [`${value} orders`, 'Orders']}
                  labelStyle={{ color: '#666', marginBottom: '4px' }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#2563eb"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={35}
                  fillOpacity={0.8}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#1d4ed8"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: '#1d4ed8', strokeWidth: 0 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-sm font-semibold mb-4">Peak Hours</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={data?.peakHours ?? []}
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis 
                  dataKey="hour" 
                  tick={{ fontSize: 11, fill: '#666' }} 
                  interval={1}
                  tickLine={false}
                  axisLine={{ stroke: '#eee' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#666' }}
                  tickLine={false}
                  axisLine={{ stroke: '#eee' }}
                  width={50}
                />
                <Tooltip
                  cursor={{ fill: '#f5f5f5' }}
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #eee',
                    borderRadius: '8px',
                    padding: '8px 12px'
                  }}
                  formatter={(value: number) => [`${value} orders`, 'Orders']}
                  labelStyle={{ color: '#666', marginBottom: '4px' }}
                />
                <Bar 
                  dataKey="orders" 
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={35}
                >
                  {data?.peakHours?.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={entry.orders > 40 ? '#059669' : '#10b981'}
                      fillOpacity={0.8}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-sm font-semibold mb-4">Top Selling Items</h3>
          <div className="space-y-3">
            {data?.items?.topSelling?.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-gray-600">{item.quantity} orders</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatCurrency(item.revenue)}</p>
                  <p className="text-xs text-gray-600">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}