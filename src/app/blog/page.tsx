import Link from "next/link";

import { formatDate } from "date-fns";
import fs from "fs";
import matter from "gray-matter";
import path from "path";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type BlogPost = {
  title: string;
  description: string;
  slug: string;
  date: string;
};

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
    <section className="container py-6">
      <div className="pb-6 sm:space-y-2">
        <h1 className="text-3xl font-bold sm:text-5xl">Somnyx Blog</h1>
        <p className="text-muted-foreground">Explore our latest blog posts.</p>
      </div>
      <ul className="flex flex-col gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <Card>
              <CardHeader>
                <CardTitle className="text-pretty">{post.title}</CardTitle>
                <CardDescription className="flex flex-col gap-2 text-pretty">
                  <span>{post.description}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(post.date, "MMMM d, yyyy")}
                  </span>
                </CardDescription>
              </CardHeader>

              <CardFooter className="flex flex-col gap-4">
                <Link
                  className="w-full"
                  href={{ pathname: `/blog/${post.slug}` }}
                >
                  <Button variant={"secondary"} size={"sm"} className="w-full">
                    View
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
