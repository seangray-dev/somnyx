/* eslint-disable @next/next/no-img-element */

/* eslint-disable jsx-a11y/alt-text */
// @ts-nocheck
import { ImageResponse } from "next/og";

import { fetchQuery } from "convex/nextjs";

import { api } from "@/convex/_generated/api";

export const runtime = "edge";

export const alt = "Dream Analysis Image";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: { date: string; slug: string };
}) {
  try {
    const dream = await fetchQuery(api.queries.dreams.getDreamByDateAndSlug, {
      date: params.date,
      slug: params.slug,
    });

    if (!dream) {
      return new Response("Dream not found", { status: 404 });
    }

    const analysis = await fetchQuery(
      api.queries.analysis.getAnalysisByDreamId,
      {
        dreamId: dream._id,
      }
    );

    if (!analysis?.imageStorageId) {
      return new Response("Analysis image not found", { status: 404 });
    }

    const imageUrl = await fetchQuery(
      api.queries.analysis.getAnalysisImageUrl,
      {
        storageId: analysis.imageStorageId,
      }
    );

    if (!imageUrl) {
      return new Response("Image not found", { status: 404 });
    }

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={imageUrl}
            alt={`Dream Analysis: ${dream.title}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      ),
      {
        ...size,
      }
    );
  } catch (error) {
    return new Response("Error generating image", { status: 500 });
  }
}
