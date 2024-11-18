import Link from "next/link";

import { SparklesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function CtaButton() {
  return (
    <Button asChild>
      <Link
        href={{ pathname: "/dashboard" }}
        className="mx-auto flex w-fit items-center gap-2"
      >
        <SparklesIcon size={16} />
        <span>Start Your Dream Journey</span>
      </Link>
    </Button>
  );
}
