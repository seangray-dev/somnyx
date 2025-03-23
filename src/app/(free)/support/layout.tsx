import { Metadata } from "next";

import { SEO, baseUrl } from "@/config/app";

export default function layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: SEO.pages.support.title,
    description: SEO.pages.support.description,
    alternates: {
      canonical: `${baseUrl}/support`,
    },
    openGraph: {
      title: SEO.pages.support.title,
      description: SEO.pages.support.description,
      url: `${baseUrl}/support`,
    },
    twitter: {
      title: SEO.pages.support.title,
      description: SEO.pages.support.description,
    },
  };
}
