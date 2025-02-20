import { Metadata } from "next";
import { notFound } from "next/navigation";

import { auth } from "@clerk/nextjs/server";
import { fetchQuery, preloadQuery } from "convex/nextjs";

import AboutDream from "@/components/dreams/about-dream";
import { SEO } from "@/config/app";
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

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const dream = await fetchQuery(api.queries.dreams.getDreamForMetadataById, {
    id: params.id.toString() as Id<"dreams">,
  });

  const title = dream?.title ?? SEO.pages.dreams.title;
  const description =
    dream?.details.slice(0, 155) ?? SEO.pages.dreams.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      title,
      description,
    },
  };
}
