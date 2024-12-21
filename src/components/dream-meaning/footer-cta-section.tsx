import Link from "next/link";

import { Button } from "../ui/button";

export default function FooterCtaSection() {
  return (
    <section id="faq" className="bg-secondary py-28">
      <div className="flex flex-col items-center gap-10">
        <div className="mx-auto max-w-[80ch] space-y-4 text-center">
          <h4 className="text-balance text-3xl font-bold tracking-tighter md:text-4xl">
            Unlock Your Dream's Hidden Meaning in Minutes
          </h4>
          <p className="text-balance text-muted-foreground">
            While our free tool helps you understand individual dreams, our full
            journal app reveals patterns and connections across your entire
            dream journey.
          </p>
        </div>
        <Button asChild>
          <Link href={{ pathname: "/signup" }}>Start Journaling</Link>
        </Button>
      </div>
    </section>
  );
}
