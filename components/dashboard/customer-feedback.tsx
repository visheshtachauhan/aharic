"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Star, StarHalf, MessageSquare, Flag, ThumbsUp } from "lucide-react";

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

  const ReviewCard = ({ review }: { review: Review }) => (
    <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <Avatar>
            {review.customerAvatar ? (
              <Image
                src={review.customerAvatar}
                alt={review.customerName}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-muted-foreground flex items-center justify-center text-white font-bold">
                {review.customerName.charAt(0)}
              </div>
            )}
          </Avatar>
          <div>
            <p className="font-semibold text-sm">{review.customerName}</p>
            <div className="flex items-center">
              {renderStars(review.rating)}
              <span className="ml-2 text-xs text-muted-foreground">
                on {formatDate(review.date)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center p-2 rounded-lg bg-muted">
           <Image src={`/food-icons/${review.dish.toLowerCase().replace(/ /g, '-')}.png`} alt={review.dish} width={32} height={32} />
        </div>
      </div>
      <p className="text-sm text-gray-700 mt-3">{review.comment}</p>
      <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
        <span>Dish: <span className="font-medium text-gray-800">{review.dish}</span></span>
        <div className="flex items-center gap-3">
          {review.isNew && <Badge variant="default">New</Badge>}
          {review.isHighlighted && <Badge variant="destructive">Highlighted</Badge>}
          {review.isReplied ? (
            <span className="flex items-center text-green-600">
              <ThumbsUp className="h-3 w-3 mr-1" /> Replied
            </span>
          ) : (
            <span className="flex items-center text-red-600">
              <MessageSquare className="h-3 w-3 mr-1" /> Reply Pending
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3 pt-3 border-t">
        <Button size="sm" variant="ghost">
          <MessageSquare className="h-3 w-3 mr-1" />
          Reply
        </Button>
        <Button size="sm" variant="ghost">
          <Flag className="h-3 w-3 mr-1" />
          Flag
        </Button>
        <Button size="sm" variant="ghost">
          <ThumbsUp className="h-3 w-3 mr-1" />
          Highlight
        </Button>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Customer Feedback</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Recent reviews and ratings from your customers.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {renderStars(ratingSummary.average)}
            </div>
            <span className="font-bold text-lg">{ratingSummary.average.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">({ratingSummary.total} reviews)</span>
          </div>
        </div>
        <div className="flex gap-2 pt-4">
          {Object.entries(ratingSummary.distribution).map(([stars, percentage]) => (
            <div key={stars} className="w-full">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs">{stars} star</span>
                <span className="text-xs text-muted-foreground">{percentage}%</span>
              </div>
              <Progress value={percentage} className="h-1.5" />
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab as (value: string) => void}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="highlighted">Highlighted</TabsTrigger>
            <TabsTrigger value="pending">Pending Reply</TabsTrigger>
          </TabsList>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews[selectedTab].map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}