import { Route } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAction } from "convex/react";
import { CheckIcon } from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { STRIPE_PRODUCTS } from "@/convex/util";
import { useSession } from "@/lib/client-auth";

import LoadingButton from "../shared/loading-button";
import { Badge } from "../ui/badge";

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

const { insgiht, dreamer, visionary } = STRIPE_PRODUCTS;

const pricingOptions = [
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
    priceId: insgiht.priceId,
    name: "Insight Pack",
    description:
      "Need quick insights? This package offers 700 credits to keep your dreams on track.",
    credits: insgiht.credits,
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

const formatPrice = (price: number | string) => {
  if (price === "Free") return price;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(price));
};

export default function PricingSection() {
  const checkout = useAction(api.stripe.checkout);
  const router = useRouter();
  const { isLoggedIn } = useSession();

  const handleCheckout = async (product: {
    priceId: string;
    credits: number;
  }) => {
    if (product.priceId === "starter") {
      router.push("/sign-up" as Route);
      return;
    }

    if (!isLoggedIn) {
      toast.error("You must be logged in to make a purchase.");
      return;
    }

    const url = await checkout({ product });
    router.push(url as Route);
  };

  function CheckoutButton({
    product,
    label,
  }: {
    product: { priceId: string; credits: number };
    label: string;
  }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
      setIsLoading(true);
      await handleCheckout(product);
      setIsLoading(false);
    };

    return (
      <LoadingButton
        isLoading={isLoading}
        onClick={handleClick}
        className="w-full"
      >
        {label}
      </LoadingButton>
    );
  }

  return (
    <section id="pricing" className="bg-secondary">
      <div className="container flex flex-col gap-14 py-20">
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
            <Card
              key={option.name}
              className="mx-auto flex max-w-[60ch] flex-col"
            >
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
                <CheckoutButton
                  product={{ priceId: option.priceId, credits: option.credits }}
                  label={
                    option.price === "Free"
                      ? "Start Free Trial"
                      : `Buy ${option.credits} credits`
                  }
                />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
