import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Info, TrendingUp, Star, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface ItemInsightsProps {
  itemId: string
  className?: string
  children: React.ReactNode
}

interface ItemStats {
  weeklySales: number
  rating: number
  reviewCount: number
  createdAt: string
}

export function ItemInsights({ itemId, className, children }: ItemInsightsProps) {
  // In a real app, this would be fetched from your API
  const getItemStats = (id: string): ItemStats => {
    // Dummy data - replace with actual API call
    return {
      weeklySales: Math.floor(Math.random() * 300),
      rating: 4 + Math.random(),
      reviewCount: Math.floor(Math.random() * 200),
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString()
    }
  }

  const stats = getItemStats(itemId)

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className={cn("cursor-help", className)}>
          {children}
        </div>
      </HoverCardTrigger>
      <HoverCardContent 
        className="w-80 bg-white/95 backdrop-blur-sm shadow-lg"
        align="start"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-orange-600">
            <Info className="h-4 w-4" />
            <span className="font-medium">Item Insights</span>
          </div>
          
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm">Weekly Sales</span>
              </div>
              <span className="font-medium">{stats.weeklySales} orders</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Average Rating</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">{stats.rating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">
                  ({stats.reviewCount} reviews)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Added to Menu</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(stats.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
} 