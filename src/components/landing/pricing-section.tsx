import { CheckIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

const allFeatures = [
  "Unlimited Dream Journaling",
  "AI-Powered Dream Titles & Themes",
  "Detailed Dream Analysis",
  "Deep Monthly Insights",
];

const starterFeatures = [
  "Unlimited Dream Journaling",
  "AI-Powered Dream Titles",
];

const pricingOptions = [
  {
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
    name: "Insight Pack",
    description:
      "Need quick insights? This package offers 700 credits to keep your dreams on track.",
    credits: 700,
    price: 2.99,
    basePrice: 2.99,
    discount: 0,
    features: allFeatures,
  },
  {
    name: "Dreamer Pack",
    description:
      "Ready to commit? The Dreamer Pack gives you 3000 credits for consistent tracking.",
    credits: 3000,
    price: 9.99,
    basePrice: 12.99,
    discount: 23,
    features: allFeatures,
  },
  {
    name: "Visionary Pack",
    description:
      "A power user? The Visionary Pack offers 5000 credits for frequent analysis and deep insights.",
    credits: 5000,
    price: 14.99,
    basePrice: 21.99,
    discount: 32,
    features: allFeatures,
  },
];

const formatPrice = (price: number | string) => {
  if (price === "Free") return price;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(price));
};

export default function PricingSection() {
  return (
    <section className="bg-secondary">
      <div className="container flex flex-col gap-14 py-12">
        <div className="space-y-7 text-center">
          <div className="space-y-2">
            <h3 className="text-3xl font-bold md:text-4xl">Pricing</h3>
            <p className="mx-auto max-w-[80ch] text-balance font-medium text-muted-foreground">
              Somnyx is <strong>free to use</strong> for journaling. Unlock more
              insights with credits—choose a package below to explore deeper.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Badge
              variant={"outline"}
              className="w-fit border-secondary-foreground"
            >
              1 Dream Analysis = 100 Credits
            </Badge>
            <Badge
              variant={"outline"}
              className="w-fit border-secondary-foreground"
            >
              1 Deep Insight = 300 Credits
            </Badge>
          </div>
        </div>
        <div className="flex flex-col gap-8 md:grid md:grid-cols-2 xl:grid-cols-4">
          {pricingOptions.map((option) => (
            <Card key={option.name} className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-bold">{option.name}</CardTitle>
                <CardDescription className="text-pretty font-medium">
                  {option.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col items-start gap-4 font-medium">
                <div className="flex w-full items-center justify-between gap-2">
                  <h6 className="text-4xl font-bold">
                    {option.price === "Free" ? (
                      option.price
                    ) : (
                      <>
                        {formatPrice(option.price)}{" "}
                        <span className="text-sm">USD</span>
                      </>
                    )}
                  </h6>
                  {option.discount > 0 && <Badge>{option.discount}% OFF</Badge>}
                </div>
                <ul>
                  <li className="flex items-center gap-2">
                    <CheckIcon size={16} />
                    {option.credits} credits
                  </li>
                  {option.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-pretty"
                    >
                      <CheckIcon size={16} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button disabled variant="secondary" className="w-full">
                  Coming Soon!
                  {/* {option.price === "Free"
                    ? "Start Free Trial"
                    : `Buy ${option.credits} credits`} */}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
