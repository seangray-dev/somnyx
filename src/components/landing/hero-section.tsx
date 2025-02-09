import { ChevronsDown } from "lucide-react";

import ButtonCTA from "./button-cta";
import DreamScene from "./dream-scene";

export default function HeroSection() {
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
      <div className="pointer-events-none absolute left-1/2 top-[calc(100vh-120px)] -translate-x-1/2">
        <div className="animate-scroll-bounce text-foreground/60">
          <ChevronsDown size={32} strokeWidth={1.5} />
        </div>
      </div>
    </section>
  );
}
