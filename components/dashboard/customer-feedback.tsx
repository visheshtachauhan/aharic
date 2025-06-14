"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Star, StarHalf, ChevronRight, MessageSquare, Flag, ThumbsUp } from "lucide-react";

interface Review {
  id: string;
  customerName: string;
  customerAvatar: string | null;
  rating: number;
  comment: string;
  dish: string;
  date: string;
  isHighlighted: boolean;
  isNew: boolean;
  isReplied: boolean;
}

interface RatingSummary {
  average: number;
  total: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export function CustomerFeedback() {
  const [selectedTab, setSelectedTab] = useState<"recent" | "highlighted" | "pending">("recent");
  
  const ratingSummary: RatingSummary = {
    average: 4.3,
    total: 357,
    distribution: {
      5: 52,
      4: 33,
      3: 10,
      2: 3,
      1: 2,
    },
  };

  // Mock data for customer reviews
  const reviews: Record<string, Review[]> = {
    recent: [
      {
        id: "review1",
        customerName: "Priya Sharma",
        customerAvatar: "/avatars/priya.jpg",
        rating: 5,
        comment: "The Butter Chicken was absolutely delicious! The flavor was rich and the chicken was so tender. Will definitely order again!",
        dish: "Butter Chicken",
        date: "2023-04-02T14:30:00Z",
        isHighlighted: true,
        isNew: true,
        isReplied: false,
      },
      {
        id: "review2",
        customerName: "Rahul Verma",
        customerAvatar: null,
        rating: 4,
        comment: "Great food, but delivery was slightly delayed. The Paneer Tikka was cooked perfectly though!",
        dish: "Paneer Tikka",
        date: "2023-04-01T19:15:00Z",
        isHighlighted: false,
        isNew: true,
        isReplied: true,
      },
      {
        id: "review3",
        customerName: "Aisha Khan",
        customerAvatar: "/avatars/aisha.jpg",
        rating: 3,
        comment: "Food was good but portions could be larger for the price. The flavors were authentic though.",
        dish: "Veg Biryani",
        date: "2023-03-30T12:45:00Z",
        isHighlighted: false,
        isNew: false,
        isReplied: true,
      },
      {
        id: "review4",
        customerName: "Vikram Singh",
        customerAvatar: "/avatars/vikram.jpg",
        rating: 5,
        comment: "Best Masala Dosa in town! Crispy and the potato filling was seasoned perfectly.",
        dish: "Masala Dosa",
        date: "2023-03-28T09:20:00Z",
        isHighlighted: true,
        isNew: false,
        isReplied: true,
      },
    ],
    highlighted: [
      {
        id: "review1",
        customerName: "Priya Sharma",
        customerAvatar: "/avatars/priya.jpg",
        rating: 5,
        comment: "The Butter Chicken was absolutely delicious! The flavor was rich and the chicken was so tender. Will definitely order again!",
        dish: "Butter Chicken",
        date: "2023-04-02T14:30:00Z",
        isHighlighted: true,
        isNew: true,
        isReplied: false,
      },
      {
        id: "review4",
        customerName: "Vikram Singh",
        customerAvatar: "/avatars/vikram.jpg",
        rating: 5,
        comment: "Best Masala Dosa in town! Crispy and the potato filling was seasoned perfectly.",
        dish: "Masala Dosa",
        date: "2023-03-28T09:20:00Z",
        isHighlighted: true,
        isNew: false,
        isReplied: true,
      },
      {
        id: "review5",
        customerName: "Meera Patel",
        customerAvatar: null,
        rating: 5,
        comment: "The Garlic Naan is simply the best! Soft, fluffy, and perfect amount of garlic. Paired perfectly with the Dal Makhani.",
        dish: "Garlic Naan, Dal Makhani",
        date: "2023-03-25T18:10:00Z",
        isHighlighted: true,
        isNew: false,
        isReplied: true,
      },
    ],
    pending: [
      {
        id: "review1",
        customerName: "Priya Sharma",
        customerAvatar: "/avatars/priya.jpg",
        rating: 5,
        comment: "The Butter Chicken was absolutely delicious! The flavor was rich and the chicken was so tender. Will definitely order again!",
        dish: "Butter Chicken",
        date: "2023-04-02T14:30:00Z",
        isHighlighted: true,
        isNew: true,
        isReplied: false,
      },
      {
        id: "review6",
        customerName: "Arjun Nair",
        customerAvatar: "/avatars/arjun.jpg",
        rating: 4,
        comment: "I really enjoyed the Chicken Biryani, but would prefer it a bit spicier next time.",
        dish: "Chicken Biryani",
        date: "2023-03-27T21:05:00Z",
        isHighlighted: false,
        isNew: false,
        isReplied: false,
      },
      {
        id: "review7",
        customerName: "Neha Kapoor",
        customerAvatar: null,
        rating: 2,
        comment: "The Gulab Jamun was too sweet and seemed like it wasn't freshly made.",
        dish: "Gulab Jamun",
        date: "2023-03-26T15:40:00Z",
        isHighlighted: false,
        isNew: false,
        isReplied: false,
      },
    ]
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-current text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="h-4 w-4 fill-current text-yellow-400" />);
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    
    return stars;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">
          Customer Feedback
        </CardTitle>
        <Tabs 
          value={selectedTab} 
          onValueChange={(value) => setSelectedTab(value as "recent" | "highlighted" | "pending")}
          className="h-8"
        >
          <TabsList className="h-8">
            <TabsTrigger value="recent" className="h-8">Recent</TabsTrigger>
            <TabsTrigger value="highlighted" className="h-8">Highlighted</TabsTrigger>
            <TabsTrigger value="pending" className="h-8">Pending</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-3xl font-bold">{ratingSummary.average.toFixed(1)}</span>
                <div className="flex mt-1 items-center">
                  {renderStars(ratingSummary.average)}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {ratingSummary.total} reviews
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>Reply All</span>
                </Button>
              </div>
            </div>
            
            <div className="space-y-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const percentage = Math.round((ratingSummary.distribution[star as keyof typeof ratingSummary.distribution] / ratingSummary.total) * 100);
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-sm w-3">{star}</span>
                    <Star className="h-3.5 w-3.5 fill-current text-yellow-400" />
                    <Progress value={percentage} className="h-2 flex-1" />
                    <span className="text-sm text-muted-foreground w-8 text-right">{percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="space-y-4 md:border-l md:pl-4">
            {reviews[selectedTab].map((review) => (
              <div key={review.id} className="space-y-1 pb-3 border-b last:border-0 last:pb-0">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      {review.customerAvatar ? (
                        <img 
                          src={review.customerAvatar} 
                          alt={review.customerName}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.customerName)}&background=random`;
                          }}
                        />
                      ) : (
                        <img 
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.customerName)}&background=random`}
                          alt={review.customerName}
                        />
                      )}
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{review.customerName}</span>
                        {review.isNew && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                        <span className="ml-2 text-xs text-muted-foreground">
                          {formatDate(review.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm leading-relaxed">{review.comment}</p>
                  <div className="mt-1 flex items-center">
                    <Badge variant="outline" className="text-xs">
                      {review.dish}
                    </Badge>
                    
                    <div className="ml-auto flex gap-1">
                      {!review.isReplied ? (
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          Reply
                        </Button>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 text-xs">
                          Replied
                        </Badge>
                      )}
                      
                      {!review.isHighlighted && (
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          Highlight
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="text-center">
              <Button variant="ghost" size="sm" className="text-sm text-muted-foreground">
                View All Reviews <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 