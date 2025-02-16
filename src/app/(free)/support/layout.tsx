import { Metadata } from "next";

import { SEO } from "@/config/app";

export default function layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: SEO.pages.support.title,
    description: SEO.pages.support.description,
    openGraph: {
      title: SEO.pages.support.title,
      description: SEO.pages.support.description,
    },
    twitter: {
      title: SEO.pages.support.title,
      description: SEO.pages.support.description,
    },
  };
}
