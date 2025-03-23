import { Metadata } from "next";

import { SEO, applicationName } from "@/config/app";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container py-20">
      <article className="prose mx-auto dark:prose-invert">{children}</article>
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const title = `${SEO.legal.privacyPolicy.title} | ${applicationName}`;

  return {
    title: {
      default: title,
      template: `%s | ${applicationName}`,
    },
    description: SEO.legal.privacyPolicy.description,
    openGraph: {
      title: {
        default: title,
        template: `%s | ${applicationName}`,
      },
      description: SEO.legal.privacyPolicy.description,
    },
    twitter: {
      title: {
        default: title,
        template: `%s | ${applicationName}`,
      },
      description: SEO.legal.privacyPolicy.description,
    },
  };
}
