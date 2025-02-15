import fs from "fs";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import path from "path";

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
