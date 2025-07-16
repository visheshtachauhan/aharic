'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExportButton } from './export-button';
import {
  PeakHoursChart,
  CategoryPerformanceChart,
  RevenueChart,
  OrderTrendChart
} from './charts';

interface DetailedViewProps {
  data: {
    revenueTrend: Array<{ date: string; revenue: number }>;
    orderTrend: Array<{ date: string; orders: number }>;
    peakHours: Array<{ hour: number; count: number }>;
    categoryPerformance: Array<{ category: string; revenue: number; count: number }>;
    topSellingItems: Array<{ _id: string; name: string; count: number }>;
    customerRetention: {
      totalCustomers: number;
      repeatCustomers: number;
      retentionRate: number;
    };
  };
}

export function DetailedView({ data }: DetailedViewProps) {
  const [activeTab, setActiveTab] = useState('revenue');

  return (
    <Card className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
            <TabsTrigger value="orders">Order Analysis</TabsTrigger>
            <TabsTrigger value="categories">Category Analysis</TabsTrigger>
            <TabsTrigger value="customers">Customer Analysis</TabsTrigger>
          </TabsList>
          <ExportButton
            data={data[activeTab as keyof typeof data]}
            filename={`analytics-${activeTab}`}
          />
        </div>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
              <RevenueChart data={data.revenueTrend} height={300} />
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Revenue by Category</h3>
              <CategoryPerformanceChart data={data.categoryPerformance} height={300} />
            </Card>
          </div>
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Revenue Insights</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">
                    ₹{data.revenueTrend.reduce((sum, day) => sum + day.revenue, 0).toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Average Daily Revenue</p>
                  <p className="text-2xl font-bold">
                    ₹{(data.revenueTrend.reduce((sum, day) => sum + day.revenue, 0) / data.revenueTrend.length).toFixed(2)}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Highest Revenue Day</p>
                  <p className="text-2xl font-bold">
                    ₹{Math.max(...data.revenueTrend.map(day => day.revenue)).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Order Trend</h3>
              <OrderTrendChart data={data.orderTrend} height={300} />
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Peak Hours</h3>
              <PeakHoursChart data={data.peakHours} height={300} />
            </Card>
          </div>
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Top Selling Items</h3>
            <div className="space-y-4">
              {data.topSellingItems.map((item) => (
                <div key={item._id} className="flex justify-between items-center p-2 bg-muted rounded">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-muted-foreground">{item.count} orders</span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Category Performance</h3>
            <CategoryPerformanceChart data={data.categoryPerformance} height={400} />
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Category Revenue</h3>
              <div className="space-y-4">
                {data.categoryPerformance
                  .sort((a, b) => b.revenue - a.revenue)
                  .map((category, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="font-medium">{category.category}</span>
                      <span className="text-muted-foreground">₹{category.revenue.toLocaleString()}</span>
                    </div>
                  ))}
              </div>
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Category Orders</h3>
              <div className="space-y-4">
                {data.categoryPerformance
                  .sort((a, b) => b.count - a.count)
                  .map((category, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="font-medium">{category.category}</span>
                      <span className="text-muted-foreground">{category.count} orders</span>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-2">Total Customers</h3>
              <p className="text-3xl font-bold">{data.customerRetention.totalCustomers}</p>
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-2">Repeat Customers</h3>
              <p className="text-3xl font-bold">{data.customerRetention.repeatCustomers}</p>
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-2">Retention Rate</h3>
              <p className="text-3xl font-bold">{data.customerRetention.retentionRate.toFixed(1)}%</p>
            </Card>
          </div>
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Customer Insights</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">New Customers</p>
                  <p className="text-2xl font-bold">
                    {data.customerRetention.totalCustomers - data.customerRetention.repeatCustomers}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Returning Customers</p>
                  <p className="text-2xl font-bold">{data.customerRetention.repeatCustomers}</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </Card>
  );
} 