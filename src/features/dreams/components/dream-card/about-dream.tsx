"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

import AboutDreamCard from "./about-dream-card";

type AboutDreamProps = {
  dream: Preloaded<typeof api.queries.dreams.getDreamByDateAndSlug>;
  emotions: Preloaded<typeof api.queries.emotions.getEmotionsByDreamId>;
  role: Preloaded<typeof api.queries.roles.getRoleById>;
};

export default function AboutDream(props: AboutDreamProps) {
  const dream = usePreloadedQuery(props.dream);

  if (!dream) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <div>
        <AboutDreamCard {...props} />
      </div>
    </div>
  );
}
