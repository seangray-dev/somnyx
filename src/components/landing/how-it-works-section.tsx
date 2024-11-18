import { BookPlus, Download, Stars } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HowItWorksSection() {
import ButtonCTA from "./button-cta";
  const steps = [
    {
      title: "Sign Up",
      description:
        "Get started for free and receive welcome credits to unlock your first dream interpretation.",
      icon: Download,
    },
    {
      title: "Start Your Dream Journal",
      description:
        "Record your first dream tomorrow morning - we'll be ready with gentle prompts to help you remember the details.",
      icon: BookPlus,
    },
    {
      title: "Begin Understanding",
      description:
        "Use your credits to decode dreams that feel significant, and watch as your personal dream story unfolds month by month.",
      icon: Stars,
    },
  ];

  return (
    <section id="how-it-works" className="py-28">
      <div className="container flex flex-col gap-10">
        <div className="mx-auto max-w-[80ch] space-y-4 text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tighter xl:text-4xl/none">
            {" "}
            How It Works
          </h2>
          <p className="text-balance text-muted-foreground">
            Unlock the wisdom in your dreams and transform confusing nighttime
            stories into powerful personal guidance.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <Card
              key={step.title}
              className="mx-auto max-w-[60ch] bg-secondary text-center"
            >
              <CardHeader className="flex flex-col items-center justify-center gap-4">
                <div className="flex items-center justify-center">
                  <div className="rounded-full border-l-primary bg-gradient-to-l from-primary/50 to-transparent p-4 dark:border-l-2">
                    <step.icon size={24} />
                  </div>
                </div>
                <CardTitle>{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-pretty text-muted-foreground">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <ButtonCTA />
      </div>
    </section>
  );
}
