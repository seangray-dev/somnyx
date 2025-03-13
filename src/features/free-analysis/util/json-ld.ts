import { WebPage, WithContext } from "schema-dts";

export const generateJSONLD = () => {
  const jsonLd: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Free Dream Interpretation",
    description:
      "Get a free dream interpretation powered by AI analysis. No sign up required. 100% free. Instant interpretation.",
    mainEntity: {
      "@type": "WebApplication",
      name: "AI Dream Interpreter",
      applicationCategory: "AnalysisTool",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
    },
    isAccessibleForFree: true,
    provider: {
      "@type": "Organization",
      name: "Somnyx",
    },
  };

  return jsonLd;
};
