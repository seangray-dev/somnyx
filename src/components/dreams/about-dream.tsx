"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

import AboutDreamCard from "./about-dream-card";

type AboutDreamProps = {
  dream: Preloaded<typeof api.queries.dreams.getDreamById>;
  emotions: Preloaded<typeof api.queries.emotions.getEmotionsByDreamId>;
  role: Preloaded<typeof api.queries.roles.getRoleById>;
  themes: Preloaded<typeof api.queries.themes.getAllThemesToDream>;
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
