import Link from "next/link";

import { ArrowRightIcon } from "lucide-react";

import { Button } from "../ui/button";

interface FooterCtaSectionProps {
  variant?: "free-tool" | "theme-page";
}

export default function FooterCtaSection({
  variant = "free-tool",
}: FooterCtaSectionProps) {
  const content = {
    "free-tool": {
      description:
        "While our free tool helps you understand individual dreams, our full journal app reveals patterns and connections across your entire dream journey.",
    },
    "theme-page": {
      description:
        "Start journaling your dreams for free. Need deeper insights? Use credits to unlock AI-powered analysis and reveal deeper patterns in your dream journey.",
    },
  };

  const { description } = content[variant];

  return (
    <section id="faq" className="bg-secondary py-28">
      <div className="flex flex-col items-center gap-10">
        <div className="mx-auto max-w-[80ch] space-y-4 text-center">
          <h4 className="text-balance text-3xl font-bold tracking-tighter md:text-4xl">
            Unlock Your Dream's Hidden Meaning in Minutes
          </h4>
          <p className="text-balance text-muted-foreground">{description}</p>
        </div>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg" variant="default">
            <Link href={{ pathname: "/sign-up" }}>
              Start Free Journal <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="border border-muted-foreground transition-all hover:opacity-80"
          >
            <Link href="/#pricing">Pricing</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
