import { STRIPE_PRODUCTS } from "@/convex/util";

const { insight, dreamer, visionary } = STRIPE_PRODUCTS;

export const allFeatures = [
  "Unlimited Dream Journaling",
  "AI-Powered Dream Titles & Themes",
  "Detailed Dream Analysis",
  "Deep Monthly Insights",
];

export const starterFeatures = [
  "Unlimited Dream Journaling",
  "AI-Powered Dream Titles",
];

export const pricingOptions = [
  {
    priceId: "starter",
    name: "Starter Pack",
    description:
      "New here? No worries! Our free trial gives you 300 credits to get started and explore dream analysis.",
    credits: 300,
    price: "Free",
    basePrice: 0,
    discount: 0,
    features: starterFeatures,
  },
  {
    priceId: insight.priceId,
    name: "Insight Pack",
    description:
      "Need quick insights? This package offers 700 credits to keep your dreams on track.",
    credits: insight.credits,
    price: 2.99,
    basePrice: 2.99,
    discount: 0,
    features: allFeatures,
  },
  {
    priceId: dreamer.priceId,
    name: "Dreamer Pack",
    description:
      "Ready to commit? The Dreamer Pack gives you 3000 credits for consistent tracking.",
    credits: dreamer.credits,
    price: 9.99,
    basePrice: 12.99,
    discount: 23,
    features: allFeatures,
  },
  {
    priceId: visionary.priceId,
    name: "Visionary Pack",
    description:
      "A power user? The Visionary Pack offers 5000 credits for frequent analysis and deep insights.",
    credits: visionary.credits,
    price: 14.99,
    basePrice: 21.99,
    discount: 32,
    features: allFeatures,
  },
];
