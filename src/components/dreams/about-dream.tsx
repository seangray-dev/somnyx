"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

import AboutDreamCard from "./about-dream-card";

export default function (props: {
  dream: Preloaded<typeof api.queries.dreams.getDreamById>;
  emotions: Preloaded<typeof api.queries.emotions.getEmotionsByDreamId>;
}) {
  const dream = usePreloadedQuery(props.dream);

  if (!dream) {
    return null;
  }

  const { details, title, date, role, people, places, things, themes } = dream;

  return (
    <div className="flex flex-col">
      <div>
        <AboutDreamCard {...props} />
      </div>
    </div>
  );
}
