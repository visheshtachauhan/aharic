export interface LoyaltyTier {
  id: string;
  name: string;
  pointsRequired: number;
  benefits: string[];
  discount: number;
  color: string;
}

export interface LoyaltyMember {
  id: string;
  userId: string;
  restaurantId: string;
  points: number;
  tier: string;
  totalSpent: number;
  joinDate: Date;
  lastVisit: Date;
  visits: number;
  status: 'active' | 'inactive';
}

export interface LoyaltyTransaction {
  id: string;
  memberId: string;
  restaurantId: string;
  type: 'earn' | 'redeem';
  points: number;
  orderId?: string;
  description: string;
  createdAt: Date;
}

export interface LoyaltyReward {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  pointsCost: number;
  type: 'discount' | 'free_item' | 'special_offer';
  value: number;
  isActive: boolean;
  expiryDate?: Date;
  usageLimit?: number;
  timesRedeemed: number;
}

export interface LoyaltySettings {
  restaurantId: string;
  pointsPerCurrency: number;
  minimumPointsToRedeem: number;
  pointsExpiryMonths: number;
  tiers: LoyaltyTier[];
  welcomePoints: number;
  birthdayPoints: number;
  referralPoints: number;
  isActive: boolean;
} 