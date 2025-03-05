import { CheckIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { pricingOptions } from "../config/pricing-options";
import { formatPrice } from "../utils";
import CheckoutButton from "./checkout-button";

export default function PricingSection() {
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
