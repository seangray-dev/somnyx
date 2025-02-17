import { ChevronsDown } from "lucide-react";

import { Button } from "@/components/ui/button";

import ButtonCTA from "./button-cta";
import DreamScene from "./dream-scene";

export default function HeroSection() {
  const scrollToNextSection = () => {
    const heroHeight = window.innerHeight - 70;
    window.scrollTo({
      top: heroHeight,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative flex min-h-[calc(100vh-70px)] items-center justify-center overflow-hidden">
      <DreamScene />
      <div className="container relative mx-auto max-w-5xl px-4 text-center">
        <div className="space-y-6">
          <h1 className="text-balance bg-gradient-to-b from-foreground to-foreground/80 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl lg:text-6xl xl:text-7xl">
            Never Let Another Dream Slip Away
          </h1>
          <p className="mx-auto max-w-[80ch] text-balance text-lg text-foreground/70 md:text-xl">
            Turn your morning dream fragments into meaningful insights with
            AI-powered interpretation, before those precious moments fade away.
          </p>
          <div className="flex flex-col items-center pt-4">
            <ButtonCTA />
          </div>
        </div>
      </div>
      {/* Scroll Indicator */}
      <div className="absolute top-[calc(100vh-120px)] animate-scroll-bounce">
        <Button
          variant="ghost"
          size="icon"
          className="text-foreground/60 transition-colors hover:text-foreground/80"
          onClick={scrollToNextSection}
        >
          <ChevronsDown size={32} strokeWidth={1.5} />
          <span className="sr-only">Scroll to next section</span>
        </Button>
      </div>
    </section>
  );
}
