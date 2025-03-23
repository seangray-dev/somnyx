import { MetadataRoute } from "next";

import fs from "fs";
import matter from "gray-matter";
import path from "path";

import { baseUrl } from "@/config/app";

interface BlogPost {
  slug: string;
  date: string;
}

// Fetch all blog posts from the /data/blog directory
function getAllPosts(): BlogPost[] {
  const postsDirectory = path.join(process.cwd(), "data/blog");
  const filenames = fs.readdirSync(postsDirectory);

  return filenames.map((filename) => {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContents);

    return {
      slug: filename.replace(".mdx", ""),
      date: data.date,
    };
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all blog posts
  const blogPosts = getAllPosts();

  // Create sitemap entries for blog posts
  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...blogRoutes];
}
