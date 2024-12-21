import Chat from "@/components/dream-meaning/chat";
import { default as DreamMeaningFaqSection } from "@/components/dream-meaning/faq-section";
import FooterCtaSection from "@/components/dream-meaning/footer-cta-section";

export default function page() {
  return (
    <div className="pt-28">
      <section className="container space-y-5 text-pretty pb-12 md:text-center">
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Get a free dream interpretation powered by AI analysis.
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl">
            Free Dream Interpretation
          </h1>
        </div>
        <div className="space-y-5">
          <p className="text-lg font-medium">
            No sign up required. 100% free. Instant interpretation.
          </p>
          <p className="max-w-prose text-muted-foreground md:mx-auto">
            Share your dream with our AI-powered tool and receive an insightful
            interpretation that reveals the hidden meanings, symbols, and
            psychological patterns in your dream experience.
          </p>
        </div>
      </section>
      {/* UserInput (Include voice to text input) + Response (Chat like feel - streaming) */}
      <Chat />

      <div></div>
      {/* Top Themes (Static pages generated) - links to dream-meaning/[theme] */}
      <DreamMeaningFaqSection />
      <FooterCtaSection />
    </div>
  );
}
