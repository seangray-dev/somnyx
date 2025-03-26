import { Route } from "next";
import Link from "next/link";

import {
  BookOpenIcon,
  Globe2Icon,
  PencilIcon,
  SparklesIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FeaturesSection() {
  const features = [
    {
      title: "Your Personal Dream Sanctuary",
      description:
        "Start your free dream journal and never lose another meaningful dream. Our prompts guide you to capture every detail while it's still vivid—available instantly on your phone when you wake up.",
      icon: PencilIcon,
    },
    {
      title: "Unlock Your Dream's Hidden Message",
      description:
        "When a dream feels significant, let our AI guide you deeper. Transform your written dreams into personalized insights and stunning visuals that bring your subconscious to life.",
      icon: SparklesIcon,
    },
    {
      title: "Discover Dreamscape",
      description: (
        <>
          Explore an ever-growing collection of anonymous dream stories in our{" "}
          <Link
            href={"/dreamscape" as Route}
            className="underline underline-offset-4 transition-colors duration-150 hover:text-primary"
          >
            Dreamscape
          </Link>
          . Each shared dream adds to our understanding of the collective
          unconscious.
        </>
      ),
      icon: Globe2Icon,
    },
    {
      title: "Explore the Dream Dictionary",
      description: (
        <>
          Dive into our{" "}
          <Link
            href={"/dream-dictionary" as Route}
            className="underline underline-offset-4 transition-colors duration-150 hover:text-primary"
          >
            Dream Dictionary
          </Link>
          , a growing collection of dream symbols and themes. Discover meanings
          that evolve with our shared experiences, backed by AI-powered insights
          from thousands of dreams.
        </>
      ),
      icon: BookOpenIcon,
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                <p className="text-balance text-muted-foreground">
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
