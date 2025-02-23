import { Metadata } from "next";

import { SEO } from "@/config/app";

export async function generateMetadata(): Promise<Metadata> {
  // Here we could fetch any dynamic data needed for the blog section
  // For example: featured post image, latest post count, etc.
  return {
    title: SEO.pages.blog.title,
    description: SEO.pages.blog.description,
    openGraph: {
      type: "article",
      title: SEO.pages.blog.title,
      description: SEO.pages.blog.description,
      url: "/blog",
      images: [
        {
          url: "/images/blog/og-image.jpg", // You'll need to add this image
          width: 1200,
          height: 630,
          alt: "Somnyx Blog",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: SEO.pages.blog.title,
      description: SEO.pages.blog.description,
      images: ["/images/blog/og-image.jpg"], // Same image as OG
    },
  };
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="container prose py-6 dark:prose-invert">
      {children}
    </section>
  );
}
