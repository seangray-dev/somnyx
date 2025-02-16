import { Metadata } from "next";

import { SEO } from "@/config/app";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

export const metadata: Metadata = {
  title: SEO.pages.auth.title,
  description: SEO.pages.auth.description,
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: SEO.pages.auth.title,
    description: SEO.pages.auth.description,
  },
  twitter: {
    title: SEO.pages.auth.title,
    description: SEO.pages.auth.description,
  },
};
