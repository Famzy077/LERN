export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'weekly' | 'monthly' | 'yearly';
  features: string[];
  isPopular: boolean;
}

export interface CurrentSubscription {
  plan: 'free' | 'pro';
  startedAt: string | null;
  expiresAt: string | null;
  isActive: boolean;
}

export interface SubscribeRequest {
  planId: string;
  paymentMethodId: string;
}
