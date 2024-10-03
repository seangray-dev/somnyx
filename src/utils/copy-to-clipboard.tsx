import Link from "next/link";

import { toast } from "sonner";

export default function copyToClipboard(url: string) {
  try {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard!", {
      description: (
        <Link
          target="_blank"
          className="hover:underline"
          href={{ pathname: url }}
        >
          {url}
        </Link>
      ),
    });
  } catch (err) {
    toast.error("Failed to copy to clipboard!");
  }
}
