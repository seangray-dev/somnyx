import { Metadata } from "next";
import React from "react";

import { SEO, applicationName } from "@/config/app";

export default function layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export async function generateMetadata(): Promise<Metadata> {
  // TODO: Images
  return {
    title: {
      default: SEO.pages.dreamDictionary.title,
      template: `%s | ${applicationName}`,
    },
    description: SEO.pages.dreamDictionary.description,
    openGraph: {
      title: SEO.pages.dreamDictionary.title,
      description: SEO.pages.dreamDictionary.description,
    },
    twitter: {
      title: SEO.pages.dreamDictionary.title,
      description: SEO.pages.dreamDictionary.description,
    },
  };
}
