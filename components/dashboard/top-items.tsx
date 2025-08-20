// Product-approved Dashboard overview. Do NOT remove these panels (KPIs, Revenue Trend, Top Items, Payments, Recent Orders). Changes must preserve this composition.
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface TopItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  percentageChange: number;
}

export function TopItems() {
  const topItems: TopItem[] = [
    {
      id: "item-1",
      name: "Butter Chicken",
      category: "Main Course",
      price: 299,
      quantity: 142,
      percentageChange: 10.94,
    },
    {
      id: "item-5",
      name: "Garlic Naan",
      category: "Bread",
      price: 69,
      quantity: 203,
      percentageChange: 12.78,
    },
    {
      id: "item-3",
      name: "Masala Dosa",
      category: "Breakfast",
      price: 199,
      quantity: 98,
      percentageChange: -6.67,
    },
    {
      id: "item-2",
      name: "Paneer Tikka",
      category: "Starters",
      price: 249,
      quantity: 89,
      percentageChange: -3.26,
    },
    {
      id: "item-6",
      name: "Veg Biryani",
      category: "Main Course",
      price: 249,
      quantity: 85,
      percentageChange: 8.97,
    },
  ];

  const maxQuantity = Math.max(...topItems.map(item => item.quantity));

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Top Selling Items</CardTitle>
      </CardHeader>
      <CardContent className="px-2 pb-2 overflow-auto max-h-[320px]">
        <div className="space-y-4">
          <div className="grid grid-cols-12 p-2 text-xs font-medium text-muted-foreground bg-muted/20 rounded-md">
            <div className="col-span-5">Item</div>
            <div className="col-span-2 text-right">Price</div>
            <div className="col-span-3 text-right">Sales</div>
            <div className="col-span-2 text-right">Change</div>
          </div>
          
          {topItems.map((item) => (
            <div key={item.id} className="grid grid-cols-12 items-center py-2 border-b last:border-0">
              <div className="col-span-5">
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.category}</p>
              </div>
              <div className="col-span-2 text-right text-sm">₹{item.price}</div>
              <div className="col-span-3">
                <div className="text-right text-sm">{item.quantity}</div>
                <div className="mt-1 w-full">
                  <Progress value={(item.quantity / maxQuantity) * 100} className="h-1" />
                </div>
              </div>
              <div className="col-span-2 flex justify-end">
                {item.percentageChange > 0 ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs h-5 px-1">
                    <ArrowUp className="h-3 w-3 mr-1" /> {item.percentageChange.toFixed(1)}%
                  </Badge>
                ) : item.percentageChange < 0 ? (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs h-5 px-1">
                    <ArrowDown className="h-3 w-3 mr-1" /> {Math.abs(item.percentageChange).toFixed(1)}%
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 text-xs h-5 px-1">
                    <Minus className="h-3 w-3 mr-1" /> 0%
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 