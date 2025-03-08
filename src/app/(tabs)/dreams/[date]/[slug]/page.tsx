import { Metadata } from "next";
import { notFound } from "next/navigation";

import { auth } from "@clerk/nextjs/server";
import { fetchQuery, preloadQuery } from "convex/nextjs";

import { SEO } from "@/config/app";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import AnalysisCard from "@/features/analysis/components/analysis-card";
import AboutDream from "@/features/dreams/components/dream-card/about-dream";

export default async function DreamPage({
  params,
}: {
  params: { date: string; slug: string };
}) {
  const { userId }: { userId: string | null } = auth();

  const dream = await preloadQuery(api.queries.dreams.getDreamByDateAndSlug, {
    date: params.date,
    slug: params.slug,
    userId: (userId as Id<"users">) ?? undefined,
  });

  // If dream is null, either it doesn't exist or user doesn't have access
  // @ts-ignore - Convex data typing issue with _valueJSON
  if (!dream?._valueJSON) {
    return notFound();
  }

  // @ts-ignore - Convex data typing issue with _valueJSON
  const dreamData = dream._valueJSON as Doc<"dreams">;

  const emotions = await preloadQuery(
    api.queries.emotions.getEmotionsByDreamId,
    {
      id: dreamData._id,
    }
  );

  const role = await preloadQuery(api.queries.roles.getRoleById, {
    id: dreamData.role as Id<"roles">,
  });

  return (
    <div>
      <div className="container flex flex-col gap-12">
        <AboutDream {...{ dream, emotions, role }} />
        <AnalysisCard dreamId={dreamData._id} ownerId={dreamData.userId} />
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { date: string; slug: string };
}): Promise<Metadata> {
  const { userId }: { userId: string | null } = auth();

  const dream = await fetchQuery(api.queries.dreams.getDreamByDateAndSlug, {
    date: params.date,
    slug: params.slug,
    userId: (userId as Id<"users">) ?? undefined,
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
