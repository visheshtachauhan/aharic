'use client';

import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Brain } from 'lucide-react';

interface AIInsightTooltipProps {
  type: 'orders' | 'sales' | 'customers';
  value: number;
  previousValue: number;
  timeFrame: 'hour' | 'day' | 'week' | 'month';
}

export function AIInsightTooltip({
  type,
  value,
  previousValue,
  timeFrame,
}: AIInsightTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  const percentageChange = ((value - previousValue) / previousValue) * 100;
  const isPositive = percentageChange > 0;

  const getMessage = () => {
    const trend = isPositive ? 'increased' : 'decreased';
    const absChange = Math.abs(percentageChange).toFixed(1);

    switch (type) {
      case 'orders':
        return `Order volume has ${trend} by ${absChange}% in the last ${timeFrame}`;
      case 'sales':
        return `Sales have ${trend} by ${absChange}% compared to last ${timeFrame}`;
      case 'customers':
        return `Customer traffic has ${trend} by ${absChange}% this ${timeFrame}`;
      default:
        return `Value has ${trend} by ${absChange}% this ${timeFrame}`;
    }
  };

  return (
    <TooltipProvider>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>
          <button
            className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
            onClick={() => setIsOpen(true)}
          >
            <Brain className="w-4 h-4 text-[#FF7300]" />
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="bg-white p-3 rounded-lg shadow-lg max-w-xs"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-[#FF7300]" />
              <span className="font-medium">AI Insight</span>
            </div>
            <p className="text-sm text-gray-600">{getMessage()}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 