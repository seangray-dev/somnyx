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

  const [dream, emotions, role, themes] = await Promise.all([
    preloadQuery(api.queries.dreams.getDreamById, {
      id: params.id.toString() as Id<"dreams">,
      userId: (userId as Id<"users">) ?? undefined,
    }),
    preloadQuery(api.queries.emotions.getEmotionsByDreamId, {
      id: params.id.toString() as Id<"dreams">,
    }),
    preloadQuery(api.queries.roles.getRoleById, {
      id: params.id.toString() as Id<"roles">,
    }),
    preloadQuery(api.queries.themes.getAllThemesToDream, {
      dreamId: params.id.toString() as Id<"dreams">,
    }),
  ]);

  // Validate if the dream is public or belongs to the current user
  // @ts-ignore
  if (!dream._valueJSON.isPublic && dream._valueJSON.userId !== userId) {
    return notFound();
  }

  const dreamData = { dream, emotions, role, themes };

  return (
    <div className="container">
      <AboutDream {...dreamData} />
    </div>
  );
}
