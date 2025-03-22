import { Metadata } from "next";

import DreamMeaningFaqSection from "@/components/dream-dictionary/faq-section";
import FooterCtaSection from "@/components/dream-dictionary/footer-cta-section";
import { SEO, baseUrl } from "@/config/app";
import DreamInterpreter from "@/features/free-analysis/components/dream-interpreter";
import { generateJSONLD } from "@/features/free-analysis/util/json-ld";

export default function page() {
  const jsonLd = generateJSONLD();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
              Share your dream with our AI-powered tool and receive an
              insightful interpretation that reveals the hidden meanings,
              symbols, and psychological patterns in your dream experience.
            </p>
          </div>
        </section>
        <section className="container mx-auto flex max-w-3xl flex-col gap-6 pb-28">
          {/* <Analysis /> */}
          <DreamInterpreter />
        </section>

        {/* Top Themes (Static pages generated) - links to dream-meaning/[theme] */}
        <DreamMeaningFaqSection />
        <FooterCtaSection />
      </div>
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  // TODO: OG + Twitter Images
  return {
    title: SEO.pages.interpret.title,
    description: SEO.pages.interpret.description,
    alternates: {
      canonical: `${baseUrl}/free-dream-interpretation`,
    },
    openGraph: {
      title: SEO.pages.interpret.title,
      description: SEO.pages.interpret.description,
      url: `${baseUrl}/free-dream-interpretation`,
    },
    twitter: {
      title: SEO.pages.interpret.title,
      description: SEO.pages.interpret.description,
    },
  };
}
