import { BrainCircuitIcon, LineChartIcon, PencilIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FeaturesSection() {
  const features = [
    {
      title: "Capture Dreams Your Way",
      description:
        "Whether you prefer to speak or write, saving your morning dreams is as easy as telling a friend about them. The quicker you capture them, the more you'll remember.",
      icon: PencilIcon,
    },
    {
      title: "Unlock Dream Meanings",
      description:
        "When a dream feels important, let our AI guide you through its hidden message. Use your credits to understand the dreams that matter most to you.",
      icon: BrainCircuitIcon,
    },
    {
      title: "Discover Monthly Insights",
      description:
        "See how your dreams connect at the end of each month. Our AI looks at all your dreams together, showing you patterns and messages you might have missed.",
      icon: LineChartIcon,
    },
  ];

  return (
    <section id="features" className="bg-secondary py-28">
      <div className="container flex flex-col gap-10">
        <div className="mx-auto max-w-[80ch] space-y-4 text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tighter xl:text-4xl/none">
            {" "}
            You Wake Up Knowing Your Dream Meant Something... But What?
          </h2>
          <p className="text-balance text-muted-foreground">
            Your subconscious is speaking to you through dreams, offering
            guidance and insights—but without the right tools, these precious
            messages are lost in translation.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="mx-auto max-w-[60ch] text-center"
            >
              <CardHeader className="flex flex-col items-center justify-center gap-4">
                <div className="flex items-center justify-center">
                  <div className="rounded-full border-l-primary bg-gradient-to-l from-primary/50 to-transparent p-4 dark:border-l-2">
                    <feature.icon size={24} />
                  </div>
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-pretty text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
