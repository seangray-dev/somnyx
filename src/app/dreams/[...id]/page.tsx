import { notFound } from "next/navigation";

import { auth } from "@clerk/nextjs/server";
import { preloadQuery } from "convex/nextjs";

import AboutDream from "@/components/dreams/about-dream";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default async function DreamPage({
  params,
}: {
  params: { id: string };
}) {
  const { userId }: { userId: string | null } = auth();

  const dream = await preloadQuery(api.queries.dreams.getDreamById, {
    id: params.id.toString() as Id<"dreams">,
    userId: (userId as Id<"users">) ?? undefined,
  });

  const emotions = await preloadQuery(
    api.queries.emotions.getEmotionsByDreamId,
    {
      id: params.id.toString() as Id<"dreams">,
    }
  );

  // @ts-ignore
  if (!dream._valueJSON.isPublic && dream._valueJSON.userId !== userId) {
    return notFound();
  }

  return (
    <div>
      <div className="container">
        <AboutDream {...{ dream, emotions }} />
        {/* <div>Generated Image</div>
        <div>Analysis</div> */}
      </div>
    </div>
  );
}
