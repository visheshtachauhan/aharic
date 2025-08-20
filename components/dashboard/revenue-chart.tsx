// Product-approved Dashboard overview. Do NOT remove these panels (KPIs, Revenue Trend, Top Items, Payments, Recent Orders). Changes must preserve this composition.
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from "recharts";
import { RupeeIcon } from "@/components/icons/rupee-icon";
import { ArrowUpRight } from "lucide-react";

// Sample data
const dailyData = [
  { name: "Mon", revenue: 12400 },
  { name: "Tue", revenue: 15600 },
  { name: "Wed", revenue: 13200 },
  { name: "Thu", revenue: 18900 },
  { name: "Fri", revenue: 22600 },
  { name: "Sat", revenue: 34500 },
  { name: "Sun", revenue: 28900 },
];

const weeklyData = [
  { name: "W1", revenue: 145000 },
  { name: "W2", revenue: 162000 },
  { name: "W3", revenue: 158000 },
  { name: "W4", revenue: 178000 },
];

const monthlyData = [
  { name: "Jan", revenue: 580000 },
  { name: "Feb", revenue: 620000 },
  { name: "Mar", revenue: 750000 },
  { name: "Apr", revenue: 820000 },
  { name: "May", revenue: 790000 },
  { name: "Jun", revenue: 880000 },
];

interface PayloadItem {
  name: string;
  value: number;
  payload: { name: string; revenue: number };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: PayloadItem[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const revenue = payload[0].value;
    
    const formattedRevenue = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(revenue);
    
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="font-semibold">{label}</div>
        <div className="flex items-center gap-2 mt-1">
          <div className="h-2 w-2 rounded-full bg-primary" />
          <span className="text-sm font-medium">{formattedRevenue}</span>
        </div>
      </div>
    );
  }
  
  return null;
};

export function RevenueChart() {
  const [selectedPeriod, setSelectedPeriod] = useState<"daily" | "weekly" | "monthly">("weekly");
  
  // Get data based on selected period
  const data = 
    selectedPeriod === "daily" ? dailyData :
    selectedPeriod === "weekly" ? weeklyData :
    monthlyData;
  
  // Calculate total revenue
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Revenue Trend</CardTitle>
        <Tabs 
          value={selectedPeriod} 
          onValueChange={(value) => setSelectedPeriod(value as "daily" | "weekly" | "monthly")}
          className="h-8"
        >
          <TabsList className="h-8">
            <TabsTrigger value="daily" className="h-8 text-xs px-2">Daily</TabsTrigger>
            <TabsTrigger value="weekly" className="h-8 text-xs px-2">Weekly</TabsTrigger>
            <TabsTrigger value="monthly" className="h-8 text-xs px-2">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <div className="flex items-center">
              <RupeeIcon className="h-4 w-4 mr-1 text-primary" />
              <span className="text-xl font-bold">
                {formatCurrency(totalRevenue).replace('₹', '')}
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-1 mr-2">
              <ArrowUpRight className="h-4 w-4 text-green-700" />
            </div>
            <span className="text-sm font-medium text-green-700">
              +12.5%
            </span>
          </div>
        </div>
        
        <div className="h-[240px] mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 5,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: '#888', fontSize: 11 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: '#888', fontSize: 11 }}
                tickFormatter={(value) => `₹${value/1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 3, strokeWidth: 2 }}
                activeDot={{ r: 5, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 