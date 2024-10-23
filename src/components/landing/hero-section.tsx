import Link from "next/link";

import { SparklesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="container py-28 lg:py-48">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="font-lora text-balance text-5xl font-bold tracking-tighter xl:text-6xl/none">
            Somnyx
          </h1>
          <div className="text-balance text-muted-foreground md:text-xl">
            Derived from <em>somnus</em> (Latin for <em>sleep</em>) and{" "}
            <em>Nyx</em> (Greek goddess of the <em>night</em>
            ). Somnyx is your elegant space to <em>capture</em> and{" "}
            <em>explore</em> the hidden world of dreams.
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button asChild>
            <Link
              href={{ pathname: "/dashboard" }}
              className="flex items-center gap-2"
            >
              <SparklesIcon size={16} />
              <span>Analyze Your Dreams</span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
