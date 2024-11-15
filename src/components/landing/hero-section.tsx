import CTAButton from "./CTA-button";

export default function HeroSection() {
  return (
    <section className="container py-28 lg:py-48">
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <div className="space-y-3">
          <h1 className="text-balance text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl xl:text-6xl/none">
            Never Let Another Dream Slip Away
          </h1>
          <p className="max-w-[80ch] text-balance text-muted-foreground md:text-xl">
            Turn your morning dream fragments into meaningful insights with
            AI-powered interpretation, before those precious moments fade away.
          </p>
        </div>
        <CTAButton />
      </div>
    </section>
  );
}
