import { CollectionPage, WithContext } from "schema-dts";

import { SEO } from "@/config/app";

export const generateJSONLD = () => {
  const jsonLd: WithContext<CollectionPage> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: SEO.pages.dreamscape.title,
    description: SEO.pages.dreamscape.description,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: {
        "@type": "ListItem",
        name: "Public Dream Collection",
        description:
          "A collection of publicly shared dreams and their interpretations",
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
