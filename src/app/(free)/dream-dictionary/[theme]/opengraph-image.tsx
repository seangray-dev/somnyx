/* eslint-disable @next/next/no-img-element */

/* eslint-disable jsx-a11y/alt-text */
// @ts-nocheck
import { ImageResponse } from "next/og";



import { fetchQuery } from "convex/nextjs";



import { api } from "@/convex/_generated/api";


export const runtime = "edge";

export const alt = "Dream Symbol Meaning";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({ params }: { params: { theme: string } }) {
  const theme = await fetchQuery(
    // @ts-ignore
    api.queries.themePages.getThemePageByNamePublic,
    {
      name: params.theme.toLowerCase(),
    }
  );
  const imageUrl = await fetchQuery(
    api.queries.themePages.getThemePageImageUrl,
    {
      storageId: theme?.storageId
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
          alt={`Dream symbol: ${theme.name}`}
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
}