import { SparklesIcon } from "lucide-react";

import { AddDreamButton } from "@/components/shared/add-dream-button";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/client-auth";

export default function ExhaustedList() {
  const { isLoggedIn } = useSession();
  const loggedInMessage =
    "Have a dream to share? Your story could inspire others or help them understand their own dreams better.";
  const loggedOutMessage =
    "Want to contribute to this collection of dreams? Join our community to share your own dream stories.";

  const message = isLoggedIn ? loggedInMessage : loggedOutMessage;

  const cta = isLoggedIn ? (
    <AddDreamButton />
  ) : (
    <Button className="flex items-center gap-2" size={"sm"}>
      <SparklesIcon className="size-4" />
      <span>Join the Community</span>
    </Button>
  );

  return (
    <div className="mx-auto space-y-4 bg-muted py-20 text-center">
      <div className="container space-y-4">
        <h3 className="text-xl font-semibold">
          You&apos;ve reached the end of the dreamscape
        </h3>
        <p className="mx-auto max-w-[80ch] text-pretty text-muted-foreground">
          Every dream shared here contributes to a collective tapestry of human
          experiences. Each story, each vision, adds another thread to our
          understanding of the subconscious mind.
        </p>
        <div className="mx-auto flex max-w-[80ch] flex-col justify-center gap-4">
          <p className="text-sm text-muted-foreground">{message}</p>
          <div className="mx-auto max-w-fit">{cta}</div>
        </div>
      </div>
    </div>
  );
}
