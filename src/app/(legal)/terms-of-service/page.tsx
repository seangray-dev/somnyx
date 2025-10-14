import { Metadata } from "next";

import fs from "fs";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import path from "path";

import { SEO, baseUrl } from "@/config/app";

function getTermsOfService() {
  const filePath = path.join(
    process.cwd(),
    "data/legal",
    "terms-of-services.mdx"
  );
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const { content } = matter(fileContents);
  return content;
}

export default function TermsOfServicePage() {
  const content = getTermsOfService();

  return <MDXRemote source={content} />;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: SEO.legal.termsOfService.title,
    description: SEO.legal.termsOfService.description,
    alternates: {
      canonical: `${baseUrl}/terms-of-service`,
    },
    openGraph: {
      title: SEO.legal.termsOfService.title,
      description: SEO.legal.termsOfService.description,
    },
    twitter: {
      title: SEO.legal.termsOfService.title,
      description: SEO.legal.termsOfService.description,
    },
  };
}
