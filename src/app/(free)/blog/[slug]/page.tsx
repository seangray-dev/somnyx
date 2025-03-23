import { Metadata } from "next";
import { notFound } from "next/navigation";

import fs from "fs";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import path from "path";

import { SEO, baseUrl } from "@/config/app";

type BlogPageProps = {
  params: {
    slug: string;
  };
};

function getPostData(slug: string) {
  const filePath = path.join(process.cwd(), "data/blog", `${slug}.mdx`);

  // Check if the file exists before reading and redirect to 404 page if the file is missing
  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const mdxContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(mdxContent);

  return {
    title: data.title || "Untitled Post",
    description: data.description || "No description available.",
    content,
    date: data.date,
    author: data.author || "Somnyx Team",
    image: data.image || "/images/blog/default-post.jpg",
    tags: data.tags || [],
  };
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const postData = getPostData(params.slug);
  const title = SEO.templates.blogPost.title.replace("%s", postData.title);
  const description = SEO.templates.blogPost.description.replace(
    "%s",
    postData.description
  );

  const ogImage = {
    url: postData.image,
    width: 1200,
    height: 630,
    alt: postData.title,
  };

  return {
    title,
    description,
    authors: [{ name: postData.author }],
    alternates: {
      canonical: `${baseUrl}/blog/${params.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: postData.date,
      authors: [postData.author],
      tags: postData.tags,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [postData.image],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { content } = getPostData(params.slug);

  return (
    <article className="prose mx-auto dark:prose-invert">
      <MDXRemote source={content} />
    </article>
  );
}
