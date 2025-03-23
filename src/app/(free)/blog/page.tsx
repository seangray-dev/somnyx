import { Metadata } from "next";

import fs from "fs";
import matter from "gray-matter";
import path from "path";

import { baseUrl } from "@/config/app";
import { BlogPostCard } from "@/features/blog/components/blog-post-card";
import { BlogPost } from "@/features/blog/types";

// Fetch all blog posts from the /data/blog directory
function getAllPosts(): BlogPost[] {
  const postsDirectory = path.join(process.cwd(), "data/blog");
  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames.map((filename) => {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContents);

    return {
      title: data.title || "Untitled Post",
      description: data.description || "No description available.",
      slug: filename.replace(".mdx", ""),
      date: data.date,
    };
  });

  return posts;
}

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <section>
      <div className="bg-secondary py-20 sm:space-y-2">
        <div className="container flex flex-col gap-4 text-center">
          <h1 className="text-3xl font-bold sm:text-5xl">Somnyx Blog</h1>
          <p className="mx-auto max-w-[80ch] text-balance text-muted-foreground">
            Guides, articles, and tips to get the most out of dream journaling.
          </p>
        </div>
      </div>
      <ul className="container flex flex-col gap-4 pt-12 sm:grid sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <BlogPostCard {...post} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { page?: string; category?: string };
}): Promise<Metadata> {
  return {
    alternates: {
      canonical: `${baseUrl}/blog`, // Point filtered/paginated views to main blog page
    },
    robots: {
      index: !searchParams.page && !searchParams.category, // only index main blog page
      follow: true,
    },
  };
}
