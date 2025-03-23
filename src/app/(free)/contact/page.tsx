import { Metadata } from "next";

import { SEO, baseUrl } from "@/config/app";
import ContactPage from "@/features/contact/components";
import { generateJSONLD } from "@/features/contact/util/json-ld";

export default function page() {
  const jsonLd = generateJSONLD();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactPage />
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: SEO.pages.contact.title,
    description: SEO.pages.contact.description,
    alternates: {
      canonical: `${baseUrl}/contact`,
    },
    openGraph: {
      // * Use root OG + Twitter Images
      title: SEO.pages.contact.title,
      description: SEO.pages.contact.description,
      url: `${baseUrl}/contact`,
    },
    twitter: {
      title: SEO.pages.contact.title,
      description: SEO.pages.contact.description,
    },
  };
}
