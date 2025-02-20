import { Metadata } from "next";

import fs from "fs";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import path from "path";

import { SEO } from "@/config/app";

function getPrivacyPolicy() {
  const filePath = path.join(process.cwd(), "data/legal", "privacy-policy.mdx");
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const { content } = matter(fileContents);
  return content;
}

export default function PrivacyPolicyPage() {
  const content = getPrivacyPolicy();

  return <MDXRemote source={content} />;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: SEO.legal.privacyPolicy.title,
    description: SEO.legal.privacyPolicy.description,
    openGraph: {
      title: SEO.legal.privacyPolicy.title,
      description: SEO.legal.privacyPolicy.description,
    },
    twitter: {
      title: SEO.legal.privacyPolicy.title,
      description: SEO.legal.privacyPolicy.description,
    },
  };
}
