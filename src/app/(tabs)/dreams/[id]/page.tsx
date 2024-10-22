import { notFound } from "next/navigation";

import { auth } from "@clerk/nextjs/server";
import { preloadQuery } from "convex/nextjs";

import AboutDream from "@/components/dreams/about-dream";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import AnalysisCard from "@/features/analysis/components/analysis-card";

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

  const role = await preloadQuery(api.queries.roles.getRoleById, {
    // @ts-ignore
    id: dream._valueJSON.role as Id<"roles">,
  });

  if (
    // @ts-ignore
    (!dream._valueJSON.isPublic && dream._valueJSON.userId !== userId) ||
    !dream
  ) {
    return notFound();
  }

  return (
    <div>
      <div className="container flex flex-col gap-12">
        <AboutDream {...{ dream, emotions, role }} />
        <AnalysisCard dreamId={params.id} />
      </div>
    </div>
  );
}
