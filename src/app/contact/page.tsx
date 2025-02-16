import { Metadata } from "next";

import { SEO } from "@/config/app";
import ContactPage from "@/features/contact/components";

export default function page() {
  return <ContactPage />;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: SEO.pages.contact.title,
    description: SEO.pages.contact.description,
    openGraph: {
      title: SEO.pages.contact.title,
      description: SEO.pages.contact.description,
    },
    twitter: {
      title: SEO.pages.contact.title,
      description: SEO.pages.contact.description,
    },
  };
}
