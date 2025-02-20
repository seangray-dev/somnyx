import { Metadata } from "next";
import React from "react";

import { baseUrl, SEO } from "@/config/app";

export default function layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: SEO.pages.dreamDictionary.title,
    description: SEO.pages.dreamDictionary.description,
    openGraph: {
      title: SEO.pages.dreamDictionary.title,
      description: SEO.pages.dreamDictionary.description,
      url: `${baseUrl}/dream-dictionary`,
    },
    twitter: {
      title: SEO.pages.dreamDictionary.title,
      description: SEO.pages.dreamDictionary.description,
    },
  };
}
