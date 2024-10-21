import { Metadata } from "next";
import { notFound } from "next/navigation";

import fs from "fs";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import path from "path";

type BlogPageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const postData = getPostData(params.slug);

  return {
    title: postData.title,
    description: postData.description,
    openGraph: {
      title: postData.title,
      description: postData.description,
      url: `/blog/${params.slug}`,
      images: [
        {
          url: `/static/images/${params.slug}.png`,
          width: 800,
          height: 600,
          alt: postData.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: postData.title,
      description: postData.description,
      images: [`/static/images/${params.slug}.png`],
    },
  };
}

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
