import { Organization, WebSite, WithContext } from "schema-dts";

import { SEO, applicationName, baseUrl } from "@/config/app";
import { pricingOptions } from "@/features/pricing-payments/config/pricing-options";

export function generatePageJSONLD() {
  const jsonLd: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: baseUrl,
    inLanguage: "en",
    isAccessibleForFree: true,
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    name: applicationName,
    description: SEO.default.description,
    mainEntity: [],
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: 0,
      highPrice: pricingOptions[3].price,
      offerCount: pricingOptions.length,
      offers: pricingOptions.map((option) => ({
        "@type": "Offer",
        name: option.name,
        description: option.description,
        price: option.price === "Free" ? 0 : option.price,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        itemOffered: {
          "@type": "Service",
          name: "Credits",
          description: option.features.join(", "),
        },
      })),
    },
  };

  return jsonLd;
}

export function generateOrganizationJSONLD() {
  const jsonLd: WithContext<Organization> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: applicationName,
    url: baseUrl,
    logo: {
      "@type": "ImageObject",
      url: `${baseUrl}/images/logo.png`,
      width: "72",
      height: "72",
    },
    // TODO: Add social media links
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "somnyxapp@gmail.com",
    },
  };

  return jsonLd;
}
