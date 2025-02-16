import { Metadata } from "next";

import { SEO, baseUrl } from "@/config/app";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

export const metadata: Metadata = {
  title: SEO.pages.auth.title,
  description: SEO.default.description,
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: SEO.pages.auth.title,
    description: SEO.default.description,
    url: `${baseUrl}/sign-in`,
  },
  twitter: {
    title: SEO.pages.auth.title,
    description: SEO.default.description,
  },
};
